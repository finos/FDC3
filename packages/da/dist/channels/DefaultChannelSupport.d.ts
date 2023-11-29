import { Channel, ContextHandler, DisplayMetadata, Listener, PrivateChannel } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { ChannelSupport } from "./ChannelSupport";
import { ChannelContextListener } from "./ChannelContextListener";
import { StatefulChannel } from "./StatefulChannel";
export declare class DefaultChannelSupport implements ChannelSupport {
    readonly messaging: Messaging;
    protected userChannel: StatefulChannel | null;
    protected userChannelState: StatefulChannel[];
    protected userChannelListeners: ChannelContextListener[];
    constructor(messaging: Messaging, userChannelState: StatefulChannel[], initialChannelId: string | null);
    hasUserChannelMembershipAPIs(): boolean;
    getUserChannel(): Promise<Channel | null>;
    getUserChannels(): Promise<Channel[]>;
    getDisplayMetadata(_id: string): DisplayMetadata;
    getOrCreate(id: string): Promise<Channel>;
    createPrivateChannel(): Promise<PrivateChannel>;
    leaveUserChannel(): Promise<void>;
    joinUserChannel(id: string): Promise<void>;
    addContextListener(handler: ContextHandler, type: string | null): Promise<Listener>;
}
