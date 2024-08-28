import { DesktopAgent } from "@finos/fdc3";
import { GetAgentParams } from "@kite9/fdc3-common";
import { Loader } from "./Loader";



/**
 * This approach will resolve the loader promise if the fdc3Ready event occurs.
 * This is done by electron implementations setting window.fdc3.
 */
class ElectronEventLoader implements Loader {

    done = false

    poll(endTime: number, resolve: (value: DesktopAgent | Error) => void, reject: (reason?: any) => void) {
        const timeRemaining = endTime - Date.now()
        if (globalThis.window.fdc3 != null) {
            resolve(globalThis.window.fdc3)
        } else if ((timeRemaining > 0) && (this.done == false)) {
            setTimeout(() => this.poll(endTime, resolve, reject), 100);
        } else {
            resolve(new Error('timeout'));
        }
    }

    cancel(): void {
        this.done = true;
    }

    get(params: GetAgentParams): Promise<DesktopAgent | Error> {
        return new Promise<DesktopAgent | Error>((resolve, reject) => {
            const endPollTime = Date.now() + (params.timeout + 500)
            console.log("Starting poll: " + endPollTime + " " + params.timeout + " " + new Date())
            this.poll(endPollTime, resolve, reject)
        });
    }
}



export default new ElectronEventLoader();
