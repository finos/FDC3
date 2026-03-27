/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import {
  AntiReplayClaims,
  DetachedSignature,
  MessageAuthenticity,
} from '@robmoffat/fdc3-schema/generated/api/BrowserTypes.js';
import { AppIdentifier } from './AppIdentifier.js';

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
 *
 * @experimental Introduced in FDC3 2.0 and may be refined by further changes outside the normal FDC3 versioning policy.
 */
export interface ContextMetadata extends AppProvidableContextMetadata, DesktopAgentProvidableContextMetadata {}

export interface AppProvidableContextMetadata extends SecurityMetadata {
  traceId?: string;
}

export interface DesktopAgentProvidableContextMetadata extends SecurityMetadata {
  /** The timestamp when the context was broadcast or the intent was raised.
   * This can be used for debugging, auditing, or ordering events. */
  timestamp?: Date;

  /** The identifier of the app instance that originated the context or intent. */
  source?: AppIdentifier;
}
