import { ContextHandler, DesktopAgentProvidableContextMetadata, IntentHandler } from '@finos/fdc3-standard';
import { MetadataHandler } from '../delegates/MetadataHandler';
import { PublicFDC3Security, SignatureCheckingFunction } from '../impl/PublicFDC3Security';
import { Context } from '@finos/fdc3-context';

/**
 * Provides support for receiving and verifying signed contexts on FDC3 channels or from raise intent requests.
 * Use this when your app needs to consume signed contexts (e.g. a data consumer).
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export interface SignatureCheckingHandlerSupport {
  /**
   * Add a context listener that will verify the signature of incoming contexts
   * and pass on the signature check result to the underlying context handler.
   *
   * @see DesktopAgent.addContextListener
   */
  wrapContextHandler(handler: ContextHandler | IntentHandler): Promise<ContextHandler | IntentHandler>;
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

  async wrapContextHandler(handler: ContextHandler | IntentHandler): Promise<ContextHandler | IntentHandler> {
    return async (contextIn: Context, metaIn: DesktopAgentProvidableContextMetadata | undefined) => {
      const { context, metadata } = this.metadataHandler.unpack(contextIn, metaIn);
      const { signature, antiReplay } = metadata;
      const authenticity = await this.signatureCheckingFunction(signature, context, antiReplay);
      const { context: repackedContext, metadata: repackedMetadata } = this.metadataHandler.pack(context, {
        ...metadata,
        authenticity,
      });
      handler(repackedContext, repackedMetadata);
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
