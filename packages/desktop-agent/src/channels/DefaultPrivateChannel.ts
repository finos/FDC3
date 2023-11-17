import { Context, ContextHandler, Listener, PrivateChannel } from "@finos/fdc3";
import { DefaultChannel } from "./DefaultChannel";
import { Messaging } from "../Messaging";
import { AgentRequestMessage, PrivateChannelBroadcastAgentRequest, PrivateChannelEventListenerAddedAgentRequest, PrivateChannelEventListenerAddedAgentRequestMeta, PrivateChannelEventListenerRemovedAgentRequest, PrivateChannelEventListenerRemovedAgentRequestMeta, PrivateChannelOnDisconnectAgentRequest, PrivateChannelOnUnsubscribeAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { EVENT_TYPES, PrivateChannelEventListener } from "./PrivateChannelEventListener";
import { PrivateChannelContextListener } from "./PrivateChannelContextListener";


export class DefaultPrivateChannel extends DefaultChannel implements PrivateChannel {

    constructor(messaging: Messaging, id: string) {
        super(messaging, id, "private")
    }
    
    broadcast(context: Context): Promise<void> {
        const message : PrivateChannelBroadcastAgentRequest = {
            meta: this.messaging.createMeta(),
            payload: {
                channelId : this.id,
                context
            },
            type: "PrivateChannel.broadcast"
        }
        return this.messaging.post(message);
    }

    notifyEventListenerAdded(t: EVENT_TYPES) {
        const message : PrivateChannelEventListenerAddedAgentRequest = {
            meta: this.messaging.createMeta(),
            payload: {
                channelId: this.id,
                listenerType: t
            },
            type: "PrivateChannel.eventListenerAdded"
        }

        this.messaging.post(message);
    }

    onAddContextListener(handler: (contextType?: string | undefined) => void): Listener {
        const l = new PrivateChannelEventListener(this.messaging, this.id, "onAddContextListener", (m) => handler(m.payload.contextType)); 
        this.listeners.push(l);
        this.notifyEventListenerAdded("onAddContextListener")
        return l;
    }

    onUnsubscribe(handler: (contextType?: string | undefined) => void): Listener {
        const l = new PrivateChannelEventListener(this.messaging, this.id,  "onUnsubscribe", (m) => handler(m.payload.contextType)); 
        this.listeners.push(l);
        this.notifyEventListenerAdded("onUnsubscribe")
        return l;
    }

    onDisconnect(handler: () => void): Listener {
        const l = new PrivateChannelEventListener(this.messaging, this.id, "onDisconnect", (m) => handler()); 
        this.listeners.push(l);
        this.notifyEventListenerAdded("onDisconnect")
        return l;
    }

    disconnect(): void {
        // unsubscribe all existing listeners
        this.listeners.forEach( l => l.unsubscribe());
        
        // disconnect.
        const disconnectMessage : PrivateChannelOnDisconnectAgentRequest = {
            meta: this.messaging.createMeta(),
            payload: {
                channelId: this.id,
            },
            type: "PrivateChannel.onDisconnect"
        }

        this.messaging.post(disconnectMessage)
    }
    
    addContextListenerInner(contextType: string | null, theHandler: ContextHandler): Promise<Listener> {
        const listener = new PrivateChannelContextListener(this.messaging, "PrivateChannel.broadcast", this.id, contextType, theHandler);
        this.listeners.push(listener)
        return Promise.resolve(listener)   
    }
}