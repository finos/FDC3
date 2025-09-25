import { FDC3Server } from '../../src/FDC3Server.js';
import { ServerContext, InstanceID, State, AppRegistration } from '../../src/ServerContext.js';
import { CustomWorld } from '../world/index.js';
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
}
