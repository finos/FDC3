import { GetAppMetadataRequest, GetAppMetadataResponse } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';
import { AutomaticResponse, TestMessaging } from '../TestMessaging';
import { createResponseMeta } from './support';

export class GetAppMetadata implements AutomaticResponse {
  filter(t: string) {
    return t == 'getAppMetadataRequest';
  }

  action(input: object, m: TestMessaging) {
    const out = this.createMetadataResponseMessage(input as GetAppMetadataRequest);

    setTimeout(() => {
      m.receive(out);
    }, 100);
    return Promise.resolve();
  }

  private createMetadataResponseMessage(m: GetAppMetadataRequest): GetAppMetadataResponse {
    return {
      meta: createResponseMeta(m.meta),
      type: 'getAppMetadataResponse',
      payload: {
        appMetadata: {
          appId: m.payload.app.appId,
          name: 'Metadata Name',
          description: 'Metadata Description',
        },
      },
    };
  }
}
