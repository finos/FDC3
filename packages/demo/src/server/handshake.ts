import { ConnectionStep2Hello, ConnectionStep3Handshake } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { SimpleServer } from "./SimpleServer";

/**
 * Handles the hello/handshake part of the initialisation protocol
 */
export function handleHandshake(e: MessageEvent, client: MessagePort, ss: SimpleServer) {
    const hello: ConnectionStep2Hello = e.data
    const handshake: ConnectionStep3Handshake = {
        type:  "handshake",
        payload: {
            authToken: "abc123",
            implementationMetadata: {
            fdc3Version: '2.0',
            provider: 'demo',
            providerVersion: 'demo-1.0',
            optionalFeatures: {
                OriginatingAppMetadata: true,
                UserChannelMembershipAPIs: true,
                DesktopAgentBridging: true
            }
            },
            requestedName: 'demo-da',
            channelsState: this.channelsState
        },
        meta: {
            requestUuid: ss.createUUID(),
            timestamp:  new Date()
        }
    }

    ss.addClient(client, hello, handshake)
    console.log("Responding to hello "+handshake)
    client.postMessage(this.createHandshake(e.data))
}