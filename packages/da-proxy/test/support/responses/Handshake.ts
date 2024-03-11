import { ConnectionStep3Handshake } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { AutomaticResponse, TestMessaging } from "../TestMessaging";


export class Handshake implements AutomaticResponse {

    filter(t: string) {
        return t == 'hello'
    }

    action(_input: object, m: TestMessaging) {
        const out = this.createResponse(m)

        setTimeout(() => { m.receive(out) }, 100)
        return Promise.resolve()
    }

    private createResponse(m: TestMessaging): ConnectionStep3Handshake {
        return {
            meta: {
                requestUuid: m.createUUID(),
                timestamp: new Date()
            },
            type: "handshake",
            payload: {
                requestedName: "cucumber-app",
                implementationMetadata: {
                    fdc3Version: "2.0",
                    optionalFeatures: {
                        DesktopAgentBridging: false,
                        OriginatingAppMetadata: true,
                        UserChannelMembershipAPIs: true
                    },
                    provider: "cucumber-provider",
                    providerVersion: "test"
                },
                channelsState: m.channelState

            }
        }
    }
}