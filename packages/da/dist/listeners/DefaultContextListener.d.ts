import { ContextHandler, Listener } from "@finos/fdc3";
import { Messaging } from "../Messaging";
export declare class DefaultContextListener implements Listener {
    readonly messaging: Messaging;
    readonly id: string;
    readonly filter: (m: object) => boolean;
    readonly action: ContextHandler;
    constructor(messaging: Messaging, filter: (m: any) => boolean, action: ContextHandler);
    unsubscribe(): void;
}
