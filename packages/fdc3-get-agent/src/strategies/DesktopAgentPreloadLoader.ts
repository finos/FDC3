import { AgentError, DEFAULT_TIMEOUT_MS, DesktopAgent, WebDesktopAgentType } from "@kite9/fdc3-standard";
import { GetAgentParams } from "@kite9/fdc3-standard";
import { DesktopAgentSelection, Loader } from "./Loader";

/**
 * This approach will resolve the loader promise if the fdc3Ready event occurs.
 * This is done by Desktop Agent Preload implementations setting window.fdc3.
 */
export class DesktopAgentPreloadLoader implements Loader {
    
    /** Variable used to end polling */
    done: boolean = false;
    /** Reference to the handler for the fdc3Ready event (used to remove it) */
    readyEventHandler: (() => void) | null = null;
    /** Overall timeout */
    timeout: NodeJS.Timeout | null = null;

    async poll(resolve: (value: DesktopAgentSelection) => void) {    
        if (globalThis.window.fdc3) {
            this.prepareSelection(globalThis.window.fdc3, resolve);
        } else {
            if (!this.done) {
                setTimeout(() => this.poll(resolve), 100);
            }
        }
    }

    async prepareSelection(fdc3: DesktopAgent, resolve: (value: DesktopAgentSelection) => void) {
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
            console.warn("The DesktopAgent did not return an instanceId in the app's metadata", implMetadata);
        }
        
        resolve(selection);
    }

    get(options: GetAgentParams): Promise<DesktopAgentSelection> {
        return new Promise<DesktopAgentSelection>((resolve, reject) => {
            //do an initial check
            if (globalThis.window.fdc3) {
                this.prepareSelection(globalThis.window.fdc3, resolve);
            } else {
                //setup a timeout so that we can reject if don't find anything
                this.timeout = setTimeout(() => {
                    reject(new Error(AgentError.AgentNotFound));
                }, options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
                
                //listen for the fdc3Ready event
                this.readyEventHandler = () => {
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
        this.done = true;
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        if (this.readyEventHandler) {
            globalThis.window.removeEventListener('fdc3Ready', this.readyEventHandler);
        }
    }
}

