import { IframeHello, IframeRestyle } from "@kite9/fdc3-schema/generated/api/BrowserTypes";
import { AppIdentifier } from "@kite9/fdc3-standard";
import { BrowserTypes } from "@kite9/fdc3-schema";

type IframeResolveAction = BrowserTypes.IframeResolveAction
type IframeResolvePayload = BrowserTypes.IframeResolvePayload

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
    parent.postMessage({
        type: "fdc3UserInterfaceHello",
        payload: {
            initialCSS: DEFAULT_COLLAPSED_CSS,
            implementationDetails: "Demo Intent Resolver v1.0"
        }
    } as any as IframeHello, "*", [mc.port2]);

    function callback(intent: string | null, app: AppIdentifier | null) {
        myPort.postMessage({ type: "iframeRestyle", payload: { updatedCSS: DEFAULT_COLLAPSED_CSS } } as IframeRestyle)

        if (intent && app) {
            myPort.postMessage({
                type: "iframeResolveAction",
                payload: {
                    action: "click",
                    appIdentifier: app,
                    intent: intent
                }
            } as IframeResolveAction)
        } else {
            myPort.postMessage({
                type: "iframeResolveAction",
                payload: {
                    action: "cancel"
                }
            } as IframeResolveAction)
        }
    }

    myPort.addEventListener("message", (e) => {
        if (e.data.type == 'iframeHandshake') {
            myPort.postMessage({ type: "iframeRestyle", payload: { updatedCSS: DEFAULT_COLLAPSED_CSS } } as IframeRestyle)
        } else if (e.data.type == 'iframeResolve') {
            myPort.postMessage({ type: "iframeRestyle", payload: { updatedCSS: DEFAULT_EXPANDED_CSS } } as IframeRestyle)
            Array.from(list.children).forEach(i => i.remove())
            const details = e.data.payload as IframeResolvePayload
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