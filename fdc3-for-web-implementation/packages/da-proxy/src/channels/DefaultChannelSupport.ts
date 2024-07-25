import { Channel, ContextHandler, Listener, PrivateChannel } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { ChannelSupport } from "./ChannelSupport";
import { DefaultPrivateChannel } from "./DefaultPrivateChannel";
import { DefaultChannel } from "./DefaultChannel";
import { DefaultContextListener } from "../listeners/DefaultContextListener";
import {
    ChannelSelector, GetUserChannelsRequest, GetUserChannelsResponse, GetOrCreateChannelResponse,
    GetOrCreateChannelRequest, CreatePrivateChannelRequest, CreatePrivateChannelResponse,
    Channel as ChannelDetail, JoinUserChannelResponse, JoinUserChannelRequest,
    AddContextListenerRequest, AddContextListenerResponse
} from "@kite9/fdc3-common";

const NO_OP_CHANNEL_SELECTOR: ChannelSelector = {

    updateChannel(_channelId: string | null): void {
        // does nothing
    },

    setChannelChangeCallback(_callback: (channelId: string) => void): void {
        // also does nothing
    }
}

export class DefaultChannelSupport implements ChannelSupport {

    readonly messaging: Messaging
    readonly channelSelector: ChannelSelector
    protected userChannel: DefaultChannel | null = null
    protected userChannelListeners: DefaultContextListener[] = []
    protected userChannels: Channel[] | null = null

    constructor(messaging: Messaging, channelSelector: ChannelSelector = NO_OP_CHANNEL_SELECTOR) {
        this.messaging = messaging;
        this.channelSelector = channelSelector
        this.channelSelector.setChannelChangeCallback((channelId: string) => {
            if (channelId == null) {
                this.leaveUserChannel()
            } else {
                this.joinUserChannel(channelId)
            }
        })
    }

    async connect(): Promise<void> {
    }

    disconnect(): Promise<void> {
        return Promise.resolve()
    }

    hasUserChannelMembershipAPIs(): boolean {
        return true
    }

    getUserChannel(): Promise<Channel | null> {
        return Promise.resolve(this.userChannel);
    }

    async getUserChannels(): Promise<Channel[]> {
        if (!this.userChannels) {
            const response = await this.messaging.exchange<GetUserChannelsResponse>({
                meta: this.messaging.createMeta(),
                type: 'getUserChannelsRequest',

            } as GetUserChannelsRequest, 'getUserChannelsResponse')

            const error = response.payload.error
            if (error) {
                throw new Error(error)
            }

            const channels: ChannelDetail[] = response.payload.userChannels ?? []
            this.userChannels = channels.map(c => new DefaultChannel(this.messaging, c.id, "user", c.displayMetadata));
        }
        return this.userChannels
    }

    async getOrCreate(id: string): Promise<Channel> {
        const response = await this.messaging.exchange<GetOrCreateChannelResponse>({
            meta: this.messaging.createMeta(),
            type: 'getOrCreateChannelRequest',
            payload: {
                channelId: id
            }
        } as GetOrCreateChannelRequest,
            'getOrCreateChannelResponse')

        const error = response.payload.error
        if (error) {
            throw new Error(error)
        }

        const out = new DefaultChannel(this.messaging, id, "app", response.payload.channel?.displayMetadata!!)
        return out
    }

    async createPrivateChannel(): Promise<PrivateChannel> {
        const response = await this.messaging.exchange<CreatePrivateChannelResponse>({
            meta: this.messaging.createMeta(),
            type: 'createPrivateChannelRequest',
        } as CreatePrivateChannelRequest,
            'createPrivateChannelResponse')

        const error = response.payload.error
        if (error) {
            throw new Error(error)
        }

        return new DefaultPrivateChannel(this.messaging, response.payload?.privateChannel?.id!!)
    }

    async leaveUserChannel(): Promise<void> {
        this.userChannel = null;
        this.channelSelector.updateChannel(null, await this.getUserChannels())
        return Promise.resolve();
    }

    async joinUserChannel(id: string) {
        const response = await this.messaging.exchange<JoinUserChannelResponse>({
            meta: this.messaging.createMeta(),
            type: 'joinUserChannelRequest',
            payload: {
                channelId: id
            }
        } as JoinUserChannelRequest,
            'joinUserChannelResponse')

        const error = response.payload.error
        if (error) {
            throw new Error(error)
        }

        const allUserChannels = await this.getUserChannels()

        this.userChannel = allUserChannels.find(c => c.id == id) as DefaultChannel | null ?? null
    }

    async addContextListener(handler: ContextHandler, type: string | null): Promise<Listener> {
        const response = await this.messaging.exchange<AddContextListenerResponse>({
            meta: this.messaging.createMeta(),
            type: 'addContextListenerRequest',
            payload: {
                channelId: this.userChannel?.id ?? null,
                contextType: type
            }
        } as AddContextListenerRequest,
            'addContextListenerResponse')

        const error = response.payload.error
        if (error) {
            throw new Error(error)
        }

        const listener = new DefaultContextListener(this.messaging, response.payload.listenerUUID!!, type, handler)
        return Promise.resolve(listener);
    }


}