import { AppIdentifier } from "@finos/fdc3";
import { AgentRequestMessage } from "@kite9/fdc3-common";
import { AbstractMessaging } from "@kite9/da-proxy";
import { RegisterableListener } from "@kite9/da-proxy";
import { v4 as uuidv4 } from 'uuid'
import { FindIntent } from "./responses/FindIntent";
import { RaiseIntent } from "./responses/RaiseIntent";


export interface AutomaticResponse {

    filter: (t: string) => boolean,
    action: (input: object, m: TestMessaging) => Promise<void>

}

export class TestMessaging extends AbstractMessaging {

    readonly listeners: Map<string, RegisterableListener> = new Map()
    readonly allPosts: AgentRequestMessage[] = []

    constructor() {
        super()
    }

    readonly automaticResponses: AutomaticResponse[] = [
        new FindIntent(),
        new RaiseIntent()
    ]

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


    post(message: AgentRequestMessage): Promise<void> {
        this.allPosts.push(message)
        for (let i = 0; i < this.automaticResponses.length; i++) {
            const ar = this.automaticResponses[i]
            if (ar.filter(message.type)) {
                return ar.action(message, this)
            }
        }

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