import { DesktopAgent, Context, ContextMetadata } from '@finos/fdc3';
import { connectRemoteHandlers, isContext, type FDC3Handlers } from '@finos/fdc3-security';
import { createLogEntry } from '../../../common/src/security-demo/logging';
import { initializeFDC3, ensureContextMetadata } from '../../../common/src/security-demo/fdc3';
import {
  setupLogoutButton,
  setupSessionStatusButton,
  showAuthenticatedState,
  restoreCachedSession,
  type UserSessionContext,
} from '../../../common/src/security-demo/session-logic';

/** Standard intent name per FDC3 Security & Identity specification. */
const GET_USER_INTENT = 'GetUser';

function wsUrlForPage(): string {
  return (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host;
}

/**
 * Creates or returns the demo IDP session on the backend (same as clicking Log In).
 */
async function performLogin(handlers: FDC3Handlers): Promise<UserSessionContext | null> {
  try {
    const result = await handlers.exchangeData('user-login', {
      type: 'fdc3.security.userRequest',
    });

    if (result && isContext(result) && result.type === 'fdc3.security.user') {
      const user = result as UserSessionContext;
      showAuthenticatedState(user);
      createLogEntry('success', 'Login successful', result);
      return user;
    }

    showAuthenticatedState(null);
    return null;
  } catch (error) {
    console.error('Session error:', error);
    createLogEntry('error', 'Session Error', error instanceof Error ? error.message : String(error));
    return null;
  }
}

/** Ensures a cached session exists, running the login flow if not. */
async function ensureAuthenticatedSession(handlers: FDC3Handlers): Promise<boolean> {
  if (await restoreCachedSession(handlers)) {
    return true;
  }
  createLogEntry('info', 'No IDP session — starting login for GetUser', '');
  return (await performLogin(handlers)) !== null;
}

async function setupLoginButton(handlers: FDC3Handlers): Promise<void> {
  const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
  loginBtn.addEventListener('click', async () => {
    await performLogin(handlers);
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

    if (!(await ensureAuthenticatedSession(handlers))) {
      createLogEntry('error', `${GET_USER_INTENT} failed — login required or cancelled`, '');
      return;
    }

    const result = await intentHandler(context, ensureContextMetadata(metadata));
    if (result && isContext(result) && result.type === 'fdc3.security.encryptedContext') {
      createLogEntry('success', `${GET_USER_INTENT} intent result`, result);
      await restoreCachedSession(handlers);
      return result;
    }
    createLogEntry('error', `${GET_USER_INTENT} failed — no encrypted user context from backend`, result ?? '');
    return;
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
    await restoreCachedSession(remoteHandlers);
    await setupGetUserIntentListener(fdc3, remoteHandlers);

    createLogEntry('info', 'Identity provider app initialized', 'Application ready');
  })
  .catch((error: unknown) => {
    console.error('Failed to initialize IDP:', error);
  });
