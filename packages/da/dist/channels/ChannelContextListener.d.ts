import { Context, ContextHandler } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { DefaultContextListener } from "../listeners/DefaultContextListener";
export declare class ChannelContextListener extends DefaultContextListener {
    protected channelId: string | null;
    readonly contextType: string | null;
    constructor(messaging: Messaging, channelId: string | null, contextType: string | null, action: ContextHandler, type?: string);
    unsubscribe(): void;
    /**
     * This is used for user channels when changing to a new channel
     */
    updateUnderlyingChannel(id: string | null, latestContextMap: Map<string, Context>): void;
}
