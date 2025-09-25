import { DesktopAgentDetails, DESKTOP_AGENT_SESSION_STORAGE_KEY_PREFIX } from '@finos/fdc3-standard';
import { Logger } from '../util/Logger.js';
import { createUUID } from '../util/Uuid.js';

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
export function storeDesktopAgentDetails(details: DesktopAgentDetails) {
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
      const theData: Record<string, DesktopAgentDetails> = JSON.parse(detailsStr) as Record<
        string,
        DesktopAgentDetails
      >;
      if (typeof theData !== 'object' || Array.isArray(theData)) {
        throw new Error('Stored DesktopAgentDetails is not in the expected format!');
      }
      return theData;
    } catch (e) {
      Logger.warn(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        `DesktopAgentDetails: FDC3 connection data couldn't be parsed\nstorage key: ${sessionKey()}\nvalue: ${detailsStr}\nmessage: ${(e as any).message ?? e}`
      );
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
  Logger.debug(`DesktopAgentDetails: retrieveDesktopAgentDetails:`, allDetails);
  if (allDetails) {
    const theData: DesktopAgentDetails = allDetails[identityUrl];

    if (theData) {
      //check we got the minimum properties
      if (
        typeof theData.agentType === 'string' &&
        theData.agentType && //TODO: check this is one of the enum values
        typeof theData.appId === 'string' &&
        theData.appId &&
        typeof theData.instanceId === 'string' &&
        theData.instanceId
      ) {
        return theData;
      } else {
        //ignore it and post a warning
        Logger.warn(
          `DesktopAgentDetails: Stored details do not meet minimum requirements and will be ignored:\n${JSON.stringify(theData, null, 2)}`
        );
        return null;
      }
    }
  }

  return null;
}
