import { DesktopAgent } from '@finos/fdc3-standard';
import { getAgent, clearAgentPromise } from './strategies/getAgent.js';
import { AbstractUIComponent } from './ui/AbstractUIComponent.js';
import { DefaultDesktopAgentChannelSelector } from './ui/DefaultDesktopAgentChannelSelector.js';
import { DefaultDesktopAgentIntentResolver } from './ui/DefaultDesktopAgentIntentResolver.js';
import { NullChannelSelector } from './ui/NullChannelSelector.js';
import { NullIntentResolver } from './ui/NullIntentResolver.js';
import { PostMessageLoader } from './strategies/PostMessageLoader.js';
import { FailoverHandler } from './strategies/FailoverHandler.js';
import { HelloHandler } from './strategies/HelloHandler.js';
import { IdentityValidationHandler } from './strategies/IdentityValidationHandler.js';
import { DesktopAgentPreloadLoader } from './strategies/DesktopAgentPreloadLoader.js';
import { MessagePortMessaging } from './messaging/MessagePortMessaging.js';
import { createDesktopAgentAPI } from './messaging/message-port.js';
import {
  sessionKey,
  storeDesktopAgentDetails,
  retrieveAllDesktopAgentDetails,
  retrieveDesktopAgentDetails,
} from './sessionStorage/DesktopAgentDetails.js';
import { NoopAppSupport } from './apps/NoopAppSupport.js';
import { FDC3_VERSION } from './Fdc3Version.js';
import {
  DEFAULT_GETAGENT_TIMEOUT_MS,
  DEFAULT_MESSAGE_EXCHANGE_TIMEOUT_MS,
  DEFAULT_APP_LAUNCH_TIMEOUT_MS,
} from './strategies/Timeouts.js';
import { Logger } from './util/Logger.js';
import { createUUID } from './util/Uuid.js';

const DEFAULT_WAIT_FOR_MS = 20000;

export {
  getAgent,
  clearAgentPromise,
  AbstractUIComponent,
  DefaultDesktopAgentChannelSelector,
  DefaultDesktopAgentIntentResolver,
  NullChannelSelector,
  NullIntentResolver,
  PostMessageLoader,
  FailoverHandler,
  HelloHandler,
  IdentityValidationHandler,
  DesktopAgentPreloadLoader,
  MessagePortMessaging,
  createDesktopAgentAPI,
  sessionKey,
  storeDesktopAgentDetails,
  retrieveAllDesktopAgentDetails,
  retrieveDesktopAgentDetails,
  NoopAppSupport,
  FDC3_VERSION,
  DEFAULT_GETAGENT_TIMEOUT_MS,
  DEFAULT_MESSAGE_EXCHANGE_TIMEOUT_MS,
  DEFAULT_APP_LAUNCH_TIMEOUT_MS,
  Logger,
  createUUID,
};

export type { Loader, DesktopAgentSelection } from './strategies/Loader.js';
export type { ConnectionDetails } from './messaging/MessagePortMessaging.js';

/**
 * Replaces the original fdc3Ready function from FDC3 2.0 with a new one that uses the new getAgent function.
 *
 * @param waitForMs Amount of time to wait before failing the promise (20 seconds is the default).
 * @returns A DesktopAgent promise.
 *
 * @deprecated This function is provided for backwards compatibility.  Use `const fdc3 = getAgent()` to retrieve (and
 * wait for) a reference to the FDC3 API instead.
 */
export function fdc3Ready(waitForMs = DEFAULT_WAIT_FOR_MS): Promise<DesktopAgent> {
  return getAgent({
    timeoutMs: waitForMs,
    dontSetWindowFdc3: false,
    channelSelector: true,
    intentResolver: true,
  });
}
