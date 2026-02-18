import { AntiReplay } from '@finos/fdc3-context';

/**
 * Verification outcomes for signed context objects.
 */
export type SignedMessageAuthenticity = {
  signed: true;

  /**
   * True if the JWS cryptographically verifies against the signed bytes.
   */
  valid: boolean;

  /**
   * True if the signing key was obtained from an approved/trusted source
   * (e.g., pinned keys, allowlisted JWKS URL, enterprise PKI, etc.).
   */
  trusted: boolean;

  /**
   * The signature algorithm used (from JWS protected header).
   * @example "EdDSA", "ES256"
   */
  alg: string;

  /**
   * The key identifier used to sign the message (from JWS protected header).
   */
  kid: string;

  /**
   * The JSON Web Key Set URL where the public key can be retrieved (from JWS protected header).
   * @example "https://app.example.com/.well-known/jwks.json"
   */
  jku: string;

  /**
   * Anti-replay claims extracted from the context's `antiReplay` field after verification.
   */
  antiReplayClaims: AntiReplay;

  /**
   * The resolved verification key if one could be downloaded.
   */
  jkuKey?: JsonWebKey;

  /**
   * Human-readable diagnostics (optional).
   */
  errors?: string[];
};

export type UnsignedMessageAuthenticity = {
  signed: false;
  errors?: string[];
};

export type MessageAuthenticity = SignedMessageAuthenticity | UnsignedMessageAuthenticity;
