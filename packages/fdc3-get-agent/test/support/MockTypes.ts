import { AppIdentifier, DisplayMetadata, PrivateChannelEventTypes } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import {
  AppRequestMessage,
  WebConnectionProtocol4ValidateAppIdentity,
  WebConnectionProtocol6Goodbye,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';

/**
 * This is a unique, long, unguessable string that identifies a particular instance of an app.
 * All messages arriving at the desktop agent will have this UUID attached to them.
 */
export type InstanceID = string;

export enum State {
  Pending /* App has started, but not completed FDC3 Handshake */,
  Connected /* App has completed FDC3 handshake */,
  NotResponding /* App has not responded to a heartbeat */,
  Terminated /* App has sent a termination message */,
}

/**
 * App registration info for tracking connected apps
 */
export type AppRegistration = {
  state: State;
  appId: string;
  instanceId: InstanceID;
};

export type ReceivableMessage =
  | AppRequestMessage
  | WebConnectionProtocol4ValidateAppIdentity
  | WebConnectionProtocol6Goodbye;

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
 * Simplified Directory interface for testing
 */
export interface DirectoryApp {
  appId: string;
  name?: string;
  title?: string;
  description?: string;
  details?: {
    url?: string;
  };
  interop?: {
    intents?: {
      listensFor?: Record<
        string,
        {
          contexts?: string[];
          resultType?: string;
        }
      >;
    };
  };
}

export type DirectoryIntent = {
  intentName: string;
  appId: string;
  contexts?: string[];
  resultType?: string;
};

export interface Directory {
  retrieveAllApps(): DirectoryApp[];
  retrieveApps(
    contextType: string | undefined,
    intentName: string | undefined,
    resultType: string | undefined
  ): DirectoryApp[];
  retrieveAllIntents(): DirectoryIntent[];
  retrieveIntents(
    contextType: string | undefined,
    intentName?: string | undefined,
    resultType?: string
  ): DirectoryIntent[];
  retrieveAppsById(appId: string): DirectoryApp[];
}

/**
 * Basic directory implementation for testing
 */
export class BasicDirectory implements Directory {
  allApps: DirectoryApp[];

  constructor(apps: DirectoryApp[]) {
    this.allApps = apps;
  }

  private intentMatches(
    i: DirectoryIntent,
    contextType: string | undefined,
    intentName: string | undefined,
    resultType: string | undefined
  ): boolean {
    const resultTypeSame = (real: string | undefined, required: string | undefined) => {
      if (required == undefined) return true;
      if (real == required) return true;
      if (real == undefined) return false;
      if (real.startsWith('channel<') && required == 'channel') return true;
      return false;
    };

    return (
      (intentName == undefined || i.intentName == intentName) &&
      (contextType == undefined || (i.contexts ?? []).includes(contextType)) &&
      resultTypeSame(i.resultType, resultType)
    );
  }

  private retrieveIntentsForApp(a: DirectoryApp): DirectoryIntent[] {
    const lf = a.interop?.intents?.listensFor ?? {};
    const lfa = Object.entries(lf);
    return lfa.map(([key, value]) => ({
      intentName: key,
      ...value,
      appId: a.appId,
    }));
  }

  retrieveAllIntents(): DirectoryIntent[] {
    return this.retrieveAllApps().flatMap(a => this.retrieveIntentsForApp(a));
  }

  retrieveIntents(
    contextType: string | undefined,
    intentName: string | undefined,
    resultType: string | undefined
  ): DirectoryIntent[] {
    return this.retrieveAllIntents().filter(i => this.intentMatches(i, contextType, intentName, resultType));
  }

  retrieveApps(
    contextType: string | undefined,
    intentName?: string | undefined,
    resultType?: string | undefined
  ): DirectoryApp[] {
    return this.retrieveAllApps().filter(
      a =>
        this.retrieveIntentsForApp(a).filter(i => this.intentMatches(i, contextType, intentName, resultType)).length > 0
    );
  }

  retrieveAppsById(appId: string): DirectoryApp[] {
    return this.retrieveAllApps().filter(a => a.appId == appId);
  }

  retrieveAllApps(): DirectoryApp[] {
    return this.allApps;
  }
}

/**
 * MessageHandler interface for processing messages
 */
export interface MessageHandler {
  accept(msg: ReceivableMessage, server: MockFDC3ServerInterface, from: InstanceID): void;
  handleEvent?(event: FDC3ServerInstanceEvent, server: MockFDC3ServerInterface): void;
}

/**
 * Server instance events
 */
export interface FDC3ServerInstanceEvent {
  type: string;
}

export class ChannelChangedServerInstanceEvent implements FDC3ServerInstanceEvent {
  type = 'channelChanged';
  constructor(
    public instanceId: InstanceID,
    public channelId: string | null
  ) {}
}

export class PrivateChannelDisconnectServerInstanceEvent implements FDC3ServerInstanceEvent {
  type = 'privateChannelDisconnect';
  constructor(
    public instanceId: InstanceID,
    public channelId: string
  ) {}
}

export class ShutdownServerInstanceEvent implements FDC3ServerInstanceEvent {
  type = 'shutdown';
}

/**
 * Interface for mock FDC3 server that response handlers interact with
 */
export interface MockFDC3ServerInterface {
  createUUID(): string;
  post(message: object, to: InstanceID): Promise<void>;
  getInstanceDetails(uuid: InstanceID): AppRegistration | undefined;
  setInstanceDetails(uuid: InstanceID, meta: AppRegistration): void;
  open(appId: string): Promise<InstanceID>;
  getConnectedApps(): Promise<AppRegistration[]>;
  isAppConnected(app: InstanceID): Promise<boolean>;
  setAppState(app: InstanceID, newState: State): Promise<void>;
  getAllApps(): Promise<AppRegistration[]>;
  log(message: string): void;
  provider(): string;
  providerVersion(): string;
  fdc3Version(): string;
  getDirectory(): Directory;

  // Channel state management
  getChannelStates(): ChannelState[];
  addChannelState(channel: ChannelState): void;
  getChannelById(channelId: string | null): ChannelState | null;
  updateChannelContext(channelId: string, context: Context): void;

  // Current channel tracking
  getCurrentChannel(instanceId: InstanceID): ChannelState | null;
  setCurrentChannel(instanceId: InstanceID, channel: ChannelState | null): void;

  // Context listener management
  getContextListeners(): ContextListenerRegistration[];
  addContextListener(listener: ContextListenerRegistration): void;
  removeContextListener(listenerUuid: string, instanceId: InstanceID): void;

  // Intent listener management
  getIntentListeners(): IntentListenerRegistration[];
  addIntentListener(listener: IntentListenerRegistration): void;
  removeIntentListener(listenerUUID: string): boolean;

  // Pending resolution management
  getPendingResolution(requestUuid: string): AppIdentifier | undefined;
  addPendingResolution(requestUuid: string, appIdentifier: AppIdentifier): void;
  removePendingResolution(requestUuid: string): void;
}
