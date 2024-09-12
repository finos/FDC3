import { io } from "socket.io-client"
import { link } from "./util";
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


window.addEventListener("load", () => {

    const socket = io()
    const channel = new MessageChannel()
    const source = getSource()
    const desktopAgentUUID = getDeskopAgentId()

    socket.on("connect", () => {

        link(socket, channel, source)

        socket.emit(APP_HELLO, desktopAgentUUID, source)

        // sned the other end of the channel to the app
        appWindow.postMessage({
            type: 'WCP3Handshake',
            meta: {
                connectionAttemptUuid: getConnectionAttemptUuid(),
                timestamp: new Date()
            },
            payload: {
                fdc3Version: "2.2",
                intentResolverUrl: window.location.origin + "/static/da/intent-resolver.html",
                channelSelectorUrl: window.location.origin + "/static/da/channel-selector.html",
            }
        }, "*", [channel.port1])


    })
})
