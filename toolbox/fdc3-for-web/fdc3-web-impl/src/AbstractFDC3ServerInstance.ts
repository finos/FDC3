import { State, AppRegistration, InstanceID } from './AppRegistration';
import {
  ChannelState,
  ChannelType,
  ContextListenerRegistration,
  PrivateChannelEventListener,
  DesktopAgentEventListener,
  IntentListenerRegistration,
  FDC3ServerInstance,
} from './FDC3ServerInstance';
import { AppIdentifier, AppIntent } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { MessageHandler } from './handlers/MessageHandler';
import { AppRequestMessage } from '@finos/fdc3-schema/generated/api/BrowserTypes';
import { Directory } from './directory/DirectoryInterface';
import { PendingApp } from './PendingApp';
import { PrivateChannelDisconnectServerInstanceEvent, ShutdownServerInstanceEvent } from './FDC3ServerInstanceEvents';

/**
 * Abstract base class for ServerContext implementations.
 * Contains all common state management logic for channels, listeners, and pending operations.
 */
export abstract class AbstractFDC3ServerInstance implements FDC3ServerInstance {
  protected readonly handlers: MessageHandler[];

  constructor(handlers: MessageHandler[]) {
    this.handlers = handlers;
  }

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
  abstract getInstanceDetails(uuid: InstanceID): AppRegistration | undefined;
  abstract setInstanceDetails(uuid: InstanceID, meta: AppRegistration): void;
  abstract open(appId: string): Promise<InstanceID>;
  abstract getConnectedApps(): Promise<AppRegistration[]>;
  abstract isAppConnected(app: InstanceID): Promise<boolean>;
  abstract setAppState(app: InstanceID, newState: State): Promise<void>;
  abstract getAllApps(): Promise<AppRegistration[]>;
  abstract log(message: string): void;
  abstract provider(): string;
  abstract providerVersion(): string;
  abstract fdc3Version(): string;
  abstract narrowIntents(raiser: AppIdentifier, appIntents: AppIntent[], context: Context): Promise<AppIntent[]>;
  abstract getDirectory(): Directory;

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

  async receive(message: AppRequestMessage, from: InstanceID): Promise<void> {
    this.handlers.forEach(handler => handler.accept(message, this, from));
  }

  async cleanupApp(instanceId: InstanceID): Promise<void> {
    // Get context listeners for this instance before removing them
    const contextListenersToRemove = this.contextListeners.filter(l => l.instanceId === instanceId);

    // Find private channels that need disconnect events
    const privateChannelsToDisconnect = new Set<string>();
    contextListenersToRemove
      .filter(u => this.getChannelById(u.channelId)?.type === ChannelType.private)
      .forEach(u => {
        if (u.channelId) {
          privateChannelsToDisconnect.add(u.channelId);
        }
      });

    // Fire disconnect events for private channels
    privateChannelsToDisconnect.forEach(channelId => {
      const disconnectEvent = new PrivateChannelDisconnectServerInstanceEvent(instanceId, channelId);
      this.handlers.forEach(handler => handler.handleEvent(disconnectEvent, this));
    });

    // Clean up state entries
    this.removeContextListenersByInstance(instanceId);
    this.removePrivateChannelEventListenersByInstance(instanceId);
    this.removeDesktopAgentEventListenersByInstance(instanceId);
    this.removeIntentListenersByInstance(instanceId);
    this.removePendingResolutionsByInstance(instanceId);
    // Note: Don't remove pending apps as they may still be opening
  }

  async shutdown(): Promise<void> {
    const shutdownEvent = new ShutdownServerInstanceEvent();
    this.handlers.forEach(handler => handler.handleEvent(shutdownEvent, this));
  }
}
