import { Messaging } from "../Messaging"
import { RegisterableListener } from "./RegisterableListener"

/**
 * Common to all listeners - they need to be registered and unregistered with messaging and also
 * send notification messsages when connected and disconnected
 */
export abstract class AbstractListener<X> implements RegisterableListener {

    private readonly messaging: Messaging
    private readonly unsubscribeType: string | null
    private readonly payloadDetails: Record<string, string | null>
    readonly id: string
    readonly handler:X
 
    constructor(messaging: Messaging, payloadDetails: Record<string, string | null>,  handler: X, subscribeType: string | null, unsubscribeType: string | null) {
        this.messaging = messaging
        this.id = this.messaging.createUUID()
        this.handler = handler
        this.payloadDetails = payloadDetails
        this.unsubscribeType = unsubscribeType
        this.messaging.register(this)
        this.listenerNotification(subscribeType)
    }

    abstract filter(m: any) : boolean

    abstract action(m: any) : void 
 
    listenerNotification(type: string | null) {
        if (type) {
            // send notification
            const notificationMessage = {
                meta: this.messaging.createMeta(),
                payload: {
                    ...this.payloadDetails
                },
                type
            }

            this.messaging.post(notificationMessage)
        }
    }

    unsubscribe(): void {
        this.messaging.unregister(this.id)
        this.listenerNotification(this.unsubscribeType)
    }
}