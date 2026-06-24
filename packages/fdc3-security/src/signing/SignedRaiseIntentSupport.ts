import { Context } from '@finos/fdc3-context';
import { PrivateFDC3Security, SigningFunction } from '../impl/PrivateFDC3Security.js';
import { SignatureCheckingFunction } from '../impl/PublicFDC3Security.js';
import { MetadataHandler } from '../delegates/MetadataHandler.js';
import { assertIsContext } from '../impl/TypeGuards.js';
import { AppIdentifier, ContextMetadata, DesktopAgent, IntentResolution, IntentResult } from '@finos/fdc3-standard';
import { ContextVerificationMetadata } from '../impl/ContextVerificationMetadata.js';

/**
 * Extends `IntentResolution` with a `getVerification()` method that returns the
 * `ContextVerificationMetadata` for the intent result — the outcome of verifying
 * the signature on the returned context, if a `signatureCheckingFunction` was
 * configured on `BasicSignedRaiseIntentSupport`.
 *
 * Returns `undefined` if no signature checking was configured, or if the result
 * was a Channel or void.
 */
export interface VerifiedIntentResolution extends IntentResolution {
  getVerification(): Promise<ContextVerificationMetadata | undefined>;
}

/**
 * A helper for signing intent requests and verifying signed results.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export interface SignedRaiseIntentSupport {
  /**
   * Raise an intent with a signed context and verify the signed result (if any).
   * Returns a `VerifiedIntentResolution` whose `getVerification()` method provides
   * the `ContextVerificationMetadata` for the returned context result.
   */
  raiseIntent(
    intent: string,
    context: Context,
    app?: AppIdentifier,
    newInstance?: boolean
  ): Promise<VerifiedIntentResolution>;

  /**
   * Raise an intent based on the context type, with a signed context, and verify the signed result (if any).
   * Returns a `VerifiedIntentResolution` whose `getVerification()` method provides
   * the `ContextVerificationMetadata` for the returned context result.
   */
  raiseIntentForContext(
    context: Context,
    app?: AppIdentifier,
    newInstance?: boolean
  ): Promise<VerifiedIntentResolution>;
}

