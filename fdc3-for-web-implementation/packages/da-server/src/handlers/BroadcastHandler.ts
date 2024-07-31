import { MessageHandler } from "../BasicFDC3Server";
import { ServerContext } from "../ServerContext";
import { AppIdentifier, AppMetadata, ChannelError, Context, ContextElement } from "@finos/fdc3";
import { successResponse, errorResponse, onlyUnique } from "./support";
import {
    GetCurrentContextRequest, GetCurrentContextResponse
    BroadcastRequest, BroadcastResponse
    ContextListenerUnsubscribeRequest, ContextListenerUnsubscribeResponse
    AddContextListenerRequest, AddContextListenerResponse
    PrivateChannelAddEventListenerRequest, PrivateChannelAddEventListenerResponse
    PrivateChannelUnsubscribeEventListenerRequest, PrivateChannelUnsubscribeEventListenerResponse,
    GetOrCreateChannelRequest, GetOrCreateChannelResponse,
    GetUserChannelsRequest, GetUserChannelsResponse,
    LeaveCurrentChannelRequest, LeaveCurrentChannelResponse,
    JoinUserChannelRequest, JoinUserChannelResponse,
    GetCurrentChannelRequest, GetCurrentChannelResponse, Context,
} from "@kite9/fdc3-common";

