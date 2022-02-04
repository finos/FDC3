/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

import { AppIntent } from './AppIntent';
import { Channel } from './Channel';
import { ContextHandler, IntentHandler, TargetApp } from './Types';
import { IntentResolution } from './IntentResolution';
import { Listener } from './Listener';
import { Context } from '../context/ContextTypes';
import { ImplementationMetadata } from './ImplementationMetadata';
import { AppMetadata } from './AppMetadata';

/**
 * A Desktop Agent is a desktop component (or aggregate of components) that serves as a
 * launcher and message router (broker) for applications in its domain.
 *
 * A Desktop Agent can be connected to one or more App Directories and will use directories for application
 * identity and discovery. Typically, a Desktop Agent will contain the proprietary logic of
 * a given platform, handling functionality like explicit application interop workflows where
 * security, consistency, and implementation requirements are proprietary.
 */

export interface DesktopAgent {
  /**
   * Launches an app by target, which can be optionally a string like a name, or an AppMetadata object.
   *
   * The `open` method differs in use from `raiseIntent`.  Generally, it should be used when the target application is known but there is no specific intent.  For example, if an application is querying the App Directory, `open` would be used to open an app returned in the search results.
   *
   * **Note**, if the intent, context and target app name are all known, it is recommended to instead use `raiseIntent` with the `target` argument.
   *
   * If a Context object is passed in, this object will be provided to the opened application via a contextListener. The Context argument is functionally equivalent to opening the target app with no context and broadcasting the context directly to it.
   *
   * Returns an `AppMetadata` object with the `instanceId` field set identifying the instance of the application opened by this call.
   *
   * If opening errors, it returns an `Error` with a string from the `OpenError` enumeration.
   *
   * ```javascript
   * //Open an app without context, using the app name
   * let instanceMetadata = await fdc3.open('myApp');
   * //Open an app without context, using an AppMetadataobject to specify the target
   * let appMetadata = {name: 'myApp', appId: 'myApp-v1.0.1', version: '1.0.1'};
   * let instanceMetadata = await fdc3.open(appMetadata);
   * //Open an app with context
   * let instanceMetadata = await fdc3.open(appMetadata, context);
   * ```
   */
  open(app: TargetApp, context?: Context): Promise<AppMetadata>;

  /**
   * Find out more information about a particular intent by passing its name, and optionally its context.
   *
   * findIntent is effectively granting programmatic access to the Desktop Agent's resolver.
   * A promise resolving to the intent, its metadata and metadata about the apps and app instances that registered it is returned.
   * This can be used to raise the intent against a specific app or app instance.
   *
   * If the resolution fails, the promise will return an `Error` with a string from the `ResolveError` enumeration.
   *
   * ```javascript
   * // I know 'StartChat' exists as a concept, and want to know more about it ...
   * const appIntent = await fdc3.findIntent("StartChat");
   *
   * // returns a single AppIntent:
   * // {
   * //     intent: { name: "StartChat", displayName: "Chat" },
   * //   apps: [
   * //    { name: "Skype" },
   * //    { name: "Symphony" },
   * //    { name: "Slack" }
   * //   ]
   * // }
   *
   * // raise the intent against a particular app
   * await fdc3.raiseIntent(appIntent.intent.name, context, appIntent.apps[0].name);
   *
   * //later, we want to raise 'StartChat' intent again
   * const appIntent = await fdc3.findIntent("StartChat");
   * // returns an AppIntent, but with multiple options for resolution,
   * // which includes an existing instance of an application:
   * // {
   * //   intent: { name: "StartChat", displayName: "Chat" },
   * //   apps: [
   * //    { name: "Skype" },
   * //    { name: "Symphony" },
   * //    { name: "Symphony", instanceId: "93d2fe3e-a66c-41e1-b80b-246b87120859" },
   * //    { name: "Slack" }
   * //   ]
   * ```
   */
  findIntent(intent: string, context?: Context): Promise<AppIntent>;

