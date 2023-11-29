import { DesktopAgent } from "@finos/fdc3";
import { APIResponseMessage, Method, Options } from "../../../../packages/common/src";
import { PostMessageDesktopAgent } from "./PostMessageDesktopAgent";

const method : Method = (r: APIResponseMessage, options: Options) => {

    return new Promise<DesktopAgent>((resolve, _reject) => {
        // nasty bit of casting to avoid the problem we've only implemented 3 methods.
        resolve(new PostMessageDesktopAgent(r.details, options) as any as DesktopAgent)
    });
}

export default method;