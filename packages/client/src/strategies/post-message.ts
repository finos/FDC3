import { DesktopAgent } from '@finos/fdc3'
import { APIResponseMessage, Loader, Options, FDC3_API_RESPONSE_MESSAGE_TYPE, FDC3_API_REQUEST_MESSAGE_TYPE } from '@kite9/fdc3-common'
import { messagePortInit } from '../messaging/message-port';

const loader: Loader = (options: Options) => {

    const out = new Promise<DesktopAgent>((resolve, reject) => {
        // setup listener for message and retrieve JS URL from it
        const el = (event: MessageEvent) => {
            const data: APIResponseMessage = event.data;
            if (data.type == FDC3_API_RESPONSE_MESSAGE_TYPE) {
                globalThis.window.removeEventListener("message", el);
                if (data.method == 'message-port') {
                    return resolve(messagePortInit(event, options));
                } else {
                    // need either a port or a uri
                    return reject("Incorrect API Response Message: " + JSON.stringify(data));
                }
            }
        }

        globalThis.window.addEventListener("message", el)
    });

    const da = options.frame;

    if (da != null) {
        const requestMessage = {
            type: FDC3_API_REQUEST_MESSAGE_TYPE,
            methods: ['post-message']
        }

        da.postMessage(requestMessage, da.location.origin);
    }

    return out;
}

export default loader;