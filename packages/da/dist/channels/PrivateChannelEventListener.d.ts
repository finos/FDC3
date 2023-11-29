import { Listener } from "@finos/fdc3";
import { Messaging } from "../Messaging";
export type EVENT_TYPES = "onAddContextListener" | "onDisconnect" | "onUnsubscribe";
export declare class PrivateChannelEventListener implements Listener {
    readonly messaging: Messaging;
    readonly listenerId: string;
    readonly channelId: string;
    readonly messageTypeFilter: EVENT_TYPES;
    constructor(messaging: Messaging, channelId: string, messageTypeFilter: EVENT_TYPES, action: (m: any) => void);
    unsubscribe(): void;
}