  /**
   * Find all the available intents for a particular context.
   *
   * findIntents is effectively granting programmatic access to the Desktop Agent's resolver.
   * A promise resolving to all the intents, their metadata and metadata about the apps and app instance that registered it is returned, based on the context types the intents have registered.
   *
   * If the resolution fails, the promise will return an `Error` with a string from the `ResolveError` enumeration.
   *
   * ```javascript
   * // I have a context object, and I want to know what I can do with it, hence, I look for for intents...
   * const appIntents = await fdc3.findIntentsByContext(context);
   *
   * // returns for example:
   * // [
   * //   {
   * //     intent: { name: "StartCall", displayName: "Call" },
   * //     apps: [{ name: "Skype" }]
   * //   },
   * //   {
   * //     intent: { name: "StartChat", displayName: "Chat" },
   * //     apps: [
   * //       { name: "Skype" },
   * //       { name: "Symphony" },
   * //       { name: "Symphony", instanceId: "93d2fe3e-a66c-41e1-b80b-246b87120859" },
   * //       { name: "Slack" }
   * //     ]
   * //   }
   * // ];
   *
   * // select a particular intent to raise
   * const startChat = appIntents[1];
   *
   * // target a particular app or instance
   * const selectedApp = startChat.apps[2];
   *
   * // raise the intent, passing the given context, targeting the app
   * await fdc3.raiseIntent(startChat.intent.name, context, selectedApp);
   * ```
   */
  findIntentsByContext(context: Context): Promise<Array<AppIntent>>;

  /**
   * Find all the available instances for a particular application.
   *
   * If there are no instances of the specified application the returned promise should resolve to an empty array.
   *
   * If the request fails for another reason, the promise will return an `Error` with a string from the `ResolveError` enumeration.
   *
   * ```javascript
   * // Retrieve a list of instances of an application
   * let instances = await fdc3.findInstances({name: "MyApp"});
   *
   * // Target a raised intent at a specific instance
   * let resolution = fdc3.raiseIntent("ViewInstrument", context, instances[0]);
   * ```
   * @param app
   */
  findInstances(app: TargetApp): Promise<Array<AppMetadata>>;

  /**
   * Publishes context to other apps on the desktop.  Calling `broadcast` at the `DesktopAgent` scope will push the context to whatever `Channel` the app is joined to.  If the app is not currently joined to a channel, calling `fdc3.broadcast` will have no effect.  Apps can still directly broadcast and listen to context on any channel via the methods on the `Channel` class.
   * 
   * DesktopAgent implementations should ensure that context messages broadcast to a channel by an application joined to it should not be delivered back to that same application.
   *
   * ```javascript
   * const instrument = {
   *   type: 'fdc3.instrument',
   *   id: {
   *     ticker: 'AAPL'
   *   }
   * };

   * fdc3.broadcast(context);
   * ```
   */
  broadcast(context: Context): Promise<void>;

