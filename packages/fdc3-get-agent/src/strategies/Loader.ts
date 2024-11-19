import { DesktopAgent, WebDesktopAgentType } from '@kite9/fdc3-standard';
import { GetAgentParams } from '@kite9/fdc3-standard';

/**
 * Represents the common interface for a loading strategy
 */
export interface Loader {
  /**
   * Promise will either resolve to a DesktopAgent or _resolve_ to an error (not reject)
   */
  get(options: GetAgentParams): Promise<DesktopAgentSelection | void>;

  cancel(): void;
}

/** Specific partial of DesktopAgentDetails defining the details that Loaders
 *  must return with a DesktopAgent to be put into SessionStorage at the end
 *  of the process.
 */
export interface DesktopAgentSelection {
  agent: DesktopAgent;
  details: {
    agentType: WebDesktopAgentType;
    identityUrl: string;
    actualUrl: string;
    agentUrl?: string;
    appId?: string;
    instanceId?: string;
    instanceUuid?: string;
  };
}
