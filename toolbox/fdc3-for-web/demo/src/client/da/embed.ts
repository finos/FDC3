import { io } from "socket.io-client"
import { link } from "./util";
import { APP_HELLO } from "../../message-types";
import { UI, UI_URLS } from "./dummy-desktop-agent";

const appWindow = window.parent;

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

function getConnectionAttemptUuid(): string {
    const uuid = getQueryVariable("connectionAttemptUuid")
    return uuid
}

function getSource(): string {
    const source = getQueryVariable("instanceId")
    return source
}

function getDeskopAgentId(): string {
    const id = getQueryVariable("desktopAgentId")
    return id
}

function getUIKey(): UI {
    const ui = getQueryVariable("UI")
    return parseInt(ui) as UI
}


window.addEventListener("load", () => {

    const socket = io()
    const channel = new MessageChannel()
    const source = getSource()
    const desktopAgentUUID = getDeskopAgentId()

    socket.on("connect", () => {

        link(socket, channel, source)

        socket.emit(APP_HELLO, desktopAgentUUID, source)

        const ui = UI_URLS[getUIKey()]

        // sned the other end of the channel to the app
        appWindow.postMessage({
            type: 'WCP3Handshake',
            meta: {
                connectionAttemptUuid: getConnectionAttemptUuid(),
                timestamp: new Date()
            },
            payload: {
                fdc3Version: "2.2",
                ...ui
            }
        }, "*", [channel.port1])


    })
})
