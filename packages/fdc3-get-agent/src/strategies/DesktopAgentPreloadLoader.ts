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

    /** Variable used to end polling */
    done: boolean = false;
    /** Reference to the handler for the fdc3Ready event (used to remove it) */
    readyEventHandler: (() => void) | null = null;
    /** Overall timeout */
    timeout: NodeJS.Timeout | null = null;
    
    /** Reference to the get fn's Promise's reject call - used when cancelling. */
    rejectFn: ((reason?: any) => void) | null  = null;

    async poll(resolve: (value: DesktopAgentSelection) => void) {    
        if (globalThis.window.fdc3) {
            Logger.debug(`DesktopAgentPreloadLoader.get(): Discovered DA through polling...`);
            this.prepareSelection(globalThis.window.fdc3, resolve);
        } else {
            if (!this.done) {
                setTimeout(() => this.poll(resolve), 100);
            }
        }
    }

    async prepareSelection(fdc3: DesktopAgent, resolve: (value: DesktopAgentSelection) => void) {
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

        if (selection.details.instanceId === "unknown"){
            Logger.warn("The DesktopAgent did not return an instanceId in the app's metadata", implMetadata);
        }
        
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

    cancel(): void {
        Logger.debug("DesktopAgentPreloadLoader: Cleaning up");
        this.done = true;
        if (this.rejectFn){
            this.rejectFn(new Error(AgentError.AgentNotFound));
            this.rejectFn = null;
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        if (this.readyEventHandler) {
            globalThis.window.removeEventListener('fdc3Ready', this.readyEventHandler);
        }
    }
}

