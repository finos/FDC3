import { AppIdentifier } from "@finos/fdc3"
import { AgentRequestMessage } from "@finos/fdc3/dist/bridging/BridgingTypes"
import { Messaging } from "da-proxy"
import { exchangePostMessage } from "fdc3-common"
import { v4 as uuidv4 } from "uuid"

type ListenerDetail = {
    filter: (m: AgentRequestMessage) => boolean,
    action: (m: AgentRequestMessage) => void
}

export class MessagePortMessaging implements Messaging {

    private readonly appId: AppIdentifier
    private readonly mp: MessagePort
    private readonly listeners : Map<string, ListenerDetail> = new Map()

    constructor(mp: MessagePort, appId: AppIdentifier) {
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

    register(filter: (m: any) => boolean, action: (m: any) => void): string {
        const id = this.createUUID();
        this.listeners.set(id,{
            filter,
            action
        })

        return id;
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
        return exchangePostMessage(this.mp, expectedTypeName, message).then(e => {
            return e.data as X
        });
    }
}