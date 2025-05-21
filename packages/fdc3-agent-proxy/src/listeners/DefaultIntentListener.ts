import { IntentHandler, IntentResult, AppIdentifier } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { Messaging } from '../Messaging';
import { AbstractListener } from './AbstractListener';
import {
  AddIntentListenerRequest,
  IntentEvent,
  IntentResultRequest,
  IntentResultResponse,
  //RaiseIntentResponse,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';
import { v4 } from 'uuid';

export class DefaultIntentListener extends AbstractListener<IntentHandler, AddIntentListenerRequest> {
  readonly intent: string;

  constructor(messaging: Messaging, intent: string, action: IntentHandler, messageExchangeTimeout: number) {
    super(
      messaging,
      messageExchangeTimeout,
      { intent },
      action,
      'addIntentListenerRequest',
      'addIntentListenerResponse',
      'intentListenerUnsubscribeRequest',
      'intentListenerUnsubscribeResponse'
    );
    this.intent = intent;
  }

  filter(m: IntentEvent): boolean {
    return m.type == 'intentEvent' && m.payload.intent == this.intent;
  }

  action(m: IntentEvent): void {
    const done = this.handler(m.payload.context, {
      source: m.payload.originatingApp as AppIdentifier,
      timestamp: m.meta.timestamp,
      traceId: m.metadata?.traceId ?? v4(),
      signature: m.metadata?.signature,
    });

    this.handleIntentResult(done, m);
  }

  private intentResultRequestMessage(ir: IntentResult, m: IntentEvent): IntentResultRequest {
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
      },
      metadata: m.metadata,
    };

    return out;
  }

  private handleIntentResult(done: Promise<IntentResult> | void, m: IntentEvent) {
    if (done == null) {
      // send an empty intent result response
      return this.messaging.exchange<IntentResultResponse>(
        this.intentResultRequestMessage(undefined, m),
        'intentResultResponse',
        this.messageExchangeTimeout
      );
    } else {
      // respond after promise completes
      return done.then(ir => {
        return this.messaging.exchange<IntentResultResponse>(
          this.intentResultRequestMessage(ir, m),
          'intentResultResponse',
          this.messageExchangeTimeout
        );
      });
    }
  }
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
