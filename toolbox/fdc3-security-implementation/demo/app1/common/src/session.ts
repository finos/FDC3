// Shared session status utility for FDC3 demo apps
import { createLogEntry } from './logging';

// Function to check session status
export async function checkSessionStatus(): Promise<any> {
  try {
    createLogEntry('info', '🔍 Checking session status...', {
      timestamp: new Date().toISOString(),
    });

    // Try both possible endpoints
    let response = await fetch('/api/status');

    if (!response.ok) {
      throw new Error(`Failed to check session status: ${response.statusText}`);
    }

    const sessionStatus = await response.json();

    createLogEntry(
      'info',
      `📋 Session status: ${sessionStatus.isAuthenticated ? 'Authenticated' : 'Not authenticated'}`,
      {
        isAuthenticated: sessionStatus.isAuthenticated,
        hasJWT: sessionStatus.hasJWT,
        user: sessionStatus.user,
        timestamp: new Date().toISOString(),
      }
    );

    return sessionStatus;
  } catch (error) {
    createLogEntry('error', '❌ Failed to check session status', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

// Function to logout
export async function logout(): Promise<any> {
  try {
    createLogEntry('info', '🚪 Logging out...', {
      timestamp: new Date().toISOString(),
    });

    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to logout: ${response.statusText}`);
    }

    const logoutResult = await response.json();

    if (logoutResult.success) {
      createLogEntry('success', '✅ Logged out successfully', {
        message: logoutResult.message,
        timestamp: new Date().toISOString(),
      });
    } else {
      createLogEntry('error', '❌ Logout failed', {
        error: logoutResult.error,
        timestamp: new Date().toISOString(),
      });
    }

    return logoutResult;
  } catch (error) {
    createLogEntry('error', '❌ Failed to logout', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

// Function to setup session status button
export function setupSessionStatusButton(): void {
  const sessionStatusBtn = document.getElementById('session-status-btn') as HTMLButtonElement;

  if (sessionStatusBtn) {
    sessionStatusBtn.addEventListener('click', async () => {
      try {
        if (sessionStatusBtn) {
          sessionStatusBtn.disabled = true;
          sessionStatusBtn.textContent = '🔄 Checking...';
        }
        await checkSessionStatus();
      } catch (error) {
        console.error('Session status check failed:', error);
      } finally {
        if (sessionStatusBtn) {
          sessionStatusBtn.disabled = false;
          sessionStatusBtn.textContent = '🔍 Check Session Status';
        }
      }
    });
  }
}
