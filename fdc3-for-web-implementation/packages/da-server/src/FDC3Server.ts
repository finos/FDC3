import { AppRequestMessage } from "@kite9/fdc3-common";
import { InstanceID } from "./ServerContext";

export interface FDC3Server {

  /**
   * Receive an incoming message
   */
  receive(message: AppRequestMessage, from: InstanceID): void

}