  /**
   * Raises a specific intent for resolution against apps registered with the desktop agent.
   *
   * The desktop agent MUST resolve the correct app to target based on the provided intent name and context data. If multiple matching apps are found, the user MAY be presented with a Resolver UI allowing them to pick one, or another method of Resolution applied to select an app.
   * Alternatively, the specific app or app instance to target can also be provided. A list of valid target applications and instances can be retrieved via `findIntent`.
   *
   * If you wish to raise an Intent without a context, use the `fdc3.nothing` context type. This type exists so that apps can explicitly declare support for raising an intent without context.
   *
   * Returns an `IntentResolution` object with details of the app instance that was selected (or started) to respond to the intent. If the application that resolves the intent returns a promise of context data, this may be retrieved via the `getResult()` function of the `IntentResolution` object. If an error occurs (i.e. an error is thrown by the handler function, the promise returned is rejected, or no promise is returned) then the Desktop Agent MUST reject the promise returned by the `getResult()` function of the `IntentResolution` with a string from the `DataError` enumeration.
   *
   * If a target app for the intent cannot be found with the criteria provided, an `Error` with a string from the `ResolveError` enumeration MUST be returned.
   *
   * ```javascript
   * // raise an intent for resolution by the desktop agent
   * // a resolver UI may be displayed if more than one application can resolve the intent
   * await fdc3.raiseIntent("StartChat", context);
   *
   * // or find apps to resolve an intent to start a chat with a given contact
   * const appIntent = await fdc3.findIntent("StartChat", context);

   * // use the metadata of an app or app instance to describe the target app for the intent
   * await fdc3.raiseIntent("StartChat", context, appIntent.apps[0]);
   *
   * //Raise an intent without a context by using the null context type
   * await fdc3.raiseIntent("StartChat", {type: "fdc3.nothing"});
   *
   * //Raise an intent and retrieve data from the IntentResolution
   * let resolution = await agent.raiseIntent("intentName", context);
   * try {
   * 	   const result = await resolution.getResult();
   *     console.log(`${resolution.source} returned ${JSON.stringify(result)}`);
   * } catch(error) {
   *     console.error(`${resolution.source} returned a data error: ${error}`);
   * }
   * ```
   */
  raiseIntent(intent: string, context: Context, app?: TargetApp): Promise<IntentResolution>;

  /**
   * Finds and raises an intent against apps registered with the desktop agent based purely on the type of the context data.
   *
   * The desktop agent SHOULD first resolve to a specific intent based on the provided context if more than one intent is available for the specified context. This MAY be achieved by displaying a resolver UI. It SHOULD then resolve to a specific app to handle the selected intent and specified context.
   * Alternatively, the specific app or app instance to target can also be provided, in which case the resolver SHOULD only offer intents supported by the specified application.
   *
   * Using `raiseIntentForContext` is similar to calling `findIntentsByContext`, and then raising an intent against one of the returned apps, except in this case the desktop agent has the opportunity to provide the user with a richer selection interface where they can choose both the intent and target app.
   *
   * Returns an `IntentResolution` object with details of the app that was selected to respond to the intent. If the application that resolves the intent returns a promise of Context data, this may be retrieved via the `getResult()` function of the IntentResolution object. If an error occurs (i.e. an error is thrown by the handler function, the promise returned is rejected, or no promise is returned) then the Desktop Agent MUST reject the promise returned by the `getResult()` function of the `IntentResolution` with a string from the `DataError` enumeration.
   *
   * If a target app for the intent cannot be found with the criteria provided, an `Error` with a string from the `ResolveError` enumeration is returned.
   *
   * ```javascript
   * // Resolve against all intents registered for the specified context
   * await fdc3.raiseIntentForContext(context);
   * // Resolve against all intents registered by a specific target app for the specified context
   * await fdc3.raiseIntentForContext(context, targetAppMetadata);
   * ```
   */
  raiseIntentForContext(context: Context, app?: TargetApp): Promise<IntentResolution>;

  /**
   * Adds a listener for incoming Intents from the Agent. The handler function may
   * return void or a promise that should resolve to a context object representing
   * any data that should be returned to app that raised the intent. If an error occurs 
   * (i.e. an error is thrown by the handler function, the promise returned is rejected, or 
   * a promise is not returned) then the Desktop Agent MUST reject the promise returned 
   * by the `getResult()` function of the `IntentResolution`.
   *
   * ```javascript
   * //Handle a raised intent
   * const listener = fdc3.addIntentListener('StartChat', context => {
   *     // start chat has been requested by another application
   *     return;
   * });
   *
   * //Handle a raised intent and return Context data via a promise
   * fdc3.addIntentListener("CreateOrder", (context) => {
   *     return new Promise<Context>((resolve) => {
   *         // go create the order
   *         resolve({type: "fdc3.order", id: { "orderId": 1234}});
   *	   });
   * });
   * ```
   */
  addIntentListener(intent: string, handler: IntentHandler): Promise<Listener>;

