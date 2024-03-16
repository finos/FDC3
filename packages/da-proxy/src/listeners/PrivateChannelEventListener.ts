import { PrivateChannelBroadcastAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes"
import { Messaging } from "../Messaging"
import { AbstractListener } from "./AbstractListener"

type EVENT_TYPES_WITH_TYPE_HANDLER = "onAddContextListener" | "onUnsubscribe"
export type EVENT_TYPES = EVENT_TYPES_WITH_TYPE_HANDLER | "onDisconnect"

abstract class AbstractPrivateChannelEventListener<X> extends AbstractListener<X> {

    readonly channelId: string
    readonly listenerType: string

    constructor(
        messaging: Messaging,
        channelId: string,
        listenerType: string,
        handler: X) {
        super(messaging, { channelId, listenerType }, handler, "PrivateChannel.eventListenerAdded", "PrivateChannel.eventListenerRemoved")
        this.channelId = channelId;
        this.listenerType = listenerType
    }

    filter(m: PrivateChannelBroadcastAgentRequest) {
        return (m.type == "PrivateChannel." + this.listenerType) && (this.channelId == m.payload?.channelId);
    }

    abstract action(m: any): void
}

export class PrivateChannelEventListenerVoid extends AbstractPrivateChannelEventListener<() => void> {

    constructor(
        messaging: Messaging,
        channelId: string,
        handler: () => void) {
        super(messaging, channelId, "onDisconnect", handler)
    }

    action(_m: any): void {
        this.handler()
    }

}

export class PrivateChannelEventListenerType extends AbstractPrivateChannelEventListener<(m: string) => void> {

    constructor(
        messaging: Messaging,
        channelId: string,
        listenerType: EVENT_TYPES_WITH_TYPE_HANDLER,
        handler: (s: string) => void) {
        super(messaging, channelId, listenerType, handler)
    }

    action(m: any): void {
        this.handler(m.payload.contextType)
    }

}