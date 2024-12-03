import { ContextHandler, DisplayMetadata, Listener, Channel } from "@kite9/fdc3-standard"
import { Context } from "@kite9/fdc3-context";

import { Messaging } from "../Messaging"
import { DefaultContextListener } from "../listeners/DefaultContextListener"
import { BrowserTypes } from "@kite9/fdc3-schema"

type BroadcastRequest = BrowserTypes.BroadcastRequest
type BroadcastResponse = BrowserTypes.BroadcastResponse
type GetCurrentContextResponse = BrowserTypes.GetCurrentContextResponse
type GetCurrentContextRequest = BrowserTypes.GetCurrentContextRequest

export class DefaultChannel implements Channel {

    readonly messaging: Messaging
    readonly id: string
    readonly type: "user" | "app" | "private"
    readonly displayMetadata?: DisplayMetadata | undefined;

    constructor(messaging: Messaging, id: string, type: "user" | "app" | "private", displayMetadata?: DisplayMetadata) {
        this.messaging = messaging
        this.id = id
        this.type = type
        this.displayMetadata = displayMetadata
    }

    async broadcast(context: Context): Promise<void> {
        const request: BroadcastRequest = {
            meta: this.messaging.createMeta(),
            payload: {
                channelId: this.id,
                context
            },
            type: "broadcastRequest"
        };
        await this.messaging.exchange<BroadcastResponse>(request, 'broadcastResponse')
    }

    async getCurrentContext(contextType?: string | undefined): Promise<Context | null> {
        const request: GetCurrentContextRequest = {
            meta: this.messaging.createMeta(),
            payload: {
                channelId: this.id,
                contextType: contextType ?? null
            },
            type: "getCurrentContextRequest"
        };

        // first, ensure channel state is up-to-date
        const response = await this.messaging.exchange<GetCurrentContextResponse>(request, 'getCurrentContextResponse')

        return response.payload.context ?? null
    }

    async addContextListener(contextType: any, handler?: ContextHandler): Promise<Listener> {
        let theContextType: string | null
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

        return await this.addContextListenerInner(theContextType, theHandler);
    }

    async addContextListenerInner(contextType: string | null, theHandler: ContextHandler): Promise<Listener> {
        const listener = new DefaultContextListener(this.messaging, this.id, contextType, theHandler);
        await listener.register()
        return listener
    }
}

