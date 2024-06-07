import { Channel, ChannelError, ContextHandler, DisplayMetadata, Listener, PrivateChannel } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { ChannelSupport } from "./ChannelSupport";
import { DefaultPrivateChannel } from "./DefaultPrivateChannel";
import { DefaultChannel } from "./DefaultChannel";
import { StatefulChannel } from "./StatefulChannel";
import { DefaultContextListener } from "../listeners/DefaultContextListener";
import { ContextElement } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { RegisterChannelAgentRequest, RegisterChannelAgentResponse } from "@kite9/fdc3-common";

export class DefaultChannelSupport implements ChannelSupport {

    readonly messaging: Messaging
    protected userChannel: StatefulChannel | null
    protected userChannelState: StatefulChannel[]
    protected userChannelListeners: DefaultContextListener[] = []

    constructor(messaging: Messaging, userChannelState: StatefulChannel[], initialChannelId: string | null) {
        this.messaging = messaging;
        this.userChannelState = userChannelState;
        this.userChannel = userChannelState.find(c => c.id == initialChannelId) ?? null;
    }

    mergeChannelState(newState: { [key: string]: ContextElement[]; }): void {
        this.userChannel = null
        this.userChannelState.forEach(uc => {
            const incoming = newState[uc.id] ?? []
            incoming.forEach((context) => {
                const existing = uc.getState()
                if (!existing.get(context.type)) {
                    existing.set(context.type, context)
                }
            });
        })
    }

    hasUserChannelMembershipAPIs(): boolean {
        return true
    }

    getUserChannel(): Promise<Channel | null> {
        return Promise.resolve(this.userChannel);
    }

    getUserChannels(): Promise<Channel[]> {
        return Promise.resolve(this.userChannelState);
    }

    getDisplayMetadata(_id: string): DisplayMetadata {
        return {

        }
    }

    async registerChannel(channelId: string, type: "user" | "app" | "private"): Promise<void> {
        const response = await this.messaging.exchange<RegisterChannelAgentResponse>({
            meta: this.messaging.createMeta(),
            type: 'registerChannelRequest',
            payload: {
                channelId,
                type
            }
        } as RegisterChannelAgentRequest,
            'registerChannelResponse')

        const error = response.payload.error
        if (error) {
            throw new Error(error)
        }
    }


    async getOrCreate(id: string): Promise<Channel> {
        await this.registerChannel(id, 'app')
        const out = new DefaultChannel(this.messaging, id, "app", this.getDisplayMetadata(id))
        return out
    }

    async createPrivateChannel(): Promise<PrivateChannel> {
        const id = this.messaging.createUUID()
        await this.registerChannel(id, 'private')
        return new DefaultPrivateChannel(this.messaging, id)
    }

    leaveUserChannel(): Promise<void> {
        this.userChannel = null;
        this.userChannelListeners.forEach(
            l => l.updateUnderlyingChannel(null, new Map())
        )
        return Promise.resolve();
    }

    joinUserChannel(id: string) {
        if (this.userChannel?.id != id) {
            const newUserChannel = this.userChannelState.find(c => c.id == id)
            if (newUserChannel) {
                this.userChannel = newUserChannel;
                this.userChannelListeners.forEach(
                    l => l.updateUnderlyingChannel(newUserChannel.id, newUserChannel.getState()))
            } else {
                throw new Error(ChannelError.NoChannelFound)
            }
        }

        return Promise.resolve()
    }

    addContextListener(handler: ContextHandler, type: string | null): Promise<Listener> {
        const uc = this.userChannel
        const listener = new DefaultContextListener(this.messaging, uc?.id ?? null, type, handler)
        this.userChannelListeners.push(listener);
        if (uc) {
            listener.updateUnderlyingChannel(uc.id, uc.getState())
        }
        return Promise.resolve(listener);
    }


}