import { Server } from "http";
import { APP_HELLO, DA_HELLO, FDC3_APP_EVENT, HelloArgs } from "./message-types";
import { Socket } from "socket.io";
import { AppIdentifier } from "@finos/fdc3";
import { SailFDC3Server } from "./SailFDC3Server";
import { SailServerContext } from "./SailServerContext";

type FDC3Session = {
    fdc3Server: SailFDC3Server,
    serverContext: SailServerContext
}

export function initDesktopAgentService(httpServer: Server): void {

    const io = new Server(httpServer)

    const sessions: Map<string, FDC3Session> = new Map()

    io.on('connection', (socket: Socket) => {

        var myInstance: FDC3Session | undefined
        var myId: string | undefined

        socket.on(DA_HELLO, function (data: HelloArgs) {
            myId = data.id
            if (sessions.get(myId)) {
                console.log("Need to reconfigure desktop agent")
            }

            myInstance = sessions.get(myId)
            if (myInstance) {
                // reconfiguring current session
                myInstance.fdc3Server.getBroadcastHandler().updateChannels(data.channels)
                myInstance.fdc3Server.getDirectory().replace(data.directories)
                console.log("updated desktop agent channels and directories" + sessions.size)
            } else {
                // starting session
                const serverContext = new SailServerContext(socket)
                const fdc3Server = new SailFDC3Server(serverContext, data)
                myInstance = {
                    serverContext,
                    fdc3Server
                }
                sessions.set(myId, myInstance)
                console.log("created agent session.  Running sessions " + sessions.size)
            }
        })

        socket.on(APP_HELLO, function (id: string, appID: AppIdentifier) {
            myId = appID.instanceId!!
            const instance = sessions.get(id)

            if (instance != undefined) {
                console.log("An app connected: " + id)
                instance.serverContext.connect(myId, socket)
                myInstance = instance
            } else {
                console.log("App Tried Connecting to non-existent DA Instance " + id + " " + appID.appId + " " + appID.instanceId)
            }
        })

        socket.on(FDC3_APP_EVENT, function (data, from): void {
            // message from app to da
            console.log(JSON.stringify(data))

            // if ((myInstance == null) && (data.type == 'intentResolutionChoice')) {
            //     // message from app's intent resolver
            //     myInstance = Array.from(instances.values()).find(cw => cw.apps.get(from.instanceId))
            // }

            // if ((myInstance == null) && (data.type == 'channelSelectionChoice')) {
            //     // message from app's channelSelector
            //     myInstance = Array.from(instances.values()).find(cw => cw.apps.get(from.instanceId))
            // }

            if (myInstance != undefined) {
                myInstance!!.fdc3Server.receive(data, from)
            }
        })

        socket.on("disconnect", function (): void {
            if (myInstance) {
                if (myInstance.serverContext.serverSocket.id == socket.id) {
                    sessions.delete(myId!!)
                } else {
                    myInstance.serverContext.disconnect(socket)
                    console.log(`Apparent disconnect: ${myInstance.serverContext.apps.size} remaining`)
                }
            }
        })
    })

}