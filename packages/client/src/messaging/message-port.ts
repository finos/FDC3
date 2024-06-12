import { DesktopAgent } from "@finos/fdc3";
import { BasicDesktopAgent, DefaultChannelSupport, DefaultAppSupport, DefaultIntentSupport, DefaultChannel, DefaultHandshakeSupport } from "@kite9/da-proxy";
import { APIResponseMessage, FDC3_PORT_TRANSFER_RESPONSE_TYPE, Options, exchangeForMessagePort, APIResponseMessageIFrame } from "@kite9/fdc3-common"
import { MessagePortMessaging } from "./MessagePortMessaging";
import { DefaultDesktopAgentIntentResolver } from "../intent-resolution/DefaultDesktopAgentIntentResolver";
import { DefaultDesktopAgentChannelSelector } from "../channel-selector/DefaultDesktopAgentChannelSelector";

/**
 * Given a message port, constructs a desktop agent to communicate via that.
 */
export async function createDesktopAgentAPI(mp: MessagePort, data: APIResponseMessage, options: Options): Promise<DesktopAgent> {
    mp.start()

    const messaging = new MessagePortMessaging(mp, data.appIdentifier)

    const intentResolver = options.intentResolver ?? new DefaultDesktopAgentIntentResolver(messaging, data.intentResolver)
    const channelSelector = options.channelSelector ?? new DefaultDesktopAgentChannelSelector(messaging, data.channelSelector)
    const userChannelState = buildUserChannelState(messaging)

    const version = "2.0"
    const cs = new DefaultChannelSupport(messaging, userChannelState, null, channelSelector)
    const hs = new DefaultHandshakeSupport(messaging, [version], cs)
    const is = new DefaultIntentSupport(messaging, intentResolver)
    const as = new DefaultAppSupport(messaging, data.appIdentifier, "WebFDC3")
    const da = new BasicDesktopAgent(hs, cs, is, as, version)
    await da.connect()
    return da
}

/**
 * Initialises the desktop agent by opening an iframe or talking to the parent window.
 * on the desktop agent host and communicating via a messsage port to it.
 * 
 * It is up to the desktop agent to arrange communucation between other
 * windows. 
 */
export async function messagePortInit(event: MessageEvent, options: Options): Promise<DesktopAgent> {

    if (event.ports[0]) {
        return createDesktopAgentAPI(event.ports[0], event.data, options);
    } else if ((event.data as APIResponseMessageIFrame).uri) {
        const action = () => {
            const iframeData = event.data as APIResponseMessageIFrame
            return openFrame(iframeData.uri +
                "?source=" + encodeURIComponent(JSON.stringify(iframeData.appIdentifier)) +
                "&desktopAgentId=" + encodeURIComponent(iframeData.desktopAgentId));
        }

        const mp = await exchangeForMessagePort(window, FDC3_PORT_TRANSFER_RESPONSE_TYPE, action) as MessagePort
        return createDesktopAgentAPI(mp, event.data, options);

    } else {
        throw new Error(`Couldn't initialise message port with ${JSON.stringify(event)}`)
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
        }),
        new DefaultChannel(messaging, "two", "user", {
            color: "blue",
            name: "THE BLUE CHANNEL"
        }), new DefaultChannel(messaging, "two", "user", {
            color: "green",
            name: "THE GREEN CHANNEL"
        })
    ]
}