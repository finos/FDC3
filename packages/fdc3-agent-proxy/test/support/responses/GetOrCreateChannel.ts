import { AutomaticResponse, TestMessaging } from '../TestMessaging';
import { ChannelError } from '@finos/fdc3-standard';
import { createResponseMeta } from './support';
import {
  AppRequestMessage,
  GetOrCreateChannelRequest,
  GetOrCreateChannelResponse,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';

type ChannelType = { [channelId: string]: 'user' | 'app' | 'private' };

export class GetOrCreateChannel implements AutomaticResponse {
  private type: ChannelType = {};

  filter(t: string) {
    return t == 'getOrCreateChannelRequest';
  }

  action(input: AppRequestMessage, m: TestMessaging) {
    const out = this.registerChannel(input as GetOrCreateChannelRequest);

    setTimeout(() => {
      m.receive(out);
    }, 100);
    return Promise.resolve();
  }

  registerChannel(r: GetOrCreateChannelRequest): GetOrCreateChannelResponse {
    const id = r.payload.channelId;
    const type = 'app';

    const existingType = this.type[id];

    if (existingType && existingType != type) {
      // channel already exists
      return {
        type: 'getOrCreateChannelResponse',
        meta: createResponseMeta(r.meta),
        payload: {
          error: ChannelError.AccessDenied,
        },
      };
    } else {
      this.type[id] = type;
      return {
        type: 'getOrCreateChannelResponse',
        meta: createResponseMeta(r.meta),
        payload: {
          channel: {
            id,
            type,
            displayMetadata: {
              name: 'The ' + id + ' Channel',
              color: 'cerulean blue',
              glyph: 'triangle',
            },
          },
        },
      };
    }
  }
}
