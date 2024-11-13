import { AppIdentifier, ImplementationMetadata, GetAgentParams } from "@kite9/fdc3-standard";
import { Messaging } from "../Messaging";
import { RegisterableListener } from "../listeners/RegisterableListener";
import { BrowserTypes } from "@kite9/fdc3-schema";
import { AddContextListenerRequestMeta } from "@kite9/fdc3-schema/generated/api/BrowserTypes";


type WebConnectionProtocol4ValidateAppIdentity = BrowserTypes.WebConnectionProtocol4ValidateAppIdentity
type WebConnectionProtocol5ValidateAppIdentitySuccessResponse = BrowserTypes.WebConnectionProtocol5ValidateAppIdentitySuccessResponse

export abstract class AbstractMessaging implements Messaging {

    private readonly options: GetAgentParams
    private readonly connectionAttemptUuid: string
    private readonly timeout: number
    private readonly actualUrl: string
    private appId: AppIdentifier | null = null
    private implementationMetadata: ImplementationMetadata | null = null

    abstract createUUID(): string
    abstract post(message: object): Promise<void>

    abstract register(l: RegisterableListener): void
    abstract unregister(id: string): void

    abstract createMeta(): AddContextListenerRequestMeta

    constructor(options: GetAgentParams, connectionAttemptUuid: string, actualUrl: string, timeout: number = 10016) {
        this.options = options
        this.connectionAttemptUuid = connectionAttemptUuid
        this.timeout = timeout
        this.actualUrl = actualUrl
    }

    getSource(): AppIdentifier {
        return this.appId!!
    }

    waitFor<X>(filter: (m: any) => boolean, timeoutErrorMessage?: string): Promise<X> {
        const id = this.createUUID()
        return new Promise<X>((resolve, reject) => {
            var done = false;
            const l: RegisterableListener = {
                id,
                filter: filter,
                action: (m) => {
                    done = true
                    this.unregister(id)
                    resolve(m)
                }
            } as RegisterableListener


            this.register(l);

            if (timeoutErrorMessage) {
                setTimeout(() => {
                    this.unregister(id)
                    if (!done) {
                        console.error(`Rejecting after ${this.timeout}ms with ${timeoutErrorMessage}`)
                        reject(new Error(timeoutErrorMessage))
                    }
                }, this.timeout);
            }

        })
    }


    async exchange<X>(message: any, expectedTypeName: string, timeoutErrorMessage?: string): Promise<X> {
        const errorMessage = timeoutErrorMessage ?? `Timeout waiting for ${expectedTypeName} with requestUuid ${message.meta.requestUuid}`
        const prom = this.waitFor(m =>
            (m.type == expectedTypeName)
            && (m.meta.requestUuid == message.meta.requestUuid), errorMessage)
        this.post(message)
        const out: any = await prom
        if (out?.payload?.error) {
            throw new Error(out.payload.error)
        } else {
            return out
        }
    }

    /**
     * This handles the verify exchange with the da-server,
     */
    async connect(): Promise<void> {
        const validationResponse = await this.exchangeValidationWithId<WebConnectionProtocol5ValidateAppIdentitySuccessResponse>(
            this.createValidationMessage(),
            this.connectionAttemptUuid
        )

        this.appId = {
            appId: validationResponse.payload.appId,
            instanceId: validationResponse.payload.instanceId
        }

        this.implementationMetadata = validationResponse.payload.implementationMetadata

        this.storeInstanceUuid(validationResponse)
    }

    async disconnect(): Promise<void> {
        this.appId = null;
        this.implementationMetadata = null;
    }

    getImplementationMetadata(): Promise<ImplementationMetadata> {
        return Promise.resolve(this.implementationMetadata!!)
    }

    private async exchangeValidationWithId<X>(message: any, connectionAttemptUuid: string): Promise<X> {
        const prom = this.waitFor(m =>
            (m.meta.connectionAttemptUuid == connectionAttemptUuid))
        this.post(message)
        const out: any = await prom
        if (out?.payload?.message) {
            throw new Error(out.payload.message)
        } else {
            return out
        }
    }

    /**
     * Sends the validate message through the nmessage port
     */
    private createValidationMessage(): WebConnectionProtocol4ValidateAppIdentity {
        var instanceUuid = this.retrieveInstanceUuid()

        const requestMessage: WebConnectionProtocol4ValidateAppIdentity = {
            type: 'WCP4ValidateAppIdentity',
            meta: {
                connectionAttemptUuid: this.connectionAttemptUuid,
                timestamp: new Date()
            },
            payload: {
                identityUrl: this.options.identityUrl!!,
                actualUrl: this.actualUrl,
                instanceUuid
            }
        }

        return requestMessage
    }

    /**
     * Used for restoring session details in case of reload
     */
    abstract retrieveInstanceUuid(): string | undefined

    /** 
     * Used for caching session details in case of reload
     */
    abstract storeInstanceUuid(validationResponse: WebConnectionProtocol5ValidateAppIdentitySuccessResponse): void

}