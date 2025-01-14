import {
  CreatePrivateChannelRequest,
  CreatePrivateChannelResponse,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';
import { AutomaticResponse, TestMessaging } from '../TestMessaging';
import { createResponseMeta } from './support';
import { v4 as uuidv4 } from 'uuid';

export class CreatePrivateChannel implements AutomaticResponse {
  count: number = 0;

  filter(t: string) {
    return t == 'createPrivateChannelRequest';
  }

  action(input: object, m: TestMessaging) {
    const out = this.createResponse(input as CreatePrivateChannelRequest);

    setTimeout(() => {
      m.receive(out);
    }, 100);
    return Promise.resolve();
  }

  private createResponse(i: CreatePrivateChannelRequest): CreatePrivateChannelResponse {
    return {
      meta: createResponseMeta(i.meta),
      type: 'createPrivateChannelResponse',
      payload: {
        privateChannel: {
          id: uuidv4(),
          type: 'private',
          displayMetadata: {
            name: 'Private Channel' + this.count++,
            color: 'blue',
            glyph: 'circle',
          },
        },
      },
    };
  }
}
