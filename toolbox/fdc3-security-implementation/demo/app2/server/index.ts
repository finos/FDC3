import express from 'express';
import ViteExpress from 'vite-express';
import path from 'path';
import { createJoseFDC3Security, provisionJWKS } from '../../../src/JoseFDC3Security';

const PORT = 4004;
const app = express();

// Middleware to parse JSON
app.use(express.json());

let fdc3Security: any = null;

async function initializeFDC3Security() {
  try {
    const jwksUrl = `http://localhost:${PORT}/api/jwks`;
    const allowListFunction = (url: string) => {
      // For demo purposes, allow localhost URLs
      return url.includes('localhost') || url.includes('127.0.0.1');
    };

    fdc3Security = await createJoseFDC3Security(
      jwksUrl,
      provisionJWKS,
      allowListFunction,
      5 * 60, // 5 minutes validity
      'app2-signing-key',
      'app2-wrapping-key'
    );

    console.log('✅ JOSEFDC3Security initialized for App2');
  } catch (error) {
    console.error('❌ Failed to initialize JOSEFDC3Security:', error);
  }
}

// JWKS endpoint to expose public keys
app.get('/api/jwks', (req, res) => {
  if (!fdc3Security) {
    return res.status(503).json({ error: 'FDC3 Security not initialized' });
  }

  try {
    const publicKeys = fdc3Security.getPublicKeys();
    const jwks = {
      keys: publicKeys,
    };

    res.setHeader('Content-Type', 'application/json');
    res.json(jwks);
  } catch (error) {
    console.error('Error generating JWKS:', error);
    res.status(500).json({ error: 'Failed to generate JWKS' });
  }
});

// Initialize FDC3 Security before starting server
initializeFDC3Security().then(() => {
  // Start server with ViteExpress
  const httpServer = ViteExpress.listen(app, PORT, () => {
    console.log(`App2 server running on http://localhost:${PORT}`);
    console.log(`Serving static files from: ${path.join(__dirname, '../client/static')}`);
    console.log(`JWKS available at: http://localhost:${PORT}/api/jwks`);
  });
});

export default app;
