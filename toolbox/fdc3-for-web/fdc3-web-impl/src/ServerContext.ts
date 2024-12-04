import { AppIdentifier, AppIntent } from '@kite9/fdc3-standard';
import { Context } from '@kite9/fdc3-context';

export enum State {
  Pending /* App has started, but not completed FDC3 Handshake */,
  Connected /* App has completed FDC3 handshake */,
  NotResponding /* App has not responded to a heartbeat */,
  Terminated /* App has sent a termination message */,
}

export type AppRegistration = {
  state: State;
  appId: string;
  instanceId: InstanceID;
};

/**
 * This is a unique, long, unguessable string that identifies a particular instance of an app.
 * All messages arriving at the desktop agent will have this UUID attached to them.
 * It is important that this is unguessable as it is a "password" of sorts used to
 * identify the app between reconnections.
 */
export type InstanceID = string;

/**
 * Handles messaging to apps and opening apps
 */
export interface ServerContext<X extends AppRegistration> {
  /**
   * UUID for outgoing message
   */
  createUUID(): string;

  /**
   * Post an outgoing message to a particular app
   */
  post(message: object, instanceId: InstanceID): Promise<void>;

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
  setInstanceDetails(uuid: InstanceID, details: X): void;

  /**
   * Returns the UUID for a particular instance of an app.
   * This is used in situations where an app is reconnecting to the same desktop agent.
   */
  getInstanceDetails(uuid: InstanceID): X | undefined;

  /**
   * Registers an app as connected to the desktop agent.
   */
  setAppState(app: InstanceID, state: State): Promise<void>;

  /**
   * Returns the list of apps open and connected to FDC3 at the current time.
   * Note, it is the implementor's job to ensure this list is
   * up-to-date in the event of app crashes or disconnections.
   */
  getConnectedApps(): Promise<AppRegistration[]>;

  /**
   * Return the list of all apps that have ever been registed with the ServerContext.
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
   * or otherwise mess with the availble intents, or do nothing.
   */
  narrowIntents(raiser: AppIdentifier, IappIntents: AppIntent[], context: Context): Promise<AppIntent[]>;
}
