import { DesktopAgent, GetAgentType, GetAgentParams, AgentError, DesktopAgentDetails, WebDesktopAgentType, DEFAULT_TIMEOUT_MS } from '@kite9/fdc3-standard';
import { DesktopAgentPreloadLoader } from './DesktopAgentPreloadLoader';
import { PostMessageLoader } from './PostMessageLoader';
import { retrieveDesktopAgentDetails, storeDesktopAgentDetails } from '../sessionStorage/DesktopAgentDetails';
import { FailoverHandler } from './FailoverHandler';
import { Loader } from './Loader';
import { Logger } from '../util/Logger';

// TypeGuards used to examine results of Loaders
const isRejected = (input: PromiseSettledResult<unknown>): input is PromiseRejectedResult => 
    input.status === 'rejected'
  
const isFulfilled = <T>(input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> => 
    input.status === 'fulfilled'

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
    Logger.log(`Initiating Desktop Agent discovery at ${new Date().toISOString()}`);
    let strategies: Loader[];

    //Retrieve persisted connection data limit to a previous strategy if one exists
    const persistedData = retrieveDesktopAgentDetails(options.identityUrl ?? globalThis.window.location.href);
    if (persistedData) {
        switch (persistedData.agentType) {
            case WebDesktopAgentType.Preload:
                strategies = [new DesktopAgentPreloadLoader()];
                break;
            case WebDesktopAgentType.ProxyUrl:
                //agentUrl will only be used by PostMessageLoader if not falsey
                strategies = [new PostMessageLoader(persistedData.agentUrl)];
                break;
            case WebDesktopAgentType.ProxyParent:
                strategies = [new PostMessageLoader()];
                break;
            case WebDesktopAgentType.Failover:
                strategies = [];
                break;
            default:
                strategies = [
                    new DesktopAgentPreloadLoader(),
                    new PostMessageLoader()
                ];
        }
    } else {
        strategies = [
            new DesktopAgentPreloadLoader(),
            new PostMessageLoader()
        ];
    }

    const promises = strategies.map(s => s.get(options).then((selection) => {
        //cancel other strategies if we selected a DA
        Logger.log(`Strategy ${s.name} resolved - cleaning up other strategies`);
        strategies.forEach(s2 => {
            if(s2 !== s) {
                s2.cancel();
            }
        });
        return selection;
    }));

    Logger.debug("Waiting for discovery promises to settle...")
    return Promise.allSettled(promises)
    .then(async results => {
        //review results
        const daResult = results.find(isFulfilled);
        Logger.debug(`Discovery results: `, results);

        if (daResult) {
            
            const selection = daResult.value;
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
            Logger.log(`Desktop Agent located via discovery, appId: ${desktopAgentDetails.appId}, instanceId: ${desktopAgentDetails.instanceId}`);
            return selection.agent;
        } else {
            //if we received any error other than AgentError.AgentNotFound, throw it
            const errors = results.filter(isRejected);

            Logger.debug(`Discovery errors: ${JSON.stringify(errors)}`);
            const error = errors.find((aRejection) => {
                aRejection.reason?.message ?? aRejection.reason !== AgentError.AgentNotFound;
            });
            if (error){
                throw error;

            } else if (options.failover != undefined) {
                Logger.debug(`Calling failover fn...`);
                //Proceed with the failover
                try {
                    //TODO: consider adding a timeout for the failover, to avoid getting stuck here
                    //  However there is an argument to be made for hanging out in case the 
                    //  function eventually returns, e.g. after an external DA started up
                    
                    const failoverHandler = new FailoverHandler(options);
                    const selection = await failoverHandler.handleFailover();
    
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
                    Logger.log(`Desktop Agent located via failover, appId: ${desktopAgentDetails.appId}, instanceId: ${desktopAgentDetails.instanceId}`);
            
                    return selection.agent;
                } catch (e) {
                    Logger.error("Desktop agent not found. Error reported during failover", e);
                    throw e;
                }
            } else {
                //We didn't manage to find an agent.
                Logger.error("Desktop agent not found. No error reported during discovery.");
                throw new Error(AgentError.AgentNotFound);
            }
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
        timeoutMs: DEFAULT_TIMEOUT_MS,
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

    Logger.debug(`Got options: ${JSON.stringify(options)}`);

    if (!theAgentPromise) {
        theAgentPromise = initAgentPromise(options).then(handleSetWindowFdc3);
    }

    return theAgentPromise;
}

/**
 * Replaces the original fdc3Ready function from FDC3 2.0 with a new one that uses the 
 * new getAgent function.
 * 
 * @param waitForMs Amount of time to wait before failing the promise (20 seconds is the default).
 * @returns A DesktopAgent promise.
 */
export function fdc3Ready(waitForMs = DEFAULT_TIMEOUT_MS): Promise<DesktopAgent> {
    return getAgent({
        timeoutMs: waitForMs,
        dontSetWindowFdc3: false,
        channelSelector: true,
        intentResolver: true
    });
}