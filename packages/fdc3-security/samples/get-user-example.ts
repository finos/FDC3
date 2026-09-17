import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { AppIdentifier, Contact, Context, EncryptedContextWrapper, User, UserRequest } from '@finos/fdc3-context';
import type { DesktopAgent, Intent } from '@finos/fdc3-standard';
import { WebSocket } from 'ws';
import { JosePublicFDC3Security, provisionJWKS } from '../src/impl/JosePublicFDC3Security';
import { connectRemoteHandlers } from '../src/secure-boundary/ClientSideHandlersImpl';
import { DefaultFDC3Handlers } from '../src/secure-boundary/FDC3Handlers';
import { AppBackEnd } from '../test/mocks/AppBackEnd';
import { JosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { createMockDesktopAgent, resetMockDesktopAgentFixtureState } from '../test/mocks/MockDesktopAgent';
import { createMetadataHandlerWithFDC3Version, type MetadataHandler } from '../src/delegates/MetadataHandler';
import {
  PublicSignatureCheckingHandlerSupport,
  SecurityAwareIntentHandler,
} from '../src/signing/SignatureCheckingHandlerSupport';
import { AntiReplayClaims, DetachedSignature } from '@finos/fdc3-standard';
import { assertDefined, isEncryptedContextWrapper, isUser, isUserRequest } from '../src/impl/TypeGuards';

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
 * Identity provider app backend handlers.
 * Handles the `GetUser` intent: verifies the requesting app's signature on
 * `fdc3.security.userRequest`, mints a signed JWT scoped to the requesting app's
 * audience, encrypts it with the requesting app's public key, and returns it as
 * `fdc3.security.encryptedContext` so the JWT never passes through the Desktop Agent
 * in plaintext.
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

    const coreHandler: SecurityAwareIntentHandler = async (context, _metadata, verification): Promise<Context> => {
      // The third argument contains the signature verification result from
      // PublicSignatureCheckingHandlerSupport. Reject requests with invalid or untrusted signatures.
      const auth = verification.authenticity;
      if (!auth?.signed || !auth?.valid || !auth?.trusted) {
        console.error(
          '[Identity Provider App Backend] ❌ UNAUTHORIZED: GetUser context is missing a valid trusted signature.',
          auth?.errors
        );
        throw new Error('Unauthorized');
      }
      console.log('[Identity Provider App Backend] ✅ Verified requesting-app signature', {
        jku: auth.jku ?? 'n/a',
        kid: auth.kid ?? 'n/a',
        context,
      });

      if (!isUserRequest(context)) {
        throw new Error(`Expected fdc3.security.userRequest, got ${context.type}`);
      }
      const aud = context.aud;
      console.log(`[Identity Provider App Backend] GetUser: received request for audience ${aud}`);

      // Mint a JWT scoped to the requesting app's audience URL.
      // The audience claim (aud) binds the token to this specific requester —
      // other apps cannot reuse it even if they observe the intent result.
      const wrappedJwt = await this.security.createJWTToken(aud, 'demo-user@example.com');
      const user: User = {
        type: 'fdc3.security.user',
        id: { email: 'demo-user@example.com' },
        name: 'Demo User',
        wrappedJwt,
      };

      // Encrypt the fdc3.security.user context with the requesting app's public key (JWE).
      // Only the requesting app — holding the corresponding private key — can decrypt it.
      const requestingAppJwksUrl = `${aud.replace(/\/$/, '')}/.well-known/jwks.json`;
      const encryptedPayload = await this.security.encryptPublicKey(user, requestingAppJwksUrl);

      // Wrap in fdc3.security.encryptedContext for transport over FDC3.
      const encryptedContext: EncryptedContextWrapper = {
        type: 'fdc3.security.encryptedContext',
        originalType: 'fdc3.security.user',
        encryptedPayload,
        id: { kid: 'user-identity' },
      };
      console.log(
        '[Identity Provider App Backend] Returning fdc3.security.encryptedContext (encrypted fdc3.security.user)',
        encryptedContext
      );
      return encryptedContext;
    };

    const verifier = new PublicSignatureCheckingHandlerSupport(this.metadataHandler, this.security);
    return verifier.wrapContextHandler(coreHandler);
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

  async exchangeData(purpose: string, payload: unknown): Promise<unknown> {
    if (purpose === 'sign-context') {
      // Sign the fdc3.security.userRequest on the backend so the identity provider app
      // can verify the requesting app's identity before issuing a token.
      return await this.security.sign(payload as Context);
    }
    if (purpose === EXCHANGE_GET_USER_IDENTITY) {
      // The frontend received fdc3.security.encryptedContext as the GetUser intent result.
      // We decrypt it here on the backend (private key required), verify the JWT signature,
      // and project to fdc3.contact so the raw JWT never reaches the frontend.
      if (!isEncryptedContextWrapper(payload as Context)) {
        throw new Error(
          `get-user-identity: expected fdc3.security.encryptedContext but received ${JSON.stringify(payload)}`
        );
      }
      const encryptedContext: EncryptedContextWrapper = payload as EncryptedContextWrapper;
      const encryptedPayload = encryptedContext.encryptedPayload;
      if (typeof encryptedPayload !== 'string') {
        throw new Error('get-user-identity: encryptedPayload must be a string');
      }

      // Decrypt the JWE payload using this app's private key to get fdc3.security.user.
      const decrypted = await this.security.decryptContextWithPrivateKey(encryptedPayload);
      if (!isUser(decrypted)) {
        throw new Error(`get-user-identity: expected fdc3.security.user, got ${decrypted.type}`);
      }
      const jwt = decrypted.wrappedJwt;

      // Verify the JWT signature against the identity provider app's JWKS.
      // This confirms the token was issued by a trusted identity provider app
      // and has not been tampered with.
      const securityClient = new JosePublicFDC3Security(
        this.idp.security.getPublicKeys()[0],
        this.idp.security.getPublicKeys()[1],
        url => provisionJWKS(url),
        () => true
      );
      const claims = await securityClient.verifyJWTToken(jwt);

      // Project the verified identity to a standard fdc3.contact so the frontend
      // works with a familiar context type and the raw JWT is never exposed to it.
      const email =
        decrypted.id?.email ?? (typeof claims.sub === 'string' && claims.sub.includes('@') ? claims.sub : undefined);
      if (!email) {
        throw new Error('get-user-identity: cannot derive contact email from user context or JWT sub');
      }
      const name = decrypted.name ?? claims.sub;
      const contact: Contact = {
        type: 'fdc3.contact',
        id: { email },
        ...(name !== undefined ? { name } : {}),
      };
      console.log(
        '[RequestingApp Backend] get-user-identity: verified JWT, returning fdc3.contact (JWT not sent to client)'
      );
      // Contact extends Context so this satisfies the Context return type.
      return { context: contact };
    }
    return super.exchangeData(purpose, payload);
  }
}

