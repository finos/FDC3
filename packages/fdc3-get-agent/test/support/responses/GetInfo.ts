import { TestServerContext } from '../TestServerContext.js';
import { InstanceID } from '@finos/fdc3-web-impl';
import { AutomaticResponse } from './AutomaticResponses.js';
import { GetInfoRequest, GetInfoResponse } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';

export class GetInfo implements AutomaticResponse {
  filter(t: string) {
    return t == 'getInfoRequest';
  }

  action(input: object, m: TestServerContext, from: InstanceID) {
    const out = this.createResponse(input as GetInfoRequest, m);
    setTimeout(() => {
      m.post(out, from);
    }, 100);
    return Promise.resolve();
  }

  private createResponse(i: GetInfoRequest, m: TestServerContext): GetInfoResponse {
    const response: GetInfoResponse = {
      meta: {
        ...i.meta,
        responseUuid: m.createUUID(),
      },
      type: 'getInfoResponse',
      payload: {
        implementationMetadata: {
          appMetadata: i.meta.source!, //{appId: "cucumber-app", instanceId: "cucumber-instance"},
          provider: 'cucumber-provider',
          providerVersion: 'test',
          fdc3Version: '2.0',
          optionalFeatures: {
            DesktopAgentBridging: false,
            OriginatingAppMetadata: false,
            UserChannelMembershipAPIs: false,
          },
        },
      },
    };
    return response;
  }
}
