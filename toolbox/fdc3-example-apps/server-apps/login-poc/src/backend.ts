import type { Application } from 'express';
import type { Server } from 'http';
import { WebSocket } from 'ws';
import { Context, EncryptedContextWrapper, User } from '@finos/fdc3-context';
import {
  AllowListFunction,
  createJosePrivateFDC3Security,
  DefaultFDC3Handlers,
  isUser,
  JosePrivateFDC3Security,
  provisionJWKS,
  setupWebsocketServer,
} from '@finos/fdc3-security';

/**
 * Trusted-backend handlers for Login POC.
 *
 * Handles two `exchangeData` purposes:
 * - `'user-request'`: receives `fdc3.security.encryptedContext` (GetUser intent result),
 *   decrypts with this app's private key, verifies the JWT, and caches `fdc3.security.user`.
 *   When called with `fdc3.security.userRequest` only, returns the cached session if present.
 * - `'user-logout'`: clears the cached session.
 */
class LoginPocBackendHandlers extends DefaultFDC3Handlers {
  private user: User | null = null;

  constructor(private readonly security: JosePrivateFDC3Security) {
    super();
  }

  async exchangeData(purpose: string, payload: unknown): Promise<unknown> {
    if (purpose === 'user-request') {
      const ctx = payload as Context;

      if (ctx?.type === 'fdc3.security.userRequest') {
        return this.user ?? undefined;
      }

      if (this.user) {
        return this.user;
      }

      if (!ctx || typeof ctx !== 'object' || ctx.type !== 'fdc3.security.encryptedContext') {
        return undefined;
      }

      const enc = (ctx as EncryptedContextWrapper).encryptedPayload;
      if (!enc) {
        return undefined;
      }

      try {
        const decrypted = await this.security.decryptContextWithPrivateKey(enc);
        if (!isUser(decrypted)) {
          return undefined;
        }
        const jwtStr = decrypted.wrappedJwt;
        if (!jwtStr) {
          return undefined;
        }
        await this.security.verifyJWTToken(jwtStr);
        this.user = decrypted;
        return this.user;
      } catch (err) {
        console.error('user-request decrypt/verify error:', err);
        return undefined;
      }
    }

    if (purpose === 'user-logout') {
      this.user = null;
      return undefined;
    }

    return super.exchangeData(purpose, payload);
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
    'login-poc-signing-key',
    'login-poc-wrapping-key'
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
    (_ws: WebSocket) => new LoginPocBackendHandlers(security)
  );
}
