/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

/** Constants representing the errors that can be encountered when calling the `open` method on the DesktopAgent object (`fdc3`). */
export enum OpenError {
  /** Returned if the specified application is not found.*/
  AppNotFound = 'AppNotFound',
  /** Returned if the specified application fails to launch correctly.*/
  ErrorOnLaunch = 'ErrorOnLaunch',
  /** Returned if the specified application launches but fails to add a context listener in order to receive the context passed to the `fdc3.open` call.*/
  AppTimeout = 'AppTimeout',
  /** Returned if the FDC3 desktop agent implementation is not currently able to handle the request.*/
  ResolverUnavailable = 'ResolverUnavailable',
}

/** Constants representing the errors that can be encountered when calling the `findIntent`, `findIntentsByContext`, `raiseIntent` or `raiseIntentForContext` methods on the DesktopAgent (`fdc3`). */
export enum ResolveError {
  /** SHOULD be returned if no apps are available that can resolve the intent and context combination.*/
  NoAppsFound = 'NoAppsFound',
  /** Returned if the FDC3 desktop agent implementation is not currently able to handle the request.*/
  ResolverUnavailable = 'ResolverUnavailable',
  /** Returned if the user cancelled the resolution request, for example by closing or cancelling a resolver UI.*/
  UserCancelled = 'UserCancelledResolution',
  /** SHOULD be returned if a timeout cancels intent resolution, that required user interaction. Please used `ResolverUnavailable` instead for situations where a resolver UI or similar fails.*/
  ResolverTimeout = 'ResolverTimeout',
  /** Returned if a specified target application is not available or new instance of it cannot be opened. */
  TargetAppUnavailable = 'TargetAppUnavailable',
  /** Returned if a specified target application instance is not available, for example because it has been closed. */
  TargetInstanceUnavailable = 'TargetInstanceUnavailable',
  /** Returned if the intent and context could not be delivered to the selected application or instance, for example because it has not added an intent handler within a timeout.*/
  IntentDeliveryFailed = 'IntentDeliveryFailed',
}

export enum DataError {
  /** Returned if the intent handler exited without returning Promise or that Promise was not resolved with a Context object. */
  NoDataReturned = 'NoDataReturned',
  /** Returned if the Intent handler function processing the raised intent throws an error or rejects the promise it returned. */
  IntentHandlerRejected = 'IntentHandlerRejected',
}

export enum ChannelError {
  /** Returned if the specified channel is not found when attempting to join a channel via the `joinUserChannel` function  of the DesktopAgent (`fdc3`).*/
  NoChannelFound = 'NoChannelFound',
  /** SHOULD be returned when a request to join a user channel or to a retrieve a Channel object via the `joinUserChannel` or `getOrCreateChannel` methods of the DesktopAgent (`fdc3`) object is denied. */
  AccessDenied = 'AccessDenied',
  /** SHOULD be returned when a channel cannot be created or retrieved via the `getOrCreateChannel` method of the DesktopAgent (`fdc3`).*/
  CreationFailed = 'CreationFailed',
}
