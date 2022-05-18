/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { AppMetadata } from './AppMetadata';

/**
 * Metadata relating to a context or intent and context received through the
 * `addContextListener` and `addIntentListener` functions.
 */
export interface ContextMetadata {
  /** Metadata relating to the app that sent the context and/or intent. */
  readonly sourceAppMetadata: AppMetadata;
}
