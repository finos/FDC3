import { MessageHandler } from "../BasicFDC3Server";
import { AppMetadata, BroadcastAgentRequest, ConnectionStep2Hello, ConnectionStep3Handshake } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { ServerContext } from "../ServerContext";
import {
    PrivateChannelOnAddContextListenerAgentRequest,
    PrivateChannelOnUnsubscribeAgentRequest,
    PrivateChannelBroadcastAgentRequest
} from "@finos/fdc3/dist/bridging/BridgingTypes";
import { ContextElement } from "@finos/fdc3";
import { OnAddContextListenerAgentRequest, OnUnsubscribeAgentRequest } from "@kite9/fdc3-common";

type ListenerRegistration = {
    appId: string,
    instanceId: string,
    channelId: string,
    contextType: string | null
}

function matches(lr1: ListenerRegistration, lr2: ListenerRegistration): boolean {
    return (lr1.appId == lr2.appId) &&
        (lr1.instanceId == lr2.instanceId) &&
        (lr1.channelId == lr2.channelId) &&
        (lr1.contextType == lr2.contextType)
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

type ChannelState = { [channelId: string]: ContextElement[] }

export class BroadcastHandler implements MessageHandler {

    private regs: ListenerRegistration[] = []
    private state: ChannelState = {}
    private readonly desktopAgentName: string

    constructor(name: string) {
        this.desktopAgentName = name
    }

    accept(msg: any, sc: ServerContext, from: AppMetadata) {
        switch (msg.type as string | null) {
            case 'PrivateChannel.broadcast': return this.handleBroadcast(msg as PrivateChannelBroadcastAgentRequest, sc)
            case 'PrivateChannel.onAddContextListener': return this.handleOnAddContextListener(msg as PrivateChannelOnAddContextListenerAgentRequest, sc)
            case 'PrivateChannel.onUnsubscribe': return this.handleOnUnsubscribe(msg as PrivateChannelOnUnsubscribeAgentRequest, sc)

            // although we don't have messages for these yet, we're going to need them. See: https://github.com/finos/FDC3/issues/1171 
            case 'onUnsubscribe': return this.handleOnUnsubscribe(msg as OnUnsubscribeAgentRequest, sc)
            case 'onAddContextListener': return this.handleOnAddContextListener(msg as OnAddContextListenerAgentRequest, sc)
            case 'broadcastRequest': return this.handleBroadcast(msg as BroadcastAgentRequest, sc)

            // handling state synchronisation of channels
            case 'hello': return this.handleHello(msg as ConnectionStep2Hello, sc, from)
        }
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

    handleOnUnsubscribe(arg0: PrivateChannelOnUnsubscribeAgentRequest | OnUnsubscribeAgentRequest, _sc: ServerContext) {
        const lr = createListenerRegistration(arg0)
        const fi = this.regs.findIndex((e) => matches(e, lr))
        if (fi > -1) {
            this.regs.splice(fi, 1)
        }
    }

    handleOnAddContextListener(arg0: PrivateChannelOnAddContextListenerAgentRequest | OnAddContextListenerAgentRequest, _sc: ServerContext) {
        const lr = createListenerRegistration(arg0)
        this.regs.push(lr)
    }

    handleBroadcast(arg0: PrivateChannelBroadcastAgentRequest | BroadcastAgentRequest, sc: ServerContext) {
        const channelId = arg0.payload.channelId
        const context = arg0.payload.context
        const contextType = context.type

        this.regs
            .filter(r => {
                return (r.channelId == channelId) && ((r.contextType == null) || (r.contextType == contextType))
            })
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
        if (arg0.type == 'broadcastRequest') {
            var channelState: ContextElement[] = this.state[channelId] ?? []

            // remove previous context of same type
            channelState = channelState.filter(ce => ce.type != contextType)
            this.state[channelId] = channelState

            // add the new element of context
            channelState.push(context)
        }

    }
}


