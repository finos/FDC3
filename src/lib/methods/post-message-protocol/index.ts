import { DesktopAgent } from "@finos/fdc3";
import { APIResponseMessage, Method } from "../../types";

const method : Method = (r: APIResponseMessage) => {

    return new Promise<DesktopAgent>((resolve, _reject) => {
        resolve('s' as any as DesktopAgent)
    });
}

export default method;