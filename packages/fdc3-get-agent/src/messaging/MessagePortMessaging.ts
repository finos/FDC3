import { AbstractMessaging, RegisterableListener } from "@kite9/fdc3-agent-proxy"
import { AppIdentifier, GetAgentParams, WebDesktopAgentType } from "@kite9/fdc3-standard"
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

const DEFAULT_TIMEOUT = 10016;
export class MessagePortMessaging extends AbstractMessaging {

    private readonly cd: ConnectionDetails
    private readonly listeners: Map<string, RegisterableListener> = new Map()

    constructor(cd: ConnectionDetails, appIdentifier: AppIdentifier) {
        super(appIdentifier);
        this.cd = cd;

        this.cd.messagePort.onmessage = (m) => {
            this.listeners.forEach((v) => {
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
        this.listeners.set(l.id!, l)
    }

    unregister(id: string): void {
        this.listeners.delete(id)
    }

    createMeta(): AppRequestMessage['meta'] {
        return {
            "requestUuid": this.createUUID(),
            "timestamp": new Date(),
            "source": super.getAppIdentifier()
        }
    }

    getTimeoutMs(): number {
        return this.cd.options.timeoutMs ?? DEFAULT_TIMEOUT;
    }

    async disconnect(): Promise<void> {
        this.cd.messagePort.close()
    }
}

