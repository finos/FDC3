import type { Application } from 'express';
import type { Server } from 'http';
import { WebSocket } from 'ws';
import { Channel, IntentHandler } from '@finos/fdc3';
import { Context, EncryptedContextWrapper, User, UserRequest } from '@finos/fdc3-context';
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

/** The purpose string used to check/restore a user session via exchangeData. */
export const GET_PRICES_PURPOSE = 'price-stream';

/** Purpose string for server → client valuation push over the secure-boundary WebSocket. */
export const VALUATION_PUSH_PURPOSE = 'valuation-push';

/** Payload shape for the `request-prices` exchangeData call from the frontend. */
type RequestPricesPayload = {
  context?: Context;
  instrument?: Context;
  intent?: string;
};

/**
 * Trusted-backend handlers for App1 (buy-side app).
 *
 * Handles three `exchangeData` purposes:
 * - `'user-request'`: receives a `fdc3.security.encryptedContext` (the GetUser intent result),
 *   decrypts it with this app's private key, verifies the embedded JWT against the identity
 *   provider app's JWKS, and caches the resulting `fdc3.security.user` session.
 * - `'user-logout'`: clears the cached session.
 * - `'request-prices'`: signs the provided `fdc3.instrument` context so App2 can verify
 *   this request genuinely originated from App1.
 *
 * Handles one `handleRemoteChannel` purpose:
 * - `'demo.GetPrices'`: receives the PrivateChannel returned by App2 and attaches a
 *   `PrivateEncryptedContextListenerSupport` listener. Decrypted `fdc3.valuation` contexts
 *   are pushed to the browser over the WebSocket using {@link EXCHANGE_DATA}.
 */
class App1BackendHandlers extends DefaultFDC3Handlers {
  private user: User | null = null;
  private readonly metadataHandler: MetadataHandler;

  constructor(
    private readonly security: JosePrivateFDC3Security,
    private readonly ws: WebSocket
  ) {
    super();
    this.metadataHandler = createMetadataHandlerWithFDC3Version('3.0');
  }

  async exchangeData(purpose: string, o: object): Promise<object | void> {
    if (purpose === 'user-request') {
      // Return cached session immediately if already authenticated.
      if (this.user) {
        return this.user;
      }

      const ctx = o as Context;
      if (ctx.type === 'fdc3.security.encryptedContext') {
        const enc = (ctx as EncryptedContextWrapper).encryptedPayload;
        if (!enc) {
          return undefined;
        }
        try {
          // Decrypt the JWE using this app's private key to obtain fdc3.security.user.
          const decrypted = await this.security.decryptContextWithPrivateKey(enc);
          if (decrypted.type !== 'fdc3.security.user') {
            return undefined;
          }
          const user = decrypted as unknown as User;
          const jwtStr = user.wrappedJwt;
          if (!jwtStr) {
            return undefined;
          }
          // Verify the JWT signature against the identity provider app's JWKS.
          await this.security.verifyJWTToken(jwtStr);
          this.user = decrypted as unknown as User;
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
      // Sign the instrument so App2 can verify this request came from App1.
      const { signature, antiReplay } = await this.security.sign(instrument);
      return { signature, antiReplay };
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
        const support = new PrivateEncryptedContextListenerSupport(this.security, this.metadataHandler);
        const valuationHandler: SecurityAwareContextHandler = (ctx, meta) => {
          emitToClient(this.ws, EXCHANGE_DATA, {
            purpose: VALUATION_PUSH_PURPOSE,
            o: { ctx, meta },
          });
        };
        await support.addContextListener(channel, 'fdc3.valuation', valuationHandler);
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
