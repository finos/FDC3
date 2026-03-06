import { EXCHANGE_DATA } from '../../../src/secure-boundary/MessageTypes';
import { setupWebsocketServer, emitToClient } from '../../../src/secure-boundary/ServerSideHandlersImpl';
import { initializeServer } from '../../app1/common/src/server';
import { App2BusinessLogic } from './App2BusinessLogic';

const PORT = 4004;

initializeServer(PORT).then(({ fdc3Security, app, server }) => {
  setupWebsocketServer(
    server,
    ws => {
      console.log('Disconnected', ws);
    },
    ws =>
      new App2BusinessLogic(fdc3Security, msg => {
        console.log('Sending back a message', msg);
        emitToClient(ws, EXCHANGE_DATA, msg);
      })
  );
});
