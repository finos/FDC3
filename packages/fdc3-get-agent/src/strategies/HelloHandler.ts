import { FDC3_VERSION, GetAgentParams, WebDesktopAgentType } from '@finos/fdc3-standard';
import { ConnectionDetails } from '../messaging/MessagePortMessaging';
import { Logger } from '../util/Logger';
import { BrowserTypes } from '@finos/fdc3-schema';
import { DEFAULT_MESSAGE_EXCHANGE_TIMEOUT_MS, DEFAULT_APP_LAUNCH_TIMEOUT_MS } from './Timeouts';
const { isWebConnectionProtocol2LoadURL, isWebConnectionProtocol3Handshake } = BrowserTypes;
type WebConnectionProtocolMessage = BrowserTypes.WebConnectionProtocolMessage;
type WebConnectionProtocol1Hello = BrowserTypes.WebConnectionProtocol1Hello;

export class HelloHandler {
  constructor(
    options: GetAgentParams,
    connectionAttemptUuid: string,
    agentType: WebDesktopAgentType = WebDesktopAgentType.ProxyParent
  ) {
    this.options = options;
    this.connectionAttemptUuid = connectionAttemptUuid;
    this.agentType = agentType;
    this.helloResponseListener = null;
  }

  /** Parameters passed to getAgent */
  options: GetAgentParams;

  /** UUID used to filter messages */
  connectionAttemptUuid: string;

  /** The agentType to set, which may change if we're asked to load a URL into an iframe */
  agentType: WebDesktopAgentType;

  /** If we're asked to load a URL into an iframe, it is stored here to be saved in Session Storage */
  agentUrl: string | null = null;

  /** Reference to event listener used for responses from Desktop Agents -
   *  Used to remove them when no longer needed.
   *  Initialized when
   *  - listening for hello responses
   *  - listening for identity validation responses
   * */
  helloResponseListener: ((event: MessageEvent<WebConnectionProtocolMessage>) => void) | null;

  /**
   * Starts the connection process off by sending a hello message
   */
  sendWCP1Hello(w: MessageEventSource, origin: string) {
    const requestMessage: WebConnectionProtocol1Hello = {
      type: 'WCP1Hello',
      meta: {
        connectionAttemptUuid: this.connectionAttemptUuid,
        timestamp: new Date(),
      },
      payload: {
        channelSelector: this.options.channelSelector,
        fdc3Version: FDC3_VERSION,
        intentResolver: this.options.intentResolver,
        identityUrl: this.options.identityUrl!,
        actualUrl: globalThis.window.location.href,
      },
    };

    Logger.debug(`HelloHandler: Sending hello msg:\n${JSON.stringify(requestMessage, null, 2)}`);

    w.postMessage(requestMessage, { targetOrigin: origin });
  }

  /**
   * Handle a request from a desktop agent that the client loads an adaptor URL
   * into an iframe instead of working with the parent window.
   */
  openFrame(url: string) {
    const IFRAME_ID = 'fdc3-communications-embedded-iframe';

    // remove an old one if it's there
    document.getElementById(IFRAME_ID)?.remove();

    //note the iframe URL and desktop agent type have changed
    this.agentType = WebDesktopAgentType.ProxyUrl;
    this.agentUrl = url;

    // create a new one
    const iframe = document.createElement('iframe');

    //Wait for the iframe to load... then send it a hello message
    iframe.addEventListener('load', () => {
      if (iframe.contentWindow) {
        Logger.debug('Sending hello message to communication iframe');
        this.sendWCP1Hello(iframe.contentWindow, '*');
      } else {
        throw new Error(
          `An iframe (url: ${url}) added to support communication with a Desktop Agent does not have a contentWindow, despite firing its load event!`
        );
      }
    });

    iframe.setAttribute('src', url);
    iframe.setAttribute('id', IFRAME_ID);
    iframe.setAttribute('name', 'FDC3 Communications');
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = '0';
    iframe.style.position = 'fixed';

    document.body.appendChild(iframe);
  }

  /** Listen for WCP responses from 'parent' windows and frames and handle them.
   * Resolves when a response is received.
   * @returns A Promise resolving to a set of ConnectionDetails
   */
  listenForHelloResponses(): Promise<ConnectionDetails> {
    return new Promise<ConnectionDetails>(resolve => {
      // setup listener for message and retrieve JS URL from it
      this.helloResponseListener = (event: MessageEvent<WebConnectionProtocolMessage>) => {
        const data = event.data;

        if (data?.meta?.connectionAttemptUuid == this.connectionAttemptUuid) {
          if (isWebConnectionProtocol2LoadURL(data)) {
            // in this case, we need to load the URL with the embedded Iframe
            const url = data.payload.iframeUrl;
            this.openFrame(url);

            //n.b event listener remains in place to receive messages from the iframe
          } else if (isWebConnectionProtocol3Handshake(data)) {
            Logger.debug(`HelloHandler: successful handshake:`, data);
            const connectionDetails: ConnectionDetails = {
              connectionAttemptUuid: this.connectionAttemptUuid,
              handshake: data,
              messagePort: event.ports[0],
              options: this.options,
              actualUrl: globalThis.window.location.href,
              agentType: this.agentType,
              agentUrl: this.agentUrl ?? undefined,
              messageExchangeTimeout: data.payload.messageExchangeTimeout ?? DEFAULT_MESSAGE_EXCHANGE_TIMEOUT_MS,
              appLaunchTimeout: data.payload.appLaunchTimeout ?? DEFAULT_APP_LAUNCH_TIMEOUT_MS,
            };
            resolve(connectionDetails);

            //remove the event listener as we've received a messagePort to use
            this.cancel();
          } else {
            Logger.debug(
              `Ignoring unexpected message in HelloHandler (because its not WCP2LoadUrl or WCP3Handshake).`,
              data
            );
          }
        } else {
          Logger.warn(
            `HelloHandler: Ignoring message with invalid connectionAttemptUuid. Expected ${this.connectionAttemptUuid}, received: ${data?.meta?.connectionAttemptUuid}`,
            data
          );
        }
      };

      globalThis.window.addEventListener('message', this.helloResponseListener);
    });
  }

  /** Removes listeners so that events are no longer processed */
  cancel() {
    if (this.helloResponseListener) {
      globalThis.window.removeEventListener('message', this.helloResponseListener);
      this.helloResponseListener = null;
    }
  }
}
