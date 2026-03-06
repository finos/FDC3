import { createServer, Server } from 'http';
import { AddressInfo } from 'net';
import { WebSocket } from 'ws';
import { JosePrivateFDC3Security, createJosePrivateFDC3Security } from '../../src/impl/JosePrivateFDC3Security';
import { provisionJWKS } from '../../src/impl/JosePublicFDC3Security';
import { setupWebsocketServer } from '../../src/secure-boundary/ServerSideHandlersImpl';
import { FDC3Handlers } from '../../src/secure-boundary/FDC3Handlers';

/**
 * Starts a mock backend server (on localhost) that hosts JWKS and handles FDC3 WebSocket connections.
 *
 * @param port - The port to listen on (0 for dynamic).
 * @param createHandlers - A factory to create the FDC3 handlers for each connection,
 *                         receiving the initialized security instance.
 * @returns An object containing the base URL, initialized security, and the raw HTTP server.
 */
export async function startAppBackEnd(
  port: number,
  createHandlers: (ws: WebSocket, security: JosePrivateFDC3Security) => FDC3Handlers
): Promise<{ baseUrl: string; security: JosePrivateFDC3Security; httpServer: Server }> {
  let security: JosePrivateFDC3Security;

  const httpServer = createServer((req, res) => {
    if (req.url === '/.well-known/jwks.json') {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      // We'll populate this once security is initialized
      res.end(JSON.stringify({ keys: security.getPublicKeys() }));
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  await new Promise<void>(resolve => httpServer.listen(port, resolve));
  const actualPort = (httpServer.address() as AddressInfo).port;
  const baseUrl = `http://localhost:${actualPort}`;

  security = await createJosePrivateFDC3Security(
    baseUrl,
    url => provisionJWKS(url),
    () => true
  );

  setupWebsocketServer(
    httpServer,
    () => console.log('Client disconnected'),
    ws => createHandlers(ws, security)
  );

  return { baseUrl, security, httpServer };
}
