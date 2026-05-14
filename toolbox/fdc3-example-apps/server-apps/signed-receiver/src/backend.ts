import type { Application } from 'express';
import type { Server } from 'http';
import { WebSocket } from 'ws';
import {
  createJosePrivateFDC3Security,
  DefaultFDC3Handlers,
  provisionJWKS,
  setupWebsocketServer,
} from '@finos/fdc3-security';

/**
 * Receiver backend: JWKS + secure-boundary WebSocket only (App B in signing-broadcast-example).
 * Verification uses the signer's jku from each message; no exchangeData handlers required.
 */
class SignedReceiverBackendHandlers extends DefaultFDC3Handlers {}

export default async function backend(
  app: Application,
  server: Server,
  opts: { port: number; appRoot: string }
): Promise<void> {
  const baseUrl = `http://localhost:${opts.port}`;
  const security = await createJosePrivateFDC3Security(
    baseUrl,
    url => provisionJWKS(url),
    () => true
  );

  app.get('/.well-known/jwks.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ keys: security.getPublicKeys() });
  });

  setupWebsocketServer(
    server,
    () => {},
    (_ws: WebSocket) => new SignedReceiverBackendHandlers()
  );
}
