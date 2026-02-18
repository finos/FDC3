/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { DetachedSignature } from '@finos/fdc3-schema/generated/api/BrowserTypes';
import { AppIdentifier } from './AppIdentifier';

/**
 * Metadata relating to a context or intent and context received through the
 * `addContextListener` and `addIntentListener` functions.
 *
 * @experimental Introduced in FDC3 2.0 and may be refined by further changes outside the normal FDC3 versioning policy.
 */
export interface ContextMetadata {
  /** Identifier for the app instance that sent the context and/or intent.
   *
   *  @experimental
   */
  readonly source: AppIdentifier;

  /** A Detached JSON Web Signature (JWS) proving the authenticity and integrity of the context. */
  readonly signature?: DetachedSignature;

  /** The result of verifying the context's signature, populated by the receiving app's
   * security layer after attempting signature verification.  See: [Security & Identity
   * documentation](../../api/security#authenticity-metadata). */
  readonly authenticity?: unknown;

  /** The result of attempting to decrypt the context, populated by the receiving app's
   * security layer after attempting decryption.  See: [Security & Identity
   * documentation](../../api/security#encryption-metadata). */
  readonly encryption?: 'cant_decrypt' | 'not_encrypted' | 'decrypted';
}

export interface AppProvidableContextMetadata {
  signature?: string;
  traceId?: string;
}

export interface DesktopAgentProvidableContextMetadata {
  /** The timestamp when the context was broadcast or the intent was raised.
   * This can be used for debugging, auditing, or ordering events. */
  timestamp?: Date;

  /** The identifier of the app instance that originated the context or intent. */
  source?: AppIdentifier;

  /** A unique identifier for tracing the flow of context or intent messages across applications.
   * This is useful for debugging and monitoring message flow in complex interop scenarios. */
  traceId?: string;

  /** A cryptographic signature that can be used to verify the authenticity and integrity
   * of the context or intent message. This is useful for security-sensitive applications. */
  signature?: string;
}
