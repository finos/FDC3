import { AppIdentifier } from "@finos/fdc3";
import { AgentRequestMessage } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { AbstractMessaging } from "@kite9/da-proxy";
import { RegisterableListener } from "@kite9/da-proxy/dist/src/listeners/RegisterableListener";
import { v4 as uuidv4 } from 'uuid'

export class TestMessaging extends AbstractMessaging {

    readonly listeners: Map<string, RegisterableListener> = new Map()

    constructor() {
        super()
    }

    register(l: RegisterableListener) {
        this.listeners.set(l.id, l)
    }

    unregister(id: string) {
        this.listeners.delete(id)
    }

    createMeta() {
        return {
            "requestUuid": this.createUUID(),
            "timestamp": new Date(),
            "source": this.getSource(),
            "responseUuid": this.createUUID()
        }
    }


    getSource(): AppIdentifier {
        return {
            appId: "SomeDummyApp",
            instanceId: "some.dummy.instance"
        }
    }

    createUUID(): string {
        return uuidv4()
    }


    post(_message: AgentRequestMessage): Promise<void> {
        return Promise.resolve();
    }

    receive(m: any) {
        this.listeners.forEach((v, k) => {
            if (v.filter(m)) {
                console.log("Processing in " + k)
                v.action(m)
            } else {
                console.log("Ignoring in " + k)
            }
        })
    }
}