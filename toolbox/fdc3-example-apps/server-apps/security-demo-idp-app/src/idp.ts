import { DesktopAgent, Context, ContextMetadata } from '@finos/fdc3';
import { connectRemoteHandlers, isContext, type FDC3Handlers } from '@finos/fdc3-security';
import { createLogEntry } from '../../../common/src/security-demo/logging';
import { initializeFDC3, ensureContextMetadata } from '../../../common/src/security-demo/fdc3';
import {
  setupLogoutButton,
  setupSessionStatusButton,
  showAuthenticatedState,
  type UserSessionContext,
} from '../../../common/src/security-demo/session-logic';

/** Standard intent name per FDC3 Security & Identity specification. */
const GET_USER_INTENT = 'GetUser';

function wsUrlForPage(): string {
  return (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host;
}

/**
 * Login button: calls `user-request` exchangeData on the backend which returns the
 * cached `fdc3.security.user` session (or creates a demo one if not yet present).
 * Updates the UI to show the authenticated state on success.
 */
async function setupLoginButton(handlers: FDC3Handlers): Promise<void> {
  const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
  loginBtn.addEventListener('click', async () => {
    try {
      const result = await handlers.exchangeData('user-request', {
        type: 'fdc3.security.userRequest',
      });

      if (result && isContext(result) && result.type === 'fdc3.security.user') {
        showAuthenticatedState(result as UserSessionContext);
        createLogEntry('success', 'Login successful', result);
      } else {
        createLogEntry('success', 'User Logged out', '');
        showAuthenticatedState(null);
      }
    } catch (error) {
      console.error('Session error:', error);
      createLogEntry('error', 'Session Error', error instanceof Error ? error.message : String(error));
      throw error;
    }
  });
}

/**
 * Registers the GetUser intent listener. The handler is obtained from the backend via
 * `remoteIntentHandler` so that JWT minting and encryption run server-side. The intent
 * handler receives the signed `fdc3.security.userRequest`, creates an encrypted
 * `fdc3.security.user` response, and returns it as `fdc3.security.encryptedContext`.
 */
async function setupGetUserIntentListener(fdc3: DesktopAgent, handlers: FDC3Handlers): Promise<void> {
  const intentHandler = await handlers.remoteIntentHandler(GET_USER_INTENT);

  await fdc3.addIntentListener(GET_USER_INTENT, async (context: Context, metadata: ContextMetadata | undefined) => {
    createLogEntry('info', `${GET_USER_INTENT} intent received`, context);
    const result = await intentHandler(context, ensureContextMetadata(metadata));
    createLogEntry('success', `${GET_USER_INTENT} intent result`, result);
    return result;
  });
}

initializeFDC3()
  .then(async (fdc3: DesktopAgent) => {
    createLogEntry('info', '🎯 Identity provider app ready — GetUser + session controls', {
      status: 'Ready',
      timestamp: new Date().toISOString(),
    });

    const remoteHandlers = await connectRemoteHandlers(wsUrlForPage(), fdc3, async () => {});
    setupSessionStatusButton(remoteHandlers);
    setupLogoutButton(remoteHandlers);
    await setupLoginButton(remoteHandlers);
    showAuthenticatedState(null);
    await setupGetUserIntentListener(fdc3, remoteHandlers);

    createLogEntry('info', 'Identity provider app initialized', 'Application ready');
  })
  .catch((error: unknown) => {
    console.error('Failed to initialize IDP:', error);
  });
