import { Context, SymmetricKeyRequest, SymmetricKeyResponse } from '@finos/fdc3-context';
import { Channel, ContextHandler, ContextMetadata, ContextVerificationMetadata, Listener } from '@finos/fdc3-standard';
import { PrivateFDC3Security, SigningFunction, UnwrapFunction } from '../impl/PrivateFDC3Security.js';
import { JSONWebEncryption, JsonWebKeyWithId, PublicFDC3Security } from '../impl/PublicFDC3Security.js';
import { MetadataHandler } from '../delegates/MetadataHandler.js';
import { SecurityAwareContextHandler } from '../signing/SignatureCheckingHandlerSupport.js';
import { isEncryptedContextWrapper, isSymmetricKeyResponse } from '../impl/TypeGuards.js';

/**
 * Provides support for receiving and decrypting encrypted contexts on FDC3 channels.
 * Use this when your app only needs to consume encrypted contexts (e.g. a data consumer).
 *
 * The handler passed to `addContextListener` MUST be a `SecurityAwareContextHandler`
 * (three-argument form) so that the `ContextVerificationMetadata` — including the
 * `encryption` status — can be delivered as a typed third argument rather than
 * being smuggled into `ContextMetadata.custom`.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export interface EncryptedContextListenerSupport {
  /**
   * Add a context listener that will decrypt incoming `fdc3.security.encryptedContext`
   * contexts and invoke the handler with the decrypted context and a
   * `ContextVerificationMetadata` third argument when the original type matches
   * `contextType`. The `verification.encryption` field will be `'decrypted'` on
   * success.
   *
   * @see DesktopAgent.addContextListener
   */
  addContextListener(
    channel: Channel,
    contextType: string | null,
    handler: SecurityAwareContextHandler
  ): Promise<Listener>;
}

/**
 * Registers a listener on `channel` for `fdc3.security.symmetricKeyResponse` messages.
 * When a response arrives, the wrapped symmetric key is unwrapped using `unwrapFunction`
 * and the corresponding pending key-request promise (keyed by `kid`) is resolved.
 *
 * @param metadataHandler Handles unpacking metadata for FDC3 < 3.0 compatibility.
 * @param channel The FDC3 channel to listen on.
 * @param keyRequestResolveFunctions Map from key ID to the resolve function of the
 *   promise waiting for that key. Entries are deleted once resolved.
 * @param unwrapFunction Unwraps the JWE-wrapped symmetric key using the application's
 *   private key. Must run in a trusted backend environment.
 */
export function createSymmetricKeyResponseContextListener(
  metadataHandler: MetadataHandler,
  channel: Channel,
  keyRequestResolveFunctions: Map<string, (key: JsonWebKeyWithId) => void>,
  unwrapFunction: UnwrapFunction
): Promise<Listener> {
  return channel.addContextListener(
    'fdc3.security.symmetricKeyResponse',
    async (skr: Context, skrMeta: ContextMetadata | undefined) => {
      const { context } = metadataHandler.unpack(skr, skrMeta);
      if (!isSymmetricKeyResponse(context)) {
        console.warn('fdc3-security: received unexpected context type on symmetricKeyResponse listener:', context.type);
        return;
      }
      const skrCtx = context;
      const key = await unwrapFunction(skrCtx);
      if (key) {
        const resolveFunction = keyRequestResolveFunctions.get(key.kid);
        if (resolveFunction) {
          resolveFunction(key);
          keyRequestResolveFunctions.delete(key.kid);
        }
      }
    }
  );
}

