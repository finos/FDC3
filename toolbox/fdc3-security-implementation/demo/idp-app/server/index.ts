import { initializeServer } from '../../app1/common/src/server';
import { setupWebsocketServer } from '../../../src/helpers/ServerSideHandlersImpl';
import { IDPBusinessLogic } from './IDPBusinessLogic';

// Extend session interface
declare module 'express-session' {
  interface SessionData {
    userId: string;
    jwt: string;
    isAuthenticated: boolean;
  }
}

const PORT = 4005;

initializeServer(PORT).then(({ fdc3Security, app, server }) => {
  setupWebsocketServer(
    server,
    _s => {
      console.log('Websocket server disconnected');
    },
    new IDPBusinessLogic(fdc3Security)
  );
});
