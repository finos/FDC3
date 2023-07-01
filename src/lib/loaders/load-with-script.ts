import { DesktopAgent } from "@finos/fdc3";
import { APIResponseMessage } from "../types";

/**
 * This loads the script using a script tag, which is meh.
 */
export function load(resolve: (da: DesktopAgent) => void, data: APIResponseMessage) {
    const script = document.createElement('script');
    script.onload = function () {
        console.log(`FDC3 API Initialised ${JSON.stringify(data)}`);
        resolve(window.fdc3);
        document.head.removeChild(script);
    };
    script.src=data.url;
    document.head.appendChild(script);
}
