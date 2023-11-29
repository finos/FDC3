import { AppIdentifier } from "@finos/fdc3";
import { AgentRequestMessage } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { Messaging } from "../../src/Messaging";

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
        return crypto.randomUUID()
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

}