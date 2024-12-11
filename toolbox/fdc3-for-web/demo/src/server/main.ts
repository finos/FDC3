import express from 'express';
import ViteExpress from 'vite-express';
import { Server, Socket } from 'socket.io';
import { APP_GOODBYE, APP_HELLO, DA_HELLO, FDC3_APP_EVENT, FDC3_DA_EVENT } from '../message-types';

const app = express();

app.get('/iframe', (_, res) => {
  res.send('Hello Vite + TypeScript!');
});

const httpServer = ViteExpress.listen(app, 4000, () =>
  console.log('Server is listening on port 4000. Head to http://localhost:4000/static/da/index.html')
);

const io = new Server(httpServer);

type ConnectedWorld = {
  server: Socket;
  apps: Map<string, Socket>;
};

enum ConnectionType {
  APP,
  DA,
}

const instances: Map<string, ConnectedWorld> = new Map();

io.on('connection', (socket: Socket) => {
  let myInstance: ConnectedWorld | undefined;
  let myId: string | undefined;
  let connectionType: ConnectionType | undefined;

  socket.on(DA_HELLO, function (id) {
    myId = id;
    const instance: ConnectedWorld = instances.get(id) ?? {
      server: socket,
      apps: new Map(),
    };

    instance.server = socket;
    instances.set(id, instance);
    connectionType = ConnectionType.DA;
    console.log('instances ' + instances.size);
    myInstance = instance;
    console.log('A da connected: ' + id);
  });

  socket.on(APP_HELLO, function (id: string, appId: string) {
    const instance = instances.get(id);

    if (instance != undefined) {
      console.log(`An app connected to DA ${id} with id ${appId}`);
      instance.apps.set(appId, socket);
      myInstance = instance;
      connectionType = ConnectionType.APP;
      myId = appId;
    } else {
      console.log('App Tried Connecting to non-existent DA Instance ' + id + ' ' + myId);
    }
  });

  socket.on(FDC3_APP_EVENT, function (data, from): void {
    // message from app to da
    console.log(`APP Sent ${JSON.stringify(data, null, 2)}`);

    if (myInstance == null && data.type == 'intentResolutionChoice') {
      // message from app's intent resolver
      myInstance = Array.from(instances.values()).find(cw => cw.apps.get(from));
    }

    if (myInstance == null && data.type == 'channelSelectionChoice') {
      // message from app's channelSelector
      myInstance = Array.from(instances.values()).find(cw => cw.apps.get(from));
    }

    if (myInstance != undefined) {
      myInstance.server.emit(FDC3_APP_EVENT, data, from);
    }
  });

  socket.on(FDC3_DA_EVENT, function (data, to): void {
    // send message to app
    const destSocket = myInstance?.apps.get(to);
    if (destSocket) {
      console.log(`DA Sent ${JSON.stringify(data, null, 2)} to ${to}`);
      destSocket.emit(FDC3_DA_EVENT, data, to);
    } else {
      console.log('Failed to send message to app ' + to);
    }
  });

  socket.on('disconnect', function (): void {
    if (myInstance) {
      if (connectionType == ConnectionType.DA) {
        console.log('DA disconnected: ' + myId);
        instances.delete(myId!);
      } else {
        myInstance.apps.delete(myId!);
        console.log(`App Disconnected: ${myId} ( ${myInstance.apps.size} remaining )`);
        myInstance.server.emit(APP_GOODBYE, myId!);
      }
    }
  });
});
