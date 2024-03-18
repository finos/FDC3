import { Socket } from "socket.io-client"
import { FDC3_APP_EVENT, FDC3_DA_EVENT } from "../../message-types"
import { DirectoryApp, ServerContext } from "da-server"
import { AppMetadata } from "@finos/fdc3/dist/bridging/BridgingTypes"


export function link(socket: Socket, channel: MessageChannel, app: AppMetadata) {
    socket.on(FDC3_DA_EVENT, (data: any, to: AppMetadata) => {
        console.log(`Received ${JSON.stringify(data)} from socket`)
        channel.port2.postMessage(data)
    })

    channel.port2.onmessage = function (event) {
        console.log(`Received ${JSON.stringify(event.data)} from message port`)
        socket.emit(FDC3_APP_EVENT, event.data, app)
    }
}

export function createAppStartButton(app: DirectoryApp, sc: ServerContext): HTMLDivElement {
    const div = document.createElement("div") as HTMLDivElement
    div.classList.add("app")
    const h3 = document.createElement("h3")
    h3.textContent = app.title
    div.appendChild(h3)
    const button = document.createElement("button")
    button.textContent = "Start"
    button.onclick = () => sc.open(app.appId)
    div.appendChild(button)
    const p = document.createElement("p")
    p.textContent = app.description ?? ''
    div.appendChild(p)
    return div
}