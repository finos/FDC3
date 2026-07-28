import { DesktopAgent, Context, ContextMetadata } from '@finos/fdc3';
import { PublicClientApplication, type Configuration, type AuthenticationResult } from '@azure/msal-browser';
import { connectRemoteHandlers, isContext, type FDC3Handlers } from '@finos/fdc3-security';
import { createLogEntry } from '../../../common/src/security-demo/logging';
import { initializeFDC3, ensureContextMetadata } from '../../../common/src/security-demo/fdc3';
import {
  setupSessionStatusButton,
  showAuthenticatedState,
  restoreCachedSession,
  type UserSessionContext,
} from '../../../common/src/security-demo/session-logic';
import type { EntraConfig } from './config';

/** Standard intent name per FDC3 Security & Identity specification. */
const GET_USER_INTENT = 'GetUser';

let msalInstance: PublicClientApplication;

function wsUrlForPage(): string {
  return (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host;
}

async function fetchEntraConfig(): Promise<EntraConfig> {
  const res = await fetch('/api/config');
  if (!res.ok) {
    throw new Error(`GET /api/config failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<EntraConfig>;
}

function buildMsalConfiguration(config: EntraConfig): Configuration {
  return {
    auth: {
      clientId: config.clientId,
      authority: config.authority,
      redirectUri: window.location.origin,
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false,
    },
  };
}

async function performLogin(handlers: FDC3Handlers): Promise<UserSessionContext | null> {
  try {
    createLogEntry('info', 'Starting Microsoft Entra login', '');

    const authResult: AuthenticationResult = await msalInstance.loginPopup({
      scopes: ['User.Read'],
      prompt: 'select_account',
    });
    createLogEntry('success', 'Microsoft Entra login successful', authResult.account);

    const result = await handlers.exchangeData('user-data', {
      type: 'fdc3.security.user',
      wrappedJwt: authResult.idToken,
    });

    if (result && isContext(result) && result.type === 'fdc3.security.user') {
      const user = result as UserSessionContext;
      showAuthenticatedState(user);
      createLogEntry('success', 'FDC3 user session established', result);
      return user;
    }

    createLogEntry('info', 'No FDC3 user returned', result);
    showAuthenticatedState(null);
    return null;
  } catch (error) {
    console.error('Microsoft Entra login error:', error);
    createLogEntry('error', 'Microsoft Entra login error', error instanceof Error ? error.message : String(error));
    return null;
  }
}

/** Ensures a cached session exists, restoring MSAL silently or prompting login if not. */
async function ensureAuthenticatedSession(handlers: FDC3Handlers): Promise<boolean> {
  if (await restoreCachedSession(handlers)) {
    return true;
  }

  await syncMsalSessionToBackend(handlers);
  if (await restoreCachedSession(handlers)) {
    return true;
  }

  createLogEntry('info', 'No Entra session — starting login for GetUser', '');
  return (await performLogin(handlers)) !== null;
}

async function setupLoginButton(handlers: FDC3Handlers): Promise<void> {
  const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
  loginBtn.addEventListener('click', async () => {
    await performLogin(handlers);
  });
}

async function syncMsalSessionToBackend(handlers: FDC3Handlers): Promise<void> {
  const account = msalInstance.getActiveAccount();
  if (!account) {
    return;
  }

  try {
    const authResult = await msalInstance.acquireTokenSilent({
      scopes: ['User.Read'],
      account,
    });
    const result = await handlers.exchangeData('user-data', {
      type: 'fdc3.security.user',
      wrappedJwt: authResult.idToken,
    });
    if (result && isContext(result) && result.type === 'fdc3.security.user') {
      createLogEntry('info', 'Restored Microsoft Entra session on backend', result);
    }
  } catch (error) {
    console.error('Failed to sync MSAL session to backend:', error);
    createLogEntry(
      'warning',
      'Could not restore Microsoft session on backend',
      error instanceof Error ? error.message : String(error)
    );
  }
}

async function setupLogoutButton(handlers: FDC3Handlers): Promise<void> {
  const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
  logoutBtn.addEventListener('click', async () => {
    try {
      const currentAccount = msalInstance.getActiveAccount();
      if (currentAccount) {
        await msalInstance.logoutPopup({
          account: currentAccount,
          postLogoutRedirectUri: window.location.origin,
        });
        createLogEntry('info', 'Microsoft Entra logout complete', '');
      }

      await handlers.exchangeData('user-logout', { type: 'fdc3.nothing' });
      showAuthenticatedState(null);
      createLogEntry('success', 'Session cleared', '');
    } catch (error) {
      console.error('Logout error:', error);
      createLogEntry('error', 'Logout error', error instanceof Error ? error.message : String(error));
    }
  });
}

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
    createLogEntry('error', `${GET_USER_INTENT} failed — sign in with Microsoft first or retry`, result ?? '');
    return;
  });
}

async function main(): Promise<void> {
  const entraConfig = await fetchEntraConfig();
  const msalConfig = buildMsalConfiguration(entraConfig);
  createLogEntry('info', 'MSAL configuration (from properties.json via /api/config)', {
    clientId: msalConfig.auth.clientId,
    authority: msalConfig.auth.authority,
    redirectUri: msalConfig.auth.redirectUri,
    redirectUriRegistered: entraConfig.redirectUri,
  });

  msalInstance = new PublicClientApplication(msalConfig);
  await msalInstance.initialize();

  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
    createLogEntry('info', 'Existing MSAL session', accounts[0].username);
  }

  const fdc3 = await initializeFDC3();

  const remoteHandlers = await connectRemoteHandlers(wsUrlForPage(), fdc3, async () => {});
  setupSessionStatusButton(remoteHandlers);
  await setupLogoutButton(remoteHandlers);
  await setupLoginButton(remoteHandlers);
  await syncMsalSessionToBackend(remoteHandlers);
  await restoreCachedSession(remoteHandlers);
  await setupGetUserIntentListener(fdc3, remoteHandlers);

  createLogEntry('info', 'Microsoft Entra IDP ready', 'Application ready');
}

main().catch((error: unknown) => {
  console.error('Failed to initialize Entra app:', error);
});
