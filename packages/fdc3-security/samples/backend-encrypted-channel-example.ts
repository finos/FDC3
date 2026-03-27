import { Context } from '@robmoffat/fdc3-context';
import { WebSocket } from 'ws';
import { Channel, ContextMetadata, DesktopAgent } from '@robmoffat/fdc3-standard';

import { JosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { DefaultFDC3Handlers } from '../src/secure-boundary/FDC3Handlers';
import { connectRemoteHandlers } from '../src/secure-boundary/ClientSideHandlersImpl';
import { EncryptedBroadcastSupport, EncryptedBroadcaster } from '../src/encryption/EncryptedBroadcastSupport';
import { PrivateEncryptedContextListenerSupport } from '../src/encryption/EncryptedContextListenerSupport';
import { AppBackEnd } from '../test/mocks/AppBackEnd';
import { MockDesktopAgent } from '../test/mocks/MockDesktopAgent';
import { fileURLToPath } from 'url';
import { resolve } from 'path';
import { MetadataHandlerImpl } from '../src/delegates/MetadataHandler';

const INTENT_SHARE_ENCRYPTED_CHANNEL = 'ShareEncryptedChannel';

const metadataHandler = new MetadataHandlerImpl(false);

/**
 * Broadcasting app backend handlers (broadcaster, key creator). Receives the channel via handleRemoteChannel,
 * uses EncryptedBroadcastSupport so encryption is done entirely on the backend. The symmetric key
 * is created and held on the backend; key requests are responded to on the backend.
 */
class BroadcastingAppBackendHandlers extends DefaultFDC3Handlers {
  private broadcaster: EncryptedBroadcaster | null = null;

  constructor(private security: JosePrivateFDC3Security) {
    super();
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    if (purpose !== INTENT_SHARE_ENCRYPTED_CHANNEL) return;

    console.log(
      '[Broadcasting App Backend] Received channel via handleRemoteChannel, setting up EncryptedBroadcastSupport'
    );
    const support = new EncryptedBroadcastSupport(this.security, metadataHandler);
    this.broadcaster = await support.broadcastWrapper(channel);
  }

  async remoteIntentHandler(intent: string) {
    if (intent !== INTENT_SHARE_ENCRYPTED_CHANNEL) return super.remoteIntentHandler(intent);
    return async (_context: Context) => {
      console.log('[Broadcasting App Backend] Intent ShareEncryptedChannel: signalling client to create channel');
      return { type: 'private' as const };
    };
  }

  runBroadcastLoop(): Promise<void> {
    return new Promise(resolve => {
      console.log('[Broadcasting App Backend] Starting broadcast loop...');
      let count = 0;
      const interval = setInterval(async () => {
        count++;
        console.log(`\n[Broadcasting App Backend] Broadcasting encrypted message ${count}...`);
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
 * Receiving app backend handlers – uses PrivateEncryptedContextListenerSupport for decryption. The symmetric key
 * is requested and unwrapped entirely on the backend when encrypted contexts arrive.
 */
class ReceivingAppBackendHandlers extends DefaultFDC3Handlers {
  constructor(private security: JosePrivateFDC3Security) {
    super();
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    if (purpose !== 'listen') return;

    console.log('[Receiving App Backend] Received channel via handleRemoteChannel, setting up decryption listener');
    const support = new PrivateEncryptedContextListenerSupport(this.security, metadataHandler);
    await support.addContextListener(channel, 'test.encrypted', (ctx: Context, meta?: ContextMetadata) => {
      console.log(`\n[Receiving App Backend] ✅ Decrypted context received (encryption done on backend):`);
      console.log(JSON.stringify(ctx, null, 2));
      if (meta?.encryption === 'decrypted') {
        console.log('[Receiving App Backend] Metadata indicates decryption performed on backend');
      }
    });
  }
}

/**
 * STEP 1: Setup receiving app backend (listener)
 */
async function step1SetupReceivingApp() {
  console.log('1. Starting receiving app backend...');
  const app = new AppBackEnd(
    (_ws: WebSocket, security: JosePrivateFDC3Security) => new ReceivingAppBackendHandlers(security)
  );
  await app.start();
  console.log(`[Receiving App] Listening at ${app.baseUrl}`);
  return app;
}

/**
 * STEP 2: Setup broadcasting app backend (broadcaster & key creator)
 */
async function step2SetupBroadcastingApp() {
  console.log('2. Starting broadcasting app backend...');
  const app = new AppBackEnd(
    (_ws: WebSocket, security: JosePrivateFDC3Security) => new BroadcastingAppBackendHandlers(security)
  );
  await app.start();
  console.log(`[Broadcasting App] Listening at ${app.baseUrl}`);
  return app;
}

/**
 * STEP 3: Broadcasting app "front-end" – connects to backend, registers intent handler.
 * The channel is created and exported when the intent is raised (in step 4).
 */
async function step3BroadcastingAppRegisterIntentListener(
  broadcastingApp: AppBackEnd,
  mockDA: MockDesktopAgent
): Promise<Awaited<ReturnType<typeof connectRemoteHandlers>>> {
  console.log('3. Broadcasting app front-end: Connecting to backend, registering intent handler...');

  const handlers = await connectRemoteHandlers(
    broadcastingApp.baseUrl.replace('http', 'ws'),
    mockDA as unknown as DesktopAgent,
    async () => {}
  );

  const intentHandler = await handlers.remoteIntentHandler(INTENT_SHARE_ENCRYPTED_CHANNEL);
  await mockDA.addIntentListener(INTENT_SHARE_ENCRYPTED_CHANNEL, intentHandler);
  return handlers;
}

/**
 * STEP 4: Receiving app "front-end" – raises intent to get the channel, sends channel to receiving app backend.
 * The intent handler (broadcasting app) creates the private channel and exports it to the broadcasting app backend via
 * handleRemoteChannel. The receiving app then sends the same channel to its backend for decryption.
 */
async function step4ReceivingAppRaiseIntentAndSetupListener(
  receivingApp: AppBackEnd,
  mockDA: MockDesktopAgent
): Promise<Awaited<ReturnType<typeof connectRemoteHandlers>>> {
  console.log('4. Receiving app front-end: Raising intent to broadcasting app, sending channel to backend...');

  const handlers = await connectRemoteHandlers(
    receivingApp.baseUrl.replace('http', 'ws'),
    mockDA as unknown as DesktopAgent,
    async () => {}
  );

  const resolution = await mockDA.raiseIntent(INTENT_SHARE_ENCRYPTED_CHANNEL, { type: 'fdc3.nothing' } as Context);
  const channel = await resolution.getResult();

  await handlers.handleRemoteChannel('listen', channel as Channel);
  return handlers;
}

/**
 * STEP 5: Broadcasting app triggers backend to start broadcasting.
 */
async function step5BroadcastingAppStartBroadcast(broadcastingApp: AppBackEnd): Promise<void> {
  console.log('5. Broadcasting app: Triggering backend to start encrypted broadcast...');
  await (broadcastingApp.handlers as BroadcastingAppBackendHandlers | null)?.runBroadcastLoop();
}

/**
 * MAIN EXECUTION
 *
 * Demonstrates EncryptedBroadcastSupport and PrivateEncryptedContextListenerSupport with FDC3Handlers:
 * - Broadcasting app backend: receives channel via handleRemoteChannel, uses EncryptedBroadcastSupport
 *   to encrypt before broadcast; responds to key requests (BasicEncryptedBroadcaster does this)
 * - Receiving app backend: receives channel via handleRemoteChannel, uses PrivateEncryptedContextListenerSupport
 *   to decrypt incoming contexts
 * - Front-end: only transports channels via handleRemoteChannel; no encryption/decryption on front-end
 */
export async function runExample(): Promise<void> {
  console.log('--- FDC3 Encrypted Private Channel Example Start ---');

  const receivingApp = await step1SetupReceivingApp();
  const broadcastingApp = await step2SetupBroadcastingApp();

  const mockDA = new MockDesktopAgent();

  const broadcastingAppHandlers = await step3BroadcastingAppRegisterIntentListener(broadcastingApp, mockDA);
  const receivingAppHandlers = await step4ReceivingAppRaiseIntentAndSetupListener(receivingApp, mockDA);

  await step5BroadcastingAppStartBroadcast(broadcastingApp);

  await broadcastingAppHandlers.disconnect();
  await receivingAppHandlers.disconnect();
  await receivingApp.shutdown();
  await broadcastingApp.shutdown();
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
