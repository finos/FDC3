import { DesktopAgent, getAgent, type ContextMetadata } from '@finos/fdc3';
import { createLogEntry, updateStatus } from './logging';

/** Minimal metadata when the desktop agent omits it; satisfies {@link IntentHandler} second argument. */
export function ensureContextMetadata(metadata?: ContextMetadata): ContextMetadata {
  if (metadata) {
    return metadata;
  }
  return {
    timestamp: new Date(),
    source: { appId: 'fdc3-example-apps', instanceId: 'local' },
  };
}

// Initialize FDC3 connection
export async function initializeFDC3(): Promise<DesktopAgent> {
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
