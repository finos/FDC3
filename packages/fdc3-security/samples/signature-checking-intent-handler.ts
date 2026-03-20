import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { ContextMetadata, DesktopAgent, IntentHandler } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { createJosePublicFDC3SecurityFromUrl } from '../src/impl/JosePublicFDC3Security';
import { MockDesktopAgent } from '../test/mocks/MockDesktopAgent';
import { AppBackEnd } from '../test/mocks/AppBackEnd';
import { JosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { PublicSignatureCheckingHandlerSupport } from '../src/signing/SignatureCheckingHandlerSupport';
import { PrivateSignedIntentResultSupport } from '../src/signing/SignedIntentResultSupport';
import { DefaultFDC3Handlers } from '../src/secure-boundary/FDC3Handlers';
import { connectRemoteHandlers } from '../src/secure-boundary/ClientSideHandlersImpl';
import { MetadataHandlerImpl } from '../src/delegates/MetadataHandler';

const INTENT_SEND_DATA = 'SendData';
const metadataHandler = new MetadataHandlerImpl(false);

/**
 * Handler App backend handlers.
 * Handles the SendData intent: receives a signed context, verifies it using
 * the SignatureCheckingHandlerSupport wrap, and returns a signed response.
 */
class HandlerAppBackendHandlers extends DefaultFDC3Handlers {
  constructor(private security: JosePrivateFDC3Security) {
    super();
  }

  async remoteIntentHandler(intent: string) {
    if (intent !== INTENT_SEND_DATA) {
      return super.remoteIntentHandler(intent);
    }

    // This is the core logic handler that only cares about verified contexts
    const coreHandler = async (context: Context, metadata?: ContextMetadata) => {
      console.log(`[Handler App Backend] Intent ${intent}: received context type ${context.type}`);

      const auth = metadata?.authenticity;
      if (auth?.signed && auth?.valid && auth?.trusted) {
        console.log(`[Handler App Backend] ✅ AUTHENTICATED: Request from ${auth.jku} is trusted.`);

        const response = {
          type: 'demo.response',
          id: { status: 'success', timestamp: new Date().toISOString() },
        } as Context;

        // Use SignedIntentResultSupport to sign the response
        const signer = new PrivateSignedIntentResultSupport(this.security, metadataHandler);
        return await signer.signIntentResult(response);
      } else {
        console.error(
          `[Handler App Backend] ❌ UNAUTHORIZED: Request signature is invalid or not trusted. Errors:`,
          auth?.errors
        );
        throw new Error('Unauthorized');
      }
    };

    // Use SignatureCheckingHandlerSupport to wrap the intent handler
    const verifier = new PublicSignatureCheckingHandlerSupport(metadataHandler, this.security);
    return (await verifier.wrapContextHandler(coreHandler as any)) as IntentHandler;
  }
}

/**
 * Raiser App backend handlers.
 * Provides a 'sign-context' purpose for its frontend to sign requests.
 */
class RaiserAppBackendHandlers extends DefaultFDC3Handlers {
  constructor(private security: JosePrivateFDC3Security) {
    super();
  }

  async exchangeData(purpose: string, o: object): Promise<object | void> {
    if (purpose === 'sign-context') {
      const { context } = o as { context: Context };
      console.log(`[Raiser App Backend] Signing context for frontend...`);
      return await this.security.sign(context);
    }
    return super.exchangeData(purpose, o);
  }
}

/**
 * STEP 1: Setup Handler App
 */
async function step1SetupHandlerApp(mockDA: MockDesktopAgent) {
  console.log('1. Starting Handler App backend...');
  const backend = new AppBackEnd((_ws, security) => new HandlerAppBackendHandlers(security));
  await backend.start();

  console.log('   Handler App Frontend: Connecting to backend, registering intent listener...');
  const handlers = await connectRemoteHandlers(
    backend.baseUrl.replace('http', 'ws'),
    mockDA as unknown as DesktopAgent,
    async () => {}
  );

  const intentHandler = await handlers.remoteIntentHandler(INTENT_SEND_DATA);
  await mockDA.addIntentListener(INTENT_SEND_DATA, intentHandler);

  return { backend, handlers };
}

/**
 * STEP 2: Setup Raiser App
 */
async function step2SetupRaiserApp(mockDA: MockDesktopAgent) {
  console.log('2. Starting Raiser App backend...');
  const backend = new AppBackEnd((_ws, security) => new RaiserAppBackendHandlers(security));
  await backend.start();

  console.log('   Raiser App Frontend: Connecting to its own backend...');
  const handlers = await connectRemoteHandlers(
    backend.baseUrl.replace('http', 'ws'),
    mockDA as unknown as DesktopAgent,
    async () => {}
  );

  return { backend, handlers };
}

/**
 * STEP 3: Raiser App signs request, raises intent, and verifies response
 */
async function step3RaiserAppRaiseIntentAndVerify(
  raiserHandlers: Awaited<ReturnType<typeof connectRemoteHandlers>>,
  mockDA: MockDesktopAgent,
  handlerAppBaseUrl: string
) {
  console.log('\n3. Raiser App: Signing request context via its backend...');
  const requestContext: Context = {
    type: 'demo.request',
    id: { dataId: '12345' },
    name: 'Sample Request Data',
  };

  const { signature, antiReplay } = (await raiserHandlers.exchangeData('sign-context', {
    context: requestContext,
  })) as any;
  const { context: signedContext } = metadataHandler.pack(requestContext, { signature, antiReplay });

  console.log(`   Raiser App: Raising intent ${INTENT_SEND_DATA} with signed context...`);
  const resolution = await mockDA.raiseIntent(INTENT_SEND_DATA, signedContext);

  console.log('   Raiser App: Awaiting result...');
  const result = (await resolution.getResult()) as Context;
  console.log(`\n[Raiser App] Result received from ${INTENT_SEND_DATA}:`);

  // Verify the response from Handler App
  const { context: response, metadata } = metadataHandler.unpack(result, {});
  const { signature: resSig, antiReplay: resAntiReplay } = metadata;

  const jwksUrl = `${handlerAppBaseUrl}/.well-known/jwks.json`;
  const publicSecurity = await createJosePublicFDC3SecurityFromUrl(jwksUrl, () => true);
  const authenticity = await publicSecurity.verifySignature(resSig, response, resAntiReplay);

  if (authenticity.signed && authenticity.valid && authenticity.trusted) {
    console.log(`[Raiser App] ✅ VERIFIED RESPONSE:`);
    console.log(JSON.stringify(response, null, 2));
    console.log(`[Raiser App] Trusted Provider: ${authenticity.jku}`);
  } else {
    console.error(`[Raiser App] ❌ UNVERIFIED RESPONSE:`, authenticity.errors);
  }
}

/**
 * MAIN EXECUTION
 */
async function runExample() {
  console.log('--- FDC3 Signature Checking Intent Handler Example Start ---');

  const mockDA = new MockDesktopAgent();

  const handlerApp = await step1SetupHandlerApp(mockDA);
  const raiserApp = await step2SetupRaiserApp(mockDA);

  try {
    await step3RaiserAppRaiseIntentAndVerify(raiserApp.handlers, mockDA, handlerApp.backend.baseUrl);
  } finally {
    console.log('\nClosing connections...');
    await handlerApp.handlers.disconnect();
    await raiserApp.handlers.disconnect();
    await handlerApp.backend.shutdown();
    await raiserApp.backend.shutdown();
  }

  console.log('\n--- FDC3 Signature Checking Intent Handler Example Complete ---');
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
