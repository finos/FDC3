import { Loader, GetAgentParams, WebConnectionProtocol1Hello, WebConnectionProtocol2LoadURL, WebConnectionProtocol3HandshakePayload, WebConnectionProtocol5ValidateAppIdentitySuccessResponsePayload, DesktopAgentDetails } from '@kite9/fdc3-common'
import { FDC3_VERSION } from '..';
import { createDesktopAgentAPI } from '../messaging/message-port';
import { v4 as uuidv4 } from "uuid"

const DESKTOP_AGENT_SESSION_DETAILS_KEY = "fdc3-desktop-agent-details"


function collectPossibleTargets(w: Window): Window[] {
    return [
        w.opener,
        collectPossibleTargets(w.parent),
    ].filter((w) => w != null);
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

/**
 * Sends the validate message to w
 */
function sendWCP4Validate(w: MessageEventSource, options: GetAgentParams, connectionAttemptUuid: string, origin: string) {
    var instanceUuid = null
    const detailsStr: string | null = globalThis.sessionStorage.getItem(DESKTOP_AGENT_SESSION_DETAILS_KEY)
    if (detailsStr) {
        const details = JSON.parse(detailsStr) as DesktopAgentDetails
        instanceUuid = details.instanceUuid
    }

    const requestMessage = {
        type: 'WCP4ValidateAppIdentity',
        meta: {
            connectionAttemptUuid: connectionAttemptUuid,
            timestamp: new Date()
        },
        payload: {
            identityUrl: options.identityUrl!!,
            instanceUuid
        } as any /* ISSUE: 1301 */
    }

    w.postMessage(requestMessage, { targetOrigin: origin });
}

function storeSesssionDetails(data: ConnectionDetails) {
    const details: DesktopAgentDetails = {
        agentType: 'PROXY_PARENT',
        instanceUuid: data.identity?.instanceUuid,
        appId: data.identity?.appId,
        instanceId: data.identity?.instanceId,
    }

    globalThis.sessionStorage.setItem(DESKTOP_AGENT_SESSION_DETAILS_KEY, JSON.stringify(details))
}

type ConnectionDetails = {
    connectionAttemptUuid: string
    handshake?: WebConnectionProtocol3HandshakePayload,
    identity?: WebConnectionProtocol5ValidateAppIdentitySuccessResponsePayload
    messagePort?: MessagePort
}


function helloExchange(options: GetAgentParams, connectionAttemptUuid: string): Promise<ConnectionDetails> {


    return new Promise<ConnectionDetails>((resolve, _reject) => {

        const returnData: ConnectionDetails = {
            connectionAttemptUuid: connectionAttemptUuid,
        }

        // setup listener for message and retrieve JS URL from it
        const el = (event: MessageEvent) => {
            const data = event.data;
            if (data.meta.connectionAttemptUuid == connectionAttemptUuid) {
                if (data.type == 'WCP2LoadUrl') {
                    // in this case, we need to load the URL with the embedded Iframe
                    openFrame((data as WebConnectionProtocol2LoadURL).payload.iframeUrl);
                } else if (data.type == 'WCP3Handshake') {
                    returnData.handshake = data.payload;
                    sendWCP4Validate(event.source!!, options, connectionAttemptUuid, event.origin);
                } else if (data.type == 'WCP5ValidateAppIdentitySuccessResponse') {
                    globalThis.window.removeEventListener("message", el);
                    returnData.identity = data.payload;
                    returnData.messagePort = event.ports[0];
                    storeSesssionDetails(returnData);
                    resolve(returnData);
                }
            }
        }

        globalThis.window.addEventListener("message", el)
    });

}


const loader: Loader = async (options: GetAgentParams) => {
    const connectionAttemptUuid = uuidv4();
    var resolved = false

    // timeout
    setTimeout(() => {
        if (!resolved) {
            throw new Error("Timeout waiting for connection");
        }
    }, options.timeout!!)

    // ok, begin the process
    const promise = helloExchange(options, connectionAttemptUuid)
    const targets = collectPossibleTargets(globalThis.window);
    targets.forEach((t) => sendWCP1Hello(t, options, connectionAttemptUuid, t.origin))

    // wait for one of the windows to return the data we need
    const data = await promise
    resolved = true
    return createDesktopAgentAPI(data.messagePort!!, data.handshake!!, data.identity!!);

}

export default loader;