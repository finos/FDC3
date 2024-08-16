import { Channel, ContextHandler, Listener, PrivateChannel } from "@finos/fdc3"

export interface ChannelSupport {

    getUserChannel(): Promise<Channel | null>

    getUserChannels(): Promise<Channel[]>

    getOrCreate(id: string): Promise<Channel>

    createPrivateChannel(): Promise<PrivateChannel>

    leaveUserChannel(): Promise<void>

    joinUserChannel(id: string): Promise<void>

    addContextListener(handler: ContextHandler, type: string | null): Promise<Listener>

}