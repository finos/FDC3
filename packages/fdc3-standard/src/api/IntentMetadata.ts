/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { Intent } from '../intents/Intents.js';

/**
 * Intent descriptor
 */
export interface IntentMetadata {
  /** The unique name of the intent that can be invoked by the raiseIntent call */
  readonly name: Intent;

  /** Display name for the intent.
   * @deprecated Use the intent name for display as display name may vary for
   * each application as it is defined in the app's AppD record.
   */
  readonly displayName?: string;
}
