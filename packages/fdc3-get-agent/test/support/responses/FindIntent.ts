import { TestServerContext } from '../TestServerContext';
import { InstanceID } from '@finos/fdc3-web-impl';
import { AutomaticResponse } from './AutomaticResponses';
import { FindIntentRequest, FindIntentResponse } from '@finos/fdc3-schema/generated/api/BrowserTypes';

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
    const response: FindIntentResponse = {
      meta: m.meta as any,
      type: 'findIntentResponse',
      payload: {
        appIntent: {
          intent: { name: m.payload.intent },
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
    };
    return response;
  }
}
