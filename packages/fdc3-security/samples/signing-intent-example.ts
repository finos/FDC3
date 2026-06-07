import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { ContextMetadata, DesktopAgent, IntentHandler } from '@finos/fdc3-standard';
import { AppIdentifier, Context } from '@finos/fdc3-context';
import { WebSocket } from 'ws';
import { createJosePublicFDC3SecurityFromUrl } from '../src/impl/JosePublicFDC3Security';
import { createMockDesktopAgent, resetMockDesktopAgentFixtureState } from '../test/mocks/MockDesktopAgent';
import { AppBackEnd } from '../test/mocks/AppBackEnd';
import { JosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { PublicSignatureCheckingHandlerSupport } from '../src/signing/SignatureCheckingHandlerSupport';
import { PrivateSignedIntentResultSupport } from '../src/signing/SignedIntentResultSupport';
import { BasicSignedRaiseIntentSupport } from '../src/signing/SignedRaiseIntentSupport';
import { DefaultFDC3Handlers } from '../src/secure-boundary/FDC3Handlers';
import { connectRemoteHandlers } from '../src/secure-boundary/ClientSideHandlersImpl';
import { createMetadataHandlerWithFDC3Version, type MetadataHandler } from '../src/delegates/MetadataHandler';

const INTENT_DATA_TRANSFER = 'DataTransfer';

/**
 * Handler App Backend Handlers.
 * Implements a mutually authenticated intent handler:
 * 1. Verifies the incoming signed intent request.
 * 2. Processes the request only if authenticated.
 * 3. Signs the response context before returning it.
 */
class HandlerAppBackendHandlers extends DefaultFDC3Handlers {
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
    if (intent !== INTENT_DATA_TRANSFER) {
      return super.remoteIntentHandler(intent);
    }

    // Core logic handler - executes only after signature verification
    const coreHandler = async (context: Context, metadata?: ContextMetadata) => {
      console.log('[Handler App Backend] Intent received', { intent, contextType: context.type });

      const auth = metadata?.authenticity;
      if (auth?.signed && auth?.valid && auth?.trusted) {
        console.log('[Handler App Backend] ✅ AUTHENTICATED: Request is trusted.', {
          jku: auth.jku,
          context,
          metadata,
        });

        const response = {
          type: 'demo.response',
          id: { status: 'success', timestamp: new Date().toISOString() },
        } as Context;

        // Sign the intent result (response)
        const signer = new PrivateSignedIntentResultSupport(this.security, this.metadataHandler);
        return await signer.signIntentResult(response);
      } else {
        console.error(
          `[Handler App Backend] ❌ UNAUTHORIZED: Request signature is invalid or not trusted. Errors:`,
          auth?.errors
        );
        throw new Error('Unauthorized');
      }
    };

    // Wrap the core handler with SignatureCheckingHandlerSupport for automatic verification
    const verifier = new PublicSignatureCheckingHandlerSupport(this.metadataHandler, this.security);
    return (await verifier.wrapContextHandler(coreHandler as any)) as IntentHandler;
  }
}

/**
 * Raiser App Backend Handlers.
 * Provides a 'sign-context' service for the frontend to sign intent requests
 * without possessing the private key.
 */
class RaiserAppBackendHandlers extends DefaultFDC3Handlers {
  constructor(private security: JosePrivateFDC3Security) {
    super();
  }

  async exchangeData(purpose: string, o: object): Promise<object | void> {
    if (purpose === 'sign-context') {
      const { context } = o as { context: Context };
      console.log('[Raiser App Backend] Signing intent request context...');
      // Return raw signature metadata
      return await this.security.sign(context);
    }
    return super.exchangeData(purpose, o);
  }
}

/**
 * STEP 1: Setup Handler App
 */
async function step1SetupHandlerApp(mockDA: DesktopAgent) {
  console.log('1. Starting Handler App backend...');
  const backend = new AppBackEnd(
    (_ws: WebSocket, security: JosePrivateFDC3Security, appIdentifier: AppIdentifier, fdc3Version: string) =>
      new HandlerAppBackendHandlers(security, appIdentifier, fdc3Version)
  );
  await backend.start();

  console.log('   Handler App Frontend: Connecting to backend, registering intent listener...');
  const handlers = await connectRemoteHandlers(backend.baseUrl.replace('http', 'ws'), mockDA, async () => {});

  const intentHandler = await handlers.remoteIntentHandler(INTENT_DATA_TRANSFER);
  await mockDA.addIntentListener(INTENT_DATA_TRANSFER, intentHandler);

  return { backend, handlers };
}

