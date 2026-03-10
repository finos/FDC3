import { Context, SymmetricKeyResponse } from '@finos/fdc3-context';
import { WebSocket } from 'ws';
import { Channel, ContextMetadata, DesktopAgent, PrivateChannel } from '@finos/fdc3-standard';

import { JosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { createJosePublicFDC3SecurityFromUrl } from '../src/impl/JosePublicFDC3Security';
import { EncryptingChannelDelegate } from '../src/encryption/EncryptingChannelDelegate';
import {
  createSymmetricKeyRequestContextListener,
  createSymmetricKeyResponseContextListener,
} from '../src/encryption/SymmetricKeyContextListener';
import { DefaultFDC3Handlers } from '../src/secure-boundary/FDC3Handlers';
import { connectRemoteHandlers } from '../src/secure-boundary/ClientSideHandlersImpl';
import type { ExchangeDataMessage } from '../src/secure-boundary/MessageTypes';
import { AppBackEnd } from '../test/mocks/AppBackEnd';
import { MockDesktopAgent } from '../test/mocks/MockDesktopAgent';
import { fileURLToPath } from 'url';
import { resolve } from 'path';
import { checkSignature } from '../src/signing/SigningSupport';
import { signContext } from '../src/signing/SigningSupport';

const INTENT_SHARE_ENCRYPTED_CHANNEL = 'ShareEncryptedChannel';

/**
 * App B backend handlers (broadcaster, key creator, and intent resolver).
 * Receives the channel via handleRemoteChannel, wraps with EncryptingChannelDelegate,
 * and sets up symmetric key request handling. Responds to exchangeData('start-broadcast')
 * to begin the broadcast loop.
 */
class AppBBackendHandlers extends DefaultFDC3Handlers {
  private broadcastDelegate: EncryptingChannelDelegate | null = null;
  private channel: PrivateChannel | null = null;

  constructor(private security: JosePrivateFDC3Security) {
    super();
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    if (purpose !== 'broadcast') return;

    console.log('[App B Backend] Received channel via handleRemoteChannel, wrapping with EncryptingChannelDelegate');
    const delegate = new EncryptingChannelDelegate(channel as PrivateChannel, true, this.security);
    await delegate.setChannelEncryption(type => type === 'test.encrypted');
    await delegate.createSymmetricKey();
    await createSymmetricKeyRequestContextListener(this.security, delegate);
    this.broadcastDelegate = delegate;
    this.channel = channel as PrivateChannel;
  }

  async remoteIntentHandler(intent: string) {
    if (intent !== INTENT_SHARE_ENCRYPTED_CHANNEL) return super.remoteIntentHandler(intent);
    return async (_context: Context) => {
      if (!this.channel) throw new Error('Channel not yet created by App B');
      console.log('[App B Backend] Intent ShareEncryptedChannel: returning private channel to requester');
      return this.channel;
    };
  }

  runBroadcastLoop(): Promise<void> {
    return new Promise(resolve => {
      console.log('[App B Backend] Starting broadcast loop...');
      let count = 0;
      const interval = setInterval(async () => {
        count++;
        console.log(`\n[App B Backend] Broadcasting encrypted message ${count}...`);
        await this.broadcastDelegate!.broadcast({ type: 'test.encrypted', id: { num: count } });
        if (count >= 3) {
          clearInterval(interval);
          interval.unref();
          console.log('\n--- FDC3 Encrypted Private Channel Example Complete ---');
          resolve();
        }
      }, 1000);
    });
  }
}

/**
 * App A backend handlers – supports exchangeData for symmetric key unwrapping and signing.
 *
 * The symmetric key lives on the front-end. The backend only unwraps the encrypted key
 * when the front-end asks (via exchangeData('unwrap-symmetric-key')), using its private key.
 */
class AppABackendHandlers extends DefaultFDC3Handlers {
  constructor(private security: JosePrivateFDC3Security) {
    super();
  }

  async exchangeData(purpose: string, o: object): Promise<object | void> {
    if (purpose === 'unwrap-symmetric-key') {
      const { c, m } = o as { c: SymmetricKeyResponse; m: ContextMetadata };
      const { context, meta } = await checkSignature(this.security, m, c);
      const ma = meta?.authenticity;
      if (!ma?.signed || !ma.trusted || !ma.valid) {
        throw new Error('Symmetric key response not signed and trusted');
      }
      const key = await this.security.unwrapSymmetricKey(context as import('@finos/fdc3-context').SymmetricKeyResponse);
      console.log('[App A Backend] Unwrapped symmetric key (returning to front-end)');
      return key;
    }

    if (purpose === 'sign-context') {
      const result = await signContext(this.security, o as Context);
      return { ctx: result.ctx, meta: result.meta };
    }
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
 * STEP 3: App B "front-end" – connects to backend, creates private channel, exports via handleRemoteChannel.
 * Registers intent handler with mock DA so App A can raise intent to get the channel.
 */
async function step3AppBCreateChannelAndRegisterIntentListener(
  appB: AppBackEnd,
  mockDA: MockDesktopAgent
): Promise<Awaited<ReturnType<typeof connectRemoteHandlers>>> {
  console.log('3. App B front-end: Connecting to backend, creating private channel, registering intent handler...');

  const handlers = await connectRemoteHandlers(
    appB.baseUrl.replace('http', 'ws'),
    mockDA as unknown as DesktopAgent,
    async () => {}
  );

  const channel = await mockDA.createPrivateChannel();
  await handlers.handleRemoteChannel('broadcast', channel);
  const intentHandler = await handlers.remoteIntentHandler(INTENT_SHARE_ENCRYPTED_CHANNEL);
  await mockDA.addIntentListener(INTENT_SHARE_ENCRYPTED_CHANNEL, intentHandler);
  return handlers;
}

/**
 * STEP 4: App A "front-end" – raises intent to get the channel, wraps with EncryptingChannelDelegate,
 * and uses exchangeData to get the backend to unwrap the symmetric key. The symmetric key lives
 * on the front-end in the delegate.
 */
async function step4AppARaiseIntentAndSetupDelegate(
  appA: AppBackEnd,
  mockDA: MockDesktopAgent
): Promise<Awaited<ReturnType<typeof connectRemoteHandlers>>> {
  console.log('4. App A front-end: Raising intent to App B, setting up EncryptingChannelDelegate...');

  const handlers = await connectRemoteHandlers(
    appA.baseUrl.replace('http', 'ws'),
    mockDA as unknown as DesktopAgent,
    async () => {}
  );

  // get the private channel by raising an intent
  const resolution = await mockDA.raiseIntent(INTENT_SHARE_ENCRYPTED_CHANNEL, { type: 'fdc3.nothing' });

  const channel = await resolution.getResult();

  const jwksUrl = `${appA.baseUrl}/.well-known/jwks.json`;
  const appAPublicSecurity = await createJosePublicFDC3SecurityFromUrl(jwksUrl, () => true);

  const keyUnwrapFunction = async (skr: SymmetricKeyResponse) => {
    const result = await handlers.exchangeData('unwrap-symmetric-key', skr);
    return result as JsonWebKey;
  };

  const signRequestFunction = async (ctx: Context) => {
    const result = await handlers.exchangeData('sign-context', ctx);
    return result as { ctx: Context; meta: ContextMetadata };
  };

  const delegate = new EncryptingChannelDelegate(
    channel as PrivateChannel,
    true,
    appAPublicSecurity,
    keyUnwrapFunction,
    signRequestFunction
  );

  await delegate.setChannelEncryption(type => type === 'test.encrypted');
  await createSymmetricKeyResponseContextListener(appAPublicSecurity, delegate);
  await delegate.addContextListener('test.encrypted', (ctx: Context) => {
    console.log(`\n[App A Front-end] ✅ Decrypted context received (symmetric key lived on front-end):`);
    console.log(JSON.stringify(ctx, null, 2));
  });
  await (channel as Channel).addContextListener(null, (ctx: Context) => {
    console.log(`\n[App A Front-end] ✅ Raw context received:`);
    console.log(JSON.stringify(ctx, null, 2));
  });

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
 * Demonstrates the FDC3Handlers pattern with intent-based channel sharing:
 * - App B creates the private channel and registers an intent handler (ShareEncryptedChannel)
 * - App A raises the intent to App B to obtain the channel (standard FDC3 pattern)
 * - Front-end: holds channels, raises intents; Back-end: encrypts/decrypts, responds to intents
 * - App B back-end: creates symmetric key, responds to key requests, returns channel via intent
 * - App A front-end: holds EncryptingChannelDelegate and symmetric key; uses exchangeData to ask backend to unwrap key
 * - App A back-end: exchangeData('unwrap-symmetric-key') unwraps using private key, returns key to front-end
 */
export async function runExample(): Promise<void> {
  console.log('--- FDC3 Encrypted Private Channel Example Start ---');

  const appA = await step1SetupAppA();
  const appB = await step2SetupAppB();

  const mockDA = new MockDesktopAgent();

  const appBHandlers = await step3AppBCreateChannelAndRegisterIntentListener(appB, mockDA);
  const appAHandlers = await step4AppARaiseIntentAndSetupDelegate(appA, mockDA);

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
