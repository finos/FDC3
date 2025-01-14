import { InstanceID } from './ServerContext';
import { BrowserTypes } from '@kite9/fdc3-schema';

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
