import { Channel, Context, ContextHandler, Listener, PrivateChannel } from '@finos/fdc3';
import { ChannelDelegate } from '../delegates/ChannelDelegate';
import { Check, Sign, signedContext, signingContextHandler } from './SigningSupport';

/**
 * Adds signing / checking support to any channel being wrapped
 */
export class SigningChannelDelegate extends ChannelDelegate {
  private readonly sign: Sign;
  private readonly check: Check;

  constructor(d: Channel | PrivateChannel, sign: Sign, check: Check) {
    super(d);
    this.sign = sign;
    this.check = check;
  }

  wrapContext(ctx: Context): Promise<Context> {
    return signedContext(this.sign, ctx, undefined, this.id);
  }

  addContextListener(context: any, handler?: any): Promise<Listener> {
    const theHandler: ContextHandler = handler ? handler : (context as ContextHandler);
    const theContextType: string | null = context && handler ? (context as string) : null;
    return super.addContextListener(
      theContextType,
      signingContextHandler(this.check, theHandler, () => Promise.resolve(this.delegate))
    );
  }
}
