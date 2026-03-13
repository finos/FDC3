import { TestServerContext } from '../TestServerContext.js';
import { InstanceID } from '@finos/fdc3-web-impl';
import { AutomaticResponse } from './AutomaticResponses.js';
import { GetUserChannelsRequest, GetUserChannelsResponse } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';

export const USER_CHANNELS = [
  {
    id: 'one',
    type: 'user',
  },
  {
    id: 'two',
    type: 'user',
  },
  {
    id: 'three',
    type: 'user',
  },
] as any;

export class UserChannels implements AutomaticResponse {
  filter(t: string) {
    return t == 'getUserChannelsRequest';
  }

  action(input: object, m: TestServerContext, from: InstanceID) {
    const out = this.createResponse(input as GetUserChannelsRequest, m);

    setTimeout(() => {
      m.post(out, from);
    }, 100);
    return Promise.resolve();
  }

  private createResponse(i: GetUserChannelsRequest, m: TestServerContext): GetUserChannelsResponse {
    const response: GetUserChannelsResponse = {
      meta: {
        ...i.meta,
        responseUuid: m.createUUID(),
      },
      type: 'getUserChannelsResponse',
      payload: {
        userChannels: USER_CHANNELS,
      },
    };
    return response;
  }
}
