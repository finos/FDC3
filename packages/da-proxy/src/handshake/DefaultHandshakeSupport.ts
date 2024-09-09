import { Messaging } from "../Messaging";
import { HandshakeSupport } from "./HandshakeSupport";
import { ImplementationMetadata } from "@kite9/fdc3";

/**
 * This will possibly eventually need extending to allow for auth handshaking.
 */
export class DefaultHandshakeSupport implements HandshakeSupport {

    readonly messaging: Messaging

    constructor(messaging: Messaging) {
        this.messaging = messaging
    }

    async connect(): Promise<void> {
        return this.messaging.connect()
    }

    async disconnect(): Promise<void> {
        return this.messaging.disconnect()
    }

    async getImplementationMetadata(): Promise<ImplementationMetadata> {
        return this.messaging.getImplementationMetadata()
    }

}