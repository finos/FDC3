/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

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
}

export interface AppProvidableContextMetadata {
  signature?: string;
  traceId?: string;
}

export interface DesktopAgentProvidableContextMetadata {
  timestamp?: Date;
  source?: AppIdentifier;
  traceId?: string;
  signature?: string;
}
