import { supply } from "da-server/src/supply/post-message";
import { io } from "socket.io-client"
import { v4 as uuid } from 'uuid'
import { DA_HELLO, FDC3_APP_EVENT } from "../../message-types";
import { DemoServerContext } from "./DemoServerContext";
import { FDC3_2_1_JSONDirectory } from "./FDC3_2_1_JSONDirectory";
import { DefaultFDC3Server } from "da-server";
import { createAppStartButton } from "./util";


window.addEventListener("load", () => {

    let desktopAgentUUID = uuid()

    const socket = io()

    socket.on("connect", async () => {
        socket.emit(DA_HELLO, desktopAgentUUID)

        const directory = new FDC3_2_1_JSONDirectory()
        await directory.load("/static/da/appd.json")
        const sc = new DemoServerContext(socket, directory, desktopAgentUUID)
        const fdc3Server = new DefaultFDC3Server(sc, directory, "FDC3-Web-Demo")

        socket.on(FDC3_APP_EVENT, (msg, from) => {
            fdc3Server.receive(msg, from)
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

