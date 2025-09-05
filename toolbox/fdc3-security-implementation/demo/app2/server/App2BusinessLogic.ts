import {
  Channel,
  ContextMetadata,
  EncryptingChannelDelegate,
  IntentHandler,
  PrivateChannel,
  PrivateFDC3Security,
  SigningChannelDelegate,
} from '@finos/fdc3';
import { Context, Valuation } from '@finos/fdc3-context';
import { FDC3Handlers } from '../../../src/helpers/FDC3Handlers';
import { createSymmetricKeyRequestContextListener } from '../../../src/helpers/SymmetricKeyContextListener';
import { ExchangeDataMessage } from '../../../src/helpers/MessageTypes';
/**
 * NB:  App2 doesn't have a session.   It checks each request in turn for signatures and user details.
 */
export class App2BusinessLogic implements FDC3Handlers {
  callback: (ctx: ExchangeDataMessage) => void;

  constructor(
    private readonly fdc3Security: PrivateFDC3Security,
    callback: (ctx: ExchangeDataMessage) => void
  ) {
    this.callback = callback;
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    if (purpose == 'demo.GetPrices') {
      // this is a channel created for get prices.
      const encryptedChannel = new EncryptingChannelDelegate(channel as PrivateChannel, this.fdc3Security);

      // make sure we encrypt all valuations on the channel
      await encryptedChannel.setChannelEncryption(type => type == 'fdc3.valuation');

      // listens for requests for the channel's symmetric key from valuation recipients
      await createSymmetricKeyRequestContextListener(this.fdc3Security, encryptedChannel);

      for (let i = 0; i < 5; i++) {
        setTimeout(async () => {
          const ctx: Valuation = {
            type: 'fdc3.valuation',
            currency: 'Dollars',
            CURRENCY_ISOCODE: 'USD',
            price: 100 + i,
            value: 100 + i,
          };
          await encryptedChannel.broadcast(ctx);
          console.log('broadcast complete ' + i);
          this.callback({ ctx, purpose: 'valuation' });
        }, i * 1000);
      }

      setTimeout(async () => encryptedChannel.disconnect(), 10000);
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

            if (user.sub == 'demo-user@example.com' && user.aud == 'http://localhost:4003') {
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
          error: `Unauthorized: ${JSON.stringify(ctx)}`,
        };
      };

      return ih;
    } else {
      throw new Error('Invalid intent');
    }
  }

  async exchangeData(purpose: string, ctx: Context): Promise<Context | void> {
    throw new Error('Method not implemented.');
  }
}
