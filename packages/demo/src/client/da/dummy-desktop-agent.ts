import { supply } from "@kite9/da-server/src/supply/post-message";
import { io } from "socket.io-client"
import { v4 as uuid } from 'uuid'
import { APP_GOODBYE, DA_HELLO, FDC3_APP_EVENT } from "../../message-types";
import { DemoServerContext } from "./DemoServerContext";
import { FDC3_2_1_JSONDirectory } from "./FDC3_2_1_JSONDirectory";
import { DefaultFDC3Server, DirectoryApp, ServerContext } from "@kite9/da-server";
import { ChannelState } from "@kite9/fdc3-common";


function createAppStartButton(app: DirectoryApp, sc: ServerContext): HTMLDivElement {
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

window.addEventListener("load", () => {

    let desktopAgentUUID = uuid()

    const socket = io()

    socket.on("connect", async () => {
        socket.emit(DA_HELLO, desktopAgentUUID)

        const directory = new FDC3_2_1_JSONDirectory()
        await directory.load("/static/da/appd.json")
        //await directory.load("/static/da/local-conformance-2_0.v2.json")
        const sc = new DemoServerContext(socket, directory, desktopAgentUUID)
        const initialChannels: ChannelState = {
            "one": [],
            "two": [],
            "three": [],
            "four": []
        }
        const fdc3Server = new DefaultFDC3Server(sc, directory, "FDC3-Web-Demo", initialChannels)

        socket.on(FDC3_APP_EVENT, (msg, from) => {
            fdc3Server.receive(msg, from)
        })

        socket.on(APP_GOODBYE, (id: string) => {
            sc.goodbye(id)
        })

        // let's create buttons for some apps
        const appList = document.getElementById('app-list') as HTMLOListElement
        directory.retrieveAllApps().forEach(app => {
            appList.appendChild(createAppStartButton(app, sc))
        })

        // set up desktop agent handler here using FDC3 Web Loader (or whatever we call it)
        supply(sc.appChecker, sc.detailsResolver, sc.portResolver)
    })
})

