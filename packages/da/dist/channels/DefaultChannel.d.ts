import { Context, ContextHandler, DisplayMetadata, Listener } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { StatefulChannel } from "./StatefulChannel";
export declare class DefaultChannel implements StatefulChannel {
    readonly messaging: Messaging;
    readonly id: string;
    readonly type: "user" | "app" | "private";
    readonly displayMetadata?: DisplayMetadata | undefined;
    readonly latestContextMap: Map<string, Context>;
    private latestContext;
    readonly listeners: Listener[];
    constructor(messaging: Messaging, id: string, type: "user" | "app" | "private", displayMetadata?: DisplayMetadata);
    broadcast(context: Context): Promise<void>;
    getCurrentContext(contextType?: string | undefined): Promise<Context | null>;
    addContextListener(contextType: any, handler?: ContextHandler): Promise<Listener>;
    addContextListenerInner(contextType: string | null, theHandler: ContextHandler): Promise<Listener>;
    getState(): Map<string, Context>;
}
