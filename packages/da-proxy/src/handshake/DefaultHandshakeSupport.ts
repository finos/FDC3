import { ConnectionStep2Hello, ConnectionStep3Handshake, ConnectionStep3HandshakePayload } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { Messaging } from "../Messaging";
import { ChannelSupport } from "../channels/ChannelSupport";
import { HandshakeSupport } from "./HandshakeSupport";

/**
 * This will eventually need extending to allow for auth handshaking.
 */
export class DefaultHandshakeSupport implements HandshakeSupport {

    readonly messaging: Messaging
    readonly acceptableFDC3Versions: string[]
    readonly channels: ChannelSupport
    private handshakePayload: ConnectionStep3HandshakePayload | null = null

    constructor(messaging: Messaging, acceptableFDC3Versions: string[], cs: ChannelSupport) {
        this.messaging = messaging
        this.acceptableFDC3Versions = acceptableFDC3Versions
        this.channels = cs
    }

    async connect(): Promise<void> {
        const hello: ConnectionStep2Hello = {
            type: "hello",
            payload: {
                desktopAgentBridgeVersion: "1.0",
                supportedFDC3Versions: this.acceptableFDC3Versions,
                authRequired: false,
            },
            meta: {
                timestamp: new Date()
            }
        }

        const handshake = await this.messaging.exchange<ConnectionStep3Handshake>(hello, "handshake")
        this.channels.mergeChannelState(handshake.payload.channelsState)
        this.handshakePayload = handshake.payload
        return Promise.resolve()
    }

    disconnect(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getHandshakePayload(): ConnectionStep3HandshakePayload | null {
        return this.handshakePayload
    }
}