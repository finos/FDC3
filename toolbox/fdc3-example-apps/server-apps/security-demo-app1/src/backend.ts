import type { Application } from 'express';
import type { Server } from 'http';
import { WebSocket } from 'ws';
import { Channel } from '@finos/fdc3';
import { Context } from '@finos/fdc3-context';
import {
  AllowListFunction,
  createJosePrivateFDC3Security,
  createMetadataHandlerWithFDC3Version,
  DefaultFDC3Handlers,
  emitToClient,
  EXCHANGE_DATA,
  JosePrivateFDC3Security,
  PrivateEncryptedContextListenerSupport,
  provisionJWKS,
  SecurityAwareContextHandler,
  setupWebsocketServer,
  type MetadataHandler,
} from '@finos/fdc3-security';

/** Purpose string for server → client valuation push over the secure-boundary WebSocket. */
export const VALUATION_PUSH_PURPOSE = 'valuation-push';

/** Payload shape for the `request-prices` exchangeData call from the frontend. */
type RequestPricesPayload = {
  context?: Context;
  instrument?: Context;
  intent?: string;
};

/**
 * Trusted-backend handlers for Security POC 1 (buy-side app).
 *
 * Handles one `exchangeData` purpose:
 * - `'request-prices'`: signs the provided `fdc3.instrument` context so POC 2 can verify
 *   this request genuinely originated from this app.
 *
 * Handles one `handleRemoteChannel` purpose:
 * - `'demo.GetPrices'`: receives the PrivateChannel returned by POC 2 and attaches a
 *   `PrivateEncryptedContextListenerSupport` listener. Decrypted `fdc3.valuation` contexts
 *   are pushed to the browser over the WebSocket using {@link EXCHANGE_DATA}.
 */
class App1BackendHandlers extends DefaultFDC3Handlers {
  private readonly metadataHandler: MetadataHandler;

  constructor(
    private readonly security: JosePrivateFDC3Security,
    private readonly ws: WebSocket
  ) {
    super();
    this.metadataHandler = createMetadataHandlerWithFDC3Version('3.0');
  }

  async exchangeData(purpose: string, payload: unknown): Promise<unknown> {
    if (purpose === 'request-prices') {
      const body = payload as RequestPricesPayload;
      const instrument = body.context ?? body.instrument;
      if (!instrument || typeof instrument !== 'object') {
        return undefined;
      }
      try {
        const { signature, antiReplay } = await this.security.sign(instrument);
        return { signature, antiReplay };
      } catch (err) {
        console.error('request-prices error:', err);
        return undefined;
      }
    }

    return super.exchangeData(purpose, payload);
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    if (purpose !== 'demo.GetPrices') {
      return;
    }

    setTimeout(() => {
      void (async () => {
        try {
          const support = new PrivateEncryptedContextListenerSupport(this.security, this.metadataHandler);
          const valuationHandler: SecurityAwareContextHandler = (ctx, meta) => {
            emitToClient(this.ws, EXCHANGE_DATA, {
              purpose: VALUATION_PUSH_PURPOSE,
              payload: { ctx, meta },
            });
          };
          await support.addContextListener(channel, 'fdc3.valuation', valuationHandler);
        } catch (err) {
          console.error('handleRemoteChannel(demo.GetPrices) error:', err);
        }
      })();
    }, 0);
  }
}

export default async function backend(
  app: Application,
  server: Server,
  opts: { port: number; appRoot: string }
): Promise<void> {
  const baseUrl = `http://localhost:${opts.port}`;

  const allowListFunction: AllowListFunction = (jku: string, iss?: string) => {
    if (iss && !jku.startsWith(iss)) {
      return false;
    }
    return ['https://', 'http://localhost', 'http://127.0.0.1'].some(allowed => jku.startsWith(allowed));
  };

  const security = await createJosePrivateFDC3Security(
    baseUrl,
    url => provisionJWKS(url),
    allowListFunction,
    undefined,
    undefined,
    'app1-signing-key',
    'app1-wrapping-key'
  );

  app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });

  app.get('/.well-known/jwks.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ keys: security.getPublicKeys() });
  });

  setupWebsocketServer(
    server,
    () => {},
    (ws: WebSocket) => new App1BackendHandlers(security, ws)
  );
}
