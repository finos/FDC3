import { AppRegistration, Directory, DirectoryApp, InstanceID, ServerContext, State } from '@kite9/fdc3-web-impl';
import { Socket } from 'socket.io-client';
import { v4 as uuid } from 'uuid';
import { FDC3_DA_EVENT } from '../../message-types';
import { AppIdentifier, AppIntent, OpenError } from '@kite9/fdc3';

enum Opener {
  Tab,
  Frame,
  Nested,
}

type DemoAppRegistration = AppRegistration & {
  window: Window;
  url: string;
};

type DemoLaunchRegistration = AppRegistration & {
  windowPromise: Promise<Window | null>;
  url: string;
};

type DemoRegistration = DemoAppRegistration | DemoLaunchRegistration;

//Type guard used to check if application launch details have a URL
function isWebAppLaunchDetails(details: object): details is { url: string } {
  return (details as { url: string }).url !== undefined;
}

//Type guard used to check if application has been launched or if we are still waiting on the window reference
function isDemoLaunchRegistration(
  details: DemoAppRegistration | DemoLaunchRegistration
): details is DemoLaunchRegistration {
  return !!(details as DemoLaunchRegistration).windowPromise;
}

//Type guard used to check if application has been launched or if we are still waiting on the window reference
function isDemoAppRegistration(details: DemoAppRegistration | DemoLaunchRegistration): details is DemoAppRegistration {
  return !!(details as DemoAppRegistration).window;
}

export class DemoServerContext implements ServerContext<DemoRegistration> {
  private readonly socket: Socket;
  private readonly directory: Directory;
  private connections: (DemoAppRegistration | DemoLaunchRegistration)[] = [];
  private pastConnections: { registration: DemoAppRegistration; timestamp: number }[] = [];
  private static PAST_CONNECTIONS_MAX_AGE_MS = 60 * 1000;

  constructor(socket: Socket, directory: Directory) {
    this.socket = socket;
    this.directory = directory;
  }

  async narrowIntents(_raiser: AppIdentifier, appIntents: AppIntent[] /*, _context: Context*/): Promise<AppIntent[]> {
    return appIntents;
  }

  private prunePastConnections = () => {
    const threshold = Date.now() - DemoServerContext.PAST_CONNECTIONS_MAX_AGE_MS;
    this.pastConnections = this.pastConnections.filter(pc => pc.timestamp > threshold);
  };

  /**
   * Sets the appId, url, state and either the window or a Promise<Window> for a given connection UUID.
   */
  setInstanceDetails(uuid: InstanceID, meta: DemoAppRegistration | DemoLaunchRegistration): void {
    //remove any existing records with this uuid
    this.connections = this.connections.filter(ca => ca.instanceId !== uuid);
    this.pastConnections = this.pastConnections.filter(i => i.registration.instanceId != uuid);

    const instanceDetails = {
      ...meta,
      instanceId: uuid,
    };
    this.connections.push(instanceDetails);

    if (isDemoLaunchRegistration(meta)) {
      //If the window wasn't fully realized yet, monitor the window promise so that it
      //  sets window when resolved.
      meta.windowPromise.then((window: Window | null) => {
        if (window) {
          const launchedMeta: DemoAppRegistration = {
            window: window,
            url: meta.url,
            appId: meta.appId,
            instanceId: meta.instanceId,
            state: meta.state,
          };
          //will replace any existing record
          this.setInstanceDetails(uuid, launchedMeta);
        } else {
          //delete this record as launch failed
          this.connections = this.connections.filter(ca => ca.instanceId !== uuid);
          console.error(
            'We did not receive a window reference after launching app: ',
            meta.url,
            '\nn.b. this may occur if a popup blocker prevented launch or the Cross-Origin-Opener-Policy opener policy is set'
          );
        }
      });
    }
  }

  async getInstanceForWindow(window: Window): Promise<DemoAppRegistration | undefined> {
    const registration = this.connections.filter(isDemoAppRegistration).find(i => i.window == window);
    if (registration) {
      return registration;
    }

    //check for as yet unrealized windows and then wait on those...
    const launchingApps = this.connections.filter(isDemoLaunchRegistration);

    if (launchingApps.length == 0) {
      console.warn('Could not locate an app registration for a window and there are no window launches in progress!');
      return;
    } else {
      //we need to wait on all currently launching windows as it could be any one of those
      return new Promise<DemoAppRegistration | undefined>(resolve => {
        const toMonitor = launchingApps.length;
        let doneCount = 0;
        launchingApps.forEach(launchingApp => {
          launchingApp.windowPromise.then(realizedWindow => {
            doneCount++;
            if (realizedWindow == window) {
              //note that this record will separately be converting itself into a DemoAppRegistration
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

  getInstanceDetails(uuid: InstanceID): DemoRegistration | undefined {
    return this.connections.find(i => i.instanceId == uuid);
  }

  getPastInstanceDetails(uuid: InstanceID): DemoAppRegistration | undefined {
    this.prunePastConnections();
    return this.pastConnections.find(i => i.registration.instanceId == uuid)?.registration;
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

  goodbye(id: string) {
    const registration = this.connections.find(i => i.instanceId == id);
    this.connections = this.connections.filter(i => i.instanceId !== id);

    //cache the connection details in case the app tries to reconnect
    if (registration && isDemoAppRegistration(registration)) {
      this.pastConnections.push({ registration, timestamp: Date.now() });
    }

    console.debug(`Closed instance`, id);
    console.debug(
      `Open apps:`,
      this.connections.map(i => i.instanceId)
    );
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

  openNested(url: string): Promise<Window | null> {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'nested.html?url=' + url);
    iframe.style.width = '640px';
    iframe.style.height = '480px';
    document.body.appendChild(iframe);

    //wait for load event, after which contentWindow should not be null
    const loadPromise = new Promise<Window | null>(resolve => {
      iframe.onload = () => resolve(iframe.contentWindow);
    });
    return loadPromise;
  }

  async openUrl(url: string): Promise<Window | null> {
    const opener = this.getOpener();
    switch (opener) {
      case Opener.Tab:
        return this.openTab(url);
      case Opener.Nested:
        return this.openNested(url);
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
        const metadata: DemoLaunchRegistration = {
          appId,
          instanceId,
          windowPromise,
          url,
          state: State.Pending,
        };

        this.setInstanceDetails(instanceId, metadata);
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

  async setAppState(app: InstanceID, state: State): Promise<void> {
    const found = this.connections.find(a => a.instanceId == app);
    if (found) {
      found.state = state;
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
