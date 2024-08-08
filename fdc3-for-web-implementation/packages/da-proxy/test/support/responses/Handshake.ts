import { AutomaticResponse, TestMessaging } from "../TestMessaging";
import { GetInfoResponse, GetInfoRequest } from "@kite9/fdc3-common";
import { createResponseMeta } from "./support";

export class Handshake implements AutomaticResponse {

    filter(t: string) {
        return t == 'getInfoRequest'
    }

    action(input: object, m: TestMessaging) {
        const out = this.createResponse(input as GetInfoRequest)

        setTimeout(() => { m.receive(out) }, 100)
        return Promise.resolve()
    }

    private createResponse(i: GetInfoRequest): GetInfoResponse {
        return {
            meta: createResponseMeta(i.meta),
            type: "getInfoResponse",
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
                }
            }
        }
    }
}