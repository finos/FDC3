import { Channel, ContextHandler, Listener, PrivateChannel } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { PrivateFDC3Security } from '../PrivateFDC3Security';
import { signingContextHandler } from './SigningSupport';
import { AbstractChannelDelegate } from '../delegates/AbstractChannelDelegate';

/**
 * Adds signing / checking support to any channel being wrapped.
 */
export class SigningChannelDelegate extends AbstractChannelDelegate {
  private readonly fdc3Security: PrivateFDC3Security;

  constructor(d: Channel | PrivateChannel, fdc3Security: PrivateFDC3Security) {
    super(d);
    this.fdc3Security = fdc3Security;
  }

  async wrapContext(ctx: Context): Promise<Context> {
    const jws = await this.fdc3Security.sign(ctx, null, this.id);
    const out = {
      ...ctx,
      __signature: jws,
    };
    return out;
  }

  addContextListener(context: any, handler?: any): Promise<Listener> {
    const theHandler: ContextHandler = handler ? handler : (context as ContextHandler);
    const theContextType: string | null = context && handler ? (context as string) : null;
    return super.addContextListener(
      theContextType,
      signingContextHandler(this.fdc3Security, theHandler, () => Promise.resolve(this.delegate))
    );
  }
}
