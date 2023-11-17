import { AppIdentifier } from "@finos/fdc3";
import { AgentRequestMessage, AgentResponseMessage, BridgeRequestMessage } from "@finos/fdc3/dist/bridging/BridgingTypes";

export interface Messaging {

    /**
     * Source for outgoing message
     */
    getSource(): AppIdentifier
    
     /**
     * UUID for outgoing message
     */
    createUUid(): string;

    /**
     * Post an outgoing message
     */
    post(message: AgentRequestMessage) : Promise<void>

    /**
     * Registers a listener for incoming messages.
     * 
     * @param filter A filter to ignore certain messages
     * @param action Action to take on non-ignored messages.
     */
    register(filter: (m: AgentRequestMessage) => boolean, action: (m: AgentRequestMessage) => void ) : string

    /**
     * Unregisters a listener with the id given above
     * @param id 
     */
    unregister(id: string)

    createMeta()
}