import { AutomaticResponse, TestMessaging } from '../TestMessaging.js';
import { createResponseMeta } from './support.js';
import {
  PrivateChannelDisconnectRequest,
  PrivateChannelDisconnectResponse,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';

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
