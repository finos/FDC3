import { Connectable } from "../Connectable"
import { ImplementationMetadata } from "@finos/fdc3"

/**
 * Handles messaging around connection and disconnection of the proxy
 * to the server.
 */
export interface HandshakeSupport extends Connectable {

    getImplementationMetadata(): Promise<ImplementationMetadata>
}