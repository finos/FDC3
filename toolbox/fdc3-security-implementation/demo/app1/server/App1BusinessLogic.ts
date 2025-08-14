import { Channel, ContextHandler, ContextMetadata, IntentHandler, IntentResult } from '@finos/fdc3';
import { Context, User } from '@finos/fdc3-context';
import { PrivateFDC3Security } from '@finos/fdc3-security';
import { AbstractSessionHandlingBusinessLogic } from '../common/src/AbstractSessionHandlingBusinessLogic';
import { ContextOrErrorMetadata } from '../../../src/helpers/FDC3Handlers';

export const GET_PRICES_PURPOSE = 'price-stream';

export class App1BusinessLogic extends AbstractSessionHandlingBusinessLogic {
  private fdc3Security: PrivateFDC3Security;

  constructor(fdc3Security: PrivateFDC3Security) {
    super();
    this.fdc3Security = fdc3Security;
  }

  async signRequest(ctx: Context, intent: string | null, channelId: string | null): Promise<Context> {
    if (intent == 'GetUser' || intent == 'demo.GetPrices') {
      if (intent == 'demo.GetPrices') {
        ctx.__jwt = this.user?.jwt;
      }

      const signature = await this.fdc3Security.sign(ctx, intent, channelId);
      return {
        ...ctx,
        __signature: signature,
      };
    } else {
      throw new Error('Invalid intent' + intent);
    }
  }

  async remoteIntentHandler(intent: string): Promise<IntentHandler> {
    throw new Error("App1 Doesn't handle intents");
  }

  createRemoteChannel(purpose: string): Promise<Channel> {
    throw new Error('Method not implemented.');
  }
  handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
