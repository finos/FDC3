import { AppIdentifier, AppIntent, IntentMetadata } from "@finos/fdc3";
import { AppMetadata } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { io } from "socket.io-client"
import { FDC3_APP_EVENT } from "../../message-types";
import { IntentResolutionChoiceAgentRequest } from "fdc3-common";
import { v4 as uuid } from 'uuid'

function getQueryVariable(variable: string): string {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }

    return ""
}

function getAppIntents(): AppIntent[] {
    const intentDetails = getQueryVariable("intentDetails")
    const decoded = decodeURIComponent(intentDetails)
    const object: AppIntent[] = JSON.parse(decoded)
    return object
}

function getSource(): AppIdentifier {
    const source = getQueryVariable("source")
    const decoded = decodeURIComponent(source)
    const object: AppIdentifier = JSON.parse(decoded)
    return object
}

const socket = io()

socket.on("connect", async () => {

    const intentDetails = getAppIntents()
    const source = getSource()

    const list = document.getElementById("intent-list")!!

    function sendChosenIntent(intent: IntentMetadata, app: AppMetadata, source: AppMetadata) {
        const out: IntentResolutionChoiceAgentRequest = {
            type: "intentResolutionChoice",
            meta: {
                requestUuid: uuid(),
                timestamp: new Date(),
                source
            },
            payload: {
                chosenApp: app,
                intent: intent,
            }
        }

        socket.emit(FDC3_APP_EVENT, out, source)
    }

    const debug = document.createElement("p")
    debug.textContent = JSON.stringify(source)
    document.body.appendChild(debug)

    intentDetails.forEach(intent => {

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
            a.onclick = () => sendChosenIntent(intent.intent, app, source)
        })

    })

})