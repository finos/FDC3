import {
  InstanceID,
  State,
  AbstractFDC3ServerInstance,
  AppRegistration,
  Directory,
  BasicDirectory,
  type MessageHandler,
  type ChannelState,
} from '@finos/fdc3-web-impl';
import { MockWindow } from './MockWindow';
import { AutomaticResponse } from './responses/AutomaticResponses';
import { Broadcast } from './responses/Broadcast';
import { FindIntent } from './responses/FindIntent';
import { RaiseIntent } from './responses/RaiseIntent';
import { Handshake } from './responses/Handshake';
import { UserChannels } from './responses/UserChannels';
import { CurrentChannel } from './responses/CurrentChannel';
import { GetInfo } from './responses/GetInfo';
import {
  AppRequestMessage,
  WebConnectionProtocol2LoadURL,
  WebConnectionProtocol3Handshake,
} from '@finos/fdc3-schema/generated/api/BrowserTypes';
import { AddEventListener } from './responses/AddEventListener';
import { UnsubscribeEventListener } from './responses/UnsubscribeEventListener';
import { CustomWorld } from '../world';
import { OpenError, AppIdentifier, AppIntent } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';

export const EMBED_URL = 'http://localhost:8080/static/da/embed.html';
export const CHANNEL_SELECTOR_URL = 'https://mock.fdc3.com/channelSelector';
export const INTENT_RESOLVER_URL = 'https://mock.fdc3.com/resolver';

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

/**
 * Combined MockFDC3Server implementation that extends AbstractFDC3ServerInstance
 * for testing purposes. Manages test app connections, automatic responses,
 * and window message handling.
 */
export class MockFDC3Server extends AbstractFDC3ServerInstance {
  private useIframe: boolean;
  private useDefaultUIUrls: boolean;
  private timeOutIdValidation: boolean;
  private window: MockWindow;
  public readonly cw: CustomWorld;
  private receivedGoodbye = false;
  private messageExchangeTimeout: number | null = null;
  private appLaunchTimeout: number | null = null;
  private instances: ConnectionDetails[] = [];
  private nextInstanceId: number = 0;
  private nextUUID: number = 0;
  private directory: Directory;

  public postedMessages: MessageRecord[] = [];
  readonly automaticResponses: AutomaticResponse[];

  constructor(
    window: MockWindow,
    useIframe: boolean,
    cw: CustomWorld,
    handlers: MessageHandler[] = [],
    channels: ChannelState[] = [],
    directory?: Directory,
    useDefaultUIUrls: boolean = false,
    timeOutIdValidation: boolean = false,
    timeoutMessageExchanges: boolean = false,
    messageExchangeTimeout?: number,
    appLaunchTimeout?: number
  ) {
    super(handlers, channels);

    this.useIframe = useIframe;
    this.useDefaultUIUrls = useDefaultUIUrls;
    this.timeOutIdValidation = timeOutIdValidation;
    this.window = window;
    this.cw = cw;
    this.directory = directory || new BasicDirectory([]);

    if (messageExchangeTimeout) {
      this.messageExchangeTimeout = messageExchangeTimeout;
    }
    if (appLaunchTimeout) {
      this.appLaunchTimeout = appLaunchTimeout;
    }

    if (timeoutMessageExchanges) {
      this.automaticResponses = [
        new GetInfo(),
        new Handshake(this.timeOutIdValidation),
        new CurrentChannel(),
        new UserChannels(),
        new AddEventListener(),
      ];
    } else {
      this.automaticResponses = [
        new GetInfo(),
        new Handshake(this.timeOutIdValidation),
        new CurrentChannel(),
        new FindIntent(),
        new RaiseIntent(),
        new UserChannels(),
        new Broadcast(),
        new AddEventListener(),
        new UnsubscribeEventListener(),
      ];
    }

    this.init();
  }

  // Directory implementation
  getDirectory(): Directory {
    return this.directory;
  }

  // Instance management methods
  getInstanceDetails(uuid: string): ConnectionDetails | undefined {
    return this.instances.find(ca => ca.instanceId === uuid);
  }

