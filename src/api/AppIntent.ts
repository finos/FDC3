/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { AppMetadata } from './AppMetadata';
import { IntentMetadata } from './IntentMetadata';

/**
 * An interface that relates an intent to apps
 */
export interface AppIntent {
  /** Details of the intet who's relationship to resolving applications is being described. */
  readonly intent: IntentMetadata;
  /** Details of applications that can resolve the intent. */
  readonly apps: Array<AppMetadata>;
}
