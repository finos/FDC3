import { AppIdentifier, AppIntent, DisplayMetadata, PrivateChannelEventTypes } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { AppRegistration, InstanceID, State, ReceivableMessage } from './AppRegistration';
import { PendingApp } from './PendingApp';
import { Directory } from './directory/DirectoryInterface';

export enum HeartbeatActivityEvent {
  ConnectedResponding = 'ConnectedResponding',
  NotRespondingAfterDisconnectTime = 'NotRespondingAfterDisconnectTime',
  NotRespondingAfterDeadTime = 'NotRespondingAfterDeadTime',
}

export type ContextListenerRegistration = {
  appId: string;
  instanceId: string;
  listenerUuid: string;
  channelId: string | null;
  contextType: string | null;
};

export type PrivateChannelEventListener = {
  appId: string;
  instanceId: string;
  channelId: string;
  eventType: PrivateChannelEventTypes | null;
  listenerUuid: string;
};

export type DesktopAgentEventListener = {
  appId: string;
  instanceId: string;
  eventType: string | null;
  listenerUuid: string;
};

export enum ChannelType {
  'user',
  'app',
  'private',
}

export type ChannelState = {
  id: string;
  type: ChannelType;
  context: Context[];
  displayMetadata: DisplayMetadata;
};

export type IntentListenerRegistration = {
  appId: string;
  instanceId: string;
  intentName: string;
  listenerUUID: string;
};

/**
 * Handles messaging to apps and opening apps for ONE FDC3 environment.
 * Stores all state for MessageHandlers to use.
 */
export interface FDC3ServerInstance {
  /**
   * Returns the directory used by this FDC3ServerInstance.
   */
  getDirectory(): Directory;

  /**
   * UUID for outgoing message
   */
  createUUID(): string;

  /**
   * Post an outgoing message to a particular app
   */
  post(message: object, instanceId: InstanceID): Promise<void>;

  /**
   * Opens a new instance of an application.
   * Promise completes once the application window is opened
   */
  open(appId: string): Promise<InstanceID>;

  /**
   * Registers a particular instance id with a given app id
   */
  setInstanceDetails(uuid: InstanceID, details: AppRegistration): void;

  /**
   * Returns the connection details for a particular instance of an app.
   * Used in a variety of MessageHandler classes to retrieve details for
   * an app and when validating an app's identity when connecting.
   */
  getInstanceDetails(uuid: InstanceID): AppRegistration | undefined;

  /**
   * Registers an app as connected to the desktop agent.
   */
  setAppState(app: InstanceID, state: State): Promise<void>;

  /**
   * Handle heartbeat activity from the HeartbeatHandler.
   * The server instance can decide how to respond to different heartbeat events.
   */
  heartbeatActivity(instanceId: InstanceID, event: HeartbeatActivityEvent): Promise<void>;

  /**
   * Returns the list of apps open and connected to FDC3 at the current time.
   * Note, it is the implementor's job to ensure this list is
   * up-to-date in the event of app crashes or disconnections.
   */
  getConnectedApps(): Promise<AppRegistration[]>;

  /**
   * Return the list of all apps that have ever been registered with the ServerContext.
   */
  getAllApps(): Promise<AppRegistration[]>;

  /**
   * Helper function for determining if an app is currently open and connected to the da
   */
  isAppConnected(app: InstanceID): Promise<boolean>;

  /**
   * Allows you to write a log message somewhere
   */
  log(message: string): void;

  /**
   * Name of the provider of this desktop agent server
   */
  provider(): string;

  /**
   * Version of the provider of this desktop agent server
   */
  providerVersion(): string;

  /**
   * Supported version of the FDC3 API of the desktop agent server.
   */
  fdc3Version(): string;

  /**
   * This is called prior to returning intents to the client.  It is a
   * an opportunity for the server to either present an intent resolver
   * or otherwise mess with the available intents, or do nothing.
   */
  narrowIntents(raiser: AppIdentifier, appIntents: AppIntent[], context: Context): Promise<AppIntent[]>;

