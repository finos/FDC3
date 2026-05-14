// Shared session status utility for FDC3 demo apps
import type { Context } from '@finos/fdc3-context';
import type { FDC3Handlers } from '@finos/fdc3-security';
import { createLogEntry } from './logging';

/** Minimal shape for UI after backend session is established */
export type UserSessionContext = Context & {
  type: 'fdc3.security.user';
  id?: { email?: string };
  name?: string;
  email?: string;
};

function displayNameForUser(u: UserSessionContext | null | undefined): string {
  if (!u) return '';
  if (typeof u.email === 'string' && u.email) return u.email;
  const id = u.id;
  if (id && typeof id.email === 'string' && id.email) return id.email;
  if (typeof u.name === 'string' && u.name) return u.name;
  return 'Signed in';
}

export async function checkSessionStatus(handlers: FDC3Handlers): Promise<void> {
  try {
    createLogEntry('info', '🔍 Checking session status...', {
      timestamp: new Date().toISOString(),
    });

    const result = (await handlers.exchangeData('user-request', {
      type: 'fdc3.security.userRequest',
    })) as UserSessionContext | void;

    showAuthenticatedState(result ?? null);

    createLogEntry('info', `📋 Session status`, result ?? 'No user found');
  } catch (error) {
    createLogEntry('error', '❌ Failed to check session status', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

export async function logout(handlers: FDC3Handlers): Promise<void> {
  try {
    createLogEntry('info', '🚪 Logging out...', {
      timestamp: new Date().toISOString(),
    });

    await handlers.exchangeData('user-logout', {
      type: 'fdc3.nothing',
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

export function showAuthenticatedState(currentUser: UserSessionContext | null): void {
  const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
  const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
  const userInfo = document.getElementById('user-info') as HTMLDivElement;
  const userName = document.getElementById('user-name') as HTMLSpanElement;

  if (currentUser) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
    if (userInfo) userInfo.style.display = 'block';
    if (userName) userName.textContent = displayNameForUser(currentUser);
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (userInfo) userInfo.style.display = 'none';
  }
}
