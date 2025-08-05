import { createJosePrivateFDC3Security } from '../../../../src/JosePrivateFDC3Security';
import { provisionJWKS } from '../../../../src/JosePublicFDC3Security';
import { PrivateFDC3Security } from '../../../../src/PrivateFDC3Security';
import express, { Express } from 'express';
import ViteExpress from 'vite-express';

export async function initializeServer(port: number): Promise<{ fdc3Security: PrivateFDC3Security; app: Express }> {
  const appUrl = `http://localhost:${port}`;
  const app = express();

  const allowListFunction = (jku: string, iss?: string) => {
    if (iss) {
      if (!jku.startsWith(iss)) {
        return false;
      }
    }

    // For demo purposes, allow localhost URLs
    // in production, this should be a more restrictive
    // allow list and only allow https URLs
    return jku.startsWith('http://localhost') || jku.startsWith('http://127.0.0.1');
  };

  const fdc3Security = await createJosePrivateFDC3Security(
    appUrl,
    provisionJWKS,
    allowListFunction,
    5 * 60, // 5 minutes validity
    'app1-signing-key',
    'app1-wrapping-key'
  );

  setupJWKSEndpoint(app, fdc3Security);

  ViteExpress.listen(app, port, () => {
    console.log('==========================================');
    console.log(`🚀 App running on ${appUrl}`);
    console.log('📋 Available endpoints:');
    console.log('   GET  /.well-known/jwks.json - Standard JWKS endpoint');
    console.log('==========================================');
  });

  return { fdc3Security, app };
}

function setupJWKSEndpoint(app: Express, fdc3Security: PrivateFDC3Security) {
  // .well-known/jwks.json endpoint (standard JWKS endpoint)
  app.get('/.well-known/jwks.json', (req, res) => {
    console.log('.well-known/jwks.json endpoint called');

    if (!fdc3Security) {
      console.log('FDC3 Security not initialized for .well-known/jwks.json request');
      return res.status(503).json({ error: 'FDC3 Security not initialized' });
    }

    try {
      const publicKeys = fdc3Security.getPublicKeys();
      const jwks = {
        keys: publicKeys,
      };

      console.log('.well-known/jwks.json generated successfully');
      res.setHeader('Content-Type', 'application/json');
      res.json(jwks);
    } catch (error) {
      console.error('Error generating .well-known/jwks.json:', error);
      res.status(500).json({ error: 'Failed to generate JWKS' });
    }
  });
}
