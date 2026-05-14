import type { Application } from 'express';
import type { Server } from 'http';
import { WebSocket } from 'ws';
import { Channel, IntentHandler } from '@finos/fdc3';
import { Context } from '@finos/fdc3-context';
import type { ContextMetadata } from '@finos/fdc3-standard';
import {
  AllowListFunction,
  createJosePrivateFDC3Security,
  DefaultFDC3Handlers,
  emitToClient,
  EXCHANGE_DATA,
  JosePrivateFDC3Security,
  MetadataHandlerImpl,
  provisionJWKS,
  setupWebsocketServer,
  type JSONWebEncryption,
} from '@finos/fdc3-security';

/** Legacy name; valuations are pushed over the secure-boundary WebSocket with purpose {@link VALUATION_PUSH_PURPOSE}. */
export const GET_PRICES_PURPOSE = 'price-stream';

export const VALUATION_PUSH_PURPOSE = 'valuation-push';

/** Session after decrypting IDP response (matches `fdc3.security.user`; see get-user-example.ts). */
type App1UserSession = Context & { type: 'fdc3.security.user'; jwt?: unknown };

type RequestPricesPayload = {
  context?: Context;
  instrument?: Context;
  intent?: string;
};

/**
 * App1 secure-boundary handlers: CreateIdentityToken follow-up (`user-request` exchangeData), signed request-prices for demo.GetPrices,
 * and valuation notifications from the private channel (server → client via EXCHANGE_DATA push).
 */
class App1BackendHandlers extends DefaultFDC3Handlers {
  private user: App1UserSession | null = null;
  private readonly metadataHandler = new MetadataHandlerImpl(true);

  constructor(
    private readonly security: JosePrivateFDC3Security,
    private readonly ws: WebSocket
  ) {
    super();
  }

  async exchangeData(purpose: string, o: object): Promise<object | void> {
    if (purpose === 'user-request') {
      if (this.user) {
        return this.user;
      }

      const ctx = o as Context;
      if (ctx.type === 'fdc3.security.encryptedContext') {
        const enc = (ctx as { encryptedPayload?: JSONWebEncryption }).encryptedPayload;
        if (!enc) {
          return undefined;
        }
        try {
          const decrypted = await this.security.decryptContextWithPrivateKey(enc);
          if (decrypted.type !== 'fdc3.security.user') {
            return undefined;
          }
          const jwtVal = (decrypted as App1UserSession).jwt;
          if (jwtVal == null) {
            return undefined;
          }
          const jwtStr = typeof jwtVal === 'string' ? jwtVal : JSON.stringify(jwtVal);
          await this.security.verifyJWTToken(jwtStr);
          this.user = decrypted as App1UserSession;
          return this.user;
        } catch {
          return undefined;
        }
      }

      return undefined;
    }

    if (purpose === 'user-logout') {
      this.user = null;
      return undefined;
    }

    if (purpose === 'request-prices') {
      const body = o as RequestPricesPayload;
      const instrument = body.context ?? body.instrument;
      if (!instrument || typeof instrument !== 'object') {
        return undefined;
      }

      const { signature, antiReplay } = await this.security.sign(instrument);
      const packedMeta = { signature, antiReplay } as unknown as ContextMetadata;
      const { context: signed } = this.metadataHandler.pack(instrument, packedMeta);
      return signed;
    }

    return super.exchangeData(purpose, o);
  }

  async remoteIntentHandler(intent: string): Promise<IntentHandler> {
    return super.remoteIntentHandler(intent);
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    if (purpose !== 'demo.GetPrices') {
      return;
    }

    // Defer addContextListener until after the secure-boundary server has ack'd
    // HANDLE_REMOTE_CHANNEL; otherwise the client stays blocked in exchange() and never
    // answers addContextListenerRequest (timeout on addContextListenerResponse).
    setTimeout(() => {
      void (async () => {
        await channel.addContextListener('fdc3.valuation', async (ctx: Context, meta?: ContextMetadata) => {
          emitToClient(this.ws, EXCHANGE_DATA, {
            purpose: VALUATION_PUSH_PURPOSE,
            o: { ctx, meta },
          });
        });
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
