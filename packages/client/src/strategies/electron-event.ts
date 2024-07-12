import { DesktopAgent } from "@finos/fdc3";
import { Loader, Options } from "@kite9/fdc3-common";

/**
 * This approach will resolve the loader promise if the fdc3Ready event occurs.
 * This is done by electron implementations setting window.fdc3.
 */
const loader: Loader = (options: Options) => {

    function poll(endTime: number, resolve: (value: DesktopAgent | PromiseLike<DesktopAgent>) => void, reject: (reason?: any) => void) {
        if (globalThis.window.fdc3 != null) {
            resolve(globalThis.window.fdc3)
        } else if (Date.now() < endTime) {
            setTimeout(() => poll(endTime, resolve, reject), 100);
        } else {
            reject(new Error('timeout'));
        }
    }

    const out = new Promise<DesktopAgent>((resolve, reject) => {
        poll(Date.now() + options.waitForMs!!, resolve, reject)
    });

    return out;
}

export default loader;
