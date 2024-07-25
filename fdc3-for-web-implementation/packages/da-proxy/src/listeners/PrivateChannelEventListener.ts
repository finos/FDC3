import { Messaging } from "../Messaging"
import { AbstractListener } from "./AbstractListener"
import { BroadcastEvent } from "@kite9/fdc3-common"

type EVENT_TYPES_WITH_TYPE_HANDLER = "privateChannelOnAddContextListenerEvent" | "privateChannelOnUnsubscribeEvent"
export type EVENT_TYPES = EVENT_TYPES_WITH_TYPE_HANDLER | "privateChannelOnDisconnectEvent"

/**
 * For handling 
 * PrivateChannelOnAddContextListenerEvent, 
 * PrivateChannelOnDisconnectEvent, 
 * PrivateChannelOnUnsubscribeEvent
 */
abstract class AbstractPrivateChannelEventListener<X> extends AbstractListener<X> {

    readonly channelId: string
    readonly listenerType: string

    constructor(
        messaging: Messaging,
        channelId: string,
        listenerType: string,
        handler: X) {
        super(messaging, { channelId, listenerType }, handler, "privateChannelAddEventListener", "privateChannelUnsubscribeEventListener")
        this.channelId = channelId;
        this.listenerType = listenerType
    }

    filter(m: BroadcastEvent) {
        return (m.type == this.listenerType) && (this.channelId == m.payload?.channelId);
    }

    abstract action(m: any): void
}

export class PrivateChannelEventListenerVoid extends AbstractPrivateChannelEventListener<() => void> {

    constructor(
        messaging: Messaging,
        channelId: string,
        handler: () => void) {
        super(messaging, channelId, "privateChannelOnDisconnectEvent", handler)
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