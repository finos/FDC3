import { AutomaticResponse, TestMessaging } from '../TestMessaging';
import { BrowserTypes } from '@kite9/fdc3-schema';

type WebConnectionProtocol4ValidateAppIdentity = BrowserTypes.WebConnectionProtocol4ValidateAppIdentity;
type WebConnectionProtocol5ValidateAppIdentitySuccessResponse =
  BrowserTypes.WebConnectionProtocol5ValidateAppIdentitySuccessResponse;

export class Handshake implements AutomaticResponse {
  filter(t: string) {
    return t == 'WCP4ValidateAppIdentity';
  }

  action(input: object, m: TestMessaging) {
    const out = this.createResponse(input as WebConnectionProtocol4ValidateAppIdentity);

    setTimeout(() => {
      m.receive(out);
    }, 100);
    return Promise.resolve();
  }

  private createResponse(
    i: WebConnectionProtocol4ValidateAppIdentity
  ): WebConnectionProtocol5ValidateAppIdentitySuccessResponse {
    return {
      meta: {
        connectionAttemptUuid: i.meta.connectionAttemptUuid,
        timestamp: new Date(),
      },
      type: 'WCP5ValidateAppIdentityResponse',
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
        appId: 'cucumber-app',
        instanceId: 'cucumber-instance',
        instanceUuid: 'some-instance-uuid',
      },
    };
  }
}
