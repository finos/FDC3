import {
  AppIntent,
  Channel,
  Context,
  ContextHandler,
  IntentHandler,
  IntentResolution,
  Listener,
  ImplementationMetadata,
} from '..';
import { TargetApp } from './Types';

const DEFAULT_TIMEOUT = 5000;

const UnavailableError = new Error('FDC3 DesktopAgent not available at `window.fdc3`.');
const TimeoutError = new Error('Timed out waiting for `fdc3Ready` event.');
const UnexpectedError = new Error('`fdc3Ready` event fired, but `window.fdc3` not set to DesktopAgent.');

function rejectIfNoGlobal(f: () => Promise<any>) {
  return window.fdc3 ? f() : Promise.reject(UnavailableError);
}

/**
 * Utility function that returns a promise that will resolve immeadiately
 * if the desktop agent API is found at `window.fdc3`. If the API is found,
 * the promise will resolve when the `fdc3Ready` event is received or if it
 * is found at the end of the specified timeout. If the API is not found, it
 * will reject with an error.
 *
 * ```javascript
 * await fdc3Ready();
 * const intentListener = await addIntentListener("ViewChart", intentHandlerFn);
 * ```
 *
 * @param waitForMs The number of milliseconds to wait for the FDC3 API to be
 * ready. Defaults to 5 seconds.
 */
export const fdc3Ready = async (waitForMs = DEFAULT_TIMEOUT): Promise<void> => {
  return new Promise((resolve, reject) => {
    // if the global is already available resolve immediately
    if (window.fdc3) {
      resolve();
    } else {
      // if its not available setup a timeout to return a rejected promise
      const timeout = setTimeout(() => (window.fdc3 ? resolve() : reject(TimeoutError)), waitForMs);
      // listen for the fdc3Ready event
      window.addEventListener(
        'fdc3Ready',
        () => {
          clearTimeout(timeout);
          window.fdc3 ? resolve() : reject(UnexpectedError);
        },
        { once: true }
      );
    }
  });
};

export function open(app: TargetApp, context?: Context): Promise<void> {
  return rejectIfNoGlobal(() => window.fdc3.open(app, context));
}

export function findIntent(intent: string, context?: Context, resultType?: string): Promise<AppIntent> {
  return rejectIfNoGlobal(() => window.fdc3.findIntent(intent, context, resultType));
}

export function findIntentsByContext(context: Context, resultType?: string): Promise<AppIntent[]> {
  return rejectIfNoGlobal(() => window.fdc3.findIntentsByContext(context, resultType));
}

export function broadcast(context: Context): Promise<void> {
  return rejectIfNoGlobal(() => window.fdc3.broadcast(context));
}

export function raiseIntent(intent: string, context: Context, app?: TargetApp): Promise<IntentResolution> {
  return rejectIfNoGlobal(() => window.fdc3.raiseIntent(intent, context, app));
}

export function raiseIntentForContext(context: Context, app?: TargetApp): Promise<IntentResolution> {
  return rejectIfNoGlobal(() => window.fdc3.raiseIntentForContext(context, app));
}

export function addIntentListener(intent: string, handler: IntentHandler): Promise<Listener> {
  return rejectIfNoGlobal(() => window.fdc3.addIntentListener(intent, handler));
}

export function addContextListener(
  contextTypeOrHandler: string | null | ContextHandler,
  handler?: ContextHandler
): Promise<Listener> {
  //Handle (deprecated) function signature that allowed contextType argument to be omitted
  if (typeof contextTypeOrHandler !== 'function') {
    return rejectIfNoGlobal(() => window.fdc3.addContextListener(contextTypeOrHandler, handler as ContextHandler));
  } else {
    return rejectIfNoGlobal(() => window.fdc3.addContextListener(null, contextTypeOrHandler as ContextHandler));
  }
}

export function getSystemChannels(): Promise<Channel[]> {
  return rejectIfNoGlobal(() => window.fdc3.getSystemChannels());
}

export function joinChannel(channelId: string): Promise<void> {
  return rejectIfNoGlobal(() => window.fdc3.joinChannel(channelId));
}

export function getOrCreateChannel(channelId: string): Promise<Channel> {
  return rejectIfNoGlobal(() => window.fdc3.getOrCreateChannel(channelId));
}

export function getCurrentChannel(): Promise<Channel | null> {
  return rejectIfNoGlobal(() => window.fdc3.getCurrentChannel());
}

export function leaveCurrentChannel(): Promise<void> {
  return rejectIfNoGlobal(() => window.fdc3.leaveCurrentChannel());
}

export function getInfo(): Promise<ImplementationMetadata> {
  return rejectIfNoGlobal(() => window.fdc3.getInfo());
}

/**
 * Compare numeric semver version number strings (in the form `1.2.3`).
 *
 * Returns `-1` if the first argument is a lower version number than the second,
 * `1` if the first argument is greater than the second, 0 if the arguments are
 * equal and `null` if an error occurred during the comparison.
 *
 * @param a
 * @param b
 */
export const compareVersionNumbers: (a: string, b: string) => number | null = (a, b) => {
  try {
    let aVerArr = a.split('.').map(Number);
    let bVerArr = b.split('.').map(Number);
    for (let index = 0; index < Math.max(aVerArr.length, bVerArr.length); index++) {
      /* If one version number has more digits and the other does not, and they are otherwise equal,
         assume the longer is greater. E.g. 1.1.1 > 1.1 */
      if (index === aVerArr.length || aVerArr[index] < bVerArr[index]) {
        return -1;
      } else if (index === bVerArr.length || aVerArr[index] > bVerArr[index]) {
        return 1;
      }
    }
    return 0;
  } catch (e) {
    console.error('Failed to compare version strings', e);
    return null;
  }
};

/**
 * Check if the FDC3 version in an ImplementationMetadata object is greater than
 * or equal to the supplied numeric semver version number string (in the form `1.2.3`).
 *
 * Returns a boolean or null if an error occurred while comparing the version numbers.
 *
 * @param metadata
 * @param version
 */
export const versionIsAtLeast: (metadata: ImplementationMetadata, version: string) => boolean | null = (
  metadata,
  version
) => {
  let comparison = compareVersionNumbers(metadata.fdc3Version, version);
  return comparison === null ? null : comparison >= 0 ? true : false;
};
