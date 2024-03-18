import { FDC3_PORT_TRANSFER_RESPONSE_TYPE } from "fdc3-common";
import { io } from "socket.io-client"
import { link } from "./constants";

const appWindow = window.parent;

window.addEventListener("load", () => {

    const socket = io()
    const channel = new MessageChannel()

    socket.on("connect", () => {

        link(socket, channel)

        // sned the other end of the channel to the app
        appWindow.postMessage({
            type: FDC3_PORT_TRANSFER_RESPONSE_TYPE,
        }, "*", [channel.port1])
    })
})
