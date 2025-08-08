import { initializeServer, setupSessionHandlingEndpoints } from '../common/src/server';
import { setupWebsocketServer } from '../../../src/helpers/ServerSideDesktopAgent';
import { User } from '@finos/fdc3-context';
import { SecuredDesktopAgentDelegate } from '@finos/fdc3-security';

initializeServer(4003).then(({ fdc3Security, app, server }) => {
  const sessionMiddleware = setupSessionHandlingEndpoints(app);

  let jwtToken: string | null = null;

  setupWebsocketServer(
    server,
    async (da, socket) => {
      console.log('Remote desktop agent:', da, sessionMiddleware);

      const secureFDC3 = new SecuredDesktopAgentDelegate(da, fdc3Security);

      socket.on('get_user', async function (callback: (success: any, err?: string) => void) {
        console.log('GetUser request');
        const result = await secureFDC3.raiseIntent('GetUser', {
          type: 'fdc3.user.request',
        });
        const user = (await result.getResult()) as User;
        jwtToken = user.jwt;
        callback(user);
      });
    },
    (da, socket) => {
      console.log('Disconnected', da);
    }
  );
});
