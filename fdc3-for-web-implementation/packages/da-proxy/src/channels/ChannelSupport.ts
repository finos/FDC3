import { Channel, ContextHandler, Listener, PrivateChannel } from "@finos/fdc3"
import { ContextElement } from "@finos/fdc3/dist/bridging/BridgingTypes"

export interface ChannelSupport {

    hasUserChannelMembershipAPIs(): boolean

    getUserChannel(): Promise<Channel | null>

    getUserChannels(): Promise<Channel[]>

    getOrCreate(id: string): Promise<Channel>

    createPrivateChannel(): Promise<PrivateChannel>

    leaveUserChannel(): Promise<void>

    joinUserChannel(id: string): Promise<void>

    addContextListener(handler: ContextHandler, type: string | null): Promise<Listener>

    mergeChannelState(newState: { [key: string]: ContextElement[] }): void

}