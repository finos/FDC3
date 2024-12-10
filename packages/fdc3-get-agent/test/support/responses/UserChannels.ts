import { TestServerContext } from '../TestServerContext';
import { InstanceID } from '@kite9/fdc3-web-impl';
import { AutomaticResponse } from './AutomaticResponses';
import { BrowserTypes } from '@kite9/fdc3-schema';

type GetUserChannelsRequest = BrowserTypes.GetUserChannelsRequest;
type GetUserChannelsResponse = BrowserTypes.GetUserChannelsResponse;

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
    return {
      meta: {
        ...i.meta,
        responseUuid: m.createUUID(),
      },
      type: 'getUserChannelsResponse',
      payload: {
        userChannels: USER_CHANNELS,
      },
    };
  }
}
