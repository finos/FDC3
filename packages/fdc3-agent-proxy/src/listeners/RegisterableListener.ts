import { AgentEventMessage, AgentResponseMessage } from '@finos/fdc3-schema/generated/api/BrowserTypes';
import { Listener } from '@finos/fdc3-standard';

/**
 * Extends the basic concept of FDC3 listeners to include lifecycle methods.
 * All fdc3-agent-proxy listeners implement this interface and should be
 * initialized with the register() method before use.
 */
export interface RegisterableListener extends Listener {
  id: string | null;
  filter(m: AgentEventMessage | AgentResponseMessage): boolean;
  action(m: AgentEventMessage | AgentResponseMessage): void;
  /**
   * Listeners need to be registered in order to set their IDs.
   */
  register(): Promise<void>;
}
