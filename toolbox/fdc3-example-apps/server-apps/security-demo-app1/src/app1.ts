import { DesktopAgent, PrivateChannel } from '@finos/fdc3';
import type { Context } from '@finos/fdc3-context';
import { connectRemoteHandlers, type ExchangeDataMessage, type FDC3Handlers } from '@finos/fdc3-security';
import { createLogEntry } from '../../../common/src/security-demo/logging';
import {
  checkSessionStatus,
  setupSessionStatusButton,
  setupLogoutButton,
} from '../../../common/src/security-demo/session-logic';
import { initializeFDC3 } from '../../../common/src/security-demo/fdc3';

/** Must match `VALUATION_PUSH_PURPOSE` in `src/backend.ts`. */
const VALUATION_PUSH_PURPOSE = 'valuation-push';

/** Standard intent; matches fdc3-security/samples/get-user-example.ts */
const CREATE_IDENTITY_TOKEN = 'CreateIdentityToken';

function wsUrlForPage(): string {
  return (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host;
}

async function raiseCreateIdentityTokenIntent(
  fdc3: DesktopAgent,
  remoteHandlers: FDC3Handlers,
  loginBtn: HTMLButtonElement
) {
  try {
    loginBtn.disabled = true;
    loginBtn.textContent = '🔄 Processing...';

    const userRequest: Context = {
      type: 'fdc3.security.userRequest',
      aud: window.location.origin,
    };

    createLogEntry('info', `✅ Raising ${CREATE_IDENTITY_TOKEN} intent`, {
      result: userRequest,
      timestamp: new Date().toISOString(),
    });

    const resolution = await fdc3.raiseIntent(CREATE_IDENTITY_TOKEN, userRequest);

    const result1 = (await resolution.getResult()) as Context;

    createLogEntry('info', `✅ ${CREATE_IDENTITY_TOKEN} intent resolved`, {
      result: result1,
      timestamp: new Date().toISOString(),
    });

    const result2 = await remoteHandlers.exchangeData('user-request', result1);

    if (result2) {
      createLogEntry('success', '✅ User decrypted and JWT verified (app1 backend)', {
        result: result2,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    createLogEntry('error', `❌ Failed to raise ${CREATE_IDENTITY_TOKEN} intent`, {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = '🔐 Login (CreateIdentityToken)';
  }
}

async function raiseGetPricesIntent(fdc3: DesktopAgent, remoteHandlers: FDC3Handlers, pricesBtn: HTMLButtonElement) {
  try {
    pricesBtn.disabled = true;
    pricesBtn.textContent = '🔄 Processing...';

    createLogEntry('info', '📊 Raising demo.GetPrices Intent...', {
      intent: 'demo.GetPrices',
      timestamp: new Date().toISOString(),
    });

    const instrument: Context = {
      type: 'fdc3.instrument',
      id: {
        ticker: 'AAPL',
      },
      name: 'Apple Inc.',
    };

    const signedInstrument = (await remoteHandlers.exchangeData('request-prices', {
      context: instrument,
      intent: 'demo.GetPrices',
    })) as Context;

    const resolution = await fdc3.raiseIntent('demo.GetPrices', signedInstrument);

    const result = await resolution.getResult();

    createLogEntry('success', '✅ demo.GetPrices Intent raised successfully', {
      intent: 'demo.GetPrices',
      result: result,
      timestamp: new Date().toISOString(),
    });

    if (result?.type == 'private') {
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

function setupButtonListeners(fdc3: DesktopAgent, remoteHandlers: FDC3Handlers) {
  const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
  const pricesBtn = document.getElementById('prices-btn') as HTMLButtonElement;

  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      await raiseCreateIdentityTokenIntent(fdc3, remoteHandlers, loginBtn);
    });
  }

  if (pricesBtn) {
    pricesBtn.addEventListener('click', async () => {
      await raiseGetPricesIntent(fdc3, remoteHandlers, pricesBtn);
    });
  }

  setupSessionStatusButton(remoteHandlers);
}

function handleReturnedMessage(msg: ExchangeDataMessage): void {
  if (msg.purpose === VALUATION_PUSH_PURPOSE) {
    const o = msg.o as { ctx?: Context; meta?: unknown };
    const ctx = o.ctx;
    if (!ctx) return;
    if ((ctx as Context & { __encrypted?: string }).__encrypted) {
      createLogEntry('error', '❌ Got An Encrypted Price - Will Request Channel Key', {
        context: ctx,
        timestamp: new Date().toISOString(),
      });
    } else {
      createLogEntry('success', '✅ Got A Price', {
        context: ctx,
        timestamp: new Date().toISOString(),
      });
    }
    return;
  }

  if ((msg.o as Context & { __encrypted?: string }).__encrypted) {
    createLogEntry('error', '❌ Got An Encrypted Price - Will Request Channel Key', {
      context: msg.o,
      timestamp: new Date().toISOString(),
    });
  } else {
    createLogEntry('success', '✅ Got A Price', {
      context: msg.o,
      timestamp: new Date().toISOString(),
    });
  }
}

initializeFDC3()
  .then(async fdc3 => {
    createLogEntry('info', '🎯 App1 ready - buttons are now active', {
      status: 'Ready',
      buttons: ['Login', 'Get Prices', 'Check Session Status', 'Logout'],
      timestamp: new Date().toISOString(),
    });

    connectRemoteHandlers(wsUrlForPage(), fdc3, async msg => {
      handleReturnedMessage(msg);
    }).then(remoteHandlers => {
      setupButtonListeners(fdc3, remoteHandlers);
      setupSessionStatusButton(remoteHandlers);
      setupLogoutButton(remoteHandlers);
      checkSessionStatus(remoteHandlers);
    });
  })

  .catch(error => {
    console.error('Failed to initialize app1:', error);
  });
