import { initializeServer } from '../common/src/server';
import { setupWebsocketServer } from '../../../src/helpers/ServerSideHandlersImpl';
import { App1BusinessLogic } from './App1BusinessLogic';
import { EXCHANGE_DATA } from '../../../src/helpers/MessageTypes';

initializeServer(4003).then(({ fdc3Security, app, server }) => {
  setupWebsocketServer(
    server,
    socket => {
      console.log('Disconnected', socket);
    },
    socket =>
      new App1BusinessLogic(fdc3Security, msg => {
        console.log('Sending back a message', msg);
        socket.emit(EXCHANGE_DATA, msg);
      })
  );
});
