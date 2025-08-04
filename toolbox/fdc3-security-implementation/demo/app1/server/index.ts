import express from 'express';
import ViteExpress from 'vite-express';
import path from 'path';
import session from 'express-session';
import { createJoseFDC3Security, provisionJWKS } from '../../../src/JoseFDC3Security';
import { FDC3Security } from '../../../src/FDC3Security';

// Extend session interface to include JWT token
declare module 'express-session' {
  interface SessionData {
    userId: string;
    isAuthenticated: boolean;
    jwtToken?: string;
    userDetails?: any;
  }
}

const PORT = 4003;
const app = express();
const appUrl = `http://localhost:${PORT}`;

// Session configuration
app.use(
  session({
    secret: 'fdc3-app1-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Middleware to parse JSON
app.use(express.json());

console.log('Session middleware configured for App1');

let fdc3Security: FDC3Security | null = null;

// Function to validate JWT token
async function validateJWTToken(jwtToken: string) {
  if (!fdc3Security) {
    throw new Error('FDC3 Security not initialized for JWT validation');
  }

  if (!jwtToken) {
    throw new Error('JWT token is required');
  }

  console.log('Validating JWT token...');
  const jwtPayload = await fdc3Security.verifyJWTToken(jwtToken);
  console.log('JWT token validated successfully');
  console.log('JWT payload:', jwtPayload);

  return jwtPayload;
}

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

// Store JWT token in session endpoint
app.post('/api/store_jwt', async (req, res) => {
  console.log('Store JWT endpoint called');
  console.log('Request body:', req.body);
  console.log('Session before storing JWT:', req.session);

  try {
    const { jwtToken, userDetails } = req.body;
    const jwtPayload = await validateJWTToken(jwtToken);

    console.log('JWT token validated successfully, storing in session');

    // Store in session
    req.session.jwtToken = jwtToken;
    req.session.userDetails = userDetails || jwtPayload;
    req.session.userId = (jwtPayload.sub as string) || (jwtPayload.userId as string) || 'unknown-user';
    req.session.isAuthenticated = true;

    console.log('Session after storing JWT:', req.session);

    res.json({
      success: true,
      message: 'JWT token stored in session successfully',
      user: {
        id: req.session.userId,
        details: req.session.userDetails,
      },
    });
  } catch (error) {
    console.error('Error storing JWT token:', error);
    res.status(400).json({
      success: false,
      error: 'Invalid JWT token',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Get session status endpoint
app.get('/api/session/status', (req, res) => {
  console.log('Session status endpoint called');
  console.log('Session:', req.session);

  if (req.session.isAuthenticated && req.session.jwtToken) {
    const response = {
      isAuthenticated: true,
      user: {
        id: req.session.userId,
        details: req.session.userDetails,
      },
      hasJWT: true,
    };
    console.log('User is authenticated with JWT, sending response:', response);
    res.json(response);
  } else {
    const response = {
      isAuthenticated: false,
      user: null,
      hasJWT: false,
    };
    console.log('User is not authenticated, sending response:', response);
    res.json(response);
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  console.log('Logout endpoint called');
  console.log('Session before logout:', req.session);

  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      res.status(500).json({ success: false, error: 'Failed to logout' });
    } else {
      console.log('Logout successful');
      res.json({ success: true, message: 'Logged out successfully' });
    }
  });
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
    console.log('   POST /api/store_jwt - Validate and store JWT token in session');
    console.log('   GET  /api/session/status - Get session status');
    console.log('   POST /api/logout - Logout and clear session');
    console.log('==========================================');
  });
});

export default app;
