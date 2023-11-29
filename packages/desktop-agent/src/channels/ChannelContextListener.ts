import { Context, ContextHandler } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { DefaultContextListener } from "../listeners/DefaultContextListener";

export class ChannelContextListener extends DefaultContextListener {

    protected channelId: string | null
    readonly contextType: string | null

    constructor(messaging: Messaging, channelId: string | null, contextType: string | null, action: ContextHandler, type: string = "broadcastRequest") {
        const filter = (m: any) => (m.type == type) 
                && (m.payload.channelId == this.channelId)
                && ((m.payload.context?.type == this.contextType) || (this.contextType == null));

        super(messaging, filter, action);
        this.channelId = channelId;
        this.contextType = contextType;
    }   

    unsubscribe(): void {
        this.messaging.unregister(this.id)
    }

    /**
     * This is used for user channels when changing to a new channel
     */
    updateUnderlyingChannel(id: string | null, latestContextMap: Map<string, Context>) {
        this.channelId = id;
        latestContextMap.forEach((v, k) => {
            if ((this.contextType == null) || (this.contextType == k)) {
                this.action(v);
            }
        })
    }
}

