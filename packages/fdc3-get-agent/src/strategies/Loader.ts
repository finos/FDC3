import { DesktopAgent } from '@kite9/fdc3-standard';
import { GetAgentParams } from '@kite9/fdc3-standard';

/**
 * Represents the common interface for a loading strategy
 */
export interface Loader {
  /**
   * Promise will either resolve to a DesktopAgent or _resolve_ to an error (not reject)
   */
  get(options: GetAgentParams): Promise<DesktopAgent | void>;

  cancel(): void;
}
