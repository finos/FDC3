import { Messaging } from "../Messaging"
import { RegisterableListener } from "./RegisterableListener"

/**
 * Common to all listeners - they need to be registered and unregistered with messaging and also
 * send notification messsages when connected and disconnected
 */
export abstract class AbstractListener<X> implements RegisterableListener {

    readonly messaging: Messaging
    private readonly subscribeType: string
    private readonly unsubscribeType: string
    private readonly payloadDetails: Record<string, string | null>
    id: string | null = null
    readonly handler: X

    constructor(messaging: Messaging, payloadDetails: Record<string, string | null>, handler: X, subscribeType: string, unsubscribeType: string) {
        this.messaging = messaging
        this.handler = handler
        this.payloadDetails = payloadDetails
        this.subscribeType = subscribeType
        this.unsubscribeType = unsubscribeType
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

            this.messaging.exchange<any>(notificationMessage, responseType!!)
        }
    }

    async unsubscribe(): Promise<void> {
        this.messaging.unregister(this.id!!)
        await this.listenerNotification(this.unsubscribeType)
    }

    async register() {
        const response = await this.messaging.exchange<any>({
            meta: this.messaging.createMeta(),
            type: this.subscribeType + 'Request',
            payload: this.payloadDetails,
        }, this.subscribeType + 'Response')

        this.id = response.payload.listenerUUID
        this.messaging.register(this)
        this.listenerNotification(this.subscribeType)
    }
}