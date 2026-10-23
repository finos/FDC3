import { FDC3_VERSION, GetAgentParams, WebDesktopAgentType } from '@finos/fdc3-standard';
import { ConnectionDetails } from '../messaging/MessagePortMessaging.js';
import { Logger } from '../util/Logger.js';
import { BrowserTypesCore } from '@finos/fdc3-schema';
import { DEFAULT_MESSAGE_EXCHANGE_TIMEOUT_MS, DEFAULT_APP_LAUNCH_TIMEOUT_MS } from './Timeouts.js';
const { isWebConnectionProtocol2LoadURL, isWebConnectionProtocol3Handshake } = BrowserTypesCore;
type WebConnectionProtocolMessage = BrowserTypesCore.WebConnectionProtocolMessage;
type WebConnectionProtocol1Hello = BrowserTypesCore.WebConnectionProtocol1Hello;

/** Callbacks used to notify a caller of significant events while connecting
 *  to a Desktop Agent Proxy, so that it can react to them - e.g. by applying
 *  a new timeout once an adaptor iframe is being loaded, as the Web
 *  Connection Protocol requires a separate timeout for that phase of the
 *  connection (see https://fdc3.finos.org/docs/api/specs/webConnectionProtocol#12-desktop-agent-discovery). */
export interface HelloHandlerCallbacks {
  /** Called when a WCP2LoadUrl message is received, before the adaptor
   *  iframe used to load that URL is created. */
  onAdaptorLoadRequested?: (url: string) => void;
  /** Called when the adaptor iframe's 'load' event fires. This only
   *  indicates that the iframe's document loaded - not that a working
   *  connection to a Desktop Agent within it has been established. */
  onAdaptorFrameLoaded?: () => void;
}

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
  openFrame(url: string, callbacks: HelloHandlerCallbacks = {}) {
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
      callbacks.onAdaptorFrameLoaded?.();
      if (iframe.contentWindow) {
        Logger.debug('Sending hello message to communication iframe');
        this.sendWCP1Hello(iframe.contentWindow, '*');
      } else {
        throw new Error(
          `An iframe (url: ${url}) added to support communication with a Desktop Agent does not have a contentWindow, despite firing its load event!`
        );
      }
    });

    //Note: browsers will not always fire this event for failures such as a
    //response blocked by CORS/CSP/X-Frame-Options restrictions (those often
    //still fire 'load'), but it does help surface outright network failures
    //(e.g. DNS or connection errors) that would otherwise only be visible in
    //the browser's network panel.
    iframe.addEventListener('error', () => {
      Logger.warn(`HelloHandler: Desktop Agent adaptor iframe (url: ${url}) failed to load`);
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
  listenForHelloResponses(callbacks: HelloHandlerCallbacks = {}): Promise<ConnectionDetails> {
    return new Promise<ConnectionDetails>(resolve => {
      // setup listener for message and retrieve JS URL from it
      this.helloResponseListener = (event: MessageEvent<WebConnectionProtocolMessage>) => {
        const data = event.data;

        if (isWebConnectionProtocol2LoadURL(data)) {
          if (data.meta.connectionAttemptUuid != this.connectionAttemptUuid) {
            Logger.warn(
              `HelloHandler: Ignoring message with invalid connectionAttemptUuid. Expected ${this.connectionAttemptUuid}, received: ${data.meta.connectionAttemptUuid}`,
              data
            );
            return;
          }

          // in this case, we need to load the URL with the embedded Iframe
          const url = data.payload.iframeUrl;
          callbacks.onAdaptorLoadRequested?.(url);
          this.openFrame(url, callbacks);

          //n.b event listener remains in place to receive messages from the iframe
        } else if (isWebConnectionProtocol3Handshake(data)) {
          if (data.meta.connectionAttemptUuid != this.connectionAttemptUuid) {
            Logger.warn(
              `HelloHandler: Ignoring message with invalid connectionAttemptUuid. Expected ${this.connectionAttemptUuid}, received: ${data.meta.connectionAttemptUuid}`,
              data
            );
            return;
          }

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
