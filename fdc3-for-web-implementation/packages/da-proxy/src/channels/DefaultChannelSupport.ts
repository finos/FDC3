import { Channel, ContextHandler, Listener, PrivateChannel } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { ChannelSupport } from "./ChannelSupport";
import { DefaultPrivateChannel } from "./DefaultPrivateChannel";
import { DefaultChannel } from "./DefaultChannel";
import { DefaultContextListener } from "../listeners/DefaultContextListener";
import {
    ChannelSelector,
    GetUserChannelsRequest, GetUserChannelsResponse,
    GetOrCreateChannelResponse, GetOrCreateChannelRequest,
    CreatePrivateChannelRequest, CreatePrivateChannelResponse,
    Channel as ChannelDetail,
    JoinUserChannelResponse, JoinUserChannelRequest,
    GetCurrentChannelResponse, GetCurrentChannelRequest,
    LeaveCurrentChannelRequest, LeaveCurrentChannelResponse,
} from "@kite9/fdc3-common";
import { FollowingContextListener } from "../listeners/FollowingContextListener";

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
    protected userChannels: Channel[] | null = null
    private followingListeners: FollowingContextListener[] = []

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

    async getUserChannel(): Promise<Channel | null> {
        const response = await this.messaging.exchange<GetCurrentChannelResponse>({
            meta: this.messaging.createMeta(),
            type: 'getCurrentChannelRequest',
            payload: {}
        } as GetCurrentChannelRequest, 'getCurrentChannelResponse')

        if (response.payload?.channel?.id) {
            return new DefaultChannel(this.messaging, response.payload.channel.id, "user", response.payload.channel.displayMetadata)
        } else {
            return null
        }
    }

    async getUserChannels(): Promise<Channel[]> {
        if (!this.userChannels) {
            const response = await this.messaging.exchange<GetUserChannelsResponse>({
                meta: this.messaging.createMeta(),
                type: 'getUserChannelsRequest',
                payload: {}
            } as GetUserChannelsRequest, 'getUserChannelsResponse')

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

        const out = new DefaultChannel(this.messaging, id, "app", response.payload.channel?.displayMetadata!!)
        return out
    }

    async createPrivateChannel(): Promise<PrivateChannel> {
        const response = await this.messaging.exchange<CreatePrivateChannelResponse>({
            meta: this.messaging.createMeta(),
            type: 'createPrivateChannelRequest',
            payload: {}
        } as CreatePrivateChannelRequest,
            'createPrivateChannelResponse')

        return new DefaultPrivateChannel(this.messaging, response.payload?.privateChannel?.id!!)
    }

    async leaveUserChannel(): Promise<void> {
        await this.messaging.exchange<LeaveCurrentChannelResponse>({
            meta: this.messaging.createMeta(),
            type: 'leaveCurrentChannelRequest',
            payload: {}
        } as LeaveCurrentChannelRequest,
            'leaveCurrentChannelResponse')

        this.followingListeners.forEach(l => l.changeChannel(null))
    }

    async joinUserChannel(id: string) {
        await this.messaging.exchange<JoinUserChannelResponse>({
            meta: this.messaging.createMeta(),
            type: 'joinUserChannelRequest',
            payload: {
                channelId: id
            }
        } as JoinUserChannelRequest,
            'joinUserChannelResponse')

        for (const l of this.followingListeners) {
            await l.changeChannel(new DefaultChannel(this.messaging, id, "user"))
        }
    }

    async addContextListener(handler: ContextHandler, type: string | null): Promise<Listener> {
        const _container = this

        class UnsubscribingDefaultContextListener extends DefaultContextListener {
            async unsubscribe(): Promise<void> {
                super.unsubscribe()
                _container.followingListeners = _container.followingListeners.filter(l => l != this)
            }
        }

        const currentChannelId = (await this.getUserChannel())?.id ?? null
        const listener = new UnsubscribingDefaultContextListener(this.messaging, currentChannelId, type, handler)
        this.followingListeners.push(listener)
        await listener.register()
        return listener
    }


}