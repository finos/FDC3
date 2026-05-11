import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { Channel, ContextHandler, ContextMetadata, DesktopAgent } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { createJosePublicFDC3SecurityFromUrl } from '../src/impl/JosePublicFDC3Security';
import { MockDesktopAgent } from '../test/mocks/MockDesktopAgent';
import { AppBackEnd } from '../test/mocks/AppBackEnd';
import { JosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { BasicSignedBroadcaster, SignedBroadcaster } from '../src/signing/SignedBroadcastSupport';
import { PublicSignatureCheckingHandlerSupport } from '../src/signing/SignatureCheckingHandlerSupport';
import { DefaultFDC3Handlers } from '../src/secure-boundary/FDC3Handlers';
import { connectRemoteHandlers } from '../src/secure-boundary/ClientSideHandlersImpl';
import { MetadataHandlerImpl } from '../src/delegates/MetadataHandler';

const metadataHandler = new MetadataHandlerImpl(false, { appId: 'test.app', instanceId: '123' });

/**
 * App A backend handlers (sender). Receives the channel via handleRemoteChannel,
 * wraps with BasicSignedBroadcaster (signing happens on backend).
 */
class AppABackendHandlers extends DefaultFDC3Handlers {
  signedBroadcaster: SignedBroadcaster | null = null;

  constructor(private security: JosePrivateFDC3Security) {
    super();
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    if (purpose !== 'broadcast') return;
    console.log('[App A Backend] Received channel via handleRemoteChannel, wrapping with BasicSignedBroadcaster');
    this.signedBroadcaster = new BasicSignedBroadcaster(this.security, metadataHandler, channel);
  }

  async broadcast(): Promise<void> {
    console.log('\n[App A Backend] Signing and broadcasting instrument...');
    const instrument = {
      type: 'fdc3.instrument',
      id: { ticker: 'AAPL' },
      name: 'Apple Inc.',
    } as Context;
    await this.signedBroadcaster!.broadcast(instrument);
    return;
  }
}

/**
 * STEP 1: Setup App A (sender) backend
 */
async function step1SetupAppABackend() {
  console.log('1. Starting App A backend...');
  const app = new AppBackEnd((_ws, security) => new AppABackendHandlers(security));
  await app.start();
  return app;
}

/**
 * STEP 2: Setup App B (receiver) backend
 */
async function step2SetupAppBBackend() {
  console.log('2. Starting App B backend...');
  const app = new AppBackEnd((_ws, _security) => new DefaultFDC3Handlers());
  await app.start();
  return app;
}

/**
 * STEP 3: App A front-end exports channel to backend; backend wraps with BasicSignedBroadcaster.
 */
async function step3AppAExportChannel(appA: AppBackEnd, mockDA: MockDesktopAgent) {
  console.log('3. App A Setup: Exporting channel to backend (BasicSignedBroadcaster lives on backend)...');
  const handlers = await connectRemoteHandlers(
    appA.baseUrl.replace('http', 'ws'),
    mockDA as unknown as DesktopAgent,
    async () => {}
  );
  const channel = await mockDA.getOrCreateChannel('fdc3.channel.1');
  await handlers.handleRemoteChannel('broadcast', channel);
  return handlers;
}

/**
 * STEP 4: Setup App B (receiver) channel handler verification and listener.
 * Uses App B's JWKS for the instance; verification fetches signer keys from jku in each signature.
 */
async function step4SetupAppBChannelDelegate(appBBaseUrl: string, channel: Channel): Promise<{ done: Promise<void> }> {
  console.log('4. App B Setup: Wrapping channel handler (verification uses jku from signatures)...');

  const jwksUrl = `${appBBaseUrl}/.well-known/jwks.json`;
  const securityB = await createJosePublicFDC3SecurityFromUrl(jwksUrl, () => true);

  const support = new PublicSignatureCheckingHandlerSupport(metadataHandler, securityB);

  let resolveDone: () => void;
  const done = new Promise<void>(r => {
    resolveDone = r;
  });

  const handler = async (ctx: Context, meta: ContextMetadata | undefined) => {
    console.log('[App B] <<< [VERIFIED] Context Received:');
    console.log(JSON.stringify(ctx, null, 2));
    console.log('[App B] <<< [VERIFIED] Metadata Received:');
    console.log(JSON.stringify(meta, null, 2));

    if (meta?.authenticity) {
      const auth = meta.authenticity;
      if (auth.signed && auth.trusted) {
        console.log('[App B] Verification Result: ✅ TRUSTED');
        console.log(`[App B] Trusted Provider: ${auth.jku}`);
      } else if (auth.errors) {
        console.log('[App B] Errors:', auth.errors);
      }
    }

    console.log('--- FDC3 Signing Example End ---');
    resolveDone!();
  };

  const verifiedHandler = (await support.wrapContextHandler(handler as ContextHandler)) as ContextHandler;
  await channel.addContextListener('fdc3.instrument', verifiedHandler);

  return { done };
}

/**
 * STEP 5: App A backend signs and broadcasts the instrument (via app.handlers set when client connected).
 */
async function step5AppABackendBroadcasts(appA: AppBackEnd): Promise<void> {
  const handlers = appA.handlers as AppABackendHandlers | null;
  if (!handlers) throw new Error('App A handlers not set - ensure step3 connected first');
  await handlers.broadcast();
}

/**
 * MAIN EXECUTION
 *
 * This example demonstrates a complete FDC3 signing and verification flow with FDC3Handlers.
 * - App A backend: receives channel, wraps with BasicSignedBroadcaster, signs and broadcasts instrument on trigger
 * - App A front-end: exports channel, triggers backend via exchangeData (context lives in backend)
 * - App B: wraps channel, verifies using jku from signatures, receives.
 */
async function runExample(): Promise<void> {
  console.log('--- FDC3 Signing Example Start ---');

  const appA = await step1SetupAppABackend();
  const appB = await step2SetupAppBBackend();
  const mockDA = new MockDesktopAgent();
  const channel = await mockDA.getOrCreateChannel('fdc3.channel.1');

  const appAHandlers = await step3AppAExportChannel(appA, mockDA);
  const { done } = await step4SetupAppBChannelDelegate(appB.baseUrl, channel);

  await step5AppABackendBroadcasts(appA);
  await done;

  await appAHandlers.disconnect();
  await appA.shutdown();
  await appB.shutdown();
}

export { runExample };

/**
 * Run as a script if called directly
 */
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === resolve(__filename)) {
  runExample()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Example failed:', err);
      process.exit(1);
    });
}
