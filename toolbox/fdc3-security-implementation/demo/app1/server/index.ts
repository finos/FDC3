import { initializeServer } from '../common/src/server';
import { setupWebsocketServer } from '../../../src/helpers/ServerSideHandlersImpl';
import { App1BusinessLogic } from './App1BusinessLogic';

initializeServer(4003).then(({ fdc3Security, app, server }) => {
  const handlers = new App1BusinessLogic(fdc3Security);

  setupWebsocketServer(
    server,
    socket => {
      console.log('Disconnected', socket);
    },
    handlers
  );
});
