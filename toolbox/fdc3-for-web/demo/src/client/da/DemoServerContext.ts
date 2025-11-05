import {
  AbstractFDC3ServerInstance,
  AbstractFDC3ServerFactory,
  AppRegistration,
  Directory,
  DirectoryApp,
  InstanceID,
  State,
  type MessageHandler,
  type ChannelState,
  type FDC3ServerInstance,
} from '@finos/fdc3-web-impl';
import { Socket } from 'socket.io-client';
import { v4 as uuid } from 'uuid';
import { FDC3_DA_EVENT } from '../../message-types';
import { AppIdentifier, AppIntent, OpenError } from '@finos/fdc3';
import { Context } from '@finos/fdc3-context';

enum Opener {
  Tab,
  Frame,
}

type RunningAppRegistration = AppRegistration & {
  window: Window;
  url: string;
};

type LaunchingAppRegistration = AppRegistration & {
  windowPromise: Promise<Window | null>;
  url: string;
};

type DemoAppRegistration = RunningAppRegistration | LaunchingAppRegistration;

//Type guard used to check if application launch details have a URL
function isWebAppLaunchDetails(details: object): details is { url: string } {
  return (details as { url: string }).url !== undefined;
}

//Type guard used to check if application is still launching (we are waiting on the window reference)
function isLaunchingAppRegistration(
  details: RunningAppRegistration | LaunchingAppRegistration
): details is LaunchingAppRegistration {
  return !!(details as LaunchingAppRegistration).windowPromise;
}

//Type guard used to check if application has been launched (and we have received the window reference)
function isRunningAppRegistration(
  details: RunningAppRegistration | LaunchingAppRegistration
): details is RunningAppRegistration {
  return !!(details as RunningAppRegistration).window;
}

/**
 * Demo implementation of FDC3ServerInstance for the web demo.
 * Manages app connections via socket.io and handles window/iframe launching.
 */
export class DemoFDC3ServerInstance extends AbstractFDC3ServerInstance {
  private readonly socket: Socket;
  private readonly directory: Directory;
  private connections: (RunningAppRegistration | LaunchingAppRegistration)[] = [];

  constructor(socket: Socket, directory: Directory, handlers: MessageHandler[], channels: ChannelState[]) {
    super(handlers, channels);
    this.socket = socket;
    this.directory = directory;
  }

  getDirectory(): Directory {
    return this.directory;
  }

  async narrowIntents(_raiser: AppIdentifier, appIntents: AppIntent[], _context: Context): Promise<AppIntent[]> {
    return appIntents;
  }

  /**
   * Sets the appId, url, state and either the window or a Promise<Window> for a given connection UUID.
   */
  setInstanceDetails(uuid: InstanceID, meta: AppRegistration): void {
    // Type assertion to handle our extended type
    const demoMeta = meta as DemoAppRegistration;

    //remove any existing records with this uuid
    this.connections = this.connections.filter(ca => ca.instanceId !== uuid);

    const instanceDetails = {
      ...demoMeta,
      instanceId: uuid,
    };
    this.connections.push(instanceDetails);

    if (isLaunchingAppRegistration(demoMeta)) {
      //If the window wasn't fully realized yet, monitor the window promise so that it
      //  sets window when resolved.
      demoMeta.windowPromise.then((window: Window | null) => {
        if (window) {
          const launchedMeta: RunningAppRegistration = {
            window: window,
            url: demoMeta.url,
            appId: demoMeta.appId,
            instanceId: demoMeta.instanceId,
            state: demoMeta.state,
          };
          //will replace any existing record
          this.setInstanceDetails(uuid, launchedMeta);
        } else {
          //delete this record as launch failed
          this.connections = this.connections.filter(ca => ca.instanceId !== uuid);
          console.error(
            'We did not receive a window reference after launching app: ',
            demoMeta.url,
            '\nn.b. this may occur if a popup blocker prevented launch or the Cross-Origin-Opener-Policy opener policy is set'
          );
        }
      });
    }
  }

  async getInstanceForWindow(window: Window): Promise<RunningAppRegistration | undefined> {
    const registration = this.connections.filter(isRunningAppRegistration).find(i => i.window == window);
    if (registration) {
      return registration;
    }

    //check for as yet unrealized windows and then wait on those...
    const launchingApps = this.connections.filter(isLaunchingAppRegistration);

    if (launchingApps.length == 0) {
      console.warn('Could not locate an app registration for a window and there are no window launches in progress!');
      return;
    } else {
      //we need to wait on all currently launching windows as it could be any one of those
      return new Promise<RunningAppRegistration | undefined>(resolve => {
        const toMonitor = launchingApps.length;
        let doneCount = 0;
        launchingApps.forEach(launchingApp => {
          launchingApp.windowPromise.then(realizedWindow => {
            doneCount++;
            if (realizedWindow == window) {
              //note that this record will separately be converting itself into a RunningAppRegistration
              resolve({
                window: realizedWindow,
                url: launchingApp.url,
                appId: launchingApp.appId,
                instanceId: launchingApp.instanceId,
                state: launchingApp.state,
              });
            } else if (doneCount >= toMonitor) {
              //we did not find it :-(
              resolve(undefined);
            }
          });
        });
      });
    }
  }

