import { AppIdentifier } from "@finos/fdc3";

export interface Messaging {
    
     /**
     * UUID for outgoing message
     */
    createUUID(): string;

    /**
     * Post an outgoing message
     */
    post(message: object) : Promise<void>

    /**
     * Receive an incoming message
     */
    receive(message: RequestMe)

   

    createMeta() : object
}
