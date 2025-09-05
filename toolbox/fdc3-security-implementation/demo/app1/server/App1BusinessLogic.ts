import { Channel, IntentHandler, PrivateChannel } from '@finos/fdc3';
import { Context, User } from '@finos/fdc3-context';
import {
  EncryptingChannelDelegate,
  MessageAuthenticity,
  PrivateFDC3Security,
  signedContext,
} from '@finos/fdc3-security';
import { checkSignature, ContextMetadataWithAuthenticity } from '@finos/fdc3-security/dist/src/signing/SigningSupport';
import { createSymmetricKeyResponseContextListener } from '../../../src/helpers/SymmetricKeyContextListener';
import { ExchangeDataMessage } from '../../../src/helpers/MessageTypes';

export const GET_PRICES_PURPOSE = 'price-stream';

export class App1BusinessLogic {
  private fdc3Security: PrivateFDC3Security;
  private callback: (ctx: ExchangeDataMessage) => void;
  private user: User | null = null;

  constructor(fdc3Security: PrivateFDC3Security, callback: (ctx: ExchangeDataMessage) => void) {
    this.fdc3Security = fdc3Security;
    this.callback = callback;
  }

  async exchangeData(purpose: string, ctx: Context, intent?: string, channelId?: string): Promise<Context | void> {
    if (purpose === 'user-request') {
      if (this.user) {
        return this.user;
      }

      const { context, meta } = await checkSignature(this.fdc3Security, undefined, ctx, 'GetUser', null);
      const ma = meta?.authenticity as MessageAuthenticity;
      if (ma.signed && ma.trusted && ma.valid) {
        // ok we can use the returned token
        const decryptedUser = await this.fdc3Security.decryptPrivateKey(context.__encrypted);
        if (decryptedUser.type === 'fdc3.user') {
          this.user = decryptedUser as User;
          return this.user;
        }
      }
    } else if (purpose === 'user-logout') {
      this.user = null;
    } else if (purpose === 'request-prices' && intent === 'demo.GetPrices') {
      if (this.user) {
        ctx.__jwt = this.user?.jwt;
      }

      return await signedContext(this.fdc3Security, ctx, intent, null);
    }
  }

  async remoteIntentHandler(intent: string): Promise<IntentHandler> {
    throw new Error("App1 Doesn't handle intents");
  }

  async handleRemoteChannel(purpose: string, channel: Channel): Promise<void> {
    console.log('handleRemoteChannel', purpose, channel);
    if (purpose == 'demo.GetPrices') {
      // this is a channel created for get prices.
      const encryptedChannel = new EncryptingChannelDelegate(channel as PrivateChannel, this.fdc3Security);

      // ask for the symmetric key if we get things that are encrypted
      await createSymmetricKeyResponseContextListener(this.fdc3Security, encryptedChannel);

      encryptedChannel.addContextListener('fdc3.valuation', async (ctx, metadata: ContextMetadataWithAuthenticity) => {
        console.log('context listener called', ctx, metadata);
        this.callback({ ctx, purpose: 'valuation' });
      });
    }
  }
}
