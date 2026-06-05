import type { Application } from 'express';
import type { Server } from 'http';
import { WebSocket } from 'ws';
import { Context } from '@finos/fdc3-context';
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

/** Client calls exchangeData with this purpose to broadcast the sample instrument (see signing-broadcast-example). */
export const SIGNED_BROADCAST_TRIGGER = 'send-signed-fdc3-instrument';

/**
 * Sender backend: receives user channel via handleRemoteChannel, wraps with BasicSignedBroadcaster (signing on server).
 */
class SignedSenderBackendHandlers extends DefaultFDC3Handlers {
  private signedBroadcaster: SignedBroadcaster | null = null;

  constructor(
    private readonly security: JosePrivateFDC3Security,
    private readonly metadataHandler: MetadataHandler
  ) {
    super();
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    if (purpose !== 'broadcast') return;
    this.signedBroadcaster = new BasicSignedBroadcaster(this.security, this.metadataHandler, channel);
  }

  async exchangeData(purpose: string, _o: object): Promise<object | void> {
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
      } as Context;
      await this.signedBroadcaster.broadcast(instrument);
      return { ok: true };
    }
    return super.exchangeData(purpose, _o);
  }
}

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
