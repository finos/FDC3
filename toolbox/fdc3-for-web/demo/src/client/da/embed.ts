import { io } from "socket.io-client"
import { link, UI, UI_URLS } from "./util";
import { APP_HELLO } from "../../message-types";

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
    return getQueryVariable("connectionAttemptUuid")
}

function getSource(): string {
    return getQueryVariable("instanceId")
}

function getDesktopAgentId(): string {
    return getQueryVariable("desktopAgentId")
}

function getUIKey(): UI {
    const ui = getQueryVariable("UI")
    return parseInt(ui) as UI
}

window.addEventListener("load", () => {

    const socket = io()
    const channel = new MessageChannel()
    const source = getSource()
    const desktopAgentUUID = getDesktopAgentId()

    socket.on("connect", () => {

        link(socket, channel, source)

        socket.emit(APP_HELLO, desktopAgentUUID, source)

        const ui = UI_URLS[getUIKey()]

        // send the other end of the channel to the app
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
