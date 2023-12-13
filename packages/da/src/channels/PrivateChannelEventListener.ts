import { Listener } from "@finos/fdc3"
import { Messaging } from "../Messaging.js"
import { AgentRequestMessage, PrivateChannelEventListenerRemovedAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes"

export type EVENT_TYPES = "onAddContextListener" | "onDisconnect" | "onUnsubscribe"

export class PrivateChannelEventListener implements Listener {

    readonly messaging: Messaging
    readonly listenerId: string
    readonly channelId: string
    readonly messageTypeFilter: EVENT_TYPES

    constructor(messaging: Messaging, 
        channelId: string, 
        messageTypeFilter: EVENT_TYPES, 
        action: (m: any) => void) {
        this.messaging = messaging;
        this.channelId = channelId;
        const filter = (m: AgentRequestMessage) => (m.type == "PrivateChannel."+messageTypeFilter) 
                    && (channelId == m.payload?.channel);
                   
        this.listenerId = this.messaging.register(filter, action)
        this.messageTypeFilter = messageTypeFilter
    }

    unsubscribe(): void {
        this.messaging.unregister(this.listenerId)

        // message to say we've unsubscribed
        const message : PrivateChannelEventListenerRemovedAgentRequest = {
                meta: this.messaging.createMeta() as PrivateChannelEventListenerRemovedAgentRequest['meta'],
                payload: {
                    channelId: this.channelId,
                    listenerType: this.messageTypeFilter
                },
                type: "PrivateChannel.eventListenerRemoved"
            }
    
        this.messaging.post(message);
    }
}
