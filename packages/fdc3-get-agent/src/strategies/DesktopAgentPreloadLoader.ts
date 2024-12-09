import { AgentError, DEFAULT_TIMEOUT_MS, DesktopAgent, WebDesktopAgentType } from "@kite9/fdc3-standard";
import { GetAgentParams } from "@kite9/fdc3-standard";
import { DesktopAgentSelection, Loader } from "./Loader";
import { Logger } from "../util/Logger";

/**
 * This approach will resolve the loader promise if the fdc3Ready event occurs.
 * This is done by Desktop Agent Preload implementations setting window.fdc3.
 */
export class DesktopAgentPreloadLoader implements Loader {
    
    name = "DesktopAgentPreloadLoader";

    /** Reference to the handler for the fdc3Ready event (used to remove it) */
    readyEventHandler: (() => void) | null = null;
    /** Variable used to end polling */
    done: boolean = false;
    /** Overall timeout */
    timeout: NodeJS.Timeout | null = null;
    /** Timeout used in polling */
    pollingTimeout: NodeJS.Timeout | null = null;
    
    /** Reference to the get fn's Promise's reject call - used when cancelling. */
    rejectFn: ((reason?: string) => void) | null  = null;

    async poll(resolve: (value: DesktopAgentSelection) => void) {    
        if (!this.done) {
            if (globalThis.window.fdc3) {
                Logger.debug(`DesktopAgentPreloadLoader.get(): Discovered DA through polling...`);
                this.prepareSelection(globalThis.window.fdc3, resolve);
            } else {
                this.pollingTimeout = setTimeout(() => this.poll(resolve), 100);
            }
        }
    }

    async prepareSelection(fdc3: DesktopAgent, resolve: (value: DesktopAgentSelection) => void) {
        Logger.debug("DesktopAgentPreloadLoader: Preparing selection")
        
        //note that we've found an agent and will be settling our get promise
        this.rejectFn = null;
        //stop polling and listening for fdc3Ready
        this.cancel();

        //retrieve appId from DA
        const implMetadata = await fdc3.getInfo();
        const selection: DesktopAgentSelection = { 
            agent: fdc3, 
            details: {
                agentType: WebDesktopAgentType.Preload,
                identityUrl: globalThis.window.location.href,
                actualUrl: globalThis.window.location.href,
                appId: implMetadata.appMetadata.appId,
                instanceId: implMetadata.appMetadata.instanceId ?? "unknown",
                instanceUuid: implMetadata.appMetadata.instanceId ?? "unknown" // preload DAs don't issue these so repeat the instanceId
            }
        };

        resolve(selection);
    }

    get(options: GetAgentParams): Promise<DesktopAgentSelection> {
        Logger.debug(`DesktopAgentPreloadLoader.get(): Initiating search for Desktop Agent Preload`);
        return new Promise<DesktopAgentSelection>((resolve, reject) => {
            //save reject fn in case we get cancelled
            this.rejectFn = reject;

            //do an initial check
            if (globalThis.window.fdc3) {
                this.prepareSelection(globalThis.window.fdc3, resolve);
            } else {
                //setup a timeout so that we can reject if don't find anything
                const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
                this.timeout = setTimeout(() => {
                    Logger.debug(`DesktopAgentPreloadLoader.get(): timeout (${timeoutMs} ms) at ${new Date().toISOString()}`);
                    reject(AgentError.AgentNotFound);
                    this.cancel();
                }, timeoutMs);
                
                //listen for the fdc3Ready event
                this.readyEventHandler = () => {
                    Logger.debug(`DesktopAgentPreloadLoader.get(): discovered DA through fdc3Ready event`);
                    if (globalThis.window.fdc3) {
                        this.prepareSelection(globalThis.window.fdc3, resolve);
                    }
                };
                globalThis.window.addEventListener('fdc3Ready',this.readyEventHandler);

                //also do polling (just in case)
                this.poll(resolve);
            }
        });
    }

    async cancel(): Promise<void> {
        Logger.debug("DesktopAgentPreloadLoader: Cleaning up");
        this.done = true;
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        if(this.pollingTimeout){
            clearTimeout(this.pollingTimeout);
        }
        if (this.readyEventHandler) {
            globalThis.window.removeEventListener('fdc3Ready', this.readyEventHandler);
        }
        if (this.rejectFn){
            this.rejectFn(AgentError.AgentNotFound);
            this.rejectFn = null;
        }
    }
}

