import { Listener, PrivateChannel } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';

import { createJosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { MockChannel } from '../test/mocks/MockChannel';
import { EncryptingChannelDelegate } from '../src/encryption/EncryptingChannelDelegate';
import {
  createSymmetricKeyRequestContextListener,
  createSymmetricKeyResponseContextListener,
} from '../src/encryption/SymmetricKeyContextListener';
import * as jose from 'jose';
import { JWKSResolver } from '../src/impl/JosePublicFDC3Security';

class MockPrivateChannel extends MockChannel implements PrivateChannel {
  constructor(id: string) {
    super(id, 'private');
  }
  onAddContextListener(handler: (contextType?: string) => void): Listener {
    return { unsubscribe: async () => {} };
  }
  onUnsubscribe(handler: (contextType?: string) => void): Listener {
    return { unsubscribe: async () => {} };
  }
  onDisconnect(handler: () => void): Listener {
    return { unsubscribe: async () => {} };
  }
  async disconnect(): Promise<void> {}
  async addEventListener(type: string | null, handler: any): Promise<Listener> {
    return { unsubscribe: async () => {} };
  }
}

async function runExample() {
  console.log('--- FDC3 Encrypted Private Channel Example Start ---');

  // Setup local registry for JWKS resolving without a real HTTP server
  const registry: Record<string, JsonWebKey[]> = {};
  const resolver = (url: string) => {
    const keys = registry[url] || [];
    const localSet = jose.createLocalJWKSet({ keys: keys as any });
    const r: any = async (ph: any, tok: any) => localSet(ph, tok);
    r.reload = async () => {};
    r.jwks = () => ({ keys });
    return r as JWKSResolver;
  };

  // 1. Create App A and App B Security Objects
  const appASecurity = await createJosePrivateFDC3Security('http://localhost:1111', resolver, () => true);
  const appBSecurity = await createJosePrivateFDC3Security('http://localhost:2222', resolver, () => true);

  registry['http://localhost:1111/.well-known/jwks.json'] = [
    appASecurity.signingPublicKey,
    appASecurity.wrappingPublicKey,
  ];
  registry['http://localhost:2222/.well-known/jwks.json'] = [
    appBSecurity.signingPublicKey,
    appBSecurity.wrappingPublicKey,
  ];

  // 2. Setup the underlying "wire" mock channel
  const privateChannel = new MockPrivateChannel('private-channel-1');

  // 3. App B Setup
  console.log('[App B] Initializing private channel delegate...');
  // Note: We use metadataAvailable: true here so signatures are propagated in standard metadata argument
  const appBDelegate = new EncryptingChannelDelegate(privateChannel, true, appBSecurity);
  await appBDelegate.setChannelEncryption(type => {
    return type !== 'fdc3.security.symmetricKeyRequest' && type !== 'fdc3.security.symmetricKeyResponse';
  }); // Encrypt general contexts, but keep protocol negotiation in clear text

  // Start the symmetric key request listener.
  // It will create a symmetric key automatically and provide it upon valid request.
  await createSymmetricKeyRequestContextListener(appBSecurity, appBDelegate);

  console.log('[App A] Resolving intent and connecting to Private Channel...');

  // 4. App A Setup
  const appADelegate = new EncryptingChannelDelegate(privateChannel, true, appASecurity);

  // App A needs a listener to receive the wrapped symmetric key when requested
  await createSymmetricKeyResponseContextListener(appASecurity, appADelegate);

  // App A adds a normal context listener
  appADelegate.addContextListener('test.encrypted', (ctx: Context) => {
    console.log(`\n[App A] \u2705 Successfully Received and Decrypted Context:`);
    console.log(JSON.stringify(ctx, null, 2));
  });

  console.log('[App B] Starting to broadcast encrypted messages...');

  // 5. App B begins broadcasting
  let count = 0;
  const interval = setInterval(async () => {
    count++;
    console.log(`\n[App B] Broadcasting encrypted message ${count}...`);
    await appBDelegate.broadcast({ type: 'test.encrypted', id: { num: count } });

    if (count >= 10) {
      clearInterval(interval);
      console.log('\n--- FDC3 Encrypted Private Channel Example Complete ---');
    }
  }, 1000);
}

runExample().catch(err => {
  console.error('Error running example:', err);
});