  getInstanceDetails(uuid: InstanceID): DemoAppRegistration | undefined {
    return this.connections.find(i => i.instanceId == uuid);
  }

  getOpener(): Opener {
    const cb = document.getElementById('opener') as HTMLInputElement;
    const val = cb.value;
    const out: Opener = Opener[val as keyof typeof Opener]; //Works with --noImplicitAny
    return out;
  }

  createUUID(): string {
    return uuid();
  }

  /**
   * Post an outgoing message to a particular app
   */
  async post(message: object, to: InstanceID): Promise<void> {
    this.socket.emit(FDC3_DA_EVENT, message, to);
  }

  openFrame(url: string): Promise<Window | null> {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', url);
    iframe.style.width = '640px';
    iframe.style.height = '480px';
    document.body.appendChild(iframe);

    //wait for load event, after which contentWindow should not be null
    const loadPromise = new Promise<Window | null>(resolve => {
      iframe.onload = () => resolve(iframe.contentWindow);
    });
    return loadPromise;
  }

  openTab(url: string): Promise<Window | null> {
    //n.b. There are cases where the window reference returned is null
    // That can happen if the Cross-Origin-Opener-Policy opener policy is set (see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy)
    // or a browser pop-up blocker gets in the way...
    return Promise.resolve(window.open(url, '_blank'));
  }

  async openUrl(url: string): Promise<Window | null> {
    const opener = this.getOpener();
    switch (opener) {
      case Opener.Tab:
        return this.openTab(url);
      case Opener.Frame:
        return this.openFrame(url);
    }
  }

  async open(appId: string): Promise<InstanceID> {
    const details: DirectoryApp[] = this.directory.retrieveAppsById(appId) as DirectoryApp[];
    if (details.length > 0) {
      const launchDetails = details[0].details;
      if (isWebAppLaunchDetails(launchDetails)) {
        const url = launchDetails.url ?? undefined;

        //We do not await the window or frame opening here as that can cause a race condition
        //  where the app loads and attempts to connect before we call `this.setInstanceDetails`.
        //const window = await this.openUrl(url);
        const windowPromise = this.openUrl(url);
        const instanceId: InstanceID = this.createUUID();
        const metadata: LaunchingAppRegistration = {
          appId,
          instanceId,
          windowPromise,
          url,
          state: State.Pending,
        };

        this.setInstanceDetails(instanceId, metadata as AppRegistration);
        return instanceId;
      } else {
        console.error('Unable to launch app without a URL, app: ', details[0]);
        throw new Error(OpenError.ErrorOnLaunch);
      }
    }

    throw new Error(OpenError.AppNotFound);
  }

  async getConnectedApps(): Promise<AppRegistration[]> {
    return (await this.getAllApps()).filter(ca => ca.state == State.Connected);
  }

  async isAppConnected(app: InstanceID): Promise<boolean> {
    const found = this.connections.find(a => a.instanceId == app && a.state == State.Connected);
    return found != null;
  }

  async setAppState(app: InstanceID, newState: State): Promise<void> {
    const found = this.connections.find(a => a.instanceId == app);

    //if this is a new termination (which might be due to a heartbeat) then cleanup
    if (found) {
      const currentState = found.state;
      if (currentState !== State.Terminated && newState === State.Terminated) {
        await this.cleanupApp(app);
      }
      found.state = newState;
    }
  }

  async getAllApps(): Promise<AppRegistration[]> {
    return this.connections.map(x => {
      return {
        appId: x.appId,
        instanceId: x.instanceId,
        state: x.state,
      };
    });
  }

  log(message: string): void {
    console.log(message);
  }

  provider(): string {
    return 'FDC3-Web-Demo';
  }

  providerVersion(): string {
    return '0.1';
  }

  fdc3Version(): string {
    return '2.0';
  }
}

/**
 * Factory for creating DemoFDC3ServerInstance instances.
 * Sets up message handlers and manages the FDC3 server lifecycle.
 */
export class DemoFDC3ServerFactory extends AbstractFDC3ServerFactory {
  private readonly socket: Socket;

  constructor(
    socket: Socket,
    directory: Directory,
    channels: ChannelState[],
    heartbeats: boolean = true,
    intentTimeoutMs: number = 20000,
    openHandlerTimeoutMs: number = 10000
  ) {
    super(directory, channels, heartbeats, intentTimeoutMs, openHandlerTimeoutMs);
    this.socket = socket;
  }

  createInstance(): FDC3ServerInstance {
    return new DemoFDC3ServerInstance(this.socket, this.directory, this.handlers, this.channels);
  }
}
