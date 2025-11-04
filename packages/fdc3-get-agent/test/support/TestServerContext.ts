import {
  ServerContext,
  InstanceID,
  FDC3Server,
  ChannelState,
  ContextListenerRegistration,
  PrivateChannelEventListener,
  DesktopAgentEventListener,
  IntentListenerRegistration,
} from '@finos/fdc3-web-impl';
import { CustomWorld } from '../world';
import { OpenError, AppIdentifier, AppIntent } from '@finos/fdc3-standard';
import { AppRegistration, State } from '@finos/fdc3-web-impl';
import { Context } from '@finos/fdc3-context';

type ConnectionDetails = AppRegistration & {
  msg?: object;
  connectionId: string;
  externalPort: MessagePort;
  internalPort: MessagePort;
  url: string;
};

type MessageRecord = {
  to?: AppIdentifier;
  uuid?: InstanceID;
  msg: object;
};

export const dummyInstanceDetails = [
  { appId: 'Test App Id', url: 'https://dummyOrigin.test/path' },
  { appId: 'Test App Id 2', url: 'https://dummyOrigin.test/alternativePath' },
];

export class TestServerContext implements ServerContext<ConnectionDetails> {
  public postedMessages: MessageRecord[] = [];
  public readonly cw: CustomWorld;
  private instances: ConnectionDetails[] = [];
  private server: FDC3Server | null = null;

  private nextInstanceId: number = 0;
  private nextUUID: number = 0;

  // State previously managed by BroadcastHandler
  private contextListeners: ContextListenerRegistration[] = [];
  private privateChannelEventListeners: PrivateChannelEventListener[] = [];
  private desktopAgentEventListeners: DesktopAgentEventListener[] = [];
  private channelStates: ChannelState[] = [];
  private currentChannels: { [instanceId: string]: ChannelState } = {};

  // State previously managed by IntentHandler
  private intentListeners: IntentListenerRegistration[] = [];
  private pendingResolutions: Map<string, AppIdentifier> = new Map();

  constructor(cw: CustomWorld) {
    this.cw = cw;
  }

  setFDC3Server(server: FDC3Server): void {
    this.server = server;
  }

  async narrowIntents(_raiser: AppIdentifier, appIntents: AppIntent[] /*, _context: Context*/): Promise<AppIntent[]> {
    return appIntents;
  }

  getInstanceDetails(uuid: string) {
    return this.instances.find(ca => ca.instanceId === uuid);
  }

  setInstanceDetails(uuid: InstanceID, appId: ConnectionDetails) {
    this.instances = this.instances.filter(ca => ca.connectionId !== uuid);
    this.instances.push({
      ...appId,
      connectionId: uuid,
    });
  }

  getMatchingInstance(url: string): ConnectionDetails | undefined {
    const details = this.instances.find(ca => ca.url === url);
    if (!details) {
      const knownInstances = this.instances.map(inst => {
        return { appId: inst.appId, url: inst.url };
      });
      console.error(
        'No connection instance found - will return a mismatched instance, url: ',
        url,
        '\nknown instances: ',
        knownInstances
      );
      return this.instances[0];
    }
    return details;
  }

  async shutdown(): Promise<void> {
    await Promise.all(this.instances.map(i => i.internalPort.close()));
    await Promise.all(this.instances.map(i => i.externalPort.close()));
  }

  /** Used to mock connections to the server from apps. Must be called before the app attempts to connect for that connection to succeed. */
  async open(appId: string): Promise<InstanceID> {
    const url = dummyInstanceDetails.find(value => value.appId === appId)?.url;
    if (!url) {
      console.error('TestServerContext Tried to open an unknown appId');
      throw new Error(OpenError.AppNotFound);
    } else {
      const ni = this.nextInstanceId++;
      if (appId.includes('missing')) {
        throw new Error(OpenError.AppNotFound);
      } else {
        const mc = new MessageChannel();
        const internalPort = mc.port1;
        const externalPort = mc.port2;

        internalPort.start();

        const connectionDetails = {
          appId,
          instanceId: 'uuid-' + ni,
          connected: false,
          connectionId: 'uuid-' + ni,
          externalPort,
          internalPort,
          url: url,
          state: State.Pending,
        };

        this.instances.push(connectionDetails);
        internalPort.onmessage = msg => {
          this.cw.mockFDC3Server?.receive(msg.data, connectionDetails.instanceId);
        };

        return connectionDetails.connectionId;
      }
    }
  }

  async getConnectedApps(): Promise<AppRegistration[]> {
    return (await this.getAllApps()).filter(ca => ca.state == State.Connected);
  }

  async isAppConnected(app: InstanceID): Promise<boolean> {
    const found = this.instances.find(a => a.instanceId == app && a.state == State.Connected);
    return found != null;
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

  async getAllApps(): Promise<AppRegistration[]> {
    return this.instances.map(x => {
      return {
        appId: x.appId,
        instanceId: x.instanceId,
        state: x.state,
      };
    });
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

  /**
   * USED FOR TESTING
   */
  getInstanceUUID(appId: AppIdentifier): InstanceID | undefined {
    return this.instances.find(
      ca => ca.appId == appId.appId && ca.instanceId == appId.instanceId && ca.state == State.Connected
    )?.instanceId;
  }

  /**
   * USED FOR TESTING
   */
  getFirstInstance() {
    return this.instances[0];
  }

  post(msg: object, to: InstanceID): Promise<void> {
    const details = this.getInstanceDetails(to);
    details?.internalPort.postMessage(msg);
    return Promise.resolve();
  }

  log(message: string): void {
    this.cw.log(message);
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
}
