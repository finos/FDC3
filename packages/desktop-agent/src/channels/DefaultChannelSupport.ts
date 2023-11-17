import { Channel, Context, ContextHandler, DisplayMetadata, Listener, PrivateChannel } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { ChannelSupport } from "./ChannelSupport";
import { BridgeRequestMessage, BroadcastAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { DefaultPrivateChannel } from "./DefaultPrivateChannel";

export class DefaultChannelSupport implements ChannelSupport {

    readonly messaging: Messaging
    private userChannelId: string

    constructor(messaging: Messaging) {
        this.messaging = messaging;
    }

    hasUserChannelMembershipAPIs(): boolean {
        return true
    }
    
    getUserChannel() : Promise<Channel> {

    }

    getUserChannels() : Promise<Channel[]> {

    }

    getDisplayMetadata(id: string) : DisplayMetadata {
        return {

        }
    }

    getOrCreate(id: string) : Promise<Channel> {
        const out = new DefaultChannel(this.messaging, id, "app", this.getDisplayMetadata(id))
        return Promise.resolve(out)
    }

    createPrivateChannel() : Promise<PrivateChannel> {
        const out = new DefaultPrivateChannel(this.messaging, this.messaging.createUUid())
        return Promise.resolve(out);
    }

    leaveUserChannel() : Promise<void>

    joinUserChannel(id: string) 
    
}