import { JosePublicFDC3Security, provisionJWKS } from '../src/impl/JosePublicFDC3Security';
import { connectRemoteHandlers } from '../src/secure-boundary/ClientSideHandlersImpl';
import { Channel, ContextMetadata, DesktopAgent } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { ExchangeDataMessage } from '../src/secure-boundary/MessageTypes';
import { MockDesktopAgent } from '../test/mocks/MockDesktopAgent';
import { startAppBackEnd } from '../test/mocks/AppBackEnd';
import { JosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { SigningChannelDelegate } from '../src/signing/SigningChannelDelegate';

import { DefaultFDC3Handlers } from '../src/secure-boundary/FDC3Handlers';

/**
 * APP A BACKEND HANDLERS
 */
class AppABackendHandlers extends DefaultFDC3Handlers {
  private security: JosePrivateFDC3Security;
  private channel: Channel | null = null;

  constructor(security: JosePrivateFDC3Security) {
    super();
    this.security = security;
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    console.log(`[App A Backend] Received remote channel for purpose: ${purpose}`);
    // Wrap with SigningChannelDelegate to handle signing automatically
    this.channel = new SigningChannelDelegate(channel, this.security, false);
    // Wait for listener to be ready
    setTimeout(() => this.broadcast(), 1000);
  }

  async broadcast() {
    if (!this.channel) return;

    console.log('[App A Backend] Broadcasting instrument...');
    const instrument: Context = {
      type: 'fdc3.instrument',
      id: { ticker: 'AAPL' },
      name: 'Apple Inc.',
    };

    await this.channel.broadcast(instrument);
  }
}

/**
 * MAIN EXECUTION
 */
async function step1SetupAppABackend() {
  console.log('1. Start App A Backend (Hosts JWKS and FDC3 Handlers)');
  const result = await startAppBackEnd(0, (_, security) => new AppABackendHandlers(security));
  const wsUrl = result.baseUrl.replace('http', 'ws');
  console.log(`[Server] Listening at ${result.baseUrl}`);
  return { ...result, wsUrl };
}

async function step2SetupAppBFrontEnd(securityA: JosePrivateFDC3Security, httpServer: any) {
  console.log('2. App B Front-end Setup (trusts App A via the URL)');
  console.log('[App B Front-end] Setting up listener on User Channel 1...');

  const mockDA_B = new MockDesktopAgent();
  const chanB = await mockDA_B.getOrCreateChannel('fdc3.channel.1');

  const securityB_Public = new JosePublicFDC3Security(
    securityA.getPublicKeys()[0],
    securityA.getPublicKeys()[1],
    url => provisionJWKS(url), // REAL resolver using fetch
    () => true
  );

  // Wrap the channel with SigningChannelDelegate for automatic verification
  const signedChanB = new SigningChannelDelegate(chanB, securityB_Public, false);

  // A. Listen to the raw channel to show what's "on the wire"
  await chanB.addContextListener('fdc3.instrument', async ctx => {
    console.log('[App B Front-end] >>> [RAW ON-WIRE] Context Received:');
    console.log(JSON.stringify(ctx, null, 2));
  });

  // B. Listen via the Delegate to show the processed/verified version
  await signedChanB.addContextListener('fdc3.instrument', async (ctx: Context, meta: ContextMetadata | undefined) => {
    console.log('[App B Front-end] <<< [VERIFIED] Context Received:');
    console.log(JSON.stringify(ctx, null, 2));
    console.log('[App B Front-end] <<< [VERIFIED] Metadata Received:');
    console.log(JSON.stringify(meta, null, 2));

    if (meta?.authenticity) {
      const auth = meta.authenticity;
      if (auth.signed) {
        console.log('[App B Front-end] Verification Result: ✅ VALID');
        console.log(`[App B Front-end] Trusted Provider: ${auth.jku}`);
      } else {
        console.log('[App B Front-end] Context was not signed.');
        if (auth.errors) {
          console.log('[App B Front-end] Errors:', auth.errors);
        }
      }
    }

    console.log('--- FDC3 Signing Example End ---');
    httpServer.close();
    process.exit(0);
  });
}

async function step3SetupAppAFrontEnd(wsUrl: string) {
  console.log('3. App A Front-end Execution');
  console.log('[App A Front-end] Connecting to remote handlers...');

  const mockDA_A = new MockDesktopAgent() as unknown as DesktopAgent;
  const appAFEHandlers = await connectRemoteHandlers(wsUrl, mockDA_A, async (msg: ExchangeDataMessage) => {
    console.log('[App A Front-end] Callback from backend:', msg.purpose);
  });

  const channel1 = await mockDA_A.getOrCreateChannel('fdc3.channel.1');
  console.log('[App A Front-end] Passing User Channel 1 to Backend...');
  await appAFEHandlers.handleRemoteChannel('signing-demo', channel1);
}

/**
 * MAIN EXECUTION
 *
 * This example demonstrates a complete FDC3 signing and verification flow across a secure boundary.
 * 1. Step 1 (Backend): Starts a server that acts as a trusted security provider, hosting a JWKS
 *    and handling remote FDC3 messages for signing.
 * 2. Step 2 (App B - Receiver): Sets up a client application that listens for contexts. It uses
 *    JosePublicFDC3Security to trust the backend and SigningChannelDelegate to automatically
 *    verify the authenticity and integrity of incoming messages.
 * 3. Step 3 (App A - Sender): Connects a client to the backend to perform a signed broadcast.
 */
async function runExample() {
  console.log('--- FDC3 Signing Example Start (Localhost Edition) ---');

  const { security: securityA, httpServer, wsUrl } = await step1SetupAppABackend();
  await step2SetupAppBFrontEnd(securityA, httpServer);
  await step3SetupAppAFrontEnd(wsUrl);
}

runExample().catch(err => {
  console.error('Example failed:', err);
  process.exit(1);
});