  setInstanceDetails(uuid: InstanceID, appDetails: AppRegistration): void {
    const existing = this.instances.find(ca => ca.instanceId === uuid);
    if (existing) {
      Object.assign(existing, appDetails);
    }
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
    await super.shutdown();
    await Promise.all(this.instances.map(i => i.internalPort.close()));
    await Promise.all(this.instances.map(i => i.externalPort.close()));
  }

  /** Used to mock connections to the server from apps. Must be called before the app attempts to connect for that connection to succeed. */
  async open(appId: string): Promise<InstanceID> {
    const url = dummyInstanceDetails.find(value => value.appId === appId)?.url;
    if (!url) {
      console.error('MockFDC3Server Tried to open an unknown appId');
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

        const connectionDetails: ConnectionDetails = {
          appId,
          instanceId: 'uuid-' + ni,
          connectionId: 'uuid-' + ni,
          externalPort,
          internalPort,
          url: url,
          state: State.Pending,
        };

        this.instances.push(connectionDetails);
        internalPort.onmessage = msg => {
          this.receive(msg.data, connectionDetails.instanceId);
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
        await this.cleanupApp(app);
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

  async narrowIntents(_raiser: AppIdentifier, appIntents: AppIntent[], _context: Context): Promise<AppIntent[]> {
    return appIntents;
  }

  post(msg: object, to: InstanceID): Promise<void> {
    const details = this.getInstanceDetails(to);
    details?.internalPort.postMessage(msg);
    return Promise.resolve();
  }

  log(message: string): void {
    this.cw.log(message);
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
  getFirstInstance(): ConnectionDetails | undefined {
    return this.instances[0];
  }

  // Message handling
  async receive(message: AppRequestMessage, from: string): Promise<void> {
    // First process automatic responses (for backward compatibility with tests)
    this.automaticResponses.forEach(r => {
      if (r.filter(message.type)) {
        r.action(message, this, from);
      }
    });

    // Then call parent's receive to handle through message handlers
    await super.receive(message, from);
  }

  hasReceivedGoodbye(): boolean {
    return this.receivedGoodbye;
  }

  // Window message initialization
  private init(): void {
    this.window.addEventListener('message', e => {
      const event = e as MessageEvent;
      const data = event.data;
      const source = event.source as Window;
      const origin = event.origin;

      if (this.cw.debugLogs) {
        console.log('MockFDC3Server received: ', event.data);
      }
      if (data.type == 'WCP1Hello') {
        if (this.useIframe) {
          const message: WebConnectionProtocol2LoadURL = {
            type: 'WCP2LoadUrl',
            meta: {
              connectionAttemptUuid: data.meta.connectionAttemptUuid,
              timestamp: new Date(),
            },
            payload: {
              iframeUrl: EMBED_URL + '?connectionAttemptUuid=' + data.meta.connectionAttemptUuid,
            },
          };
          source.postMessage(message, origin);
        } else {
          const details = this.getMatchingInstance(data.payload.identityUrl);
          if (details) {
            const message: WebConnectionProtocol3Handshake = {
              type: 'WCP3Handshake',
              meta: {
                connectionAttemptUuid: data.meta.connectionAttemptUuid,
                timestamp: new Date(),
              },
              payload: {
                fdc3Version: '2.2',
                intentResolverUrl: this.useDefaultUIUrls ? true : INTENT_RESOLVER_URL,
                channelSelectorUrl: this.useDefaultUIUrls ? true : CHANNEL_SELECTOR_URL,
                messageExchangeTimeout: 1000,
                appLaunchTimeout: 2000,
              },
            };
            if (this.messageExchangeTimeout) {
              message.payload.messageExchangeTimeout = this.messageExchangeTimeout;
            }
            if (this.appLaunchTimeout) {
              message.payload.appLaunchTimeout = this.appLaunchTimeout;
            }
            source.postMessage(message, origin, [details.externalPort]);
          } //getMatchingInstance will log if it didn't find anything
        }
      } else if (data.type == 'WCP6Goodbye') {
        this.receivedGoodbye = true;
      }
    });
  }
}
