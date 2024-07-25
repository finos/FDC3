import { ContextHandler, Listener, PrivateChannel } from "@finos/fdc3";
import { DefaultChannel } from "./DefaultChannel";
import { Messaging } from "../Messaging";
import { PrivateChannelEventListenerType, PrivateChannelEventListenerVoid } from "../listeners/PrivateChannelEventListener";
import { DefaultContextListener } from "../listeners/DefaultContextListener";
import { PrivateChannelDisconnectRequest, PrivateChannelDisconnectResponse } from '@kite9/fdc3-common'

export class DefaultPrivateChannel extends DefaultChannel implements PrivateChannel {

    constructor(messaging: Messaging, id: string) {
        super(messaging, id, "private")
    }

    onAddContextListener(handler: (contextType?: string | undefined) => void): Listener {
        const l = new PrivateChannelEventListenerType(this.messaging, this.id, "onAddContextListener", handler);
        return l;
    }

    onUnsubscribe(handler: (contextType?: string | undefined) => void): Listener {
        const l = new PrivateChannelEventListenerType(this.messaging, this.id, "onUnsubscribe", handler);
        return l;
    }

    onDisconnect(handler: () => void): Listener {
        const l = new PrivateChannelEventListenerVoid(this.messaging, this.id, handler);
        return l;
    }

    async disconnect(): Promise<void> {
        const response = await this.messaging.exchange<PrivateChannelDisconnectResponse>({
            meta: this.messaging.createMeta(),
            payload: {
                channelId: this.id,
            },
            type: "privateChannelDisconnectRequest"
        } as PrivateChannelDisconnectRequest, 'privateChannelDisconnectResponse')

        if (response.payload.error) {
            throw new Error(response.payload.error)
        }
    }

    addContextListenerInner(contextType: string | null, theHandler: ContextHandler): Promise<Listener> {
        const listener = new DefaultContextListener(this.messaging, this.id, contextType, theHandler);
        return Promise.resolve(listener)
    }
}