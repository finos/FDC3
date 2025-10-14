import { FindInstancesRequest, FindInstancesResponse } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { AutomaticResponse, TestMessaging } from '../TestMessaging.js';
import { createResponseMeta } from './support.js';

export class FindInstances implements AutomaticResponse {
  filter(t: string) {
    return t == 'findInstancesRequest';
  }

  action(input: object, m: TestMessaging) {
    const out = this.createFindInstancesResponse(input as FindInstancesRequest);

    setTimeout(() => {
      m.receive(out);
    }, 100);
    return Promise.resolve();
  }

  private createFindInstancesResponse(m: FindInstancesRequest): FindInstancesResponse {
    return {
      meta: createResponseMeta(m.meta),
      type: 'findInstancesResponse',
      payload: {
        appIdentifiers: [
          { appId: 'One', instanceId: '1' },
          { appId: 'Two', instanceId: '2' },
          { appId: 'Three', instanceId: '3' },
        ],
      },
    };
  }
}
