import type { Application } from 'express';
import type { Server } from 'http';
import * as dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { WebSocket } from 'ws';
import { IntentHandler } from '@finos/fdc3';
import { Context, EncryptedContextWrapper, User } from '@finos/fdc3-context';
import {
  AllowListFunction,
  createJosePrivateFDC3Security,
  DefaultFDC3Handlers,
  isUser,
  isUserRequest,
  JosePrivateFDC3Security,
  provisionJWKS,
  setupWebsocketServer,
} from '@finos/fdc3-security';
import { loadEntraConfig, type EntraConfig } from './config';
import { JWTValidator } from './jwt-validator';

/** Standard intent name per FDC3 Security & Identity specification. */
export const GET_USER_INTENT = 'GetUser';

function resolveWithinRoot(root: string, ...segments: string[]): string {
  const normalizedRoot = fs.realpathSync(root);
  const suffix = segments.join('/');
  const resolvedPath = path.normalize(suffix ? `${normalizedRoot}/${suffix}` : normalizedRoot);
  if (resolvedPath !== normalizedRoot && !resolvedPath.startsWith(`${normalizedRoot}${path.sep}`)) {
    throw new Error(`Resolved path escapes app root: ${resolvedPath}`);
  }
  return resolvedPath;
}

/**
 * Entra-backed IDP: validates Microsoft ID tokens via {@link JWTValidator}, then issues
 * FDC3-encrypted user contexts for {@link GET_USER_INTENT} like the Sail IDP demo.
 */
class EntraBackendHandlers extends DefaultFDC3Handlers {
  private user: User | null = null;
  private readonly jwtValidator: JWTValidator;

  constructor(
    private readonly security: JosePrivateFDC3Security,
    private readonly issuerBaseUrl: string,
    entraConfig: EntraConfig
  ) {
    super();
    this.jwtValidator = new JWTValidator(entraConfig);
  }

  async exchangeData(purpose: string, payload: unknown): Promise<unknown> {
    const ctx = payload as Context;

    if (purpose === 'user-data' && isUser(ctx)) {
      const jwt = ctx.wrappedJwt;
      if (typeof jwt !== 'string' || !jwt.trim()) {
        console.error('user-data: missing wrappedJwt on fdc3.security.user');
        return;
      }
      const { valid, claims, error } = await this.jwtValidator.validateToken(jwt);
      if (error) {
        console.error('Invalid Microsoft Entra ID token:', error);
        return;
      }
      if (!valid || !claims) {
        console.error('Invalid Microsoft Entra ID token');
        return;
      }

      this.user = {
        type: 'fdc3.security.user',
        wrappedJwt: jwt,
        id: {
          email: (claims.email as string) || (claims.preferred_username as string) || '',
        },
        name: (claims.name as string) || (claims.given_name as string) || '',
      };
      return this.user;
    }

    if (purpose === 'user-request' && ctx.type === 'fdc3.security.userRequest') {
      return this.user ?? undefined;
    }

    if (purpose === 'user-logout') {
      this.user = null;
      return;
    }

    return super.exchangeData(purpose, payload);
  }

  async remoteIntentHandler(intent: string): Promise<IntentHandler> {
    if (intent !== GET_USER_INTENT) {
      return super.remoteIntentHandler(intent);
    }

    return async (context: Context): Promise<Context> => {
      if (!isUserRequest(context)) {
        throw new Error(`Expected fdc3.security.userRequest, got ${context.type}`);
      }
      if (!this.user) {
        throw new Error('No authenticated Entra user — sign in with Microsoft first');
      }

      const aud = context.aud;
      const sub =
        (typeof this.user.id?.email === 'string' && this.user.id.email) ||
        (typeof this.user.name === 'string' && this.user.name) ||
        'entra-user';

      const wrappedJwt = await this.security.createJWTToken(aud, sub);
      const userCtx: User = {
        type: 'fdc3.security.user',
        id: this.user.id,
        name: this.user.name,
        wrappedJwt,
      };

      const requestingAppJwksUrl = `${aud.replace(/\/$/, '')}/.well-known/jwks.json`;
      const encryptedPayload = await this.security.encryptPublicKey(userCtx, requestingAppJwksUrl);

      const encryptedContext: EncryptedContextWrapper = {
        type: 'fdc3.security.encryptedContext',
        originalType: 'fdc3.security.user',
        encryptedPayload,
        id: { kid: 'user-identity' },
      };
      return encryptedContext;
    };
  }
}

export default async function backend(
  app: Application,
  server: Server,
  opts: { port: number; appRoot: string }
): Promise<void> {
  const appRoot = fs.realpathSync(opts.appRoot);
  dotenv.config({ path: resolveWithinRoot(appRoot, '.env') });

  const entraConfig = loadEntraConfig(appRoot);
  const baseUrl = `http://localhost:${opts.port}`;

  app.use(express.json());

  app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });

  app.get('/api/config', (_req, res) => {
    res.json(entraConfig);
  });

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
    'entra-signing-key',
    'entra-wrapping-key'
  );

  app.get('/.well-known/jwks.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ keys: security.getPublicKeys() });
  });

  setupWebsocketServer(
    server,
    () => {},
    (_ws: WebSocket) => new EntraBackendHandlers(security, baseUrl, entraConfig)
  );
}
