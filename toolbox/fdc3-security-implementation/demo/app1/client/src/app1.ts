import { DesktopAgent, getAgent, User } from '@finos/fdc3';
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

    // First, get the context to be signed
    const context = {
      type: 'fdc3.user.request',
      aud: 'http://localhost:4003',
    };

    // Call backend to sign the request
    createLogEntry('info', '🔑 Requesting signature from backend...', {
      endpoint: '/api/sign_get_user_request',
      timestamp: new Date().toISOString(),
    });

    const signedRequest = await fetch('/api/sign_get_user_request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ context }),
    });

    if (!signedRequest.ok) {
      throw new Error(`Failed to sign request: ${signedRequest.statusText}`);
    }

    const { signature, intent, context: signedContext } = await signedRequest.json();

    createLogEntry('success', '✅ Request signed successfully', {
      signature: signature.substring(0, 50) + '...',
      intent,
      timestamp: new Date().toISOString(),
    });

    // Create the signed context with the signature embedded
    const contextWithSignature = {
      ...signedContext,
      __signature: signature,
    };

    // Now raise the intent with the signed context
    const result = await fdc3.raiseIntent('GetUser', contextWithSignature);
    const userDetails = (await result.getResult()) as User;

    createLogEntry('success', '✅ GetUser Intent raised successfully', {
      intent: 'GetUser',
      result: userDetails,
      timestamp: new Date().toISOString(),
    });

    // If we received a JWT token from the IDP app, store it in the session
    if (userDetails && typeof userDetails === 'object' && 'jwt' in userDetails) {
      const jwtToken = userDetails.jwt;
      createLogEntry('info', '🔐 Storing JWT token in session...', {
        tokenLength: jwtToken.length,
        timestamp: new Date().toISOString(),
      });

      try {
        const storeResponse = await fetch('/api/store_jwt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jwtToken,
            userDetails: userDetails,
          }),
        });

        if (!storeResponse.ok) {
          throw new Error(`Failed to store JWT in session: ${storeResponse.statusText}`);
        }

        const storeResult = await storeResponse.json();

        if (storeResult.success) {
          createLogEntry('success', '✅ JWT token stored in session successfully', {
            user: storeResult.user,
            message: storeResult.message,
            timestamp: new Date().toISOString(),
          });
        } else {
          createLogEntry('error', '❌ Failed to store JWT token in session', {
            error: storeResult.error,
            details: storeResult.details,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        createLogEntry('error', '❌ Failed to store JWT token in session', {
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        });
      }
    }

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

// Function to check session status
async function checkSessionStatus() {
  try {
    createLogEntry('info', '🔍 Checking session status...', {
      timestamp: new Date().toISOString(),
    });

    const response = await fetch('/api/session/status');

    if (!response.ok) {
      throw new Error(`Failed to check session status: ${response.statusText}`);
    }

    const sessionStatus = await response.json();

    createLogEntry(
      'info',
      `📋 Session status: ${sessionStatus.isAuthenticated ? 'Authenticated' : 'Not authenticated'}`,
      {
        isAuthenticated: sessionStatus.isAuthenticated,
        hasJWT: sessionStatus.hasJWT,
        user: sessionStatus.user,
        timestamp: new Date().toISOString(),
      }
    );

    return sessionStatus;
  } catch (error) {
    createLogEntry('error', '❌ Failed to check session status', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

// Function to logout
async function logout() {
  try {
    createLogEntry('info', '🚪 Logging out...', {
      timestamp: new Date().toISOString(),
    });

    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to logout: ${response.statusText}`);
    }

    const logoutResult = await response.json();

    if (logoutResult.success) {
      createLogEntry('success', '✅ Logged out successfully', {
        message: logoutResult.message,
        timestamp: new Date().toISOString(),
      });
    } else {
      createLogEntry('error', '❌ Logout failed', {
        error: logoutResult.error,
        timestamp: new Date().toISOString(),
      });
    }

    return logoutResult;
  } catch (error) {
    createLogEntry('error', '❌ Failed to logout', {
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
  const sessionStatusBtn = document.getElementById('session-status-btn') as HTMLButtonElement;
  const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;

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

  if (sessionStatusBtn) {
    sessionStatusBtn.addEventListener('click', async () => {
      try {
        sessionStatusBtn.disabled = true;
        sessionStatusBtn.textContent = '🔄 Checking...';
        await checkSessionStatus();
      } catch (error) {
        console.error('Session status check failed:', error);
      } finally {
        sessionStatusBtn.disabled = false;
        sessionStatusBtn.textContent = '🔍 Check Session Status';
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        logoutBtn.disabled = true;
        logoutBtn.textContent = '🔄 Logging out...';
        await logout();
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        logoutBtn.disabled = false;
        logoutBtn.textContent = '🚪 Logout';
      }
    });
  }
}

// Main initialization
initializeFDC3()
  .then(async fdc3 => {
    setupButtonListeners(fdc3);

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
  })
  .catch(error => {
    console.error('Failed to initialize app1:', error);
  });
