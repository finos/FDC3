import express from 'express';
import ViteExpress from 'vite-express';
import path from 'path';
import { createJoseFDC3Security, provisionJWKS } from '../../../src/JoseFDC3Security';
import { FDC3Security } from '../../../src/FDC3Security';

const PORT = 4003;
const app = express();
const appUrl = `http://localhost:${PORT}`;

// Middleware to parse JSON
app.use(express.json());

let fdc3Security: FDC3Security | null = null;

async function initializeFDC3Security() {
  try {
    const allowListFunction = (url: string) => {
      // For demo purposes, allow localhost URLs
      console.log('allowListFunction called with url:', url);
      return url.includes('localhost') || url.includes('127.0.0.1');
    };

    fdc3Security = await createJoseFDC3Security(
      appUrl,
      provisionJWKS,
      allowListFunction,
      5 * 60, // 5 minutes validity
      'app1-signing-key',
      'app1-wrapping-key'
    );

    console.log('✅ JOSEFDC3Security initialized for App1');
  } catch (error) {
    console.error('❌ Failed to initialize JOSEFDC3Security:', error);
  }
}

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

// Sign GetUser intent request endpoint
app.post('/api/sign_get_user_request', async (req, res) => {
  console.log('Sign GetUser request endpoint called');
  console.log('Request body:', req.body);

  if (!fdc3Security) {
    console.log('FDC3 Security not initialized for signing request');
    return res.status(503).json({ error: 'FDC3 Security not initialized' });
  }

  try {
    const { context } = req.body;

    if (!context) {
      console.log('Context is missing from request');
      return res.status(400).json({ error: 'Context is required' });
    }

    console.log('Signing GetUser intent request with context:', context);

    // Sign the GetUser intent request
    const signature = await fdc3Security.sign(context, 'GetUser', null);

    console.log('Request signed successfully');
    console.log('Signature length:', signature.length);

    res.json({
      signature,
      intent: 'GetUser',
      context,
    });
  } catch (error) {
    console.error('Error signing GetUser request:', error);
    res.status(500).json({ error: 'Failed to sign request' });
  }
});

// Validate JWT token endpoint
app.post('/api/validate_jwt', async (req, res) => {
  console.log('Validate JWT endpoint called');
  console.log('Request body:', req.body);

  if (!fdc3Security) {
    console.log('FDC3 Security not initialized for JWT validation');
    return res.status(503).json({ error: 'FDC3 Security not initialized' });
  }

  try {
    const { jwtToken } = req.body;

    if (!jwtToken) {
      console.log('JWT token is missing from request');
      return res.status(400).json({ error: 'JWT token is required' });
    }

    console.log('Validating JWT token...');

    // Validate the JWT token and extract payload
    const jwtPayload = await fdc3Security.verifyJWTToken(jwtToken);

    console.log('JWT token validated successfully');
    console.log('JWT payload:', jwtPayload);

    res.json({
      valid: true,
      payload: jwtPayload,
      message: 'JWT token is valid',
    });
  } catch (error) {
    console.error('Error validating JWT token:', error);
    res.status(400).json({
      valid: false,
      error: 'Invalid JWT token',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Initialize FDC3 Security before starting server
initializeFDC3Security().then(() => {
  // Start server with ViteExpress
  const httpServer = ViteExpress.listen(app, PORT, () => {
    console.log('==========================================');
    console.log(`🚀 App1 server running on ${appUrl}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, '../client/static')}`);
    console.log('📋 Available endpoints:');
    console.log('   GET  /.well-known/jwks.json - Standard JWKS endpoint');
    console.log('   POST /api/sign_get_user_request - Sign GetUser intent requests');
    console.log('   POST /api/validate_jwt - Validate JWT tokens');
    console.log('==========================================');
  });
});

export default app;
