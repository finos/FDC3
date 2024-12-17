import { GetAgentParams, DesktopAgent, WebDesktopAgentType, AgentError, AppIdentifier } from '@kite9/fdc3-standard';
import { createDesktopAgentAPI } from '../messaging/message-port';
import { DesktopAgentSelection } from './Loader';
import { v4 as uuidv4 } from 'uuid';
import { HelloHandler } from './HelloHandler';
import { IdentityValidationHandler } from './IdentityValidationHandler';
import { Logger } from '../util/Logger';

/** TypeGuard for a Desktop Agent */
function isDesktopAgent(da: WindowProxy | DesktopAgent): da is DesktopAgent {
  return (da as DesktopAgent).getInfo !== undefined;
}

/** TypeGuard for a Window */
function isWindow(da: Window | DesktopAgent): da is Window {
  return (da as Window).postMessage !== undefined;
}

export class FailoverHandler {
  constructor(options: GetAgentParams) {
    this.options = options;
    this.connectionAttemptUuid = uuidv4(); // we use a different connectionAttemptUuid to differnetiate from any (failed) messaging to a parent window
    this.helloHandler = new HelloHandler(this.options, this.connectionAttemptUuid, WebDesktopAgentType.Failover);
  }

  /** Parameters passed to getAgent */
  options: GetAgentParams;

  /** UUID used to filter messages */
  connectionAttemptUuid: string;

  /** Handler class for hello/handshake messages */
  helloHandler: HelloHandler;

  /** Handler class for identity validation steps used for Desktop Agent Proxies */
  identityValidationHandler?: IdentityValidationHandler;

  /**
   * This is a variation of the PostMessageLoader used for handling failover.
   * If the failover returns a WindowProxy this is used to create a Desktop
   * Agent Proxy. If a DesktopAgent is returned directly it is passed through.
   *
   */
  async handleFailover(): Promise<DesktopAgentSelection> {
    try {
      //set-up a event listeners in case the failover returns a Window that wants to message us
      const handshakePromise = this.helloHandler.listenForHelloResponses();

      //Run the failover function
      if (typeof this.options.failover === 'function') {
        const failoverResult = await this.options.failover(this.options);

        //if the result was a Desktop Agent
        if (isDesktopAgent(failoverResult)) {
          this.cancel();

          //retrieve appId and instanceId from the DA
          const implMetadata = await failoverResult.getInfo();
          const desktopAgentSelection: DesktopAgentSelection = {
            agent: failoverResult,
            details: {
              agentType: WebDesktopAgentType.Failover,
              identityUrl: globalThis.window.location.href,
              actualUrl: globalThis.window.location.href,
              appId: implMetadata.appMetadata.appId,
              instanceId: implMetadata.appMetadata.instanceId ?? 'unknown',
              instanceUuid: implMetadata.appMetadata.instanceId ?? 'unknown', // preload DAs don't issue these so repeat the instanceId
            },
          };
          return desktopAgentSelection;
        } else if (isWindow(failoverResult)) {
          //if the result was a Window/WindowProxy
          //send a hello message
          this.helloHandler.sendWCP1Hello(failoverResult, '*');
        } else {
          Logger.error('Failover function returned an invalid result: ', failoverResult);
          throw AgentError.InvalidFailover;
        }
      } else {
        Logger.error('Failover was not a function, actual type: ', typeof this.options.failover);
        throw AgentError.InvalidFailover;
      }

      //if we received a WindowProxy from failover, and it sent us a handshake, try to validate its identity
      const connectionDetails = await handshakePromise;
      try {
        this.identityValidationHandler = new IdentityValidationHandler(
          connectionDetails.messagePort,
          this.options,
          this.connectionAttemptUuid
        );
        const idValidationPromise = this.identityValidationHandler.listenForIDValidationResponses();
        this.identityValidationHandler.sendIdValidationMessage();
        const idDetails = await idValidationPromise;
        const appIdentifier: AppIdentifier = {
          appId: idDetails.payload.appId,
          instanceId: idDetails.payload.instanceId,
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
            instanceUuid: idDetails.payload.instanceUuid,
          },
        };

        return desktopAgentSelection;
      } catch (e) {
        //identity validation may have failed
        Logger.error('Error during identity validation of Failover', e);
        throw e;
      }
    } finally {
      //cleanup any remaining listeners
      this.cancel();
    }
  }

  /** Removes listeners so that events are no longer processed */
  cancel() {
    this.helloHandler.cancel();
    if (this.identityValidationHandler) {
      this.identityValidationHandler.cancel();
    }
  }
}