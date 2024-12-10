import {
  Fdc3UserInterfaceHandshake,
  InitialCSS,
  isFdc3UserInterfaceHello,
  isFdc3UserInterfaceRestyle,
  UpdatedCSS,
} from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { Connectable, FDC3_VERSION } from '@kite9/fdc3-standard';
import { Logger } from '../util/Logger';

export interface CSSPositioning {
  [key: string]: string;
}

export const INITIAL_CONTAINER_CSS = {
  width: '0',
  height: '0',
  position: 'fixed',
};

export const ALLOWED_CSS_ELEMENTS = [
  'width',
  'height',
  'position',
  'zIndex',
  'left',
  'right',
  'top',
  'bottom',
  'transition',
  'maxHeight',
  'maxWidth',
  'display',
];

export abstract class AbstractUIComponent implements Connectable {
  private container: HTMLDivElement | undefined = undefined;
  private iframe: HTMLIFrameElement | undefined = undefined;
  private url: string;
  private name: string;
  port: MessagePort | null = null;

  constructor(url: string, name: string) {
    this.url = url;
    this.name = name;
  }

  /**
   * Connect the UI component by creating the UI iframe, then wait on
   * a Fdc3UserInterfaceHello message.
   *
   * This function is NOT properly async as we don't want to block the
   * Desktop Agent connection on the UI frames as they may be blocked by
   * security policies. I.e. awaiting this will not block.
   */
  connect(): Promise<void> {
    const portPromise = this.awaitHello();
    this.openFrame();
    portPromise.then(port => {
      this.port = port;
      this.setupMessagePort(port).then(() => {
        this.messagePortReady(port);
      });
    });
    return Promise.resolve();
  }

  async disconnect() {
    this.port?.close();
  }

  /**
   * Override and extend this method to provide functionality specific to the UI in question
   */
  async setupMessagePort(port: MessagePort): Promise<void> {
    port.addEventListener('message', e => {
      const data = e.data;

      if (isFdc3UserInterfaceRestyle(data)) {
        Logger.debug(`Restyling ${JSON.stringify(data.payload, null, 2)}`);
        const css = data.payload.updatedCSS;
        this.themeContainer(css);
      }
    });
  }

  async messagePortReady(port: MessagePort) {
    // tells the iframe it can start posting
    const message: Fdc3UserInterfaceHandshake = {
      type: 'Fdc3UserInterfaceHandshake',
      payload: {
        fdc3Version: FDC3_VERSION,
      },
    };
    port.postMessage(message);
  }

  private awaitHello(): Promise<MessagePort> {
    return new Promise((resolve /*, _reject*/) => {
      const ml = (e: MessageEvent) => {
        if (e.source == this.iframe?.contentWindow) {
          if (isFdc3UserInterfaceHello(e.data)) {
            const helloData = e.data;
            if (helloData.payload.initialCSS) {
              this.themeContainer(helloData.payload.initialCSS);
            }
            const port = e.ports[0];
            port.start();
            globalThis.window.removeEventListener('message', ml);
            resolve(port);
          } else {
            Logger.debug('AbstractUIComponent: ignored UI Message from UI iframe while awaiting hello: ', e.data);
          }
        } else {
          Logger.debug(
            "AbstractUIComponent: ignored Message that didn't come from expected UI frame\n",
            e.data,
            '\nexpected window name: ',
            this.iframe?.contentWindow?.name,
            '\ngot window name: ',
            (e.source as Window).name
          );
        }
      };

      globalThis.window.addEventListener('message', ml);
    });
  }

  private openFrame(): void {
    this.container = globalThis.document.createElement('div');
    this.iframe = globalThis.document.createElement('iframe');

    this.themeContainer(INITIAL_CONTAINER_CSS);
    this.themeFrame(this.iframe);

    this.iframe.setAttribute('src', this.url);
    this.iframe.setAttribute('name', this.name);

    this.container.appendChild(this.iframe);
    document.body.appendChild(this.container);
  }

  private toKebabCase(str: string) {
    return str.replace(/[A-Z]/g, match => '-' + match.toLowerCase());
  }

  themeContainer(css: UpdatedCSS | InitialCSS) {
    if (css) {
      for (let i = 0; i < ALLOWED_CSS_ELEMENTS.length; i++) {
        const k = ALLOWED_CSS_ELEMENTS[i];
        const value: string | undefined = css[k as string];
        if (value != null) {
          this.container!.style.setProperty(this.toKebabCase(k), value);
        } else {
          this.container!.style.removeProperty(this.toKebabCase(k));
        }
      }
    }
  }

  themeFrame(ifrm: HTMLIFrameElement) {
    ifrm.style.width = '100%';
    ifrm.style.height = '100%';
    ifrm.style.border = '0';
  }
}
