/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import {
  AppIdentifier,
  AppIntent,
  Channel,
  Context,
  ContextHandler,
  IntentHandler,
  IntentResolution,
  Listener,
  ImplementationMetadata,
  AppMetadata,
  PrivateChannel,
  Intent,
  StandardContextType,
  StandardIntent,
  ContextTypeFor,
} from '..';
import { IntentsConfiguration, StandardContextsSet, StandardIntentsSet } from '../intents/IntentsConfiguration';

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

function isString(app: AppIdentifier | string | undefined): app is string {
  return !!app && typeof app === 'string';
}

export function open(app: AppIdentifier | string, context?: Context): Promise<AppIdentifier> {
  if (isString(app)) {
    return rejectIfNoGlobal(() => window.fdc3.open(app, context));
  } else {
    return rejectIfNoGlobal(() => window.fdc3.open(app, context));
  }
}

export function findIntent(intent: Intent, context?: Context, resultType?: string): Promise<AppIntent> {
  return rejectIfNoGlobal(() => window.fdc3.findIntent(intent, context, resultType));
}

export function findIntentsByContext(context: Context, resultType?: string): Promise<AppIntent[]> {
  return rejectIfNoGlobal(() => window.fdc3.findIntentsByContext(context, resultType));
}

export function broadcast(context: Context): Promise<void> {
  return rejectIfNoGlobal(() => window.fdc3.broadcast(context));
}

export function raiseIntent(intent: Intent, context: Context, app?: AppIdentifier | string): Promise<IntentResolution> {
  if (isString(app)) {
    return rejectIfNoGlobal(() => window.fdc3.raiseIntent(intent, context, app));
  } else {
    return rejectIfNoGlobal(() => window.fdc3.raiseIntent(intent, context, app));
  }
}

export function raiseIntentForContext(context: Context, app?: AppIdentifier | string): Promise<IntentResolution> {
  if (isString(app)) {
    return rejectIfNoGlobal(() => window.fdc3.raiseIntentForContext(context, app));
  } else {
    return rejectIfNoGlobal(() => window.fdc3.raiseIntentForContext(context, app));
  }
}

export function addIntentListener(intent: Intent, handler: IntentHandler): Promise<Listener> {
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

export function getUserChannels(): Promise<Channel[]> {
  return rejectIfNoGlobal(() => {
    //fallback to getSystemChannels for FDC3 <2.0 implementations
    if (window.fdc3.getUserChannels) {
      return window.fdc3.getUserChannels();
    } else {
      return window.fdc3.getSystemChannels();
    }
  });
}

export function getSystemChannels(): Promise<Channel[]> {
  //fallforward to getUserChannels for FDC3 2.0+ implementations
  return getUserChannels();
}

export function joinUserChannel(channelId: string): Promise<void> {
  return rejectIfNoGlobal(() => {
    //fallback to joinChannel for FDC3 <2.0 implementations
    if (window.fdc3.joinUserChannel) {
      return window.fdc3.joinUserChannel(channelId);
    } else {
      return window.fdc3.joinChannel(channelId);
    }
  });
}

export function joinChannel(channelId: string): Promise<void> {
  //fallforward to joinUserChannel for FDC3 2.0+ implementations
  return joinUserChannel(channelId);
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

export function createPrivateChannel(): Promise<PrivateChannel> {
  return rejectIfNoGlobal(() => window.fdc3.createPrivateChannel());
}

export function getInfo(): Promise<ImplementationMetadata> {
  return rejectIfNoGlobal(() => window.fdc3.getInfo());
}

export function getAppMetadata(app: AppIdentifier): Promise<AppMetadata> {
  return rejectIfNoGlobal(() => window.fdc3.getAppMetadata(app));
}

export function findInstances(app: AppIdentifier): Promise<AppIdentifier[]> {
  return rejectIfNoGlobal(() => window.fdc3.findInstances(app));
}

/**
 * Check if the given context is a standard context type.
 * @param contextType
 */
export function isStandardContextType(contextType: string): contextType is StandardContextType {
  return StandardContextsSet.has(contextType as StandardContextType);
}

/**
 * Check if the given intent is a standard intent.
 * @param intent
 */
export function isStandardIntent(intent: string): intent is StandardIntent {
  return StandardIntentsSet.has(intent as StandardIntent);
}

/**
 * Get the possible context types for a given intent.
 * @param intent
 */
export function getPossibleContextsForIntent<I extends StandardIntent>(intent: I): ContextTypeFor<I>[] {
  return IntentsConfiguration[intent] ?? [];
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
