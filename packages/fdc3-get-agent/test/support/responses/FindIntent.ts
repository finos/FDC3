import { TestServerContext } from '../TestServerContext';
import { InstanceID } from '@kite9/fdc3-web-impl';
import { AutomaticResponse } from './AutomaticResponses';
import { BrowserTypes } from '@kite9/fdc3-schema';

type FindIntentRequest = BrowserTypes.FindIntentRequest;
type FindIntentResponse = BrowserTypes.FindIntentResponse;

export class FindIntent implements AutomaticResponse {
  filter(t: string) {
    return t == 'findIntentRequest';
  }

  action(input: object, m: TestServerContext, from: InstanceID) {
    const intentRequest = input as FindIntentRequest;
    const request = this.createFindIntentResponseMessage(intentRequest);
    setTimeout(() => {
      m.post(request, from);
    }, 100);
    return Promise.resolve();
  }

  private createFindIntentResponseMessage(m: FindIntentRequest): FindIntentResponse {
    return {
      meta: m.meta as any,
      type: 'findIntentResponse',
      payload: {
        appIntent: {
          intent: m.payload.intent,
          apps: [
            {
              appId: 'test-app-1',
              name: 'Test App 1',
            },
            {
              appId: 'test-app-2',
              name: 'Test App 2',
            },
          ],
        },
      },
    } as any;
  }
}
