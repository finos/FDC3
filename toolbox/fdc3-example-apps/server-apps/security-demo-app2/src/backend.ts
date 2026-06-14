import type { Application } from 'express';
import type { Server } from 'http';
import { WebSocket } from 'ws';
import { Channel, IntentHandler, PrivateChannel } from '@finos/fdc3';
import { Context, Valuation } from '@finos/fdc3-context';
import type { ContextMetadata } from '@finos/fdc3-standard';
import {
  AllowListFunction,
  createJosePrivateFDC3Security,
  createMetadataHandlerWithFDC3Version,
  DefaultFDC3Handlers,
  emitToClient,
  EncryptedBroadcastSupport,
  EXCHANGE_DATA,
  JosePrivateFDC3Security,
  provisionJWKS,
  setupWebsocketServer,
  type EncryptedBroadcaster,
  type MetadataHandler,
} from '@finos/fdc3-security';

/** Pushed to the App2 browser over the secure-boundary WebSocket when a valuation is broadcast on the private channel. */
export const VALUATION_PUSH_PURPOSE = 'valuation-push';

/**
 * Trusted-backend handlers for App2 (sell-side app).
 *
 * Handles one `remoteIntentHandler` intent:
 * - `'demo.GetPrices'`: verifies the JWS signature on the inbound `fdc3.instrument` context
 *   to confirm the request genuinely came from a trusted application. If valid, signals the
 *   frontend to create a PrivateChannel by returning `{ type: 'private' }`.
 *
 * Handles one `handleRemoteChannel` purpose:
 * - `'demo.GetPrices'`: receives the PrivateChannel created by the frontend, wraps it with
 *   `EncryptedBroadcastSupport`, and broadcasts five encrypted `fdc3.valuation` snapshots
 *   at one-second intervals. Each broadcast is also mirrored to the App2 browser via
 *   {@link EXCHANGE_DATA} push. After 10 seconds the broadcaster shuts down and the
 *   PrivateChannel is disconnected.
 */
class App2BackendHandlers extends DefaultFDC3Handlers {
  private readonly metadataHandler: MetadataHandler;

  constructor(
    private readonly security: JosePrivateFDC3Security,
    private readonly ws: WebSocket
  ) {
    super();
    this.metadataHandler = createMetadataHandlerWithFDC3Version('3.0');
  }

  async remoteIntentHandler(intent: string): Promise<IntentHandler> {
    if (intent !== 'demo.GetPrices') {
      return super.remoteIntentHandler(intent);
    }

    return async (ctx: Context, md: ContextMetadata): Promise<Context> => {
      // Verify the JWS signature on the inbound instrument to confirm the request
      // came from a trusted application. Reject if unsigned or untrusted.
      const auth = await this.security.verifySignature(md.signature, ctx, md.antiReplay);
      if (!auth.signed || !auth.trusted || !auth.valid) {
        return unauthorizedContext(ctx, 'Signature verification failed');
      }

      // Signal the frontend to create a PrivateChannel and call handleRemoteChannel.
      return { type: 'private' } as unknown as Context;
    };
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    if (purpose !== 'demo.GetPrices') {
      return;
    }

    const pc = channel as PrivateChannel;

    // Defer addContextListener until after the secure-boundary client has finished the
    // handleRemoteChannel exchange (same race as security-demo-app1 backend).
    setTimeout(() => {
      void (async () => {
        const broadcastSupport = new EncryptedBroadcastSupport(this.security, this.metadataHandler);
        const broadcaster: EncryptedBroadcaster = await broadcastSupport.broadcastWrapper(channel);

        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            void (async () => {
              const valuation: Valuation = {
                type: 'fdc3.valuation',
                currency: 'Dollars',
                CURRENCY_ISOCODE: 'USD',
                price: 100 + i,
                value: 100 + i,
              };
              await broadcaster.broadcast(valuation);
              emitToClient(this.ws, EXCHANGE_DATA, {
                purpose: VALUATION_PUSH_PURPOSE,
                o: { ctx: valuation },
              });
              console.log('[app2 backend] broadcast encrypted valuation', i);
            })();
          }, i * 1000);
        }

        setTimeout(() => {
          void (async () => {
            await broadcaster.shutdown();
            await pc.disconnect();
          })();
        }, 10000);
      })();
    }, 0);
  }
}

function unauthorizedContext(ctx: Context, reason: string): Context {
  return {
    type: 'fdc3.error',
    error: `${reason}: ${JSON.stringify(ctx)}`,
  };
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
    'app2-signing-key',
    'app2-wrapping-key'
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
    (ws: WebSocket) => new App2BackendHandlers(security, ws)
  );
}
