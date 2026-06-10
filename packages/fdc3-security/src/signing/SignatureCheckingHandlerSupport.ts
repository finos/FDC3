import { ContextHandler, ContextMetadata, IntentHandler, VerifiedContextMetadata } from '@finos/fdc3-standard';
import { MetadataHandler } from '../delegates/MetadataHandler.js';
import { PublicFDC3Security, SignatureCheckingFunction } from '../impl/PublicFDC3Security.js';
import { Context } from '@finos/fdc3-context';

/**
 * A context handler variant that also receives the result of signature verification
 * as a `VerifiedContextMetadata` object alongside the standard `ContextMetadata`.
 * This is the handler type you should use when wrapping with
 * `SignatureCheckingHandlerSupport`.
 */
export type SecurityAwareContextHandler = (
  context: Context,
  metadata: ContextMetadata | undefined,
  verified: VerifiedContextMetadata
) => Promise<void> | void;

export type SecurityAwareIntentHandler = (
  context: Context,
  metadata: ContextMetadata | undefined,
  verified: VerifiedContextMetadata
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
   * result is passed as the third argument (`VerifiedContextMetadata`).
   *
   * @see DesktopAgent.addContextListener
   */
  wrapContextHandler(
    handler: SecurityAwareContextHandler | SecurityAwareIntentHandler
  ): Promise<ContextHandler | IntentHandler>;
}

/**
 * Basic implementation of SignatureCheckingHandlerSupport.
 * Use when checking signatures via a supporting function.
 */
export class BasicSignatureCheckingHandlerSupport {
  private metadataHandler: MetadataHandler;
  private signatureCheckingFunction: SignatureCheckingFunction;

  constructor(metadataHandler: MetadataHandler, signatureCheckingFunction: SignatureCheckingFunction) {
    this.metadataHandler = metadataHandler;
    this.signatureCheckingFunction = signatureCheckingFunction;
  }

  async wrapContextHandler(
    handler: SecurityAwareContextHandler | SecurityAwareIntentHandler
  ): Promise<ContextHandler | IntentHandler> {
    return async (contextIn: Context, metaIn: ContextMetadata | undefined) => {
      const { context, metadata } = this.metadataHandler.unpack(contextIn, metaIn);
      const { signature, antiReplay } = metadata;
      const authenticity = await this.signatureCheckingFunction(signature, context, antiReplay);
      const verified: VerifiedContextMetadata = { authenticity };
      return await handler(context, metadata, verified);
    };
  }
}

/**
 * Implementation of SignatureCheckingHandlerSupport that uses the public FDC3 Security interface.
 */
export class PublicSignatureCheckingHandlerSupport extends BasicSignatureCheckingHandlerSupport {
  constructor(metadataHandler: MetadataHandler, fdc3Security: PublicFDC3Security) {
    super(metadataHandler, (sig, ctx, antiReplay) => fdc3Security.verifySignature(sig, ctx, antiReplay));
  }
}
