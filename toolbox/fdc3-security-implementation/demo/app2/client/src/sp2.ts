import { DesktopAgent, getAgent, Context, ContextMetadata } from '@finos/fdc3';
import { createLogEntry, updateStatus } from '../../common/src/logging';

// Define the ContextMetadataWithAuthenticity type locally since it's not exported from @finos/fdc3
type ContextMetadataWithAuthenticity = ContextMetadata & {
  authenticity?: {
    signed: boolean;
    valid?: boolean;
    trusted?: boolean;
    publicKeyUrl?: string;
    error?: string;
  };
  __signature?: string;
};

let fdc3: DesktopAgent | null = null;

// Initialize FDC3 and set up intent listener
async function initializeApp() {
  try {
    updateStatus('connecting', 'Connecting to FDC3 Agent...');
    createLogEntry('info', '🚀 App2 Initializing...', {
      status: 'Setting up demo.GetPrices intent handler',
      timestamp: new Date().toISOString(),
    });

    fdc3 = await getAgent();
    console.log('FDC3 is ready');

    updateStatus('connected', 'Connected to FDC3 Agent');
    createLogEntry('success', '✅ Connected to FDC3 Agent successfully', {
      agent: 'FDC3 Agent',
      timestamp: new Date().toISOString(),
      capabilities: 'Available',
    });

    // Add intent listener for demo.GetPrices
    fdc3.addIntentListener('demo.GetPrices', async (context: Context, metadata?: ContextMetadata) => {
      createLogEntry('info', '📊 Received demo.GetPrices Intent', {
        context: context,
        metadata: metadata,
        timestamp: new Date().toISOString(),
      });

      // Check if context is an fdc3.instrument
      if (context.type !== 'fdc3.instrument') {
        createLogEntry('error', '❌ Invalid context type - expected fdc3.instrument', {
          receivedType: context.type,
          expectedType: 'fdc3.instrument',
        });
        throw new Error('Invalid context type - expected fdc3.instrument');
      }

      const signatureCheck = await fdc3Security.check(context);

      if (!signatureCheck.valid) {
        createLogEntry('error', '❌ Signature validation failed', {
          error: signatureCheck.error,
          contextId: context.id?.isin || 'Unknown',
        });
        throw new Error(`Signature validation failed: ${signatureCheck.error}`);
      }

      createLogEntry('success', '✅ Signature validated successfully', {
        contextId: context.id?.isin || 'Unknown',
        isin: context.id?.isin,
      });

      // Create a private channel
      createLogEntry('info', '🔗 Creating private channel...');

      const channel = await fdc3!.createPrivateChannel();

      createLogEntry(
        'success',
        '✅ Private channel created successfully',
        {
          channelType: channel.type,
          channelId: channel.id,
        },
        {
          'Channel Type': channel.type,
          'Channel ID': String(channel.id),
          Status: 'Active',
        }
      );

      // Set up channel listeners for demo.counter context
      channel.addContextListener('demo.counter', (ctx: Context, meta: ContextMetadata | undefined) => {
        const metaAuth = meta as ContextMetadataWithAuthenticity;
        const authStatus = metaAuth.authenticity?.valid ? '✅ Verified' : '⚠️ Not Verified';
        const encryption =
          (metaAuth as ContextMetadataWithAuthenticity & { encryption?: string }).encryption || 'unknown';

        createLogEntry(
          'success',
          `📤 Private Channel Message: ${ctx.type} ${authStatus} ${encryption === 'decrypted' ? '🔓' : '🔒'}`,
          {
            context: ctx,
            metadata: meta,
            encryption: encryption,
          }
        );
      });

      // Set up disconnect listener
      channel.onDisconnect(() => {
        createLogEntry('warning', '🔌 Private channel disconnected');
      });

      // Set up unsubscribe listener
      channel.onUnsubscribe(() => {
        createLogEntry('info', '📤 Private channel unsubscribed');
      });

      // Set up add context listener
      channel.onAddContextListener((contextType?: string) => {
        createLogEntry('info', `👂 Context listener added for: ${contextType || 'all'}`);
      });

      createLogEntry('success', '🎯 Returning private channel for demo.GetPrices intent', {
        channelId: channel.id,
        intent: 'demo.GetPrices',
      });

      return channel;
    });

    createLogEntry('success', '✅ demo.GetPrices intent handler registered successfully', {
      status: 'Ready to receive requests',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    updateStatus('error', 'FDC3 Connection Failed');
    createLogEntry('error', '❌ Failed to initialize app', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
  }
}

// Initialize the app when the page loads
window.addEventListener('load', () => {
  initializeApp();
});
