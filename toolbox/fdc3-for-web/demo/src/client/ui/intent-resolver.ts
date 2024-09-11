import { AppIdentifier, IframeResolveAction, IframeResolvePayload } from "@kite9/fdc3-standard";

const DEFAULT_COLLAPSED_CSS = {
    position: "fixed",
    zIndex: "1000",
    right: "0",
    bottom: "0",
    width: "0",
    height: "0"
}

const DEFAULT_EXPANDED_CSS = {
    position: "fixed",
    zIndex: "1000",
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

    parent.postMessage({ type: "iframeHello" }, "*", [mc.port2]);

    function callback(intent: string | null, app: AppIdentifier | null) {
        myPort.postMessage({ type: "iframeRestyle", payload: { css: DEFAULT_COLLAPSED_CSS } })

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
            myPort.postMessage({ type: "iframeRestyle", payload: { css: DEFAULT_COLLAPSED_CSS } })
        } else if (e.data.type == 'iframeResolve') {
            myPort.postMessage({ type: "iframeRestyle", payload: { css: DEFAULT_EXPANDED_CSS } })

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