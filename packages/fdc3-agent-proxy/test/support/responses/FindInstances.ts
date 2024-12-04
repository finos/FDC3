import { AutomaticResponse, TestMessaging } from '../TestMessaging';
import { BrowserTypes } from '@kite9/fdc3-schema';

type FindInstancesRequest = BrowserTypes.FindInstancesRequest;
type FindInstancesResponse = BrowserTypes.FindInstancesResponse;

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
      meta: m.meta as any,
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
