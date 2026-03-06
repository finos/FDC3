import { Context, SymmetricKeyResponse } from '@finos/fdc3-context';
import { BrowserTypes } from '@finos/fdc3-schema';

type AntiReplay = BrowserTypes.AntiReplayClaims;
import { PublicFDC3Security } from './PublicFDC3Security';

type DetachedSignature = BrowserTypes.DetachedSignature;

/**
 * Private interface for FDC3 Security signing and encryption operations.
 *
 * This interface extends {@link PublicFDC3Security} with methods that require
 * access to private keys for signing contexts, creating JWT tokens, and
 * managing symmetric key exchange.
 *
 * **Security Note:** Implementations should ideally run in a trusted environment
 * (e.g., server-side) rather than directly in the browser, as client-side
 * environments are inherently untrusted.
 *
 * @see {@link PublicFDC3Security} for verification operations
 * @see FDC3 Security & Identity documentation for usage in FDC3 workflows at https://fdc3.finos.org.
 */
export interface PrivateFDC3Security extends PublicFDC3Security {
  /**
   * Sign a context object with this app's private key.
   *
   * Creates a detached JWS signature over the canonicalized context,
   * optionally including intent and channel information in the signed payload.
   *
   * Note:  The `antiReplay` field should be added to the context before calling this, in order to
   * avoid replay attacks.
   *
   * @param ctx - The context object to sign
   * @param intent - The intent name if this context is being sent via an intent, or null
   * @param channelId - The channel ID if this context is being broadcast on a channel, or null
   * @returns A promise resolving to a detached JWS signature
   *
   * @example
   * ```typescript
   * const { signature, antiReplay } = await security.sign(context);
   * // Include signature and antiReplay in metadata when broadcasting
   * ```
   */
  sign(ctx: Context): Promise<{ signature: DetachedSignature; antiReplay: AntiReplay }>;

  /**
   * Unwrap a symmetric key received from another app.
   *
   * Decrypts a wrapped symmetric key using this app's private key.
   * Used when receiving `fdc3.security.symmetricKey.response`.
   *
   * @param ctx - The SymmetricKeyResponse containing the wrapped key
   * @returns A promise resolving to the unwrapped symmetric key in JWK format
   * @throws Error if unwrapping fails
   */
  unwrapKey(ctx: SymmetricKeyResponse): Promise<JsonWebKey>;

  /**
   * Create a signed JWT token for user identity.
   *
   * Generates a JWT token asserting user identity, scoped to a specific
   * audience (requesting application). Used by Identity Providers when
   * responding to `CreateIdentityToken` intents.
   *
   * @param aud - The audience claim (typically the requesting app's URL)
   * @param sub - The subject claim (the user's unique identifier, e.g., email)
   * @returns A promise resolving to the signed JWT token as a compact string
   *
   * @example
   * ```typescript
   * const jwt = await security.createJWTToken(
   *   'https://requesting-app.example.com',
   *   'user@example.com'
   * );
   * ```
   */
  createJWTToken(aud: string, sub: string): Promise<string>;
}
