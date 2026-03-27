import { Context } from '@robmoffat/fdc3-context';
import { PrivateFDC3Security, SigningFunction } from '../impl/PrivateFDC3Security.js';
import { SignatureCheckingFunction } from '../impl/PublicFDC3Security.js';
import { MetadataHandler } from '../delegates/MetadataHandler.js';
import { AppIdentifier, DesktopAgent, IntentResolution, IntentResult } from '@robmoffat/fdc3-standard';

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
    const { context: packedContext } = this.metadataHandler.pack(context, { signature, antiReplay });
    const resolution = await this.desktopAgent.raiseIntent(intent as any, packedContext, app);
    return this.wrapResolution(resolution);
  }

  async raiseIntentForContext(context: Context, app?: AppIdentifier): Promise<IntentResolution> {
    const { signature, antiReplay } = await this.signingFunction(context);
    const { context: packedContext } = this.metadataHandler.pack(context, { signature, antiReplay });
    const resolution = await this.desktopAgent.raiseIntentForContext(packedContext, app);
    return this.wrapResolution(resolution);
  }

  private wrapResolution(resolution: IntentResolution): IntentResolution {
    const originalGetResult = resolution.getResult.bind(resolution);

    resolution.getResult = async (): Promise<IntentResult> => {
      const result = await originalGetResult();
      if (this.signatureCheckingFunction && result && typeof result === 'object' && 'type' in result) {
        if (!result) {
          // void result
          return result;
        } else if (result.type == 'user' || result.type == 'app' || result.type == 'private') {
          // it's a channel, return as-is
          return result;
        } else {
          // It's likely a Context (result has 'type' property)
          const contextIn = result as Context;
          const { context: unpackedContext, metadata } = this.metadataHandler.unpack(contextIn, {});

          const { signature, antiReplay } = metadata;
          const authenticity = await this.signatureCheckingFunction(signature, unpackedContext, antiReplay);

          const { context: repackedContext } = this.metadataHandler.pack(unpackedContext, {
            ...metadata,
            authenticity,
          });
          return repackedContext;
        }
      } else {
        return result;
      }
    };

    return resolution;
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