  /**
   * Adds a listener for incoming context broadcast from the Desktop Agent.
   * @deprecated use `addContextListener(null, handler)` instead of `addContextListener(handler)`.
   */
  addContextListener(handler: ContextHandler): Promise<Listener>;

  /**
   * Adds a listener for incoming context broadcasts from the Desktop Agent. If the consumer is only interested in a context of a particular type, they can they can specify that type. If the consumer is able to receive context of any type or will inspect types received, then they can pass `null` as the `contextType` parameter to receive all context types.
   * Context broadcasts are only received from apps that are joined to the same channel as the listening application, hence, if the application is not currently joined to a channel no broadcasts will be received. If this function is called after the app has already joined a channel and the channel already contains context that would be passed to the context listener, then it will be called immediately with that context.
   * ```javascript
   * // any context
   * const listener = fdc3.addContextListener(null, context => { ... });
   * // listener for a specific type
   * const contactListener = fdc3.addContextListener('fdc3.contact', contact => { ... });
   * ```
   */
  addContextListener(contextType: string | null, handler: ContextHandler): Promise<Listener>;

  /**
   * Retrieves a list of the System channels available for the app to join
   */
  getSystemChannels(): Promise<Array<Channel>>;

  /**
   * Optional function that joins the app to the specified channel. In most cases, applications SHOULD be joined to channels via UX provided to the application by the desktop agent, rather than calling this function directly.
   *
   * If an app is joined to a channel, all `fdc3.broadcast` calls will go to the channel, and all listeners assigned via `fdc3.addContextListener` will listen on the channel.
   * If the channel already contains context that would be passed to context listeners assed via `fdc3.addContextListener` then those listeners will be called immediately with that context.
   * An app can only be joined to one channel at a time.
   * Rejects with an error if the channel is unavailable or the join request is denied. The error string will be drawn from the `ChannelError` enumeration.
   * ```javascript
   *   // get all system channels
   *   const channels = await fdc3.getSystemChannels();
   *   // create UI to pick from the system channels
   *   // join the channel on selection
   *   fdc3.joinChannel(selectedChannel.id);
   *  ```
   */
  joinChannel(channelId: string): Promise<void>;

  /**
   * Returns a channel with the given identity. Either stands up a new channel or returns an existing channel.
   * It is up to applications to manage how to share knowledge of these custom channels across windows and to manage
   * channel ownership and lifecycle.
   * `Error` with a string from the `ChannelError` enumeration.
   */
  getOrCreateChannel(channelId: string): Promise<Channel>;

  /**
   * Optional function that returns the `Channel` object for the current channel membership. In most cases, an application's membership of channels SHOULD be managed via UX provided to the application by the desktop agent, rather than calling this function directly.
   *
   * Returns `null` if the app is not joined to a channel.
   */
  getCurrentChannel(): Promise<Channel | null>;

  /**
   * Optional function that removes the app from any channel membership. In most cases, an application's membership of channels SHOULD be managed via UX provided to the application by the desktop agent, rather than calling this function directly.
   *
   * Context broadcast and listening through the top-level `fdc3.broadcast` and `fdc3.addContextListener` will be a no-op when the app is not on a channel.
   * ```javascript
   * //desktop-agent scope context listener
   * const fdc3Listener = fdc3.addContextListener(null, context => {});
   * await fdc3.leaveCurrentChannel();
   * //the fdc3Listener will now cease receiving context
   * //listening on a specific channel though, will continue to work
   * redChannel.addContextListener(null, channelListener);
   * ```
   */
  leaveCurrentChannel(): Promise<void>;

  /**
   * Retrieves information about the FDC3 Desktop Agent implementation, such as
   * the implemented version of the FDC3 specification and the name of the implementation
   * provider.
   */
  getInfo(): Promise<ImplementationMetadata>;
}
