import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { AppIdentifier, Contact, Context, EncryptedContextWrapper, UserRequest } from '@finos/fdc3-context';
import type { ContextMetadata, DesktopAgent, Intent, IntentHandler } from '@finos/fdc3-standard';
import { WebSocket } from 'ws';
import { JosePublicFDC3Security, provisionJWKS } from '../src/impl/JosePublicFDC3Security';
import { connectRemoteHandlers } from '../src/secure-boundary/ClientSideHandlersImpl';
import { DefaultFDC3Handlers } from '../src/secure-boundary/FDC3Handlers';
import { AppBackEnd } from '../test/mocks/AppBackEnd';
import { JosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { createMockDesktopAgent, resetMockDesktopAgentFixtureState } from '../test/mocks/MockDesktopAgent';
import { createMetadataHandlerWithFDC3Version, type MetadataHandler } from '../src/delegates/MetadataHandler';
import { PublicSignatureCheckingHandlerSupport } from '../src/signing/SignatureCheckingHandlerSupport';
import { AntiReplayClaims, DetachedSignature } from '@finos/fdc3-schema/generated/api/BrowserTypes';

/** Standard intent name per FDC3 Security: `GetUser` with `fdc3.security.userRequest` input. */
const GET_USER_INTENT = 'GetUser';

/**
 * Requesting-app backend: accepts `fdc3.security.encryptedContext`, decrypts with this app's wrapping private key,
 * verifies the embedded JWT with the IDP's public keys, and returns **`fdc3.contact`** so the JWT never reaches the front end.
 */
const EXCHANGE_GET_USER_IDENTITY = 'get-user-identity';

type UserRequestSignResult = {
  signature: DetachedSignature;
  antiReplay: AntiReplayClaims;
};

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
      console.log('[IDP Backend] ✅ Verified requesting-app signature', {
        jku: auth.jku ?? 'n/a',
        kid: auth.kid ?? 'n/a',
        context,
        metadata,
      });

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
      console.log(
        '[IDP Backend] Returning fdc3.security.encryptedContext (encrypted fdc3.security.user)',
        encryptedContext
      );
      return encryptedContext;
    };

    const verifier = new PublicSignatureCheckingHandlerSupport(this.metadataHandler, this.security);
    return (await verifier.wrapContextHandler(coreHandler as IntentHandler)) as IntentHandler;
  }
}

/**
 * Requesting-app backend: signs `fdc3.security.userRequest` for `GetUser`, and resolves identity via
 * `get-user-identity` (decrypt + JWT verify + `fdc3.contact` projection — all server-side).
 */
class RequestingAppBackendHandlers extends DefaultFDC3Handlers {
  constructor(
    private readonly security: JosePrivateFDC3Security,
    private readonly idp: AppBackEnd
  ) {
    super();
  }

  async exchangeData(purpose: string, o: object): Promise<object | void> {
    if (purpose === 'sign-context') {
      return await this.security.sign(o as Context);
    }
    if (purpose === EXCHANGE_GET_USER_IDENTITY) {
      const encryptedContext = o as EncryptedContextWrapper;
      if (!encryptedContext || encryptedContext.type !== 'fdc3.security.encryptedContext') {
        throw new Error('get-user-identity: expected fdc3.security.encryptedContext with encryptedPayload');
      }
      const payload = encryptedContext.encryptedPayload;
      if (typeof payload !== 'string') {
        throw new Error('get-user-identity: encryptedPayload must be a string');
      }
      const decrypted = await this.security.decryptContextWithPrivateKey(payload);
      if (decrypted.type !== 'fdc3.security.user') {
        throw new Error(`get-user-identity: expected fdc3.security.user, got ${decrypted.type}`);
      }
      const userCtx = decrypted as unknown as {
        jwt?: string;
        wrappedJwt?: string;
        id?: { email?: string };
        name?: string;
      };
      const jwt =
        typeof userCtx.jwt === 'string'
          ? userCtx.jwt
          : typeof userCtx.wrappedJwt === 'string'
            ? userCtx.wrappedJwt
            : undefined;
      if (!jwt) {
        throw new Error('get-user-identity: fdc3.security.user missing jwt / wrappedJwt');
      }

      const securityClient = new JosePublicFDC3Security(
        this.idp.security.getPublicKeys()[0],
        this.idp.security.getPublicKeys()[1],
        url => provisionJWKS(url),
        () => true
      );
      const claims = await securityClient.verifyJWTToken(jwt);

      const id = userCtx.id;
      const email = id?.email ?? (typeof claims.sub === 'string' && claims.sub.includes('@') ? claims.sub : undefined);
      if (!email) {
        throw new Error('get-user-identity: cannot derive contact email from user context or JWT sub');
      }
      const name = userCtx.name ?? claims.sub;
      const contact: Contact = {
        type: 'fdc3.contact',
        id: { email },
        ...(name !== undefined ? { name } : {}),
      };
      console.log(
        '[RequestingApp Backend] get-user-identity: verified JWT, returning fdc3.contact (JWT not sent to client)'
      );
      return { context: contact as Context };
    }
    return super.exchangeData(purpose, o);
  }
}

