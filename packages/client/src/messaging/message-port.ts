import { Context, DesktopAgent } from "@finos/fdc3";
import { BasicDesktopAgent, DefaultChannelSupport, DefaultAppSupport, DefaultIntentSupport, DefaultChannel } from "da";
import { APIResponseMessage, FDC3_PORT_TRANSFER_RESPONSE_TYPE, FDC3_PORT_TRANSFER_REQUEST_TYPE, Options, exchangeForMessagePort, exchange } from "fdc3-common"
import { MessagePortMessaging } from "./MessagePortMessaging";
import { ConnectionStep2Hello, ConnectionStep3Handshake } from "@finos/fdc3/dist/bridging/BridgingTypes";

/**
 * Initialises the desktop agent by opening an iframe 
 * on the desktop agent host and communicating via a messsage port to it.
 * 
 * It is up to the desktop agent to arrange communucation between other
 * windows. 
 */
export async function messagePortInit(data: APIResponseMessage, options: Options) : Promise<DesktopAgent> {
    
    const action = data.uri ? () => {
        return openFrame(data.uri!!);
    } : () => {
        return messageParentWindow(options.frame)
    }

    const mp = await exchangeForMessagePort(window, FDC3_PORT_TRANSFER_RESPONSE_TYPE, action) as MessagePort
    mp.start()

    const handshakeData = (await exchange(mp, "handshake", () => sendHello(mp, data))).data as ConnectionStep3Handshake
    const messaging = new MessagePortMessaging(mp, data.appIdentifier)
    const channelState = handshakeData.payload.channelsState
    const userChannelState = buildUserChannelState(messaging, channelState) 

    return new BasicDesktopAgent(
        new DefaultChannelSupport(messaging, userChannelState, null),
        new DefaultIntentSupport(),
        new DefaultAppSupport(),
        data.fdc3Version,
        data.provider);
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
function openFrame(url: string) : Window {
    var ifrm = document.createElement("iframe")
    ifrm.setAttribute("src", url)
    ifrm.setAttribute("title", "FDC3 Communications")
    ifrm.style.width = "0px"
    ifrm.style.height = "0px"
    document.body.appendChild(ifrm)
    return ifrm.contentWindow!!
}

function sendHello(mp: MessagePort, data: APIResponseMessage) {
    const hello : ConnectionStep2Hello = {
        type: "hello",
        payload: {
            desktopAgentBridgeVersion: data.desktopAgentBridgeVersion,
            supportedFDC3Versions: data.supportedFDC3Versions,
            authRequired: data.authRequired,
            authToken: data.authToken
        },
        meta: {
            timestamp: new Date()
        }
    }
    mp.postMessage(hello);
}

function buildUserChannelState(messaging: MessagePortMessaging, _channelState: Record<string, Context[]>) {
    return [
        new DefaultChannel(messaging, "one", "user", {
            color: "red",
            name: "THE RED CHANNEL"
        })
    ]
}