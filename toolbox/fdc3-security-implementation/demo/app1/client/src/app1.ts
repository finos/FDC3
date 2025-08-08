import { DesktopAgent, getAgent, User } from '@finos/fdc3';
import { createLogEntry, updateStatus } from '../../common/src/logging';
import { checkSessionStatus, setupSessionStatusButton, logout } from '../../common/src/session';
import { connectRemoteDesktopAgent } from '../../../../src/helpers/ClientSideHandlers';
import { Socket } from 'socket.io-client';

// Initialize FDC3 connection
async function initializeFDC3() {
  try {
    updateStatus('connecting', 'Connecting to FDC3 Agent...');
    createLogEntry('info', '🚀 Connecting to FDC3 Agent...', {
      status: 'Initializing',
      timestamp: new Date().toISOString(),
    });

    const fdc3 = await getAgent();

    updateStatus('connected', 'Connected to FDC3 Agent');
    createLogEntry('success', '✅ Connected to FDC3 Agent successfully', {
      agent: 'FDC3 Agent',
      timestamp: new Date().toISOString(),
      capabilities: 'Available',
    });

    return fdc3;
  } catch (error) {
    updateStatus('error', 'FDC3 Connection Failed');
    createLogEntry('error', '❌ Failed to connect to FDC3 Agent', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

// Function to raise GetUser intent
async function raiseGetUserIntent(socket: Socket) {
  try {
    createLogEntry('info', '🔐 Raising GetUser Intent...', {
      intent: 'GetUser',
      timestamp: new Date().toISOString(),
    });

    const response = await socket.emitWithAck('get_user');

    createLogEntry('success', '✅ GetUser endpoint called successfully', response);
  } catch (error) {
    createLogEntry('error', '❌ Failed to call GetUser endpoint', {
      intent: 'GetUser',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
  }
}

// Function to raise demo.GetPrices intent
async function raiseGetPricesIntent(fdc3: any) {
  try {
    createLogEntry('info', '📊 Raising demo.GetPrices Intent...', {
      intent: 'demo.GetPrices',
      timestamp: new Date().toISOString(),
    });

    const result = await fdc3.raiseIntent('demo.GetPrices');

    createLogEntry('success', '✅ demo.GetPrices Intent raised successfully', {
      intent: 'demo.GetPrices',
      result: result,
      timestamp: new Date().toISOString(),
    });

    return result;
  } catch (error) {
    createLogEntry('error', '❌ Failed to raise demo.GetPrices Intent', {
      intent: 'demo.GetPrices',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

// Set up button event listeners
function setupButtonListeners(socket: Socket) {
  const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
  const pricesBtn = document.getElementById('prices-btn') as HTMLButtonElement;
  const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;

  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      try {
        loginBtn.disabled = true;
        loginBtn.textContent = '🔄 Processing...';
        await raiseGetUserIntent(socket);
      } catch (error) {
        console.error('Login intent failed:', error);
      } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = '🔐 Login (GetUser Intent)';
      }
    });
  }

  // if (pricesBtn) {
  //   pricesBtn.addEventListener('click', async () => {
  //     try {
  //       pricesBtn.disabled = true;
  //       pricesBtn.textContent = '🔄 Processing...';
  //       await raiseGetPricesIntent(fdc3);
  //     } catch (error) {
  //       console.error('GetPrices intent failed:', error);
  //     } finally {
  //       pricesBtn.disabled = false;
  //       pricesBtn.textContent = '📊 Get Prices (demo.GetPrices Intent)';
  //     }
  //   });
  // }

  // Setup session status button using shared module
  setupSessionStatusButton();
}

// Main initialization
initializeFDC3()
  .then(async fdc3 => {
    // Check initial session status
    try {
      await checkSessionStatus();
    } catch (error) {
      console.error('Failed to check initial session status:', error);
    }

    createLogEntry('info', '🎯 App1 ready - buttons are now active', {
      status: 'Ready',
      buttons: ['Login', 'Get Prices', 'Check Session Status', 'Logout'],
      timestamp: new Date().toISOString(),
    });

    connectRemoteDesktopAgent(fdc3).then(socket => {
      setupButtonListeners(socket);
    });
  })
  .catch(error => {
    console.error('Failed to initialize app1:', error);
  });
