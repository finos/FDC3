import { Context, ContextHandler, Listener, PrivateChannel } from "@finos/fdc3";
import { DefaultChannel } from "./DefaultChannel";
import { Messaging } from "../Messaging";
import { EVENT_TYPES } from "./PrivateChannelEventListener";
export declare class DefaultPrivateChannel extends DefaultChannel implements PrivateChannel {
    constructor(messaging: Messaging, id: string);
    broadcast(context: Context): Promise<void>;
    notifyEventListenerAdded(t: EVENT_TYPES): void;
    onAddContextListener(handler: (contextType?: string | undefined) => void): Listener;
    onUnsubscribe(handler: (contextType?: string | undefined) => void): Listener;
    onDisconnect(handler: () => void): Listener;
    disconnect(): void;
    addContextListenerInner(contextType: string | null, theHandler: ContextHandler): Promise<Listener>;
}
