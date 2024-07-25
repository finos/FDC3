import { Messaging } from "../Messaging";
import { HandshakeSupport } from "./HandshakeSupport";
import { GetInfoResponse, GetInfoRequest } from "@kite9/fdc3-common";
import { ImplementationMetadata } from "@finos/fdc3";

/**
 * This will eventually need extending to allow for auth handshaking.
 */
export class DefaultHandshakeSupport implements HandshakeSupport {

    readonly messaging: Messaging
    readonly fdc3Version: string
    private implementationMetadata: ImplementationMetadata | null = null

    constructor(messaging: Messaging, fdc3Version: string) {
        this.messaging = messaging
        this.fdc3Version = fdc3Version
    }

    async connect(): Promise<void> {
    }

    async disconnect(): Promise<void> {
    }

    async getImplementationMetadata(): Promise<ImplementationMetadata> {
        if (!this.implementationMetadata) {
            const response = await this.messaging.exchange<GetInfoResponse>({
                meta: this.messaging.createMeta(),
                type: 'getInfoRequest',
            } as GetInfoRequest,
                'getInfoResponse')

            this.implementationMetadata = response.payload.implementationMetadata!!
        }

        return this.implementationMetadata;
    }

}