import { ContextHandler, Listener } from "@finos/fdc3";
import { Messaging } from "../Messaging";
import { BroadcastAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";

export class DefaultContextListener implements Listener {

    readonly messaging: Messaging
    readonly id: string
    readonly channelId: string
    readonly contextType: string | null

    constructor(messaging: Messaging, type: string, channelId: string, contextType: string | null, action: ContextHandler) {
        this.messaging = messaging;
        this.id = channelId;
        this.contextType = contextType;

        const filter = (m) => (m.type == type) 
                && (m.payload.channelId == this.id)
                && ((m.payload.context?.type == contextType) || (contextType == null));

        this.id = this.messaging.register(filter, m => {
            const context = m?.payload?.context
            action(context)
        })
    }

    unsubscribe(): void {
        this.messaging.unregister(this.id)
    }
}

