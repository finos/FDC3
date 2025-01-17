import { AutomaticResponse, TestMessaging } from '../TestMessaging';
import { createResponseMeta } from './support';
import { GetInfoRequest, GetInfoResponse } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';

export class GetInfo implements AutomaticResponse {
  filter(t: string) {
    return t == 'getInfoRequest';
  }

  action(input: object, m: TestMessaging) {
    const out = this.createInfoResponseMessage(input as GetInfoRequest);

    setTimeout(() => {
      m.receive(out);
    }, 100);
    return Promise.resolve();
  }

  private createInfoResponseMessage(m: GetInfoRequest): GetInfoResponse {
    return {
      meta: createResponseMeta(m.meta),
      type: 'getInfoResponse',
      payload: {
        implementationMetadata: {
          appMetadata: {
            appId: 'cucumber-app',
            instanceId: 'cucumber-instance',
          },
          fdc3Version: '2.0',
          optionalFeatures: {
            DesktopAgentBridging: false,
            OriginatingAppMetadata: true,
            UserChannelMembershipAPIs: true,
          },
          provider: 'cucumber-provider',
          providerVersion: 'test',
        },
      },
    };
  }
}
