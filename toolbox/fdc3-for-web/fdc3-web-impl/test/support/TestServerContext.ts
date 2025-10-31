import { FDC3Server } from '../../src/FDC3Server';
import {
  ServerContext,
  InstanceID,
  State,
  AppRegistration,
  ChannelState,
  ContextListenerRegistration,
  PrivateChannelEventListener,
  DesktopAgentEventListener,
} from '../../src/ServerContext';
import { CustomWorld } from '../world';
import { Context } from '@finos/fdc3-context';
import { OpenError, AppIdentifier, AppIntent } from '@finos/fdc3-standard';

type ConnectionDetails = AppRegistration & {
  msg?: object;
};

type MessageRecord = {
  to?: AppIdentifier;
  uuid?: InstanceID;
  msg: object;
};

export class TestServerContext implements ServerContext<ConnectionDetails> {
  public postedMessages: MessageRecord[] = [];
  private readonly cw: CustomWorld;
  private instances: ConnectionDetails[] = [];
  private nextInstanceId: number = 0;
  private nextUUID: number = 0;
  private server: FDC3Server | null = null;

  // State previously managed by BroadcastHandler
  private contextListeners: ContextListenerRegistration[] = [];
  private privateChannelEventListeners: PrivateChannelEventListener[] = [];
  private desktopAgentEventListeners: DesktopAgentEventListener[] = [];
  private channelStates: ChannelState[] = [];
  private currentChannels: { [instanceId: string]: ChannelState } = {};

  constructor(cw: CustomWorld) {
    this.cw = cw;
  }

  setFDC3Server(server: FDC3Server): void {
    this.server = server;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async narrowIntents(_raiser: AppIdentifier, appIntents: AppIntent[], _context: Context): Promise<AppIntent[]> {
    return appIntents;
  }

  getInstanceDetails(uuid: string) {
    return this.instances.find(ca => ca.instanceId === uuid);
  }

  setInstanceDetails(uuid: InstanceID, appId: ConnectionDetails) {
    if (uuid != appId.instanceId) {
      throw new Error('UUID mismatch');
    }
    this.instances = this.instances.filter(ca => ca.instanceId !== uuid);
    this.instances.push(appId);
  }

  async open(appId: string): Promise<InstanceID> {
    const ni = this.nextInstanceId++;
    if (appId.includes('missing')) {
      throw new Error(OpenError.AppNotFound);
    } else {
      const uuid = 'uuid-' + ni;
      this.instances.push({ appId, instanceId: uuid, state: State.Pending });
      return uuid;
    }
  }

  async setAppState(app: InstanceID, newState: State): Promise<void> {
    const found = this.instances.find(a => a.instanceId == app);
    if (found) {
      const currentState = found.state;
      if (currentState !== State.Terminated && newState === State.Terminated) {
        this.server?.cleanup(app);
      }
      found.state = newState;
    }
  }

  async getConnectedApps(): Promise<AppRegistration[]> {
    return (await this.getAllApps()).filter(a => a.state == State.Connected);
  }

  async getAllApps(): Promise<AppRegistration[]> {
    return this.instances.map(x => {
      return {
        appId: x.appId,
        instanceId: x.instanceId,
        state: x.state,
      };
    });
  }

  async isAppConnected(app: InstanceID): Promise<boolean> {
    const found = this.instances.find(a => a.instanceId == app && a.state == State.Connected);
    return found != null;
  }

  provider(): string {
    return 'cucumber-provider';
  }
  providerVersion(): string {
    return '1.2.3.TEST';
  }
  fdc3Version(): string {
    return '2.0';
  }

  createUUID(): string {
    return 'uuid' + this.nextUUID++;
  }

  async post(msg: object, to: InstanceID): Promise<void> {
    if (to == null) {
      this.postedMessages.push({ msg });
    } else {
      const id = this.getInstanceDetails(to);
      const app = id
        ? {
            appId: id!.appId,
            instanceId: id!.instanceId,
          }
        : undefined;
      this.postedMessages.push({
        msg,
        to: app,
        uuid: to,
      });
    }
  }

  log(message: string): void {
    this.cw.log(message);
  }

  /**
   * USED FOR TESTING
   */
  getInstanceUUID(appId: AppIdentifier): InstanceID {
    this.setInstanceDetails(appId.instanceId!, {
      appId: appId.appId,
      instanceId: appId.instanceId!,
      state: State.Connected,
    });
    return appId.instanceId!;
  }

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
}
