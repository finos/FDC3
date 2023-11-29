import { AppIdentifier } from "@finos/fdc3";
export interface Messaging {
    /**
     * Source for outgoing message
     */
    getSource(): AppIdentifier;
    /**
    * UUID for outgoing message
    */
    createUUID(): string;
    /**
     * Post an outgoing message
     */
    post(message: object): Promise<void>;
    /**
     * Registers a listener for incoming messages.
     *
     * @param filter A filter to ignore certain messages
     * @param action Action to take on non-ignored messages.
     */
    register(filter: (m: any) => boolean, action: (m: any) => void): string;
    /**
     * Unregisters a listener with the id given above
     * @param id
     */
    unregister(id: string): void;
    createMeta(): object;
}
