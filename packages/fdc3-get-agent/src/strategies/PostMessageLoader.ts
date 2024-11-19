import { GetAgentParams } from '@kite9/fdc3-standard';
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

  //TODO incorporate a timeout here to replace TimeoutLoader 
  // - would allow timeout to be stopped when message port is received as id validation should be outside of timeout
  // although a separate timeout should be used there to avoid stalling if the DA doesn't respond
export class PostMessageLoader implements Loader {
  connectionAttemptUuid = uuidv4();
  
  helloHandler?: HelloHandler;
  identityValidationHandler?: IdentityValidationHandler;


  async get(options: GetAgentParams): Promise<DesktopAgentSelection | void> {
    const targets: Window[] = [];
    collectPossibleTargets(globalThis.window, targets);

    this.helloHandler = new HelloHandler(options, this.connectionAttemptUuid);

    // ok, begin the process
    const handshakePromise = this.helloHandler.listenForHelloResponses();

    // use of origin '*': See https://github.com/finos/FDC3/issues/1316
    for (let t = 0; t < targets.length; t++) {
      this.helloHandler.sendWCP1Hello(targets[t], '*');
    }

    // wait for one of the windows to respond
    //  This may involve a WCP2LoadUrl response being received
    //  and an adaptor iframe setup to load it, resolves on
    //  WCP3Handshake response.
    // If no WCP3Handshake is ever received this will not resolve
    const connectionDetails = await handshakePromise;

    //perform id validation
    this.identityValidationHandler = new IdentityValidationHandler(connectionDetails.messagePort, options, this.connectionAttemptUuid)
    const idValidationPromise = this.identityValidationHandler.listenForIDValidationResponses();
    this.identityValidationHandler.sendIdValidationMessage();

    try {
      const idDetails = await idValidationPromise;
      const desktopAgentSelection: DesktopAgentSelection = {
        agent: await createDesktopAgentAPI(connectionDetails),
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

      return desktopAgentSelection;
    } catch (e) {
      //id validation may have failed
      throw e;
    }
  }

  cancel(): void {
    //remove any event listeners to end processing
    if (this.helloHandler) {
      this.helloHandler.cancel();
    }

    if (this.identityValidationHandler){
      this.identityValidationHandler.cancel();
    }
  }
}

