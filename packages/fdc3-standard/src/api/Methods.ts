/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import {
  AppIdentifier,
  AppIntent,
  Channel,
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
  ContextType,
  FDC3EventTypes,
  EventHandler,
} from '..';
import { StandardContextsSet } from '../internal/contextConfiguration';
import { StandardIntentsSet } from '../internal/intentConfiguration';
import { Context } from '@kite9/fdc3-context'

const UnavailableError = new Error('FDC3 DesktopAgent not available at `window.fdc3`.');

function isString(app: AppIdentifier | string | undefined): app is string {
  return !!app && typeof app === 'string';
}

export function open(app: AppIdentifier | string, context?: Context): Promise<AppIdentifier> {
  if (isString(app)) {
    return window.fdc3 ? window.fdc3.open(app, context) : Promise.reject(UnavailableError);
  } else {
    return window.fdc3 ? window.fdc3.open(app, context) : Promise.reject(UnavailableError);
  }
}

export function findIntent(intent: Intent, context?: Context, resultType?: string): Promise<AppIntent> {
  return window.fdc3 ? window.fdc3.findIntent(intent, context, resultType) : Promise.reject(UnavailableError);
}

export function findIntentsByContext(context: Context, resultType?: string): Promise<AppIntent[]> {
  return window.fdc3 ? window.fdc3.findIntentsByContext(context, resultType) : Promise.reject(UnavailableError);
}

export function broadcast(context: Context): Promise<void> {
  return window.fdc3 ? window.fdc3.broadcast(context) : Promise.reject(UnavailableError);
}

export function raiseIntent(intent: Intent, context: Context, app?: AppIdentifier | string): Promise<IntentResolution> {
  if (isString(app)) {
    return window.fdc3 ? window.fdc3.raiseIntent(intent, context, app) : Promise.reject(UnavailableError);
  } else {
    return window.fdc3 ? window.fdc3.raiseIntent(intent, context, app) : Promise.reject(UnavailableError);
  }
}

export function raiseIntentForContext(context: Context, app?: AppIdentifier | string): Promise<IntentResolution> {
  if (isString(app)) {
    return window.fdc3 ? window.fdc3.raiseIntentForContext(context, app) : Promise.reject(UnavailableError);
  } else {
    return window.fdc3 ? window.fdc3.raiseIntentForContext(context, app) : Promise.reject(UnavailableError);
  }
}

export function addIntentListener(intent: Intent, handler: IntentHandler): Promise<Listener> {
  return window.fdc3 ? window.fdc3.addIntentListener(intent, handler) : Promise.reject(UnavailableError);
}

export function addContextListener(
  contextTypeOrHandler: ContextType | null | ContextHandler,
  handler?: ContextHandler
): Promise<Listener> {
  //Handle (deprecated) function signature that allowed contextType argument to be omitted
  if (typeof contextTypeOrHandler !== 'function') {
    return window.fdc3 ? window.fdc3.addContextListener(contextTypeOrHandler, handler as ContextHandler) : Promise.reject(UnavailableError);
  } else {
    return window.fdc3 ? window.fdc3.addContextListener(null, contextTypeOrHandler as ContextHandler) : Promise.reject(UnavailableError);
  }
}

export function addEventListener(eventType: FDC3EventTypes, handler: EventHandler): Promise<Listener> {
  return window.fdc3 ? window.fdc3.addEventListener(eventType, handler) : Promise.reject(UnavailableError);
}

export function getUserChannels(): Promise<Channel[]> {
  if (window.fdc3) {
    //fallback to getSystemChannels for FDC3 <2.0 implementations
    if (window.fdc3.getUserChannels) {
      return window.fdc3.getUserChannels();
    } else {
      return window.fdc3.getSystemChannels();
    }
  } else {
    return Promise.reject(UnavailableError);
  };
}

export function getSystemChannels(): Promise<Channel[]> {
  //fall-forward to getUserChannels for FDC3 2.0+ implementations
  return getUserChannels();
}

export function joinUserChannel(channelId: string): Promise<void> {
  if (window.fdc3) {
    //fallback to joinChannel for FDC3 <2.0 implementations
    if (window.fdc3.joinUserChannel) {
      return window.fdc3.joinUserChannel(channelId);
    } else {
      return window.fdc3.joinChannel(channelId);
    }
  } else {
    return Promise.reject(UnavailableError);
  }
}

export function joinChannel(channelId: string): Promise<void> {
  //fall-forward to joinUserChannel for FDC3 2.0+ implementations
  return joinUserChannel(channelId);
}

export function getOrCreateChannel(channelId: string): Promise<Channel> {
  return window.fdc3 ? window.fdc3.getOrCreateChannel(channelId) : Promise.reject(UnavailableError);
}

export function getCurrentChannel(): Promise<Channel | null> {
  return window.fdc3 ? window.fdc3.getCurrentChannel() : Promise.reject(UnavailableError);
}

export function leaveCurrentChannel(): Promise<void> {
  return window.fdc3 ? window.fdc3.leaveCurrentChannel() : Promise.reject(UnavailableError);
}

export function createPrivateChannel(): Promise<PrivateChannel> {
  return window.fdc3 ? window.fdc3.createPrivateChannel() : Promise.reject(UnavailableError);
}

export function getInfo(): Promise<ImplementationMetadata> {
  return window.fdc3 ? window.fdc3.getInfo() : Promise.reject(UnavailableError);
}

export function getAppMetadata(app: AppIdentifier): Promise<AppMetadata> {
  return window.fdc3 ? window.fdc3.getAppMetadata(app) : Promise.reject(UnavailableError);
}

export function findInstances(app: AppIdentifier): Promise<AppIdentifier[]> {
  return window.fdc3 ? window.fdc3.findInstances(app) : Promise.reject(UnavailableError);
}

/**
 * Check if the given context is a standard context type.
 * @param contextType
 */
export function isStandardContextType(contextType: ContextType): contextType is StandardContextType {
  return StandardContextsSet.has(contextType as StandardContextType);
}

/**
 * Check if the given intent is a standard intent.
 * @param intent
 */
export function isStandardIntent(intent: Intent): intent is StandardIntent {
  return StandardIntentsSet.has(intent as StandardIntent);
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
    const aVerArr = a.split('.').map(Number);
    const bVerArr = b.split('.').map(Number);
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
  const comparison = compareVersionNumbers(metadata.fdc3Version, version);
  return comparison === null ? null : comparison >= 0 ? true : false;
};
