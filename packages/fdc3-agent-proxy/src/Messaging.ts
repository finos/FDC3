import { Connectable, AppIdentifier, ImplementationMetadata } from "@kite9/fdc3-standard";
import { RegisterableListener } from "./listeners/RegisterableListener";
import { AddContextListenerRequest, AddContextListenerRequestMeta } from "@kite9/fdc3-schema/generated/api/BrowserTypes";

export interface Messaging extends Connectable {

    /**
     * Source for outgoing message
     */
    getSource(): AppIdentifier

    /**
    * UUID for outgoing message
    */
    createUUID(): string;

    /**
     * Post an outgoing message
     */
    post(message: object): Promise<void>

    /**
     * Registers a listener for incoming messages.
     */
    register(l: RegisterableListener): void

    /**
     * Unregisters a listener with the id given above
     * @param id 
     */
    unregister(id: string): void

    createMeta(): AddContextListenerRequestMeta

    /**
     * Waits for a specific matching message
     */
    waitFor<X>(filter: (m: any) => boolean, timeoutErrorMessage?: string): Promise<X>

    /**
     * 
     * @param message Performs a request / response message pass
     */
    exchange<X>(message: object, expectedTypeName: string, timeoutErrorMessage?: string): Promise<X>

    /**
     * Implementation metadata retrieved through the validation process
     */
    getImplementationMetadata(): Promise<ImplementationMetadata>
}