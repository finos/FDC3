import express from 'express';
import ViteExpress from 'vite-express';
import path from 'path';
import session from 'express-session';
import { FDC3Security } from '../../../src/FDC3Security';
import { createJoseFDC3Security, provisionJWKS } from '../../../src/JoseFDC3Security';
import { User } from '@finos/fdc3-context';

// Extend session interface
declare module 'express-session' {
  interface SessionData {
    userId: string;
    isAuthenticated: boolean;
  }
}

const PORT = 4005;
const app = express();
const appUrl = `http://localhost:${PORT}`;

// Session configuration
app.use(
  session({
    secret: 'fdc3-idp-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

console.log('Session middleware configured');

// Middleware to parse JSON
app.use(express.json());
console.log('JSON parsing middleware configured');

// Create Jose FDC3Security instance
let fdc3Security: FDC3Security | null = null;

async function initializeFDC3Security() {
  try {
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

    fdc3Security = await createJoseFDC3Security(
      appUrl,
      provisionJWKS,
      allowListFunction,
      5 * 60, // 5 minutes validity
      'idp-signing-key',
      'idp-wrapping-key'
    );

    console.log('✅ JOSEFDC3Security initialized for IDP App');
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

// Login endpoint
app.post('/api/login', (req, res) => {
  console.log('Login endpoint called');
  console.log('Request body:', req.body);
  console.log('Session before login:', req.session);

  // For demo purposes, always authenticate as 'demo-user'
  req.session.userId = 'demo-user';
  req.session.isAuthenticated = true;

  console.log('Session after login:', req.session);

  const response = {
    success: true,
    user: {
      id: 'demo-user',
      name: 'Demo User',
    },
  };

  console.log('Sending login response:', response);
  res.json(response);
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
      res.json({ success: true });
    }
  });
});

// Check authentication status
app.get('/api/auth/status', (req, res) => {
  console.log('Auth status endpoint called');
  console.log('Session:', req.session);
  console.log('Session ID:', req.sessionID);

  if (req.session.isAuthenticated) {
    const response = {
      isAuthenticated: true,
      user: {
        id: req.session.userId,
        name: 'Demo User',
      },
    };
    console.log('User is authenticated, sending response:', response);
    res.json(response);
  } else {
    const response = {
      isAuthenticated: false,
      user: null,
    };
    console.log('User is not authenticated, sending response:', response);
    res.json(response);
  }
});

// GetUser intent endpoint - handles GetUser intent requests
app.post('/api/getuser', async (req, res) => {
  try {
    console.log('GetUser intent endpoint called');
    console.log('Request body:', req.body);
    console.log('Session:', req.session);
    let userId: string | undefined;

    if (!req.session.isAuthenticated) {
      console.log('User not authenticated for GetUser intent');
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    } else {
      userId = req.session.userId;
    }

    // Validate signature if present
    const { context, metadata } = req.body;

    if (context && context.__signature && userId) {
      console.log('Validating signature for GetUser intent request');

      if (!fdc3Security) {
        console.log('FDC3 Security not initialized for signature validation');
        res.status(503).json({
          success: false,
          error: 'FDC3 Security not initialized',
        });
        return;
      }

      // Extract the signature and create unsigned context
      const signature = context.__signature;
      const unsignedContext = { ...context };
      delete unsignedContext.__signature;

      console.log('Validating signature:', signature.substring(0, 50) + '...');
      console.log('Unsigned context:', unsignedContext);

      // Validate the signature
      const authenticity = await fdc3Security.check(signature, unsignedContext, 'GetUser', null);

      console.log('Signature validation result:', authenticity);

      if (!authenticity.signed) {
        console.log('Request was not signed');
        res.status(400).json({
          success: false,
          error: 'Request must be signed',
        });
        return;
      }

      if (!authenticity.valid) {
        console.log('Signature validation failed:', authenticity);
        res.status(400).json({
          success: false,
          error: `Signature validation failed: ${authenticity}`,
        });
        return;
      }

      if (!authenticity.trusted) {
        console.log('Signature not from trusted source:', authenticity.publicKeyUrl);
        res.status(400).json({
          success: false,
          error: `Signature not from trusted source: ${authenticity.publicKeyUrl}`,
        });
        return;
      }

      console.log('✅ Signature validated successfully from:', authenticity.publicKeyUrl);

      // Create fdc3.user context object
      const userContext: User = {
        type: 'fdc3.user',
        id: { userId: req.session.userId },
        name: 'Demo User',
        jwt: await fdc3Security.createJWTToken(authenticity.publicKeyUrl, userId!),
      };

      console.log('Returning user context:', userContext);
      res.json({
        success: true,
        context: userContext,
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Request must be signed',
      });
      return;
    }
  } catch (error) {
    console.error('Error in get_user intent', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return;
  }
});

// Initialize FDC3 Security before starting server
initializeFDC3Security().then(() => {
  // Start server with ViteExpress
  const httpServer = ViteExpress.listen(app, PORT, () => {
    console.log('==========================================');
    console.log(`🚀 IDP App server running on ${appUrl}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, '..')}`);
    console.log('📋 Available endpoints:');
    console.log('   GET  /.well-known/jwks.json - JWKS endpoint');
    console.log('   POST /api/login - Login user');
    console.log('   POST /api/logout - Logout user');
    console.log('   GET  /api/auth/status - Check auth status');
    console.log('   POST /api/getuser - Handle GetUser intent');
    console.log('==========================================');
  });
});

export default app;
