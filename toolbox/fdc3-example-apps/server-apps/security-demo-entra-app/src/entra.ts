import { DesktopAgent, Context, ContextMetadata } from '@finos/fdc3';
import { PublicClientApplication, type Configuration, type AuthenticationResult } from '@azure/msal-browser';
import { connectRemoteHandlers, type FDC3Handlers } from '@finos/fdc3-security';
import { createLogEntry } from '../../../common/src/security-demo/logging';
import { initializeFDC3 } from '../../../common/src/security-demo/fdc3';
import {
  setupSessionStatusButton,
  showAuthenticatedState,
  type UserSessionContext,
} from '../../../common/src/security-demo/session-logic';
import type { EntraConfig } from './config';

/** Must match `CREATE_IDENTITY_TOKEN` in `src/backend.ts`. */
const CREATE_IDENTITY_TOKEN = 'CreateIdentityToken';

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

async function setupLoginButton(handlers: FDC3Handlers): Promise<void> {
  const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
  loginBtn.addEventListener('click', async () => {
    try {
      createLogEntry('info', 'Starting Microsoft Entra login', '');

      const loginRequest = {
        scopes: ['User.Read'],
        prompt: 'select_account' as const,
      };

      const authResult: AuthenticationResult = await msalInstance.loginPopup(loginRequest);
      createLogEntry('success', 'Microsoft Entra login successful', authResult.account);

      const fdc3User: Context = {
        type: 'fdc3.security.user',
        jwt: authResult.idToken,
      };
      const result = await handlers.exchangeData('user-data', fdc3User);

      if (result && (result as Context).type === 'fdc3.security.user') {
        showAuthenticatedState(result as UserSessionContext);
        createLogEntry('success', 'FDC3 user session established', result);
      } else {
        createLogEntry('info', 'No FDC3 user returned', result);
        showAuthenticatedState(null);
      }
    } catch (error) {
      console.error('Microsoft Entra login error:', error);
      createLogEntry('error', 'Microsoft Entra login error', error instanceof Error ? error.message : String(error));
      throw error;
    }
  });
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

async function setupCreateIdentityTokenListener(fdc3: DesktopAgent, handlers: FDC3Handlers): Promise<void> {
  const intentHandler = await handlers.remoteIntentHandler(CREATE_IDENTITY_TOKEN);

  await fdc3.addIntentListener(
    CREATE_IDENTITY_TOKEN,
    async (context: Context, metadata: ContextMetadata | undefined) => {
      createLogEntry('info', `${CREATE_IDENTITY_TOKEN} intent received`, context);
      const result = await intentHandler(context, metadata);
      createLogEntry('success', `${CREATE_IDENTITY_TOKEN} intent result`, result);
      return result;
    }
  );
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
  showAuthenticatedState(null);
  await setupCreateIdentityTokenListener(fdc3, remoteHandlers);

  createLogEntry('info', 'Microsoft Entra IDP ready', 'Application ready');
}

main().catch((error: unknown) => {
  console.error('Failed to initialize Entra app:', error);
});
