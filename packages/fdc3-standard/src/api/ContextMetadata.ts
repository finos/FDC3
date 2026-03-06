/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { AppIdentifier } from './AppIdentifier.js';

/**
 * Metadata that may be provided by an App when calling broadcast, open or
 * raiseIntent functions, to be passed onto receiving apps.
 * */
export interface AppProvidableContextMetadata {
  /** A unique identifier for tracing the flow of context or intent messages
   * across applications.
   * This is useful for debugging and monitoring message flow in complex interop scenarios.
   * If a traceId is provided by the app, the Desktop Agent SHOULD forward it.
   * If no traceId is provided by the app, the Desktop Agent SHOULD generate a new one.
   * */
  traceId?: string;

  /** A cryptographic signature that can be used to verify the authenticity and integrity
   * of the context or intent message. This is useful for security-sensitive applications.
   * If a signature is provided by an app, it MAY be verified by the Desktop Agent. */
  signature?: string;

  /**
   * Custom metadata that can be used to provide additional information about
   * the context or intent. This allows for individuals to use metadata fields
   * that have yet to be standardized.
   */
  custom?: Record<string, any>;
}

interface SecurityMetadata {
  /** A Detached JSON Web Signature (JWS) proving the authenticity and integrity of the context. */
  signature?: DetachedSignature;

  /** The result of verifying the context's signature, populated by the receiving app's
   * security layer after attempting signature verification.
   **/
  authenticity?: MessageAuthenticity;

  /** The anti-replay claims of the context, populated by the receiving app's
   * security layer after attempting signature verification.
   **/
  antiReplay?: AntiReplayClaims;

  /** The result of attempting to decrypt the context, populated by the receiving app's
   * security layer after attempting decryption.  See: [Security & Identity
   * documentation](../../api/security#encryption-metadata). */
  encryption?: 'cant_decrypt' | 'not_encrypted' | 'decrypted';
}

/**
 * Metadata relating to a context or intent and context received through the
 * `addContextListener` and `addIntentListener` functions.
 */
export interface ContextMetadata extends AppProvidableContextMetadata {
  /** The timestamp when the context was broadcast or the intent was raised.
   * This can be used for debugging, auditing, or ordering events. */
  timestamp: Date;

  /** The identifier of the app instance that originated the context or intent. */
  source: AppIdentifier;
}

export interface AppProvidableContextMetadata {
  signature?: DetachedSignature;
  traceId?: string;
}

export interface DesktopAgentProvidableContextMetadata extends SecurityMetadata {
  /** The timestamp when the context was broadcast or the intent was raised.
   * This can be used for debugging, auditing, or ordering events. */
  timestamp?: Date;

  /** The identifier of the app instance that originated the context or intent. */
  source?: AppIdentifier;
}
