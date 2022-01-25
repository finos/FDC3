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
   * If a Context object is passed in, this object will be provided to the opened application via a contextListener.
   * The Context argument is functionally equivalent to opening the target app with no context and broadcasting the context directly to it.
   *
   * If opening errors, it returns an `Error` with a string from the `OpenError` enumeration.
   *
   *  ```javascript
   *     //no context and string as target
   *     fdc3.open('myApp');
   *     //no context and AppMetadata object as target
   *     fdc3.open({name: 'myApp', title: 'The title for the application myApp.', description: '...'});
   *     //with context
   *     fdc3.open('myApp', context);
   * ```
   */
  open(app: TargetApp, context?: Context): Promise<void>;

  /**
   * Find out more information about a particular intent by passing its name, and optionally its context and/or a desired result context type.
   *
   * findIntent is effectively granting programmatic access to the Desktop Agent's resolver.
   * A promise resolving to the intent, its metadata and metadata about the apps that registered it is returned.
   * This can be used to raise the intent against a specific app.
   *
   * If the resolution fails, the promise will return an `Error` with a string from the `ResolveError` enumeration.
   *
   * ```javascript
   * // I know 'StartChat' exists as a concept, and want to know which apps can resolve it ...
   * const appIntent = await fdc3.findIntent("StartChat");
   *
   * // returns a single AppIntent:
   * // {
   * //     intent: { name: "StartChat", displayName: "Chat" },
   * //     apps: [{ name: "Skype" }, { name: "Symphony" }, { name: "Slack" }]
   * // }
   *
   * // raise the intent against a particular app
   * await fdc3.raiseIntent(appIntent.intent.name, context, appIntent.apps[0].name);
   * ```
   *
   * An optional input context object and result context type may be specified, which the resolver MUST use to filter the returned applications such that each supports the specified input and result types.
   *
   * ```javascript
   * const appIntent = await fdc3.findIntent("StartChat", contact);
   *
   * // returns only apps that support the type of the specified input context:
   * // {
   * //     intent: { name: "StartChat", displayName: "Chat" },
   * //     apps: { name: "Symphony" }]
   * // }
   *
   * const appIntent = await fdc3.findIntent("ViewContact", "fdc3.ContactList");
   *
   * // returns only apps that return the specified result Context type:
   * // {
   * //     intent: { name: "ViewContact", displayName: "View Contact Details" },
   * //     apps: { name: "MyCRM", resultContext: "fdc3.ContactList"}]
   * // }
   * ```
   */
  findIntent(intent: string, context?: Context, resultContextType?: string): Promise<AppIntent>;

  /**
   * Find all the avalable intents for a particular context, and optionally a desired result context type.
   *
   * findIntents is effectively granting programmatic access to the Desktop Agent's resolver.
   * A promise resolving to all the intents, their metadata and metadata about the apps that registered it is returned,
   * based on the context types the intents have registered.
   *
   * If the resolution fails, the promise will return an `Error` with a string from the `ResolveError` enumeration.
   *
   * ```javascript
   * // I have a context object, and I want to know what I can do with it, hence, I look for intents and apps to resolve them...
   * const appIntents = await fdc3.findIntentsByContext(context);
   *
   * // returns for example:
   * // [{
   * //     intent: { name: "StartCall", displayName: "Call" },
   * //     apps: [{ name: "Skype" }]
   * // },
   * // {
   * //     intent: { name: "StartChat", displayName: "Chat" },
   * //     apps: [{ name: "Skype" }, { name: "Symphony" }, { name: "Slack" }]
   * // },
   * // {
   * //     intent: { name: "ViewContact", displayName: "View Contact" },
   * //     apps: [{ name: "Symphony" }, { name: "MyCRM", resultContext: "fdc3.ContactList"}]
   * // }];
   *
   * // or I look for only intents that are resolved by apps returning a particular context type
   * const appIntentsForType = await fdc3.findIntentsByContext(context, "fdc3.ContactList");
   * // returns for example:
   * // [{
   * //     intent: { name: "ViewContact", displayName: "View Contacts" },
   * //     apps: [{ name: "MyCRM", resultContext: "fdc3.ContactList"}]
   * // }];
   *
   * // select a particular intent to raise
   * const resolvedIntent = appIntents[0];
   *
   * // target a particular app
   * const selectedApp = resolvedIntent.apps[0];
   *
   * // raise the intent, passing the given context, targeting the app
   * await fdc3.raiseIntent(resolvedIntent.intent.name, context, selectedApp.name);
   * ```
   */
  findIntentsByContext(context: Context, resultContextType?: string): Promise<Array<AppIntent>>;

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
   * The desktop agent MUST resolve the correct app to target based on the provided intent name and optional context data example. If multiple matching apps are found, the user MAY be presented with a Resolver UI allowing them to pick one, or another method of Resolution applied to select an app.
   * Alternatively, the specific app to target can also be provided. A list of valid target applications can be retrieved via `findIntent`.
   *
   * Returns an `IntentResolution` object with details of the app that was selected to respond to the intent.
   *
   * Issuing apps may optionally wait on the promise that is returned by the `getResult()` member of the IntentResolution. This promise will resolve when the _receiving app's_ intent handler function returns and resolves a promise. The Desktop Agent resolves the issuing app's promise with the Context object that is provided as resolution within the receiving app. The Desktop Agent MUST reject the issuing app's promise, with a string from the `ResultError` enumeration, if: (1) the intent handling function's returned promise rejects, (2) the intent handling function doesn't return a promise, or (3) the returned promise resolves to an invalid type.
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
   * // use the returned AppIntent object to target one of the returned chat apps by name
   * await fdc3.raiseIntent("StartChat", context, appIntent.apps[0].name);
   * // or use one of the AppMetadata objects returned in the AppIntent object's 'apps' array
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
   * Finds and raises an intent against apps registered with the desktop agent based on the type of the specified context data example.
   *
   * The desktop agent will first resolve to a specific intent based on the provided context if more than one intent is available for the specified context. This MAY be achieved by displaying a resolver UI. It SHOULD then resolve to a specific app to handle the selected intent and specified context.
   * Alternatively, the specific app to target can also be provided, in which case the resolver SHOULD only offer intents supported by the specified application.
   *
   * Using `raiseIntentForContext` is similar to calling `findIntentsByContext`, and then raising an intent against one of the returned apps, except in this case the desktop agent has the opportunity to provide the user with a richer selection interface where they can choose both the intent and target app.
   *
   * Returns an `IntentResolution` object, see `raiseIntent()` for details.
   *
   * If a target app for the intent cannot be found with the criteria provided, an `Error` with a string from the `ResolveError` enumeration is returned.
   *
   * ```javascript
   * // Resolve against all intents registered for the type of the specified context
   * await fdc3.raiseIntentForContext(context);
   *
   * // Resolve against all intents registered by a specific target app for the specified context
   * await fdc3.raiseIntentForContext(context, targetAppMetadata);
   * ```
   */
  raiseIntentForContext(context: Context, app?: TargetApp): Promise<IntentResolution>;

  /**
   * Adds a listener for incoming Intents from the Desktop Agent. The handler function
   * may return void or a promise that resolves to a context object (data that should
   * be returned to app that raised the intent).
   *
   * The Desktop Agent MUST reject the promise returned by the `getResult()` function of
   * `IntentResolution` if: (1) the intent handling function's returned promise rejects,
   * (2) the intent handling function doesn't return a promise, or (3) the returned promise
   * resolves to an invalid type.
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
   * Joins the app to the specified channel.
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
   * Returns the `Channel` object for the current channel membership.
   * Returns `null` if the app is not joined to a channel.
   */
  getCurrentChannel(): Promise<Channel | null>;

  /**
   * Removes the app from any channel membership.
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