/**
 * STEP 1: Start IDP backend (GetUser handler, JWKS).
 */
async function step1SetupIdpApp() {
  console.log('1. Starting identity provider app backend...');
  const idp = new AppBackEnd(
    (_ws: WebSocket, security: JosePrivateFDC3Security, appIdentifier: AppIdentifier, fdc3Version: string) =>
      new IDPBackendHandlers(security, appIdentifier, fdc3Version)
  );
  await idp.start();
  console.log(`   Identity provider app listening at ${idp.baseUrl}`);
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
  console.log('3. Identity provider app front-end: Connecting to backend, registering GetUser intent listener...');

  const idpHandlers = await connectRemoteHandlers(idp.baseUrl.replace('http', 'ws'), mockIdp, async () => {});
  // remoteIntentHandler returns a handler that runs on the backend, so the private key
  // (needed to verify the request signature) stays server-side.
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
    // Build the userRequest context. The aud field is set to this app's base URL —
    // the identity provider app will embed this in the JWT's aud claim so we can
    // verify the token was issued specifically for us.
    const userRequest: UserRequest = {
      type: 'fdc3.security.userRequest',
      aud: requestingApp.baseUrl,
    };

    // Sign the userRequest on the backend. The signature proves our identity to the
    // identity provider app and allows it to encrypt the response for our public key.
    const signResult = (await requestingHandlers.exchangeData('sign-context', userRequest)) as UserRequestSignResult;

    // Raise the GetUser intent with the signed context.
    const resolution = await mockRequesting.raiseIntent(GET_USER_INTENT as Intent, userRequest, null, undefined, {
      signature: signResult.signature,
      antiReplay: signResult.antiReplay,
    });

    // The result is fdc3.security.encryptedContext — the JWT is encrypted with our public
    // key. We pass it to the backend for decryption, JWT verification, and projection
    // to fdc3.contact, so the raw JWT never reaches the frontend.
    const userResult = await resolution.getResult();

    console.log('[RequestingApp Front End] Result from GetUser', userResult);

    // Backend decrypts, verifies the JWT signature, and returns a typed fdc3.contact
    // wrapped in { context } as required by the exchangeData return shape.
    const identityOut = await requestingHandlers.exchangeData(EXCHANGE_GET_USER_IDENTITY, userResult);
    assertDefined(identityOut, 'step4RequestingAppRaiseGetUser: get-user-identity exchangeData');
    if (!('context' in (identityOut as object))) {
      throw new Error('step4RequestingAppRaiseGetUser: get-user-identity result missing context field');
    }
    const contact = (identityOut as { context: Contact }).context;
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
