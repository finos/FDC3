import { Loader, GetAgentParams, WebConnectionProtocol1Hello, WebConnectionProtocol2LoadURL } from '@kite9/fdc3-common'
import { FDC3_VERSION } from '..';
import { createDesktopAgentAPI } from '../messaging/message-port';
import { v4 as uuidv4 } from "uuid"
import { ConnectionDetails } from '../messaging/MessagePortMessaging';

function collectPossibleTargets(w: Window, found: Window[]) {
    if (w) {
        if (found.indexOf(w) == -1) {
            found.push(w);
        }

        if (found.indexOf(w.opener) == -1) {
            collectPossibleTargets(w.opener, found);
        }

        if (found.indexOf(w.parent) == -1) {
            collectPossibleTargets(w.parent, found);
        }
    }
}


/**
 * Starts the connection process off by sending a hello message
 */
function sendWCP1Hello(w: MessageEventSource, options: GetAgentParams, connectionAttemptUuid: string, origin: string) {
    const requestMessage: WebConnectionProtocol1Hello = {
        type: 'WCP1Hello',
        meta: {
            connectionAttemptUuid: connectionAttemptUuid,
            timestamp: new Date()
        },
        payload: {
            channelSelector: options.channelSelector,
            fdc3Version: FDC3_VERSION,
            resolver: options.intentResolver,
            identityUrl: options.identityUrl!!
        }
    }

    w.postMessage(requestMessage, { targetOrigin: origin });
}


/**
 * The desktop agent requests that the client opens a URL in order to provide a message port.
 */
function openFrame(url: string): Window {
    var ifrm = document.createElement("iframe")
    ifrm.setAttribute("src", url)
    ifrm.setAttribute("name", "FDC3 Communications")
    ifrm.style.width = "0px"
    ifrm.style.height = "0px"
    document.body.appendChild(ifrm)
    return ifrm.contentWindow!!
}

function helloExchange(options: GetAgentParams, connectionAttemptUuid: string): Promise<ConnectionDetails> {

    return new Promise<ConnectionDetails>((resolve, _reject) => {
        // setup listener for message and retrieve JS URL from it
        const el = (event: MessageEvent) => {
            const data = event.data;
            if (data.meta.connectionAttemptUuid == connectionAttemptUuid) {
                if (data.type == 'WCP2LoadUrl') {
                    // in this case, we need to load the URL with the embedded Iframe
                    openFrame((data as WebConnectionProtocol2LoadURL).payload.iframeUrl);
                } else if (data.type == 'WCP3Handshake') {
                    resolve({
                        connectionAttemptUuid: connectionAttemptUuid,
                        handshake: data,
                        messagePort: event.ports[0],
                        options: options
                    })
                }
            }
        }

        globalThis.window.addEventListener("message", el)
    });

}


const loader: Loader = async (options: GetAgentParams) => {
    const connectionAttemptUuid = uuidv4();

    // ok, begin the process
    const promise = helloExchange(options, connectionAttemptUuid)

    const targets: Window[] = []
    collectPossibleTargets(globalThis.window, targets);
    targets.forEach((t) => sendWCP1Hello(t, options, connectionAttemptUuid, t.origin))

    // wait for one of the windows to return the data we need
    const data = await promise
    return createDesktopAgentAPI(data);

}

export default loader;