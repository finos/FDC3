import { ContextHandler, Context } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { AbstractListener } from "./AbstractListener";
import { BroadcastEvent } from "@kite9/fdc3-common";
import { FollowingContextListener } from "./FollowingContextListener";

export class DefaultContextListener extends AbstractListener<ContextHandler> implements FollowingContextListener {

    private channelId: string | null
    private readonly messageType: string
    private readonly contextType: string | null

    constructor(messaging: Messaging,
        channelId: string | null,
        contextType: string | null,
        handler: ContextHandler,
        messageType: string = "broadcastEvent",
        subscribeType: string = "addContextListener",
        unsubscribeType: string = "contextListenerUnsubscribe") {
        super(messaging, { channelId, contextType }, handler, subscribeType, unsubscribeType)
        this.channelId = channelId
        this.messageType = messageType
        this.contextType = contextType
    }

    async changeChannel(channelId: string, newChannelState: Context[]): Promise<void> {
        this.channelId = channelId
        for (let c of newChannelState) {
            if ((c.type == this.contextType) || (this.contextType == null)) {
                await this.handler(c)
            }
        }
    }

    filter(m: BroadcastEvent): boolean {
        return (m.type == this.messageType)
            && (m.payload.channelId == this.channelId)
            && ((m.payload.context?.type == this.contextType) || (this.contextType == null));
    }

    action(m: any): void {
        this.handler(m.payload.context)
    }
}