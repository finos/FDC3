// IDP App Client Implementation
import { DesktopAgent, getAgent, Context, ContextMetadata, User } from '@finos/fdc3';
import { createLogEntry, updateStatus, clearLog } from '../../../app1/common/src/logging';
import { initializeFDC3 } from '../../../app1/common/src/fdc3';
import { FDC3Handlers } from '../../../../src/helpers/FDC3Handlers';
import { connectRemoteHandlers } from '../../../../src/helpers/ClientSideHandlersImpl';
import {
  setupLogoutButton,
  setupSessionStatusButton,
  showAuthenticatedState,
} from '../../../app1/common/src/AbstractSessionHandlingBusinessLogic';

// Setup FDC3 event listeners
async function setupLoginButton(handlers: FDC3Handlers): Promise<void> {
  const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
  loginBtn.addEventListener('click', async () => {
    try {
      // Listen for GetUser intent events
      const result = await handlers.exchangeData({
        type: 'fdc3.user.request',
      });

      if (result?.type === 'fdc3.user') {
        showAuthenticatedState(result as User);
        createLogEntry('success', 'Login successful', result);
      } else {
        createLogEntry('success', 'User Logged out', ``);
        showAuthenticatedState(null);
      }
    } catch (error) {
      console.error('GetUser intent error:', error);
      createLogEntry('error', 'GetUser Intent Error', (error as Error).message);
      throw error;
    }
  });
}

// Initialize the application
async function initialize(): Promise<void> {
  // Initialize FDC3
  const fdc3 = await initializeFDC3();

  connectRemoteHandlers('http://localhost:4005').then(remoteHandlers => {
    setupSessionStatusButton(remoteHandlers);
    setupLogoutButton(remoteHandlers);
    setupLoginButton(remoteHandlers);
    showAuthenticatedState(null);

    createLogEntry('info', 'IDP App Initialized', 'Application ready');
  });
}

// Make functions available globally for HTML event handlers
(window as any).clearLog = clearLog;
(window as any).updateStatus = updateStatus;

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);
