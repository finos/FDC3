import { DesktopAgent, PrivateChannel } from '@finos/fdc3';
import type { Context } from '@finos/fdc3-context';
import type { AntiReplayClaims, DetachedSignature } from '@finos/fdc3-standard';
import { connectRemoteHandlers, type ExchangeDataMessage, type FDC3Handlers } from '@finos/fdc3-security';
import { createLogEntry } from '../../../common/src/security-demo/logging';
import { initializeFDC3 } from '../../../common/src/security-demo/fdc3';

/** Must match `VALUATION_PUSH_PURPOSE` in `src/backend.ts`. */
const VALUATION_PUSH_PURPOSE = 'valuation-push';

function wsUrlForPage(): string {
  return (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host;
}

/**
 * Get Prices flow — raises the demo.GetPrices intent to request an encrypted price stream.
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

    const signResult = (await remoteHandlers.exchangeData('request-prices', {
      context: instrument,
      intent: 'demo.GetPrices',
    })) as { signature?: DetachedSignature; antiReplay?: AntiReplayClaims } | undefined;
    if (!signResult?.signature || !signResult?.antiReplay) {
      createLogEntry('error', '❌ Backend failed to sign instrument for demo.GetPrices', {
        intent: 'demo.GetPrices',
        timestamp: new Date().toISOString(),
      });
      return;
    }
    const { signature, antiReplay } = signResult;

    const resolution = await fdc3.raiseIntent('demo.GetPrices', instrument, null, undefined, { signature, antiReplay });

    const intentResult = await resolution.getResult();

    createLogEntry('success', '✅ demo.GetPrices Intent raised successfully', {
      intent: 'demo.GetPrices',
      result: intentResult,
      timestamp: new Date().toISOString(),
    });

    if (intentResult?.type == 'private') {
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

function setupButtonListeners(fdc3: DesktopAgent, remoteHandlers: FDC3Handlers) {
  const pricesBtn = document.getElementById('prices-btn') as HTMLButtonElement;

  if (pricesBtn) {
    pricesBtn.addEventListener('click', async () => {
      await raiseGetPricesIntent(fdc3, remoteHandlers, pricesBtn);
    });
  }
}

function handleReturnedMessage(msg: ExchangeDataMessage): void {
  if (msg.purpose === VALUATION_PUSH_PURPOSE) {
    const { ctx, meta } = msg.payload as { ctx?: Context; meta?: unknown };
    createLogEntry('success', '✅ Decrypted A Price', {
      context: ctx,
      metadata: meta,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if ((msg.payload as Context & { __encrypted?: string }).__encrypted) {
    createLogEntry('error', '❌ Got An Encrypted Price - Will Request Channel Key', {
      context: msg.payload,
      timestamp: new Date().toISOString(),
    });
  } else {
    createLogEntry('success', '✅ Got A Price', {
      context: msg.payload,
      timestamp: new Date().toISOString(),
    });
  }
}

initializeFDC3()
  .then(async fdc3 => {
    createLogEntry('info', '🎯 Security POC 1 ready', {
      status: 'Ready',
      buttons: ['Get Prices'],
      timestamp: new Date().toISOString(),
    });

    connectRemoteHandlers(wsUrlForPage(), fdc3, async msg => {
      handleReturnedMessage(msg);
    }).then(remoteHandlers => {
      setupButtonListeners(fdc3, remoteHandlers);
    });
  })

  .catch(error => {
    console.error('Failed to initialize Security POC 1:', error);
  });
