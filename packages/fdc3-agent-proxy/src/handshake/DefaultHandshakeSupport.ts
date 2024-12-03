import { WebConnectionProtocol6Goodbye } from "@kite9/fdc3-schema/generated/api/BrowserTypes";
import { HeartbeatListener } from "../listeners/HeartbeatListener";
import { Messaging } from "../Messaging";
import { HandshakeSupport } from "./HandshakeSupport";
import { ImplementationMetadata } from "@kite9/fdc3-standard";

/**
 * Handles connection, disconnection and heartbeats for the proxy.
 * This will possibly eventually need extending to allow for auth handshaking.
 */
export class DefaultHandshakeSupport implements HandshakeSupport {

    readonly messaging: Messaging
    private heartbeatListener: HeartbeatListener | null = null

    constructor(messaging: Messaging) {
        this.messaging = messaging
    }

    async connect(): Promise<void> {
        await this.messaging.connect()
        this.heartbeatListener = new HeartbeatListener(this.messaging)
        this.heartbeatListener.register()
    }

    async disconnect(): Promise<void> {
        await this.heartbeatListener?.unsubscribe()
        const message: WebConnectionProtocol6Goodbye = {
            type: 'WCP6Goodbye',
            meta: {
                timestamp: new Date(),
            }
        }
        await this.messaging.post(message)
        return this.messaging.disconnect()
    }

    async getImplementationMetadata(): Promise<ImplementationMetadata> {
        return this.messaging.getImplementationMetadata()
    }

}