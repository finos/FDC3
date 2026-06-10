import { ContextHandler, ContextMetadata, IntentHandler, ContextVerificationMetadata } from '@finos/fdc3-standard';
import { MetadataHandler } from '../delegates/MetadataHandler.js';
import { PublicFDC3Security, SignatureCheckingFunction } from '../impl/PublicFDC3Security.js';
import { Context } from '@finos/fdc3-context';

/**
 * A context handler variant that also receives the result of signature verification
 * as a `ContextVerificationMetadata` object alongside the standard `ContextMetadata`.
 * This is the handler type you MUST use when wrapping with `SignatureCheckingHandlerSupport`.
 *
 * The third `verification` argument is populated by the security library after verifying
 * the `signature` and `antiReplay` fields in the received `ContextMetadata`. It is never
 * placed on `ContextMetadata` itself.
 */
export type SecurityAwareContextHandler = (
  context: Context,
  metadata: ContextMetadata | undefined,
  verification: ContextVerificationMetadata
) => Promise<void> | void;

/**
 * Intent handler variant equivalent to {@link SecurityAwareContextHandler}.
 * Use this when registering an intent handler that needs to inspect the
 * signature verification result of the incoming intent context.
 */
export type SecurityAwareIntentHandler = (
  context: Context,
  metadata: ContextMetadata | undefined,
  verification: ContextVerificationMetadata
) => Promise<any> | any;

/**
 * Provides support for receiving and verifying signed contexts on FDC3 channels or from raise intent requests.
 * Use this when your app needs to consume signed contexts (e.g. a data consumer).
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export interface SignatureCheckingHandlerSupport {
  /**
   * Wrap a `SecurityAwareContextHandler` or `SecurityAwareIntentHandler` so that incoming
   * contexts have their signatures verified before the handler is called. The verification
   * result is passed as the third argument (`ContextVerificationMetadata`).
   *
   * @see DesktopAgent.addContextListener
   */
  wrapContextHandler(
    handler: SecurityAwareContextHandler | SecurityAwareIntentHandler
  ): Promise<ContextHandler | IntentHandler>;
}

/**
 * Basic implementation of {@link SignatureCheckingHandlerSupport}.
 * Accepts any `SignatureCheckingFunction` so you can supply a custom verifier or
 * use {@link PublicSignatureCheckingHandlerSupport} to wire it to a
 * `PublicFDC3Security` instance automatically.
 */
export class BasicSignatureCheckingHandlerSupport {
  private metadataHandler: MetadataHandler;
  private signatureCheckingFunction: SignatureCheckingFunction;

  /**
   * @param metadataHandler Handles unpacking metadata from the context for FDC3 < 3.0 compatibility.
   * @param signatureCheckingFunction A function that verifies a detached JWS signature against
   *   a context and its anti-replay claims. Returns a `ContextVerificationMetadata.authenticity`
   *   object describing the outcome.
   */
  constructor(metadataHandler: MetadataHandler, signatureCheckingFunction: SignatureCheckingFunction) {
    this.metadataHandler = metadataHandler;
    this.signatureCheckingFunction = signatureCheckingFunction;
  }

  async wrapContextHandler(
    handler: SecurityAwareContextHandler | SecurityAwareIntentHandler
  ): Promise<ContextHandler | IntentHandler> {
    return async (contextIn: Context, metaIn: ContextMetadata | undefined) => {
      // Unpack any metadata embedded in the context body (FDC3 < 3.0 compatibility).
      const { context, metadata } = this.metadataHandler.unpack(contextIn, metaIn);

      // Verify the signature against the context and anti-replay claims.
      // This always runs — if no signature is present, authenticity.signed will be false.
      const { signature, antiReplay } = metadata;
      const authenticity = await this.signatureCheckingFunction(signature, context, antiReplay);

      // Pass the verification result as a typed third argument to the security-aware handler.
      // It is never merged into ContextMetadata.
      const verification: ContextVerificationMetadata = { authenticity };
      return await handler(context, metadata, verification);
    };
  }
}

/**
 * Convenience subclass of {@link BasicSignatureCheckingHandlerSupport} that wires the
 * signature checking function to a {@link PublicFDC3Security} instance.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export class PublicSignatureCheckingHandlerSupport extends BasicSignatureCheckingHandlerSupport {
  /**
   * @param metadataHandler Handles unpacking metadata from the context for FDC3 < 3.0 compatibility.
   * @param fdc3Security A public security implementation used to verify incoming signatures.
   */
  constructor(metadataHandler: MetadataHandler, fdc3Security: PublicFDC3Security) {
    super(metadataHandler, (sig, ctx, antiReplay) => fdc3Security.verifySignature(sig, ctx, antiReplay));
  }
}
