// Shared session status utility for FDC3 demo apps
import { Context, User } from '@finos/fdc3-context';
import { createLogEntry } from './logging';
import { ContextOrErrorMetadata, FDC3Handlers } from '../../../../src/helpers/FDC3Handlers';
import { Channel, ContextHandler, DesktopAgent, IntentHandler } from '@finos/fdc3';

export abstract class AbstractSessionHandlingBusinessLogic implements FDC3Handlers {
  protected user: User | null = null;

  abstract signRequest(ctx: Context, intent: string | null, channelId: string | null): Promise<Context>;

  abstract remoteIntentHandler(intent: string): Promise<IntentHandler>;

  async exchangeData(ctx: Context): Promise<Context | void> {
    if (ctx) {
      if (ctx.type === 'fdc3.user.request') {
        if (this.user) {
          return this.user;
        }
      } else if (ctx.type == 'fdc3.user') {
        this.user = ctx as User;
        return this.user;
      } else if (ctx.type == 'fdc3.user.logout') {
        this.user = null;
      }
    }
  }

  abstract createRemoteChannel(purpose: string): Promise<Channel>;
  abstract handleRemoteChannel(purpose: string, channel: Channel): Promise<void>;
}

// Function to check session status
export async function checkSessionStatus(handlers: FDC3Handlers): Promise<any> {
  try {
    createLogEntry('info', '🔍 Checking session status...', {
      timestamp: new Date().toISOString(),
    });

    // Try both possible endpoints
    const result = await handlers.exchangeData({
      type: 'fdc3.user.request',
    });

    showAuthenticatedState(result as User);

    createLogEntry('info', `📋 Session status`, result ?? 'No user found');
  } catch (error) {
    createLogEntry('error', '❌ Failed to check session status', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

// Function to logout
export async function logout(handlers: FDC3Handlers): Promise<any> {
  try {
    createLogEntry('info', '🚪 Logging out...', {
      timestamp: new Date().toISOString(),
    });

    const response = await handlers.exchangeData({
      type: 'fdc3.user.logout',
    });

    createLogEntry('success', '✅ Logged out successfully', {
      timestamp: new Date().toISOString(),
    });

    showAuthenticatedState(null);
  } catch (error) {
    createLogEntry('error', '❌ Failed to logout', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

// Function to setup session status button
export function setupSessionStatusButton(handlers: FDC3Handlers): void {
  const sessionStatusBtn = document.getElementById('session-status-btn') as HTMLButtonElement;

  if (sessionStatusBtn) {
    sessionStatusBtn.addEventListener('click', async () => {
      try {
        if (sessionStatusBtn) {
          sessionStatusBtn.disabled = true;
          sessionStatusBtn.textContent = '🔄 Checking...';
        }
        await checkSessionStatus(handlers);
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

export function setupLogoutButton(handlers: FDC3Handlers): void {
  const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await logout(handlers);
    });
  }
}

export function showAuthenticatedState(currentUser: User | null): void {
  const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
  const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
  const userInfo = document.getElementById('user-info') as HTMLDivElement;
  const userName = document.getElementById('user-name') as HTMLSpanElement;

  if (currentUser) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (userInfo) userInfo.style.display = 'block';
    if (userName) userName.textContent = currentUser?.email;
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (userInfo) userInfo.style.display = 'none';
  }
}
