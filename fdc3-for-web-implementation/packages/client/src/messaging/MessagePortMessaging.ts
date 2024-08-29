import { AbstractWebMessaging } from './AbstractWebMessaging'
import { RegisterableListener } from "@kite9/da-proxy"
import { GetAgentParams, WebConnectionProtocol3Handshake } from "@kite9/fdc3-common"
import { v4 as uuidv4 } from "uuid"

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

    constructor(cd: ConnectionDetails, deliveryTimeoutMs?: number) {
        super(cd.options, cd.connectionAttemptUuid, deliveryTimeoutMs)
        this.cd = cd;

        this.cd.messagePort.onmessage = (m) => {
            this.listeners.forEach((v, _k) => {
                console.log("Checking", v, m.data)
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
        this.listeners.set(l.id!!, l)
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
}

