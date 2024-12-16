import { Listener } from '@kite9/fdc3-standard';

/**
 * Extends the basic concept of FDC3 listeners to include lifecycle methods.
 * All fdc3-agent-proxy listeners implement this interface and should be
 * initialized with the register() method before use.
 */
export interface RegisterableListener extends Listener {
  id: string | null;
  filter(m: any): boolean;
  action(m: any): void;
  /**
   * Listeners need to be registered in order to set their IDs.
   */
  register(): Promise<void>;
}
