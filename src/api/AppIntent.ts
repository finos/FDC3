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
  readonly intent: IntentMetadata;
  readonly apps: Array<AppMetadata>;
}
