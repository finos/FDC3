import { Context, UserRequest } from '@finos/fdc3-context';
import { DesktopAgent } from '@finos/fdc3-standard';

import { JosePublicFDC3Security, provisionJWKS } from '../src/impl/JosePublicFDC3Security';
import { connectRemoteHandlers } from '../src/secure-boundary/ClientSideHandlersImpl';
import { DefaultFDC3Handlers } from '../src/secure-boundary/FDC3Handlers';
import { AppBackEnd } from '../test/mocks/AppBackEnd';
import { JosePrivateFDC3Security } from '../src/impl/JosePrivateFDC3Security';
import { MockDesktopAgent } from '../test/mocks/MockDesktopAgent';

/**
 * IDP (Identity Provider) backend handlers.
 * Responds to user-request by creating a signed JWT and returning fdc3.user context.
 */
class IDPBackendHandlers extends DefaultFDC3Handlers {
  constructor(private security: JosePrivateFDC3Security) {
    super();
  }

  async exchangeData(purpose: string, ctx: Context): Promise<Context | void> {
    if (purpose === 'user-request' && ctx.type === 'fdc3.security.userRequest') {
      const aud = (ctx as UserRequest).aud;
      console.log(`[IDP Backend] Received user request for audience: ${aud}`);

      const jwt = await this.security.createJWTToken(aud, 'demo-user@example.com');
      const user: Context = {
        type: 'fdc3.user',
        id: { email: 'demo-user@example.com' },
        name: 'Demo User',
        jwt,
      };
      console.log('[IDP Backend] Returning fdc3.user with signed JWT');
      return user;
    }
  }
}

/**
 * User-requesting app: has its own backend and connects to the IDP to request user identity.
 */
class UserRequestingApp {
  readonly backend: AppBackEnd;
  readonly baseUrl: string;

  constructor(backend: AppBackEnd) {
    this.backend = backend;
    this.baseUrl = backend.baseUrl;
  }

  shutdown(): void {
    this.backend.shutdown();
  }

  /**
   * Connect to the IDP and request user identity. Verifies the JWT and returns the claims.
   */
  async requestUserFrom(idp: AppBackEnd): Promise<void> {
    const wsUrl = idp.baseUrl.replace('http', 'ws');
    console.log(`[UserRequestingApp] Connecting to IDP at ${wsUrl}...`);

    const securityClient = new JosePublicFDC3Security(
      idp.security.getPublicKeys()[0],
      idp.security.getPublicKeys()[1],
      url => provisionJWKS(url),
      () => true
    );

    const mockDA = new MockDesktopAgent() as unknown as DesktopAgent;
    const handlers = await connectRemoteHandlers(wsUrl, mockDA, async () => {});

    const result = await handlers.exchangeData('user-request', {
      type: 'fdc3.security.userRequest',
      aud: this.baseUrl,
    });

    if (result?.type === 'fdc3.user' && result.jwt) {
      const claims = await securityClient.verifyJWTToken(result.jwt);
      console.log('\n[UserRequestingApp] User received and JWT verified:');
      console.log(JSON.stringify({ name: result.name, id: result.id }, null, 2));
      console.log('[UserRequestingApp] JWT claims:');
      console.log(JSON.stringify(claims, null, 2));
      console.log(`[UserRequestingApp] User: ${claims.sub}, Issued by: ${claims.iss}`);
    } else {
      console.log('[UserRequestingApp] No user returned');
    }
  }
}

/**
 * STEP 1: Start IDP Backend
 */
async function step1SetupIDPBackend() {
  console.log('1. Start IDP Backend (Hosts JWKS and FDC3 Handlers)');
  const idp = new AppBackEnd((_, security) => new IDPBackendHandlers(security));
  await idp.start();
  console.log(`[IDP Server] Listening at ${idp.baseUrl}`);
  return idp;
}

/**
 * STEP 2: Start UserRequestingApp and request user from IDP
 */
async function step2UserRequestingAppRequestsUser(idp: AppBackEnd): Promise<void> {
  console.log('2. Start UserRequestingApp and request user from IDP...');
  const userRequestingAppBackend = new AppBackEnd((_, _security) => new DefaultFDC3Handlers());
  await userRequestingAppBackend.start();
  console.log(`[UserRequestingApp] Listening at ${userRequestingAppBackend.baseUrl}`);
  const userRequestingApp = new UserRequestingApp(userRequestingAppBackend);
  await userRequestingApp.requestUserFrom(idp);
  userRequestingApp.shutdown();
}

/**
 * MAIN EXECUTION
 *
 * This example demonstrates requesting and verifying user identity from an Identity Provider.
 * 1. Step 1: Start the IDP backend that creates signed JWT tokens for user identity.
 * 2. Step 2: Start the UserRequestingApp (with its own backend); it connects to the IDP,
 *    requests user via exchangeData, receives fdc3.user context, and verifies the JWT.
 */
async function runExample() {
  console.log('--- FDC3 Get User Example Start ---');

  const idp = await step1SetupIDPBackend();
  await step2UserRequestingAppRequestsUser(idp);

  console.log('\n--- FDC3 Get User Example Complete ---');
  idp.shutdown();
  process.exit(0);
}

runExample().catch(err => {
  console.error('Example failed:', err);
  process.exit(1);
});
