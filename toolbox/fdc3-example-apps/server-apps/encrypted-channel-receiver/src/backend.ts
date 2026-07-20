import type { Application } from 'express';
import type { Server } from 'http';
import { WebSocket } from 'ws';
import { Context } from '@finos/fdc3-context';
import {
  createJosePrivateFDC3Security,
  DefaultFDC3Handlers,
  JosePrivateFDC3Security,
  provisionJWKS,
  setupWebsocketServer,
} from '@finos/fdc3-security';

/**
 * Trusted-backend handlers for the encrypted-channel-receiver app.
 *
 * Implements the FRONTEND KEY pattern (see frontend-encrypted-channel-example.ts): the
 * symmetric key is unwrapped once on this backend (the only operation requiring the private
 * key), then returned to the frontend for low-latency per-message decryption in the browser.
 *
 * Two `exchangeData` purposes are handled:
 * - `'sign-context'`: signs a `fdc3.security.symmetricKeyRequest` context on the backend
 *   so the broadcaster can verify this app's identity before releasing the key.
 * - `'unwrap-symmetric-key'`: decrypts the JWE-wrapped symmetric key using this app's
 *   private key and returns the unwrapped key to the frontend.
 *
 * The private key never reaches the browser — only the resulting symmetric key is returned,
 * and it is short-lived and session-scoped.
 */
class ReceivingAppBackendHandlers extends DefaultFDC3Handlers {
  constructor(private security: JosePrivateFDC3Security) {
    super();
  }

  async exchangeData(purpose: string, payload: unknown): Promise<unknown> {
    try {
      if (purpose === 'sign-context') {
        // Sign the symmetricKeyRequest so the broadcaster can verify our identity
        // before wrapping and sending the symmetric key.
        const { context } = payload as { context: Context };
        return await this.security.sign(context);
      }
      if (purpose === 'unwrap-symmetric-key') {
        // Unwrap the JWE-wrapped symmetric key using our private key.
        // The unwrapped key is returned to the frontend for in-browser decryption.
        return await this.security.unwrapSymmetricKey(
          payload as Parameters<JosePrivateFDC3Security['unwrapSymmetricKey']>[0]
        );
      }
    } catch (err) {
      console.error('exchangeData(%s) error:', purpose, err);
      return undefined;
    }
  }
}

/**
 * Express + WebSocket backend entry point.
 *
 * Sets up:
 * - `GET /.well-known/jwks.json` — publishes this app's public keys. The broadcaster
 *   fetches this JWKS (via the `jku` in the signed key request) to obtain the public key
 *   used to wrap the symmetric key so only this app can unwrap it.
 * - Secure-boundary WebSocket server — each connection gets a fresh
 *   `ReceivingAppBackendHandlers` instance bound to the shared security object.
 */
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
    (ws: WebSocket) => new ReceivingAppBackendHandlers(security)
  );
}
