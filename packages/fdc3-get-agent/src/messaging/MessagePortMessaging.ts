import { AbstractWebMessaging } from './AbstractWebMessaging'
import { RegisterableListener } from "@kite9/fdc3-agent-proxy"
import { GetAgentParams, WebDesktopAgentType } from "@kite9/fdc3-standard"
import { v4 as uuidv4 } from "uuid"
import { BrowserTypes } from "@kite9/fdc3-schema";
import { AppRequestMessage } from '@kite9/fdc3-schema/generated/api/BrowserTypes';
type WebConnectionProtocol3Handshake = BrowserTypes.WebConnectionProtocol3Handshake

/**
 * Details needed to set up the Messaging instance and Desktop AgentDetails record
 */
export type ConnectionDetails = {
    connectionAttemptUuid: string
    handshake: WebConnectionProtocol3Handshake,
    messagePort: MessagePort,
    actualUrl: string,
    options: GetAgentParams,
    agentType: WebDesktopAgentType,
    agentUrl?: string,
}

export class MessagePortMessaging extends AbstractWebMessaging {

    private readonly cd: ConnectionDetails
    private readonly listeners: Map<string, RegisterableListener> = new Map()

    constructor(cd: ConnectionDetails) {
        super(cd.options, cd.connectionAttemptUuid, cd.actualUrl);
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
        this.listeners.set(l.id!!, l)
    }

    unregister(id: string): void {
        this.listeners.delete(id)
    }

    createMeta(): AppRequestMessage['meta'] {
        return {
            "requestUuid": this.createUUID(),
            "timestamp": new Date(),
            "source": super.getSource()!
        }
    }

    waitFor<X>(filter: (m: any) => boolean, timeoutErrorMessage?: string): Promise<X> {
        // console.log("Waiting for", filter, timeoutErrorMessage)
        return super.waitFor(filter, timeoutErrorMessage).then((v: any) => {
            // console.log("Wait over ", v, timeoutErrorMessage)
            return v;
        })
    }

    async disconnect(): Promise<void> {
        await super.disconnect()
        this.cd.messagePort.close()
    }
}

