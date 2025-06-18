/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { Context } from '@finos/fdc3-context';
import { Channel } from './Channel.js';
import type { DesktopAgentProvidableContextMetadata } from './ContextMetadata.js';

/**
 * Describes a callback that handles a context event.
 * Used when attaching listeners for context broadcasts.
 *
 * The handler receives the context object and a `metadata` parameter.
 *
 * Metadata about each context message received, including the app that
 * originated the message and a timestamp, MUST be provided by the
 * Desktop Agent implementation. Apps raising intents MAY provide additional
 * metadata (such as a traceId, signature or custom metadata), which the
 * Desktop Agent MUST pass on to the handler.
 */
export type ContextHandler = (context: Context, metadata?: DesktopAgentProvidableContextMetadata) => void;
/**
 * Intents can return results that are either context data objects
 * or a reference to a Channel. Used as the return type of
 * `IntentResolution.getResult()`.
 */
export type IntentResult = Context | Channel | void;
/**
 * Describes a callback that handles a context event and may return a
 * promise of a Context, ContextWithMetadata, Channel, PrivateChannel or void
 * to be returned to the application that raised the intent.
 * Used when attaching listeners for raised intents.
 *
 * The handler receives the context object and a `metadata` parameter.
 *
 * Metadata about each intent & context message received, including the app
 * that originated the message and a timestamp, MUST be provided by the
 * Desktop Agent implementation. Apps raising intents MAY provide additional
 * metadata (such as a traceId, signature or custom metadata), which the
 * Desktop Agent MUST pass on to the handler.
 *
 * An `IntentHandler` MAY return a `ContextWithMetadata` object instead of a
 * plain `Context` to include app-provided metadata (e.g. a `traceId` or
 * `signature`) alongside the context result. The Desktop Agent will merge
 * this with its own generated metadata and make the combined `ContextMetadata`
 * available to the raising app via `IntentResolution.getResultMetadata()`.
 * `IntentResolution.getResult()` will still return only the `Context` portion.
 */
export type IntentHandler = (
  context: Context,
  metadata?: DesktopAgentProvidableContextMetadata
) => Promise<IntentResult> | void;
