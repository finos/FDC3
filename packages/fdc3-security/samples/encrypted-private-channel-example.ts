import { Context } from '@finos/fdc3-context';
import { WebSocket } from 'ws';
import { Channel, ContextMetadata, DesktopAgent } from '@finos/fdc3-standard';

import { JosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { DefaultFDC3Handlers } from '../src/secure-boundary/FDC3Handlers';
import { connectRemoteHandlers } from '../src/secure-boundary/ClientSideHandlersImpl';
import { PrivateEncryptionSupport, EncryptedBroadcaster } from '../src/encryption/EncryptionSupport';
import { AppBackEnd } from '../test/mocks/AppBackEnd';
import { MockDesktopAgent } from '../test/mocks/MockDesktopAgent';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

const INTENT_SHARE_ENCRYPTED_CHANNEL = 'ShareEncryptedChannel';

/**
 * App B backend handlers (broadcaster, key creator). Receives the channel via handleRemoteChannel,
 * uses PrivateEncryptionSupport so encryption is done entirely on the backend. The symmetric key
 * is created and held on the backend; key requests are responded to on the backend.
 */
class AppBBackendHandlers extends DefaultFDC3Handlers {
  private broadcaster: EncryptedBroadcaster | null = null;

  constructor(private security: JosePrivateFDC3Security) {
    super();
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    if (purpose !== INTENT_SHARE_ENCRYPTED_CHANNEL) return;

    console.log('[App B Backend] Received channel via handleRemoteChannel, setting up PrivateEncryptionSupport');
    const support = new PrivateEncryptionSupport(this.security);
    this.broadcaster = await support.broadcastWrapper(channel);
  }

  async remoteIntentHandler(intent: string) {
    if (intent !== INTENT_SHARE_ENCRYPTED_CHANNEL) return super.remoteIntentHandler(intent);
    return async (_context: Context) => {
      if (!this.broadcaster) throw new Error('Channel not yet set up by App B');
      console.log('[App B Backend] Intent ShareEncryptedChannel: returning private channel to requester');
      return { type: 'private' as const };
    };
  }

  runBroadcastLoop(): Promise<void> {
    return new Promise(resolve => {
      console.log('[App B Backend] Starting broadcast loop...');
      let count = 0;
      const interval = setInterval(async () => {
        count++;
        console.log(`\n[App B Backend] Broadcasting encrypted message ${count}...`);
        await this.broadcaster!.broadcast({ type: 'test.encrypted', id: { num: count } } as Context);
        if (count >= 3) {
          clearInterval(interval);
          interval.unref();
          await this.broadcaster!.shutdown();
          console.log('\n--- FDC3 Encrypted Private Channel Example Complete ---');
          resolve();
        }
      }, 1000);
    });
  }
}

/**
 * App A backend handlers – uses PrivateEncryptionSupport for decryption. The symmetric key
 * is requested and unwrapped entirely on the backend when encrypted contexts arrive.
 */
class AppABackendHandlers extends DefaultFDC3Handlers {
  constructor(private security: JosePrivateFDC3Security) {
    super();
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    if (purpose !== 'listen') return;

    console.log('[App A Backend] Received channel via handleRemoteChannel, setting up decryption listener');
    const support = new PrivateEncryptionSupport(this.security);
    await support.addContextListener(channel, 'test.encrypted', (ctx: Context, meta?: ContextMetadata) => {
      console.log(`\n[App A Backend] ✅ Decrypted context received (encryption done on backend):`);
      console.log(JSON.stringify(ctx, null, 2));
      if (meta?.encryption === 'decrypted') {
        console.log('[App A Backend] Metadata indicates decryption performed on backend');
      }
    });
  }
}

/**
 * STEP 1: Setup App A backend (listener)
 */
async function step1SetupAppA() {
  console.log('1. Starting App A backend...');
  const app = new AppBackEnd((_ws: WebSocket, security: JosePrivateFDC3Security) => new AppABackendHandlers(security));
  await app.start();
  console.log(`[App A] Listening at ${app.baseUrl}`);
  return app;
}

/**
 * STEP 2: Setup App B backend (broadcaster & key creator)
 */
async function step2SetupAppB() {
  console.log('2. Starting App B backend...');
  const app = new AppBackEnd((_ws: WebSocket, security: JosePrivateFDC3Security) => new AppBBackendHandlers(security));
  await app.start();
  console.log(`[App B] Listening at ${app.baseUrl}`);
  return app;
}

/**
 * STEP 3: App B "front-end" – connects to backend, registers intent handler.
 * The channel is created and exported when the intent is raised (in step 4).
 */
async function step3AppBRegisterIntentListener(
  appB: AppBackEnd,
  mockDA: MockDesktopAgent
): Promise<Awaited<ReturnType<typeof connectRemoteHandlers>>> {
  console.log('3. App B front-end: Connecting to backend, registering intent handler...');

  const handlers = await connectRemoteHandlers(
    appB.baseUrl.replace('http', 'ws'),
    mockDA as unknown as DesktopAgent,
    async () => {}
  );

  const intentHandler = await handlers.remoteIntentHandler(INTENT_SHARE_ENCRYPTED_CHANNEL);
  await mockDA.addIntentListener(INTENT_SHARE_ENCRYPTED_CHANNEL, intentHandler);
  return handlers;
}

/**
 * STEP 4: App A "front-end" – raises intent to get the channel, sends channel to App A backend.
 * The intent handler (App B) creates the private channel and exports it to App B backend via
 * handleRemoteChannel. App A then sends the same channel to App A backend for decryption.
 */
async function step4AppARaiseIntentAndSetupListener(
  appA: AppBackEnd,
  mockDA: MockDesktopAgent
): Promise<Awaited<ReturnType<typeof connectRemoteHandlers>>> {
  console.log('4. App A front-end: Raising intent to App B, sending channel to App A backend...');

  const handlers = await connectRemoteHandlers(
    appA.baseUrl.replace('http', 'ws'),
    mockDA as unknown as DesktopAgent,
    async () => {}
  );

  const resolution = await mockDA.raiseIntent(INTENT_SHARE_ENCRYPTED_CHANNEL, { type: 'fdc3.nothing' } as Context);
  const channel = await resolution.getResult();

  await handlers.handleRemoteChannel('listen', channel as Channel);
  return handlers;
}

/**
 * STEP 5: App B triggers backend to start broadcasting via exchangeData.
 */
async function step5AppBStartBroadcast(appB: AppBackEnd): Promise<void> {
  console.log('5. App B: Triggering backend to start encrypted broadcast...');
  await (appB.handlers as AppBBackendHandlers | null)?.runBroadcastLoop();
}

/**
 * MAIN EXECUTION
 *
 * Demonstrates PrivateEncryptionSupport with FDC3Handlers – channel encryption entirely on the backend:
 * - App B backend: receives channel via handleRemoteChannel, uses PrivateEncryptionSupport.broadcastWrapper
 *   to encrypt before broadcast; responds to key requests (BasicEncryptedBroadcaster does this)
 * - App A backend: receives channel via handleRemoteChannel, uses PrivateEncryptionSupport.addContextListener
 *   to decrypt incoming contexts
 * - Front-end: only transports channels via handleRemoteChannel; no encryption/decryption on front-end
 */
export async function runExample(): Promise<void> {
  console.log('--- FDC3 Encrypted Private Channel Example Start ---');

  const appA = await step1SetupAppA();
  const appB = await step2SetupAppB();

  const mockDA = new MockDesktopAgent();

  const appBHandlers = await step3AppBRegisterIntentListener(appB, mockDA);
  const appAHandlers = await step4AppARaiseIntentAndSetupListener(appA, mockDA);

  await step5AppBStartBroadcast(appB);

  await appBHandlers.disconnect();
  await appAHandlers.disconnect();
  await appA.shutdown();
  await appB.shutdown();
}

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
