import { ServerContext, InstanceID } from '@kite9/fdc3-web-impl';
import { CustomWorld } from '../world';
import { OpenError, AppIdentifier, AppIntent } from '@kite9/fdc3-standard';
import { AppRegistration, State } from '@kite9/fdc3-web-impl';

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
  private nextInstanceId: number = 0;
  private nextUUID: number = 0;

  constructor(cw: CustomWorld) {
    this.cw = cw;
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

  async setAppState(app: InstanceID, state: State): Promise<void> {
    const found = this.instances.find(a => a.instanceId == app);
    if (found) {
      found.state = state;
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
}
