import { AppIdentifier, Context } from '@finos/fdc3-context';
import { WebSocket } from 'ws';
import { Channel, DesktopAgent } from '@finos/fdc3-standard';

import { JosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { DefaultFDC3Handlers, PRIVATE_CHANNEL_SIGNAL, PrivateChannelSignal } from '../src/secure-boundary/FDC3Handlers';
import { connectRemoteHandlers } from '../src/secure-boundary/ClientSideHandlersImpl';
import { EncryptedBroadcastSupport, EncryptedBroadcaster } from '../src/encryption/EncryptedBroadcastSupport';
import { PrivateEncryptedContextListenerSupport } from '../src/encryption/EncryptedContextListenerSupport';
import { AppBackEnd } from '../test/mocks/AppBackEnd';
import { createMockDesktopAgent, resetMockDesktopAgentFixtureState } from '../test/mocks/MockDesktopAgent';
import { fileURLToPath } from 'url';
import { resolve } from 'path';
import { createMetadataHandlerWithFDC3Version, type MetadataHandler } from '../src/delegates/MetadataHandler';

const INTENT_SHARE_ENCRYPTED_CHANNEL = 'ShareEncryptedChannel';

/**
 * Broadcasting app backend handlers (broadcaster, key creator). Receives the channel via handleRemoteChannel,
 * uses EncryptedBroadcastSupport so encryption is done entirely on the backend. The symmetric key
 * is created and held on the backend; key requests are responded to on the backend.
 *
 * BACKEND KEY PATTERN: The symmetric key never leaves the backend. Every decrypted message
 * incurs a backend round-trip, which largely offsets the latency advantage of symmetric encryption.
 * Use this pattern when decrypted plaintext must never exist in browser memory — for example,
 * when handling highly regulated data or when the browser environment itself is not trusted.
 * For lower-latency decryption where the browser is trusted, see frontend-encrypted-channel-example.ts.
 */
class BroadcastingAppBackendHandlers extends DefaultFDC3Handlers {
  private broadcaster: EncryptedBroadcaster | null = null;
  private metadataHandler: MetadataHandler;

  constructor(
    private security: JosePrivateFDC3Security,
    _appIdentifier: AppIdentifier,
    fdc3Version: string
  ) {
    super();
    this.metadataHandler = createMetadataHandlerWithFDC3Version(fdc3Version);
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    if (purpose !== INTENT_SHARE_ENCRYPTED_CHANNEL) return;

    console.log(
      '[Broadcasting App Backend] Received channel via handleRemoteChannel, setting up EncryptedBroadcastSupport'
    );
    // EncryptedBroadcastSupport creates a fresh symmetric key and starts listening
    // for fdc3.security.symmetricKeyRequest messages on this channel so it can
    // distribute the key to verified listeners.
    const support = new EncryptedBroadcastSupport(this.security, this.metadataHandler);
    this.broadcaster = await support.broadcastWrapper(channel);
  }

  async remoteIntentHandler(intent: string) {
    if (intent !== INTENT_SHARE_ENCRYPTED_CHANNEL) return super.remoteIntentHandler(intent);
    // Return PRIVATE_CHANNEL_SIGNAL to tell the frontend to create a PrivateChannel
    // and export it to us via handleRemoteChannel.
    return async (_context: Context): Promise<PrivateChannelSignal> => {
      console.log('[Broadcasting App Backend] Intent ShareEncryptedChannel: signalling client to create channel');
      return PRIVATE_CHANNEL_SIGNAL;
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
  private metadataHandler: MetadataHandler;

  constructor(
    private security: JosePrivateFDC3Security,
    _appIdentifier: AppIdentifier,
    fdc3Version: string
  ) {
    super();
    this.metadataHandler = createMetadataHandlerWithFDC3Version(fdc3Version);
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    if (purpose !== 'listen') return;

    console.log('[Receiving App Backend] Received channel via handleRemoteChannel, setting up decryption listener');
    // PrivateEncryptedContextListenerSupport listens for fdc3.security.encryptedContext,
    // automatically requests the symmetric key from the broadcaster when needed,
    // and decrypts each payload using the backend's private key — so plaintext
    // never reaches the frontend.
    const support = new PrivateEncryptedContextListenerSupport(this.security, this.metadataHandler);
    await support.addContextListener(channel, 'test.encrypted', (ctx: Context, _meta, verification) => {
      console.log(`\n[Receiving App Backend] ✅ Decrypted context received (encryption done on backend):`);
      console.log(JSON.stringify(ctx, null, 2));
      // verification.encryption is 'decrypted' on successful decryption.
      if (verification.encryption === 'decrypted') {
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
    (_ws: WebSocket, security: JosePrivateFDC3Security, appIdentifier: AppIdentifier, fdc3Version: string) =>
      new ReceivingAppBackendHandlers(security, appIdentifier, fdc3Version)
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
    (_ws: WebSocket, security: JosePrivateFDC3Security, appIdentifier: AppIdentifier, fdc3Version: string) =>
      new BroadcastingAppBackendHandlers(security, appIdentifier, fdc3Version)
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
  mockDA: DesktopAgent
): Promise<Awaited<ReturnType<typeof connectRemoteHandlers>>> {
  console.log('3. Broadcasting app front-end: Connecting to backend, registering intent handler...');

  const handlers = await connectRemoteHandlers(broadcastingApp.baseUrl.replace('http', 'ws'), mockDA, async () => {});

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
  mockDA: DesktopAgent
): Promise<Awaited<ReturnType<typeof connectRemoteHandlers>>> {
  console.log('4. Receiving app front-end: Raising intent to broadcasting app, sending channel to backend...');

  const handlers = await connectRemoteHandlers(receivingApp.baseUrl.replace('http', 'ws'), mockDA, async () => {});

  // Raise the intent to obtain the PrivateChannel from the broadcasting app.
  const resolution = await mockDA.raiseIntent(INTENT_SHARE_ENCRYPTED_CHANNEL, { type: 'fdc3.nothing' } as Context);
  const channel = await resolution.getResult();

  // Forward the channel to the receiving app's backend via handleRemoteChannel.
  // The backend will set up PrivateEncryptedContextListenerSupport on it — all
  // decryption and key exchange happens there, never in the frontend.
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
export async function runExample(fdc3Version: string = '3.0'): Promise<void> {
  resetMockDesktopAgentFixtureState();
  console.log('--- FDC3 Encrypted Private Channel Example Start ---');

  const mockDA1 = createMockDesktopAgent(fdc3Version, { appId: 'receiving.app', instanceId: 'r1' });
  const mockDA2 = createMockDesktopAgent(fdc3Version, { appId: 'broadcasting.app', instanceId: 'b1' });

  const receivingApp = await step1SetupReceivingApp();
  const broadcastingApp = await step2SetupBroadcastingApp();

  const broadcastingAppHandlers = await step3BroadcastingAppRegisterIntentListener(broadcastingApp, mockDA1);
  const receivingAppHandlers = await step4ReceivingAppRaiseIntentAndSetupListener(receivingApp, mockDA2);

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
  const fdc3Version = process.argv[2] ?? '3.0';
  runExample(fdc3Version)
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Example failed:', err);
      process.exit(1);
    });
}
