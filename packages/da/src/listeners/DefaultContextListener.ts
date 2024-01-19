import { ContextHandler, Listener } from "@finos/fdc3";
import { Messaging } from "../Messaging";

export class DefaultContextListener implements Listener {

    readonly messaging: Messaging
    readonly id: string
    readonly filter: (m: object) => boolean
    readonly action: ContextHandler

    constructor(messaging: Messaging, filter: (m: any) => boolean, action: ContextHandler) {
        this.messaging = messaging;
        this.id = this.messaging.register(filter, m => {
            const context = m?.payload?.context
            action(context)
        })
        this.filter = filter;
        this.action = action;
    }

    unsubscribe(): void {
        this.messaging.unregister(this.id)
    }
}