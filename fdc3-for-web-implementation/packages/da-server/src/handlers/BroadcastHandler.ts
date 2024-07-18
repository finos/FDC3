import { MessageHandler } from "../BasicFDC3Server";
import { AppMetadata, BroadcastAgentRequest, ConnectionStep2Hello, ConnectionStep3Handshake, PrivateChannelEventListenerAddedAgentRequest, PrivateChannelEventListenerRemovedAgentRequest, PrivateChannelOnDisconnectAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { ServerContext } from "../ServerContext";
import { PrivateChannelOnAddContextListenerAgentRequest, PrivateChannelOnUnsubscribeAgentRequest, PrivateChannelBroadcastAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { ChannelError, ContextElement } from "@finos/fdc3";
import { OnAddContextListenerAgentRequest, OnUnsubscribeAgentRequest, RegisterChannelAgentRequest, ChannelSelectionChoiceAgentRequest, ChannelSelectionChoiceAgentResponse, ChannelState } from "@kite9/fdc3-common";

type ListenerRegistration = {
    appId: string,
    instanceId: string,
    channelId: string,
    contextType: string | null
}

function listenerRegistrationMatches(lr1: ListenerRegistration, lr2: ListenerRegistration): boolean {
    return (lr1.appId == lr2.appId) &&
        (lr1.instanceId == lr2.instanceId) &&
        (lr1.channelId == lr2.channelId) &&
        (lr1.contextType == lr2.contextType)
}

type ChannelEventType = 'onAddContextListener' | 'onUnsubscribe' | 'onDisconnect'

type ChannelEventListener = {
    appId: string,
    instanceId: string,
    channelId: string,
    eventType: ChannelEventType
}

function channelEventListenerMatches(lr1: ChannelEventListener, lr2: ChannelEventListener): boolean {
    return (lr1.appId == lr2.appId) &&
        (lr1.instanceId == lr2.instanceId) &&
        (lr1.channelId == lr2.channelId) &&
        (lr1.eventType == lr2.eventType)
}

function channelEventListenerInvoked(cel: ChannelEventListener, channel: string, eventType: ChannelEventType): boolean {
    return (cel.channelId == channel) &&
        (cel.eventType == eventType)
}

function createListenerRegistration(msg:
    PrivateChannelOnAddContextListenerAgentRequest |
    PrivateChannelOnUnsubscribeAgentRequest): ListenerRegistration {

    return {
        appId: msg.meta.source?.appId!!,
        instanceId: msg.meta.source?.instanceId!!,
        channelId: msg.payload.channelId,
        contextType: msg.payload.contextType
    }
}

type ChannelType = { [channelId: string]: 'user' | 'app' | 'private' }

type EventMessage = PrivateChannelOnUnsubscribeAgentRequest | OnUnsubscribeAgentRequest | PrivateChannelOnAddContextListenerAgentRequest | OnAddContextListenerAgentRequest | PrivateChannelOnDisconnectAgentRequest

export class BroadcastHandler implements MessageHandler {

    private readonly contextListeners: ListenerRegistration[] = []
    private readonly eventListeners: ChannelEventListener[] = []
    private readonly state: ChannelState = {}
    private readonly type: ChannelType = {}

    private readonly desktopAgentName: string

    constructor(name: string, initialChannelState: ChannelState) {
        this.desktopAgentName = name
        this.state = initialChannelState
    }

    accept(msg: any, sc: ServerContext, from: AppMetadata) {
        switch (msg.type as string | null) {
            // channel registration
            case 'registerChannelRequest': return this.registerChannel(msg as RegisterChannelAgentRequest, sc, from)

            // private channels
            case 'PrivateChannel.broadcast': return this.handleBroadcast(msg as PrivateChannelBroadcastAgentRequest, sc)
            case 'PrivateChannel.onAddContextListener': return this.handleOnAddContextListener(msg as PrivateChannelOnAddContextListenerAgentRequest, sc)
            case 'PrivateChannel.onUnsubscribe': return this.handleOnUnsubscribe(msg as PrivateChannelOnUnsubscribeAgentRequest, sc)
            case 'PrivateChannel.onDisconnect': return this.handleOnDisconnect(msg as PrivateChannelOnDisconnectAgentRequest, from, sc)
            case 'PrivateChannel.eventListenerAdded': return this.handleEventListenerAdded(msg as PrivateChannelEventListenerAddedAgentRequest, from)
            case 'PrivateChannel.eventListenerRemoved': return this.handleEventListenerRemoved(msg as PrivateChannelEventListenerRemovedAgentRequest, from)

            // although we don't have messages for these yet, we're going to need them. See: https://github.com/finos/FDC3/issues/1171 
            case 'onUnsubscribe': return this.handleOnUnsubscribe(msg as OnUnsubscribeAgentRequest, sc)
            case 'onAddContextListener': return this.handleOnAddContextListener(msg as OnAddContextListenerAgentRequest, sc)
            case 'broadcastRequest': return this.handleBroadcast(msg as BroadcastAgentRequest, sc)

            // handling state synchronisation of channels
            case 'hello': return this.handleHello(msg as ConnectionStep2Hello, sc, from)
            case 'channelSelectionChoice': return this.handleChannelSelectionChoice(msg as ChannelSelectionChoiceAgentRequest, from, sc)
        }
    }

    createChannelEventListener(arg0: PrivateChannelEventListenerRemovedAgentRequest | PrivateChannelEventListenerAddedAgentRequest, from: AppMetadata): ChannelEventListener {
        const el: ChannelEventListener = {
            appId: from.appId,
            instanceId: from.instanceId!!,
            channelId: arg0.payload.channelId,
            eventType: arg0.payload.listenerType
        }
        return el
    }

    handleEventListenerRemoved(arg0: PrivateChannelEventListenerRemovedAgentRequest, from: AppMetadata) {
        const toRemove = this.createChannelEventListener(arg0, from)
        const fi = this.eventListeners.findIndex(e => channelEventListenerMatches(e, toRemove))
        if (fi > -1) {
            this.eventListeners.splice(fi, 1)
        }
    }

    handleEventListenerAdded(arg0: PrivateChannelEventListenerAddedAgentRequest, from: AppMetadata) {
        const el = this.createChannelEventListener(arg0, from)
        this.eventListeners.push(el)
    }

    handleChannelSelectionChoice(arg0: ChannelSelectionChoiceAgentRequest, from: AppMetadata, sc: ServerContext): void | PromiseLike<void> {
        // currently, this is a no-op, just pass the same message to the app
        const out = arg0 as ChannelSelectionChoiceAgentResponse
        sc.post(out, from)
    }

    handleHello(_hello: ConnectionStep2Hello, sc: ServerContext, from: AppMetadata) {
        const out: ConnectionStep3Handshake = {
            type: 'handshake',
            meta: {
                requestUuid: sc.createUUID(),
                timestamp: new Date()
            },
            payload: {
                channelsState: this.state,
                implementationMetadata: {
                    fdc3Version: sc.fdc3Version(),
                    optionalFeatures: {
                        DesktopAgentBridging: false,
                        OriginatingAppMetadata: true,
                        UserChannelMembershipAPIs: true
                    },
                    provider: sc.provider(),
                    providerVersion: sc.providerVersion()
                },
                requestedName: this.desktopAgentName
            }
        }

        sc.post(out, from)

    }

    invokeEventListeners(msg: EventMessage, channel: string, eventType: ChannelEventType, sc: ServerContext) {
        this.eventListeners
            .filter(e => channelEventListenerInvoked(e, channel, eventType))
            .forEach(e => sc.post(msg, { appId: e.appId, instanceId: e.instanceId }))
    }

    unsubscribe(lr: ListenerRegistration, sc: ServerContext, type: 'onUnsubscribe' | 'PrivateChannel.onUnsubscribe') {
        const fi = this.contextListeners.findIndex((e) => listenerRegistrationMatches(e, lr))
        if (fi > -1) {
            this.contextListeners.splice(fi, 1)
        }

        this.invokeEventListeners({
            type,
            meta: {
                requestUuid: sc.createUUID(),
                timestamp: new Date(),
            },
            payload: {
                channelId: lr.channelId,
                contextType: lr.contextType
            }

        } as EventMessage, lr.channelId, 'onUnsubscribe', sc)
    }

    handleOnUnsubscribe(arg0: PrivateChannelOnUnsubscribeAgentRequest | OnUnsubscribeAgentRequest, sc: ServerContext) {
        const lr = createListenerRegistration(arg0)
        this.unsubscribe(lr, sc, arg0.type)
    }

    handleOnDisconnect(arg0: PrivateChannelOnDisconnectAgentRequest, from: AppMetadata, sc: ServerContext) {
        // first, unsubscribe all listeners from this app to the channel
        const toUnsubscribe = this.contextListeners.filter(r => (r.appId == from.appId) && (r.instanceId == from.instanceId) && (r.channelId == arg0.payload.channelId))
        toUnsubscribe.forEach(u => this.unsubscribe(u, sc, 'PrivateChannel.onUnsubscribe'))

        // now, fire the disconnect to any event listeners
        this.invokeEventListeners(arg0, arg0.payload.channelId, 'onDisconnect', sc)
        //this.eventListeners.filter(cel => (cel.appId == from.appId))
    }

    handleOnAddContextListener(arg0: PrivateChannelOnAddContextListenerAgentRequest | OnAddContextListenerAgentRequest, sc: ServerContext) {
        const lr = createListenerRegistration(arg0)
        this.contextListeners.push(lr)
        this.invokeEventListeners(arg0, lr.channelId, 'onAddContextListener', sc)
    }

    async handleBroadcast(arg0: PrivateChannelBroadcastAgentRequest | BroadcastAgentRequest, sc: ServerContext) {
        const channelId = arg0.payload.channelId
        const context = arg0.payload.context
        const contextType = context.type
        const lr = this.contextListeners
        const privateChannel = arg0.type == "PrivateChannel.broadcast"

        function getPrivateChannelRecipients(): AppMetadata[] {
            return lr
                .filter(r => {
                    return (r.channelId == channelId) && ((r.contextType == null) || (r.contextType == contextType))
                })
        }

        const destinations: AppMetadata[] = privateChannel ? getPrivateChannelRecipients() : await sc.getConnectedApps()

        destinations
            .filter(r => r.instanceId !== arg0.meta.source?.instanceId)
            .forEach(r => {
                // forward on the broadcast message with added destination details
                const out = {
                    meta: {
                        source: arg0.meta.source,
                        destination: {
                            appId: r.appId,
                            instanceId: r.instanceId
                        },
                        requestUuid: arg0.meta.requestUuid,
                        timestamp: arg0.meta.timestamp
                    },
                    type: arg0.type,
                    payload: arg0.payload
                } as PrivateChannelBroadcastAgentRequest | BroadcastAgentRequest

                sc.post(out, r)
            })


        // store channel state for new da-proxies connecting
        if (!privateChannel) {
            var channelState: ContextElement[] = this.state[channelId] ?? []

            // remove previous context of same type
            channelState = channelState.filter(ce => ce.type != contextType)
            this.state[channelId] = channelState

            // add the new element of context
            channelState.push(context)
        }

    }

    registerChannel(r: RegisterChannelAgentRequest, sc: ServerContext, from: AppMetadata) {
        const id = r.payload.channelId
        const type = r.payload.type

        const existingType = this.type[id]

        if ((existingType) && (existingType != type)) {
            sc.post({
                type: "registerChannelResponse",
                payload: {
                    error: ChannelError.AccessDenied
                }
            }, from)
        } else {
            this.type[id] = type
            sc.post({
                type: "registerChannelResponse",
                payload: {
                }
            }, from)
        }
    }

}


