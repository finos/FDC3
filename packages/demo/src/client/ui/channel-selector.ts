import { AppIdentifier } from "@finos/fdc3";
import { io } from "socket.io-client"
import { FDC3_APP_EVENT } from "../../message-types";
import { ChannelSelectionChoiceAgentRequest } from "fdc3-common";
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

function getAvailableChannels(): any[] {
    const intentDetails = getQueryVariable("availableChannels")
    const decoded = decodeURIComponent(intentDetails)
    const object: any[] = JSON.parse(decoded)
    return object
}

function getCurrentChannel(): string {
    const source = getQueryVariable("currentId")
    const decoded = decodeURIComponent(source)
    const object: string = JSON.parse(decoded)
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

    const currentChannelId = getCurrentChannel()
    const channels = getAvailableChannels()
    const source = getSource()

    const list = document.getElementById("channel-list")!!
    const close = document.getElementById("close")!!

    function sendChosenChannel(channelId: string, cancel: boolean) {
        const out: ChannelSelectionChoiceAgentRequest = {
            type: "channelSelectionChoice",
            payload: {
                cancel,
                channelId
            },
            meta: {
                requestUuid: uuid(),
                timestamp: new Date(),
                source
            },
        }

        socket.emit(FDC3_APP_EVENT, out, source)
    }

    const debug = document.createElement("p")
    debug.textContent = JSON.stringify(source)
    document.body.appendChild(debug)

    channels.forEach(channel => {

        const li = document.createElement("li")
        li.style.backgroundColor = channel.displayMetadata.color
        const a = document.createElement("a")
        const description = document.createElement("em")
        description.textContent = channel.displayMetadata.name
        a.textContent = channel.id

        li.appendChild(a)
        li.appendChild(description)
        list.appendChild(li)
        a.setAttribute("href", "#")
        a.onclick = () => sendChosenChannel(channel.id, false)
    })

    close.onclick = () => sendChosenChannel("", true)

})
