import {
  Channel,
  GetUserChannelsRequest,
  GetUserChannelsResponse,
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { AutomaticResponse, TestMessaging } from '../TestMessaging';
import { createResponseMeta } from './support';

export class GetUserChannels implements AutomaticResponse {
  filter(t: string) {
    return t == 'getUserChannelsRequest';
  }

  action(input: object, m: TestMessaging) {
    const out = this.createResponse(input as GetUserChannelsRequest, m);

    setTimeout(() => {
      m.receive(out);
    }, 100);
    return Promise.resolve();
  }

  private createResponse(i: GetUserChannelsRequest, m: TestMessaging): GetUserChannelsResponse {
    const userChannels: Channel[] = Object.keys(m.channelState).map(c => {
      const aChannel: Channel = {
        id: c,
        type: 'user',
        displayMetadata: {
          name: 'The ' + c + ' channel',
          color: 'red',
          glyph: 'triangle',
        },
      };
      return aChannel;
    });

    return {
      meta: createResponseMeta(i.meta),
      type: 'getUserChannelsResponse',
      payload: {
        userChannels,
      },
    };
  }
}