/**
 * Public (front-end) implementation of {@link EncryptedContextListenerSupport}.
 *
 * Decryption runs on the frontend: the symmetric key is fetched once and cached,
 * then used directly in the browser for low-latency per-message decryption.
 * The two operations that require the private key — signing key requests and
 * unwrapping the key response — are delegated to a trusted backend via the
 * supplied `signingFunction` and `unwrapFunction` (typically via `exchangeData`).
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export class PublicEncryptedContextListenerSupport implements EncryptedContextListenerSupport {
  private security: PublicFDC3Security;
  private signingFunction: SigningFunction;
  private unwrapFunction: UnwrapFunction;
  /** Pending key promises keyed by kid — resolved when the key response arrives. */
  private keyRequestPromises: Map<string, Promise<JsonWebKeyWithId>> = new Map();
  /** Resolve functions for pending key promises, keyed by kid. */
  private keyRequestResolveFunctions: Map<string, (key: JsonWebKeyWithId) => void> = new Map();
  private metadataHandler: MetadataHandler;

  /**
   * @param security A public security implementation used for symmetric encryption/decryption.
   * @param metadataHandler Handles packing/unpacking metadata for FDC3 < 3.0 compatibility.
   * @param signingFunction Signs a `fdc3.security.symmetricKeyRequest` on the backend
   *   so the broadcaster can verify the requestor's identity before wrapping the key.
   * @param unwrapFunction Unwraps the JWE-wrapped symmetric key using the application's
   *   private key (runs on the backend via `exchangeData`).
   */
  constructor(
    security: PublicFDC3Security,
    metadataHandler: MetadataHandler,
    signingFunction: SigningFunction,
    unwrapFunction: UnwrapFunction
  ) {
    this.security = security;
    this.metadataHandler = metadataHandler;
    this.signingFunction = signingFunction;
    this.unwrapFunction = unwrapFunction;
  }

  async addContextListener(
    channel: Channel,
    contextType: string | null,
    handler: SecurityAwareContextHandler
  ): Promise<Listener> {
    const underlyingContextListener = channel.addContextListener(
      'fdc3.security.encryptedContext',
      this.decryptingContextHandler(handler, contextType, channel)
    );
    const keyListener = createSymmetricKeyResponseContextListener(
      this.metadataHandler,
      channel,
      this.keyRequestResolveFunctions,
      this.unwrapFunction
    );

    return {
      unsubscribe: async () => {
        await (await underlyingContextListener).unsubscribe();
        await (await keyListener).unsubscribe();
      },
    };
  }

  /**
   * Returns the cached symmetric key for the given `kid`, or broadcasts a signed
   * `fdc3.security.symmetricKeyRequest` and awaits the response if the key is not
   * yet available. Subsequent calls for the same `kid` return the same promise.
   *
   * @param kid Key ID identifying the symmetric key to request.
   * @param jku JWKS URL of the broadcaster, included in the key request so the
   *   broadcaster knows which public key to use when wrapping the response.
   * @param channel The channel on which to broadcast the key request.
   */
  private async getSymmetricKey(kid: string, jku: string, channel: Channel): Promise<JsonWebKeyWithId> {
    // Deduplication: if a request for this kid is already in flight, wait for it.
    const keyPromise = this.keyRequestPromises.get(kid);
    if (keyPromise) {
      return keyPromise;
    }

    // Create a promise that will be resolved by createSymmetricKeyResponseContextListener
    // when the broadcaster sends back the wrapped key.
    let resolveFunction: (value: JsonWebKeyWithId) => void;
    const newKeyPromise = new Promise<JsonWebKeyWithId>(resolve => {
      resolveFunction = resolve;
    });

    this.keyRequestResolveFunctions.set(kid, resolveFunction!);
    this.keyRequestPromises.set(kid, newKeyPromise);

    // Sign the key request on the backend (the signature proves our identity to the broadcaster)
    // then broadcast it. The broadcaster will wrap the key for our public key and respond.
    const request = {
      type: 'fdc3.security.symmetricKeyRequest',
      id: { kid },
      jku,
    } as SymmetricKeyRequest;
    const { signature, antiReplay } = await this.signingFunction(request);
    const { context, metadata } = this.metadataHandler.pack(request, { signature, antiReplay });
    await channel.broadcast(context, metadata);

    return newKeyPromise;
  }

  /**
   * Returns a standard `ContextHandler` that intercepts `fdc3.security.encryptedContext`
   * broadcasts, decrypts the payload, and invokes the application's
   * `SecurityAwareContextHandler` with the decrypted context and a
   * `ContextVerificationMetadata` third argument (`encryption: 'decrypted'`).
   *
   * @param ch The application's security-aware handler to invoke after decryption.
   * @param originalType If non-null, skip decrypted contexts whose type does not match.
   * @param channel The channel, used to broadcast key requests if the key is not yet held.
   */
  private decryptingContextHandler(
    ch: SecurityAwareContextHandler,
    originalType: string | null,
    channel: Channel
  ): ContextHandler {
    const out = async (contextIn: Context, meta: ContextMetadata) => {
      if (!isEncryptedContextWrapper(contextIn)) {
        // Listener is registered for 'fdc3.security.encryptedContext' but guard
        // defensively against any unexpected context type.
        return;
      }
      const encryptedContext = contextIn;
      // Preserve the received ContextMetadata unchanged — we do not modify it.
      const cleanMeta = { ...meta };

      const encrypted = encryptedContext.encryptedPayload as JSONWebEncryption;
      const kid = encryptedContext.id?.kid;

      // Fetch (or request) the symmetric key. On first call this broadcasts a signed
      // symmetricKeyRequest and awaits the response; subsequent calls return the cached key.
      const symmetricKey = await this.getSymmetricKey(kid!, encryptedContext.jku!, channel);

      // Decrypt the payload using the symmetric key.
      const decryptedContext = await this.security.decryptSymmetric(encrypted, symmetricKey);
      if (originalType && decryptedContext.type !== originalType) {
        return;
      }

      // Pass decryption status as a typed ContextVerificationMetadata third argument
      // rather than storing it in ContextMetadata.
      const verification: ContextVerificationMetadata = { encryption: 'decrypted' };
      ch(decryptedContext, cleanMeta, verification);
    };
    return out as ContextHandler;
  }
}

/**
 * Private (back-end) implementation of {@link EncryptedContextListenerSupport}.
 *
 * All cryptographic operations — key unwrapping and per-message decryption — run on
 * the backend. The symmetric key never reaches the frontend, which is the correct
 * choice when decrypted plaintext must never exist in browser memory.
 *
 * For lower-latency decryption where the browser is a trusted environment, use
 * {@link PublicEncryptedContextListenerSupport} instead.
 *
 * @see {@link https://fdc3.finos.org/docs/api/security | FDC3 Security & Identity}
 */
export class PrivateEncryptedContextListenerSupport
  extends PublicEncryptedContextListenerSupport
  implements EncryptedContextListenerSupport
{
  /**
   * @param security A private security implementation used for key unwrapping and decryption.
   * @param metadataHandler Handles packing/unpacking metadata for FDC3 < 3.0 compatibility.
   */
  constructor(security: PrivateFDC3Security, metadataHandler: MetadataHandler) {
    const signFunction: SigningFunction = async (context: Context) => security.sign(context);
    const unwrapFunction: UnwrapFunction = async (ctx: SymmetricKeyResponse) => security.unwrapSymmetricKey(ctx);
    super(security, metadataHandler, signFunction, unwrapFunction);
  }
}
