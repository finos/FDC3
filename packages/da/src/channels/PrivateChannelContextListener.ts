import { ContextHandler } from "@finos/fdc3";
import { PrivateChannelOnUnsubscribeAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { Messaging } from "../Messaging";
import { ChannelContextListener } from "./ChannelContextListener";

export class PrivateChannelContextListener extends ChannelContextListener {

    constructor(messaging: Messaging, channelId: string, contextType: string | null, action: ContextHandler) {
        super(messaging, channelId, contextType, action, "PrivateChannel.broadcast",);
    }

    unsubscribe(): void {
        this.messaging.unregister(this.id)

        // message to say we've unsubscribed
        const message : PrivateChannelOnUnsubscribeAgentRequest = {
            meta: this.messaging.createMeta() as PrivateChannelOnUnsubscribeAgentRequest['meta'],
            payload: {
                channelId: this.channelId!!,
                contextType: this.contextType as any // ##1109 raised
            },
            type: "PrivateChannel.onUnsubscribe"
        }

        this.messaging.post(message);
    }

}