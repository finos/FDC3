import { Context, ContextHandler, Listener, PrivateChannel } from "@finos/fdc3";
import { DefaultChannel } from "./DefaultChannel";
import { Messaging } from "../Messaging";
import { PrivateChannelBroadcastAgentRequest, PrivateChannelOnDisconnectAgentRequest} from "@finos/fdc3/dist/bridging/BridgingTypes";
import { PrivateChannelEventListenerType, PrivateChannelEventListenerVoid } from "../listeners/PrivateChannelEventListener";
import { DefaultContextListener } from "../listeners/DefaultContextListener";


export class DefaultPrivateChannel extends DefaultChannel implements PrivateChannel {

    constructor(messaging: Messaging, id: string) {
        super(messaging, id, "private")
    }
    
    broadcast(context: Context): Promise<void> {
        const message : PrivateChannelBroadcastAgentRequest = {
            meta: this.messaging.createMeta() as PrivateChannelBroadcastAgentRequest['meta'],
            payload: {
                channelId : this.id,
                context
            },
            type: "PrivateChannel.broadcast"
        }
        return this.messaging.post(message);
    }

    onAddContextListener(handler: (contextType?: string | undefined) => void): Listener {
        const l = new PrivateChannelEventListenerType(this.messaging, this.id, "onAddContextListener", handler); 
        this.listeners.push(l);
        return l;
    }

    onUnsubscribe(handler: (contextType?: string | undefined) => void): Listener {
        const l = new PrivateChannelEventListenerType(this.messaging, this.id,  "onUnsubscribe", handler); 
        this.listeners.push(l);
        return l;
    }

    onDisconnect(handler: () => void): Listener {
        const l = new PrivateChannelEventListenerVoid(this.messaging, this.id, handler); 
        this.listeners.push(l);
        return l;
    }

    disconnect(): void {
        // unsubscribe all existing listeners
        this.listeners.forEach( l => l.unsubscribe());
        
        // disconnect.
        const disconnectMessage : PrivateChannelOnDisconnectAgentRequest = {
            meta: this.messaging.createMeta() as PrivateChannelOnDisconnectAgentRequest['meta'] ,
            payload: {
                channelId: this.id,
            },
            type: "PrivateChannel.onDisconnect"
        }

        this.messaging.post(disconnectMessage)
    }
    
    addContextListenerInner(contextType: string | null, theHandler: ContextHandler): Promise<Listener> {
        const listener = new DefaultContextListener(this.messaging, this.id, contextType, theHandler, 
            "PrivateChannel.broadcast",
            "PrivateChannel.onAddContextListener",
            "PrivateChannel.onUnsubscribe");
        this.listeners.push(listener)
        return Promise.resolve(listener)   
    }
}