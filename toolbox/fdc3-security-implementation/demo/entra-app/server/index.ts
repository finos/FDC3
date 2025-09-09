import { initializeServer } from '../../app1/common/src/server';
import { setupWebsocketServer } from '../../../src/helpers/ServerSideHandlersImpl';
import { EntraBusinessLogic } from './EntraBusinessLogic';
import { getEntraConfig } from '../src/config';
import * as dotenv from 'dotenv';
import * as path from 'path';
import express from 'express';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

// Extend session interface
declare module 'express-session' {
  interface SessionData {
    userId: string;
    jwt: string;
    isAuthenticated: boolean;
  }
}

const PORT = 4006;

// Store business logic instances for authentication updates
const businessLogicInstances = new Map<string, EntraBusinessLogic>();

initializeServer(PORT).then(({ fdc3Security, app, server }) => {
  // Add JSON body parser middleware
  app.use(express.json());

  // Add configuration endpoint
  app.get('/api/config', (req, res) => {
    const config = getEntraConfig();

    console.log('Serving configuration:', config);
    res.json(config);
  });

  // // Add authentication endpoint
  // app.post('/api/auth/entra', async (req, res) => {
  //     const { account, idToken } = req.body;

  //     console.log('Received Microsoft Entra authentication:', {
  //         username: account?.username,
  //         name: account?.name,
  //         hasToken: !!idToken,
  //     });

  //     // Update all business logic instances with the new user data
  //     const updatePromises = Array.from(businessLogicInstances.values()).map(businessLogic =>
  //         businessLogic.updateUserFromEntraAuth(account, idToken)
  //     );

  //     try {
  //         const results = await Promise.all(updatePromises);
  //         const successCount = results.filter(result => result).length;
  //         const totalCount = results.length;

  //         console.log(`Updated ${successCount}/${totalCount} business logic instances`);

  //         if (successCount === 0) {
  //             return res.status(400).json({
  //                 success: false,
  //                 error: 'Failed to validate Microsoft Entra token'
  //             });
  //         }

  //         res.json({ success: true, updatedInstances: successCount });
  //     } catch (error) {
  //         console.error('Error updating business logic instances:', error);
  //         res.status(500).json({
  //             success: false,
  //             error: 'Internal server error during authentication'
  //         });
  //     }
  // });

  setupWebsocketServer(
    server,
    _s => {
      console.log('Websocket server disconnected');
    },
    socket => {
      // Create business logic instance with JWT signature verification enabled
      const businessLogic = new EntraBusinessLogic(fdc3Security);

      // Store the business logic instance for authentication updates
      businessLogicInstances.set(socket.id, businessLogic);
      return businessLogic;
    }
  );
});
