import { InstanceID } from "@kite9/fdc3-web-impl"
import { Socket } from "socket.io-client"
import { FDC3_APP_EVENT, FDC3_DA_EVENT } from "../../message-types"


export function link(socket: Socket, channel: MessageChannel, source: InstanceID) {
    socket.on(FDC3_DA_EVENT, (data: any) => {
        console.debug("DA sent from socket: ", data)
        channel.port2.postMessage(data)
    })

    channel.port2.onmessage = function (event) {
        console.debug("App sent from message port: ", event.data)
        socket.emit(FDC3_APP_EVENT, event.data, source)
    }
}
