import { Context, ContextHandler, Listener, PrivateChannel } from "@finos/fdc3";
import { DefaultChannel } from "./DefaultChannel";
import { Messaging } from "../Messaging";
import { AgentRequestMessage, PrivateChannelBroadcastAgentRequest, PrivateChannelEventListenerAddedAgentRequest, PrivateChannelEventListenerAddedAgentRequestMeta, PrivateChannelEventListenerRemovedAgentRequest, PrivateChannelEventListenerRemovedAgentRequestMeta, PrivateChannelOnDisconnectAgentRequest, PrivateChannelOnUnsubscribeAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { DefaultContextListener } from "./DefaultContextListener";

export class PrivateChannelContextListener extends DefaultContextListener {

    constructor(messaging: Messaging, type: string, channelId: string, contextType: string | null, action: ContextHandler) {
        super(messaging, type, channelId, contextType, action);
    }

    unsubscribe(): void {
        this.messaging.unregister(this.id)

        // message to say we've unsubscribed
        const message : PrivateChannelOnUnsubscribeAgentRequest = {
            meta: this.messaging.createMeta(),
            payload: {
                channelId: this.channelId,
                contextType: this.contextType as any // ##1109 raised
            },
            type: "PrivateChannel.onUnsubscribe"
        }

        this.messaging.post(message);
    }

}