import { WebConnectionProtocol6Goodbye } from "@kite9/fdc3-schema/generated/api/BrowserTypes";
import { HeartbeatListener } from "../listeners/HeartbeatListener";
import { Messaging } from "../Messaging";
import { HeartbeatSupport } from "./HeartbeatSupport";

/**
 * Handles disconnection and heartbeats for the proxy.
 */
export class DefaultHeartbeatSupport implements HeartbeatSupport {

    readonly messaging: Messaging;
    private heartbeatListener: HeartbeatListener | null = null;

    constructor(messaging: Messaging) {
        this.messaging = messaging;
    }

    async connect(): Promise<void> {
        this.heartbeatListener = new HeartbeatListener(this.messaging);
        this.heartbeatListener.register();
    }

    async disconnect(): Promise<void> {
        await this.heartbeatListener?.unsubscribe();
        await this.messaging.post({
            type: 'WCP6Goodbye',
            meta: {
                timestamp: new Date(),
            }
        } as WebConnectionProtocol6Goodbye);
        return this.messaging.disconnect();
    }

}