/**
 * STEP 2: Setup Raiser App
 */
async function step2SetupRaiserApp(mockDA: DesktopAgent) {
  console.log('2. Starting Raiser App backend...');
  const backend = new AppBackEnd(
    (_ws: WebSocket, security: JosePrivateFDC3Security, _appIdentifier: AppIdentifier, _fdc3Version: string) =>
      new RaiserAppBackendHandlers(security)
  );
  await backend.start();

  console.log('   Raiser App Frontend: Connecting to its own backend...');
  const handlers = await connectRemoteHandlers(backend.baseUrl.replace('http', 'ws'), mockDA, async () => {});

  return { backend, handlers };
}

/**
 * STEP 3: Mutually Authenticated Intent Exchange
 * Raiser App signs request -> Handler App verifies -> Handler App signs response -> Raiser App verifies
 */
async function step3MutuallyAuthenticatedExchange(
  raiserHandlers: Awaited<ReturnType<typeof connectRemoteHandlers>>,
  mockDA: DesktopAgent,
  handlerAppBaseUrl: string,
  metadataHandler: MetadataHandler
) {
  console.log('\n3. Raiser App: Preparing mutually authenticated intent exchange...');

  const requestContext: Context = {
    type: 'demo.request',
    id: { dataId: 'secure-tx-777' },
    name: 'Secure Intent Payload',
  };

  /**
   * Setup SignedRaiseIntentSupport on the Raiser Frontend.
   * - signingFunction: Delegates signing to the Raiser Backend via exchangeData.
   * - verificationFunction: Automatically verifies the Handler App's response via its JWKS.
   */
  const signingFunction = async (ctx: Context) => {
    return (await raiserHandlers.exchangeData('sign-context', { context: ctx })) as any;
  };

  const verificationFunction = async (sig: any, ctx: Context, antiReplay: any) => {
    const jwksUrl = `${handlerAppBaseUrl}/.well-known/jwks.json`;
    const publicSecurity = await createJosePublicFDC3SecurityFromUrl(jwksUrl, () => true);
    return await publicSecurity.verifySignature(sig, ctx, antiReplay);
  };

  const support = new BasicSignedRaiseIntentSupport(mockDA, signingFunction, metadataHandler, verificationFunction);

  console.log('   Raiser App: Raising signed intent...', { intent: INTENT_DATA_TRANSFER, requestContext });
  const resolution = await support.raiseIntent(INTENT_DATA_TRANSFER, requestContext);

  console.log('   Raiser App: Awaiting signed response from handler...');
  const result = (await resolution.getResult()) as Context;
  const resultMetadata = await resolution.getResultMetadata();
  const auth = resultMetadata?.authenticity;
  console.log('   Raiser App: Received context and metadata:', result, resultMetadata);

  if (auth?.signed && auth?.valid && auth?.trusted) {
    console.log(`\n[Raiser App] ✅ MUTUAL AUTHENTICATION SUCCESSFUL:`);
    console.log(
      `[Raiser App] Verified Response:`,
      JSON.stringify(result, (k, v) => (k === '__appMeta' ? undefined : v), 2)
    );
    console.log('[Raiser App] Trusted Provider Identity:', auth.jku);
  } else {
    console.error(`\n[Raiser App] ❌ MUTUAL AUTHENTICATION FAILED:`, auth?.errors);
  }
}

/**
 * MAIN EXECUTION
 */
async function runExample(fdc3Version: string = '3.0') {
  resetMockDesktopAgentFixtureState();
  console.log('--- FDC3 Mutually Authenticated Intent Example Start ---');

  const mockHandler = createMockDesktopAgent(fdc3Version, { appId: 'handler.app', instanceId: 'h1' });
  const mockRaiser = createMockDesktopAgent(fdc3Version, { appId: 'raiser.app', instanceId: 'r1' });
  const metadataHandlerRaiser = createMetadataHandlerWithFDC3Version(fdc3Version);

  const handlerApp = await step1SetupHandlerApp(mockHandler);
  const raiserApp = await step2SetupRaiserApp(mockRaiser);

  try {
    await step3MutuallyAuthenticatedExchange(
      raiserApp.handlers,
      mockRaiser,
      handlerApp.backend.baseUrl,
      metadataHandlerRaiser
    );
  } finally {
    console.log('\nClosing connections...');
    await handlerApp.handlers.disconnect();
    await raiserApp.handlers.disconnect();
    await handlerApp.backend.shutdown();
    await raiserApp.backend.shutdown();
  }

  console.log('\n--- FDC3 Mutually Authenticated Intent Example Complete ---');
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
