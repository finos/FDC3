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
  /** Returned if a call to the `open` function is made with an invalid context argument. Contexts should be Objects with at least a `type` field that has a `string` value.*/
  MalformedContext = 'MalformedContext',
  /** @experimental Returned if the specified Desktop Agent is not found, via a connected Desktop Agent Bridge.*/
  DesktopAgentNotFound = 'DesktopAgentNotFound',
}

/** Constants representing the errors that can be encountered when calling the `findIntent`, `findIntentsByContext`, `raiseIntent` or `raiseIntentForContext` methods on the DesktopAgent (`fdc3`). */
export enum ResolveError {
  /** SHOULD be returned if no apps are available that can resolve the intent and context combination.*/
  NoAppsFound = 'NoAppsFound',
  /** Returned if the FDC3 desktop agent implementation is not currently able to handle the request.*/
  ResolverUnavailable = 'ResolverUnavailable',
  /** Returned if the user cancelled the resolution request, for example by closing or cancelling a resolver UI.*/
  UserCancelled = 'UserCancelledResolution',
  /** SHOULD be returned if a timeout cancels an intent resolution that required user interaction. Please use `ResolverUnavailable` instead for situations where a resolver UI or similar fails.*/
  ResolverTimeout = 'ResolverTimeout',
  /** Returned if a specified target application is not available or a new instance of it cannot be opened. */
  TargetAppUnavailable = 'TargetAppUnavailable',
  /** Returned if a specified target application instance is not available, for example because it has been closed. */
  TargetInstanceUnavailable = 'TargetInstanceUnavailable',
  /** Returned if the intent and context could not be delivered to the selected application or instance, for example because it has not added an intent handler within a timeout.*/
  IntentDeliveryFailed = 'IntentDeliveryFailed',
  /** Returned if a call to one of the `raiseIntent` functions is made with an invalid context argument. Contexts should be Objects with at least a `type` field that has a `string` value.*/
  MalformedContext = 'MalformedContext',
  /** @experimental Returned if the specified Desktop Agent is not found, via a connected Desktop Agent Bridge.*/
  DesktopAgentNotFound = 'DesktopAgentNotFound',
}

export enum ResultError {
  /** Returned if the intent handler exited without returning a valid result (a promise resolving to a Context, Channel object or void). */
  NoResultReturned = 'NoResultReturned',
  /** Returned if the Intent handler function processing the raised intent throws an error or rejects the Promise it returned. */
  IntentHandlerRejected = 'IntentHandlerRejected',
}

export enum ChannelError {
  /** Returned if the specified channel is not found when attempting to join a channel via the `joinUserChannel` function  of the DesktopAgent (`fdc3`).*/
  NoChannelFound = 'NoChannelFound',
  /** SHOULD be returned when a request to join a user channel or to a retrieve a Channel object via the `joinUserChannel` or `getOrCreateChannel` methods of the DesktopAgent (`fdc3`) object is denied. */
  AccessDenied = 'AccessDenied',
  /** SHOULD be returned when a channel cannot be created or retrieved via the `getOrCreateChannel` method of the DesktopAgent (`fdc3`).*/
  CreationFailed = 'CreationFailed',
  /** Returned if a call to the `broadcast` functions is made with an invalid context argument. Contexts should be Objects with at least a `type` field that has a `string` value.*/
  MalformedContext = 'MalformedContext',
}

export enum BridgingError {
  /** @experimental Returned if a Desktop Agent did not return a response, via Desktop Agent Bridging, within the alloted timeout. */
  ResponseTimedOut = 'ResponseToBridgeTimedOut',
  /** @experimental Returned if a Desktop Agent that has been targeted by a particular request has been disconnected from the Bridge before a response has been received from it. */
  AgentDisconnected = 'AgentDisconnected',
  /** @experimental Returned for FDC3 API calls that are specified with arguments indicating that a remote Desktop agent should be targeted (e.g. raiseIntent with an app on a remote DesktopAgent targeted), when the local Desktop Agent is not connected to a bridge. */
  NotConnectedToBridge = 'NotConnectedToBridge',
}
