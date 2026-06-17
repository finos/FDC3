import { DesktopAgent, Context, ContextMetadata } from '@finos/fdc3';
import { connectRemoteHandlers, type ExchangeDataMessage, type FDC3Handlers } from '@finos/fdc3-security';
import { createLogEntry } from '../../../common/src/security-demo/logging';
import { initializeFDC3, ensureContextMetadata } from '../../../common/src/security-demo/fdc3';

/** Must match `VALUATION_PUSH_PURPOSE` in `src/backend.ts`. */
const VALUATION_PUSH_PURPOSE = 'valuation-push';

function wsUrlForPage(): string {
  return (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host;
}

/**
 * Sets up the `demo.GetPrices` intent listener.
 *
 * The intent handler is obtained from the backend via `remoteIntentHandler` so that
 * signature verification runs server-side (private key never in the browser).
 * The handler receives the signed `fdc3.instrument` from App1, verifies the signature
 * on the backend, and returns a PrivateChannel result for the encrypted price stream.
 */
async function setupIntentListener(fdc3: DesktopAgent, remoteHandlers: FDC3Handlers): Promise<void> {
  const intentHandler = await remoteHandlers.remoteIntentHandler('demo.GetPrices');

  await fdc3.addIntentListener('demo.GetPrices', async (context: Context, metadata?: ContextMetadata) => {
    createLogEntry('info', 'demo.GetPrices intent received', context);
    const result = await intentHandler(context, ensureContextMetadata(metadata));
    createLogEntry('success', 'demo.GetPrices intent result', result);
    return result;
  });
}

/**
 * Handles server → client push of decrypted `fdc3.valuation` contexts from App2's backend.
 * These arrive over the secure-boundary WebSocket after the backend has decrypted each
 * encrypted broadcast from the private channel.
 */
function handleValuationPush(msg: ExchangeDataMessage): void {
  if (msg.purpose !== VALUATION_PUSH_PURPOSE) {
    return;
  }
  const { ctx } = msg.payload as { ctx?: Context };
  createLogEntry('success', '✅ Published a price', {
    context: ctx ?? msg.payload,
    timestamp: new Date().toISOString(),
  });
}

initializeFDC3()
  .then(async (fdc3: DesktopAgent) => {
    createLogEntry('info', '🎯 App2 ready — listening for demo.GetPrices', {
      status: 'Ready',
      timestamp: new Date().toISOString(),
    });

    const remoteHandlers = await connectRemoteHandlers(wsUrlForPage(), fdc3, async msg => {
      handleValuationPush(msg);
    });
    await setupIntentListener(fdc3, remoteHandlers);
  })
  .catch((error: unknown) => {
    console.error('Failed to initialize App2:', error);
  });
