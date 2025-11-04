import {
  AppRequestMessage,
  WebConnectionProtocol4ValidateAppIdentity,
  WebConnectionProtocol6Goodbye,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';
import { FDC3ServerInstance } from '../FDC3ServerInstance';
import { InstanceID } from '../AppRegistration';
import { FDC3ServerInstanceEvent } from '../FDC3ServerInstanceEvents';

export interface MessageHandler {
  /**
   * Handles an AgentRequestMessage from the messaging source. This function
   * is called by BasicFDC3Server on every message received and should only
   * process those it supports.
   */
  accept(
    msg: AppRequestMessage | WebConnectionProtocol4ValidateAppIdentity | WebConnectionProtocol6Goodbye,
    sc: FDC3ServerInstance,
    from: InstanceID
  ): Promise<void>;

  handleEvent(e: FDC3ServerInstanceEvent, sc: FDC3ServerInstance): Promise<void>;

  /**
   * Some handlers have event loops running (e.g. HeartbeatHandler) that need to be stopped.
   * Since handlers are shared between instances, shutdown shouldn't be necessary
   * very often.
   */
  shutdown(): void;
}
