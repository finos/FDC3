import { DesktopAgent, getAgent, Context, ContextMetadata } from '@finos/fdc3';
import { createLogEntry, updateStatus } from '../../../app1/common/src/logging';
import { initializeFDC3 } from '../../../app1/common/src/fdc3';
import { connectRemoteHandlers } from '../../../../src/helpers/ClientSideHandlersImpl';
import { FDC3Handlers } from '../../../../src/helpers/FDC3Handlers';

async function setupIntentListener(fdc3: DesktopAgent, remoteHandlers: FDC3Handlers) {
  const intentHandler = await remoteHandlers.remoteIntentHandler('demo.GetPrices');

  fdc3.addIntentListener('demo.GetPrices', async (context: Context, metadata?: ContextMetadata) => {
    createLogEntry('info', 'demo.GetPrices intent received', context);
    const ss = await intentHandler(context, metadata);
    createLogEntry('success', 'demo.GetPrices intent result', ss);
    return ss;
  });
}

// Main initialization
initializeFDC3()
  .then(async fdc3 => {
    createLogEntry('info', '🎯 App2 ready - listening for demo.GetPrices', {
      status: 'Ready',
      timestamp: new Date().toISOString(),
    });

    connectRemoteHandlers('http://localhost:4004', fdc3).then(remoteHandlers => {
      setupIntentListener(fdc3, remoteHandlers);
    });
  })

  .catch(error => {
    console.error('Failed to initialize app1:', error);
  });
