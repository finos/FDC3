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
 * Trusted-backend handlers for the signed-receiver app.
 *
 * The receiver needs no custom `exchangeData` or `handleRemoteChannel` handlers — it only
 * needs a JWKS endpoint so senders can verify signatures in the other direction if needed,
 * and a WebSocket connection so the frontend can use `connectRemoteHandlers`.
 *
 * Signature verification on received broadcasts is handled entirely on the frontend by
 * `PublicSignatureCheckingHandlerSupport`. The signer's public key is fetched automatically
 * from the `jku` URL embedded in each signature's JWS protected header — no pre-configuration
 * of trusted keys is required on this backend.
 */
class SignedReceiverBackendHandlers extends DefaultFDC3Handlers {}

/**
 * Express + WebSocket backend entry point.
 *
 * Sets up:
 * - `GET /.well-known/jwks.json` — publishes this app's public keys. These are used by the
 *   frontend's `PublicSignatureCheckingHandlerSupport` instance, which is initialised with
 *   this app's own JWKS URL as its `allowListFunction` seed.
 * - Secure-boundary WebSocket server — provides the `connectRemoteHandlers` transport;
 *   no custom handlers are needed beyond the defaults.
 */
export default async function backend(
  app: Application,
  server: Server,
  opts: { port: number; appRoot: string }
): Promise<void> {
  const baseUrl = `http://localhost:${opts.port}`;

  // Private security instance is created so we have a stable key pair and a JWKS
  // endpoint to publish. The signing capability is not used by this app directly —
  // only the public keys are served.
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
