import { ContextHandler, ContextMetadata, IntentHandler, IntentResult } from '@finos/fdc3';
import { Context, User } from '@finos/fdc3-context';
import { PrivateFDC3Security } from '@finos/fdc3-security';
import { AbstractSessionHandlingBusinessLogic } from '../common/src/AbstractSessionHandlingBusinessLogic';

export const GET_PRICES_PURPOSE = 'price-stream';

export class App1BusinessLogic extends AbstractSessionHandlingBusinessLogic {
  private fdc3Security: PrivateFDC3Security;

  constructor(fdc3Security: PrivateFDC3Security) {
    super();
    this.fdc3Security = fdc3Security;
  }

  async signRequest(ctx: Context, intent: string | null, channelId: string | null): Promise<Context> {
    if (intent == 'GetUser' || intent == 'demo.GetPrices') {
      const signature = await this.fdc3Security.sign(ctx, intent, channelId);
      return {
        ...ctx,
        __signature: signature,
      };
    } else {
      throw new Error('Invalid intent' + intent);
    }
  }

  async remoteContextHandler(
    purpose: string,
    channelId: string | null,
    callback: (ctx: Context, metadata: ContextMetadata) => void
  ): Promise<ContextHandler> {
    if (purpose == GET_PRICES_PURPOSE) {
      return async (context: Context, metadata: ContextMetadata | undefined) => {
        // here, we're going to inspect the price stream and decode it, sending back decrypted prices.
        return {
          type: 'fdc3.valuation',
          amount: 400,
        };
      };
    } else {
      throw new Error('Invalid purpose');
    }
  }

  async remoteIntentHandler(intent: string): Promise<IntentHandler> {
    throw new Error("App1 Doesn't handle intents");
  }
}
