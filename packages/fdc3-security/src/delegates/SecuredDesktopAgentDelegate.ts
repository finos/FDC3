import {
  DesktopAgent,
  IntentResolution,
  Listener,
  ContextHandler,
  Channel,
  IntentHandler,
  PrivateChannel,
  IntentResult,
} from '@finos/fdc3-standard';
import { Context } from '@finos/fdc3-context';
import { AbstractDesktopAgentDelegate } from '../delegates/AbstractDesktopAgentDelegate';
import { SigningChannelDelegate } from '../signing/SigningChannelDelegate';
import { EncryptingPrivateChannel } from '../encryption/EncryptingPrivateChannel';
import { EncryptingChannelDelegate } from '../encryption/EncryptingChannelDelegate';
import { signedContext, signingIntentHandler, signingContextHandler } from '../signing/SigningSupport';
import { PrivateFDC3Security } from '../PrivateFDC3Security';

/**
 * This implementation adds signing functionality to any broadcast context
 * and allows for the checking of signatures on items returned.
 */
export class SecuredDesktopAgentDelegate extends AbstractDesktopAgentDelegate {
  private readonly fdc3Security;

  constructor(d: DesktopAgent, fdc3Security: PrivateFDC3Security) {
    super(d);
    this.fdc3Security = fdc3Security;
  }

  wrapChannel(c: Channel): Channel {
    if ((c as any).delegate) {
      // channel already wrapped
      return c;
    } else if (c.type == 'app' || c.type == 'user') {
      return new SigningChannelDelegate(c, this.fdc3Security);
    } else if (c.type == 'private') {
      // private channels both sign and encrypt
      const channel = c as PrivateChannel;
      const signingChannel = new SigningChannelDelegate(channel, this.fdc3Security);
      const encryptingChannel = new EncryptingChannelDelegate(signingChannel, this.fdc3Security);
      return encryptingChannel;
    } else {
      /* istanbul ignore next */ throw new Error('Unknown Channel Type');
    }
  }

  wrapIntentResult(r: IntentResult): IntentResult {
    if (r == undefined) {
      return undefined;
    } else if (r.type == 'user' || r.type == 'private' || r.type == 'app') {
      return this.wrapChannel(r as Channel);
    } else {
      // just return context as-is
      return r;
    }
  }

  broadcast(context: Context): Promise<void> {
    return signedContext(this.fdc3Security, context, null, null).then(sc => super.broadcast(sc));
  }

  raiseIntent(intentName: string, context: Context, a3?: any): Promise<IntentResolution> {
    return signedContext(this.fdc3Security, context, intentName, null).then(sc =>
      super.raiseIntent(intentName, sc, a3)
    );
  }

  raiseIntentForContext(context: Context, a2?: any): Promise<IntentResolution> {
    return signedContext(this.fdc3Security, context, null, null).then(sc => super.raiseIntentForContext(sc, a2));
  }

  addContextListener(context: any, handler?: any): Promise<Listener> {
    const theHandler: ContextHandler = handler ? handler : (context as ContextHandler);
    const theContextType: string | null = context && handler ? (context as string) : null;
    return super.addContextListener(
      theContextType,
      signingContextHandler(this.fdc3Security, theHandler, () => this.getCurrentChannel())
    );
  }

  addIntentListener(intent: string, handler: IntentHandler): Promise<Listener> {
    return super.addIntentListener(intent, signingIntentHandler(this.fdc3Security, handler, intent));
  }

  createPrivateChannel(): Promise<EncryptingPrivateChannel> {
    return super.createPrivateChannel() as Promise<EncryptingPrivateChannel>;
  }
}
