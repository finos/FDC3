/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

import { TargetApp } from './Types';

/**
 * IntentResolution provides a standard format for data returned upon resolving an intent.
 * ```javascript
 * //resolve a "Chain" type intent
 * var intentR = await agent.raiseIntent("intentName", context);
 * //resolve a "Client-Service" type intent with data response
 * var intentR = await agent.raiseIntent("intentName", context);
 * var dataR = intentR.data;
 * ```
 */
export interface IntentResolution {
  /**
   * The application that resolved the intent.
   */
  readonly source: TargetApp;
  /**
   * The intent that was raised. May be used to determine which intent the user
   * chose in response to `fdc3.raiseIntentForContext()`.
   */
  readonly intent: string;
  /**
   * @deprecated not assignable from intent listeners
   */
  readonly data?: object;
  /**
   * The version number of the Intents schema being used.
   */
  readonly version?: string;
}
