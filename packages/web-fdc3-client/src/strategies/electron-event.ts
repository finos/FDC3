import { DesktopAgent } from "@finos/fdc3";
import { fdc3Ready } from "@finos/fdc3";
import { Loader, Options } from "@finos/web-fdc3-common/src";

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
