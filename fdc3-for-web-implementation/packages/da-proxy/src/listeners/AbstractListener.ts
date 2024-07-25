import { Messaging } from "../Messaging"
import { RegisterableListener } from "./RegisterableListener"

/**
 * Common to all listeners - they need to be registered and unregistered with messaging and also
 * send notification messsages when connected and disconnected
 */
export abstract class AbstractListener<X> implements RegisterableListener {

    readonly messaging: Messaging
    private readonly unsubscribeType: string | null
    private readonly payloadDetails: Record<string, string | null>
    readonly id: string
    readonly handler: X

    constructor(messaging: Messaging, payloadDetails: Record<string, string | null>, handler: X, subscribeType: string | null, unsubscribeType: string | null) {
        this.messaging = messaging
        this.id = this.messaging.createUUID()
        this.handler = handler
        this.payloadDetails = payloadDetails
        this.unsubscribeType = unsubscribeType
        this.messaging.register(this)
        this.listenerNotification(subscribeType)
    }

    abstract filter(m: any): boolean

    abstract action(m: any): void

    async listenerNotification(type: string | null): Promise<void> {
        if (type) {
            const requestType = type + "Request"
            const responseType = type + "Response"

            // send notification
            const notificationMessage = {
                meta: this.messaging.createMeta(),
                payload: {
                    ...this.payloadDetails
                },
                requestType
            }

            const out = await this.messaging.exchange<any>(notificationMessage, responseType!!)
            if (out?.payload?.error) {
                throw new Error(out.payload.error)
            }
        }
    }

    async unsubscribe(): Promise<void> {
        this.messaging.unregister(this.id)
        await this.listenerNotification(this.unsubscribeType)
    }
}