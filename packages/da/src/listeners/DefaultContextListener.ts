import { Context, ContextHandler } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { AbstractListener } from "./AbstractListener";

export class DefaultContextListener extends AbstractListener<ContextHandler> {

    private channelId: string | null
    private readonly messageType: string
    private readonly contextType: string | null

    constructor(messaging: Messaging, 
        channelId: string | null, 
        contextType: string | null, 
        handler: ContextHandler,
        messageType: string = "broadcastRequest",
        subscribeType: string  | null= "onAddContextListener",
        unsubscribeType: string | null = "onUnsubscribe") {
        super(messaging, { channelId, contextType }, handler, subscribeType, unsubscribeType)
        this.channelId = channelId
        this.messageType = messageType
        this.contextType = contextType
    }

    filter(m: any) : boolean {
        return (m.type == this.messageType)
            && (m.payload.channel == this.channelId)
            && ((m.payload.context?.type == this.contextType) || (this.contextType == null));
    }

    action(m: any) : void {
        this.handler(m.payload.context)
    }

    /**
     * This is used for user channels when changing to a new channel
     */
    updateUnderlyingChannel(id: string | null, latestContextMap: Map<string, Context>) {
        this.channelId = id;
        latestContextMap.forEach((v, k) => {
            if ((this.contextType == null) || (this.contextType == k)) {
                this.handler(v);
            }
        })
    }
}