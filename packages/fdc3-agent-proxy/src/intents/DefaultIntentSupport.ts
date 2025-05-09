import {
  AppIntent,
  AppIdentifier,
  ContextMetadata,
  IntentResolution,
  IntentHandler,
  Listener,
  ResolveError,
  IntentResult,
  IntentResolver,
  IntentResolutionChoice,
  AppProvidableContextMetadata,
} from '@finos/fdc3-standard';
import { IntentSupport } from './IntentSupport.js';
import { Messaging } from '../Messaging.js';
import { DefaultIntentResolution } from './DefaultIntentResolution.js';
import { DefaultIntentListener } from '../listeners/DefaultIntentListener.js';
import { DefaultChannel } from '../channels/DefaultChannel.js';
import { DefaultPrivateChannel } from '../channels/DefaultPrivateChannel.js';
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
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { throwIfUndefined } from '../util/throwIfUndefined.js';
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

const extractResultMetadata = ({ payload }: RaiseIntentResultResponse, source: AppIdentifier): ContextMetadata => {
  const rm = payload.resultMetadata;
  return {
    source,
    timestamp: rm?.timestamp ?? new Date(),
    traceId: rm?.traceId ?? '',
    ...(rm?.signature !== undefined && { signature: rm.signature }),
    ...(rm?.custom !== undefined && { custom: rm.custom }),
  };
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

  private createResultPromises(
    request: RaiseIntentRequest | RaiseIntentForContextRequest,
    source: AppIdentifier
  ): { result: Promise<IntentResult>; resultMetadata: Promise<ContextMetadata> } {
    let resolveMetadata!: (m: ContextMetadata) => void;
    const resultMetadata = new Promise<ContextMetadata>(resolve => {
      resolveMetadata = resolve;
    });

    const result = this.messaging
      .waitFor<RaiseIntentResultResponse>(
        m => m.type == 'raiseIntentResultResponse' && m.meta.requestUuid == request.meta.requestUuid
      )
      .then(async rp => {
        resolveMetadata(extractResultMetadata(rp, source));
        return convertIntentResult(rp, this.messaging, this.messageExchangeTimeout);
      });

    return { result, resultMetadata };
  }

  async raiseIntent(
    intent: string,
    context: Context,
    app?: AppIdentifier | null,
    metadata?: AppProvidableContextMetadata
  ): Promise<IntentResolution> {
    const meta = this.messaging.createMeta();
    const request: RaiseIntentRequest = {
      type: 'raiseIntentRequest',
      payload: {
        intent,
        context,
        app: app || undefined,
        metadata: {
          traceId: metadata?.traceId ?? v4(),
          ...(metadata?.signature !== undefined && { signature: metadata.signature }),
          ...(metadata?.custom !== undefined && { custom: metadata.custom }),
        },
      },
      meta,
    };

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
      const choice: IntentResolutionChoice | void = await this.intentResolver.chooseIntent(
        [response.payload.appIntent],
        context
      );
      if (choice) {
        return this.raiseIntent(intent, context, choice.appId, metadata);
      } else {
        throw new Error(ResolveError.UserCancelled);
      }
    } else {
      // Was resolved
      const details = response.payload.intentResolution!;
      const { result: resolvedResult, resultMetadata: resolvedMetadata } = this.createResultPromises(
        request,
        details.source
      );
      return new DefaultIntentResolution(
        this.messaging,
        resolvedResult,
        resolvedMetadata,
        details.source,
        details.intent
      );
    }
  }

  async raiseIntentForContext(
    context: Context,
    app?: AppIdentifier | null,
    metadata?: AppProvidableContextMetadata
  ): Promise<IntentResolution> {
    const meta = this.messaging.createMeta();
    const request: RaiseIntentForContextRequest = {
      type: 'raiseIntentForContextRequest',
      payload: {
        context,
        app: app || undefined,
        metadata: {
          traceId: metadata?.traceId ?? v4(),
          ...(metadata?.signature !== undefined && { signature: metadata.signature }),
          ...(metadata?.custom !== undefined && { custom: metadata.custom }),
        },
      },
      meta,
    };

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
      const choice: IntentResolutionChoice | void = await this.intentResolver.chooseIntent(
        response.payload.appIntents,
        context
      );
      if (choice) {
        return this.raiseIntent(choice.intent, context, choice.appId, metadata);
      } else {
        throw new Error(ResolveError.UserCancelled);
      }
    } else {
      // Was resolved
      const details = response.payload.intentResolution!;
      const { result: resolvedResult, resultMetadata: resolvedMetadata } = this.createResultPromises(
        request,
        details.source
      );
      return new DefaultIntentResolution(
        this.messaging,
        resolvedResult,
        resolvedMetadata,
        details.source,
        details.intent
      );
    }
  }

  async addIntentListener(intent: string, handler: IntentHandler): Promise<Listener> {
    const out = new DefaultIntentListener(this.messaging, intent, undefined, handler, this.messageExchangeTimeout);
    await out.register();
    return out;
  }

  async addIntentListenerWithContext(
    intent: string,
    contextType: string | string[],
    handler: IntentHandler
  ): Promise<Listener> {
    const out = new DefaultIntentListener(
      this.messaging,
      intent,
      Array.isArray(contextType) ? contextType : [contextType],
      handler,
      this.messageExchangeTimeout
    );
    await out.register();
    return out;
  }
}
