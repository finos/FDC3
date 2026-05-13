import { createServer, Server } from 'http';
import { WebSocket } from 'ws';
import { JosePrivateFDC3Security, createJosePrivateFDC3Security } from '../../src/impl/JosePrivateFDC3Security';
import { provisionJWKS } from '../../src/impl/JosePublicFDC3Security';
import { setupWebsocketServer } from '../../src/secure-boundary/ServerSideHandlersImpl';
import { FDC3Handlers } from '../../src/secure-boundary/FDC3Handlers';
import { AppIdentifier } from '@finos/fdc3-standard';

export type CreateHandlers = (
  ws: WebSocket,
  security: JosePrivateFDC3Security,
  appId: AppIdentifier,
  instanceId: string
) => FDC3Handlers;

/**
 * A mock backend server (on loopback) that hosts JWKS and handles FDC3 WebSocket connections.
 * Uses an OS-assigned TCP port so parallel Jest workers and
 * other processes never collide on a pre-chosen random port — collisions produced fetch failures
 * with `HTTPParserError: Expected HTTP/` when the wrong peer answered the socket.
 */
export class AppBackEnd {
  /** Set in {@link AppBackEnd.start}; do not read before `start` completes. */
  baseUrl!: string;
  security!: JosePrivateFDC3Security;
  httpServer!: Server;
  public handlers: FDC3Handlers | null = null;

  constructor(private readonly createHandlers: CreateHandlers) {}

  async start(): Promise<void> {
    let security: JosePrivateFDC3Security | undefined = undefined;

    const httpServer = createServer((req, res) => {
      if (req.url === '/.well-known/jwks.json') {
        if (!security) {
          res.writeHead(503, { Connection: 'close' });
          res.end();
          return;
        }
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify({ keys: security.getPublicKeys() }));
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    await new Promise<void>((resolve, reject) => {
      httpServer.once('error', reject);
      httpServer.listen(0, '127.0.0.1', () => {
        httpServer.off('error', reject);
        resolve();
      });
    });

    const addr = httpServer.address();
    if (addr === null || typeof addr === 'string') {
      throw new Error('Unable to determine AppBackEnd listen address');
    }
    this.baseUrl = `http://127.0.0.1:${addr.port}`;

    security = await createJosePrivateFDC3Security(
      this.baseUrl,
      url => provisionJWKS(url),
      () => true
    );

    setupWebsocketServer(
      httpServer,
      (_ws: WebSocket) => {
        this.handlers = null;
      },
      (ws, appIdentifier, fdc3Version) => {
        const h = this.createHandlers(ws, security, appIdentifier, fdc3Version);
        this.handlers = h;
        return h;
      }
    );

    this.security = security;
    this.httpServer = httpServer;
  }

  shutdown(): Promise<void> {
    return new Promise(resolve => {
      if (typeof this.httpServer.closeAllConnections === 'function') {
        this.httpServer.closeAllConnections();
      }
      this.httpServer.close(() => resolve());
    });
  }
}
