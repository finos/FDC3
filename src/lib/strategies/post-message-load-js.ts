import { DesktopAgent } from '@finos/fdc3'
import { APIResponseMessage, AppChecker, DesktopAgentDetailResolver, Loader, Options, Supplier } from '../types'
import { loadJS } from '../loaders/load-with-import';

const FDC3_API_REQUEST_MESSAGE_TYPE = 'FDC3-API-Request';
const FDC3_API_RESPONSE_MESSAGE_TYPE = 'FDC3-API-Response';


export const supplier: Supplier = (url: string, checker: AppChecker, detailsResolver: DesktopAgentDetailResolver) => {
    function createResponseMessage(source: Window): APIResponseMessage {
        return {
            type: FDC3_API_RESPONSE_MESSAGE_TYPE,
            url,
            details: detailsResolver(source)
        }
    }

    window.addEventListener(
        "message",
        (event) => {
            console.log("Received: " + JSON.stringify(event));
            const data = event.data;
            if (data == FDC3_API_REQUEST_MESSAGE_TYPE) {
                const origin = event.origin;
                const source = event.source as Window
                if (checker(source)) {
                    console.log(`API Request Origin:  ${origin}`);
                    source.postMessage(createResponseMessage(source), origin);
                }
            }
        });
}



export const loader: Loader = (_options: Options) => {

    function handleOptions(da: DesktopAgent) {
        return da;
    }

    const out = new Promise<DesktopAgent>((resolve, reject) => {
        // setup listener for message and retrieve JS URL from it
        window.addEventListener("message", (event) => {
            const data: APIResponseMessage = event.data;
            if (data.type == FDC3_API_RESPONSE_MESSAGE_TYPE) {
                loadJS(data)
                    .then(da => handleOptions(da))
                    .then(da => resolve(da))
            } else {
                reject("Incorrect API Response Message");
            }
        }, { once: true });
    });

    const da = window.opener ?? window.parent;

    if (da != null) {
        da.postMessage(FDC3_API_REQUEST_MESSAGE_TYPE, "*");
    }

    return out;
}
