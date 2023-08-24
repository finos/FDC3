import { DesktopAgent } from '@finos/fdc3'
import { APIResponseMessage, Loader, Options, Method, FDC3_API_RESPONSE_MESSAGE_TYPE, FDC3_API_REQUEST_MESSAGE_TYPE } from '../types'
import jsInject from '../methods/js-inject';
import postMessageProtocol from '../methods/post-message-protocol'

const METHOD_MAP : { [key: string] : Method }= {
    "js-inject" : jsInject,
    "post-message-protocol": postMessageProtocol
}

const loader: Loader = (options: Options) => {

    function handleOptions(da: DesktopAgent) {
        return da;
    }

    const out = new Promise<DesktopAgent>((resolve, reject) => {
        // setup listener for message and retrieve JS URL from it
        window.addEventListener("message", (event) => {
            const data: APIResponseMessage = event.data;
            if (data.type == FDC3_API_RESPONSE_MESSAGE_TYPE) {
                const method = METHOD_MAP[data.method];
                method(data)
                    .then(da => handleOptions(da))
                    .then(da => resolve(da))
            } else {
                reject("Incorrect API Response Message");
            }
        }, { once: true });
    });

    const da = window.opener ?? window.parent;

    if (da != null) {
        const requestMessage = {
            type: FDC3_API_REQUEST_MESSAGE_TYPE,
            methods: options.methods
        }

        da.postMessage(requestMessage, "*");
    }

    return out;
}

export default loader;