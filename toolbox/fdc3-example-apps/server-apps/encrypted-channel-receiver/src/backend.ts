import type { Application } from 'express';
import type { Server } from 'http';
import { WebSocket } from 'ws';
import { Context } from '@finos/fdc3-context';
import {
  createJosePrivateFDC3Security,
  DefaultFDC3Handlers,
  JosePrivateFDC3Security,
  provisionJWKS,
  setupWebsocketServer,
} from '@finos/fdc3-security';

/**
 * Receiving app backend – provides sign-context (for key requests) and unwrap-symmetric-key via exchangeData.
 * The symmetric key is unwrapped on the backend; decryption happens on the front-end.
 */
class ReceivingAppBackendHandlers extends DefaultFDC3Handlers {
  constructor(private security: JosePrivateFDC3Security) {
    super();
  }

  async exchangeData(purpose: string, o: object): Promise<object | void> {
    if (purpose === 'sign-context') {
      const { context } = o as { context: Context };
      return await this.security.sign(context);
    }
    if (purpose === 'unwrap-symmetric-key') {
      return await this.security.unwrapSymmetricKey(o as Parameters<JosePrivateFDC3Security['unwrapSymmetricKey']>[0]);
    }
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

  app.get('/.well-known/jwks.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ keys: security.getPublicKeys() });
  });

  setupWebsocketServer(
    server,
    () => {},
    (ws: WebSocket) => new ReceivingAppBackendHandlers(security)
  );
}
