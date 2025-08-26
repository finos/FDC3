import { setupWebsocketServer } from '../../../src/helpers/ServerSideHandlersImpl';
import { initializeServer } from '../../app1/common/src/server';
import { App2BusinessLogic } from './App2BusinessLogic';

const PORT = 4004;

initializeServer(PORT).then(({ fdc3Security, app, server }) => {
  setupWebsocketServer(
    server,
    socket => {
      console.log('Disconnected', socket);
    },
    _socket => new App2BusinessLogic(fdc3Security)
  );
});
