import { Channel, ContextWithMetadata, PrivateChannel } from '@finos/fdc3-standard';
import { PrivateFDC3Security, SigningFunction } from '../impl/PrivateFDC3Security.js';
import { MetadataHandler } from '../delegates/MetadataHandler.js';
import { Context } from '@finos/fdc3-context';

export type IntentHandlerReturn = Context | ContextWithMetadata | Channel | PrivateChannel | void;

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
  signIntentResult(r: IntentHandlerReturn): Promise<IntentHandlerReturn>;
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

  async signIntentResult(r: IntentHandlerReturn): Promise<IntentHandlerReturn> {
    const type = typeof r === 'object' && r !== null && 'type' in r ? r.type : undefined;
    if (!r) {
      // void result
      return r;
    } else if (type && (type == 'user' || type == 'app' || type == 'private')) {
      // it's a channel, return as-is
      return r;
    } else if (type) {
      // its a bare context, sign it.
      const contextIn = r as Context;
      const { signature, antiReplay } = await this.signingFunction(contextIn);
      const { context, metadata } = this.metadataHandler.pack(contextIn, { signature, antiReplay });
      return { context, metadata };
    } else {
      const cwm = r as ContextWithMetadata;
      const { context: contextIn, metadata: metadataIn } = cwm;
      const { signature, antiReplay } = await this.signingFunction(contextIn);
      const { context, metadata } = this.metadataHandler.pack(contextIn, { signature, antiReplay, ...metadataIn });
      return { context, metadata };
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
