/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { AppIntent } from './AppIntent';
import { Channel } from './Channel';
import { ContextHandler, IntentHandler } from './Types';
import { IntentResolution } from './IntentResolution';
import { Listener } from './Listener';
import { Context } from '@kite9/fdc3-context';
import { ImplementationMetadata } from './ImplementationMetadata';
import { PrivateChannel } from './PrivateChannel';
import { AppIdentifier } from './AppIdentifier';
import { AppMetadata } from './AppMetadata';
import { Intent } from '../intents/Intents';
import { ContextType } from '../context/ContextType';
import { EventHandler, FDC3EventTypes } from './Events';

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
   * Launches an app, specified via an `AppIdentifier` object.
   *
   * The `open` method differs in use from `raiseIntent`.  Generally, it should be used when the target application is known but there is no specific intent.  For example, if an application is querying the App Directory, `open` would be used to open an app returned in the search results.
   *
   * **Note**, if the intent, context and target app name are all known, it is recommended to instead use `raiseIntent` with the `target` argument.
   *
   * If a Context object is passed in, this object will be provided to the opened application via a contextListener. The Context argument is functionally equivalent to opening the target app with no context and broadcasting the context directly to it.
   *
   * Returns an `AppIdentifier` object with the `instanceId` field set identifying the instance of the application opened by this call.
   *
   * If an error occurs while opening the app, the promise MUST be rejected with an `Error` Object with a `message` chosen from the `OpenError` enumeration, or (if connected to a Desktop Agent Bridge) the `BridgingError` enumeration.
   *
   * ```javascript
   * //Open an app without context, using an AppIdentifier object to specify the target by `appId`.
   * let appIdentifier = {appId: 'myApp-v1.0.1'};
   * let instanceIdentifier = await fdc3.open(appIdentifier);
   *
   * //Open an app with context
   * let instanceIdentifier = await fdc3.open(appIdentifier, context);
   * ```
   */
  open(app: AppIdentifier, context?: Context): Promise<AppIdentifier>;

  /**
   * Find out more information about a particular intent by passing its name, and optionally its context and/or a desired result context type.
   *
   * `findIntent` is effectively granting programmatic access to the Desktop Agent's resolver.
   * It returns a promise resolving to the intent, its metadata and metadata about the apps and app instances that registered that intent.
   * This can be used to raise the intent against a specific app or app instance.
   *
   * If the resolution fails, the promise MUST be rejected with an `Error` Object with a `message` chosen from the `ResolveError` enumeration, or (if connected to a Desktop Agent Bridge) the `BridgingError` enumeration. This includes the case where no apps are found that resolve the intent, when the `ResolveError.NoAppsFound` message should be used, and when an invalid context object is passed as an argument, when the `ResolveError.MalformedContext` message should be used.
   *
   * Result types may be a type name, the string "channel" (which indicates that the app
   * will return a channel) or a string indicating a channel that returns a specific type,
   * e.g. "channel<fdc3.instrument>".
   *
   * If intent resolution to an app returning a channel is requested, the desktop agent
   * MUST include both apps that are registered as returning a channel and those registered
   * as returning a channel with a specific type in the response.
   *
   * ```javascript
   * // I know 'StartChat' exists as a concept, and want to know which apps can resolve it ...
   * const appIntent = await fdc3.findIntent("StartChat");
   *
   * // returns a single AppIntent:
   * // {
   * //     intent: { name: "StartChat" },
   * //   apps: [
   * //    { appId: "Skype" },
   * //    { appId: "Symphony" },
   * //    { appId: "Slack" }
   * //   ]
   * // }
   *
   * // raise the intent against a particular app
   * await fdc3.raiseIntent(appIntent.intent.name, context, appIntent.apps[0]);
   *
   * //later, we want to raise 'StartChat' intent again
   * const appIntent = await fdc3.findIntent("StartChat");
   * // returns an AppIntent, but with multiple options for resolution,
   * // which includes an existing instance of an application:
   * // {
   * //   intent: { name: "StartChat" },
   * //   apps: [
   * //    { appId: "Skype" },
   * //    { appId: "Symphony" },
   * //    { appId: "Symphony", instanceId: "93d2fe3e-a66c-41e1-b80b-246b87120859" },
   * //    { appId: "Slack" }
   * //   ]
   * ```
   *
   * An optional input context object and result type may be specified, which the resolver MUST use to filter the returned applications such that each supports the specified input and result types.
   *
   * ```javascript
   * const appIntent = await fdc3.findIntent("StartChat", contact);
   *
   * // returns only apps that support the type of the specified input context:
   * // {
   * //     intent: { name: "StartChat" },
   * //     apps: [{ appId: "Symphony" }]
   * // }
   *
   * const appIntent = await fdc3.findIntent("ViewContact", contact, "fdc3.ContactList");
   *
   * // returns only apps that return the specified result Context type:
   * // {
   * //     intent: { name: "ViewContact" },
   * //     apps: { appId: "MyCRM", resultType: "fdc3.ContactList"}]
   * // }
   *
   * const appIntent = await fdc3.findIntent("QuoteStream", instrument, "channel<fdc3.Quote>");
   *
   * // returns only apps that return a channel which will receive the specified input and result types:
   * // {
   * //     intent: { name: "QuoteStream" },
   * //     apps: [{ appId: "MyOMS", resultType: "channel<fdc3.Quote>"}]
   * // }
   * ```
   */
  findIntent(intent: Intent, context?: Context, resultType?: string): Promise<AppIntent>;

  /**
   * Find all the available intents for a particular context, and optionally a desired result context type.
   *
   * `findIntentsByContext` is effectively granting programmatic access to the Desktop Agent's resolver.
   * It returns a promise resolving to an `AppIntent` which provides details of the intent, its metadata and metadata about the apps and app instances that are registered to handle it. This can be used to raise the intent against a specific app or app instance.
   *
   * If the resolution fails, the promise MUST be rejected with an `Error` Object with a `message` chosen from the `ResolveError` enumeration, or (if connected to a Desktop Agent Bridge) the `BridgingError` enumeration. This includes the case where no intents with associated apps are found, when the `ResolveError.NoAppsFound` message should be used, and when an invalid context object is passed as an argument, when the `ResolveError.MalformedContext` message should be used.
   *
   * The optional `resultType` argument may be a type name, the string "channel" (which indicates that the app
   * should return a channel) or a string indicating a channel that returns a specific type,
   * e.g. "channel<fdc3.instrument>". If intent resolution to an app returning a channel is requested without
   * a specified context type, the desktop agent MUST also include apps that are registered as returning a
   * channel with a specific type in the response.
   *
   * ```javascript
   * // I have a context object, and I want to know what I can do with it, hence, I look for intents and apps to resolve them...
   * const appIntents = await fdc3.findIntentsByContext(context);
   *
   * // returns for example:
   * // [
   * //   {
   * //     intent: { name: "StartCall" },
   * //     apps: [{ name: "Skype" }]
   * //   },
   * //   {
   * //     intent: { name: "StartChat" },
   * //     apps: [
   * //       { appId: "Skype" },
   * //       { appId: "Symphony" },
   * //       { appId: "Symphony", instanceId: "93d2fe3e-a66c-41e1-b80b-246b87120859" },
   * //       { appId: "Slack" }
   * //     ]
   * //   }
   * // ];
   *
   * // or I look for only intents that are resolved by apps returning a particular result type
   * const appIntentsForType = await fdc3.findIntentsByContext(context, "fdc3.ContactList");
   * // returns for example:
   * // [{
   * //     intent: { name: "ViewContact" },
   * //     apps: [{ appId: "MyCRM", resultType: "fdc3.ContactList"}]
   * // }];
   *
   * // select a particular intent to raise
   * const resolvedIntent = appIntents[1];
   *
   * // target a particular app or instance
   * const selectedApp = resolvedIntent.apps[2];
   *
   * // raise the intent, passing the given context, targeting the app or app instance
   * await fdc3.raiseIntent(startChat.intent.name, context, selectedApp);
   * ```
   */
  findIntentsByContext(context: Context, resultType?: string): Promise<Array<AppIntent>>;

  /**
   * Find all the available instances for a particular application.
   *
   * If there are no instances of the specified application the returned promise should resolve to an empty array.
   *
   * If the request fails for another reason, the promise MUST be rejected with an `Error` Object with a `message` chosen from the `ResolveError` enumeration, or (if connected to a Desktop Agent Bridge) the `BridgingError` enumeration.
   *
   * ```javascript
   * // Retrieve a list of instances of an application
   * let instances = await fdc3.findInstances({appId: "MyAppId"});
   *
   * // Target a raised intent at a specific instance
   * let resolution = fdc3.raiseIntent("ViewInstrument", context, instances[0]);
   * ```
   * @param app
   */
  findInstances(app: AppIdentifier): Promise<Array<AppIdentifier>>;

  /**
   * Publishes context to other apps on the desktop.  Calling `broadcast` at the `DesktopAgent` scope will push the context to whatever _User Channel_ the app is joined to.  If the app is not currently joined to a channel, calling `fdc3.broadcast` will have no effect.  Apps can still directly broadcast and listen to context on any channel via the methods on the `Channel` class.
   *
   * DesktopAgent implementations should ensure that context messages broadcast to a channel by an application joined to it should not be delivered back to that same application.
   *
   * If you are working with complex context types composed of other simpler types then you should broadcast
   * each individual type (starting with the simpler types, followed by the complex type) that you want other
   * apps to be able to respond to. Doing so allows applications to filter the context types they receive by
   * adding listeners for specific context types.
   *
   * If an application attempts to broadcast an invalid context argument the Promise returned by this function should reject with the `ChannelError.MalformedContext` error.
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
   * Raises a specific intent for resolution against apps registered with the Desktop Agent.
   *
   * The desktop agent MUST resolve the correct app to target based on the provided intent name and context data. If multiple matching apps are found, the user MAY be presented with a Resolver UI allowing them to pick one, or another method of Resolution applied to select an app.
   * Alternatively, the specific app or app instance to target can also be provided. A list of valid target applications and instances can be retrieved via `findIntent`.
   *
   * If a target app for the intent cannot be found with the criteria provided or the user either closes the resolver UI or otherwise cancels resolution, the promise MUST be rejected with an `Error` object with a `message` chosen from the `ResolveError` enumeration, or (if connected to a Desktop Agent Bridge) the `BridgingError` enumeration. If a specific target `app` parameter was set, but either the app or app instance is not available, the promise MUST be rejected with an `Error` object with either the `ResolveError.TargetAppUnavailable` or `ResolveError.TargetInstanceUnavailable` string as its `message`. If an invalid context object is passed as an argument the promise MUST be rejected with an `Error` object with the `ResolveError.MalformedContext` string as its `message`.
   *
   * If you wish to raise an Intent without a context, use the `fdc3.nothing` context type. This type exists so that apps can explicitly declare support for raising an intent without context.
   *
   * Returns an `IntentResolution` object with details of the app instance that was selected (or started) to respond to the intent.
   *
   * Issuing apps may optionally wait on the promise that is returned by the `getResult()` member of the `IntentResolution`. This promise will resolve when the _receiving app's_ intent handler function returns and resolves a promise. The Desktop Agent resolves the issuing app's promise with the Context object, Channel object or void that is provided as resolution within the receiving app. The Desktop Agent MUST reject the issuing app's promise, with a string from the `ResultError` enumeration, if: (1) the intent handling function's returned promise rejects, (2) the intent handling function doesn't return a valid response (a promise or void), or (3) the returned promise resolves to an invalid type.
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
   * //Raise an intent and retrieve a result from the IntentResolution
   * let resolution = await agent.raiseIntent("intentName", context);
   * try {
   * 	   const result = await resolution.getResult();
   *     if (result && result.broadcast) { //detect whether the result is Context or a Channel
   *         console.log(`${resolution.source} returned a channel with id ${result.id}`);
   *     } else if (result){
   *         console.log(`${resolution.source} returned data: ${JSON.stringify(result)}`);
   *     } else {
   *         console.error(`${resolution.source} didn't return anything`
   *     }
   * } catch(error) {
   *     console.error(`${resolution.source} returned an error: ${error}`);
   * }
   * ```
   */
  raiseIntent(intent: Intent, context: Context, app?: AppIdentifier): Promise<IntentResolution>;

  /**
   * Finds and raises an intent against apps registered with the desktop agent based on the type of the specified context data example.
   *
   * The desktop agent SHOULD first resolve to a specific intent based on the provided context if more than one intent is available for the specified context. This MAY be achieved by displaying a resolver UI. It SHOULD then resolve to a specific app to handle the selected intent and specified context.
   * Alternatively, the specific app or app instance to target can also be provided, in which case the resolver SHOULD only offer intents supported by the specified application.
   *
   * Using `raiseIntentForContext` is similar to calling `findIntentsByContext`, and then raising an intent against one of the returned apps, except in this case the desktop agent has the opportunity to provide the user with a richer selection interface where they can choose both the intent and target app.
   *
   * Returns an `IntentResolution` object, see `raiseIntent()` for details.
   *
   * If a target intent and app cannot be found with the criteria provided or the user either closes the resolver UI or otherwise cancels resolution, the promise MUST be rejected with an `Error` object with a `message` chosen from the `ResolveError` enumeration, or (if connected to a Desktop Agent Bridge) the `BridgingError` enumeration. If a specific target `app` parameter was set, but either the app or app instance is not available, the promise MUST be rejected with an `Error` object with either the `ResolveError.TargetAppUnavailable` or `ResolveError.TargetInstanceUnavailable` string as its `message`.  If an invalid context object is passed as an argument the promise MUST be rejected with an `Error` object with the `ResolveError.MalformedContext` string as its `message`.
   *
   * ```javascript
   * // Resolve against all intents registered for the type of the specified context
   * await fdc3.raiseIntentForContext(context);
   *
   * // Resolve against all intents registered by a specific target app for the specified context
   * await fdc3.raiseIntentForContext(context, targetAppIdentifier);
   * ```
   */
  raiseIntentForContext(context: Context, app?: AppIdentifier): Promise<IntentResolution>;

  /**
   * Adds a listener for incoming intents raised by other applications, via calls to `fdc3.raiseIntent` or `fdc3.raiseIntentForContext.  If the application is intended to be launched to resolve raised intents, it SHOULD add its intent listeners as quickly as possible after launch or an error MAY be returned to the caller and the intent and context may not be delivered. The exact timeout used is set by the Desktop Agent implementation, but MUST be at least 15 seconds.
   *
   * The handler function may return void or a promise that should resolve to an `IntentResult`, which is either a `Context` object, representing any data that should be returned to the app that raised the intent, a `Channel` Object, a `PrivateChannel` over which data responses will be sent, or `void`. The `IntentResult` will be returned to app that raised the intent via the `IntentResolution` and retrieved from it using the `getResult()` function.
   *
   * The Desktop Agent MUST reject the promise returned by the `getResult()` function of `IntentResolution` if: (1) the intent handling function's returned promise rejects, (2) the intent handling function doesn't return a promise, or (3) the returned promise resolves to an invalid type.
   *
   * The `PrivateChannel` type is provided to support synchronization of data transmitted over returned channels, by allowing both parties to listen for events denoting subscription and unsubscription from the returned channel. `PrivateChannels` are only retrievable via raising an intent.
   *
   * Optional metadata about the raised intent, including the app that originated the message, SHOULD be provided by the desktop agent implementation.
   *
   * ```javascript
   * //Handle a raised intent
   * const listener = fdc3.addIntentListener('StartChat', context => {
   *     // start chat has been requested by another application
   *     return;
   * });
   *
   * //Handle a raised intent and log the originating app metadata
   * const listener = fdc3.addIntentListener('StartChat', (contact, metadata) => {
   *   console.log(`Received intent StartChat\nContext: ${contact}\nOriginating app: ${metadata?.source}`);
   *   return;
   * });
   *
   * //Handle a raised intent and return Context data via a promise
   * fdc3.addIntentListener("CreateOrder", (context) => {
   *     return new Promise<Context>((resolve) => {
   *         // go create the order
   *         resolve({type: "fdc3.order", id: { "orderId": 1234}});
   *	   });
   * });
   *
   * //Handle a raised intent and return a Private Channel over which response will be sent
   * fdc3.addIntentListener("QuoteStream", async (context) => {
   *   const channel: PrivateChannel = await fdc3.createPrivateChannel();
   *   const symbol = context.id.symbol;
   *
   *   // Called when the remote side adds a context listener
   *   const addContextListener = channel.onAddContextListener((contextType) => {
   *     // broadcast price quotes as they come in from our quote feed
   *     feed.onQuote(symbol, (price) => {
   *       channel.broadcast({ type: "price", price});
   *     });
   *   });
   *
   *   // Stop the feed if the remote side closes
   *   const disconnectListener = channel.onDisconnect(() => {
   *     feed.stop(symbol);
   *   });
   *
   *   return channel;
   * });
   * ```
   */
  addIntentListener(intent: Intent, handler: IntentHandler): Promise<Listener>;

  /**
   * Adds a listener for incoming context broadcasts from the Desktop Agent (via a User channel or `fdc3.open`API call. If the consumer is only interested in a context of a particular type, they can they can specify that type. If the consumer is able to receive context of any type or will inspect types received, then they can pass `null` as the `contextType` parameter to receive all context types.
   *
   * Context broadcasts are primarily received from apps that are joined to the same User Channel as the listening application, hence, if the application is not currently joined to a User Channel no broadcasts will be received from channels. If this function is called after the app has already joined a channel and the channel already contains context that would be passed to the context listener, then it will be called immediately with that context.
   *
   * Context may also be received via this listener if the application was launched via a call to  `fdc3.open`, where context was passed as an argument. In order to receive this, applications SHOULD add their context listener as quickly as possible after launch, or an error MAY be returned to the caller and the context may not be delivered. The exact timeout used is set by the Desktop Agent implementation, but MUST be at least 15 seconds.
   *
   * Optional metadata about the context message, including the app that originated the message, SHOULD be provided by the desktop agent implementation.
   *
   * ```javascript
   * // any context
   * const listener = await fdc3.addContextListener(null, context => { ... });
   *
   * // listener for a specific type
   * const contactListener = await fdc3.addContextListener('fdc3.contact', contact => { ... });
   *
   * // listener that logs metadata for the message a specific type
   * const contactListener = await fdc3.addContextListener('fdc3.contact', (contact, metadata) => {
   *   console.log(`Received context message\nContext: ${contact}\nOriginating app: ${metadata?.source}`);
   *   //do something else with the context
   * });
   * ```
   */
  addContextListener(contextType: ContextType | null, handler: ContextHandler): Promise<Listener>;

  /**
   * Register a handler for events from the Desktop Agent. Whenever the handler function
   * is called it will be passed an event object with details related to the event.
   *
   * ```js
   * // any event type
   * const listener = await fdc3.addEventListener(null, event => { ... });
   *
   * // listener for a specific event type that logs its details
   * const userChannelChangedListener = await fdc3.addEventListener("userChannelChanged", event => {
   * console.log(`Received event ${event.type}\n\tDetails: ${event.details}`);
   * //do something else with the event
   * });
   * ```
   *
   * @param {FDC3EventType|null} type If non-null, only events of the specified type will be received by the handler.
   * @param {EventHandler} handler A function that events received will be passed to.
   *
   */
  addEventListener(type: FDC3EventTypes | null, handler: EventHandler): Promise<Listener>;

  /**
   * Retrieves a list of the User channels available for the app to join.
   */
  getUserChannels(): Promise<Array<Channel>>;

  /**
   * Optional function that joins the app to the specified User channel. In most cases, applications SHOULD be joined to channels via UX provided to the application by the desktop agent, rather than calling this function directly.
   *
   * If an app is joined to a channel, all `fdc3.broadcast` calls will go to the channel, and all listeners assigned via `fdc3.addContextListener` will listen on the channel.
   *
   * If the channel already contains context that would be passed to context listeners added via `fdc3.addContextListener` then those listeners will be called immediately with that context.
   *
   * An app can only be joined to one channel at a time.
   *
   * If an error occurs (such as the channel is unavailable or the join request is denied) the promise MUST be rejected with an `Error` Object with a `message` chosen from the `ChannelError` enumeration.
   *
   * ```javascript
   *   // get all system channels
   *   const channels = await fdc3.getUserChannels();
   *   // create UI to pick from the User channels
   *   // join the channel on selection
   *   fdc3.joinUserChannel(selectedChannel.id);
   *  ```
   */
  joinUserChannel(channelId: string): Promise<void>;

  /**
   * Returns a `Channel` object for the specified channel, creating it (as an _App_ channel) if it does not exist.
   *
   * If the Channel cannot be created or access was denied, the returned promise MUST be rejected with an `Error` Object with a `message` chosen from the `ChannelError` enumeration.
   *
   * ```javascript
   * try {
   *   const myChannel = await fdc3.getOrCreateChannel("myChannel");
   *   const myChannel.addContextListener(null, context => {});
   * }
   * catch (err){
   *   //app could not register the channel
   * }
   * ```
   */
  getOrCreateChannel(channelId: string): Promise<Channel>;

  /**
   * Returns a `Channel` with an auto-generated identity that is intended for private communication between applications. Primarily used to create Channels that will be returned to other applications via an `IntentResolution` for a raised intent.
   *
   * If the `PrivateChannel` cannot be created, the returned promise MUST be rejected with an `Error` object with a `message` chosen from the `ChannelError` enumeration.
   *
   * The `PrivateChannel` type is provided to support synchronization of data transmitted over returned channels, by allowing both parties to listen for events denoting subscription and unsubscription from the returned channel. `PrivateChannels` are only retrievable via raising an intent.
   *
   *  * It is intended that Desktop Agent implementations:
   * - SHOULD restrict external apps from listening or publishing on this channel.
   * - MUST prevent `PrivateChannels` from being retrieved via fdc3.getOrCreateChannel.
   * - MUST provide the `id` value for the channel as required by the `Channel` interface.
   *
   * ```javascript
   * fdc3.addIntentListener("QuoteStream", async (context) => {
   * 	const channel: PrivateChannel = await fdc3.createPrivateChannel();
   * 	const symbol = context.id.ticker;
   *
   * 	// This gets called when the remote side adds a context listener
   * 	const addContextListener = channel.onAddContextListener((contextType) => {
   * 		// broadcast price quotes as they come in from our quote feed
   * 		feed.onQuote(symbol, (price) => {
   * 			channel.broadcast({ type: "price", price});
   * 		});
   * 	});
   *
   * 	// This gets called when the remote side calls Listener.unsubscribe()
   * 	const unsubscriberListener = channel.onUnsubscribe((contextType) => {
   * 		feed.stop(symbol);
   * 	});
   *
   * 	// This gets called if the remote side closes
   * 	const disconnectListener = channel.onDisconnect(() => {
   * 		feed.stop(symbol);
   * 	})
   *
   * 	return channel;
   * });
   * ```
   */
  createPrivateChannel(): Promise<PrivateChannel>;

  /**
   * Optional function that returns the `Channel` object for the current User channel membership. In most cases, an application's membership of channels SHOULD be managed via UX provided to the application by the desktop agent, rather than calling this function directly.
   *
   * Returns `null` if the app is not joined to a channel.
   */
  getCurrentChannel(): Promise<Channel | null>;

  /**
   * Optional function that removes the app from any User channel membership. In most cases, an application's membership of channels SHOULD be managed via UX provided to the application by the desktop agent, rather than calling this function directly.
   *
   * Context broadcast and listening through the top-level `fdc3.broadcast` and `fdc3.addContextListener` will be a no-op when the app is not on a channel.
   *
   * ```javascript
   * //desktop-agent scope context listener
   * const fdc3Listener = fdc3.addContextListener(null, context => {});
   * await fdc3.leaveCurrentChannel();
   * //the fdc3Listener will now cease receiving context
   * //listening on a specific channel, retrieved via fdc3.getOrCreateChannel(), will continue to work:
   * redChannel.addContextListener(null, channelListener);
   * ```
   */
  leaveCurrentChannel(): Promise<void>;

  /**
   * Retrieves information about the FDC3 Desktop Agent implementation, including the supported version
   * of the FDC3 specification, the name of the provider of the implementation, its own version number
   * and the metadata of the calling application according to the desktop agent.
   *
   * Returns an `ImplementationMetadata` object.  This metadata object can be used to vary the behavior
   * of an application based on the version supported by the Desktop Agent and for logging purposes.
   *
   * ```js
   * import {compareVersionNumbers, versionIsAtLeast} from '@kite9/fdc3';
   *
   * if (fdc3.getInfo && versionIsAtLeast(await fdc3.getInfo(), "1.2")) {
   *   await fdc3.raiseIntentForContext(context);
   * } else {
   *   await fdc3.raiseIntent("ViewChart", context);
   * }
   * ```
   *
   * The `ImplementationMetadata` object returned also includes the metadata for the calling application,
   * according to the Desktop Agent. This allows the application to retrieve its own `appId`, `instanceId`
   * and other details, e.g.:
   *
   * ```js
   * let implementationMetadata = await fdc3.getInfo();
   * let {appId, instanceId} = implementationMetadata.appMetadata;
   * ```
   */
  getInfo(): Promise<ImplementationMetadata>;

  /**
   * Retrieves the `AppMetadata` for an `AppIdentifier`, which provides additional metadata (such as icons,
   * a title and description) from the App Directory record for the application, that may be used for display
   * purposes.
   *
   * If the app is not found, the promise MUST be rejected with an `Error` Object with the `message` given by `ResolveError.TargetAppUnavailable`, or (if connected to a Desktop Agent Bridge) an error from the `BridgingError` enumeration.
   *
   * ```js
   * let appIdentifier = { appId: "MyAppId@my.appd.com" }
   * let appMetadata = await fdc3.getAppMetadata(appIdentifier);
   * ```
   */
  getAppMetadata(app: AppIdentifier): Promise<AppMetadata>;

  //---------------------------------------------------------------------------------------------
  // Deprecated function signatures
  //---------------------------------------------------------------------------------------------

  /**
   * Adds a listener for incoming context broadcasts from the Desktop Agent.
   * @deprecated use `addContextListener(null, handler)` instead of `addContextListener(handler)`. Provided for backwards compatibility with versions FDC3 standard <2.0.
   */
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  addContextListener(handler: ContextHandler): Promise<Listener>;

  /**
   * @deprecated Alias to the `getUserChannels` function provided for backwards compatibility with versions FDC3 standard <2.0.
   */
  getSystemChannels(): Promise<Array<Channel>>;

  /**
   * @deprecated Alias to the `joinUserChannel` function Provided for backwards compatibility with versions FDC3 standard <2.0.
   */
  joinChannel(channelId: string): Promise<void>;

  /**
   * @deprecated version of `open` that launches an app by by name rather than `AppIdentifier`. Provided for backwards compatibility with versions FDC3 standard <2.0.
   *
   * ```javascript
   * //Open an app without context, using the app name
   * let instanceMetadata = await fdc3.open('myApp');
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  open(name: string, context?: Context): Promise<AppIdentifier>;

  /**
   * @deprecated version of `raiseIntent` that targets an app by by name rather than `AppIdentifier`. Provided for backwards compatibility with versions FDC3 standard <2.0.
   *
   * ```javascript
   * // use the `name` metadata of an app to describe the target app for the intent
   * await fdc3.raiseIntent("StartChat", context, appIntent.apps[0].name);
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  raiseIntent(intent: Intent, context: Context, name: string): Promise<IntentResolution>;

  /**
   * @deprecated version of `raiseIntentForContext` that targets an app by by name rather than `AppIdentifier`. Provided for backwards compatibility with versions FDC3 standard <2.0.
   *
   * ```javascript
   * // Resolve against all intents registered by a specific target app name for the specified context
   * await fdc3.raiseIntentForContext(context, targetAppName);
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  raiseIntentForContext(context: Context, name: string): Promise<IntentResolution>;
}
