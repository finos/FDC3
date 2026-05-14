import type { Application } from 'express';
import type { Server } from 'http';
import { WebSocket } from 'ws';
import { Channel, IntentHandler, PrivateChannel } from '@finos/fdc3';
import { Context, Valuation } from '@finos/fdc3-context';
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
} from '@finos/fdc3-security';

/** Pushed to the App2 browser over the secure-boundary WebSocket when a valuation is broadcast on the private channel. */
export const VALUATION_PUSH_PURPOSE = 'valuation-push';

/**
 * App2: verifies signed `demo.GetPrices` context, returns a private channel result,
 * then broadcasts demo valuations on that channel and mirrors them to the connected client via {@link EXCHANGE_DATA}.
 */
class App2BackendHandlers extends DefaultFDC3Handlers {
  private readonly metadataHandler = new MetadataHandlerImpl(false);

  constructor(
    private readonly security: JosePrivateFDC3Security,
    private readonly ws: WebSocket
  ) {
    super();
  }

  async remoteIntentHandler(intent: string): Promise<IntentHandler> {
    if (intent !== 'demo.GetPrices') {
      return super.remoteIntentHandler(intent);
    }

    return async (ctx: Context, incomingMeta?: ContextMetadata): Promise<Context> => {
      const emptyMeta = {} as ContextMetadata;
      const { context, metadata } = this.metadataHandler.unpack(ctx, incomingMeta ?? emptyMeta);
      const md = metadata as ContextMetadata & {
        signature?: unknown;
        antiReplay?: unknown;
      };

      const auth = await this.security.verifySignature(md.signature as never, context, md.antiReplay as never);
      if (!auth.signed || !auth.trusted || !auth.valid) {
        return unauthorizedContext(context, 'Signature verification failed');
      }

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
        await channel.addContextListener('fdc3.valuation', async (ctx: Context, meta?: ContextMetadata) => {
          emitToClient(this.ws, EXCHANGE_DATA, {
            purpose: VALUATION_PUSH_PURPOSE,
            o: { ctx, meta },
          });
        });

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
              await pc.broadcast(valuation);
              console.log('[app2 backend] broadcast valuation', i);
            })();
          }, i * 1000);
        }

        setTimeout(() => {
          void pc.disconnect();
        }, 10000);
      })();
    }, 0);
  }
}

function unauthorizedContext(ctx: Context, reason: string): Context {
  return {
    type: 'fdc3.error',
    error: `${reason}: ${JSON.stringify(ctx)}`,
  } as Context;
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
