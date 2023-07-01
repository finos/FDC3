import { DesktopAgent } from "@finos/fdc3";
import { APIResponseMessage, FDC3Initialiser } from "../types";

/**
 * This loads the script using an import
 */
export function load(resolve: (da: DesktopAgent) => void, data: APIResponseMessage) {
    import(data.url).then(ns => {
        const init = ns.default as FDC3Initialiser;
        const da = init(data.appIdentifier);
        resolve(da);
    })
}