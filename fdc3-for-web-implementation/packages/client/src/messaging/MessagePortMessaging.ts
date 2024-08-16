import { AppIdentifier } from "@finos/fdc3"
import { AbstractMessaging } from "@kite9/da-proxy"
import { RegisterableListener } from "@kite9/da-proxy"
import { v4 as uuidv4 } from "uuid"
import { exchangePostMessage } from "./exchange"

export class MessagePortMessaging extends AbstractMessaging {

    private readonly appId: AppIdentifier
    private readonly mp: MessagePort
    private readonly listeners: Map<string, RegisterableListener> = new Map()
    deliveryTimeoutMs: number = 10000

    constructor(mp: MessagePort, appId: AppIdentifier) {
        super()
        this.appId = appId
        this.mp = mp;

        this.mp.onmessage = (m) => {
            this.listeners.forEach((v, _k) => {
                if (v.filter(m.data)) {
                    v.action(m.data)
                }
            })
        }
    }

    getSource(): AppIdentifier {
        return this.appId;
    }

    createUUID(): string {
        return uuidv4();
    }
    post(message: object): Promise<void> {
        this.mp.postMessage(message);
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
        return exchangePostMessage(this.mp, expectedTypeName, message, this.deliveryTimeoutMs).then(e => {
            return e.data as X
        });
    }
}