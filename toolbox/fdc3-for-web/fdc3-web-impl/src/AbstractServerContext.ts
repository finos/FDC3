import {
  ServerContext,
  AppRegistration,
  InstanceID,
  ChannelState,
  ContextListenerRegistration,
  PrivateChannelEventListener,
  DesktopAgentEventListener,
  IntentListenerRegistration,
  PendingApp,
} from './ServerContext';
import { AppIdentifier } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';

/**
 * Abstract base class for ServerContext implementations.
 * Contains all common state management logic for channels, listeners, and pending operations.
 */
export abstract class AbstractServerContext<X extends AppRegistration> implements ServerContext<X> {
  // State management fields
  protected contextListeners: ContextListenerRegistration[] = [];
  protected privateChannelEventListeners: PrivateChannelEventListener[] = [];
  protected desktopAgentEventListeners: DesktopAgentEventListener[] = [];
  protected channelStates: ChannelState[] = [];
  protected currentChannels: { [instanceId: string]: ChannelState } = {};
  protected intentListeners: IntentListenerRegistration[] = [];
  protected pendingResolutions: Map<string, AppIdentifier> = new Map();
  protected pendingApps: Map<InstanceID, PendingApp> = new Map();

  // Abstract methods that must be implemented by subclasses
  abstract createUUID(): string;
  abstract post(message: object, to: InstanceID): Promise<void>;
  abstract getInstanceDetails(uuid: InstanceID): X | undefined;
  abstract setInstanceDetails(uuid: InstanceID, meta: X): void;
  abstract setFDC3Server(server: any): void;
  abstract open(appId: string): Promise<InstanceID>;
  abstract getConnectedApps(): Promise<AppRegistration[]>;
  abstract isAppConnected(app: InstanceID): Promise<boolean>;
  abstract setAppState(app: InstanceID, newState: any): Promise<void>;
  abstract getAllApps(): Promise<AppRegistration[]>;
  abstract log(message: string): void;
  abstract provider(): string;
  abstract providerVersion(): string;
  abstract fdc3Version(): string;
  abstract narrowIntents(raiser: AppIdentifier, appIntents: any[], context: Context): Promise<any[]>;

  // Channel state management methods
  getChannelStates(): ChannelState[] {
    return this.channelStates;
  }

  addChannelState(channel: ChannelState): void {
    this.channelStates.push(channel);
  }

  getChannelById(channelId: string | null): ChannelState | null {
    if (channelId == null) {
      return null;
    }
    return this.channelStates.find(c => c.id == channelId) ?? null;
  }

  updateChannelContext(channelId: string, context: Context): void {
    const cs = this.getChannelById(channelId);
    if (cs) {
      cs.context = cs.context.filter(c => c.type != context.type);
      cs.context.unshift(context);
    }
  }

  // Current channel tracking methods
  getCurrentChannel(instanceId: InstanceID): ChannelState | null {
    return this.currentChannels[instanceId] ?? null;
  }

  setCurrentChannel(instanceId: InstanceID, channel: ChannelState | null): void {
    if (channel === null) {
      delete this.currentChannels[instanceId];
    } else {
      this.currentChannels[instanceId] = channel;
    }
  }

  // Context listener management methods
  getContextListeners(): ContextListenerRegistration[] {
    return this.contextListeners;
  }

  addContextListener(listener: ContextListenerRegistration): void {
    this.contextListeners.push(listener);
  }

  removeContextListener(listenerUuid: string, instanceId: InstanceID): boolean {
    const i = this.contextListeners.findIndex(r => r.listenerUuid == listenerUuid && r.instanceId == instanceId);
    if (i > -1) {
      this.contextListeners.splice(i, 1);
      return true;
    }
    return false;
  }

  removeContextListenersByInstance(instanceId: InstanceID): ContextListenerRegistration[] {
    const removed = this.contextListeners.filter(r => r.instanceId == instanceId);
    this.contextListeners = this.contextListeners.filter(listener => listener.instanceId !== instanceId);
    return removed;
  }

