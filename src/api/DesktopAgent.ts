/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

import { AppIntent } from './AppIntent';
import { Channel } from './Channel';
import { ContextHandler } from './ContextHandler';
import { IntentResolution } from './IntentResolution';
import { Listener } from './Listener';
import { Context } from '../context/ContextTypes';
import { AppInstance } from './AppInstance';

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
   * Launches an app by name.  Resolves with an `AppInstance` reference for the opened app, or `null` if the app name could not be resolved.
   *
   * If a Context object is passed in, this object will be provided to the opened application via a contextListener.
   * The Context argument is functionally equivalent to opening the target app with no context and broadcasting the context directly to it.
   *
   * If opening errors, it returns an `Error` with a string from the `OpenError` enumeration.
   *
   *  ```javascript
   *     //no context
   *     agent.open('myApp');
   *     //with context
   *     agent.open('myApp', context);
   * ```
   */
  open(name: string, context?: Context): Promise<AppInstance | null>;

  /**
   * Find out more information about a particular intent by passing its name, and optionally its context.
   *
   * findIntent is effectively granting programmatic access to the Desktop Agent's resolver.
   * A promise resolving to the intent, its metadata and metadata about the apps that registered it is returned.
   * This can be used to raise the intent against a specific app.
   *
   * If the resolution fails, the promise will return an `Error` with a string from the `ResolveError` enumeration.
   *
   * ```javascript
   * // I know 'StartChat' exists as a concept, and want to know more about it ...
   * const appIntent = await agent.findIntent("StartChat");
   *
   * // returns a single AppIntent:
   * // {
   * //     intent: { name: "StartChat", displayName: "Chat" },
   * //     apps: [{ name: "Skype" }, { name: "Symphony" }, { name: "Slack" }]
   * // }
   *
   * // raise the intent against a particular app
   * await agent.raiseIntent(appIntent.intent.name, context, appIntent.apps[0].name);
   * ```
   */
  findIntent(intent: string, context?: Context): Promise<AppIntent>;

  /**
   * Find all the avalable intents for a particular context.
   *
   * findIntents is effectively granting programmatic access to the Desktop Agent's resolver.
   * A promise resolving to all the intents, their metadata and metadata about the apps that registered it is returned,
   * based on the context types the intents have registered.
   *
   * If the resolution fails, the promise will return an `Error` with a string from the `ResolveError` enumeration.
   *
   * ```javascript
   * // I have a context object, and I want to know what I can do with it, hence, I look for for intents...
   * const appIntents = await agent.findIntentsByContext(context);
   *
   * // returns for example:
   * // [{
   * //     intent: { name: "StartCall", displayName: "Call" },
   * //     apps: [{ name: "Skype" }]
   * // },
   * // {
   * //     intent: { name: "StartChat", displayName: "Chat" },
   * //     apps: [{ name: "Skype" }, { name: "Symphony" }, { name: "Slack" }]
   * // }];
   *
   * // select a particular intent to raise
   * const startChat = appIntents[1];
   *
   * // target a particular app
   * const selectedApp = startChat.apps[0];
   *
   * // raise the intent, passing the given context, targeting the app
   * await agent.raiseIntent(startChat.intent.name, context, selectedApp.name);
   * ```
   */
  findIntentsByContext(context: Context): Promise<Array<AppIntent>>;

  /**
   * Publishes context to other apps on the desktop.
   * ```javascript
   *  agent.broadcast(context);
   * ```
   */
  broadcast(context: Context): void;

  /**
   * Raises an intent to the desktop agent to resolve.
   * ```javascript
   * //Find apps to resolve an intent to start a chat with a given contact
   * const appIntent = await fdc3.findIntent("StartChat", context);
   * //use the returned AppIntent object to target one of the returned chat apps with the context
   * await fdc3.raiseIntent("StartChat", context, appIntent.apps[0].name);
   * ```
   */
  raiseIntent(
    intent: string,
    context: Context,
    target?: string
  ): Promise<IntentResolution>;

  /**
   * Adds a listener for incoming Intents from the Agent.
   */
  addIntentListener(intent: string, handler: ContextHandler): Listener;

  /**
   * Adds a listener for incoming context broadcast from the Desktop Agent.
   */
  addContextListener(handler: ContextHandler): Listener;

  /**
   * Adds a listener for the broadcast of a specific type of context object.
   */
  addContextListener(contextType: string, handler: ContextHandler): Listener;

  /**
   * Retrieves a list of the System channels available for the app to join
   */
  getSystemChannels(): Promise<Array<Channel>>;

  /**
   * Joins the app to the specified channel.
   * An app can only be joined to one channel at a time.
   * Rejects with error if the channel is unavailable or the join request is denied.
   * `Error` with a string from the `ChannelError` enumeration.
   */
  joinChannel(channelId: string): Promise<void>;

  /**
   * Returns a channel with the given identity. Either stands up a new channel or returns an existing channel.
   *
   * It is up to applications to manage how to share knowledge of these custom channels across windows and to manage
   * channel ownership and lifecycle.
   *
   * `Error` with a string from the `ChannelError` enumeration.
   */
  getOrCreateChannel(channelId: string): Promise<Channel>;

  /**
   * Returns the `Channel` object for the current channel membership.
   *
   * Returns `null` if the app is not joined to a channel.
   */
  getCurrentChannel(): Promise<Channel>;

  /**
   * Returns the instance of an app for a given identifier
   *
   * An instanceId can be obtained from
   *  - *source* propery in an IntentResolution
   *
   * For example:
   * ```javascript
   *  //get an app instance discovered through intent resolutionn
   *  const intentRes = await fdc3.raiseIntent("ViewChart", someContext);
   *
   *  const chartApp = await fdc3.getAppInstance(intentRes.source);
   *
   *  //send a new context to the same chart
   *   chartApp.broadcast(newContext);
   *
   *  //raise a data intent and create a subscription to updates from the data provider
   *  const intentRes = await fdc3.raiseIntent("GetPrices", someContext);
   *
   *  //get the provider from the resolution object and set handler for future updates
   *  const priceProvider = await fdc3.getAppInstance(intentRes.source);
   *  priceProvider.addContextListener("GetPrices", updatePrice);
   *
   *  //handle immediate context data payload (if any)
   *  if (intentRes.data){
   *    updatePrice(intentRes.data);
   *  }
   *
   *
   * ```
   *
   */
  getAppInstance(instanceId: string): Promise<AppInstance>;
}
