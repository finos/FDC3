import {
  DesktopAgent,
  Context,
  IntentResolution,
  Listener,
  ContextHandler,
  Channel,
  IntentHandler,
  PrivateChannel,
  IntentResult,
} from '@finos/fdc3';
import { AbstractDesktopAgentDelegate } from '../delegates/AbstractDesktopAgentDelegate';
import { SigningChannelDelegate } from '../signing/SigningChannelDelegate';
import { Check, Sign, signedContext, signingContextHandler, signingIntentHandler } from '../signing/SigningSupport';
import { EncryptingPrivateChannel, UnwrapKey, WrapKey } from '../encryption/EncryptionSupport';
import { EncryptingChannelDelegate } from '../encryption/EncryptingChannelDelegate';

/**
 * This implementation adds signing functionality to any broadcast context
 * and allows for the checking of signatures on items returned.
 */
export class UnopinionatedDesktopAgent extends AbstractDesktopAgentDelegate {
  readonly sign: Sign;
  readonly check: Check;
  readonly wrapKey: WrapKey;
  readonly unwrapKey: UnwrapKey;

  constructor(d: DesktopAgent, sign: Sign, check: Check, wrapKey: WrapKey, unwrapKey: UnwrapKey) {
    super(d);
    this.sign = sign;
    this.check = check;
    this.wrapKey = wrapKey;
    this.unwrapKey = unwrapKey;
  }

  wrapChannel(c: Channel): Channel {
    if ((c as any).delegate) {
      // channel already wrapped
      return c;
    } else if (c.type == 'app' || c.type == 'user') {
      return new SigningChannelDelegate(c, this.sign, this.check);
    } else if (c.type == 'private') {
      // private channels both sign and encrypt
      const channel = c as PrivateChannel;
      const signingChannel = new SigningChannelDelegate(channel, this.sign, this.check);
      const encryptingChannel = new EncryptingChannelDelegate(signingChannel, this.unwrapKey, this.wrapKey);
      return encryptingChannel;
    } else {
      throw new Error('Unknown Channel Type');
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
    return signedContext(this.sign, context).then(sc => super.broadcast(sc));
  }

  raiseIntent(intentName: string, context: Context, a3?: any): Promise<IntentResolution> {
    return signedContext(this.sign, context, intentName).then(sc => super.raiseIntent(intentName, sc, a3));
  }

  raiseIntentForContext(context: Context, a2?: any): Promise<IntentResolution> {
    return signedContext(this.sign, context).then(sc => super.raiseIntentForContext(sc, a2));
  }

  addContextListener(context: any, handler?: any): Promise<Listener> {
    const theHandler: ContextHandler = handler ? handler : (context as ContextHandler);
    const theContextType: string | null = context && handler ? (context as string) : null;
    return super.addContextListener(
      theContextType,
      signingContextHandler(this.check, theHandler, () => this.getCurrentChannel())
    );
  }

  addIntentListener(intent: string, handler: IntentHandler): Promise<Listener> {
    return super.addIntentListener(intent, signingIntentHandler(this, handler, intent));
  }

  createPrivateChannel(): Promise<EncryptingPrivateChannel> {
    return super.createPrivateChannel() as Promise<EncryptingPrivateChannel>;
  }
}