/**
 * Basic implementation of SignedRaiseIntentSupport.
 *
 * Signs every outbound intent context using the provided `signingFunction` (which should
 * run on the trusted backend). If a `signatureCheckingFunction` is also provided, the
 * returned `VerifiedIntentResolution` will verify the signature on any context result
 * before making it available via `getVerification()`.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export class BasicSignedRaiseIntentSupport implements SignedRaiseIntentSupport {
  private signingFunction: SigningFunction;
  private metadataHandler: MetadataHandler;
  private desktopAgent: DesktopAgent;
  private signatureCheckingFunction?: SignatureCheckingFunction;

  /**
   * @param desktopAgent The FDC3 Desktop Agent used to raise intents.
   * @param signingFunction A function that signs a context using the application's private key.
   *   Should delegate to a trusted backend — never execute in the browser frontend.
   * @param metadataHandler Handles packing/unpacking metadata for FDC3 < 3.0 compatibility.
   * @param signatureCheckingFunction Optional. If provided, the signature on any context
   *   result will be verified and the outcome exposed via `VerifiedIntentResolution.getVerification()`.
   */
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

  async raiseIntent(
    intent: string,
    context: Context,
    app?: AppIdentifier,
    newInstance?: boolean
  ): Promise<VerifiedIntentResolution> {
    // Sign the outbound context on the trusted backend before raising the intent.
    const { signature, antiReplay } = await this.signingFunction(context);
    const { context: packedContext, metadata: packedMetadata } = this.metadataHandler.pack(context, {
      signature,
      antiReplay,
    });
    const resolution = await this.desktopAgent.raiseIntent(
      intent as any,
      packedContext,
      app ?? null,
      newInstance,
      packedMetadata
    );
    // Wrap the resolution so that the result is unpacked and optionally verified.
    return this.wrapResolution(resolution);
  }

  async raiseIntentForContext(
    context: Context,
    app?: AppIdentifier,
    newInstance?: boolean
  ): Promise<VerifiedIntentResolution> {
    // Sign the outbound context on the trusted backend before raising the intent.
    const { signature, antiReplay } = await this.signingFunction(context);
    const { context: packedContext, metadata: packedMetadata } = this.metadataHandler.pack(context, {
      signature,
      antiReplay,
    });
    const resolution = await this.desktopAgent.raiseIntentForContext(
      packedContext,
      app ?? null,
      newInstance,
      packedMetadata
    );
    // Wrap the resolution so that the result is unpacked and optionally verified.
    return this.wrapResolution(resolution);
  }

  /**
   * Wraps a plain `IntentResolution` to add result unpacking, optional signature
   * verification, and the `getVerification()` method defined on `VerifiedIntentResolution`.
   *
   * Results are memoized: `getResult()`, `getResultMetadata()` and `getVerification()` all
   * share a single underlying async operation so the result is only fetched once.
   */
  private wrapResolution(resolution: IntentResolution): VerifiedIntentResolution {
    const originalGetResult = resolution.getResult.bind(resolution);
    const originalGetResultMetadata = resolution.getResultMetadata.bind(resolution);

    const rewrapResult = async (): Promise<{
      result: IntentResult;
      metadata: ContextMetadata;
      verification: ContextVerificationMetadata | undefined;
    }> => {
      const result = await originalGetResult();
      const metadata = await originalGetResultMetadata();

      if (!result) {
        // Void result — no context to unpack or verify.
        return { result, metadata, verification: undefined };
      } else if (result.type == 'user' || result.type == 'app' || result.type == 'private') {
        // Channel result — verification is not applicable to channels.
        return { result, metadata, verification: undefined };
      } else {
        // Context result — unpack any __appMeta embedded by the handler (FDC3 < 3.0
        // compatibility), then verify the signature if a checking function was provided.
        assertIsContext(result, 'SignedRaiseIntentSupport.wrapResolution');
        const contextIn = result;
        const { context: unpackedContext, metadata: unpackedMetadata } = this.metadataHandler.unpack(
          contextIn,
          metadata
        );

        if (this.signatureCheckingFunction) {
          // Verify the signature on the response context. The result is a ContextVerificationMetadata
          // object available via getVerification() — it is never stored on ContextMetadata itself.
          const { signature, antiReplay } = unpackedMetadata;
          const authenticity = await this.signatureCheckingFunction(signature, unpackedContext, antiReplay);
          const verification: ContextVerificationMetadata = { authenticity };
          return { result: unpackedContext, metadata: unpackedMetadata, verification };
        } else {
          return { result: unpackedContext, metadata: unpackedMetadata, verification: undefined };
        }
      }
    };

    let memoized:
      | Promise<{
          result: IntentResult;
          metadata: ContextMetadata;
          verification: ContextVerificationMetadata | undefined;
        }>
      | undefined;
    // Memoize the rewrap so all three getters share one async invocation.
    const getRewrapped = () => {
      memoized ??= rewrapResult();
      return memoized;
    };

    return {
      ...resolution,
      getResult: async (): Promise<IntentResult> => (await getRewrapped()).result,
      getResultMetadata: async (): Promise<ContextMetadata> => (await getRewrapped()).metadata,
      getVerification: async (): Promise<ContextVerificationMetadata | undefined> =>
        (await getRewrapped()).verification,
    } as VerifiedIntentResolution;
  }
}

/**
 * Convenience subclass of {@link BasicSignedRaiseIntentSupport} that derives both the
 * signing and verification functions directly from a {@link PrivateFDC3Security} instance.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export class PrivateSignedRaiseIntentSupport extends BasicSignedRaiseIntentSupport {
  /**
   * @param desktopAgent The FDC3 Desktop Agent used to raise intents.
   * @param privateFdc3Security The private security implementation holding the application's signing key.
   * @param metadataHandler Handles packing/unpacking metadata for FDC3 < 3.0 compatibility.
   */
  constructor(desktopAgent: DesktopAgent, privateFdc3Security: PrivateFDC3Security, metadataHandler: MetadataHandler) {
    super(
      desktopAgent,
      (ctx: Context) => privateFdc3Security.sign(ctx),
      metadataHandler,
      (sig, ctx, antiReplay) => privateFdc3Security.verifySignature(sig, ctx, antiReplay)
    );
  }
}
