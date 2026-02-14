import { InstanceID } from './ServerContext.js';
import { BrowserTypes } from '@finos/fdc3-schema';

type AppRequestMessage = BrowserTypes.AppRequestMessage;

export interface FDC3Server {
  /**
   * Receive an incoming message
   */
  receive(message: AppRequestMessage, from: InstanceID): Promise<void>;

  /**
   * Cleanup state relating to an instance that has disconnected
   */
  cleanup(instanceId: InstanceID): void;
}