  // Private channel event listener management methods
  getPrivateChannelEventListeners(): PrivateChannelEventListener[] {
    return this.privateChannelEventListeners;
  }

  addPrivateChannelEventListener(listener: PrivateChannelEventListener): void {
    this.privateChannelEventListeners.push(listener);
  }

  removePrivateChannelEventListener(listenerUuid: string): boolean {
    const i = this.privateChannelEventListeners.findIndex(r => r.listenerUuid == listenerUuid);
    if (i > -1) {
      this.privateChannelEventListeners.splice(i, 1);
      return true;
    }
    return false;
  }

  removePrivateChannelEventListenersByInstance(instanceId: InstanceID): PrivateChannelEventListener[] {
    const removed = this.privateChannelEventListeners.filter(listener => listener.instanceId == instanceId);
    this.privateChannelEventListeners = this.privateChannelEventListeners.filter(
      listener => listener.instanceId !== instanceId
    );
    return removed;
  }

  // Desktop agent event listener management methods
  getDesktopAgentEventListeners(): DesktopAgentEventListener[] {
    return this.desktopAgentEventListeners;
  }

  addDesktopAgentEventListener(listener: DesktopAgentEventListener): void {
    this.desktopAgentEventListeners.push(listener);
  }

  removeDesktopAgentEventListener(listenerUuid: string): boolean {
    const i = this.desktopAgentEventListeners.findIndex(r => r.listenerUuid == listenerUuid);
    if (i > -1) {
      this.desktopAgentEventListeners.splice(i, 1);
      return true;
    }
    return false;
  }

  removeDesktopAgentEventListenersByInstance(instanceId: InstanceID): DesktopAgentEventListener[] {
    const removed = this.desktopAgentEventListeners.filter(listener => listener.instanceId == instanceId);
    this.desktopAgentEventListeners = this.desktopAgentEventListeners.filter(
      listener => listener.instanceId !== instanceId
    );
    return removed;
  }

  // Intent listener management methods
  getIntentListeners(): IntentListenerRegistration[] {
    return this.intentListeners;
  }

  addIntentListener(listener: IntentListenerRegistration): void {
    this.intentListeners.push(listener);
  }

  removeIntentListener(listenerUUID: string): boolean {
    const i = this.intentListeners.findIndex(r => r.listenerUUID == listenerUUID);
    if (i > -1) {
      this.intentListeners.splice(i, 1);
      return true;
    }
    return false;
  }

  removeIntentListenersByInstance(instanceId: InstanceID): IntentListenerRegistration[] {
    const removed = this.intentListeners.filter(r => r.instanceId == instanceId);
    this.intentListeners = this.intentListeners.filter(listener => listener.instanceId !== instanceId);
    return removed;
  }

  // Pending intent resolution management methods
  getPendingResolution(requestUuid: string): AppIdentifier | undefined {
    return this.pendingResolutions.get(requestUuid);
  }

  addPendingResolution(requestUuid: string, appIdentifier: AppIdentifier): void {
    this.pendingResolutions.set(requestUuid, appIdentifier);
  }

  removePendingResolution(requestUuid: string): boolean {
    return this.pendingResolutions.delete(requestUuid);
  }

  removePendingResolutionsByInstance(instanceId: InstanceID): void {
    this.pendingResolutions.forEach((val, key) => {
      if (val.instanceId === instanceId) {
        this.pendingResolutions.delete(key);
      }
    });
  }

  // Pending app management methods
  getPendingApp(instanceId: InstanceID): PendingApp | undefined {
    return this.pendingApps.get(instanceId);
  }

  setPendingApp(instanceId: InstanceID, pendingApp: PendingApp): void {
    this.pendingApps.set(instanceId, pendingApp);
  }

  removePendingApp(instanceId: InstanceID): boolean {
    return this.pendingApps.delete(instanceId);
  }

  getPendingApps(): Map<InstanceID, PendingApp> {
    return this.pendingApps;
  }
}
