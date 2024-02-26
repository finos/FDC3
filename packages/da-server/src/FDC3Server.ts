import { AgentRequestMessage } from "@finos/fdc3/dist/bridging/BridgingTypes";

export interface FDC3Server {

  /**
   * Receive an incoming message
   */
  receive(message: AgentRequestMessage) : void


}