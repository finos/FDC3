import { ICreateLog } from "@cucumber/cucumber/lib/runtime/attachment_manager";
import { AppIdentifier } from "@finos/fdc3";
import { AgentRequestMessage } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { v4 as uuidv4 } from 'uuid'
import { Messaging } from "../../src";


type ListenerDetail = {
    filter: (m: AgentRequestMessage) => boolean,
    action: (m: AgentRequestMessage) => void
}

export class TestMessaging implements Messaging {

    readonly allPosts : AgentRequestMessage[] = []
    readonly listeners : Map<string, ListenerDetail> = new Map()
    
    getSource(): AppIdentifier {
        return {
            appId: "SomeDummyApp",
            instanceId: "some.dummy.instance"
        }
    }

    createUUID() : string {
        return uuidv4()
    }

    post(message: AgentRequestMessage): Promise<void> {
        this.allPosts.push(message);
        return Promise.resolve();
    }

    register(filter: (m: AgentRequestMessage) => boolean, action: (m: AgentRequestMessage) => void): string {
        const id = this.createUUID();
        this.listeners.set(id,{
            filter,
            action
        })

        return id;
    }

    unregister(id: string) {
        this.listeners.delete(id)
    }

    createMeta() {
        return {
            "requestUuid": this.createUUID(),
            "timestamp": new Date(),
            "source": this.getSource()
        }
    }

    receive(m: AgentRequestMessage, log: ICreateLog) {
        this.listeners.forEach((v, k) => {
            if (v.filter(m)) {
                log("Processing in "+k)
                v.action(m)
            } else {
                log("Ignoring in "+k)
            }
        })
    }

    exchange<X>(_message: object, _expectedTypeName: string): Promise<X> {
        throw new Error("not yet implemented")
    }
}