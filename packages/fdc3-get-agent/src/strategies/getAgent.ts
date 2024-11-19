import { DesktopAgent, GetAgentType, GetAgentParams, AgentError, DesktopAgentDetails, WebDesktopAgentType } from '@kite9/fdc3-standard'
import { DesktopAgentPreloadLoader } from './DesktopAgentPreloadLoader'
import { PostMessageLoader } from './PostMessageLoader'
import { TimeoutLoader } from './TimeoutLoader'
import { storeDesktopAgentDetails, retrieveAllDesktopAgentDetails } from '../sessionStorage/DesktopAgentDetails';
import { handleFailover } from './FailoverHandler';

const DEFAULT_WAIT_FOR_MS = 750;

export const FDC3_VERSION = "2.2"

/**
 * For now, we only allow a single call to getAgent per application, so 
 * we keep track of the promise we use here.  
 */
var theAgentPromise: Promise<DesktopAgent> | null = null;

export function clearAgentPromise() {
    theAgentPromise = null;
}

export function getAgentPromise(): Promise<DesktopAgent> | null {
    return theAgentPromise;
}

function initAgentPromise(options: GetAgentParams): Promise<DesktopAgent> {

    const DEFAULT_STRATEGIES = [
        new DesktopAgentPreloadLoader(),
        new PostMessageLoader(),
        new TimeoutLoader()
    ]

    //TODO: retrieve persisted data and only use a previous strategy if one exists
    const promises = DEFAULT_STRATEGIES.map(s => s.get(options));

    return Promise.race(promises)
    .then(selection => {
        // first, cancel the timeout etc.
        DEFAULT_STRATEGIES.forEach(s => s.cancel())
        // either the timeout completes first with an error, or one of the other strategies completes with a DesktopAgent.
        if (selection) {
            const desktopAgentDetails: DesktopAgentDetails = {
                agentType: selection.details.agentType,
                identityUrl: selection.details.identityUrl,
                actualUrl: selection.details.actualUrl,
                agentUrl: selection.details.agentUrl ?? undefined,
                appId: selection.details.appId,
                instanceId: selection.details.instanceId,
                instanceUuid: selection.details.instanceUuid
            };
            storeDesktopAgentDetails(desktopAgentDetails);

            return selection.agent;
        } else {
            throw new Error(AgentError.AgentNotFound)
        }
    })
    .catch(async (error) => {
        if (options.failover != undefined) {
            try {
                //TODO: ensure a timeout is also applied to the failover, to avoid getting stuck here
                const selection = await handleFailover(options, options.failover);

                //store details of the connection in SessionStorage
                const desktopAgentDetails: DesktopAgentDetails = {
                    agentType: WebDesktopAgentType.Failover,
                    identityUrl: selection.details.identityUrl,
                    actualUrl: selection.details.actualUrl,
                    agentUrl: selection.details.agentUrl ?? undefined,
                    appId: selection.details.appId,
                    instanceId: selection.details.instanceId,
                    instanceUuid: selection.details.instanceUuid
                };
                storeDesktopAgentDetails(desktopAgentDetails);

                
                return selection.agent;
            } catch (e) {
                console.error("Desktop agent not found. Error reported during failover", e);
                throw e;
            }
        } else {
            //We didn't manage to find an agent. Suppress any actual error and throw a value from AgentError
            console.log("Desktop agent not found. Error reported during discovery", error);
            throw new Error(AgentError.AgentNotFound);
        }
    });
}

/**
 * Function used to retrieve an FDC3 Desktop Agent API instance, which
 * supports the discovery of a Desktop Agent Preload (a container-injected
 * API implementation) or a Desktop Agent Proxy (a Browser-based Desktop Agent
 * running in another window or frame). Finally, if no Desktop Agent is found,
 * a failover function may be supplied by an app allowing it to start or otherwise
 * connect to a Desktop Agent (e.g. by loading a proprietary adaptor that
 * returns a `DesktopAgent` implementation or by creating a window or iframe of
 * its own that will provide a Desktop Agent Proxy.
 *
 * @param {GetAgentParams} params Optional parameters object, which
 * may include a URL to use for the app's identity, other settings
 * that affect the behavior of the getAgent() function and a `failover`
 * function that should be run if a Desktop Agent is not detected.
 *
 * @returns A promise that resolves to a DesktopAgent implementation or
 * rejects with an error message from the `AgentError` enumeration if unable to
 * return a Desktop Agent implementation.
 *
 * @example
 * const fdc3 = await getAgent();
 *
 * // OR
 *
 * getAgent({
 *     identityUrl: "https://example.com/path?param=appName#example",
 *     channelSelector: false,
 *     intentResolver: false
 * }).then((fdc3) => {
 *     //do FDC3 stuff here
 * };
 */
export const getAgent: GetAgentType = (params?: GetAgentParams) => {

    const DEFAULT_OPTIONS: GetAgentParams = {
        dontSetWindowFdc3: true,
        channelSelector: true,
        intentResolver: true,
        timeoutMs: DEFAULT_WAIT_FOR_MS,
        identityUrl: globalThis.window.location.href
    };

    const options: GetAgentParams = {
        ...DEFAULT_OPTIONS,
        ...params
    };

    async function handleSetWindowFdc3(da: DesktopAgent) {
        if ((!options.dontSetWindowFdc3) && (globalThis.window.fdc3 == null)) {
            globalThis.window.fdc3 = da;
            globalThis.window.dispatchEvent(new Event("fdc3Ready"));
        }
        return da;
    };

    if (!theAgentPromise) {
        theAgentPromise = initAgentPromise(options).then(handleSetWindowFdc3);
    }

    return theAgentPromise;
}

/**
 * Replaces the original fdc3Ready function from FDC3 2.0 with a new one that uses the new getAgent function.
 * 
 * @param waitForMs Amount of time to wait before failing the promise (20 seconds is the default).
 * @returns A DesktopAgent promise.
 */
export function fdc3Ready(waitForMs = DEFAULT_WAIT_FOR_MS): Promise<DesktopAgent> {
    return getAgent({
        timeoutMs: waitForMs,
        dontSetWindowFdc3: false,
        channelSelector: true,
        intentResolver: true
    });
}