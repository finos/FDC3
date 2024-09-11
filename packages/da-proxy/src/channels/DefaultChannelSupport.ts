import { Channel, ContextHandler, Listener, PrivateChannel, ChannelSelector } from "@kite9/fdc3-standard";
import { Messaging } from "../Messaging";
import { ChannelSupport } from "./ChannelSupport";
import { DefaultPrivateChannel } from "./DefaultPrivateChannel";
import { DefaultChannel } from "./DefaultChannel";
import { DefaultContextListener } from "../listeners/DefaultContextListener";
import { BrowserTypes } from "@kite9/fdc3-schema";
import { FollowingContextListener } from "../listeners/FollowingContextListener";

type ChannelDetail = BrowserTypes.Channel
type GetUserChannelsRequest = BrowserTypes.GetUserChannelsRequest
type GetUserChannelsResponse = BrowserTypes.GetUserChannelsResponse
type GetOrCreateChannelResponse = BrowserTypes.GetOrCreateChannelResponse
type GetOrCreateChannelRequest = BrowserTypes.GetOrCreateChannelRequest
type CreatePrivateChannelRequest = BrowserTypes.CreatePrivateChannelRequest
type CreatePrivateChannelResponse = BrowserTypes.CreatePrivateChannelResponse
type JoinUserChannelResponse = BrowserTypes.JoinUserChannelResponse
type JoinUserChannelRequest = BrowserTypes.JoinUserChannelRequest
type GetCurrentChannelResponse = BrowserTypes.GetCurrentChannelResponse
type GetCurrentChannelRequest = BrowserTypes.GetCurrentChannelRequest
type LeaveCurrentChannelRequest = BrowserTypes.LeaveCurrentChannelRequest
type LeaveCurrentChannelResponse = BrowserTypes.LeaveCurrentChannelResponse



export class DefaultChannelSupport implements ChannelSupport {

    readonly messaging: Messaging
    readonly channelSelector: ChannelSelector
    protected userChannels: Channel[] | null = null
    private followingListeners: FollowingContextListener[] = []

    constructor(messaging: Messaging, channelSelector: ChannelSelector) {
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

        this.channelSelector.updateChannel(null, this.userChannels ?? [])
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

        this.channelSelector.updateChannel(id, this.userChannels ?? [])

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