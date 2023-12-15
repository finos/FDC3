import { DesktopAgent } from '@finos/fdc3'
import { APIResponseMessage, Loader, Options, FDC3_API_RESPONSE_MESSAGE_TYPE, FDC3_API_REQUEST_MESSAGE_TYPE } from 'fdc3-common'
import { messagePortIFrameInit, messagePortInit } from '../messaging/message-port';

const loader: Loader = (options: Options) => {

    const out = new Promise<DesktopAgent>((resolve, reject) => {
        // setup listener for message and retrieve JS URL from it
        window.addEventListener("message", (event) => {
            const data: APIResponseMessage = event.data;
            if ((data.type == FDC3_API_RESPONSE_MESSAGE_TYPE) && (data.method == 'message-port')) {
                if (event.ports.length == 1) {
                    resolve(messagePortInit(event.ports[0], data));
                } else if (data.uri) {
                    resolve(messagePortIFrameInit(data, options))
                }
            }
            
            // need either a port or a uri
            reject("Incorrect API Response Message: "+JSON.stringify(data));
        }, { once: true });
    });
    
    const da = options.frame;

    if (da != null) {
        const requestMessage = {
            type: FDC3_API_REQUEST_MESSAGE_TYPE,
            methods: ['post-message']
        }

        da.postMessage(requestMessage, "*");
    }

    return out;
}

export default loader;