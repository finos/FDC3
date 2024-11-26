import { AgentError, AppIdentifier, DEFAULT_TIMEOUT_MS, GetAgentParams } from '@kite9/fdc3-standard';
import { createDesktopAgentAPI } from '../messaging/message-port';
import { v4 as uuidv4 } from 'uuid';
import { DesktopAgentSelection, Loader } from './Loader';
import { HelloHandler } from './HelloHandler';
import { IdentityValidationHandler } from './IdentityValidationHandler';

/**
 * Recursive search for all possible parent frames (windows) that we may
 * target with the WCP.
 * @param w window object to search
 * @param found window objects found so far
 */
function collectPossibleTargets(startWindow: Window, found: Window[]) {
  _recursePossibleTargets(startWindow, startWindow, found);
}

function _recursePossibleTargets(startWindow: Window, w: Window, found: Window[]) {
  if (w) {
    if (found.indexOf(w) == -1 && w != startWindow) {
      found.push(w);
    }

    if (found.indexOf(w.opener) == -1 && w != startWindow) {
      _recursePossibleTargets(startWindow, w.opener, found);
    }

    if (found.indexOf(w.parent) == -1 && w != startWindow) {
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

  constructor(previousUrl?: string) {
    this.previousUrl = previousUrl ?? null;
  }

  previousUrl: string | null;
  connectionAttemptUuid = uuidv4();
  
  helloHandler?: HelloHandler;
  identityValidationHandler?: IdentityValidationHandler;

  /** Initial timeout (released once a MessagePort is received - additional steps are outside timeout) */
  timeout: NodeJS.Timeout | null = null;

  get(options: GetAgentParams): Promise<DesktopAgentSelection> {
    return new Promise<DesktopAgentSelection>(async (resolve, reject) => {
      
      //setup a timeout so we can reject if it runs out 
      this.timeout = setTimeout(() => {
          this.cancel();
          reject(new Error(AgentError.AgentNotFound));
      }, options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
    
      
      this.helloHandler = new HelloHandler(options, this.connectionAttemptUuid);

      // ok, begin the process
      const handshakePromise = this.helloHandler.listenForHelloResponses();

      if (this.previousUrl) {
        console.debug(`Loading previously used adaptor URL: ${this.previousUrl}`);

        //skip looking for target parent windows and open an iframe immediately
        this.helloHandler.openFrame(this.previousUrl);
        
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
      const connectionDetails = await handshakePromise;

      //cancel the initial timeout as we got a handshake response
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      //perform id validation
      this.identityValidationHandler = new IdentityValidationHandler(connectionDetails.messagePort, options, this.connectionAttemptUuid)
      const idValidationPromise = this.identityValidationHandler.listenForIDValidationResponses();
      this.identityValidationHandler.sendIdValidationMessage();

      try {
        const idDetails = await idValidationPromise;
        const appIdentifier: AppIdentifier = {
          appId: idDetails.payload.appId,
          instanceId: idDetails.payload.instanceId
        };
        const desktopAgentSelection: DesktopAgentSelection = {
          agent: await createDesktopAgentAPI(connectionDetails, appIdentifier),
          details: {
            agentType: connectionDetails.agentType,
            agentUrl: connectionDetails.agentUrl ?? undefined,
            identityUrl: connectionDetails.options.identityUrl ?? connectionDetails.actualUrl,
            actualUrl: connectionDetails.actualUrl,
            appId: idDetails.payload.appId,
            instanceId: idDetails.payload.instanceId,
            instanceUuid: idDetails.payload.instanceUuid
          },
        };
        
        resolve(desktopAgentSelection);
      } catch (e) {
        //id validation may have failed
        reject(e);
      }
    });
  }

  cancel(): void {
    //cancel the timeout
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    //remove any event listeners to end processing
    if (this.helloHandler) {
      this.helloHandler.cancel();
    }

    if (this.identityValidationHandler){
      this.identityValidationHandler.cancel();
    }
  }
}

