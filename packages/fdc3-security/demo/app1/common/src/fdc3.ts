import { DesktopAgent, getAgent } from '@finos/fdc3';
import { createLogEntry, updateStatus } from './logging';

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
