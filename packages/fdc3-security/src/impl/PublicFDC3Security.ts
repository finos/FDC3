import { Context, SymmetricKeyResponse } from '@finos/fdc3-context';
import { BrowserTypes } from '@finos/fdc3-schema';
import { FDC3UserClaims } from './FDC3UserClaims';

type AntiReplay = BrowserTypes.AntiReplayClaims;
type MessageAuthenticity = BrowserTypes.MessageAuthenticity;
type DetachedSignature = BrowserTypes.DetachedSignature;

/**
 * Compact JSON Web Encryption (JWE) string.
 *
 * A JWE represents encrypted content using JSON-based data structures.
 * The compact serialization is a URL-safe string with five Base64URL-encoded
 * parts separated by periods.
 *
 * Typically provided by a `fdc3.security.encryptedContext` context object.
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516 | RFC 7516 - JSON Web Encryption (JWE)}
 */
export type JSONWebEncryption = string;

/**
 * Public interface for FDC3 Security verification operations.
 *
 * This interface provides client-side methods for verifying signatures,
 * validating JWT tokens, and handling symmetric key encryption/decryption.
 *
 * @see {@link PrivateFDC3Security} for signing and token creation operations
 * @see FDC3 Security & Identity documentation for usage in FDC3 workflows at https://fdc3.finos.org.
 */
export interface PublicFDC3Security {
  /**
   * Verify a detached signature on a context object.
   *
   * Checks whether the provided signature is valid for the given context
   * by retrieving the public key from the JWKS URL specified in the
   * signature's protected header and verifying the cryptographic signature.
   *
   * @param sig - The detached JWS signature to verify
   * @param ctx - The context object that was signed (part of the detached payload)
   * @param antiReplay - The anti-replay claims (signed along with context, part of the detached payload)
   * @returns A promise resolving to authenticity information indicating
   *          whether the context was signed, valid, and trusted
   *
   * @example
   * ```typescript
   * const authenticity = await security.verifySignature(metadata.signature, context, metadata.antiReplay);
   * if (authenticity.signed && authenticity.valid) {
   *   console.log(`Verified from: ${authenticity.publicKeyUrl}`);
   * }
   * ```
   */
  verifySignature(sig: DetachedSignature, ctx: Context, antiReplay: AntiReplay): Promise<MessageAuthenticity>;

  /**
   * Get the public keys configured in this security implementation.
   *
   * @returns Array of public keys in JWK format
   */
  getPublicKeys(): JsonWebKey[];

  /**
   * Verify a user identity JWT token and extract its claims.
   *
   * Validates the token's signature, checks expiration, and returns
   * the decoded payload containing user identity claims. Used to verify
   * the `jwt` field from an `fdc3.user` context.
   *
   * @param token - The compact JWT string to verify (from `fdc3.user.jwt`)
   * @returns A promise resolving to the verified token's user identity claims
   * @throws Error if the token is invalid, expired, or signature verification fails
   *
   * @example
   * ```typescript
   * try {
   *   const claims = await security.verifyJWTToken(userContext.jwt);
   *   console.log(`User: ${claims.sub}, Issued by: ${claims.iss}`);
   * } catch (error) {
   *   console.error('Invalid token:', error.message);
   * }
   * ```
   */
  verifyJWTToken(token: string): Promise<FDC3UserClaims>;

  /**
   * Create a new symmetric key for channel encryption.
   *
   * Generates a cryptographically secure symmetric key suitable for
   * encrypting context data on private channels.
   *
   * @returns A promise resolving to a new symmetric key in JWK format
   */
  createSymmetricKey(): Promise<JsonWebKey>;

  /**
   * Encrypt a context using a symmetric key.
   *
   * Used for encrypting context data on private channels. The symmetric
   * key should be a short-lived, client-side generated key that has been
   * securely exchanged between channel participants.
   *
   * @param ctx - The context object to encrypt
   * @param symmetricKey - The symmetric key (as JWK) to use for encryption
   * @returns A promise resolving to the encrypted context as a compact JWE string
   *
   * @see `fdc3.security.symmetricKey.request` for key exchange
   */
  encryptSymmetric(ctx: Context, symmetricKey: JsonWebKey): Promise<JSONWebEncryption>;

  /**
   * Decrypt a context using a symmetric key.
   *
   * Used for decrypting context data received on encrypted private channels.
   *
   * @param encrypted - The compact JWE string containing the encrypted context
   * @param symmetricKey - The symmetric key (as JWK) to use for decryption
   * @returns A promise resolving to the decrypted context object
   * @throws Error if decryption fails (wrong key, corrupted data, etc.)
   */
  decryptSymmetric(encrypted: JSONWebEncryption, symmetricKey: JsonWebKey): Promise<Context>;

  /**
   * Wrap a symmetric key for secure delivery to a recipient.
   *
   * Encrypts the symmetric key using the recipient's public key so it can
   * be safely transmitted. Used when responding to `fdc3.security.symmetricKey.request`.
   *
   * @param symmetricKey - The symmetric key to wrap
   * @param publicKeyUrl - URL to the recipient's JWKS containing their public key
   * @returns A promise resolving to a SymmetricKeyResponse context
   *
   * @see `fdc3.security.symmetricKey.response` context type
   */
  wrapSymmetricKey(symmetricKey: JsonWebKey, publicKeyUrl: string): Promise<SymmetricKeyResponse>;

  /**
   * Encrypt a context using a recipient's public key (JWE).
   *
   * Produces a compact JWE that only the holder of the corresponding private key
   * can decrypt. Used to protect sensitive context in transit—for example, when
   * an identity provider encrypts an `fdc3.security.user` context so that only
   * the requesting application can read the JWT.
   *
   * @param ctx - The context object to encrypt
   * @param publicKeyUrl - URL to the recipient's JWKS (e.g. `/.well-known/jwks.json`)
   * @returns A promise resolving to the encrypted context as a compact JWE string
   * @throws Error if the public key cannot be resolved or encryption fails
   *
   * @see `fdc3.security.user` context type
   */
  encryptContextWithPublicKey(ctx: Context, publicKeyUrl: string): Promise<JSONWebEncryption>;
}