type ListenerRegistration = {
    appId: string,
    instanceId: string,
    channelId: string | null,
    contextType: string | null
    userChannelListener: boolean
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
    eventType: ChannelEventType,
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

enum ChannelType { 'user', 'app', 'private' }

type ChannelState = {
    id: string,
    type: ChannelType,
    context: Context[]
}


export class BroadcastHandler implements MessageHandler {

    private readonly contextListeners: ListenerRegistration[] = []
    private readonly eventListeners: ChannelEventListener[] = []
    private readonly desktopAgentName: string
    private readonly state: ChannelState[] = []
    private readonly currentChannel: { [instanceId: string]: ChannelState } = {}

    constructor(name: string, initialChannelState: ChannelState[]) {
        this.desktopAgentName = name
        this.state = initialChannelState
    }

    getCurrentChannel(from: AppMetadata): ChannelState | null {
        if (from.instanceId) {
            return this.currentChannel[from.instanceId]
        } else {
            return null
        }
    }

    getChannelById(id: string): ChannelState | undefined {
        return this.state.find(c => c.id == id)
    }

    getListeners(appId: AppIdentifier) {
        return this.contextListeners.filter(r => r.appId == appId.appId)
    }

    moveUserChannelListeners(app: AppIdentifier, channelId: string | null) {
        this.getListeners(app)
            .filter(l => l.userChannelListener)
            .forEach(l => {
                l.channelId = channelId
            })
    }

    updateChannelState(channelId: string, context: Context) {
        throw new Error("Method not implemented.");
    }

    accept(msg: any, sc: ServerContext, from: AppMetadata) {
        switch (msg.type as string | null) {
            // app channels registration
            case 'getOrCreateChannelRequest': return this.handleGetOrCreateRequest(msg as GetOrCreateChannelRequest, sc, from)

            // user channel management
            case 'getUserChannelsRequest': return this.handleGetUserChannelsRequest(msg as GetUserChannelsRequest, sc, from)
            case 'leaveUserChannelRequest': return this.handleLeaveCurrentChannelRequest(msg as LeaveCurrentChannelRequest, sc, from)
            case 'joinUserChannelRequest': return this.handleJoinUserChannelRequest(msg as JoinUserChannelRequest, sc, from)
            case 'getCurrentChannelRequest': return this.handleGetCurrentChannelRequest(msg as GetCurrentChannelRequest, sc, from)

            // general broadcast
            case 'broadcastRequest': return this.handleBroadcastRequest(msg as BroadcastRequest, sc)

            // context listeners
            case 'addContextListenerRequest': return this.handleAddContextListenerRequest(msg as AddContextListenerRequest, sc)
            case 'contextListenerUnsubscribeRequest': return this.handleContextListenerUnsubscribeRequest(msg as ContextListenerUnsubscribeRequest, sc)

            // private channels
            case 'privateChannelDisconnectRequest': return this.handlePrivateChannelDisconnectRequest(msg as PrivateChannelDisconnectRequest, from, sc)
            case 'privateChannelAddEventListenerRequest': return this.handlePrivateChannelAddEventListenerRequest(msg as PrivateChannelEventListenerAddedRequest, from)
            case 'privateChannelUnsubscribeEventListenerRequest': return this.handlePrivateChannelUnsubscribeEventListenerRequest(msg as PrivateChannelUnsubscribeEventListenerRequest, from)

            // handling state synchronisation of channels
            case 'getCurrentContextRequest': return this.handleGetCurrentContextRequest(msg as GetCurrentContextRequest, from, sc)
        }
    }

    handleBroadcastRequest(arg0: BroadcastRequest, sc: ServerContext) {
        const matchingListeners = this.contextListeners
            .filter(r => r.channelId == arg0.payload.channelId)
            .filter(r => r.contextType == null || r.contextType == arg0.payload.context.type)

        const matchingApps = matchingListeners
            .map(r => { return { appId: r.appId, instanceId: r.instanceId } })
            .filter(onlyUnique)

        matchingApps.forEach(app => {
            sc.post({
                meta: {
                    eventUuid: sc.createUUID(),
                    timestamp: new Date()
                },
                type: 'broadcastEvent',
                payload: {
                    channelId: arg0.payload.channelId,
                    context: arg0.payload.context
                }
            }, app)
        })

        this.updateChannelState(arg0.payload.channelId, arg0.payload.context)
    }

    handleGetCurrentChannelRequest(arg0: GetCurrentChannelRequest, sc: ServerContext, from: AppMetadata) {
        const currentChannel = this.getCurrentChannel(from)
        successResponse(sc, arg0, from, {
            channel: {
                id: currentChannel?.id ?? null,
            }
        }, 'getCurrentChannelResponse')
    }

    handleJoinUserChannelRequest(arg0: JoinUserChannelRequest, sc: ServerContext, from: AppMetadata) {
        // check it's a user channel
        const newChannel = this.getChannelById(arg0.payload.channelId)
        if ((newChannel == null) || (newChannel.type != ChannelType.user)) {
            return errorResponse(sc, arg0, from, ChannelError.NoChannelFound, 'joinUserChannelResponse')
        }

        // join it.  
        const instanceId = from.instanceId ?? 'no-instance-id'
        this.currentChannel[instanceId] = newChannel
        this.moveUserChannelListeners(from, newChannel.id)
        successResponse(sc, arg0, from, {}, 'joinUserChannelResponse')
    }

    handleLeaveCurrentChannelRequest(arg0: LeaveCurrentChannelRequest, sc: ServerContext, from: AppMetadata) {
        const instanceId = from.instanceId ?? 'no-instance-id'
        const currentChannel = this.currentChannel[instanceId]
        if (currentChannel) {
            delete this.currentChannel[instanceId]
            this.moveUserChannelListeners(from, null)
        }
        successResponse(sc, arg0, from, {}, 'leaveUserChannelResponse')
    }

    handleGetOrCreateRequest(arg0: GetOrCreateChannelRequest, sc: ServerContext, from: AppMetadata) {
        const id = arg0.payload.channelId
        var channel = this.getChannelById(id)
        if (channel) {
            if (channel.type != ChannelType.app) {
                errorResponse(sc, arg0, from, ChannelError.AccessDenied, 'getOrCreateChannelResponse')
            }
        } else {
            channel = {
                id: id,
                type: ChannelType.app,
                context: []
            }
            this.state.push(channel)
        }

        successResponse(sc, arg0, from, { channel: { id: channel.id, type: channel.type, } }, 'getOrCreateChannelResponse')
    }


    handleGetUserChannelsRequest(arg0: GetUserChannelsRequest, sc: ServerContext, from: AppMetadata) {
        const userChannels = this.state.filter(c => c.type == ChannelType.user)
        successResponse(sc, arg0, from, { channels: userChannels.map(c => ({ id: c.id, type: c.type })) }, 'getUserChannelsResponse')
    }

    // createChannelEventListener(arg0: PrivateChannelEventListenerRemovedAgentRequest | PrivateChannelEventListenerAddedAgentRequest, from: AppMetadata): ChannelEventListener {
    //     const el: ChannelEventListener = {
    //         appId: from.appId,
    //         instanceId: from.instanceId!!,
    //         channelId: arg0.payload.channelId,
    //         eventType: arg0.payload.listenerType
    //     }
    //     return el
    // }

    // handleEventListenerRemoved(arg0: PrivateChannelUnsubscribeEventListenerRequest, from: AppMetadata) {
    //     const toRemove = this.createChannelEventListener(arg0, from)
    //     const fi = this.eventListeners.findIndex(e => channelEventListenerMatches(e, toRemove))
    //     if (fi > -1) {
    //         this.eventListeners.splice(fi, 1)
    //     }
    // }

    // handlePrivateChannelAddEventListenerRequest(arg0: PrivateChannelAddEventListenerRequest, from: AppMetadata) {
    //     const el = this.createChannelEventListener(arg0, from)
    //     this.eventListeners.push(el)
    // }



    // invokeEventListeners(msg: EventMessage, channel: string, eventType: ChannelEventType, sc: ServerContext) {
    //     this.eventListeners
    //         .filter(e => channelEventListenerInvoked(e, channel, eventType))
    //         .forEach(e => sc.post(msg, { appId: e.appId, instanceId: e.instanceId }))
    // }

    // unsubscribe(lr: ListenerRegistration, sc: ServerContext, type: 'onUnsubscribe' | 'PrivateChannel.onUnsubscribe') {
    //     const fi = this.contextListeners.findIndex((e) => listenerRegistrationMatches(e, lr))
    //     if (fi > -1) {
    //         this.contextListeners.splice(fi, 1)
    //     }

    //     this.invokeEventListeners({
    //         type,
    //         meta: {
    //             requestUuid: sc.createUUID(),
    //             timestamp: new Date(),
    //         },
    //         payload: {
    //             channelId: lr.channelId,
    //             contextType: lr.contextType
    //         }

    //     } as EventMessage, lr.channelId, 'onUnsubscribe', sc)
    // }

    // handleOnUnsubscribe(arg0: PrivateChannelOnUnsubscribeAgentRequest | OnUnsubscribeAgentRequest, sc: ServerContext) {
    //     const lr = createListenerRegistration(arg0)
    //     this.unsubscribe(lr, sc, arg0.type)
    // }

    // handleOnDisconnect(arg0: PrivateChannelOnDisconnectAgentRequest, from: AppMetadata, sc: ServerContext) {
    //     // first, unsubscribe all listeners from this app to the channel
    //     const toUnsubscribe = this.contextListeners.filter(r => (r.appId == from.appId) && (r.instanceId == from.instanceId) && (r.channelId == arg0.payload.channelId))
    //     toUnsubscribe.forEach(u => this.unsubscribe(u, sc, 'PrivateChannel.onUnsubscribe'))

    //     // now, fire the disconnect to any event listeners
    //     this.invokeEventListeners(arg0, arg0.payload.channelId, 'onDisconnect', sc)
    //     //this.eventListeners.filter(cel => (cel.appId == from.appId))
    // }

    // handleOnAddContextListener(arg0: PrivateChannelOnAddContextListenerAgentRequest | OnAddContextListenerAgentRequest, sc: ServerContext) {
    //     const lr = createListenerRegistration(arg0)
    //     this.contextListeners.push(lr)
    //     this.invokeEventListeners(arg0, lr.channelId, 'onAddContextListener', sc)
    // }

    // async handleBroadcast(arg0: PrivateChannelBroadcastAgentRequest | BroadcastAgentRequest, sc: ServerContext) {
    //     const channelId = arg0.payload.channelId
    //     const context = arg0.payload.context
    //     const contextType = context.type
    //     const lr = this.contextListeners
    //     const privateChannel = arg0.type == "PrivateChannel.broadcast"

    //     function getPrivateChannelRecipients(): AppMetadata[] {
    //         return lr
    //             .filter(r => {
    //                 return (r.channelId == channelId) && ((r.contextType == null) || (r.contextType == contextType))
    //             })
    //     }

    //     const destinations: AppMetadata[] = privateChannel ? getPrivateChannelRecipients() : await sc.getConnectedApps()

    //     destinations
    //         .filter(r => r.instanceId !== arg0.meta.source?.instanceId)
    //         .forEach(r => {
    //             // forward on the broadcast message with added destination details
    //             const out = {
    //                 meta: {
    //                     source: arg0.meta.source,
    //                     destination: {
    //                         appId: r.appId,
    //                         instanceId: r.instanceId
    //                     },
    //                     requestUuid: arg0.meta.requestUuid,
    //                     timestamp: arg0.meta.timestamp
    //                 },
    //                 type: arg0.type,
    //                 payload: arg0.payload
    //             } as PrivateChannelBroadcastAgentRequest | BroadcastAgentRequest

    //             sc.post(out, r)
    //         })


    //     // store channel state for new da-proxies connecting
    //     if (!privateChannel) {
    //         var channelState: ContextElement[] = this.state[channelId] ?? []

    //         // remove previous context of same type
    //         channelState = channelState.filter(ce => ce.type != contextType)
    //         this.state[channelId] = channelState

    //         // add the new element of context
    //         channelState.push(context)
    //     }

    // }

    // registerChannel(r: RegisterChannelAgentRequest, sc: ServerContext, from: AppMetadata) {
    //     const id = r.payload.channelId
    //     const type = r.payload.type

    //     const existingType = this.type[id]

    //     if ((existingType) && (existingType != type)) {
    //         sc.post({
    //             type: "registerChannelResponse",
    //             payload: {
    //                 error: ChannelError.AccessDenied
    //             }
    //         }, from)
    //     } else {
    //         this.type[id] = type
    //         sc.post({
    //             type: "registerChannelResponse",
    //             payload: {
    //             }
    //         }, from)
    //     }
    // }

}


