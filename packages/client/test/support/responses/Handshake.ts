import { AutomaticResponse, TestMessaging } from "../TestMessaging";
import { WebConnectionProtocol4ValidateAppIdentity, WebConnectionProtocol5ValidateAppIdentitySuccessResponse } from "@kite9/fdc3-common";

export class Handshake implements AutomaticResponse {

    filter(t: string) {
        return t == 'WCP4ValidateAppIdentity'
    }

    action(input: object, m: TestMessaging) {
        const out = this.createResponse(input as WebConnectionProtocol4ValidateAppIdentity)

        setTimeout(() => { m.receive(out) }, 100)
        return Promise.resolve()
    }

    private createResponse(i: WebConnectionProtocol4ValidateAppIdentity): WebConnectionProtocol5ValidateAppIdentitySuccessResponse {
        return {
            meta: {
                connectionAttemptUuid: i.meta.connectionAttemptUuid,
                timestamp: new Date(),
            },
            type: "WCP5ValidateAppIdentityResponse",
            payload: {
                implementationMetadata: {
                    appMetadata: {
                        appId: "cucumber-app",
                        instanceId: "cucumber-instance",
                    },
                    fdc3Version: "2.0",
                    optionalFeatures: {
                        DesktopAgentBridging: false,
                        OriginatingAppMetadata: true,
                        UserChannelMembershipAPIs: true
                    },
                    provider: "cucumber-provider",
                    providerVersion: "test"
                },
                appId: 'cucumber-app',
                instanceId: 'cucumber-instance',
                instanceUuid: 'some-instance-uuid',
            }
        }
    }
} import { TestServerContext } from "../TestServerContext";
import { InstanceID } from "@kite9/da-server";
import { AutomaticResponse } from "./AutomaticResponses";

import { WebConnectionProtocol4ValidateAppIdentity, WebConnectionProtocol5ValidateAppIdentityFailedResponse, WebConnectionProtocol5ValidateAppIdentitySuccessResponse } from "@kite9/fdc3-common";

export const BAD_INSTANCE_ID = "BAD_INSTANCE"

export class Handshake implements AutomaticResponse {

    filter(t: string) {
        return t == 'WCP4ValidateAppIdentity'
    }

    action(input: object, m: TestServerContext, from: InstanceID) {
        const out = this.createResponse(input as WebConnectionProtocol4ValidateAppIdentity)

        setTimeout(() => { m.post(out, from) }, 100)
        return Promise.resolve()
    }

    private createResponse(i: WebConnectionProtocol4ValidateAppIdentity):
        WebConnectionProtocol5ValidateAppIdentitySuccessResponse |
        WebConnectionProtocol5ValidateAppIdentityFailedResponse {
        if (i.payload.instanceUuid == BAD_INSTANCE_ID) {
            return {
                meta: {
                    connectionAttemptUuid: i.meta.connectionAttemptUuid,
                    timestamp: new Date(),
                },
                type: "WCP5ValidateAppIdentityFailedResponse",
                payload: {
                    message: "Invalid instance"
                }
            }
        } else {
            return {
                meta: {
                    connectionAttemptUuid: i.meta.connectionAttemptUuid,
                    timestamp: new Date(),
                },
                type: "WCP5ValidateAppIdentityResponse",
                payload: {
                    implementationMetadata: {
                        appMetadata: {
                            appId: "cucumber-app",
                            instanceId: "cucumber-instance",
                        },
                        fdc3Version: "2.0",
                        optionalFeatures: {
                            DesktopAgentBridging: false,
                            OriginatingAppMetadata: true,
                            UserChannelMembershipAPIs: true
                        },
                        provider: "cucumber-provider",
                        providerVersion: "test"
                    },
                    appId: 'cucumber-app',
                    instanceId: 'cucumber-instance',
                    instanceUuid: 'some-instance-uuid',
                }
            }
        }
    }
}