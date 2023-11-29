import { ContextHandler } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { ChannelContextListener } from "./ChannelContextListener";
export declare class PrivateChannelContextListener extends ChannelContextListener {
    constructor(messaging: Messaging, channelId: string, contextType: string | null, action: ContextHandler);
    unsubscribe(): void;
}
