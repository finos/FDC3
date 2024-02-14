import { Context, ContextHandler, DisplayMetadata, Listener } from "@finos/fdc3"
import { Messaging } from "../Messaging"
import { BroadcastAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes"
import { ChannelContextListener } from "./ChannelContextListener"
import { StatefulChannel } from "./StatefulChannel"

export class DefaultChannel implements StatefulChannel {

    readonly messaging: Messaging
    readonly id: string
    readonly type: "user" | "app" | "private"
    readonly displayMetadata?: DisplayMetadata | undefined;

    readonly latestContextMap: Map<string, Context> = new Map()
    private latestContext: Context | null = null 
    readonly listeners: Listener[] = []

    constructor(messaging: Messaging, id: string, type: "user" | "app" | "private", displayMetadata? : DisplayMetadata) {
        this.messaging = messaging
        this.id = id
        this.type = type
        this.displayMetadata = displayMetadata
        this._addCurrentContextListener();
    }

    broadcast(context: Context): Promise<void> {
        const message : BroadcastAgentRequest = {
            meta: {
                requestUuid: this.messaging.createUUID(),
                timestamp: new Date(),
                source: this.messaging.getSource()
            },
            payload: {
                channelId : this.id,
                context
            },
            type: "broadcastRequest"
        }
        return this.messaging.post(message);
    }

    getCurrentContext(contextType?: string | undefined): Promise<Context | null> {
        if (contextType) {
            return Promise.resolve(this.latestContextMap.get(contextType) ?? null)
        } else {
            return Promise.resolve(this.latestContext);
        }
    }

    /**
     * Special internal listener that keeps track of current context
     */
    _addCurrentContextListener() {
        const listener = new ChannelContextListener(this.messaging, this.id, null, (ctx) => {
            this.latestContextMap.set(ctx.type, ctx);
            this.latestContext = ctx;
        });

        this.listeners.push(listener)
    }

    addContextListener(contextType: any, handler?: ContextHandler): Promise<Listener> {
        let theContextType : string | null
        let theHandler: ContextHandler
        
        if (contextType == null) {
            theContextType = null;
            theHandler = handler as ContextHandler;
        } else if (typeof contextType === 'string') {
            theContextType = contextType
            theHandler = handler as ContextHandler;
        } else {
            // deprecated one-arg version
            theContextType = null;
            theHandler = contextType as ContextHandler;
        }

        return this.addContextListenerInner(theContextType, theHandler);     
    }

    addContextListenerInner(contextType: string | null, theHandler: ContextHandler): Promise<Listener> {
        const listener = new ChannelContextListener(this.messaging, this.id, contextType, theHandler);
        this.listeners.push(listener)
        return Promise.resolve(listener)   
    }

    getState() : Map<string, Context> {
        return this.latestContextMap;
    }
}

