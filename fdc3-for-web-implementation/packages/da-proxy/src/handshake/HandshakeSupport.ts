import { ConnectionStep3HandshakePayload } from "@finos/fdc3/dist/bridging/BridgingTypes"
import { Connectable } from "../Connectable"

/**
 * Handles messaging around connection and disconnection of the proxy
 * to the server.
 */
export interface HandshakeSupport extends Connectable {

    getHandshakePayload(): ConnectionStep3HandshakePayload | null

}