import { DesktopAgent } from '@finos/fdc3';
import type { Context } from '@finos/fdc3-context';
import { connectRemoteHandlers, isContext, type FDC3Handlers } from '@finos/fdc3-security';
import { createLogEntry } from '../../../common/src/security-demo/logging';
import {
  restoreCachedSession,
  setupLogoutButton,
  setupSessionStatusButton,
  showAuthenticatedState,
  type UserSessionContext,
} from '../../../common/src/security-demo/session-logic';
import { initializeFDC3 } from '../../../common/src/security-demo/fdc3';

/** Standard intent name per FDC3 Security & Identity specification. */
const GET_USER_INTENT = 'GetUser';

function wsUrlForPage(): string {
  return (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host;
}

/**
 * Login flow — raises GetUser, then passes the encrypted intent result to the backend
 * for decryption and JWT verification.
 */
async function raiseGetUserIntent(
  fdc3: DesktopAgent,
  remoteHandlers: FDC3Handlers,
  loginBtn: HTMLButtonElement
): Promise<void> {
  try {
    loginBtn.disabled = true;
    loginBtn.textContent = '🔄 Processing...';

    const userRequest: Context = {
      type: 'fdc3.security.userRequest',
      aud: window.location.origin,
    };

    createLogEntry('info', `Raising ${GET_USER_INTENT} intent`, {
      result: userRequest,
      timestamp: new Date().toISOString(),
    });

    const resolution = await fdc3.raiseIntent(GET_USER_INTENT, userRequest);
    const intentResult = await resolution.getResult();

    createLogEntry('info', `${GET_USER_INTENT} intent resolved`, {
      result: intentResult,
      timestamp: new Date().toISOString(),
    });

    if (!intentResult || typeof intentResult !== 'object') {
      createLogEntry('error', `${GET_USER_INTENT} returned no result from identity provider`, {
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const userSession = await remoteHandlers.exchangeData('user-request', intentResult);

    if (userSession && isContext(userSession) && userSession.type === 'fdc3.security.user') {
      showAuthenticatedState(userSession as UserSessionContext);
      createLogEntry('success', 'User decrypted and JWT verified (Login POC backend)', {
        result: userSession,
        timestamp: new Date().toISOString(),
      });
    } else {
      showAuthenticatedState(null);
      createLogEntry('error', 'Login failed — backend could not establish user session', {
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    createLogEntry('error', `Failed to raise ${GET_USER_INTENT} intent`, {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = '🔐 Login (GetUser)';
  }
}

function setupLoginButton(fdc3: DesktopAgent, remoteHandlers: FDC3Handlers): void {
  const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
  loginBtn.addEventListener('click', async () => {
    await raiseGetUserIntent(fdc3, remoteHandlers, loginBtn);
  });
}

initializeFDC3()
  .then(async fdc3 => {
    createLogEntry('info', 'Login POC ready', {
      status: 'Ready',
      buttons: ['Login', 'Check Session Status', 'Logout'],
      timestamp: new Date().toISOString(),
    });

    const remoteHandlers = await connectRemoteHandlers(wsUrlForPage(), fdc3, async () => {});
    setupLoginButton(fdc3, remoteHandlers);
    setupSessionStatusButton(remoteHandlers);
    setupLogoutButton(remoteHandlers);
    await restoreCachedSession(remoteHandlers);
  })
  .catch(error => {
    console.error('Failed to initialize Login POC:', error);
  });
