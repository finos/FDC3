import { IntentResult } from '@finos/fdc3-standard';
import { PrivateFDC3Security, SigningFunction } from '../impl/PrivateFDC3Security';
import { MetadataHandler } from '../delegates/MetadataHandler';
import { Context } from '@finos/fdc3-context';

/**
 * A helper function for signing intent results.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export interface SignedIntentResultSupport {
  /**
   * Sign an intent result that you want to send
   *
   * @param r The intent result to sign
   */
  signIntentResult(r: IntentResult): Promise<IntentResult>;
}

/**
 * TODO: this fails to support metadata in the intent result at the moment.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export class BasicSignedIntentResultSupport implements SignedIntentResultSupport {
  private signingFunction: SigningFunction;
  private metadataHandler: MetadataHandler;

  constructor(signingFunction: SigningFunction, metadataHandler: MetadataHandler) {
    this.signingFunction = signingFunction;
    this.metadataHandler = metadataHandler;
  }

  async signIntentResult(r: IntentResult): Promise<IntentResult> {
    if (!r) {
      // void result
      return r;
    } else if (r.type == 'user' || r.type == 'app' || r.type == 'private') {
      // it's a channel, return as-is
      return r;
    } else {
      // its a context, sign it.
      const contextIn = r as Context;
      const { signature, antiReplay } = await this.signingFunction(contextIn);
      const { context } = this.metadataHandler.pack(contextIn, { signature, antiReplay });
      return context; // FIXME: how to return metadata here?
    }
  }
}

/**
 * Constructs the SignedIntentResultSupport using a PrivateFDC3Security instance.
 */
export class PrivateSignedIntentResultSupport extends BasicSignedIntentResultSupport {
  constructor(privateFdc3Security: PrivateFDC3Security, metadataHandler: MetadataHandler) {
    super((ctx: Context) => privateFdc3Security.sign(ctx), metadataHandler);
  }
}
