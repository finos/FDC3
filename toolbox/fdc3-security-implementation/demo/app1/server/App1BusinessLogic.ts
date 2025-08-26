import { Channel, IntentHandler, PrivateChannel } from '@finos/fdc3';
import { Context } from '@finos/fdc3-context';
import {
  EncryptingChannelDelegate,
  PrivateFDC3Security,
  signedContext,
  SigningChannelDelegate,
} from '@finos/fdc3-security';
import { AbstractSessionHandlingBusinessLogic } from '../common/src/AbstractSessionHandlingBusinessLogic';
import { ContextMetadataWithAuthenticity } from '@finos/fdc3-security/dist/src/signing/SigningSupport';
import { createSymmetricKeyResponseContextListener } from '../../../src/helpers/SymmetricKeyContextListener';
import { ExchangeDataMessage } from '../../../src/helpers/MessageTypes';

export const GET_PRICES_PURPOSE = 'price-stream';

export class App1BusinessLogic extends AbstractSessionHandlingBusinessLogic {
  private fdc3Security: PrivateFDC3Security;
  private callback: (ctx: ExchangeDataMessage) => void;

  constructor(fdc3Security: PrivateFDC3Security, callback: (ctx: ExchangeDataMessage) => void) {
    super();
    this.fdc3Security = fdc3Security;
    this.callback = callback;
  }

  async signRequest(ctx: Context, intent: string | null, channelId: string | null): Promise<Context> {
    if (intent == 'GetUser' || intent == 'demo.GetPrices') {
      if (intent == 'demo.GetPrices') {
        ctx.__jwt = this.user?.jwt;
      }

      return await signedContext(this.fdc3Security, ctx, intent, channelId);
    } else {
      throw new Error('Invalid intent' + intent);
    }
  }

  async remoteIntentHandler(intent: string): Promise<IntentHandler> {
    throw new Error("App1 Doesn't handle intents");
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    if (purpose == 'demo.GetPrices') {
      // this is a channel created for get prices.
      const encryptedChannel = new EncryptingChannelDelegate(channel as PrivateChannel, this.fdc3Security);

      // ask for the symmetric key if we get things that are encrypted
      await createSymmetricKeyResponseContextListener(this.fdc3Security, encryptedChannel);

      encryptedChannel.addContextListener('fdc3.valuation', async (ctx, metadata: ContextMetadataWithAuthenticity) => {
        console.log('context listener called', ctx, metadata);
        this.callback({ ctx });
      });
    }
  }
}
