import { Channel, ContextMetadata, IntentHandler, PrivateFDC3Security } from '@finos/fdc3';
import { Context } from '@finos/fdc3-context';
import { FDC3Handlers } from '../../../src/helpers/FDC3Handlers';

/**
 * NB:  App2 doesn't have a session.   It checks each request in turn for signatures and user details.
 */
export class App2BusinessLogic implements FDC3Handlers {
  constructor(private readonly fdc3Security: PrivateFDC3Security) {}

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    if (purpose == 'demo.GetPrices') {
      // this is a channel created for get prices.

      for (let i = 0; i < 10; i++) {
        setTimeout(
          async () =>
            channel.broadcast({
              type: 'fdc3.valuation',
              price: 100 + i,
            }),
          i * 1000
        );
      }
    }
  }

  async remoteIntentHandler(intent: string): Promise<IntentHandler> {
    if (intent == 'demo.GetPrices') {
      const ih: IntentHandler = async (ctx: Context, metadata: ContextMetadata | undefined) => {
        // first, check the signature
        const sig = ctx.__signature;
        delete ctx.__signature;
        const ma = await this.fdc3Security.check(sig, ctx, intent, null);
        if (ma.signed && ma.trusted && ma.valid) {
          // now, check the user.
          const userJwt = ctx.__jwt;
          if (userJwt) {
            const user = await this.fdc3Security.verifyJWTToken(userJwt);

            if (user.sub == 'demo-user' && user.aud == 'http://localhost:4003') {
              // ok, we trust this user / app combination.
              // return a price.

              return {
                type: 'private',
              };
            }
          }
        }

        return {
          type: 'fdc3.error',
          error: `Unauthorized: ${ctx}`,
        };
      };

      return ih;
    } else {
      throw new Error('Invalid intent');
    }
  }

  async exchangeData(ctx: Context): Promise<Context | void> {
    throw new Error('Method not implemented.');
  }

  async signRequest(ctx: Context, intent: string | null, channelId: string | null): Promise<Context> {
    throw new Error("App2 Doesn't Sign Things");
  }
}
