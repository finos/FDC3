import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { Context, UserRequest } from '@robmoffat/fdc3-context';
import { DesktopAgent } from '@robmoffat/fdc3-standard';

import { JosePublicFDC3Security, provisionJWKS } from '../src/impl/JosePublicFDC3Security';
import { connectRemoteHandlers } from '../src/secure-boundary/ClientSideHandlersImpl';
import { DefaultFDC3Handlers } from '../src/secure-boundary/FDC3Handlers';
import { AppBackEnd } from '../test/mocks/AppBackEnd';
import { JosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { MockDesktopAgent } from '../test/mocks/MockDesktopAgent';

const CREATE_IDENTITY_TOKEN = 'CreateIdentityToken';

/**
 * IDP (Identity Provider) backend handlers.
 * Handles the CreateIdentityToken intent: receives fdc3.security.userRequest,
 * creates a signed JWT, encrypts the fdc3.security.user context with the
 * requesting app's public key, and returns it wrapped in fdc3.security.encryptedContext.
 */
class IDPBackendHandlers extends DefaultFDC3Handlers {
  constructor(private security: JosePrivateFDC3Security) {
    super();
  }

  async remoteIntentHandler(intent: string) {
    if (intent !== CREATE_IDENTITY_TOKEN) {
      return super.remoteIntentHandler(intent);
    }
    return async (context: Context): Promise<Context> => {
      if (context.type !== 'fdc3.security.userRequest') {
        throw new Error(`Expected fdc3.security.userRequest, got ${context.type}`);
      }
      const aud = (context as UserRequest).aud;
      console.log(`[IDP Backend] CreateIdentityToken: received request for audience ${aud}`);

      const jwt = await this.security.createJWTToken(aud, 'demo-user@example.com');
      const user: Context = {
        type: 'fdc3.security.user',
        id: { email: 'demo-user@example.com' },
        name: 'Demo User',
        jwt,
      };

      const requestingAppJwksUrl = `${aud.replace(/\/$/, '')}/.well-known/jwks.json`;
      const encryptedPayload = await this.security.encryptPublicKey(user, requestingAppJwksUrl);

      const encryptedContext: Context = {
        type: 'fdc3.security.encryptedContext',
        originalType: 'fdc3.security.user',
        encryptedPayload,
        id: { kid: 'user-identity' },
      };
      console.log('[IDP Backend] Returning fdc3.security.encryptedContext (encrypted fdc3.security.user)');
      return encryptedContext;
    };
  }
}

/**
 * User-requesting app: has its own backend and connects to the IDP to request user identity
 * via the CreateIdentityToken intent.
 */
class UserRequestingApp {
  readonly backend: AppBackEnd;
  readonly baseUrl: string;

  constructor(backend: AppBackEnd) {
    this.backend = backend;
    this.baseUrl = backend.baseUrl;
  }

  async shutdown(): Promise<void> {
    await this.backend.shutdown();
  }

  /**
   * Connect to the IDP and raise CreateIdentityToken intent.
   * Receives encrypted fdc3.security.encryptedContext, decrypts to get fdc3.security.user, verifies JWT.
   */
  async requestUserFrom(idp: AppBackEnd): Promise<void> {
    const wsUrl = idp.baseUrl.replace('http', 'ws');
    console.log(`[UserRequestingApp] Connecting to IDP at ${wsUrl}...`);

    const mockDA = new MockDesktopAgent() as unknown as DesktopAgent;
    const handlers = await connectRemoteHandlers(wsUrl, mockDA, async () => {});

    const createIdentityTokenHandler = await handlers.remoteIntentHandler(CREATE_IDENTITY_TOKEN);
    const userRequest: Context = {
      type: 'fdc3.security.userRequest',
      aud: this.baseUrl,
    };

    const result = await createIdentityTokenHandler(userRequest);

    if (!result) {
      console.log('[UserRequestingApp] No result from IDP');
      await handlers.disconnect();
      return;
    }

    if (result.type === 'fdc3.security.encryptedContext' && result.encryptedPayload) {
      const user = await this.backend.security.decryptContextWithPrivateKey(result.encryptedPayload);

      if (user?.type === 'fdc3.security.user' && user.jwt) {
        const securityClient = new JosePublicFDC3Security(
          idp.security.getPublicKeys()[0],
          idp.security.getPublicKeys()[1],
          url => provisionJWKS(url),
          () => true
        );
        const claims = await securityClient.verifyJWTToken(user.jwt);
        console.log('\n[UserRequestingApp] User received and JWT verified:');
        console.log(JSON.stringify({ name: user.name, id: user.id }, null, 2));
        console.log('[UserRequestingApp] JWT claims:');
        console.log(JSON.stringify(claims, null, 2));
        console.log(`[UserRequestingApp] User: ${claims.sub}, Issued by: ${claims.iss}`);
      } else {
        console.log('[UserRequestingApp] Decrypted context was not fdc3.security.user');
      }
    } else {
      console.log('[UserRequestingApp] Unexpected result type:', result?.type);
    }

    await handlers.disconnect();
  }
}

/**
 * STEP 1: Start IDP Backend
 */
async function step1SetupIDPBackend() {
  console.log('1. Start IDP Backend (Hosts JWKS, handles CreateIdentityToken intent)');
  const idp = new AppBackEnd((_, security) => new IDPBackendHandlers(security));
  await idp.start();
  console.log(`[IDP Server] Listening at ${idp.baseUrl}`);
  return idp;
}

/**
 * STEP 2: Start UserRequestingApp backend
 */
async function step2SetupRequestingAppBackend() {
  console.log('2. Start UserRequestingApp Backend (Hosts JWKS, holds private key for decryption)');
  const app = new AppBackEnd((_, _security) => new DefaultFDC3Handlers());
  await app.start();
  console.log(`[UserRequestingApp] Listening at ${app.baseUrl}`);
  return app;
}

/**
 * STEP 3: Request user from IDP via CreateIdentityToken intent
 */
async function step3RequestUser(idp: AppBackEnd, requestingApp: AppBackEnd) {
  console.log('3. UserRequestingApp raises CreateIdentityToken intent...');
  const userRequestingApp = new UserRequestingApp(requestingApp);
  await userRequestingApp.requestUserFrom(idp);
}

/**
 * MAIN EXECUTION
 *
 * This example demonstrates requesting and verifying user identity from an Identity Provider.
 * 1. Step 1: Start the IDP backend (handles CreateIdentityToken intent).
 * 2. Step 2: Start the UserRequestingApp backend (has its own JWKS for decryption).
 * 3. Step 3: Requesting app connects to IDP, raises CreateIdentityToken with fdc3.security.userRequest.
 *    IDP creates fdc3.security.user, encrypts it with the requesting app's public key,
 *    wraps in fdc3.security.encryptedContext, returns as intent result.
 *    Requesting app decrypts, verifies JWT, and displays user.
 */
async function runExample() {
  console.log('--- FDC3 Get User Example Start ---');

  const idp = await step1SetupIDPBackend();
  const requestingApp = await step2SetupRequestingAppBackend();
  await step3RequestUser(idp, requestingApp);

  console.log('\n--- FDC3 Get User Example Complete ---');
  await requestingApp.shutdown();
  await idp.shutdown();
}

export { runExample };

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === resolve(__filename)) {
  runExample()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Example failed:', err);
      process.exit(1);
    });
}
