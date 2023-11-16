import { Channel, PrivateChannel, getCurrentChannel } from "@finos/fdc3"

export interface ChannelSupport {

    getUserChannel() : Promise<Channel>

    getUserChannels() : Promise<Channel[]>

    getOrCreate(id: string) : Promise<Channel>

    createPrivateChannel() : Promise<PrivateChannel>

    leaveUserChannel() : Promise<void>

    joinUserChannel(id: string) 

}