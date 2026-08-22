import {
  UpdateInstanceMetadataRequest,
  UpdateInstanceMetadataResponse,
} from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { AutomaticResponse, TestMessaging } from '../TestMessaging.js';
import { createResponseMeta } from './support.js';

export class UpdateInstanceMetadata implements AutomaticResponse {
  filter(t: string) {
    return t == 'updateInstanceMetadataRequest';
  }

  action(input: object, m: TestMessaging) {
    const out = this.createResponseMessage(input as UpdateInstanceMetadataRequest);

    setTimeout(() => {
      m.receive(out);
    }, 100);
    return Promise.resolve();
  }

  private createResponseMessage(m: UpdateInstanceMetadataRequest): UpdateInstanceMetadataResponse {
    return {
      meta: createResponseMeta(m.meta),
      type: 'updateInstanceMetadataResponse',
      payload: {},
    };
  }
}
