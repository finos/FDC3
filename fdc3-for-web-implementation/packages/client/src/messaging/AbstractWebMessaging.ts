import { DesktopAgentDetails, WebDesktopAgentType, GetAgentParams, WebConnectionProtocol5ValidateAppIdentitySuccessResponse } from "@kite9/fdc3-common";
import { RegisterableListener, AbstractMessaging } from "@kite9/da-proxy";

const DESKTOP_AGENT_SESSION_STORAGE_DETAILS_KEY = "fdc3-desktop-agent-details"

/**
 * Version of Messaging which is able to store details in the SessionState (i.e. works on the web)
 */
export abstract class AbstractWebMessaging extends AbstractMessaging {

    constructor(options: GetAgentParams, connectionAttemptUuid: string) {
        super(options, connectionAttemptUuid)
    }

    abstract createUUID(): string
    abstract post(message: object): Promise<void>

    abstract register(l: RegisterableListener): void
    abstract unregister(id: string): void

    abstract createMeta(): object

    /**
     * Used to allow session-reconnection
     */
    storeInstanceUuid(vr: WebConnectionProtocol5ValidateAppIdentitySuccessResponse) {
        const details: DesktopAgentDetails = {
            agentType: WebDesktopAgentType.PROXY_PARENT,
            instanceUuid: vr.payload.instanceUuid,
            appId: vr.payload.appId,
            instanceId: vr.payload.instanceId,
        }

        globalThis.sessionStorage.setItem(DESKTOP_AGENT_SESSION_STORAGE_DETAILS_KEY, JSON.stringify(details))
    }

    /**
     * Stores the instanceUuid in session storage in case session needs reconnecting
     */
    retrieveInstanceUuid(): string | undefined {
        const detailsStr: string | null = globalThis.sessionStorage.getItem(DESKTOP_AGENT_SESSION_STORAGE_DETAILS_KEY)

        if (detailsStr) {
            const details = JSON.parse(detailsStr) as DesktopAgentDetails
            if (details.agentType == WebDesktopAgentType.PROXY_PARENT) {
                return details.instanceUuid
            }
        }

        return undefined;
    }

}