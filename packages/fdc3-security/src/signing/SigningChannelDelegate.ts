import { Channel, ContextHandler, ContextMetadata, Listener, PrivateChannel } from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { signatureCheckingContextHandler, signContext } from './SigningSupport';
import { AbstractChannelDelegate } from '../delegates/AbstractChannelDelegate';
import { PrivateFDC3Security } from '../impl/PrivateFDC3Security';
import { PublicFDC3Security } from '../impl/PublicFDC3Security';

/**
 * Adds signing / checking support to any channel being wrapped.
 * If you construct this class with a PublicFDC3Security implementation, you'll have messages checked.
 * If constructed with a PrivateFDC3Security implementation, they'll also be signed.
 */
export class SigningChannelDelegate extends AbstractChannelDelegate {
  private readonly fdc3Security: PublicFDC3Security;

  constructor(d: Channel | PrivateChannel, fdc3Security: PublicFDC3Security, metadataAvailable: boolean) {
    super(d, metadataAvailable);
    this.fdc3Security = fdc3Security;
  }

  canSign(): boolean {
    const hasSign = typeof (this.fdc3Security as any).sign === 'function';
    if (!hasSign) {
      console.log('SigningChannelDelegate: Security provider does not have sign method', this.fdc3Security);
    }
    return hasSign;
  }

  async wrapContext(ctx: Context, meta?: ContextMetadata): Promise<{ ctx: Context; meta?: ContextMetadata }> {
    if (this.canSign()) {
      return signContext(this.fdc3Security as PrivateFDC3Security, ctx, meta);
    }
    return { ctx, meta };
  }

  addContextListener(context: any, handler?: any): Promise<Listener> {
    const theHandler: ContextHandler = handler ? handler : (context as ContextHandler);
    const theContextType: string | null = context && handler ? (context as string) : null;
    return super.addContextListener(theContextType, signatureCheckingContextHandler(this.fdc3Security, theHandler));
  }
}
