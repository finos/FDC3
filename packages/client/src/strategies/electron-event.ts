import { DesktopAgent } from "@finos/fdc3";
import { Loader, GetAgentParams } from "@kite9/fdc3-common";


function poll(endTime: number, resolve: (value: DesktopAgent | PromiseLike<DesktopAgent>) => void, reject: (reason?: any) => void) {
    const timeRemaining = endTime - Date.now()
    if (globalThis.window.fdc3 != null) {
        resolve(globalThis.window.fdc3)
    } else if (timeRemaining > 0) {
        setTimeout(() => poll(endTime, resolve, reject), 100);
    } else {
        reject(new Error('timeout'));
    }
}

/**
 * This approach will resolve the loader promise if the fdc3Ready event occurs.
 * This is done by electron implementations setting window.fdc3.
 */
const loader: Loader = (options: GetAgentParams) => {

    const out = new Promise<DesktopAgent>((resolve, reject) => {
        const endPollTime = Date.now() + options.timeout!!
        console.log("Starting poll: " + endPollTime + " " + options.timeout + " " + new Date())
        poll(endPollTime, resolve, reject)
    });

    return out;
}

export default loader;
