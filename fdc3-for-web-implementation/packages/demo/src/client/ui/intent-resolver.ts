import { ResolverIntents, ResolverMessageChoice, SingleAppIntent } from "@kite9/fdc3-common";

window.addEventListener("load", () => {

    const parent = window.parent;

    const mc = new MessageChannel();
    const myPort = mc.port1
    myPort.start()

    const list = document.getElementById("intent-list")!!

    parent.postMessage({ type: "SelectorMessageInitialize" }, "*", [mc.port2]);

    function callback(si: SingleAppIntent | null) {
        myPort.postMessage({
            type: "ResolverMessageChoice",
            payload: si
        } as ResolverMessageChoice)
    }

    myPort.addEventListener("message", (e) => {
        if (e.data.type == 'ResolverIntents') {
            const details = e.data as ResolverIntents
            console.log(JSON.stringify("INTENT DETAILS: " + JSON.stringify(details)))

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
                    a.onclick = () => callback({ intent: intent.intent, chosenApp: app })
                })
            })
        }
    })

    document.getElementById("cancel")!!.addEventListener("click", () => {
        callback(null);
    })


})