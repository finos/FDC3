import { AppRequestMessage } from "@kite9/fdc3-common";
import { InstanceUUID } from "./ServerContext";

export interface FDC3Server {

  /**
   * Receive an incoming message
   */
  receive(message: AppRequestMessage, from: InstanceUUID): void

}