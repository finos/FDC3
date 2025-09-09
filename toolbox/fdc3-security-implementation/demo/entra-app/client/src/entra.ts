import { DesktopAgent, Context, ContextMetadata, User } from '@finos/fdc3';
import { createLogEntry, updateStatus, clearLog } from '../../../app1/common/src/logging';
import { initializeFDC3 } from '../../../app1/common/src/fdc3';
import { FDC3Handlers } from '../../../../src/helpers/FDC3Handlers';
import { connectRemoteHandlers } from '../../../../src/helpers/ClientSideHandlersImpl';
import { setupSessionStatusButton, showAuthenticatedState } from '../../../app1/common/src/session-logic';
import { PublicClientApplication, Configuration, AuthenticationResult } from '@azure/msal-browser';
import { getEntraConfig } from '../../src/config';

// MSAL instance will be created after configuration is loaded
let msalInstance: PublicClientApplication;

// Function to load configuration and create MSAL config
async function loadConfiguration(): Promise<Configuration> {
  const config = await getEntraConfig();

  // Create MSAL configuration
  const msalConfig: Configuration = {
    auth: {
      clientId: config.clientId,
      authority: config.authority,
      redirectUri: config.redirectUri,
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false,
    },
  };

  createLogEntry('info', 'Configuration loaded', config);
  return msalConfig;
}

// Setup FDC3 event listeners
async function setupLoginButton(handlers: FDC3Handlers): Promise<void> {
  const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
  loginBtn.addEventListener('click', async () => {
    try {
      createLogEntry('info', 'Starting Microsoft Entra login', '');

      // Perform Microsoft Entra login using popup
      const loginRequest = {
        scopes: ['User.Read'],
        prompt: 'select_account',
      };

      const authResult: AuthenticationResult = await msalInstance.loginPopup(loginRequest);
      createLogEntry('success', 'Microsoft Entra login successful', authResult.account);

      // Send authentication result to server
      try {
        await fetch('/api/auth/entra', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            account: authResult.account,
            idToken: authResult.idToken,
          }),
        });
        createLogEntry('info', 'Authentication data sent to server', '');
      } catch (error) {
        createLogEntry('warning', 'Failed to send auth data to server', (error as Error).message);
      }

      // Create FDC3 User object from Microsoft account
      const fdc3User: User = {
        type: 'fdc3.user',
        id: {
          email: authResult.account?.username || '',
        },
        name: authResult.account?.name || authResult.account?.username || '',
        jwt: authResult.idToken, // Use the ID token as JWT
      };

      // Listen for GetUser intent events
      const result = await handlers.exchangeData('user-request', {
        type: 'fdc3.user.request',
      });

      if (result?.type === 'fdc3.user') {
        showAuthenticatedState(result as User);
        createLogEntry('success', 'FDC3 User context created', result);
      } else {
        createLogEntry('success', 'User Logged out', ``);
        showAuthenticatedState(null);
      }
    } catch (error) {
      console.error('Microsoft Entra login error:', error);
      createLogEntry('error', 'Microsoft Entra Login Error', (error as Error).message);
      throw error;
    }
  });
}

async function setupLogoutButton(handlers: FDC3Handlers): Promise<void> {
  const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
  logoutBtn.addEventListener('click', async () => {
    try {
      // Get current account
      const currentAccount = msalInstance.getActiveAccount();

      if (currentAccount) {
        // Logout from Microsoft Entra
        const logoutRequest = {
          account: currentAccount,
          postLogoutRedirectUri: window.location.origin,
        };

        await msalInstance.logoutPopup(logoutRequest);
        createLogEntry('info', 'Microsoft Entra logout successful', '');
      }

      // Logout from FDC3
      await handlers.exchangeData('user-logout', { type: 'fdc3.user.logout' });
      showAuthenticatedState(null);
      createLogEntry('success', 'FDC3 logout successful', '');
    } catch (error) {
      console.error('Logout error:', error);
      createLogEntry('error', 'Logout Error', (error as Error).message);
    }
  });
}

async function setupLoginIntentHandler(fdc3: DesktopAgent, handlers: FDC3Handlers): Promise<void> {
  const intentHandler = await handlers.remoteIntentHandler('GetUser');

  fdc3.addIntentListener('GetUser', async (context: Context, metadata: ContextMetadata | undefined) => {
    createLogEntry('info', 'GetUser intent received', context);

    // Check if user is authenticated with Microsoft Entra
    const account = msalInstance.getActiveAccount();
    if (!account) {
      throw new Error('User not authenticated with Microsoft Entra');
    }

    const ss = await intentHandler(context, metadata);
    createLogEntry('success', 'GetUser intent result', ss);
    return ss;
  });
}

// Initialize the application
async function initialize(): Promise<void> {
  // Load configuration and create MSAL config
  const msalConfig = await loadConfiguration();

  // Create MSAL instance with loaded configuration
  msalInstance = new PublicClientApplication(msalConfig);

  // Initialize MSAL
  await msalInstance.initialize();

  // Check if user is already logged in
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
    createLogEntry('info', 'User already authenticated', accounts[0]);
  }

  // Initialize FDC3
  const fdc3 = await initializeFDC3();

  connectRemoteHandlers('http://localhost:4006', fdc3, async () => {}).then(remoteHandlers => {
    setupSessionStatusButton(remoteHandlers);
    setupLogoutButton(remoteHandlers);
    setupLoginButton(remoteHandlers);
    showAuthenticatedState(null);
    setupLoginIntentHandler(fdc3, remoteHandlers);

    createLogEntry('info', 'Microsoft Entra App Initialized', 'Application ready');
  });
}

// Make functions available globally for HTML event handlers
(window as any).clearLog = clearLog;
(window as any).updateStatus = updateStatus;

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);
