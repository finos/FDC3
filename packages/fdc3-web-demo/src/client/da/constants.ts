import { Socket } from "socket.io-client"
import { FDC3_EVENT } from "../../common"


export const MAIN_HOST = 'http://localhost:8095'
export const SECOND_HOST = 'http://robs-pro:8095'
export const WORKBENCH_HOST = 'http://localhost:3000'

export function link(socket: Socket, channel: MessageChannel) {
    socket.on(FDC3_EVENT, (data: any) => {
        console.log(`Received ${JSON.stringify(data)} from socket`)
        channel.port2.postMessage(data)
    })

    channel.port2.onmessage = function (event) {
        console.log(`Received ${JSON.stringify(event.data)} from message port`)
        socket.emit(FDC3_EVENT, event.data)
    }
}
