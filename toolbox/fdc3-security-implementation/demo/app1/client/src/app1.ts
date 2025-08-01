import { DesktopAgent, getAgent } from '@finos/fdc3';
import { createLogEntry, updateStatus } from '../../common/src/logging';

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
async function raiseGetUserIntent(fdc3: DesktopAgent) {
  try {
    createLogEntry('info', '🔐 Raising GetUser Intent...', {
      intent: 'GetUser',
      timestamp: new Date().toISOString(),
    });

    const result = await fdc3.raiseIntent('GetUser', {
      type: 'fdc3.user.request',
    });

    createLogEntry('success', '✅ GetUser Intent raised successfully', {
      intent: 'GetUser',
      result: result,
      timestamp: new Date().toISOString(),
    });

    return result;
  } catch (error) {
    createLogEntry('error', '❌ Failed to raise GetUser Intent', {
      intent: 'GetUser',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    throw error;
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
function setupButtonListeners(fdc3: any) {
  const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
  const pricesBtn = document.getElementById('prices-btn') as HTMLButtonElement;

  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      try {
        loginBtn.disabled = true;
        loginBtn.textContent = '🔄 Processing...';
        await raiseGetUserIntent(fdc3);
      } catch (error) {
        console.error('Login intent failed:', error);
      } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = '🔐 Login (GetUser Intent)';
      }
    });
  }

  if (pricesBtn) {
    pricesBtn.addEventListener('click', async () => {
      try {
        pricesBtn.disabled = true;
        pricesBtn.textContent = '🔄 Processing...';
        await raiseGetPricesIntent(fdc3);
      } catch (error) {
        console.error('GetPrices intent failed:', error);
      } finally {
        pricesBtn.disabled = false;
        pricesBtn.textContent = '📊 Get Prices (demo.GetPrices Intent)';
      }
    });
  }
}

// Main initialization
initializeFDC3()
  .then(fdc3 => {
    setupButtonListeners(fdc3);
    createLogEntry('info', '🎯 App1 ready - buttons are now active', {
      status: 'Ready',
      buttons: ['Login', 'Get Prices'],
      timestamp: new Date().toISOString(),
    });
  })
  .catch(error => {
    console.error('Failed to initialize app1:', error);
  });
