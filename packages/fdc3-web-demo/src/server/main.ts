import express from "express";
import ViteExpress from "vite-express";
import { Server, Socket } from "socket.io"
import { APP_HELLO, DA_HELLO, FDC3_EVENT } from "../common";
import { AppIdentifier } from "@finos/fdc3/dist/bridging/BridgingTypes";

const app = express();

app.get("/hello", (_, res) => {
  res.send("Hello Vite + TypeScript!");
});


const httpServer = ViteExpress.listen(app, 8095, () =>
  console.log("Server is listening on port 8095..."),
);

const io = new Server(httpServer)

type ConnectedWorld = {
  server: Socket,
  apps: Map<string, Socket>
}

type AppOrDA = "App" | "DA"

const instances: Map<string, ConnectedWorld> = new Map()

io.on('connection', (socket: Socket) => {

  var myInstance: ConnectedWorld | undefined
  var myType: AppOrDA | undefined

  socket.on(DA_HELLO, function (id) {
    const instance = instances.get(id) ?? {
      server: socket,
      apps: new Map()
    } as ConnectedWorld

    instance.server = socket
    instances.set(id, instance)
    console.log("instances " + instances.size)
    myInstance = instance
    myType = "DA"
    console.log("A da connected: " + id)
  })

  socket.on(APP_HELLO, function (id: string, appID: AppIdentifier) {
    const instance = instances.get(id)

    if (instance != undefined) {
      console.log("An app connected: " + id)
      instance.apps.set(appID.instanceId!!, socket)
      myInstance = instance
      myType = "App"
    } else {
      console.log("App Tried Connecting to non-existent DA Instance " + id + " " + appID.appId + " " + appID.instanceId)
    }
  })

  socket.on("fdc3-event", function (data) {
    console.log(JSON.stringify(data))
    if (myType == 'App') {
      // send message on to the da
      myInstance?.server.emit(FDC3_EVENT, data)
    } else if (myType = "DA") {
      // send message to app
      const dest = data?.meta?.destination?.instanceId
      const destSocket = myInstance?.apps.get(dest)
      if (destSocket) {
        destSocket.emit(FDC3_EVENT, data)
      } else {
        console.log("Unknown dest " + JSON.stringify(dest))
      }
    }

  })
})