  // Channel state management
  /**
   * Get all channel states (user, app, and private channels)
   */
  getChannelStates(): ChannelState[];

  /**
   * Add a new channel state
   */
  addChannelState(channel: ChannelState): void;

  /**
   * Get a channel by its ID
   */
  getChannelById(channelId: string | null): ChannelState | null;

  /**
   * Update the context for a specific channel
   */
  updateChannelContext(channelId: string, context: Context): void;

  // Current channel tracking
  /**
   * Get the current channel for an instance
   */
  getCurrentChannel(instanceId: InstanceID): ChannelState | null;

  /**
   * Set the current channel for an instance
   */
  setCurrentChannel(instanceId: InstanceID, channel: ChannelState | null): void;

  // Context listener management
  /**
   * Get all context listeners
   */
  getContextListeners(): ContextListenerRegistration[];

  /**
   * Add a context listener
   */
  addContextListener(listener: ContextListenerRegistration): void;

  /**
   * Remove a context listener by UUID
   */
  removeContextListener(listenerUuid: string, instanceId: InstanceID): void;

  /**
   * Remove all context listeners for an instance
   */
  removeContextListenersByInstance(instanceId: InstanceID): void;

  // Private channel event listener management
  /**
   * Get all private channel event listeners
   */
  getPrivateChannelEventListeners(): PrivateChannelEventListener[];

  /**
   * Add a private channel event listener
   */
  addPrivateChannelEventListener(listener: PrivateChannelEventListener): void;

  /**
   * Remove a private channel event listener by UUID
   */
  removePrivateChannelEventListener(listenerUuid: string): boolean;

  /**
   * Remove all private channel event listeners for an instance
   */
  removePrivateChannelEventListenersByInstance(instanceId: InstanceID): void;

  // Desktop agent event listener management
  /**
   * Add a desktop agent event listener
   */
  addDesktopAgentEventListener(listener: DesktopAgentEventListener): void;

  /**
   * Remove a desktop agent event listener by UUID
   */
  removeDesktopAgentEventListener(listenerUuid: string): boolean;

  /**
   * Remove all desktop agent event listeners for an instance
   */
  removeDesktopAgentEventListenersByInstance(instanceId: InstanceID): void;

  // Intent listener management
  /**
   * Get all intent listeners
   */
  getIntentListeners(): IntentListenerRegistration[];

  /**
   * Add an intent listener
   */
  addIntentListener(listener: IntentListenerRegistration): void;

  /**
   * Remove an intent listener by UUID
   */
  removeIntentListener(listenerUUID: string): boolean;

  /**
   * Remove all intent listeners for an instance
   */
  removeIntentListenersByInstance(instanceId: InstanceID): void;

  // Pending intent resolution management
  /**
   * Get a pending resolution for a request UUID
   */
  getPendingResolution(requestUuid: string): AppIdentifier | undefined;

  /**
   * Add a pending resolution
   */
  addPendingResolution(requestUuid: string, appIdentifier: AppIdentifier): void;

  /**
   * Remove a pending resolution
   */
  removePendingResolution(requestUuid: string): void;

  /**
   * Remove all pending resolutions for an instance
   */
  removePendingResolutionsByInstance(instanceId: InstanceID): void;

  // Pending app management (for OpenHandler)
  /**
   * Get a pending app by instance ID
   */
  getPendingApp(instanceId: InstanceID): PendingApp | undefined;

  /**
   * Set a pending app for an instance ID
   */
  setPendingApp(instanceId: InstanceID, pendingApp: PendingApp): void;

  /**
   * Remove a pending app by instance ID
   */
  removePendingApp(instanceId: InstanceID): void;

  /**
   * Receive an incoming message
   */
  receive(message: ReceivableMessage, from: InstanceID): Promise<void>;

  /**
   * Cleanup state relating to an app instance that has disconnected.
   * This is called automatically when the app instance is set to State.Terminated.
   */
  cleanupApp(instanceId: InstanceID): void;

  /**
   * Shutdown the server context
   */
  shutdown(): void;
}
