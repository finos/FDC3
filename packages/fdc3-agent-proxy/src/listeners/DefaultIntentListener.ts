import {
  IntentHandler,
  IntentResult,
  AppIdentifier,
  AppProvidableContextMetadata,
  ContextWithMetadata,
} from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { Messaging } from '../Messaging.js';
import { AbstractListener } from './AbstractListener.js';
import {
  AddIntentListenerRequest,
  IntentEvent,
  IntentResultRequest,
  IntentResultResponse,
  //RaiseIntentResponse,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { v4 } from 'uuid';

export class DefaultIntentListener extends AbstractListener<IntentHandler, AddIntentListenerRequest> {
  constructor(
    messaging: Messaging,
    private readonly intent: string,
    private readonly contextTypes: string[] | undefined,
    action: IntentHandler,
    messageExchangeTimeout: number
  ) {
    super(
      messaging,
      messageExchangeTimeout,
      { intent, contextTypes },
      action,
      'addIntentListenerRequest',
      'addIntentListenerResponse',
      'intentListenerUnsubscribeRequest',
      'intentListenerUnsubscribeResponse'
    );
  }

  filter(m: IntentEvent): boolean {
    return (
      m.type == 'intentEvent' &&
      m.payload.intent == this.intent &&
      (this.contextTypes == null || this.contextTypes.includes(m.payload.context.type))
    );
  }

  action(m: IntentEvent): void {
    const done = this.handler(m.payload.context, {
      source: m.payload.metadata?.source as AppIdentifier,
      timestamp: m.payload.metadata?.timestamp ?? m.meta.timestamp,
      traceId: m.payload.metadata?.traceId ?? v4(),
      signature: m.payload.metadata?.signature,
      custom: m.payload.metadata?.custom,
      antiReplay: m.payload.metadata?.antiReplay,
    });

    this.handleIntentResult(done, m);
  }

  private intentResultRequestMessage(
    ir: IntentResult,
    appMetadata: AppProvidableContextMetadata | undefined,
    m: IntentEvent
  ): IntentResultRequest {
    const out: IntentResultRequest = {
      type: 'intentResultRequest',
      meta: {
        requestUuid: m.meta.eventUuid,
        timestamp: new Date(),
      },
      payload: {
        intentResult: convertIntentResult(ir),
        intentEventUuid: m.meta.eventUuid,
        raiseIntentRequestUuid: m.payload.raiseIntentRequestUuid,
        ...(appMetadata !== undefined && { metadata: appMetadata }),
      }
    };

    return out;
  }

  private handleIntentResult(done: Promise<IntentResult | ContextWithMetadata> | void, m: IntentEvent) {
    if (done == null) {
      return this.messaging.exchange<IntentResultResponse>(
        this.intentResultRequestMessage(undefined, undefined, m),
        'intentResultResponse',
        this.messageExchangeTimeout
      );
    } else {
      return done.then(raw => {
        const { result, appMetadata } = unwrapIntentResult(raw);
        return this.messaging.exchange<IntentResultResponse>(
          this.intentResultRequestMessage(result, appMetadata, m),
          'intentResultResponse',
          this.messageExchangeTimeout
        );
      });
    }
  }
}

function unwrapIntentResult(raw: IntentResult | ContextWithMetadata): {
  result: IntentResult;
  appMetadata: AppProvidableContextMetadata | undefined;
} {
  if (raw && typeof raw === 'object' && 'context' in raw && 'metadata' in raw && !('type' in raw) && !('id' in raw)) {
    // It's a ContextWithMetadata — unwrap it
    const cwm = raw as ContextWithMetadata;
    return { result: cwm.context, appMetadata: cwm.metadata };
  }
  return { result: raw as IntentResult, appMetadata: undefined };
}

function convertIntentResult(intentResult: IntentResult): IntentResultRequest['payload']['intentResult'] {
  if (!intentResult) {
    //consider any falsy result to be void...
    return {}; // void result
  }
  switch (intentResult.type) {
    case 'user':
    case 'app':
    case 'private':
      // it's a channel
      return {
        channel: {
          type: intentResult.type,
          id: intentResult.id as string,
          displayMetadata: intentResult.displayMetadata,
        },
      };
    default:
      // it's a context
      return {
        context: intentResult as Context,
      };
  }
}
