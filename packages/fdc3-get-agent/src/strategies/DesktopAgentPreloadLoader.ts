import { DesktopAgent, WebDesktopAgentType } from "@kite9/fdc3-standard";
import { GetAgentParams } from "@kite9/fdc3-standard";
import { DesktopAgentSelection, Loader } from "./Loader";

/**
 * This approach will resolve the loader promise if the fdc3Ready event occurs.
 * This is done by electron implementations setting window.fdc3.
 */
export class DesktopAgentPreloadLoader implements Loader {

    //TODO: listen for the fdc3Ready event. Polling should be a fallback not the default strategy

    done = false

    async poll(endTime: number, resolve: (value: DesktopAgentSelection | void) => void, reject: (reason?: any) => void) {
        const timeRemaining = endTime - Date.now()
        if (globalThis.window.fdc3 != null) {

            //retrieve appId from DA
            const implMetadata = await globalThis.window.fdc3.getInfo();

            const selection: DesktopAgentSelection = { 
                agent: globalThis.window.fdc3, 
                details: {
                    agentType: WebDesktopAgentType.Preload,
                    identityUrl: globalThis.window.location.href,
                    actualUrl: globalThis.window.location.href,
                    appId: implMetadata.appMetadata.appId,
                    instanceId: implMetadata.appMetadata.instanceId ?? "unknown",
                    instanceUuid: implMetadata.appMetadata.instanceId ?? "unknown" // TODO: preload DAs don't issue these so repeat the instanceId
                }
            };

            if (selection.details.instanceId === "unknown"){
                console.warn("The DesktopAgent did not return an instanceId in the app's metadata", implMetadata);
            }

            resolve(selection);
        } else if ((timeRemaining > 0) && (this.done == false)) {
            setTimeout(() => this.poll(endTime, resolve, reject), 100);
        } else {
            resolve();
        }
    }

    cancel(): void {
        this.done = true;
    }

    async get(params: GetAgentParams): Promise<DesktopAgentSelection | void> {
        return new Promise<DesktopAgentSelection | void>((resolve, reject) => {
            const endPollTime = Date.now() + (params.timeoutMs! + 500)
            // console.log("Starting poll: " + endPollTime + " " + params.timeout + " " + Date.now())
            this.poll(endPollTime, resolve, reject)
        });
    }
}

