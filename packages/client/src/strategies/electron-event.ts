import { DesktopAgent, fdc3Ready } from "@finos/fdc3";
import { Loader, Options } from "@kite9/fdc3-common";

/**
 * This approach will resolve the loader promise if the fdc3Ready event occurs.
 * This is done by electron implementations setting window.fdc3.
 */
const loader: Loader = (_options: Options) => {

    const out = new Promise<DesktopAgent>((resolve) => {
        fdc3Ready().then(() => {
            resolve(window.fdc3);
        })

    });

    return out;
}

export default loader;
