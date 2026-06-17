/**
 * JWT claims used for **user identity tokens** (`fdc3.security.user`).
 *
 * These claims are included in the JWT payload of an `fdc3.security.user` context
 * to assert user identity. The token is created by an identity provider app
 * and scoped to a specific audience (requesting app) to prevent token misuse
 * if intercepted.
 *
 * **Usage:** User identity JWT tokens (in the `wrappedJwt` field of `fdc3.security.user` context)
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-4.1 | RFC 7519 Section 4.1 - Registered Claim Names}
 * @see {@link AntiReplayClaims} from `@finos/fdc3-schema` for claims used in **context signing** (anti-replay)
 * @see FDC3 Security & Identity documentation for usage in FDC3 workflows
 */
export interface FDC3UserClaims extends Record<string, unknown> {
  /**
   * Issuer - The identity provider app that created and signed this token.
   * Typically the URL of the identity provider app's JWKS endpoint origin.
   * @example "https://idp.example.com"
   */
  iss: string;

  /**
   * Subject - The user's unique identifier (e.g., email address).
   * This identifies who the token represents.
   * @example "john.doe@example.com"
   */
  sub: string;

  /**
   * Audience - The intended recipient application for this token.
   * Typically the URL of the requesting application. The receiving app
   * MUST verify this matches its own identifier to prevent token misuse.
   * @example "https://my-app.example.com"
   */
  aud: string;

  /**
   * JWT ID - A unique identifier for this specific token instance.
   * Used to prevent replay attacks by ensuring each token is only used once.
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  jti: string;

  /**
   * Issued At - Unix timestamp (seconds since epoch) when the token was created.
   * @example 1739746800
   */
  iat: number;

  /**
   * Expiration - Unix timestamp (seconds since epoch) after which the token
   * is no longer valid. Receivers MUST reject expired tokens.
   * @example 1739750400
   */
  exp: number;
}
