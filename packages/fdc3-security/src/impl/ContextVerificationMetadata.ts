/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

/**
 * The outcome of verifying a signed context object. Populated by the
 * receiving application's security implementation after calling its
 * verification function with the received `ContextMetadata`.
 *
 * This is NOT a transmitted metadata field — it is never sent over the
 * wire by the Desktop Agent. It is the output of a local verification step
 * performed by the receiving application.
 *
 * See the [Security & Identity documentation](https://fdc3.finos.org/docs/next/api/security) for details.
 */
export interface ContextVerificationMetadata {
  /** The result of signature verification for this context. */
  authenticity?: {
    /** True if a `signature` field was present in the received metadata. */
    signed: boolean;
    /** True if the JWS cryptographically verified against the signed bytes. */
    valid?: boolean;
    /** True if the signing key's JWKS URL was in the application's allowlist. */
    trusted?: boolean;
    /** The JWKS URL from the JWS protected header, identifying the signer. */
    jku?: string;
    /** The key identifier from the JWS protected header. */
    kid?: string;
    /** The signature algorithm from the JWS protected header. */
    alg?: string;
    /** Human-readable diagnostics from the verification attempt. */
    errors?: string[];
  };

  /** The result of attempting to decrypt a `fdc3.security.encryptedContext`
   *  payload. Only relevant when the received context type is
   *  `fdc3.security.encryptedContext`. */
  encryption?: 'decrypted' | 'cant_decrypt' | 'not_encrypted';
}
