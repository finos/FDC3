import type { Application } from 'express';
import type { Server } from 'http';
import { WebSocket } from 'ws';
import { Channel } from '@finos/fdc3-standard';
import {
  BasicSignedBroadcaster,
  createJosePrivateFDC3Security,
  DefaultFDC3Handlers,
  JosePrivateFDC3Security,
  MetadataHandler,
  MetadataHandlerImpl,
  provisionJWKS,
  setupWebsocketServer,
  type SignedBroadcaster,
} from '@finos/fdc3-security';

/**
 * The `exchangeData` purpose string the frontend sends to trigger a signed broadcast.
 * Must match the constant of the same name in `index.tsx`.
 */
export const SIGNED_BROADCAST_TRIGGER = 'send-signed-fdc3-instrument';

/**
 * Trusted-backend handlers for the signed-sender app.
 *
 * Implements the BACKEND KEY pattern for signed broadcasts (see signing-broadcast-example.ts):
 * - `handleRemoteChannel('broadcast', channel)`: called by the frontend when the user joins
 *   a channel. Wraps the channel with `BasicSignedBroadcaster` so every outbound broadcast
 *   is signed with this app's private key on the server — the key never reaches the browser.
 * - `exchangeData(SIGNED_BROADCAST_TRIGGER)`: called by the frontend button press. Signs and
 *   broadcasts a sample `fdc3.instrument` on the wrapped channel.
 *
 * No private keys are exposed to the frontend; the JWKS endpoint publishes only the
 * corresponding public keys so receivers can verify signatures.
 */
class SignedSenderBackendHandlers extends DefaultFDC3Handlers {
  private signedBroadcaster: SignedBroadcaster | null = null;

  constructor(
    private readonly security: JosePrivateFDC3Security,
    private readonly metadataHandler: MetadataHandler
  ) {
    super();
  }

  /**
   * Receives the user channel from the frontend and wraps it with `BasicSignedBroadcaster`.
   * After this returns, any call to `exchangeData(SIGNED_BROADCAST_TRIGGER)` will sign and
   * broadcast on this channel.
   */
  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    if (purpose !== 'broadcast') return;
    this.signedBroadcaster = new BasicSignedBroadcaster(this.security, this.metadataHandler, channel);
  }

  /**
   * Handles the trigger from the frontend button. Signs and broadcasts a sample
   * `fdc3.instrument` context on the wrapped channel. Returns `{ ok: true }` on success
   * or `{ ok: false, error }` if no channel has been exported yet.
   */
  async exchangeData(purpose: string, _payload: unknown): Promise<unknown> {
    if (purpose === SIGNED_BROADCAST_TRIGGER) {
      if (!this.signedBroadcaster) {
        return {
          ok: false,
          error: 'Export the user channel first (open this app on a channel).',
        };
      }
      const instrument = {
        type: 'fdc3.instrument',
        id: { ticker: 'AAPL' },
        name: 'Apple Inc.',
      };
      // BasicSignedBroadcaster signs the context with this app's private key before
      // calling channel.broadcast — the DetachedSignature and AntiReplayClaims are
      // included in the broadcast metadata for receivers to verify.
      await this.signedBroadcaster.broadcast(instrument);
      return { ok: true };
    }
    return super.exchangeData(purpose, _payload);
  }
}

/**
 * Express + WebSocket backend entry point.
 *
 * Sets up:
 * - `GET /.well-known/jwks.json` — serves this app's public keys so receivers can
 *   verify signatures without any pre-configuration.
 * - Secure-boundary WebSocket server — each connection gets a fresh
 *   `SignedSenderBackendHandlers` instance.
 */
export default async function backend(
  app: Application,
  server: Server,
  opts: { port: number; appRoot: string }
): Promise<void> {
  const baseUrl = `http://localhost:${opts.port}`;

  // Create the private security instance. The allowListFunction here accepts all JWKS
  // origins — in production you would restrict this to known trusted URLs.
  const security = await createJosePrivateFDC3Security(
    baseUrl,
    url => provisionJWKS(url),
    () => true
  );

  // MetadataHandlerImpl(false) = FDC3 < 3.0 mode: metadata is embedded in the
  // context body under __appMeta rather than passed as a separate broadcast argument.
  const metadataHandler = new MetadataHandlerImpl(false);

  app.get('/.well-known/jwks.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ keys: security.getPublicKeys() });
  });

  setupWebsocketServer(
    server,
    () => {},
    (_ws: WebSocket) => new SignedSenderBackendHandlers(security, metadataHandler)
  );
}
