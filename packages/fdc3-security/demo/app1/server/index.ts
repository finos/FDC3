import { initializeServer } from '../common/src/server';
import { setupWebsocketServer, emitToClient } from '../../../src/secure-boundary/ServerSideHandlersImpl';
import { App1BusinessLogic } from './App1BusinessLogic';
import { EXCHANGE_DATA } from '../../../src/secure-boundary/MessageTypes';

initializeServer(4003).then(({ fdc3Security, app, server }) => {
  setupWebsocketServer(
    server,
    ws => {
      console.log('Disconnected', ws);
    },
    ws =>
      new App1BusinessLogic(fdc3Security, msg => {
        console.log('Sending back a message', msg);
        emitToClient(ws, EXCHANGE_DATA, msg);
      })
  );
});
