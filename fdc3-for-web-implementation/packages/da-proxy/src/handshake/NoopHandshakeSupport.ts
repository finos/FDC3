import { ConnectionStep3HandshakePayload } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { HandshakeSupport } from "./HandshakeSupport";

/**
 * This class can be used when you want to construct a DesktopAgent proxy which 
 * doesn't communicate at all with the server.  This is useful for failover and testing
 * scenarios.  i.e. you can failover to a desktop agent without error, which has no functionality 
 * at all.
 */
export class NoopHandshakeSupport implements HandshakeSupport {

    getHandshakePayload(): ConnectionStep3HandshakePayload | null {
        return {
            channelsState: {},
            implementationMetadata: {
                provider: 'None',
                fdc3Version: '2.0',
                optionalFeatures: {
                    DesktopAgentBridging: false,
                    OriginatingAppMetadata: false,
                    UserChannelMembershipAPIs: false
                }
            },
            requestedName: 'NoDesktopAgent',
        }
    }

    connect(): Promise<void> {
        return Promise.resolve()
    }
    disconnect(): Promise<void> {
        return Promise.resolve()
    }

}