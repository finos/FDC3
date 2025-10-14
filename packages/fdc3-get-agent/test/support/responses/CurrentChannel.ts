import { TestServerContext } from '../TestServerContext.js';
import { InstanceID } from '@finos/fdc3-web-impl';
import { AutomaticResponse } from './AutomaticResponses.js';
import {
  GetCurrentChannelRequest,
  GetCurrentChannelResponse,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';

export class CurrentChannel implements AutomaticResponse {
  filter(t: string) {
    return t == 'getCurrentChannelRequest';
  }

  action(input: object, m: TestServerContext, from: InstanceID) {
    const out = this.createResponse(input as GetCurrentChannelRequest, m);
    setTimeout(() => {
      m.post(out, from);
    }, 100);
    return Promise.resolve();
  }

  private createResponse(i: GetCurrentChannelRequest, m: TestServerContext): GetCurrentChannelResponse {
    const response: GetCurrentChannelResponse = {
      meta: {
        ...i.meta,
        responseUuid: m.createUUID(),
      },
      type: 'getCurrentChannelResponse',
      payload: {
        channel: {
          id: 'one',
          type: 'user',
        },
      },
    };
    return response;
  }
}
