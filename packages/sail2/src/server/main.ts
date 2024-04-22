import express from "express";
import ViteExpress from "vite-express";
import { Server, Socket } from "socket.io"
import { APP_HELLO, DA_HELLO, FDC3_APP_EVENT, FDC3_DA_EVENT } from "../message-types"
import { AppIdentifier } from "@finos/fdc3/dist/bridging/BridgingTypes";

const app = express();

app.get("/iframe", (_, res) => {
  res.send("Hello Vite + TypeScript!");
});


const httpServer = ViteExpress.listen(app, 8090, () =>
  console.log("Server is listening on port 8090..."),
);

const io = new Server(httpServer)

type ConnectedWorld = {
  server: Socket,
  apps: Map<string, Socket>
}

const instances: Map<string, ConnectedWorld> = new Map()

io.on('connection', (socket: Socket) => {

  var myInstance: ConnectedWorld | undefined
  var myId: string | undefined

  socket.on(DA_HELLO, function (id) {
    myId = id
    const instance = instances.get(id) ?? {
      server: socket,
      apps: new Map()
    } as ConnectedWorld

    instance.server = socket
    instances.set(id, instance)
    console.log("instances " + instances.size)
    myInstance = instance
    console.log("A da connected: " + id)
  })

  socket.on(APP_HELLO, function (id: string, appID: AppIdentifier) {
    myId = appID.instanceId!!
    const instance = instances.get(id)

    if (instance != undefined) {
      console.log("An app connected: " + id)
      instance.apps.set(myId, socket)
      myInstance = instance
    } else {
      console.log("App Tried Connecting to non-existent DA Instance " + id + " " + appID.appId + " " + appID.instanceId)
    }
  })

  socket.on(FDC3_APP_EVENT, function (data, from): void {
    // message from app to da
    console.log(JSON.stringify(data))

    if ((myInstance == null) && (data.type == 'intentResolutionChoice')) {
      // message from app's intent resolver
      myInstance = Array.from(instances.values()).find(cw => cw.apps.get(from.instanceId))
    }

    if ((myInstance == null) && (data.type == 'channelSelectionChoice')) {
      // message from app's channelSelector
      myInstance = Array.from(instances.values()).find(cw => cw.apps.get(from.instanceId))
    }

    if (myInstance != undefined) {
      myInstance!!.server.emit(FDC3_APP_EVENT, data, from)
    }
  })

  socket.on(FDC3_DA_EVENT, function (data, to): void {
    // send message to app
    const destSocket = myInstance?.apps.get(to.instanceId)
    if (destSocket) {
      destSocket.emit(FDC3_DA_EVENT, data, to)
    } else {
      console.log("Unknown dest " + JSON.stringify(to))
    }
  })

  socket.on("disconnect", function (): void {
    if (myInstance) {
      if (myInstance.server.id == socket.id) {
        instances.delete(myId!!)
      } else {
        myInstance.apps.delete(myId!!)
        console.log(`Apparent disconnect: ${myInstance.apps.size} remaining`)
      }
    }
  })
})
