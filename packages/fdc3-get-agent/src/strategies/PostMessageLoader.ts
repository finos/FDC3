import { AgentError, AppIdentifier, GetAgentParams, LogLevel } from '@finos/fdc3-standard';
import { createDesktopAgentAPI } from '../messaging/message-port.js';
import { v4 as uuidv4 } from 'uuid';
import { DesktopAgentSelection, Loader } from './Loader.js';
import { HelloHandler, HelloHandlerCallbacks } from './HelloHandler.js';
import { IdentityValidationHandler } from './IdentityValidationHandler.js';
import { Logger } from '../util/Logger.js';
import { DEFAULT_GETAGENT_TIMEOUT_MS } from './Timeouts.js';

/**
 * Recursive search for all possible parent frames (windows) that we may
 * target with the WCP.
 * @param startWindow window object to search
 * @param found window objects found so far
 */
function collectPossibleTargets(startWindow: Window, found: Window[]) {
  _recursePossibleTargets(startWindow, startWindow, found);
  Logger.debug(`Possible parent windows/frames found: ${found.length}`);
}

function _recursePossibleTargets(startWindow: Window, w: Window, found: Window[]) {
  if (w) {
    if (found.indexOf(w) == -1 && w != startWindow) {
      found.push(w);
    }

    if (w.opener) {
      _recursePossibleTargets(startWindow, w.opener, found);
    }

    if (w.parent != w) {
      _recursePossibleTargets(startWindow, w.parent, found);
    }
  }
}

/** Loader for Desktop Agent Proxy implementations. Attempts to
 *  connect to parent windows or frames via teh Web Connection Protocol,
 *  which may include setting up an iframe to load an adaptor URL.
 *  A previously persisted adaptor URL may be passed to skip the
 *  discovery of parent windows and to move straight to loading that.
 */
export class PostMessageLoader implements Loader {
  name = 'PostMessageLoader';
  private proxyLogLevel: LogLevel | null;

  constructor(options: GetAgentParams, previousUrl?: string) {
    //prep log settings to pass on to the proxy
    this.proxyLogLevel = options.logLevels?.proxy ?? null;

    this.previousUrl = previousUrl ?? null;
  }

  previousUrl: string | null;
  connectionAttemptUuid = uuidv4();

  helloHandler?: HelloHandler;
  identityValidationHandler?: IdentityValidationHandler;

  /** Timeout for the current phase of connection (released once a MessagePort
   *  is received - additional steps are outside timeout). Re-armed when a
   *  WCP2LoadUrl message is received, as the Web Connection Protocol requires
   *  a new timeout to be applied once we move on to loading an adaptor iframe. */
  timeout: ReturnType<typeof setTimeout> | null = null;

  /** Reference to the get fn's Promise's reject call - used when cancelling. */
  rejectFn: ((reason?: string) => void) | null = null;

  /** Set once the iframe used to load an adaptor fires its 'load' event, so
   *  that a more precise error can be given if the subsequent handshake with
   *  it still times out. */
  adaptorFrameLoaded = false;