/**
 * STEP 1: Start IDP backend (GetUser handler, JWKS).
 */
async function step1SetupIdpApp() {
  console.log('1. Starting IDP backend...');
  const idp = new AppBackEnd(
    (_ws: WebSocket, security: JosePrivateFDC3Security, appIdentifier: AppIdentifier, fdc3Version: string) =>
      new IDPBackendHandlers(security, appIdentifier, fdc3Version)
  );
  await idp.start();
  console.log(`   IDP listening at ${idp.baseUrl}`);
  return idp;
}

/**
 * STEP 2: Start requesting-app backend (JWKS, sign-context + get-user-identity; needs IDP for JWT verification).
 */
async function step2SetupRequestingApp(idp: AppBackEnd) {
  console.log('2. Starting requesting-app backend...');
  const app = new AppBackEnd(
    (_ws: WebSocket, security: JosePrivateFDC3Security, _appIdentifier: AppIdentifier, _fdc3Version: string) =>
      new RequestingAppBackendHandlers(security, idp)
  );
  await app.start();
  console.log(`   Requesting app listening at ${app.baseUrl}`);
  return app;
}

/**
 * STEP 3: IDP front-end — connect to IDP backend and register the GetUser intent listener on the (mock) desktop agent.
 */
async function step3IdpRegisterGetUserListener(idp: AppBackEnd, mockIdp: DesktopAgent) {
  console.log('3. IDP front-end: Connecting to IDP backend, registering GetUser intent listener...');

  const idpHandlers = await connectRemoteHandlers(idp.baseUrl.replace('http', 'ws'), mockIdp, async () => {});
  const intentHandler = await idpHandlers.remoteIntentHandler(GET_USER_INTENT);
  await mockIdp.addIntentListener(GET_USER_INTENT as Intent, intentHandler);

  return { handlers: idpHandlers };
}

/**
 * STEP 4: Requesting-app front-end — sign `fdc3.security.userRequest`, raise GetUser, then exchangeData(get-user-identity).
 * Uses a separate mock desktop agent from step 3; the mock shares intent routing so the raised intent reaches the IDP listener.
 */
async function step4RequestingAppRaiseGetUser(requestingApp: AppBackEnd, mockRequesting: DesktopAgent) {
  console.log('4. Requesting-app front-end: Signing user request, raising GetUser, resolving contact via backend...');

  const requestingHandlers = await connectRemoteHandlers(
    requestingApp.baseUrl.replace('http', 'ws'),
    mockRequesting,
    async () => {}
  );

  try {
    const userRequest: Context = {
      type: 'fdc3.security.userRequest',
      aud: requestingApp.baseUrl,
    };

    const signResult = (await requestingHandlers.exchangeData('sign-context', userRequest)) as UserRequestSignResult;

    const resolution = await mockRequesting.raiseIntent(GET_USER_INTENT as Intent, userRequest, null, {
      signature: signResult.signature,
      antiReplay: signResult.antiReplay,
    });

    const userResult = await resolution.getResult();

    console.log('[RequestingApp Front End] Result from GetUser', userResult);

    const identityOut = await requestingHandlers.exchangeData(EXCHANGE_GET_USER_IDENTITY, userResult as object);
    const contact = identityOut as Contact;
    console.log('[RequestingApp Front End] Contact from backend', contact);
  } finally {
    await requestingHandlers.disconnect();
  }
}

/**
 * MAIN EXECUTION
 *
 * 1. IDP backend (mint JWT, encrypt for requestor JWKS).
 * 2. Requesting-app backend (sign user requests, get-user-identity decrypt + verify + fdc3.contact).
 * 3. IDP front-end: WebSocket to IDP backend, register **GetUser** on the mock desktop agent.
 * 4. Requesting-app front-end: sign `fdc3.security.userRequest`, **raiseIntent(GetUser, …)**, then **exchangeData(get-user-identity)**.
 */
async function runExample(fdc3Version: string = '3.0') {
  resetMockDesktopAgentFixtureState();
  console.log('--- FDC3 Get User Example Start ---');

  const mockIdp = createMockDesktopAgent(fdc3Version, { appId: 'idp.app', instanceId: 'idp1' });
  const mockRequesting = createMockDesktopAgent(fdc3Version, { appId: 'user-requesting.app', instanceId: 'u1' });

  const idp = await step1SetupIdpApp();
  const requestingApp = await step2SetupRequestingApp(idp);
  const idpClient = await step3IdpRegisterGetUserListener(idp, mockIdp);

  try {
    await step4RequestingAppRaiseGetUser(requestingApp, mockRequesting);
  } finally {
    console.log('\nClosing connections...');
    await idpClient.handlers.disconnect();
    await requestingApp.shutdown();
    await idp.shutdown();
  }

  console.log('\n--- FDC3 Get User Example Complete ---');
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
