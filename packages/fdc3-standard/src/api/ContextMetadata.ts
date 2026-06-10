/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { AppIdentifier } from './AppIdentifier.js';

/**
 * A Detached JSON Web Signature (JWS) proving the authenticity and integrity
 * of a signed context object. The signature is computed over the canonicalized
 * JSON representation of `{ context, antiReplay }` using the signing app's
 * private key. Verification uses the public key retrieved from the JWKS URL
 * embedded in the protected header.
 *
 * See the [Security & Identity documentation](../../api/security) for details.
 */
export interface DetachedSignature {
  /** The BASE64URL-encoded JWS protected header. When decoded, contains
   *  fields including: `alg` (signature algorithm), `jku` (JWKS URL for
   *  key verification), and `kid` (key identifier). */
  readonly protected: string;

  /** The BASE64URL-encoded digital signature computed over the protected
   *  header and the canonicalized context payload (detached). */
  readonly signature: string;
}

/**
 * Anti-replay claims that MUST accompany a `signature` to prevent a captured
 * signed message from being resubmitted by an attacker.
 *
 * See the [Security & Identity documentation](../../api/security) for details.
 */
export interface AntiReplayClaims {
  /** Issued-at time as a Unix timestamp (seconds since epoch). */
  readonly iat: number;

  /** Expiration time as a Unix timestamp (seconds since epoch). */
  readonly exp: number;

  /** Unique identifier for this signed context instance (UUID). */
  readonly jti: string;
}

/**
 * The outcome of verifying a signed context object. Populated by the
 * receiving application's security implementation after calling its
 * verification function with the received `ContextMetadata`.
 *
 * This is NOT a transmitted metadata field — it is never sent over the
 * wire by the Desktop Agent. It is the output of a local verification step
 * performed by the receiving application.
 *
 * See the [Security & Identity documentation](../../api/security) for details.
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

/**
 * Metadata that may be provided by an App when calling `broadcast`, `open` or
 * `raiseIntent` functions, to be passed on to receiving apps.
 *
 * The Desktop Agent MUST forward any provided fields to the receiving app's
 * handler via `ContextMetadata`, while always overriding `source` and
 * `timestamp` with its own values.
 */
export interface AppProvidableContextMetadata {
  /** A unique identifier for tracing the flow of context or intent messages
   * across applications. If provided, the Desktop Agent SHOULD forward it.
   * If not provided, the Desktop Agent SHOULD generate a new one. */
  traceId?: string;

  /** A Detached JSON Web Signature (JWS) proving the authenticity and
   * integrity of the context. MUST be accompanied by `antiReplay`.
   * See [Security & Identity](../../api/security) for details. */
  signature?: DetachedSignature;

  /** Anti-replay claims used alongside `signature` to prevent a signed
   * message from being replayed. MUST be present when `signature` is set.
   * See [Security & Identity](../../api/security) for details. */
  antiReplay?: AntiReplayClaims;

  /** Custom metadata. Allows use of metadata fields that have yet to be
   * standardized. */
  custom?: Record<string, any>;
}

/**
 * Metadata relating to a context or intent received through the
 * `addContextListener` and `addIntentListener` functions.
 *
 * Includes delivery information provided by the Desktop Agent (`source`,
 * `timestamp`, `traceId`) and optional metadata forwarded from the
 * originating app (`signature`, `antiReplay`, `traceId`, `custom`).
 */
export interface ContextMetadata extends AppProvidableContextMetadata {
  /** The timestamp when the context was broadcast or the intent was raised. */
  readonly timestamp: Date;

  /** The identifier of the app instance that originated the context or intent. */
  readonly source: AppIdentifier;
}
