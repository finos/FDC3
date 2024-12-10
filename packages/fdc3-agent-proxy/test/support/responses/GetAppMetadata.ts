import { AutomaticResponse, TestMessaging } from '../TestMessaging';
import { BrowserTypes } from '@kite9/fdc3-schema';
import { createResponseMeta } from './support';

type GetAppMetadataRequest = BrowserTypes.GetAppMetadataRequest;
type GetAppMetadataResponse = BrowserTypes.GetAppMetadataResponse;

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
