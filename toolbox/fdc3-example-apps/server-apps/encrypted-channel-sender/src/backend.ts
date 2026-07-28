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
 * Trusted-backend handlers for the encrypted-channel-sender app.
 *
 * Implements the FRONTEND KEY pattern (see frontend-encrypted-channel-example.ts): the
 * symmetric key is created and held entirely on the frontend. The broadcaster's backend
 * requires no custom handlers because:
 * - Symmetric key creation runs in the browser (via `EncryptedBroadcastSupport`).
 * - Encryption of each message also runs in the browser.
 * - Key request responses are handled by `BasicEncryptedBroadcaster` listening directly
 *   on the channel — no backend round-trip is needed.
 *
 * This backend exists only to serve the JWKS endpoint (so the receiver can verify
 * signed key responses) and to provide the secure-boundary WebSocket connection.
 *
 * Compare with `encrypted-channel-receiver/src/backend.ts`, which needs `exchangeData`
 * handlers for `sign-context` and `unwrap-symmetric-key` because the receiver delegates
 * those private-key operations to its backend.
 */
class BroadcastingAppBackendHandlers extends DefaultFDC3Handlers {}

/**
 * Express + WebSocket backend entry point.
 *
 * Sets up:
 * - `GET /.well-known/jwks.json` — publishes this app's public keys. These are embedded
 *   in the JWS protected header of each signed `fdc3.security.symmetricKeyResponse`, so
 *   the receiver knows which public key to use when verifying the response.
 * - Secure-boundary WebSocket server — minimal; no custom handlers beyond defaults.
 */
export default async function backend(
  app: Application,
  server: Server,
  opts: { port: number; appRoot: string }
): Promise<void> {
  const baseUrl = `http://localhost:${opts.port}`;

  // A private security instance is still required to generate and serve a stable key pair.
  // The signing capability is used by BasicEncryptedBroadcaster on the frontend
  // (which calls the public security methods) — the private key itself stays here.
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
    (_ws: WebSocket) => new BroadcastingAppBackendHandlers()
  );
}
