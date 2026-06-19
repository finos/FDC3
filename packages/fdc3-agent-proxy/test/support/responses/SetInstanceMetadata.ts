import {
  SetInstanceMetadataRequest,
  SetInstanceMetadataResponse,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { AutomaticResponse, TestMessaging } from '../TestMessaging.js';
import { createResponseMeta } from './support.js';

export class SetInstanceMetadata implements AutomaticResponse {
  filter(t: string) {
    return t == 'setInstanceMetadataRequest';
  }

  action(input: object, m: TestMessaging) {
    const out = this.createResponseMessage(input as SetInstanceMetadataRequest);

    setTimeout(() => {
      m.receive(out);
    }, 100);
    return Promise.resolve();
  }

  private createResponseMessage(m: SetInstanceMetadataRequest): SetInstanceMetadataResponse {
    return {
      meta: createResponseMeta(m.meta),
      type: 'setInstanceMetadataResponse',
      payload: {},
    };
  }
}
