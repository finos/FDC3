import { DesktopAgent, Context, ContextMetadata } from '@finos/fdc3';
import { connectRemoteHandlers, type ExchangeDataMessage, type FDC3Handlers } from '@finos/fdc3-security';
import { createLogEntry } from '../../../common/src/security-demo/logging';
import { initializeFDC3 } from '../../../common/src/security-demo/fdc3';

/** Must match `VALUATION_PUSH_PURPOSE` in `src/backend.ts`. */
const VALUATION_PUSH_PURPOSE = 'valuation-push';

function wsUrlForPage(): string {
  return (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host;
}

async function setupIntentListener(fdc3: DesktopAgent, remoteHandlers: FDC3Handlers): Promise<void> {
  const intentHandler = await remoteHandlers.remoteIntentHandler('demo.GetPrices');

  await fdc3.addIntentListener('demo.GetPrices', async (context: Context, metadata?: ContextMetadata) => {
    createLogEntry('info', 'demo.GetPrices intent received', context);
    const result = await intentHandler(context, metadata);
    createLogEntry('success', 'demo.GetPrices intent result', result);
    return result;
  });
}

function handleValuationPush(msg: ExchangeDataMessage): void {
  if (msg.purpose !== VALUATION_PUSH_PURPOSE) {
    return;
  }
  const o = msg.o as { ctx?: Context };
  createLogEntry('success', '✅ Published a price', {
    context: o.ctx ?? msg.o,
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
