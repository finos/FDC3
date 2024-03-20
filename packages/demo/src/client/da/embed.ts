import { FDC3_PORT_TRANSFER_RESPONSE_TYPE } from "fdc3-common";
import { io } from "socket.io-client"
import { link } from "./util";
import { AppIdentifier } from "@finos/fdc3";
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

function getSource(): AppIdentifier {
    const source = getQueryVariable("source")
    const decoded = decodeURIComponent(source)
    const object: AppIdentifier = JSON.parse(decoded)
    return object
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

        // sned the other end of the channel to the app
        appWindow.postMessage({
            type: FDC3_PORT_TRANSFER_RESPONSE_TYPE,
        }, "*", [channel.port1])

        socket.emit(APP_HELLO, desktopAgentUUID, source)
    })
})
