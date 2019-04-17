type Context = object;

enum OpenError {
  AppNotFound = "AppNotFound",
  ErrorOnLaunch = "ErrorOnLaunch",
  AppTimeout = "AppTimeout",
  ResolverUnavailable = "ResolverUnavailable"
}

enum ResolveError {
  NoAppsFound = "NoAppsFound",
  ResolverUnavailable = "ResolverUnavailable",
  ResolverTimeout = "ResolverTimeout"
}

/**
* Intent descriptor
*/
interface IntentMetadata {
  name: string;
  displayName: string;
}

/**
* An interface that relates an intent to apps
*/
interface AppIntent {
  intent: IntentMetadata;
  apps: Array<AppMetadata>;
}

/**
 * App metadata is Desktop Agent specific - but should support a name property.
 */
interface AppMetadata {
  name: string;
}

/**
 * IntentResolution provides a standard format for data returned upon resolving an intent.
 * ```javascript
 * //resolve a "Chain" type intent
 * var intentR = await agent.raiseIntent("intentName", context);
 * //resolve a "Client-Service" type intent with data response
 * var intentR = await agent.raiseIntent("intentName", context);
 * var dataR = intentR.data;
 * ```
 */
interface IntentResolution {
  source: string;
  data?: object;
  version: string;
}

/**
 * IntentListenerResponse describes the return type of an intent listener handler
 * set up with addIntentListener.
 * It's valid to not return anything at all, for "fire and forget" type intents,
 * otherwise the handler must return a Promise that resolves to an object with a
 * "data" property in it.
 * ```javascript
 * // Valid
 * agent.addIntentListener("IntentName", (context) => {
 *   doSomething();
 * });
 * agent.addIntentListener("IntentName2", (context) => {
 *   return Promise.resolve({
 *     data: payload
 *   });
 * });
 *
 * // Invalid
 * agent.addIntentListener("IntentName", (context) => {
 *   return {
 *     payload
 *   };
 * });
 * agent.addIntentListener("IntentName", (context) => {
 *   return Promise.resolve({
 *     some: 'thing'
 *   });
 * });
 * ```
 */
type IntentListenerResponse = Promise<{data:any}> | void;

interface Listener {
  /**
   * Unsubscribe the listener object.
   */
  unsubscribe();
}

/**
 * A Desktop Agent is a desktop component (or aggregate of components) that serves as a
 * launcher and message router (broker) for applications in its domain.
 * 
 * A Desktop Agent can be connected to one or more App Directories and will use directories for application
 * identity and discovery. Typically, a Desktop Agent will contain the proprietary logic of
 * a given platform, handling functionality like explicit application interop workflows where
 * security, consistency, and implementation requirements are proprietary.
 */
interface DesktopAgent {
  /**
   * Launches/links to an app by name.
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
  open(name: string, context?: Context): Promise<void>;

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
   * const appIntents = await agent.findIntentsForContext(context);
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
   * //raise an intent to start a chat with a given contact
   * const intentR = await agent.findIntents("StartChat", context);
   * //use the IntentResolution object to target the same chat app with a new context
   * agent.raiseIntent("StartChat", newContext, intentR.source);
   * ```
   */
  raiseIntent(intent: string, context: Context, target?: string): Promise<IntentResolution>;

  /**
   * Adds a listener for incoming Intents from the Agent.
   */
  addIntentListener(intent: string, handler: (context: Context) => IntentListenerResponse): Listener;

  /**
   * Adds a listener for incoming context broadcast from the Desktop Agent.
   */
  addContextListener(handler: (context: Context) => void): Listener;
}
