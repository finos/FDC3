/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

import { AppMetadata } from './AppMetadata';

/**
 * IntentResolution provides a standard format for data returned upon resolving an intent.
 * ```javascript
 * //resolve a "Chain" type intent
 * let resolution = await agent.raiseIntent("intentName", context);
 * //resolve a "Client-Service" type intent with data response
 * let resolution = await agent.raiseIntent("intentName", context);
 * var dataR = intentR.data;
 *
 * // Use metadata about the resolving app instance to target a further intent
 * await agent.raiseIntent("intentName", context, resolution.source);
 *
 * ```
 */
export interface IntentResolution {
  /**
   * Metadata about the app instance that was selected (or started) to resolve the intent.
   * `source.instanceId` MUST be set, indicating the specific app instance that
   * received the intent.
   */
  readonly source: AppMetadata;
  /**
   * @deprecated not assignable from intent listeners
   */
  readonly data?: object;
  /**
   * The version number of the Intents schema being used.
   */
  readonly version: string;
}
