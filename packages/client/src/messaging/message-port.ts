import { DesktopAgent } from "@finos/fdc3";
import { BasicDesktopAgent, DefaultChannelSupport, DefaultAppSupport, DefaultIntentSupport, DefaultChannel, DefaultHandshakeSupport } from "da-proxy";
import { APIResponseMessage, FDC3_PORT_TRANSFER_RESPONSE_TYPE, FDC3_PORT_TRANSFER_REQUEST_TYPE, Options, exchangeForMessagePort, exchange } from "fdc3-common"
import { MessagePortMessaging } from "./MessagePortMessaging";
import { DesktopAgentIntentResolver } from "../intent-resolution/DesktopAgentIntentResolver";

/**
 * Given a message port, constructs a desktop agent to communicate via that.
 */
export async function messagePortInit(mp: MessagePort, data: APIResponseMessage): Promise<DesktopAgent> {
    mp.start()

    const messaging = new MessagePortMessaging(mp, data.appIdentifier)
    const userChannelState = buildUserChannelState(messaging)

    const version = "2.0"
    const cs = new DefaultChannelSupport(messaging, userChannelState, null)
    const hs = new DefaultHandshakeSupport(messaging, [version], cs)
    const is = new DefaultIntentSupport(messaging, new DesktopAgentIntentResolver(messaging))
    const as = new DefaultAppSupport(messaging, data.appIdentifier, "WebFDC3")
    const da = new BasicDesktopAgent(hs, cs, is, as, version)
    return da
}

/**
 * Initialises the desktop agent by opening an iframe 
 * on the desktop agent host and communicating via a messsage port to it.
 * 
 * It is up to the desktop agent to arrange communucation between other
 * windows. 
 */
export async function messagePortIFrameInit(data: APIResponseMessage, options: Options): Promise<DesktopAgent> {

    const action = data.uri ? () => {
        return openFrame(data.uri!!);
    } : () => {
        return messageParentWindow(options.frame)
    }

    const mp = await exchangeForMessagePort(window, FDC3_PORT_TRANSFER_RESPONSE_TYPE, action) as MessagePort

    return messagePortInit(mp, data);
}

/**
 * If the desktop agent doesn't provide an opener URL, we message another iframe asking for the port.
 */
function messageParentWindow(w: Window | undefined) {
    if (w) {
        w.postMessage({
            type: FDC3_PORT_TRANSFER_REQUEST_TYPE,
            methods: 'post-message'
        });
    }
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

function buildUserChannelState(messaging: MessagePortMessaging) {
    // TODO: Figure out how to set initial user channels.  
    // Should probably be in the message from the server.
    return [
        new DefaultChannel(messaging, "one", "user", {
            color: "red",
            name: "THE RED CHANNEL"
        })
    ]
}