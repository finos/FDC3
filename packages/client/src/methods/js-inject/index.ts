import { DesktopAgent } from "@finos/fdc3";
import { APIResponseMessage, DesktopAgentDetails, Method, Options } from "../../../../packages/common/src";


/**
 * When writing an FDC3 implementation, this is the shape of the function
 * that should be returned by the DesktopAgent's supply url.
 */
export type FDC3Initialiser = (details: DesktopAgentDetails, options: Options) => DesktopAgent

/**
 * This loads the script using an import
 */
const method : Method = function(data: APIResponseMessage, options: Options) : Promise<DesktopAgent> {
    return import(/* @vite-ignore */ data.details.url as string).then(ns => {
        const init = ns.default as FDC3Initialiser;
        const da = init(data.details, options);
        return da;
    })
}

export default method;