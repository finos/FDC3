import { DesktopAgent, PrivateChannel } from '@robmoffat/fdc3';
import { createLogEntry } from '../../common/src/logging';
import { checkSessionStatus, setupSessionStatusButton, setupLogoutButton } from '../../common/src/session-logic';
import { FDC3Handlers } from '../../../../src/secure-boundary/FDC3Handlers';
import { connectRemoteHandlers } from '../../../../src/secure-boundary/ClientSideHandlersImpl';
import { Context, Instrument, UserRequest } from '@robmoffat/fdc3-context';
import { initializeFDC3 } from '../../common/src/fdc3';
import { ExchangeDataMessage } from '../../../../src/secure-boundary/MessageTypes';

async function raiseGetUserIntent(fdc3: DesktopAgent, remoteHandlers: FDC3Handlers, loginBtn: HTMLButtonElement) {
  try {
    loginBtn.disabled = true;
    loginBtn.textContent = '🔄 Processing...';

    const userRequest: UserRequest = {
      type: 'fdc3.security.userRequest',
      aud: 'http://localhost:4003',
      jku: 'http://localhost:4003/.well-known/jwks.json',
    };

    createLogEntry('info', '✅ Raising GetUser intent', {
      result: userRequest,
      timestamp: new Date().toISOString(),
    });

    const resolution = await fdc3.raiseIntent('GetUser', userRequest);

    const result1 = (await resolution.getResult()) as Context;

    createLogEntry('info', '✅ GetUser intent resolved successfully', {
      result: result1,
      timestamp: new Date().toISOString(),
    });

    const result2 = await remoteHandlers.exchangeData('user-request', result1);

    if (result2) {
      createLogEntry('success', '✅ User Decoded', {
        result: result2,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    createLogEntry('error', '❌ Failed to raise GetUser intent', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = '🔐 Login (GetUser Intent)';
  }
}

// Function to raise demo.GetPrices intent
async function raiseGetPricesIntent(fdc3: DesktopAgent, remoteHandlers: FDC3Handlers, pricesBtn: HTMLButtonElement) {
  try {
    pricesBtn.disabled = true;
    pricesBtn.textContent = '🔄 Processing...';

    createLogEntry('info', '📊 Raising demo.GetPrices Intent...', {
      intent: 'demo.GetPrices',
      timestamp: new Date().toISOString(),
    });

    const instrument: Instrument = {
      type: 'fdc3.instrument',
      id: {
        ticker: 'AAPL',
      },
      name: 'Apple Inc.',
    };

    const signedInstrument = (await remoteHandlers.exchangeData(
      'request-prices',
      instrument,
      'demo.GetPrices'
    )) as Context;
    const resolution = await fdc3.raiseIntent('demo.GetPrices', signedInstrument);

    const result = await resolution.getResult();

    createLogEntry('success', '✅ demo.GetPrices Intent raised successfully', {
      intent: 'demo.GetPrices',
      result: result,
      timestamp: new Date().toISOString(),
    });

    if (result?.type == 'private') {
      // ok, it's a private channel, this was expected
      const pc: PrivateChannel = result as PrivateChannel;
      remoteHandlers.handleRemoteChannel('demo.GetPrices', pc);
    } else {
      createLogEntry('error', '❌ Did not receive private channel', {
        intent: 'demo.GetPrices',
        error: result,
        timestamp: new Date().toISOString(),
      });
    }

    createLogEntry('info', '🔍 Waiting for context listener to be called...', {
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
  } finally {
    pricesBtn.disabled = false;
    pricesBtn.textContent = '📊 Get Prices (demo.GetPrices Intent)';
  }
}

// Set up button event listeners
function setupButtonListeners(fdc3: DesktopAgent, remoteHandlers: FDC3Handlers) {
  const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
  const pricesBtn = document.getElementById('prices-btn') as HTMLButtonElement;

  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      await raiseGetUserIntent(fdc3, remoteHandlers, loginBtn);
    });
  }

  if (pricesBtn) {
    pricesBtn.addEventListener('click', async () => {
      await raiseGetPricesIntent(fdc3, remoteHandlers, pricesBtn);
    });
  }

  // Setup session status button using shared module
  setupSessionStatusButton(remoteHandlers);
}

function handleReturnedMessage(msg: ExchangeDataMessage) {
  if (msg.ctx.__encrypted) {
    createLogEntry('error', '❌ Got An Encrypted Price - Will Request Channel Key', {
      context: msg.ctx,
      timestamp: new Date().toISOString(),
    });
  } else {
    createLogEntry('success', '✅ Got A Price', {
      context: msg.ctx,
      timestamp: new Date().toISOString(),
    });
  }
}

// Main initialization
initializeFDC3()
  .then(async fdc3 => {
    createLogEntry('info', '🎯 App1 ready - buttons are now active', {
      status: 'Ready',
      buttons: ['Login', 'Get Prices', 'Check Session Status', 'Logout'],
      timestamp: new Date().toISOString(),
    });

    connectRemoteHandlers('http://localhost:4003', fdc3, async msg => handleReturnedMessage(msg)).then(
      remoteHandlers => {
        setupButtonListeners(fdc3, remoteHandlers);
        setupSessionStatusButton(remoteHandlers);
        setupLogoutButton(remoteHandlers);
        checkSessionStatus(remoteHandlers);
      }
    );
  })

  .catch(error => {
    console.error('Failed to initialize app1:', error);
  });
