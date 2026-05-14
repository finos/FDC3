import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { AppIdentifier, Context, UserRequest } from '@finos/fdc3-context';
import { ContextMetadata, DesktopAgent, IntentHandler } from '@finos/fdc3-standard';
import { WebSocket } from 'ws';

import { JosePublicFDC3Security, provisionJWKS } from '../src/impl/JosePublicFDC3Security';
import { connectRemoteHandlers } from '../src/secure-boundary/ClientSideHandlersImpl';
import { DefaultFDC3Handlers } from '../src/secure-boundary/FDC3Handlers';
import { AppBackEnd } from '../test/mocks/AppBackEnd';
import { JosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { createMockDesktopAgent, resetMockDesktopAgentFixtureState } from '../test/mocks/MockDesktopAgent';
import { createMetadataHandlerWithFDC3Version, type MetadataHandler } from '../src/delegates/MetadataHandler';
import { PublicSignatureCheckingHandlerSupport } from '../src/signing/SignatureCheckingHandlerSupport';

/** Standard intent name per FDC3 Security: `GetUser` with `fdc3.security.userRequest` input. */
const GET_USER_INTENT = 'GetUser';

/**
 * IDP (Identity Provider) backend handlers.
 * Handles the `GetUser` intent: verifies the requesting app's signature on
 * `fdc3.security.userRequest`, then creates a signed JWT, encrypts the fdc3.security.user context with the
 * requesting app's public key, and returns it wrapped in fdc3.security.encryptedContext.
 */
class IDPBackendHandlers extends DefaultFDC3Handlers {
  private readonly metadataHandler: MetadataHandler;

  constructor(
    private security: JosePrivateFDC3Security,
    _appIdentifier: AppIdentifier,
    fdc3Version: string
  ) {
    super();
    this.metadataHandler = createMetadataHandlerWithFDC3Version(fdc3Version);
  }

  async remoteIntentHandler(intent: string) {
    if (intent !== GET_USER_INTENT) {
      return super.remoteIntentHandler(intent);
    }

    const coreHandler = async (context: Context, metadata?: ContextMetadata): Promise<Context> => {
      const auth = metadata?.authenticity;
      if (!auth?.signed || !auth?.valid || !auth?.trusted) {
        console.error(
          '[IDP Backend] ❌ UNAUTHORIZED: GetUser context is missing a valid trusted signature.',
          auth?.errors
        );
        throw new Error('Unauthorized');
      }
      console.log(
        `[IDP Backend] ✅ Verified requesting-app signature (jku: ${auth.jku ?? 'n/a'}, kid: ${auth.kid ?? 'n/a'})`
      );

      if (context.type !== 'fdc3.security.userRequest') {
        throw new Error(`Expected fdc3.security.userRequest, got ${context.type}`);
      }
      const aud = (context as UserRequest).aud;
      console.log(`[IDP Backend] GetUser: received request for audience ${aud}`);

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

    const verifier = new PublicSignatureCheckingHandlerSupport(this.metadataHandler, this.security);
    return (await verifier.wrapContextHandler(coreHandler as IntentHandler)) as IntentHandler;
  }
}

/**
 * Requesting-app backend: signs `fdc3.security.userRequest` payloads for the `GetUser` intent (private key stays here).
 */
class RequestingAppBackendHandlers extends DefaultFDC3Handlers {
  constructor(private readonly security: JosePrivateFDC3Security) {
    super();
  }

  async exchangeData(purpose: string, o: object): Promise<object | void> {
    if (purpose === 'sign-context') {
      const { context } = o as { context: Context };
      return await this.security.sign(context);
    }
    return super.exchangeData(purpose, o);
  }
}

/**
 * User-requesting app: has its own backend and connects to the IDP to request user identity
 * via the `GetUser` intent.
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
   * Connect to the IDP and invoke the `GetUser` intent handler (same payload as `raiseIntent('GetUser', …)`).
   * Signs `fdc3.security.userRequest` on the requesting-app backend, then invokes the IDP handler with packed metadata.
   * Receives encrypted fdc3.security.encryptedContext, decrypts to get fdc3.security.user, verifies JWT.
   */
  async requestUserFrom(idp: AppBackEnd, mockDA: DesktopAgent, metadataHandler: MetadataHandler): Promise<void> {
    const localWsUrl = this.backend.baseUrl.replace('http', 'ws');
    console.log(`[UserRequestingApp] Connecting to own backend for signing at ${localWsUrl}...`);
    const localHandlers = await connectRemoteHandlers(localWsUrl, mockDA, async () => {});

    const userRequest: Context = {
      type: 'fdc3.security.userRequest',
      aud: this.baseUrl,
    };

    const signResult = (await localHandlers.exchangeData('sign-context', { context: userRequest })) as Awaited<
      ReturnType<JosePrivateFDC3Security['sign']>
    >;
    const { context: packedContext, metadata: packedMetadata } = metadataHandler.pack(userRequest, {
      signature: signResult.signature,
      antiReplay: signResult.antiReplay,
    });

    const idpWsUrl = idp.baseUrl.replace('http', 'ws');
    console.log(`[UserRequestingApp] Connecting to IDP at ${idpWsUrl}...`);
    const idpHandlers = await connectRemoteHandlers(idpWsUrl, mockDA, async () => {});

    const getUserHandler = await idpHandlers.remoteIntentHandler(GET_USER_INTENT);
    const result = await getUserHandler(packedContext, packedMetadata);

    await localHandlers.disconnect();

    if (!result) {
      console.log('[UserRequestingApp] No result from IDP');
      await idpHandlers.disconnect();
      return;
    }

    if (
      'type' in result &&
      result.type === 'fdc3.security.encryptedContext' &&
      typeof result.encryptedPayload === 'string'
    ) {
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
      console.log('[UserRequestingApp] Unexpected result type:', 'type' in result ? result.type : 'unknown');
    }

    await idpHandlers.disconnect();
  }
}

/**
 * STEP 1: Start IDP Backend
 */
async function step1SetupIDPBackend() {
  console.log('1. Start IDP Backend (Hosts JWKS, handles GetUser intent)');
  const idp = new AppBackEnd(
    (_ws: WebSocket, security: JosePrivateFDC3Security, appIdentifier: AppIdentifier, fdc3Version: string) =>
      new IDPBackendHandlers(security, appIdentifier, fdc3Version)
  );
  await idp.start();
  console.log(`[IDP Server] Listening at ${idp.baseUrl}`);
  return idp;
}

/**
 * STEP 2: Start UserRequestingApp backend
 */
async function step2SetupRequestingAppBackend() {
  console.log('2. Start UserRequestingApp Backend (Hosts JWKS, holds private key for decryption)');
  const app = new AppBackEnd(
    (_ws: WebSocket, security: JosePrivateFDC3Security, _appIdentifier: AppIdentifier, _fdc3Version: string) =>
      new RequestingAppBackendHandlers(security)
  );
  await app.start();
  console.log(`[UserRequestingApp] Listening at ${app.baseUrl}`);
  return app;
}

/**
 * STEP 3: Request user from IDP via GetUser intent
 */
async function step3RequestUser(
  idp: AppBackEnd,
  requestingApp: AppBackEnd,
  mockDA: DesktopAgent,
  metadataHandler: MetadataHandler
) {
  console.log('3. UserRequestingApp invokes GetUser intent...');
  const userRequestingApp = new UserRequestingApp(requestingApp);
  await userRequestingApp.requestUserFrom(idp, mockDA, metadataHandler);
}

/**
 * MAIN EXECUTION
 *
 * This example demonstrates requesting and verifying user identity from an Identity Provider.
 * 1. Step 1: Start the IDP backend (handles GetUser intent).
 * 2. Step 2: Start the UserRequestingApp backend (has its own JWKS for decryption).
 * 3. Step 3: Requesting app signs fdc3.security.userRequest on its backend, then invokes the IDP's GetUser handler.
 *    The IDP verifies the signature (JWKS from the request's jku) before issuing a user JWT and encrypted response.
 *    The IDP returns fdc3.security.encryptedContext; the requesting app decrypts, verifies the JWT, and displays the user.
 */
async function runExample(fdc3Version: string = '3.0') {
  resetMockDesktopAgentFixtureState();
  console.log('--- FDC3 Get User Example Start ---');

  const mockRequesting = createMockDesktopAgent(fdc3Version, { appId: 'user-requesting.app', instanceId: 'u1' });
  const metadataHandler = createMetadataHandlerWithFDC3Version(fdc3Version);

  const idp = await step1SetupIDPBackend();
  const requestingApp = await step2SetupRequestingAppBackend();
  await step3RequestUser(idp, requestingApp, mockRequesting, metadataHandler);

  console.log('\n--- FDC3 Get User Example Complete ---');
  await requestingApp.shutdown();
  await idp.shutdown();
}

export { runExample };

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === resolve(__filename)) {
  const fdc3Version = process.argv[2] ?? '3.0';
  runExample(fdc3Version)
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Example failed:', err);
      process.exit(1);
    });
}
