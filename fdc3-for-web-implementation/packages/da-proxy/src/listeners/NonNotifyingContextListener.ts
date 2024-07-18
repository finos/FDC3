import { ContextHandler } from "@finos/fdc3"
import { Messaging } from "../Messaging"
import { DefaultContextListener } from "./DefaultContextListener"

/**
 * A special context listener that doesn't notify via messaging.
 */
export class NonNotifyingContextListener extends DefaultContextListener {

    constructor(messaging: Messaging, 
        channelId: string | null, 
        contextType: string | null, 
        action: ContextHandler,
        messageType: string = "broadcastRequest") {
            super(messaging, channelId, contextType, action, messageType, null, null)
    }

}