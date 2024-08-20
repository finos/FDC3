import { AbstractWebMessaging } from './AbstractWebMessaging'
import { RegisterableListener } from "@kite9/da-proxy"
import { GetAgentParams, WebConnectionProtocol3Handshake } from "@kite9/fdc3-common"
import { v4 as uuidv4 } from "uuid"
import { exchangePostMessage } from "./exchange"

/**
 * Details needed to set up the Messaging instance
 */
export type ConnectionDetails = {
    connectionAttemptUuid: string
    handshake: WebConnectionProtocol3Handshake,
    messagePort: MessagePort,
    options: GetAgentParams
}

export class MessagePortMessaging extends AbstractWebMessaging {

    private readonly cd: ConnectionDetails
    private readonly listeners: Map<string, RegisterableListener> = new Map()
    deliveryTimeoutMs: number = 10000

    constructor(cd: ConnectionDetails) {
        super(cd.options, cd.connectionAttemptUuid)
        this.cd = cd;

        this.cd.messagePort.onmessage = (m) => {
            this.listeners.forEach((v, _k) => {
                if (v.filter(m.data)) {
                    v.action(m.data)
                }
            })
        }
    }

    createUUID(): string {
        return uuidv4();
    }

    post(message: object): Promise<void> {
        this.cd.messagePort.postMessage(message);
        return Promise.resolve();
    }

    register(l: RegisterableListener): void {
        if (l.id != null) {
            this.listeners.set(l.id, l)
        } else {
            throw new Error("Listener must have an id")
        }
    }

    unregister(id: string): void {
        this.listeners.delete(id)
    }

    createMeta(): object {
        return {
            "requestUuid": this.createUUID(),
            "timestamp": new Date(),
            "source": this.getSource()
        }
    }

    exchange<X>(message: object, expectedTypeName: string): Promise<X> {
        return exchangePostMessage(this.cd.messagePort, expectedTypeName, message, this.deliveryTimeoutMs).then(e => {
            return e.data as X
        });
    }


}

