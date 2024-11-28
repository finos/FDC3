import {
  DesktopAgentDetails,
  DESKTOP_AGENT_SESSION_STORAGE_KEY_PREFIX,
} from '@kite9/fdc3-standard';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../util/Logger';

export function createUUID(): string {
  return uuidv4();
}

/**
 * Note that we also key by the window name as well, in case multiple iframes are using the same session storage.
 */
export function sessionKey(): string {
  //If the window or frame is not named, create and apply a unique name to it
  if (!globalThis.window.name) {
    globalThis.window.name = createUUID();
  }
  const windowName = globalThis.window.name;
  const keyName = DESKTOP_AGENT_SESSION_STORAGE_KEY_PREFIX + '-' + windowName;
  return keyName;
}

/** Used to persist data on the connection, which can later be used to ensure
 *  reconnection to the same Desktop Agent and to request the same instanceId.
 */
export function storeDesktopAgentDetails(details: DesktopAgentDetails){
  Logger.debug(`DesktopAgentDetails: Storing Desktop Agent details:`, details);
	//check if there are existing details in storage to update
	let detailsToStore = retrieveAllDesktopAgentDetails();
	if (!detailsToStore) {
	  detailsToStore = {};
	}
	detailsToStore[details.identityUrl] = details;
	globalThis.sessionStorage.setItem(sessionKey(), JSON.stringify(detailsToStore));
}

/** Retrieves persisted data about previous connections. Used to ensure reconnection
 *  to the same agent and to request the same instanceId.
 */
export function retrieveAllDesktopAgentDetails(): Record<string, DesktopAgentDetails> | null {
  const detailsStr = globalThis.sessionStorage.getItem(sessionKey());

  if (detailsStr) {
    try {
      return JSON.parse(detailsStr) as Record<string, DesktopAgentDetails>;
    } catch (e) {
      Logger.error(`DesktopAgentDetails: FDC3 connection data couldn't be parsed\nstorage key: ${sessionKey()}\nvalue: ${detailsStr}`);
      return null;
    }
  } else {
    return null;
  }
}

/** Retrieves persisted data about previous connections for this specific app
   *  (identified by the identityUrl). Used to ensure reconnection to the same
   *  agent and to request the same instanceId.
   */
export function retrieveDesktopAgentDetails(identityUrl: string): DesktopAgentDetails | null {
  
  const allDetails = retrieveAllDesktopAgentDetails();
  Logger.log(`DesktopAgentDetails: retrieveDesktopAgentDetails:`, allDetails);  
    if (allDetails) {
      return allDetails[identityUrl];
    } else {
      return null;
    }
  }