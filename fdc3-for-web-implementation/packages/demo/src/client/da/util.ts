import { InstanceID } from "@kite9/da-server"
import { Socket } from "socket.io-client"
import { FDC3_APP_EVENT, FDC3_DA_EVENT } from "../../message-types"


export function link(socket: Socket, channel: MessageChannel, source: InstanceID) {
    socket.on(FDC3_DA_EVENT, (data: any, to: InstanceID) => {
        console.log(`DA Sent ${JSON.stringify(data)} from socket`)
        channel.port2.postMessage(data)
    })

    channel.port2.onmessage = function (event) {
        console.log(`App Sent ${JSON.stringify(event.data)} from message port`)
        socket.emit(FDC3_APP_EVENT, event.data, source)
    }
}
