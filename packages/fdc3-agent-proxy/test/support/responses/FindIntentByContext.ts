import { AutomaticResponse, IntentDetail, TestMessaging, intentDetailMatches } from '../TestMessaging';
import { BrowserTypes } from '@kite9/fdc3-schema';

type FindIntentsByContextRequest = BrowserTypes.FindIntentsByContextRequest;
type FindIntentsByContextResponse = BrowserTypes.FindIntentsByContextResponse;

export class FindIntentByContext implements AutomaticResponse {
  filter(t: string) {
    return t == 'findIntentsByContextRequest';
  }

  action(input: object, m: TestMessaging) {
    const intentRequest = input as FindIntentsByContextRequest;
    const payload = intentRequest.payload;
    const context = payload?.context?.type;
    const template: IntentDetail = {
      context,
    };

    const relevant = m.intentDetails.filter(id => intentDetailMatches(id, template, true));
    const request = this.createFindIntentsByContextResponseMessage(intentRequest, relevant);
    setTimeout(() => {
      m.receive(request);
    }, 100);
    return Promise.resolve();
  }

  private createFindIntentsByContextResponseMessage(
    m: FindIntentsByContextRequest,
    relevant: IntentDetail[]
  ): FindIntentsByContextResponse {
    const relevantIntents = [...new Set<string>(relevant.map(r => r.intent!!))];

    return {
      meta: m.meta as any,
      type: 'findIntentsByContextResponse',
      payload: {
        appIntents: relevantIntents.map(i => {
          return {
            intent: { name: i, displayName: i },
            apps: relevant.filter(r => r.intent == i).map(r => r.app!!)!!,
          };
        }),
      },
    };
  }
}
