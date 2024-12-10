import { io } from "socket.io-client"
import { link, UI, UI_URLS } from "./util";
import { APP_HELLO } from "../../message-types";
import { isWebConnectionProtocol1Hello, WebConnectionProtocol3Handshake } from "@kite9/fdc3-schema/generated/api/BrowserTypes";

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

function getDesktopAgentId(): string {
    const id = getQueryVariable("desktopAgentId")
    return id
}

function getUIKey(): UI {
    const ui = getQueryVariable("UI")
    return parseInt(ui) as UI
}

//set-up a listener for the WCP1Hello message 
const helloHandler = (e: MessageEvent) => {
    const event = e;
    const data = event.data;
    // const source = event.source as Window
    // const origin = event.origin;

    if (isWebConnectionProtocol1Hello(data)) {
        console.debug("Received hello message: ", event.data);
        const socket = io();
        const channel = new MessageChannel();
        const source = getSource();
        const desktopAgentUUID = getDesktopAgentId();

        socket.on("connect", () => {
            link(socket, channel, source);
            socket.emit(APP_HELLO, desktopAgentUUID, source);
            const ui = UI_URLS[getUIKey()];

            // send the other end of the channel to the app
            const message: WebConnectionProtocol3Handshake = {
                type: 'WCP3Handshake',
                meta: {
                    connectionAttemptUuid: data.meta.connectionAttemptUuid,
                    timestamp: new Date()
                },
                payload: {
                    fdc3Version: "2.2",
                    channelSelectorUrl: data?.payload.channelSelector === false ? false : ui.channelSelectorUrl,
                    intentResolverUrl: data?.payload.intentResolver === false ? false : ui.intentResolverUrl,
                }
            };
            appWindow.postMessage(message, "*", [channel.port1])
        });

        window.removeEventListener("message", helloHandler);
    }
};

window.addEventListener("message", helloHandler); 
