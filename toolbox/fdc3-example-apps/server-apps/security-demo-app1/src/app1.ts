import { AntiReplayClaims, DesktopAgent, DetachedSignature, PrivateChannel } from '@finos/fdc3';
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

/** Standard intent name per FDC3 Security & Identity specification. */
const GET_USER_INTENT = 'GetUser';

function wsUrlForPage(): string {
  return (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host;
}

/**
 * Login flow — raises the GetUser intent to authenticate the user.
 *
 * Steps:
 * 1. Raise GetUser with a signed `fdc3.security.userRequest` (aud = this app's origin).
 *    The identity provider app verifies our signature, mints a JWT, and returns it as
 *    `fdc3.security.encryptedContext` so only this app can decrypt it.
 * 2. Pass the encrypted result to this app's backend (`user-request` exchangeData).
 *    The backend decrypts it with our private key and verifies the JWT signature.
 * 3. On success the backend returns the `fdc3.security.user` session.
 */
async function raiseGetUserIntent(fdc3: DesktopAgent, remoteHandlers: FDC3Handlers, loginBtn: HTMLButtonElement) {
  try {
    loginBtn.disabled = true;
    loginBtn.textContent = '🔄 Processing...';

    const userRequest: Context = {
      type: 'fdc3.security.userRequest',
      aud: window.location.origin,
    };

    createLogEntry('info', `✅ Raising ${GET_USER_INTENT} intent`, {
      result: userRequest,
      timestamp: new Date().toISOString(),
    });

    const resolution = await fdc3.raiseIntent(GET_USER_INTENT, userRequest);

    // getResult() returns IntentResult — expect fdc3.security.encryptedContext here.
    const intentResult = await resolution.getResult();

    createLogEntry('info', `✅ ${GET_USER_INTENT} intent resolved`, {
      result: intentResult,
      timestamp: new Date().toISOString(),
    });

    // Pass the encrypted context to the backend for decryption and JWT verification.
    // The backend returns the decrypted fdc3.security.user session on success.
    const userSession = await remoteHandlers.exchangeData('user-request', intentResult as object);

    if (userSession) {
      createLogEntry('success', '✅ User decrypted and JWT verified (app1 backend)', {
        result: userSession,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    createLogEntry('error', `❌ Failed to raise ${GET_USER_INTENT} intent`, {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = '🔐 Login (GetUser)';
  }
}

/**
 * Get Prices flow — raises the demo.GetPrices intent to request an encrypted price stream.
 *
 * Steps:
 * 1. Ask the backend to sign the instrument context (`request-prices` exchangeData).
 *    Signing happens server-side so the private key never enters the browser.
 * 2. Raise demo.GetPrices with the signed instrument and await the intent resolution.
 *    App2 verifies the signature and returns a PrivateChannel.
 * 3. Forward the PrivateChannel to the backend (`handleRemoteChannel('demo.GetPrices')`).
 *    The backend sets up `PrivateEncryptedContextListenerSupport` on the channel and pushes
 *    decrypted valuations to the browser via EXCHANGE_DATA server → client push.
 */
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
      id: { ticker: 'AAPL' },
      name: 'Apple Inc.',
    };

    // Sign the instrument on the backend — the signature proves to App2 that this
    // request genuinely came from App1.
    const signResult = (await remoteHandlers.exchangeData('request-prices', {
      context: instrument,
      intent: 'demo.GetPrices',
    })) as { signature: DetachedSignature; antiReplay: AntiReplayClaims };
    const { signature, antiReplay } = signResult;

    const resolution = await fdc3.raiseIntent('demo.GetPrices', instrument, null, { signature, antiReplay });

    const intentResult = await resolution.getResult();

    createLogEntry('success', '✅ demo.GetPrices Intent raised successfully', {
      intent: 'demo.GetPrices',
      result: intentResult,
      timestamp: new Date().toISOString(),
    });

    if (intentResult?.type == 'private') {
      // App2 returned a PrivateChannel. Forward it to our backend so it can listen
      // for encrypted valuations and push them to us via the WebSocket.
      const pc: PrivateChannel = intentResult as PrivateChannel;
      remoteHandlers.handleRemoteChannel('demo.GetPrices', pc);
    } else {
      createLogEntry('error', '❌ Did not receive private channel', {
        intent: 'demo.GetPrices',
        error: intentResult,
        timestamp: new Date().toISOString(),
      });
    }

    createLogEntry('info', '🔍 Waiting for context listener to be called...', {
      timestamp: new Date().toISOString(),
    });

    return intentResult;
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

/** Wires up the Login and Get Prices button click handlers. */
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

  setupSessionStatusButton(remoteHandlers);
}

/**
 * Handles server → client push messages from the backend over the secure-boundary WebSocket.
 * `valuation-push` messages carry decrypted `fdc3.valuation` contexts from the private channel.
 * Legacy `__encrypted` messages indicate an in-flight context that has not yet been decrypted
 * (the backend is still negotiating the symmetric key).
 */
function handleReturnedMessage(msg: ExchangeDataMessage): void {
  if (msg.purpose === VALUATION_PUSH_PURPOSE) {
    const o = msg.o as { ctx?: Context; meta?: unknown };
    const ctx = o.ctx;
    createLogEntry('success', '✅ Decrypted A Price', {
      context: ctx,
      metadata: o.meta,
      timestamp: new Date().toISOString(),
    });
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
