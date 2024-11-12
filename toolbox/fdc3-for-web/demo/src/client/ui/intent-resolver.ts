import { AppIdentifier } from "@kite9/fdc3-standard";
import { BrowserTypes } from "@kite9/fdc3-schema";

type IframeResolveAction = BrowserTypes.Fdc3UserInterfaceResolveAction
type IframeResolvePayload = BrowserTypes.Fdc3UserInterfaceResolvePayload
type IframeRestyle = BrowserTypes.Fdc3UserInterfaceRestyle
type IframeHello = BrowserTypes.Fdc3UserInterfaceHello

const DEFAULT_COLLAPSED_CSS = {
    position: "fixed",
    'z-index': 1000,
    right: "0",
    bottom: "0",
    width: "0",
    height: "0"
}

const DEFAULT_EXPANDED_CSS = {
    position: "fixed",
    'z-index': 1000,
    left: "10%",
    top: "10%",
    right: "10%",
    bottom: "10%"
}
window.addEventListener("load", () => {

    const parent = window.parent;

    const mc = new MessageChannel();
    const myPort = mc.port1
    myPort.start()

    const list = document.getElementById("intent-list")!!

    // ISSUE: 1302
    const helloMessage: IframeHello = {
        type: "Fdc3UserInterfaceHello",
        payload: {
            initialCSS: DEFAULT_COLLAPSED_CSS,
            implementationDetails: "Demo Intent Resolver v1.0"
        }
    }
    parent.postMessage(helloMessage, "*", [mc.port2]);

    function callback(intent: string | null, app: AppIdentifier | null) {
        const restyleMessage: IframeRestyle = { type: "Fdc3UserInterfaceRestyle", payload: { updatedCSS: DEFAULT_COLLAPSED_CSS } }
        myPort.postMessage(restyleMessage)

        if (intent && app) {
            const message: IframeResolveAction = {
                type: "Fdc3UserInterfaceResolveAction",
                payload: {
                    action: "click",
                    appIdentifier: app,
                    intent: intent
                }
            }
            myPort.postMessage(message)
        } else {
            const message: IframeResolveAction = {
                type: "Fdc3UserInterfaceResolveAction",
                payload: {
                    action: "cancel"
                }
            }
            myPort.postMessage(message)
        }
    }

    myPort.addEventListener("message", (e) => {
        if (e.data.type == 'iframeHandshake') {
            const message: IframeRestyle = { type: "Fdc3UserInterfaceRestyle", payload: { updatedCSS: DEFAULT_COLLAPSED_CSS } }
            myPort.postMessage(message)
        } else if (e.data.type == 'iframeResolve') {
            const message: IframeRestyle = { type: "Fdc3UserInterfaceRestyle", payload: { updatedCSS: DEFAULT_EXPANDED_CSS } }
            myPort.postMessage(message)
            Array.from(list.children).forEach(i => i.remove())
            const details: IframeResolvePayload = e.data.payload
            details.appIntents.forEach(intent => {

                intent.apps.forEach(app => {
                    const li = document.createElement("li")
                    const a = document.createElement("a")
                    const description = document.createElement("em")

                    if (app.instanceId) {
                        description.textContent = `${intent.intent.displayName ?? ""} on app instance ${app.instanceId} of ${app.appId}`
                    } else {
                        description.textContent = ` ${intent.intent.displayName ?? ""} on a new instance of ${app.appId}`
                    }

                    a.textContent = intent.intent.name

                    li.appendChild(a)
                    li.appendChild(description)
                    list.appendChild(li)
                    a.setAttribute("href", "#")
                    a.onclick = () => callback(intent.intent.name, app)
                })
            })
        }
    })

    document.getElementById("cancel")!!.addEventListener("click", () => {
        callback(null, null);
    })

})