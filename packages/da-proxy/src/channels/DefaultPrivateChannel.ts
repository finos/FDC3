import { ContextHandler, Listener, PrivateChannel } from "@kite9/fdc3-core";
import { DefaultChannel } from "./DefaultChannel";
import { Messaging } from "../Messaging";
import { PrivateChannelEventListenerType, PrivateChannelEventListenerVoid } from "../listeners/PrivateChannelEventListener";
import { DefaultContextListener } from "../listeners/DefaultContextListener";
import { PrivateChannelDisconnectRequest, PrivateChannelDisconnectResponse } from '@kite9/fdc3-core'

export class DefaultPrivateChannel extends DefaultChannel implements PrivateChannel {

    constructor(messaging: Messaging, id: string) {
        super(messaging, id, "private")
    }

    onAddContextListener(handler: (contextType?: string | undefined) => void): Listener {
        const l = new PrivateChannelEventListenerType(this.messaging, this.id, "onAddContextListener", handler);
        l.register()
        return l;
    }

    onUnsubscribe(handler: (contextType?: string | undefined) => void): Listener {
        const l = new PrivateChannelEventListenerType(this.messaging, this.id, "onUnsubscribe", handler);
        l.register()
        return l;
    }

    onDisconnect(handler: () => void): Listener {
        const l = new PrivateChannelEventListenerVoid(this.messaging, this.id, handler);
        l.register()
        return l;
    }

    async disconnect(): Promise<void> {
        await this.messaging.exchange<PrivateChannelDisconnectResponse>({
            meta: this.messaging.createMeta(),
            payload: {
                channelId: this.id,
            },
            type: "privateChannelDisconnectRequest"
        } as PrivateChannelDisconnectRequest, 'privateChannelDisconnectResponse')
    }

    async addContextListenerInner(contextType: string | null, theHandler: ContextHandler): Promise<Listener> {
        const listener = new DefaultContextListener(this.messaging, this.id, contextType, theHandler);
        await listener.register()
        return listener
    }
}