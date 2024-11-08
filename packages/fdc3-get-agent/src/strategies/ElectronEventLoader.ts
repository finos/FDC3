import { DesktopAgent } from "@kite9/fdc3-standard";
import { GetAgentParams } from "@kite9/fdc3-standard";
import { Loader } from "./Loader";

/**
 * This approach will resolve the loader promise if the fdc3Ready event occurs.
 * This is done by electron implementations setting window.fdc3.
 */
export class ElectronEventLoader implements Loader {

    done = false

    poll(endTime: number, resolve: (value: DesktopAgent | void) => void, reject: (reason?: any) => void) {
        const timeRemaining = endTime - Date.now()
        if (globalThis.window.fdc3 != null) {
            resolve(globalThis.window.fdc3)
        } else if ((timeRemaining > 0) && (this.done == false)) {
            setTimeout(() => this.poll(endTime, resolve, reject), 100);
        } else {
            resolve();
        }
    }

    cancel(): void {
        this.done = true;
    }

    get(params: GetAgentParams): Promise<DesktopAgent | void> {
        return new Promise<DesktopAgent | void>((resolve, reject) => {
            const endPollTime = Date.now() + (params.timeoutMs!! + 500)
            this.poll(endPollTime, resolve, reject)
        });
    }
}

