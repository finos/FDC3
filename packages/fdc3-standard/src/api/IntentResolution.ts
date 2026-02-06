/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { IntentResult } from './Types.js';
import { AppIdentifier } from './AppIdentifier.js';
import { Intent } from '../intents/Intents.js';

/**
 * IntentResolution provides a standard format for data returned upon resolving an intent.
 *
 * ```javascript
 * //resolve a "Chain" type intent
 * let resolution = await agent.raiseIntent("intentName", context);
 *
 * //resolve a "Client-Service" type intent with a data response or a Channel
 * let resolution = await agent.raiseIntent("intentName", context);
 * try {
 * 	   const result = await resolution.getResult();
 *     if (result && result.broadcast) {
 *         console.log(`${resolution.source} returned a channel with id ${result.id}`);
 *     } else if (result){
 *         console.log(`${resolution.source} returned data: ${JSON.stringify(result)}`);
 *     } else {
 *         console.error(`${resolution.source} didn't return data`
 *     }
 * } catch(error) {
 *     console.error(`${resolution.source} returned an error: ${error}`);
 * }
 *
 * // Use metadata about the resolving app instance to target a further intent
 * await agent.raiseIntent("intentName", context, resolution.source);
 * ```
 */
export interface IntentResolution {
  /**
   * Identifier for the app instance that was selected (or started) to resolve the intent.
   * `source.instanceId` MUST be set, indicating the specific app instance that
   * received the intent.
   */
  readonly source: AppIdentifier;
  /**
   * The intent that was raised. May be used to determine which intent the user
   * chose in response to `fdc3.raiseIntentForContext()`.
   */
  readonly intent: Intent;
  /**
   * Retrieves a promise that will resolve to `Context` data returned
   * by the application that resolves the raised intent, a `Channel`
   * established and returned by the app resolving the intent or void.
   *
   * A `Channel` returned MAY be of the `PrivateChannel` type. The
   * client can then `addContextListener()` on that channel to, for example,
   * receive a stream of data.
   *
   * If an error occurs (i.e. an error is thrown by the handler function,
   * the promise it returns is rejected, or the promise resolved to an invalid
   * type) then the Desktop Agent MUST reject the promise returned by the
   * `getResult()` function of the `IntentResolution` with a string from
   * the `ResultError` enumeration, or (if connected to a Desktop Agent
   * Bridge) the `BridgingError` enumeration.
   */
  getResult(): Promise<IntentResult>;
}
