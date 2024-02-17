import { ICreateLog } from "@cucumber/cucumber/lib/runtime/attachment_manager";
import { AppIdentifier } from "@finos/fdc3";
import { AgentRequestMessage } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { v4 as uuidv4 } from 'uuid'
import { AbstractMessaging } from "../../src/messaging/AbstractMessaging";
import { RegisterableListener } from "../../src/listeners/RegisterableListener";

export class TestMessaging extends AbstractMessaging {

    readonly allPosts : AgentRequestMessage[] = []
    readonly listeners : Map<string, RegisterableListener> = new Map()
    
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
}