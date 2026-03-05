import { DesktopAgent, Context, ContextMetadata } from '@finos/fdc3';
import { createLogEntry } from '../../../app1/common/src/logging';
import { initializeFDC3 } from '../../../app1/common/src/fdc3';
import { connectRemoteHandlers } from '../../../../src/secure-boundary/ClientSideHandlersImpl';
import { FDC3Handlers } from '../../../../src/secure-boundary/FDC3Handlers';
import { ExchangeDataMessage } from '../../../../src/secure-boundary/MessageTypes';

async function setupIntentListener(fdc3: DesktopAgent, remoteHandlers: FDC3Handlers) {
  const intentHandler = await remoteHandlers.remoteIntentHandler('demo.GetPrices');

  fdc3.addIntentListener('demo.GetPrices', async (context: Context, metadata?: ContextMetadata) => {
    createLogEntry('info', 'demo.GetPrices intent received', context);
    const ss = await intentHandler(context, metadata);
    createLogEntry('success', 'demo.GetPrices intent result', ss);
    return ss;
  });
}

function logReturnedMessage(msg: ExchangeDataMessage) {
  console.log('logReturnedMessage', msg);
  createLogEntry('success', '✅ Published A Price', {
    context: msg.ctx,
  });
}

// Main initialization
initializeFDC3()
  .then(async fdc3 => {
    createLogEntry('info', '🎯 App2 ready - listening for demo.GetPrices', {
      status: 'Ready',
      timestamp: new Date().toISOString(),
    });

    connectRemoteHandlers('http://localhost:4004', fdc3, async msg => logReturnedMessage(msg)).then(remoteHandlers => {
      setupIntentListener(fdc3, remoteHandlers);
    });
  })

  .catch(error => {
    console.error('Failed to initialize app1:', error);
  });
