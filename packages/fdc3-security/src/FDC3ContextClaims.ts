/**
 * JWT claims used for **context signing** (anti-replay protection).
 *
 * These claims are embedded in the signed payload when signing FDC3 context
 * objects to provide message freshness and replay protection. They are used
 * in the `antiReplay` field of a context object.
 *
 * **Usage:** Context signatures (detached JWS over context data)
 *
 * Note: JWT uses NumericDate (seconds since epoch).
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-4.1 | RFC 7519 Section 4.1 - Registered Claim Names}
 * @see {@link FDC3UserClaims} for JWT claims used in **user identity tokens**
 */
export interface FDC3ContextClaims extends Record<string, unknown> {
  /**
   * JWT ID - Unique identifier for this signed context instance.
   * Used to detect and reject duplicate/replayed messages.
   */
  jti: string;

  /**
   * Issued At - Unix timestamp (seconds since epoch) when the context was signed.
   */
  iat: number;

  /**
   * Expiration - Unix timestamp (seconds since epoch) after which the
   * signed context should be rejected.
   */
  exp: number;

  /**
   * Not Before - Optional Unix timestamp before which the context should not be accepted.
   */
  nbf?: number;

  /**
   * Issuer - The app that signed this context (typically the app's public key URL).
   */
  iss?: string;

  /**
   * Audience - The intended recipient(s) of this context (channel, app, etc.).
   */
  aud?: string | string[];
}
