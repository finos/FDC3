import {
  FindIntentsByContextRequest,
  FindIntentsByContextResponse,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { AutomaticResponse, IntentDetail, TestMessaging, intentDetailMatches } from '../TestMessaging.js';
import { createResponseMeta } from './support.js';

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
    //get unique intent names
    const relevantIntents = [
      ...new Set<string>(
        relevant.reduce<string[]>((filtered: string[], r) => {
          if (r.intent) {
            filtered.push(r.intent);
          }
          return filtered;
        }, [])
      ),
    ];

    return {
      meta: createResponseMeta(m.meta),
      type: 'findIntentsByContextResponse',
      payload: {
        appIntents: relevantIntents.map(i => {
          return {
            intent: { name: i, displayName: i },
            apps: relevant.filter(r => r.intent === i && r.app).map(r => r.app!),
          };
        }),
      },
    };
  }
}
