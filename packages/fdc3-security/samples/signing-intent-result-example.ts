import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { DesktopAgent } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { createJosePublicFDC3SecurityFromUrl } from '../src/impl/JosePublicFDC3Security';
import { MockDesktopAgent } from '../test/mocks/MockDesktopAgent';
import { AppBackEnd } from '../test/mocks/AppBackEnd';
import { JosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { PrivateSignedIntentResultSupport } from '../src/signing/SignedIntentResultSupport';
import { BasicSignedRaiseIntentSupport } from '../src/signing/SignedRaiseIntentSupport';
import { DefaultFDC3Handlers } from '../src/secure-boundary/FDC3Handlers';
import { connectRemoteHandlers } from '../src/secure-boundary/ClientSideHandlersImpl';
import { MetadataHandlerImpl } from '../src/delegates/MetadataHandler';

const INTENT_GET_STATUS = 'GetStatus';
const metadataHandler = new MetadataHandlerImpl(false);

/**
 * Handler App backend handlers.
 * Handles the GetStatus intent and uses PrivateSignedIntentResultSupport
 * to sign the returned status context.
 */
class HandlerAppBackendHandlers extends DefaultFDC3Handlers {
  constructor(private security: JosePrivateFDC3Security) {
    super();
  }

  async remoteIntentHandler(intent: string) {
    if (intent !== INTENT_GET_STATUS) {
      return super.remoteIntentHandler(intent);
    }

    // Standard intent handler (doesn't check request signature)
    return async (_context: Context) => {
      console.log(`[Handler App Backend] Intent ${intent}: returning signed status response...`);

      const statusContext = {
        type: 'demo.status',
        id: { status: 'UP', load: 0.8 },
        name: 'System Status',
      } as Context;

      // Use PrivateSignedIntentResultSupport to sign the intent result
      const signer = new PrivateSignedIntentResultSupport(this.security, metadataHandler);
      return await signer.signIntentResult(statusContext);
    };
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

  const intentHandler = await handlers.remoteIntentHandler(INTENT_GET_STATUS);
  await mockDA.addIntentListener(INTENT_GET_STATUS, intentHandler);

  return { backend, handlers };
}

/**
 * STEP 2: Raiser App raises intent and verifies signed result using Support helper
 */
async function step2RaiserAppRaiseIntentAndVerify(mockDA: MockDesktopAgent, handlerAppBaseUrl: string) {
  console.log('\n2. Raiser App: Raising intent (unsigned request) to get status...');

  /**
   * Use BasicSignedRaiseIntentSupport to automate result verification.
   * Since this sample is for unsigned requests, the signingFunction is a no-op
   * that avoids adding signature metadata to the outgoing request.
   */
  const noOpSigner = async () => ({ signature: '', antiReplay: '' });

  const verificationFunction = async (sig: any, ctx: Context, antiReplay: any) => {
    const jwksUrl = `${handlerAppBaseUrl}/.well-known/jwks.json`;
    const publicSecurity = await createJosePublicFDC3SecurityFromUrl(jwksUrl, () => true);
    return await publicSecurity.verifySignature(sig, ctx, antiReplay);
  };

  const support = new BasicSignedRaiseIntentSupport(
    mockDA as unknown as DesktopAgent,
    noOpSigner,
    metadataHandler,
    verificationFunction
  );

  const resolution = await support.raiseIntent(INTENT_GET_STATUS, { type: 'fdc3.nothing' } as Context);

  console.log('   Raiser App: Awaiting result...');
  const result = (await resolution.getResult()) as Context;

  // The result is already verified and unpacked by the support class!
  const auth = (result as any).__appMeta?.authenticity;

  if (auth?.signed && auth?.valid && auth?.trusted) {
    console.log(`\n[Raiser App] ✅ VERIFIED SIGNED RESULT (Automatically verified by Support class):`);
    console.log(JSON.stringify(result, (key, val) => (key === '__appMeta' ? undefined : val), 2));
    console.log(`[Raiser App] Trusted Provider: ${auth.jku}`);
  } else {
    console.error(`\n[Raiser App] ❌ UNVERIFIED RESULT:`, auth?.errors);
  }
}

/**
 * MAIN EXECUTION
 */
async function runExample() {
  console.log('--- FDC3 Signing Intent Result Example Start ---');

  const mockDA = new MockDesktopAgent();
  const handlerApp = await step1SetupHandlerApp(mockDA);

  try {
    await step2RaiserAppRaiseIntentAndVerify(mockDA, handlerApp.backend.baseUrl);
  } finally {
    console.log('\nClosing connections...');
    await handlerApp.handlers.disconnect();
    await handlerApp.backend.shutdown();
  }

  console.log('\n--- FDC3 Signing Intent Result Example Complete ---');
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
