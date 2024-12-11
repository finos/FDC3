import { AutomaticResponse, TestMessaging } from '../TestMessaging';
import { BrowserTypes } from '@kite9/fdc3-schema';
import { createResponseMeta } from './support';

type GetUserChannelsRequest = BrowserTypes.GetUserChannelsRequest;
type GetUserChannelsResponse = BrowserTypes.GetUserChannelsResponse;
type Channel = BrowserTypes.Channel;

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
      return {
        id: c,
        type: 'user',
        displayMetadata: {
          name: 'The ' + c + ' channel',
          color: 'red',
          glyph: 'triangle',
        },
      } as any;
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
