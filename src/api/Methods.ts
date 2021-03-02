import {
  AppIntent,
  Channel,
  Context,
  ContextHandler,
  IntentResolution,
  Listener,
  ImplementationMetadata,
} from '..';
import { TargetApp } from './Types';

const unavailableError = new Error(
  'FDC3 DesktopAgent not available at `window.fdc3`.'
);

const rejectIfNoGlobal = (f: () => Promise<any>) => {
  return window.fdc3 ? f() : Promise.reject(unavailableError);
};

const throwIfNoGlobal = (f: () => any) => {
  if (!window.fdc3) {
    throw unavailableError;
  }
  return f();
};

export const open: (app: TargetApp, context?: Context) => Promise<void> = (
  app,
  context
) => {
  return rejectIfNoGlobal(() => window.fdc3.open(app, context));
};

export const findIntent: (
  intent: string,
  context?: Context
) => Promise<AppIntent> = (intent, context) => {
  return rejectIfNoGlobal(() => window.fdc3.findIntent(intent, context));
};

export const findIntentsByContext: (
  context: Context
) => Promise<Array<AppIntent>> = context => {
  return rejectIfNoGlobal(() => window.fdc3.findIntentsByContext(context));
};

export const broadcast: (context: Context) => void = context => {
  throwIfNoGlobal(() => window.fdc3.broadcast(context));
};

export const raiseIntent: (
  intent: string,
  context: Context,
  app?: TargetApp
) => Promise<IntentResolution> = (intent, context, app) => {
  return rejectIfNoGlobal(() => window.fdc3.raiseIntent(intent, context, app));
};

export const raiseIntentForContext: (
  context: Context,
  app?: TargetApp
) => Promise<IntentResolution> = (context, app) => {
  return rejectIfNoGlobal(() =>
    window.fdc3.raiseIntentForContext(context, app)
  );
};

export const addIntentListener: (
  intent: string,
  handler: ContextHandler
) => Listener = (intent, handler) => {
  return throwIfNoGlobal(() => window.fdc3.addIntentListener(intent, handler));
};

export const addContextListener: (
  contextTypeOrHandler: string | ContextHandler,
  handler?: ContextHandler
) => Listener = (a, b) => {
  if (typeof a !== 'function') {
    return throwIfNoGlobal(() =>
      window.fdc3.addContextListener(a as string, b as ContextHandler)
    );
  } else {
    return throwIfNoGlobal(() =>
      window.fdc3.addContextListener(a as ContextHandler)
    );
  }
};

export const getSystemChannels: () => Promise<Array<Channel>> = () => {
  return rejectIfNoGlobal(() => window.fdc3.getSystemChannels());
};

export const joinChannel: (channelId: string) => Promise<void> = channelId => {
  return rejectIfNoGlobal(() => window.fdc3.joinChannel(channelId));
};

export const getOrCreateChannel: (
  channelId: string
) => Promise<Channel> = channelId => {
  return rejectIfNoGlobal(() => window.fdc3.getOrCreateChannel(channelId));
};

export const getCurrentChannel: () => Promise<Channel | null> = () => {
  return rejectIfNoGlobal(() => window.fdc3.getCurrentChannel());
};

export const leaveCurrentChannel: () => Promise<void> = () => {
  return rejectIfNoGlobal(() => window.fdc3.leaveCurrentChannel());
};

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
export const compareVersionNumbers: (a: string, b: string) => number | null = (
  a,
  b
) => {
  try {
    let aVerArr = a.split('.').map(Number);
    let bVerArr = b.split('.').map(Number);
    for (
      let index = 0;
      index < Math.max(aVerArr.length, bVerArr.length);
      index++
    ) {
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
export const versionIsAtLeast: (
  metadata: ImplementationMetadata,
  version: string
) => boolean | null = (metadata, version) => {
  let comparison = compareVersionNumbers(metadata.fdc3Version, version);
  return comparison === null ? null : comparison >= 0 ? true : false;
};
