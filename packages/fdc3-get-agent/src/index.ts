import { DesktopAgent } from '@finos/fdc3-standard';
import { getAgent } from './strategies/getAgent.js';
import { AbstractUIComponent } from './ui/AbstractUIComponent.js';
import { DefaultDesktopAgentChannelSelector } from './ui/DefaultDesktopAgentChannelSelector.js';
import { DefaultDesktopAgentIntentResolver } from './ui/DefaultDesktopAgentIntentResolver.js';
import { NullChannelSelector } from './ui/NullChannelSelector.js';
import { NullIntentResolver } from './ui/NullIntentResolver.js';

const DEFAULT_WAIT_FOR_MS = 20000;

export {
  getAgent,
  AbstractUIComponent,
  DefaultDesktopAgentChannelSelector,
  DefaultDesktopAgentIntentResolver,
  NullChannelSelector,
  NullIntentResolver,
};

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
