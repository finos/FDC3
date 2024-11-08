import { ApiEvent, ContextHandler, EventHandler, Listener, PrivateChannel, PrivateChannelEventTypes } from "@kite9/fdc3-standard";
import { BrowserTypes } from "@kite9/fdc3-schema";
import { DefaultChannel } from "./DefaultChannel";
import { Messaging } from "../Messaging";
import { PrivateChannelEventListenerType, PrivateChannelEventListenerVoid } from "../listeners/PrivateChannelEventListener";
import { DefaultContextListener } from "../listeners/DefaultContextListener";

type PrivateChannelDisconnectRequest = BrowserTypes.PrivateChannelDisconnectRequest
type PrivateChannelDisconnectResponse = BrowserTypes.PrivateChannelDisconnectResponse



export class DefaultPrivateChannel extends DefaultChannel implements PrivateChannel {

    constructor(messaging: Messaging, id: string) {
        super(messaging, id, "private")
    }

    async addEventListener(type: PrivateChannelEventTypes | null, handler: EventHandler): Promise<Listener> {

        function wrapEventHandlerString(): (m: string) => void {
            return (m: string) => {
                handler({
                    type,
                    details: m
                } as ApiEvent)
            }
        }

        function wrapEventHandlerVoid(): () => void {
            return () => {
                handler({
                    type
                } as ApiEvent)
            }
        }

        switch (type) {
            case "addContextListener": {
                const a = new PrivateChannelEventListenerType(this.messaging, this.id, "onAddContextListener", wrapEventHandlerString());
                await a.register()
                return a;
            }
            case "unsubscribe": {
                const u = new PrivateChannelEventListenerType(this.messaging, this.id, "onUnsubscribe", wrapEventHandlerString());
                await u.register()
                return u;
            }
            case "disconnect": {
                const d = new PrivateChannelEventListenerVoid(this.messaging, this.id, wrapEventHandlerVoid());
                await d.register()
                return d;
            }
            default: {
                throw new Error(`Unsupported event type: ${type}`)
            }
        }

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
        const request: PrivateChannelDisconnectRequest = {
            meta: this.messaging.createMeta(),
            payload: {
                channelId: this.id,
            },
            type: "privateChannelDisconnectRequest"
        };
        await this.messaging.exchange<PrivateChannelDisconnectResponse>(request, 'privateChannelDisconnectResponse')
    }

    async addContextListenerInner(contextType: string | null, theHandler: ContextHandler): Promise<Listener> {
        const listener = new DefaultContextListener(this.messaging, this.id, contextType, theHandler);
        await listener.register()
        return listener
    }
}