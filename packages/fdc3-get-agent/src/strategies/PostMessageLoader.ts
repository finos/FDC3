import { DesktopAgent, GetAgentParams } from '@kite9/fdc3-standard'
import { createDesktopAgentAPI } from '../messaging/message-port';
import { v4 as uuidv4 } from "uuid"
import { ConnectionDetails } from '../messaging/MessagePortMessaging';
import { Loader } from './Loader';
import { BrowserTypes } from "@kite9/fdc3-schema";
import { FDC3_VERSION } from '../Fdc3Version';


type WebConnectionProtocol1Hello = BrowserTypes.WebConnectionProtocol1Hello
type WebConnectionProtocol2LoadURL = BrowserTypes.WebConnectionProtocol2LoadURL
type WebConnectionProtocol3Handshake = BrowserTypes.WebConnectionProtocol3Handshake

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
            identityUrl: options.identityUrl!!,
            actualUrl: globalThis.window.location.href
        }
    }

    w.postMessage(requestMessage, { targetOrigin: origin });
}

/**
 * The desktop agent requests that the client opens a URL in order to provide a message port.
 */
function openFrame(url: string): Window {
    const IFRAME_ID = "fdc3-communications-embedded-iframe"

    // remove an old one if it's there
    const existing = document.getElementById(IFRAME_ID)
    if (existing) {
        existing.remove()
    }

    // create a new one
    var ifrm = document.createElement("iframe")
    ifrm.setAttribute("src", url)
    ifrm.setAttribute("id", IFRAME_ID)
    ifrm.setAttribute("name", "FDC3 Communications")
    ifrm.style.width = "0px"
    ifrm.style.height = "0px"
    ifrm.style.border = "0"
    ifrm.style.position = "fixed"
    document.body.appendChild(ifrm)
    return ifrm.contentWindow!!
}

export function helloExchange(options: GetAgentParams, connectionAttemptUuid: string): Promise<ConnectionDetails> {

    return new Promise<ConnectionDetails>((resolve, _reject) => {
        // setup listener for message and retrieve JS URL from it
        const el = (event: MessageEvent) => {
            const data = event.data;
            if (data?.meta?.connectionAttemptUuid == connectionAttemptUuid) {
                if (data.type == 'WCP2LoadUrl') {
                    // in this case, we need to load the URL with the embedded Iframe
                    openFrame((data as WebConnectionProtocol2LoadURL).payload.iframeUrl);
                } else if (data.type == 'WCP3Handshake') {
                    resolve({
                        connectionAttemptUuid: connectionAttemptUuid,
                        handshake: data,
                        messagePort: event.ports[0],
                        options: options,
                        actualUrl: globalThis.window.location.href
                    })
                }
            }
        }

        globalThis.window.addEventListener("message", el)
    });

}

/**
 * This is a variation of the PostMessageLoader used for handling failover.  If the failover returns the WindowProxy this is used 
 * to properly load the desktop agent.
 */
export function handleWindowProxy(options: GetAgentParams, provider: () => Promise<WindowProxy | DesktopAgent>): Promise<DesktopAgent> {
    return new Promise<DesktopAgent>((resolve, _reject) => {
        const el = (event: MessageEvent) => {
            const data = event.data;
            if (data.type == 'WCP3Handshake') {
                const handshake = data as WebConnectionProtocol3Handshake;
                globalThis.window.removeEventListener("message", el)

                resolve(createDesktopAgentAPI({
                    connectionAttemptUuid: handshake.meta.connectionAttemptUuid,
                    handshake: data,
                    messagePort: event.ports[0],
                    options: options,
                    actualUrl: globalThis.window.location.href
                }))
            }
        }

        globalThis.window.addEventListener("message", el)

        provider().then((providerResult) => {
            if ((providerResult as any).getInfo) {
                globalThis.window.removeEventListener("message", el)
                resolve(providerResult as DesktopAgent)
            }
        })
    })
}


export class PostMessageLoader implements Loader {

    connectionAttemptUuid = uuidv4();

    async get(options: GetAgentParams): Promise<DesktopAgent | void> {
        const targets: Window[] = []
        collectPossibleTargets(globalThis.window, targets);

        // ok, begin the process
        const promise = helloExchange(options, this.connectionAttemptUuid)

        // use of '*': See https://github.com/finos/FDC3/issues/1316
        targets.forEach((t) => sendWCP1Hello(t, options, this.connectionAttemptUuid, "*"))

        // wait for one of the windows to return the data we need
        const data = await promise
        return createDesktopAgentAPI(data);
    }

    cancel(): void {

    }


}