  get(options: GetAgentParams): Promise<DesktopAgentSelection> {
    Logger.debug(`PostMessageLoader.get(): Initiating search for Desktop Agent Proxy`);
    return new Promise<DesktopAgentSelection>((resolve, reject) => {
      //save reject fn in case we get cancelled
      this.rejectFn = reject;

      const timeoutMs = options.timeoutMs ?? DEFAULT_GETAGENT_TIMEOUT_MS;

      //(Re)starts the timeout used to limit how long we wait in the current
      //phase of connection. Used both for the initial wait for a response to
      //WCP1Hello and - separately - for the wait on an adaptor iframe to load
      //and complete a handshake, per the Web Connection Protocol:
      //https://fdc3.finos.org/docs/api/specs/webConnectionProtocol#12-desktop-agent-discovery
      const restartTimeout = (error: AgentError, describeFailure: () => string) => {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          const message = `PostMessageLoader.get(): ${describeFailure()} at ${new Date().toISOString()}`;
          //Report failures to load/connect to an adaptor iframe more loudly
          //(WARN, visible by default) than a plain "nothing responded" result
          //(DEBUG), since the former usually indicates a real problem (e.g. a
          //CORS/CSP/X-Frame-Options block) worth surfacing without needing to
          //dig through the network panel - see
          //https://github.com/finos/FDC3/issues/1733
          if (error === AgentError.ErrorOnConnect) {
            Logger.warn(message);
          } else {
            Logger.debug(message);
          }
          //clear rejectFn first so that cancel() below doesn't reject with
          //its generic AgentNotFound ahead of the more specific error reject()
          //is about to supply
          this.rejectFn = null;
          this.cancel();
          reject(error);
        }, timeoutMs);
      };

      restartTimeout(AgentError.AgentNotFound, () => `timeout (${timeoutMs} ms) waiting for a response to WCP1Hello`);

      this.helloHandler = new HelloHandler(options, this.connectionAttemptUuid);

      const callbacks: HelloHandlerCallbacks = {
        //A WCP2LoadUrl response means we're moving on to loading an adaptor
        //iframe - this is a distinct phase of connection with its own timeout
        //and, if it fails, a more specific error (ErrorOnConnect) than a
        //plain AgentNotFound.
        onAdaptorLoadRequested: url => {
          restartTimeout(AgentError.ErrorOnConnect, () =>
            this.adaptorFrameLoaded
              ? `Desktop Agent adaptor iframe (url: ${url}) loaded but did not complete a handshake within ${timeoutMs} ms`
              : `Desktop Agent adaptor iframe (url: ${url}) did not finish loading within ${timeoutMs} ms`
          );
        },
        onAdaptorFrameLoaded: () => {
          this.adaptorFrameLoaded = true;
        },
      };

      // ok, begin the process
      const handshakePromise = this.helloHandler.listenForHelloResponses(callbacks);

      if (this.previousUrl) {
        Logger.debug(`PostMessageLoader.get(): Loading previously used adaptor URL: ${this.previousUrl}`);

        //skip looking for target parent windows and open an iframe immediately
        callbacks.onAdaptorLoadRequested?.(this.previousUrl);
        this.helloHandler.openFrame(this.previousUrl, callbacks);
      } else {
        //collect target parent window references
        const targets: Window[] = [];
        collectPossibleTargets(globalThis.window, targets);

        // use of origin '*': See https://github.com/finos/FDC3/issues/1316
        for (let t = 0; t < targets.length; t++) {
          this.helloHandler.sendWCP1Hello(targets[t], '*');
        }
      }

      // wait for one of the windows to respond
      //  This may involve a WCP2LoadUrl response being received
      //  and an adaptor iframe setup to load it, resolves on
      //  WCP3Handshake response.
      // If no WCP3Handshake is ever received this will not resolve
      handshakePromise.then(connectionDetails => {
        //prevent us being cancelled
        this.rejectFn = null;

        //cancel the current phase's timeout as we got a handshake response
        if (this.timeout) {
          clearTimeout(this.timeout);
        }

        //perform id validation
        this.identityValidationHandler = new IdentityValidationHandler(
          connectionDetails.messagePort,
          options,
          this.connectionAttemptUuid
        );
        const idValidationPromise = this.identityValidationHandler.listenForIDValidationResponses();

        //start the message port so that we can receive responses
        connectionDetails.messagePort.start();

        this.identityValidationHandler.sendIdValidationMessage();

        idValidationPromise
          .then(idDetails => {
            //resolve
            const appIdentifier: AppIdentifier = {
              appId: idDetails.payload.appId,
              instanceId: idDetails.payload.instanceId,
            };

            createDesktopAgentAPI(connectionDetails, appIdentifier, this.proxyLogLevel).then(da => {
              const desktopAgentSelection: DesktopAgentSelection = {
                agent: da,
                details: {
                  agentType: connectionDetails.agentType,
                  agentUrl: connectionDetails.agentUrl ?? undefined,
                  identityUrl: connectionDetails.options.identityUrl ?? connectionDetails.actualUrl,
                  actualUrl: connectionDetails.actualUrl,
                  appId: idDetails.payload.appId,
                  instanceId: idDetails.payload.instanceId,
                  instanceUuid: idDetails.payload.instanceUuid,
                },
              };

              //clean up
              this.cancel();

              resolve(desktopAgentSelection);
            });
          })
          .catch(e => {
            //id validation may have failed
            reject(e);
          });
      });
    });
  }

  async cancel(): Promise<void> {
    Logger.debug('PostMessageLoader: Cleaning up');

    //if we're being cancelled while still running, reject the promise
    if (this.rejectFn) {
      this.rejectFn(AgentError.AgentNotFound);
      this.rejectFn = null;
    }

    //cancel the timeout
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    //remove any event listeners to end processing
    if (this.helloHandler) {
      this.helloHandler.cancel();
    }

    if (this.identityValidationHandler) {
      this.identityValidationHandler.cancel();
    }
  }
}
