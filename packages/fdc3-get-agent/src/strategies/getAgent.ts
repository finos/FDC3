import { DesktopAgent, GetAgentType, GetAgentParams, AgentError } from '@kite9/fdc3-standard';
import { ElectronEventLoader } from './ElectronEventLoader';
import { handleWindowProxy, PostMessageLoader } from './PostMessageLoader';
import { TimeoutLoader } from './TimeoutLoader';

const DEFAULT_WAIT_FOR_MS = 20000;

/**
 * For now, we only allow a single call to getAgent per application, so
 * we keep track of the promise we use here.
 */
var theAgentPromise: Promise<DesktopAgent> | null = null;

export function clearAgentPromise() {
  theAgentPromise = null;
}

export function getAgentPromise(): Promise<DesktopAgent> | null {
  return theAgentPromise;
}

function initAgentPromise(options: GetAgentParams): Promise<DesktopAgent> {
  const STRATEGIES = [new ElectronEventLoader(), new PostMessageLoader(), new TimeoutLoader()];
  const promises = STRATEGIES.map(s => s.get(options));

  return Promise.race(promises)
    .then(da => {
      // first, cancel the timeout etc.
      STRATEGIES.forEach(s => s.cancel());

      // either the timeout completes first with an error, or one of the other strategies completes with a DesktopAgent.
      if (da) {
        return da as DesktopAgent;
      } else {
        throw new Error(AgentError.AgentNotFound);
      }
    })
    .catch(async error => {
      if (options.failover) {
        return await handleWindowProxy(options, () => {
          return options.failover!!(options);
        });
      } else {
        throw error;
      }
    });
}

/**
 * This return an FDC3 API.  Should be called by application code.
 *
 * @param optionsOverride - options to override the default options
 */
export const getAgent: GetAgentType = (optionsOverride?: GetAgentParams) => {
  const DEFAULT_OPTIONS: GetAgentParams = {
    dontSetWindowFdc3: true,
    channelSelector: true,
    intentResolver: true,
    timeoutMs: DEFAULT_WAIT_FOR_MS,
    identityUrl: globalThis.window.location.href,
  };

  const options = {
    ...DEFAULT_OPTIONS,
    ...optionsOverride,
  };

  function handleGenericOptions(da: DesktopAgent) {
    if (!options.dontSetWindowFdc3 && globalThis.window.fdc3 == null) {
      globalThis.window.fdc3 = da;
      globalThis.window.dispatchEvent(new Event('fdc3Ready'));
    }

    globalThis.window.addEventListener('pagehide', () => {
      if ((da as any).disconnect) {
        (da as any).disconnect();
        theAgentPromise = null;
      }
    });

    return da;
  }

  if (!theAgentPromise) {
    theAgentPromise = initAgentPromise(options).then(handleGenericOptions);
  }

  return theAgentPromise;
};

/**
 * Replaces the original fdc3Ready function from FDC3 2.0 with a new one that uses the new getAgent function.
 *
 * @param waitForMs Amount of time to wait before failing the promise (20 seconds is the default).
 * @returns A DesktopAgent promise.
 */
export function fdc3Ready(waitForMs = DEFAULT_WAIT_FOR_MS): Promise<DesktopAgent> {
  const agent = getAgent({
    timeoutMs: waitForMs,
    dontSetWindowFdc3: false,
    channelSelector: true,
    intentResolver: true,
  });

  return agent;
}
