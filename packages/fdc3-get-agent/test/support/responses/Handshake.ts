import { TestServerContext } from '../TestServerContext';
import { InstanceID } from '@finos/fdc3-web-impl';
import { AutomaticResponse } from './AutomaticResponses';
import {
  WebConnectionProtocol4ValidateAppIdentity,
  WebConnectionProtocol5ValidateAppIdentityFailedResponse,
  WebConnectionProtocol5ValidateAppIdentitySuccessResponse,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';

export const BAD_INSTANCE_ID = 'BAD_INSTANCE';
export const EXPECTED_IDENTITY_URL = 'https://dummyOrigin.test/path';
export const ALTERNATIVE_IDENTITY_URL = 'https://dummyOrigin.test/alternativePath';

export class Handshake implements AutomaticResponse {
  timeOut: boolean;

  constructor(timeOut: boolean = false) {
    this.timeOut = timeOut;
  }

  filter(t: string) {
    return t == 'WCP4ValidateAppIdentity';
  }

  action(input: object, m: TestServerContext, from: InstanceID) {
    if (!this.timeOut) {
      const out = this.createResponse(input as WebConnectionProtocol4ValidateAppIdentity);
      setTimeout(() => {
        m.post(out, from);
      }, 100);
    } else {
      console.debug('Forcing timeout of identity validation');
    }
    return Promise.resolve();
  }

  private createResponse(
    i: WebConnectionProtocol4ValidateAppIdentity
  ):
    | WebConnectionProtocol5ValidateAppIdentitySuccessResponse
    | WebConnectionProtocol5ValidateAppIdentityFailedResponse {
    const identityURL = i.payload.identityUrl;
    if (i.payload.instanceUuid == BAD_INSTANCE_ID) {
      const msg: WebConnectionProtocol5ValidateAppIdentityFailedResponse = {
        meta: {
          connectionAttemptUuid: i.meta.connectionAttemptUuid,
          timestamp: new Date(),
        },
        type: 'WCP5ValidateAppIdentityFailedResponse',
        payload: {
          message: 'Invalid instance',
        },
      };
      return msg;
    } else if (identityURL == EXPECTED_IDENTITY_URL || identityURL == ALTERNATIVE_IDENTITY_URL) {
      let appId = 'cucumber-app';
      let instanceId = 'cucumber-instance';
      let instanceUuid = 'some-instance-uuid';

      if (identityURL == ALTERNATIVE_IDENTITY_URL) {
        appId = 'cucumber-alternative-app';
        instanceId = 'cucumber-alternative-instance';
        instanceUuid = 'some-alternative-instance-uuid';
      }

      const msg: WebConnectionProtocol5ValidateAppIdentitySuccessResponse = {
        meta: {
          connectionAttemptUuid: i.meta.connectionAttemptUuid,
          timestamp: new Date(),
        },
        type: 'WCP5ValidateAppIdentityResponse',
        payload: {
          implementationMetadata: {
            appMetadata: {
              appId: appId,
              instanceId: instanceId,
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
          appId: appId,
          instanceId: instanceId,
          instanceUuid: instanceUuid,
        },
      };
      return msg;
    } else {
      const msg: WebConnectionProtocol5ValidateAppIdentityFailedResponse = {
        meta: {
          connectionAttemptUuid: i.meta.connectionAttemptUuid,
          timestamp: new Date(),
        },
        type: 'WCP5ValidateAppIdentityFailedResponse',
        payload: {
          message: 'Unknown identity URL',
        },
      };
      return msg;
    }
  }
}
