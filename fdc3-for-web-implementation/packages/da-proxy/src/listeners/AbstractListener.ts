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

    async listenerNotification(type: string | null): Promise<string | null> {
        if (type) {
            const requestType = type + "Request"
            const responseType = type + "Response"
            var notificationMessage: any
            if (this.id) {
                notificationMessage = {
                    meta: this.messaging.createMeta(),
                    payload: {
                        listenerUUID: this.id
                    },
                    type: requestType
                }
            } else {
                // send subscription notification
                notificationMessage = {
                    meta: this.messaging.createMeta(),
                    payload: {
                        ...this.payloadDetails
                    },
                    type: requestType
                }
            }

            const response = await this.messaging.exchange<any>(notificationMessage, responseType!!)
            return response?.payload?.listenerUUID ?? null
        } else {
            return null
        }
    }

    async unsubscribe(): Promise<void> {
        this.messaging.unregister(this.id!!)
        await this.listenerNotification(this.unsubscribeType)
    }

    async register() {
        const id = await this.listenerNotification(this.subscribeType)!!
        this.id = id
        this.messaging.register(this)
    }
}