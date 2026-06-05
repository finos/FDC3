import type { Application } from 'express';
import type { Server } from 'http';
import { WebSocket } from 'ws';
import { IntentHandler } from '@finos/fdc3';
import { Context } from '@finos/fdc3-context';
import {
  AllowListFunction,
  createJosePrivateFDC3Security,
  DefaultFDC3Handlers,
  JosePrivateFDC3Security,
  provisionJWKS,
  setupWebsocketServer,
} from '@finos/fdc3-security';

/** Standard intent name; matches FDC3 Security & Identity docs and get-user-example.ts */
export const CREATE_IDENTITY_TOKEN = 'CreateIdentityToken';

/**
 * IDP secure-boundary: {@link CREATE_IDENTITY_TOKEN} returns `fdc3.security.encryptedContext`
 * wrapping an encrypted `fdc3.security.user` (see fdc3-security/samples/get-user-example.ts).
 */
class IDPBackendHandlers extends DefaultFDC3Handlers {
  private demoUser: Context | null = null;

  constructor(
    private readonly security: JosePrivateFDC3Security,
    private readonly issuerBaseUrl: string
  ) {
    super();
  }

  async exchangeData(purpose: string, o: object): Promise<object | void> {
    const ctx = o as Context;
    if (purpose === 'user-request' && ctx.type === 'fdc3.security.userRequest') {
      if (!this.demoUser) {
        const jwt = await this.security.createJWTToken(this.issuerBaseUrl, 'demo-user@example.com');
        this.demoUser = {
          type: 'fdc3.security.user',
          id: { email: 'demo-user@example.com' },
          name: 'Mr Demo User',
          jwt,
        };
      }
      return this.demoUser;
    }
    if (purpose === 'user-logout') {
      this.demoUser = null;
      return;
    }
    return super.exchangeData(purpose, o);
  }

  async remoteIntentHandler(intent: string): Promise<IntentHandler> {
    if (intent !== CREATE_IDENTITY_TOKEN) {
      return super.remoteIntentHandler(intent);
    }
    return async (context: Context): Promise<Context> => {
      if (context.type !== 'fdc3.security.userRequest') {
        throw new Error(`Expected fdc3.security.userRequest, got ${context.type}`);
      }
      const aud = (context as unknown as { aud: string }).aud;
      const jwt = await this.security.createJWTToken(aud, 'demo-user@example.com');
      const user: Context = {
        type: 'fdc3.security.user',
        id: { email: 'demo-user@example.com' },
        name: 'Demo User',
        jwt,
      };
      const requestingAppJwksUrl = `${aud.replace(/\/$/, '')}/.well-known/jwks.json`;
      const encryptedPayload = await this.security.encryptPublicKey(user, requestingAppJwksUrl);
      return {
        type: 'fdc3.security.encryptedContext',
        originalType: 'fdc3.security.user',
        encryptedPayload,
        id: { kid: 'user-identity' },
      };
    };
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
    'idp-signing-key',
    'idp-wrapping-key'
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
    (_ws: WebSocket) => new IDPBackendHandlers(security, baseUrl)
  );
}
