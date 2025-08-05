import express from 'express';
import ViteExpress from 'vite-express';
import path from 'path';
import session from 'express-session';
import { initializeServer } from '../common/src/server';

// Extend session interface to include JWT token
declare module 'express-session' {
  interface SessionData {
    userId: string;
    isAuthenticated: boolean;
    jwtToken?: string;
    userDetails?: any;
  }
}

initializeServer(4003).then(({ fdc3Security, app }) => {
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
});
