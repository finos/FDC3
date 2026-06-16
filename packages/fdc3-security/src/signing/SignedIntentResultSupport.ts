import { Channel, ContextWithMetadata, PrivateChannel } from '@finos/fdc3-standard';
import { PrivateFDC3Security, SigningFunction } from '../impl/PrivateFDC3Security.js';
import { MetadataHandler } from '../delegates/MetadataHandler.js';
import { Context } from '@finos/fdc3-context';
import { isContext, isContextWithMetadata } from '../impl/TypeGuards.js';

/**
 * The union of types that an `IntentHandler` may return.
 * A bare `Context` or `ContextWithMetadata` will be signed; a `Channel` or
 * `PrivateChannel` is returned as-is since channels carry a stream of results
 * rather than a single signable payload; `void` indicates no result.
 */
export type IntentHandlerReturn = Context | ContextWithMetadata | Channel | PrivateChannel | void;

/**
 * A helper for signing intent results returned by an `IntentHandler`.
 * Use this on the handler side to prove the authenticity of the response
 * so the raiser can verify it via `VerifiedIntentResolution.getVerification()`.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export interface SignedIntentResultSupport {
  /**
   * Sign a context intent result before returning it to the raiser.
   * Channel and void results are returned unchanged.
   *
   * @param r The intent result to sign. Bare `Context` and `ContextWithMetadata`
   *   results are signed; `Channel`, `PrivateChannel` and `void` are passed through.
   * @returns The result, with `signature` and `antiReplay` included in the metadata
   *   for `Context` / `ContextWithMetadata` results.
   */
  signIntentResult(r: IntentHandlerReturn): Promise<IntentHandlerReturn>;
}

/**
 * Basic implementation of {@link SignedIntentResultSupport}.
 *
 * Note: this signs the context result only. If the intent handler returns a
 * `ContextWithMetadata` that already carries caller-provided metadata fields,
 * those fields are preserved alongside the new signature.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export class BasicSignedIntentResultSupport implements SignedIntentResultSupport {
  private signingFunction: SigningFunction;
  private metadataHandler: MetadataHandler;

  /**
   * @param signingFunction A function that signs a context using the application's private key.
   *   Must run in a trusted backend environment.
   * @param metadataHandler Handles packing metadata into the context for FDC3 < 3.0 compatibility.
   */
  constructor(signingFunction: SigningFunction, metadataHandler: MetadataHandler) {
    this.signingFunction = signingFunction;
    this.metadataHandler = metadataHandler;
  }

  async signIntentResult(r: IntentHandlerReturn): Promise<IntentHandlerReturn> {
    const type = typeof r === 'object' && r !== null && 'type' in r ? r.type : undefined;

    if (!r) {
      // Void result — nothing to sign.
      return r;
    } else if (type && (type == 'user' || type == 'app' || type == 'private')) {
      // Channel result — channels carry a stream; sign individual broadcasts via
      // BasicSignedBroadcaster on the channel instead.
      return r;
    } else if (type) {
      // Bare Context result — sign it and return as ContextWithMetadata so the
      // Desktop Agent can forward the signature to the raiser.
      if (!isContext(r)) {
        throw new Error(`SignedIntentResultSupport: expected a Context result but received ${JSON.stringify(r)}`);
      }
      const contextIn = r;
      const { signature, antiReplay } = await this.signingFunction(contextIn);
      const { context, metadata } = this.metadataHandler.pack(contextIn, { signature, antiReplay });
      return { context, metadata };
    } else {
      // ContextWithMetadata result — sign the context portion and merge the
      // existing caller-provided metadata with the new signature fields.
      if (!isContextWithMetadata(r)) {
        throw new Error(
          `SignedIntentResultSupport: expected a ContextWithMetadata result but received ${JSON.stringify(r)}`
        );
      }
      const cwm = r;
      const { context: contextIn, metadata: metadataIn } = cwm;
      const { signature, antiReplay } = await this.signingFunction(contextIn);
      const { context, metadata } = this.metadataHandler.pack(contextIn, { signature, antiReplay, ...metadataIn });
      return { context, metadata };
    }
  }
}

/**
 * Convenience subclass of {@link BasicSignedIntentResultSupport} that derives the
 * signing function directly from a {@link PrivateFDC3Security} instance.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export class PrivateSignedIntentResultSupport extends BasicSignedIntentResultSupport {
  /**
   * @param privateFdc3Security The private security implementation holding the application's signing key.
   * @param metadataHandler Handles packing metadata into the context for FDC3 < 3.0 compatibility.
   */
  constructor(privateFdc3Security: PrivateFDC3Security, metadataHandler: MetadataHandler) {
    super((ctx: Context) => privateFdc3Security.sign(ctx), metadataHandler);
  }
}
