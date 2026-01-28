/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { Context } from '@finos/fdc3-context';
import { Channel } from './Channel';
import type { DesktopAgentProvidableContextMetadata } from './ContextMetadata';

/**
 * Describes a callback that handles a context event.
 * Used when attaching listeners for context broadcasts.
 *
 * The handler receives the context object and an optional `metadata` parameter.
 * The `metadata` parameter, when provided by the desktop agent implementation, contains
 * information about the context message such as `timestamp`, `source` (the app that
 * originated the message), `traceId`, and `signature`.
 *
 * Optional metadata about the context message, including the app that originated
 * the message, SHOULD be provided by the desktop agent implementation.
 */
export type ContextHandler = (context: Context, metadata?: DesktopAgentProvidableContextMetadata) => void;
/**
 * Intents can return results that are either context data objects
 * or a reference to a Channel.
 */
export type IntentResult = Context | Channel | void;
/**
 * Describes a callback that handles a context event and may return a
 * promise of a Context, Channel object or void to be returned to the
 * application that raised the intent.
 * Used when attaching listeners for raised intents.
 *
 * The handler receives the context object and an optional `metadata` parameter.
 * The `metadata` parameter, when provided by the desktop agent implementation, contains
 * information about the raised intent such as `timestamp`, `source` (the app that
 * originated the intent), `traceId`, and `signature`.
 *
 * Optional metadata about the raised intent, including the app that originated
 * the message, SHOULD be provided by the desktop agent implementation.
 */
export type IntentHandler = (
  context: Context,
  metadata?: DesktopAgentProvidableContextMetadata
) => Promise<IntentResult> | void;
