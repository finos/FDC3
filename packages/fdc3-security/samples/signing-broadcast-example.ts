import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { Channel, ContextMetadata } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { JosePublicFDC3Security, provisionJWKS } from '../src/impl/JosePublicFDC3Security';
import { MockDesktopAgent } from '../test/mocks/MockDesktopAgent';
import { AppBackEnd } from '../test/mocks/AppBackEnd';
import { JosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { SigningChannelDelegate } from '../src/signing/SigningChannelDelegate';
import { DefaultFDC3Handlers } from '../src/secure-boundary/FDC3Handlers';

/**
 * STEP 1: Setup App A (sender) backend
 */
async function step1SetupAppABackend() {
  console.log('1. Starting App A backend...');
  const app = new AppBackEnd((_ws, _security) => new DefaultFDC3Handlers());
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
 * STEP 3: Setup App A (sender) channel delegate and broadcast
 */
async function step3SetupAppAChannelDelegate(
  appASecurity: JosePrivateFDC3Security,
  channel: Channel
): Promise<SigningChannelDelegate> {
  console.log('3. App A Setup: Wrapping channel with SigningChannelDelegate...');
  const appADelegate = new SigningChannelDelegate(channel, appASecurity, false);
  return appADelegate;
}

/**
 * STEP 4: Setup App B (receiver) channel delegate and listener.
 * Fetches App A's public keys from JWKS URL (as a real receiver would from jku in signatures).
 */
async function step4SetupAppBChannelDelegate(
  appABaseUrl: string,
  channel: Channel
): Promise<{ delegate: SigningChannelDelegate; done: Promise<void> }> {
  console.log('4. App B Setup: Fetching App A keys from JWKS, wrapping channel...');

  const jwksUrl = `${appABaseUrl}/.well-known/jwks.json`;
  const jwks = await fetch(jwksUrl).then(r => r.json());
  const keys = jwks.keys as JsonWebKey[];
  const securityB = new JosePublicFDC3Security(
    keys[0],
    keys[1],
    url => provisionJWKS(url),
    () => true
  );

  const appBDelegate = new SigningChannelDelegate(channel, securityB, false);

  let resolveDone: () => void;
  const done = new Promise<void>(r => {
    resolveDone = r;
  });

  await appBDelegate.addContextListener('fdc3.instrument', async (ctx: Context, meta: ContextMetadata | undefined) => {
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
  });

  return { delegate: appBDelegate, done };
}

/**
 * STEP 5: App A broadcasts signed context
 */
async function step5AppABroadcasts(appADelegate: SigningChannelDelegate): Promise<void> {
  console.log('\n[App A] Broadcasting instrument...');
  await appADelegate.broadcast({
    type: 'fdc3.instrument',
    id: { ticker: 'AAPL' },
    name: 'Apple Inc.',
  });
}

/**
 * MAIN EXECUTION
 *
 * This example demonstrates a complete FDC3 signing and verification flow.
 * 1. Step 1: App A backend (hosts JWKS, holds signing keys).
 * 2. Step 2: App B backend (provides its own security; receiver fetches App A's keys from JWKS).
 * 3. Step 3–4: Both wrap the shared channel; App B fetches keys from App A's JWKS URL.
 * 5. Step 5: App A broadcasts; App B receives and verifies.
 */
async function runExample(): Promise<void> {
  console.log('--- FDC3 Signing Example Start ---');

  const appA = await step1SetupAppABackend();
  const appB = await step2SetupAppBBackend();
  const channel = await new MockDesktopAgent().getOrCreateChannel('fdc3.channel.1');

  const appADelegate = await step3SetupAppAChannelDelegate(appA.security, channel);
  const { done } = await step4SetupAppBChannelDelegate(appA.baseUrl, channel);

  await step5AppABroadcasts(appADelegate);
  await done;

  [appA, appB].forEach(app => app.shutdown());
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
