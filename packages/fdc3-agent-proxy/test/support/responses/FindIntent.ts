import { AppMetadata } from '@kite9/fdc3-standard';
import { AutomaticResponse, IntentDetail, TestMessaging, intentDetailMatches } from '../TestMessaging';
import {
  AppRequestMessage,
  FindIntentRequest,
  FindIntentResponse,
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { createResponseMeta } from './support';

export class FindIntent implements AutomaticResponse {
  filter(t: string) {
    return t == 'findIntentRequest';
  }

  action(input: AppRequestMessage, m: TestMessaging) {
    const intentRequest = input as FindIntentRequest;
    const payload = intentRequest.payload;
    const intent = payload.intent;
    const context = payload.context?.type;
    const resultType = payload.resultType;
    const template: IntentDetail = {
      intent,
      context,
      resultType,
    };

    const relevant = m.intentDetails.filter(id => intentDetailMatches(id, template, false));
    const response = this.createFindIntentResponseMessage(intentRequest, relevant);
    //TODO: annotate why this timeout is needed
    setTimeout(() => {
      m.receive(response);
    }, 100);
    return Promise.resolve();
  }

  private createFindIntentResponseMessage(m: FindIntentRequest, relevant: IntentDetail[]): FindIntentResponse {
    return {
      meta: createResponseMeta(m.meta),
      type: 'findIntentResponse',
      payload: {
        appIntent: {
          apps: relevant.reduce<AppMetadata[]>((filtered: AppMetadata[], r) => {
            if (r?.app?.appId) {
              filtered.push({
                appId: r.app?.appId,
                instanceId: r.app?.instanceId,
              });
            }
            return filtered;
          }, []),
          intent: {
            displayName: m.payload.intent,
            name: m.payload.intent,
          },
        },
      },
    };
  }
}
