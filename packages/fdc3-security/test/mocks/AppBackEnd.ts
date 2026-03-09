import { createServer, Server } from 'http';
import { WebSocket } from 'ws';
import { JosePrivateFDC3Security, createJosePrivateFDC3Security } from '../../src/impl/JosePrivateFDC3Security';
import { provisionJWKS } from '../../src/impl/JosePublicFDC3Security';
import { setupWebsocketServer } from '../../src/secure-boundary/ServerSideHandlersImpl';
import { FDC3Handlers } from '../../src/secure-boundary/FDC3Handlers';

export type CreateHandlers = (ws: WebSocket, security: JosePrivateFDC3Security) => FDC3Handlers;

/**
 * A mock backend server (on localhost) that hosts JWKS and handles FDC3 WebSocket connections.
 */
export class AppBackEnd {
  readonly baseUrl: string;
  security!: JosePrivateFDC3Security;
  httpServer!: Server;

  constructor(private readonly createHandlers: CreateHandlers) {
    const port = 49152 + Math.floor(Math.random() * 16384);
    this.baseUrl = `http://localhost:${port}`;
  }

  async start(): Promise<void> {
    let security: JosePrivateFDC3Security;

    const port = parseInt(new URL(this.baseUrl).port, 10);
    const httpServer = createServer((req, res) => {
      if (req.url === '/.well-known/jwks.json') {
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

    await new Promise<void>(resolve => httpServer.listen(port, resolve));

    security = await createJosePrivateFDC3Security(
      this.baseUrl,
      url => provisionJWKS(url),
      () => true
    );

    setupWebsocketServer(
      httpServer,
      () => console.log('Client disconnected'),
      ws => this.createHandlers(ws, security)
    );

    this.security = security;
    this.httpServer = httpServer;
  }

  shutdown(): void {
    this.httpServer.close();
  }
}
