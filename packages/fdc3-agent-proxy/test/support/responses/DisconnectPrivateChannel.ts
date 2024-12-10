import { AutomaticResponse, TestMessaging } from '../TestMessaging';
import { BrowserTypes } from '@kite9/fdc3-schema';
import { createResponseMeta } from './support';

type PrivateChannelDisconnectRequest = BrowserTypes.PrivateChannelDisconnectRequest;
type PrivateChannelDisconnectResponse = BrowserTypes.PrivateChannelDisconnectResponse;

export class DisconnectPrivateChannel implements AutomaticResponse {
  count: number = 0;

  filter(t: string) {
    return t == 'privateChannelDisconnectRequest';
  }

  action(input: object, m: TestMessaging) {
    const out = this.createResponse(input as PrivateChannelDisconnectRequest);

    setTimeout(() => {
      m.receive(out);
    }, 100);
    return Promise.resolve();
  }

  private createResponse(i: PrivateChannelDisconnectRequest): PrivateChannelDisconnectResponse {
    return {
      meta: createResponseMeta(i.meta),
      type: 'privateChannelDisconnectResponse',
      payload: {},
    };
  }
}
