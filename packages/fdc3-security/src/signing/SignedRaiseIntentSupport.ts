import { Context } from '@finos/fdc3-context';
import { PrivateFDC3Security, SigningFunction } from '../impl/PrivateFDC3Security.js';
import { SignatureCheckingFunction } from '../impl/PublicFDC3Security.js';
import { MetadataHandler } from '../delegates/MetadataHandler.js';
import {
  AppIdentifier,
  ContextMetadata,
  DesktopAgent,
  IntentResolution,
  IntentResult,
  VerifiedContextMetadata,
} from '@finos/fdc3-standard';

/**
 * A helper for signing intent requests and verifying signed results.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export interface SignedRaiseIntentSupport {
  /**
   * Raise an intent with a signed context and verify the signed result (if any).
   *
   * @param intent The intent to raise
   * @param context The context to sign and send
   * @param app Target application (optional)
   */
  raiseIntent(intent: string, context: Context, app?: AppIdentifier): Promise<IntentResolution>;

  /**
   * Raise an intent based on the context type, with a signed context, and verify the signed result (if any).
   *
   * @param context The context to sign and send
   * @param app Target application (optional)
   */
  raiseIntentForContext(context: Context, app?: AppIdentifier): Promise<IntentResolution>;
}

/**
 * Basic implementation of SignedRaiseIntentSupport.
 */
export class BasicSignedRaiseIntentSupport implements SignedRaiseIntentSupport {
  private signingFunction: SigningFunction;
  private metadataHandler: MetadataHandler;
  private desktopAgent: DesktopAgent;
  private signatureCheckingFunction?: SignatureCheckingFunction;

  constructor(
    desktopAgent: DesktopAgent,
    signingFunction: SigningFunction,
    metadataHandler: MetadataHandler,
    signatureCheckingFunction?: SignatureCheckingFunction
  ) {
    this.signingFunction = signingFunction;
    this.metadataHandler = metadataHandler;
    this.desktopAgent = desktopAgent;
    this.signatureCheckingFunction = signatureCheckingFunction;
  }

  async raiseIntent(intent: string, context: Context, app?: AppIdentifier): Promise<IntentResolution> {
    const { signature, antiReplay } = await this.signingFunction(context);
    const { context: packedContext, metadata: packedMetadata } = this.metadataHandler.pack(context, {
      signature,
      antiReplay,
    });
    const resolution = await this.desktopAgent.raiseIntent(intent as any, packedContext, app ?? null, packedMetadata);
    return this.wrapResolution(resolution);
  }

  async raiseIntentForContext(context: Context, app?: AppIdentifier): Promise<IntentResolution> {
    const { signature, antiReplay } = await this.signingFunction(context);
    const { context: packedContext, metadata: packedMetadata } = this.metadataHandler.pack(context, {
      signature,
      antiReplay,
    });
    const resolution = await this.desktopAgent.raiseIntentForContext(packedContext, app ?? null, packedMetadata);
    return this.wrapResolution(resolution);
  }

  private wrapResolution(resolution: IntentResolution): IntentResolution {
    const originalGetResult = resolution.getResult.bind(resolution);
    const originalGetResultMetadata = resolution.getResultMetadata.bind(resolution);

    const rewrapResult = async (): Promise<{ result: IntentResult; metadata: ContextMetadata }> => {
      const result = await originalGetResult();
      const metadata = await originalGetResultMetadata();

      if (!result) {
        // void result
        return { result, metadata };
      } else if (result.type == 'user' || result.type == 'app' || result.type == 'private') {
        // it's a channel, return as-is
        return { result, metadata };
      } else {
        // It's likely a Context (result has 'type' property)
        const contextIn = result as Context;
        const { context: unpackedContext, metadata: unpackedMetadata } = this.metadataHandler.unpack(
          contextIn,
          metadata
        );

        if (this.signatureCheckingFunction) {
          const { signature, antiReplay } = unpackedMetadata;
          const authenticity = await this.signatureCheckingFunction(signature, unpackedContext, antiReplay);
          // authenticity is a VerifiedContextMetadata result — not a wire field.
          // Store it in custom so callers can retrieve it without polluting ContextMetadata.
          const verified: VerifiedContextMetadata = { authenticity };
          const { context: repackedContext, metadata: repackedMetadata } = this.metadataHandler.pack(unpackedContext, {
            ...unpackedMetadata,
            custom: { ...unpackedMetadata.custom, __verified: verified },
          });
          return { result: repackedContext, metadata: repackedMetadata };
        } else {
          return { result: unpackedContext, metadata: unpackedMetadata };
        }
      }
    };

    let memoized: Promise<{ result: IntentResult; metadata: ContextMetadata }> | undefined;
    const getRewrapped = () => {
      memoized ??= rewrapResult();
      return memoized;
    };

    return {
      ...resolution,
      getResult: async (): Promise<IntentResult> => (await getRewrapped()).result,
      getResultMetadata: async (): Promise<ContextMetadata> => (await getRewrapped()).metadata,
    } as IntentResolution;
  }
}

/**
 * Constructs the SignedRaiseIntentSupport using a PrivateFDC3Security instance.
 */
export class PrivateSignedRaiseIntentSupport extends BasicSignedRaiseIntentSupport {
  constructor(desktopAgent: DesktopAgent, privateFdc3Security: PrivateFDC3Security, metadataHandler: MetadataHandler) {
    super(
      desktopAgent,
      (ctx: Context) => privateFdc3Security.sign(ctx),
      metadataHandler,
      (sig, ctx, antiReplay) => privateFdc3Security.verifySignature(sig, ctx, antiReplay)
    );
  }
}
