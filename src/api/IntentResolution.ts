/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2019 FINOS FDC3 contributors - see NOTICE file
 */

import { Context } from '../context/ContextTypes';
import { Channel } from './Channel';
import { TargetApp } from './Types';

/**
 * IntentResolution provides a standard format for data returned upon resolving an intent.
 * ```javascript
 * //resolve a "Chain" type intent
 * let resolution = await agent.raiseIntent("intentName", context);
 *
 * //resolve a "Client-Service" type intent with a data response
 * let resolution = await agent.raiseIntent("intentName", context);
 * try {
 * 	   const result = await resolution.getData();
 *     if (result) {
 *         console.log(`${resolution.source} returned ${JSON.stringify(result)}`);
 *     } else {
 *         console.error(`${resolution.source} didn't return data`
 *     }
 * } catch(error) {
 *     console.error(`${resolution.source} returned an error: ${error}`);
 * }
 * ```
 */
export interface IntentResolution {
  /**
   * The application that resolved the intent.
   */
  readonly source: TargetApp;
  /**
   * The version number of the Intents schema being used.
   */
  readonly version?: string;
  /**
   * Retrieves a promise that will resolve to data returned by the
   * application that resolves the raised intent. The promise MUST
   * reject with a string from the `DataError` enumeration if an error
   * is thrown by the intent handler, it rejects the returned promise,
   * or it does not return a promise.
   */
  getData(): Promise<Context>;

  /**
   * Retrieves a promise that will resolve to data returned by the
   * application that resolves the raised intent. The promise MUST
   * reject with a string from the `DataError` enumeration if an error
   * is thrown by the intent handler, it rejects the returned promise,
   * or it does not return a promise of a Context object.
   */
  getData(): Promise<Context>;

  /**
   * Retrieves a promise that will resolve to a `Channel` established
   * and returned by the app resolving the intent. The `Channel` returned
   * will often be of the `PrivateChannel` type. The client can then
   * `addContextListener()` on that channel to, for example, receive a stream
   * of data.  The promise MUST reject with a string from the `DataError`
   * enumeration if an error is thrown by the intent handler, it rejects the
   * returned promise, or it does not return a promise of a Channel object.
   */
  getChannel(): Promise<Channel>;
}
