import type { Application } from 'express';
import type { Server } from 'http';
import { WebSocket } from 'ws';
import { Context, EncryptedContextWrapper, User } from '@finos/fdc3-context';
import {
  AllowListFunction,
  createJosePrivateFDC3Security,
  DefaultFDC3Handlers,
  isUserRequest,
  JosePrivateFDC3Security,
  provisionJWKS,
  setupWebsocketServer,
  type BackendIntentHandler,
} from '@finos/fdc3-security';

/** Standard intent name per FDC3 Security & Identity specification. */
export const GET_USER_INTENT = 'GetUser';

/**
 * Trusted-backend handlers for the identity provider app (demo).
 *
 * Handles two `exchangeData` purposes:
 * - `'user-login'`: creates (and caches) a demo `fdc3.security.user` session on first login.
 * - `'user-request'`: returns the cached session, if any (does not create one).
 * - `'user-logout'`: clears the cached session.
 *
 * Handles one `remoteIntentHandler` intent:
 * - `GetUser`: verifies the requesting application's `fdc3.security.userRequest` context
 *   type, mints a JWT scoped to the requesting app's audience (aud = the app's URL), encrypts
 *   the `fdc3.security.user` result with the requesting app's public key (JWE), and returns
 *   it as `fdc3.security.encryptedContext` so only the requesting app can decrypt it.
 */
class IDPBackendHandlers extends DefaultFDC3Handlers {
  private demoUser: User | null = null;

  constructor(
    private readonly security: JosePrivateFDC3Security,
    private readonly issuerBaseUrl: string
  ) {
    super();
  }

  async exchangeData(purpose: string, payload: unknown): Promise<unknown> {
    const ctx = payload as Context;
    if (purpose === 'user-login' && ctx.type === 'fdc3.security.userRequest') {
      if (!this.demoUser) {
        const wrappedJwt = await this.security.createJWTToken(this.issuerBaseUrl, 'demo-user@example.com');
        this.demoUser = {
          type: 'fdc3.security.user',
          id: { email: 'demo-user@example.com' },
          name: 'Mr Demo User',
          wrappedJwt,
        };
      }
      return this.demoUser;
    }
    if (purpose === 'user-request' && ctx.type === 'fdc3.security.userRequest') {
      return this.demoUser ?? undefined;
    }
    if (purpose === 'user-logout') {
      this.demoUser = null;
      return;
    }
    return super.exchangeData(purpose, payload);
  }

  async remoteIntentHandler(intent: string): Promise<BackendIntentHandler> {
    if (intent !== GET_USER_INTENT) {
      return super.remoteIntentHandler(intent);
    }
    return async (context: Context): Promise<Context | void> => {
      try {
        if (!isUserRequest(context)) {
          console.error(`GetUser: expected fdc3.security.userRequest, got ${context.type}`);
          return;
        }
        if (!this.demoUser) {
          console.error('GetUser: no authenticated user — log in first');
          return;
        }
        const aud = context.aud;

        const wrappedJwt = await this.security.createJWTToken(aud, 'demo-user@example.com');
        const user: User = {
          type: 'fdc3.security.user',
          id: this.demoUser.id,
          name: this.demoUser.name,
          wrappedJwt,
        };

        // Encrypt the fdc3.security.user with the requesting app's public key (JWE).
        // Only the requesting app — holding the corresponding private key — can decrypt it.
        const requestingAppJwksUrl = `${aud.replace(/\/$/, '')}/.well-known/jwks.json`;
        const encryptedPayload = await this.security.encryptPublicKey(user, requestingAppJwksUrl);

        const encryptedContext: EncryptedContextWrapper = {
          type: 'fdc3.security.encryptedContext',
          originalType: 'fdc3.security.user',
          encryptedPayload,
          id: { kid: 'user-identity' },
        };
        return encryptedContext;
      } catch (err) {
        console.error('GetUser handler error:', err);
        return;
      }
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
