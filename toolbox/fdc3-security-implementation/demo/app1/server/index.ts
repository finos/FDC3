import express from 'express';
import ViteExpress from 'vite-express';
import path from 'path';
import { initializeServer, setupSessionHandlingEndpoints } from '../common/src/server';

initializeServer(4003).then(({ fdc3Security, app }) => {
  setupSessionHandlingEndpoints(app);

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
      const { jwtToken } = req.body;
      const jwtPayload = await fdc3Security.verifyJWTToken(jwtToken);

      console.log('JWT token validated successfully, storing in session');

      // Store in session
      req.session.jwtToken = jwtToken;
      req.session.userDetails = jwtPayload;
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
});
