import { Channel } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { ChannelSupport } from "./ChannelSupport";

export class BasicChannel implements Channel {

    readonly messaging: Messaging

    constructor(messaging: Messaging) {
        this.messaging = messaging;
    }

}


export class ChannelSupportImpl implements ChannelSupport {

    readonly messaging: Messaging
    private userChannelId: string

    constructor(messaging: Messaging) {
        this.messaging = messaging;
    }
    
    getUserChannel() : Promise<Channel>

    getUserChannels() : Promise<Channel[]>

    getOrCreate(id: string) : Promise<Channel>

    createPrivateChannel() : Promise<PrivateChannel>

    leaveUserChannel() : Promise<void>

    joinUserChannel(id: string) 

    
}