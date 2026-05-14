import { AppIdentifier, Context, SymmetricKeyResponse } from '@finos/fdc3-context';
import type { JsonWebKeyWithId } from '../src/impl/PublicFDC3Security';
import { WebSocket } from 'ws';
import { Channel, ContextMetadata, DesktopAgent } from '@finos/fdc3-standard';

import { JosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { createJosePublicFDC3SecurityFromUrl } from '../src/impl/JosePublicFDC3Security';
import { DefaultFDC3Handlers } from '../src/secure-boundary/FDC3Handlers';
import { connectRemoteHandlers } from '../src/secure-boundary/ClientSideHandlersImpl';
import { EncryptedBroadcastSupport, EncryptedBroadcaster } from '../src/encryption/EncryptedBroadcastSupport';
import { PublicEncryptedContextListenerSupport } from '../src/encryption/EncryptedContextListenerSupport';
import { AppBackEnd } from '../test/mocks/AppBackEnd';
import { createMockDesktopAgent, resetMockDesktopAgentFixtureState } from '../test/mocks/MockDesktopAgent';
import { createMetadataHandlerWithFDC3Version, type MetadataHandler } from '../src/delegates/MetadataHandler';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

const INTENT_SHARE_ENCRYPTED_CHANNEL = 'ShareEncryptedChannel';

/**
 * Broadcasting app backend – no exchangeData handlers needed.
 * The symmetric key and encryption live entirely on the front-end.
 */
class BroadcastingAppBackendHandlers extends DefaultFDC3Handlers {}

/**
 * Receiving app backend – provides sign-context (for key requests) and unwrap-symmetric-key via exchangeData.
 * The symmetric key is unwrapped on the backend; decryption happens on the front-end.
 */
class ReceivingAppBackendHandlers extends DefaultFDC3Handlers {
  constructor(private security: JosePrivateFDC3Security) {
    super();
  }

  async exchangeData(purpose: string, o: object): Promise<object | void> {
    if (purpose === 'sign-context') {
      const { context } = o as { context: Context };
      return await this.security.sign(context);
    }
    if (purpose === 'unwrap-symmetric-key') {
      const skr = o as SymmetricKeyResponse;
      return await this.security.unwrapSymmetricKey(skr);
    }
  }
}

/**
 * STEP 1: Setup receiving app backend (unwrap only)
 */
async function step1SetupReceivingApp() {
  console.log('1. Starting receiving app backend...');
  const app = new AppBackEnd(
    (_ws: WebSocket, security: JosePrivateFDC3Security, _appIdentifier: AppIdentifier, _fdc3Version: string) =>
      new ReceivingAppBackendHandlers(security)
  );
  await app.start();
  console.log(`[Receiving App] Listening at ${app.baseUrl}`);
  return app;
}

/**
 * STEP 2: Setup broadcasting app backend (sign only)
 */
async function step2SetupBroadcastingApp() {
  console.log('2. Starting broadcasting app backend...');
  const app = new AppBackEnd(
    (_ws: WebSocket, _security: JosePrivateFDC3Security, _appIdentifier: AppIdentifier, _fdc3Version: string) =>
      new BroadcastingAppBackendHandlers()
  );
  await app.start();
  console.log(`[Broadcasting App] Listening at ${app.baseUrl}`);
  return app;
}

/**
 * STEP 3: Broadcasting app front-end – creates channel, sets up EncryptedBroadcastSupport
 * (symmetric key on front-end), registers intent handler.
 */
async function step3BroadcastingAppSetup(
  broadcastingApp: AppBackEnd,
  mockDA: DesktopAgent,
  metadataHandler: MetadataHandler
): Promise<{ handlers: Awaited<ReturnType<typeof connectRemoteHandlers>>; broadcaster: EncryptedBroadcaster }> {
  console.log(
    '3. Broadcasting app front-end: Creating channel, setting up EncryptedBroadcastSupport (key on front-end)...'
  );

  const handlers = await connectRemoteHandlers(broadcastingApp.baseUrl.replace('http', 'ws'), mockDA, async () => {});

  const jwksUrl = `${broadcastingApp.baseUrl}/.well-known/jwks.json`;
  const publicSecurity = await createJosePublicFDC3SecurityFromUrl(jwksUrl, () => true);

  const channel = await mockDA.createPrivateChannel();
  const support = new EncryptedBroadcastSupport(publicSecurity, metadataHandler);
  const broadcaster = await support.broadcastWrapper(channel as Channel);

  const intentHandler = async () => {
    console.log('[Broadcasting App Front-end] Intent ShareEncryptedChannel: returning channel');
    return channel;
  };
  await mockDA.addIntentListener(INTENT_SHARE_ENCRYPTED_CHANNEL, intentHandler);

  return { handlers, broadcaster };
}

/**
 * STEP 4: Receiving app front-end – raises intent, gets channel, sets up PublicEncryptedContextListenerSupport
 * (decryption on front-end, unwrap via backend).
 */
async function step4ReceivingAppSetup(
  receivingApp: AppBackEnd,
  mockDA: DesktopAgent,
  metadataHandler: MetadataHandler
): Promise<Awaited<ReturnType<typeof connectRemoteHandlers>>> {
  console.log(
    '4. Receiving app front-end: Raising intent, setting up PublicEncryptedContextListenerSupport (decrypt on front-end)...'
  );

  const handlers = await connectRemoteHandlers(receivingApp.baseUrl.replace('http', 'ws'), mockDA, async () => {});

  const resolution = await mockDA.raiseIntent(INTENT_SHARE_ENCRYPTED_CHANNEL, { type: 'fdc3.nothing' } as Context);
  const channel = (await resolution.getResult()) as Channel;

  const jwksUrl = `${receivingApp.baseUrl}/.well-known/jwks.json`;
  const publicSecurity = await createJosePublicFDC3SecurityFromUrl(jwksUrl, () => true);

  const signingFunction = async (context: Context) => {
    const result = (await handlers.exchangeData('sign-context', { context })) as {
      signature: any;
      antiReplay: any;
    };
    return result;
  };

  const unwrapFunction = async (skr: SymmetricKeyResponse): Promise<JsonWebKeyWithId> => {
    return (await handlers.exchangeData('unwrap-symmetric-key', skr)) as JsonWebKeyWithId;
  };

  const support = new PublicEncryptedContextListenerSupport(
    publicSecurity,
    metadataHandler,
    signingFunction,
    unwrapFunction
  );

  await support.addContextListener(channel, 'test.encrypted', (ctx: Context, meta?: ContextMetadata) => {
    console.log(`\n[Receiving App Front-end] ✅ Decrypted context received (symmetric key on front-end):`);
    console.log(JSON.stringify(ctx, null, 2));
    if (meta?.encryption === 'decrypted') {
      console.log('[Receiving App Front-end] Metadata indicates decryption performed on front-end');
    }
  });

  return handlers;
}

/**
 * STEP 5: Broadcasting app front-end runs the broadcast loop
 */
async function step5BroadcastLoop(broadcaster: EncryptedBroadcaster): Promise<void> {
  console.log('5. Broadcasting app front-end: Starting encrypted broadcast loop...');
  return new Promise(resolve => {
    let count = 0;
    const interval = setInterval(async () => {
      count++;
      console.log(`\n[Broadcasting App Front-end] Broadcasting encrypted message ${count}...`);
      await broadcaster.broadcast({ type: 'test.encrypted', id: { num: count } } as Context);
      if (count >= 3) {
        clearInterval(interval);
        interval.unref();
        await broadcaster.shutdown();
        console.log('\n--- FDC3 Front-end Encrypted Channel Example Complete ---');
        resolve();
      }
    }, 1000);
  });
}

/**
 * MAIN EXECUTION
 *
 * Demonstrates EncryptedBroadcastSupport and PublicEncryptedContextListenerSupport:
 * - Broadcasting app front-end: EncryptedBroadcastSupport, key created and held on front-end.
 * - Receiving app front-end: PublicEncryptedContextListenerSupport, decrypts on front-end.
 *   Signs key requests and unwraps key responses via exchangeData to backend.
 */
export async function runExample(fdc3Version: string = '3.0'): Promise<void> {
  resetMockDesktopAgentFixtureState();
  console.log('--- FDC3 Front-end Encrypted Channel Example Start ---');

  const mockReceiving = createMockDesktopAgent(fdc3Version, { appId: 'receiving.app', instanceId: 'r1' });
  const mockBroadcasting = createMockDesktopAgent(fdc3Version, { appId: 'broadcasting.app', instanceId: 'b1' });
  const metadataHandler = createMetadataHandlerWithFDC3Version(fdc3Version);

  const receivingApp = await step1SetupReceivingApp();
  const broadcastingApp = await step2SetupBroadcastingApp();

  const { handlers: broadcastingHandlers, broadcaster } = await step3BroadcastingAppSetup(
    broadcastingApp,
    mockBroadcasting,
    metadataHandler
  );
  const receivingHandlers = await step4ReceivingAppSetup(receivingApp, mockReceiving, metadataHandler);

  await step5BroadcastLoop(broadcaster);

  await broadcastingHandlers.disconnect();
  await receivingHandlers.disconnect();
  await receivingApp.shutdown();
  await broadcastingApp.shutdown();
}

/**
 * Run as a script if called directly
 */
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
