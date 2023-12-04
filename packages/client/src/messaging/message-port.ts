import { DesktopAgent } from "@finos/fdc3";
import { BasicDesktopAgent, DefaultChannelSupport, DefaultAppSupport, DefaultIntentSupport } from "da";
import { APIResponseMessage, FDC3_PORT_TRANSFER_REQUEST_TYPE, FDC3_PORT_TRANSFER_RESPONSE_TYPE } from "fdc3-common"
import { MessagePortMessaging } from "./MessagePortMessaging";

/**
 * Initialises the desktop agent by opening an iframe 
 * on the desktop agent host and communicating via a messsage port to it.
 * 
 * It is up to the desktop agent to arrange communucation between other
 * windows. 
 */
export async function messagePortInit(data: APIResponseMessage) : Promise<DesktopAgent> {

    // first, open the ifrma
    const window = openFrame(data.uri)

    // next, open a messagePort with the window.

    const myPort = await shareMessagePorts(window)
    const messaging = new MessagePortMessaging(myPort, data)
    const userChannelState = await messaging.getUserChannelState()

    return new BasicDesktopAgent(
        new DefaultChannelSupport(messaging, userChannelState, null),
        new DefaultIntentSupport(),
        new DefaultAppSupport(),
        data.fdc3Version,
        data.provider);
}

function openFrame(url: string) : Window {
    var ifrm = document.createElement("iframe")
    ifrm.setAttribute("src", url)
    ifrm.setAttribute("title", "FDC3 Communications")
    ifrm.style.width = "0px"
    ifrm.style.height = "0px"
    document.body.appendChild(ifrm)
    return ifrm.contentWindow!!
}

async function shareMessagePorts(w: Window) : Promise<MessagePort> {
    const channel = new MessageChannel()
    await exchange(w, FDC3_PORT_TRANSFER_REQUEST_TYPE, FDC3_PORT_TRANSFER_RESPONSE_TYPE, channel.port1)
    return channel.port2;
}

export function exchange(p: MessagePort | Window, fromType: any, toType: string, payload?: any) : Promise<any> {
    return new Promise((resolve, reject) => {
        const listener = (m: Event) => {
            if (m instanceof MessageEvent) {
                if (m.data.type == toType) {
                    resolve(m.data.payload);
                }
            }
        } 
        p.addEventListener("onmessage", listener)

        p.postMessage({
            type: fromType,
            payload
        });

        setTimeout(() => {
            p.removeEventListener("message", listener);
            reject(new Error(`Didn't receive response ${toType} after sending ${fromType}"`))
        }, 1000);
    })
}

