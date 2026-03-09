import { Context } from '@finos/fdc3-context';
import { WebSocket } from 'ws';
import { JosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { EncryptingChannelDelegate } from '../src/encryption/EncryptingChannelDelegate';
import {
  createSymmetricKeyRequestContextListener,
  createSymmetricKeyResponseContextListener,
} from '../src/encryption/SymmetricKeyContextListener';
import { DefaultFDC3Handlers } from '../src/secure-boundary/FDC3Handlers';
import { AppBackEnd } from '../test/mocks/AppBackEnd';
import { MockPrivateChannel } from '../test/mocks/MockPrivateChannel';

/**
 * STEP 1: Setup App A (listener)
 */
async function step1SetupAppA() {
  console.log('1. Starting App A backend...');
  const app = new AppBackEnd((_ws: WebSocket, _security: JosePrivateFDC3Security) => new DefaultFDC3Handlers());
  await app.start();
  return app;
}

/**
 * STEP 2: Setup App B (broadcaster)
 */
async function step2SetupAppB() {
  console.log('2. Starting App B backend...');
  const app = new AppBackEnd((_ws: WebSocket, _security: JosePrivateFDC3Security) => new DefaultFDC3Handlers());
  await app.start();
  return app;
}

/**
 * STEP 3: Setup App B (The Broadcaster & Key Creator)
 */
async function step3SetupAppBChannelDelegate(
  appBSecurity: JosePrivateFDC3Security,
  privateChannel: MockPrivateChannel
) {
  console.log('3. App B Setup: Initializing private channel delegate for broadcasting...');
  // Note: We use metadataAvailable: true here so signatures are propagated in standard metadata argument
  const appBDelegate = new EncryptingChannelDelegate(privateChannel, true, appBSecurity);
  await appBDelegate.setChannelEncryption(type => {
    return type == 'test.encrypted';
  });

  // Start the symmetric key request listener.
  // It will create a symmetric key automatically and provide it upon valid request.
  await createSymmetricKeyRequestContextListener(appBSecurity, appBDelegate);

  return appBDelegate;
}

/**
 * STEP 4: Setup App A (The Listener / Receiver)
 */
async function step4SetupAppAChannelDelegate(
  appASecurity: JosePrivateFDC3Security,
  privateChannel: MockPrivateChannel
) {
  console.log('4. App A Setup: Resolving intent and connecting to Private Channel as listener...');

  const appADelegate = new EncryptingChannelDelegate(privateChannel, true, appASecurity);

  // App A needs a listener to receive the wrapped symmetric key when requested
  await createSymmetricKeyResponseContextListener(appASecurity, appADelegate);

  // App A adds a normal context listener for the encrypted content
  appADelegate.addContextListener('test.encrypted', (ctx: Context) => {
    console.log(`\n[App A] \u2705 Successfully Received and Decrypted Context:`);
    console.log(JSON.stringify(ctx, null, 2));
  });

  return appADelegate;
}

/**
 * STEP 5: App B Broadcasts Encrypted Messages
 */
function step5AppBBroadcasts(appBDelegate: EncryptingChannelDelegate, apps: AppBackEnd[]): void {
  console.log('[App B] Starting to broadcast encrypted messages...');

  let count = 0;
  const interval = setInterval(async () => {
    count++;
    console.log(`\n[App B] Broadcasting encrypted message ${count}...`);
    await appBDelegate.broadcast({ type: 'test.encrypted', id: { num: count } });

    if (count >= 10) {
      clearInterval(interval);
      console.log('\n--- FDC3 Encrypted Private Channel Example Complete ---');
      apps.forEach(app => app.shutdown());
    }
  }, 1000);
}

/**
 * MAIN EXECUTION
 *
 * This example simulates a private channel over which two applications stream encrypted
 * data securely using symmetric encryption, securely distributing the symmetric key
 * upon request.
 */
async function runExample() {
  console.log('--- FDC3 Encrypted Private Channel Example Start ---');

  const appA = await step1SetupAppA();
  const appB = await step2SetupAppB();
  const privateChannel = new MockPrivateChannel('private-channel-1');

  const appBDelegate = await step3SetupAppBChannelDelegate(appB.security, privateChannel);
  await step4SetupAppAChannelDelegate(appA.security, privateChannel);
  step5AppBBroadcasts(appBDelegate, [appA, appB]);
}

runExample().catch(err => {
  console.error('Error running example:', err);
});
