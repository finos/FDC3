import {
  AppIntent,
  AppIdentifier,
  IntentResolution,
  IntentHandler,
  Listener,
  ResolveError,
  IntentResult,
  IntentResolver,
  IntentResolutionChoice,
  AppProvidableContextMetadata,
} from '@finos/fdc3-standard';
import { IntentSupport } from './IntentSupport';
import { Messaging } from '../Messaging';
import { DefaultIntentResolution } from './DefaultIntentResolution';
import { DefaultIntentListener } from '../listeners/DefaultIntentListener';
import { DefaultChannel } from '../channels/DefaultChannel';
import { DefaultPrivateChannel } from '../channels/DefaultPrivateChannel';
import { Context } from '@finos/fdc3-context';
import {
  FindIntentRequest,
  FindIntentResponse,
  FindIntentsByContextRequest,
  FindIntentsByContextResponse,
  RaiseIntentForContextRequest,
  RaiseIntentForContextResponse,
  RaiseIntentRequest,
  RaiseIntentResponse,
  RaiseIntentResultResponse,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';
import { throwIfUndefined } from '../util/throwIfUndefined';
import { v4 } from 'uuid';

const convertIntentResult = async (
  { payload }: RaiseIntentResultResponse,
  messaging: Messaging,
  messageExchangeTimeout: number
): Promise<IntentResult> => {
  const result = payload.intentResult;
  if (result?.channel) {
    const { channel } = result;
    switch (channel.type) {
      case 'private': {
        return new DefaultPrivateChannel(messaging, messageExchangeTimeout, channel.id);
      }
      case 'app':
      case 'user':
      default: {
        return new DefaultChannel(messaging, messageExchangeTimeout, channel.id, channel.type, channel.displayMetadata);
      }
    }
  } else if (result?.context) {
    return result.context;
  } else {
    return;
  }
};

export class DefaultIntentSupport implements IntentSupport {
  readonly messaging: Messaging;
  readonly intentResolver: IntentResolver;
  readonly messageExchangeTimeout: number;
  readonly appLaunchTimeout: number;

  constructor(
    messaging: Messaging,
    intentResolver: IntentResolver,
    messageExchangeTimeout: number,
    appLaunchTimeout: number
  ) {
    this.messaging = messaging;
    this.intentResolver = intentResolver;
    this.messageExchangeTimeout = messageExchangeTimeout;
    this.appLaunchTimeout = appLaunchTimeout;
  }

  async findIntent(intent: string, context: Context, resultType: string | undefined): Promise<AppIntent> {
    const request: FindIntentRequest = {
      type: 'findIntentRequest',
      payload: {
        intent,
        context,
        resultType,
      },
      meta: this.messaging.createMeta(),
    };

    const result = await this.messaging.exchange<FindIntentResponse>(
      request,
      'findIntentResponse',
      this.messageExchangeTimeout
    );
    const appIntent = result.payload.appIntent!;
    if (appIntent.apps.length == 0) {
      throw new Error(ResolveError.NoAppsFound);
    } else {
      return {
        intent: appIntent.intent,
        apps: appIntent.apps,
      };
    }
  }

  async findIntentsByContext(context: Context): Promise<AppIntent[]> {
    const request: FindIntentsByContextRequest = {
      type: 'findIntentsByContextRequest',
      payload: {
        context,
      },
      meta: this.messaging.createMeta(),
    };

    const result: FindIntentsByContextResponse = await this.messaging.exchange(
      request,
      'findIntentsByContextResponse',
      this.messageExchangeTimeout
    );
    const appIntents = result.payload.appIntents;
    if (!appIntents || appIntents.length == 0) {
      throw new Error(ResolveError.NoAppsFound);
    } else {
      return appIntents;
    }
  }

  private async createResultPromise(request: RaiseIntentRequest | RaiseIntentForContextRequest): Promise<IntentResult> {
    const rp = await this.messaging.waitFor<RaiseIntentResultResponse>(
      m => m.type == 'raiseIntentResultResponse' && m.meta.requestUuid == request.meta.requestUuid
    );

    const ir = await convertIntentResult(rp, this.messaging, this.messageExchangeTimeout);
    return ir;
  }

  async raiseIntent(
    intent: string,
    context: Context,
    app: AppIdentifier,
    metadata?: AppProvidableContextMetadata
  ): Promise<IntentResolution> {
    const meta = this.messaging.createMeta();
    const request: RaiseIntentRequest = {
      type: 'raiseIntentRequest',
      payload: {
        intent,
        context,
        app,
        metadata: {
          traceId: metadata?.traceId ?? v4(),
        },
      },
      meta,
    };

    const resultPromise = this.createResultPromise(request);
    const response = await this.messaging.exchange<RaiseIntentResponse>(
      request,
      'raiseIntentResponse',
      this.appLaunchTimeout
    );

    throwIfUndefined(
      response.payload.appIntent ?? response.payload.intentResolution,
      'Invalid response from Desktop Agent to raiseIntent, either payload.appIntent or payload.intentResolution must be set!',
      response,
      ResolveError.NoAppsFound
    );

    if (response.payload.appIntent) {
      // Needs further resolution, we need to invoke the resolver
      const result: IntentResolutionChoice | void = await this.intentResolver.chooseIntent(
        [response.payload.appIntent],
        context
      );
      if (result) {
        return this.raiseIntent(intent, context, result.appId, metadata);
      } else {
        throw new Error(ResolveError.UserCancelled);
      }
    } else {
      // Was resolved
      const details = response.payload.intentResolution!;
      return new DefaultIntentResolution(this.messaging, resultPromise, details.source, details.intent);
    }
  }

  async raiseIntentForContext(
    context: Context,
    app?: AppIdentifier,
    metadata?: AppProvidableContextMetadata
  ): Promise<IntentResolution> {
    const meta = this.messaging.createMeta();
    const request: RaiseIntentForContextRequest = {
      type: 'raiseIntentForContextRequest',
      payload: {
        context,
        app,
      },
      metadata: {
        traceId: metadata?.traceId ?? v4(),
      },
      meta,
    };

    const resultPromise = this.createResultPromise(request);
    const response = await this.messaging.exchange<RaiseIntentForContextResponse>(
      request,
      'raiseIntentForContextResponse',
      this.appLaunchTimeout
    );

    throwIfUndefined(
      response.payload.appIntents ?? response.payload.intentResolution,
      'Invalid response from Desktop Agent to raiseIntentForContext, either payload.appIntents or payload.intentResolution must be set!',
      response,
      ResolveError.NoAppsFound
    );

    if (response.payload.appIntents) {
      // Needs further resolution, we need to invoke the resolver
      const result: IntentResolutionChoice | void = await this.intentResolver.chooseIntent(
        response.payload.appIntents,
        context
      );
      if (result) {
        return this.raiseIntent(result.intent, context, result.appId);
      } else {
        throw new Error(ResolveError.UserCancelled);
      }
    } else {
      // Was resolved
      const details = response.payload.intentResolution!;
      return new DefaultIntentResolution(this.messaging, resultPromise, details.source, details.intent);
    }
  }

  async addIntentListener(intent: string, handler: IntentHandler): Promise<Listener> {
    const out = new DefaultIntentListener(this.messaging, intent, handler, this.messageExchangeTimeout);
    await out.register();
    return out;
  }
}
