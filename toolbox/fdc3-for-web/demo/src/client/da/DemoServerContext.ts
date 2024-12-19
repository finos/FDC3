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

type DemoRegistration = AppRegistration & {
  window: Window;
  url: string;
};

//Typeguard used to check if application launch details have a URL
function isWebAppLaunchDetails(details: object): details is { url: string } {
  return (details as { url: string }).url !== undefined;
}

export class DemoServerContext implements ServerContext<DemoRegistration> {
  private readonly socket: Socket;
  private readonly directory: Directory;
  private connections: DemoRegistration[] = [];

  constructor(socket: Socket, directory: Directory) {
    this.socket = socket;
    this.directory = directory;
  }

  async narrowIntents(_raiser: AppIdentifier, appIntents: AppIntent[] /*, _context: Context*/): Promise<AppIntent[]> {
    return appIntents;
  }

  /**
   * Sets the appId and instanceId for a given connection UUID
   */
  setInstanceDetails(uuid: InstanceID, meta: DemoRegistration): void {
    this.connections = this.connections.filter(ca => ca.instanceId !== uuid);

    this.connections.push({
      ...meta,
      instanceId: uuid,
    });
  }

  getInstanceForWindow(window: Window): DemoRegistration | undefined {
    return this.connections.find(i => i.window == window);
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
    console.debug(`Responding to app instance:`, to, message);
    this.socket.emit(FDC3_DA_EVENT, message, to);
  }

  goodbye(id: string) {
    this.connections = this.connections.filter(i => i.instanceId !== id);
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
        const window = await this.openUrl(url);
        if (window) {
          const instanceId: InstanceID = this.createUUID();
          const metadata = {
            appId,
            instanceId,
            window,
            url,
            state: State.Pending,
          };

          this.setInstanceDetails(instanceId, metadata);
          return instanceId;
        } else {
          console.error(
            'We did not receive a window reference after launching app: ',
            details[0],
            '\nn.b. this may occur if a popup blocker prevented launch or the Cross-Origin-Opener-Policy opener policy is set'
          );
          throw new Error(OpenError.ErrorOnLaunch);
        }
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

  getInstanceDetails(uuid: InstanceID): DemoRegistration | undefined {
    return this.connections.find(i => i.instanceId == uuid);
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
