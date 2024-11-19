import { WebConnectionProtocol3Handshake } from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { GetAgentParams, DesktopAgent, WebDesktopAgentType, AgentError } from '@kite9/fdc3-standard';
import { createDesktopAgentAPI } from '../messaging/message-port';
import { DesktopAgentSelection } from './Loader';

/**
 * This is a variation of the PostMessageLoader used for handling failover.
 * If the failover returns a WindowProxy this is used to create a Desktop
 * Agent Proxy. If a DesktopAgent is returned directly it is passed through.
 *
 */
export async function handleFailover(
  options: GetAgentParams,
  failover: (args: GetAgentParams) => Promise<WindowProxy | DesktopAgent>
): Promise<DesktopAgentSelection> {
  return new Promise<DesktopAgentSelection>((resolve, reject) => {
    //may be used to validate that handshake messages received came from
    //  the WindowProxy produced by the failover function
    let proxyResult: Window | null = null;

    //listen for handshake messages from frames created by a failover function
    const el = (event: MessageEvent) => {
      const data = event.data;
      if (data?.type == 'WCP3Handshake') {
        if (event.source != proxyResult) {
          console.warn('Received a Handshake message from invalid source during failover');
          //TODO: decide whether to ignore handshake messages from any source other than providerResult
        }

        const handshake = data as WebConnectionProtocol3Handshake;
        //clean up the listener on the window
        globalThis.window.removeEventListener('message', el);

        const connectionDetails = {
          connectionAttemptUuid: handshake.meta.connectionAttemptUuid,
          handshake: data,
          messagePort: event.ports[0],
          options: options,
          actualUrl: globalThis.window.location.href,
          agentType: WebDesktopAgentType.Failover,
        };
        createDesktopAgentAPI(connectionDetails).then((da: DesktopAgent) => {
          const desktopAgentSelection: DesktopAgentSelection = {
            agent: da,
            details: {
              agentType: WebDesktopAgentType.Failover,
              identityUrl: options.identityUrl ?? connectionDetails.actualUrl,
              actualUrl: connectionDetails.actualUrl,
              //instanceId, appId etc. added after identityValidation exchange
            },
          };
          resolve(desktopAgentSelection);
        });
      } else {
        console.debug(`Ignoring message unexpected message in FailoverHandler (because its not WCP3Handshake).`, data);
      }
    };

    globalThis.window.addEventListener('message', el);

    if (typeof failover === 'function') {
      failover(options).then(failoverResult => {
        //if the result was a Desktop Agent
        if (isDesktopAgent(failoverResult)) {
          //clean up the listener on the window
          globalThis.window.removeEventListener('message', el);

          //retrieve appId and instanceId from the DA
          failoverResult.getInfo().then(implMetadata => {
            const desktopAgentSelection: DesktopAgentSelection = {
              agent: failoverResult,
              details: {
                agentType: WebDesktopAgentType.Failover,
                identityUrl: globalThis.window.location.href,
                actualUrl: globalThis.window.location.href,
                appId: implMetadata.appMetadata.appId,
                instanceId: implMetadata.appMetadata.instanceId,
                instanceUuid: implMetadata.appMetadata.instanceId, // preload DAs don't issue these so repeat the instanceId
              }
            };
            resolve(desktopAgentSelection);
          });
        } else if (isWindow(failoverResult)) {
          // is a WindowProxy
          //save WindowProxy for validating incoming messages later
          proxyResult = failoverResult;
        } else {
          console.error('Failover function returned an invalid result', failoverResult);
          reject(AgentError.InvalidFailover);
        }
      });
    } else {
      reject(AgentError.InvalidFailover);
    }
  });
}

function isDesktopAgent(da: WindowProxy | DesktopAgent): da is DesktopAgent {
  return (da as DesktopAgent).getInfo !== undefined;
}

function isWindow(da: Window | DesktopAgent): da is Window {
  return (da as Window).postMessage !== undefined;
}
