import { DesktopAgent } from "@finos/fdc3";
import { APIResponseMessage, FDC3Initialiser } from "../types";

/**
 * This loads the script using an import
 */
export function load(data: APIResponseMessage) : Promise<DesktopAgent> {
    return import(/* @vite-ignore */ data.url).then(ns => {
        const init = ns.default as FDC3Initialiser;
        const da = init(data.appIdentifier, data.daDetails);
        return da;
    })
}