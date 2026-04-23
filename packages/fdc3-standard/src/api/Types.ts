/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { Context } from '@finos/fdc3-context';
import { Channel } from './Channel.js';
import type { ContextMetadata } from './ContextMetadata.js';

/**
 * Represents a context object paired with its associated metadata.
 * Returned by `Channel.getCurrentContextWithMetadata()` to allow
 * retrieval of both the current context and the metadata that was
 * provided when it was broadcast.
 */
export type ContextWithMetadata = {
  context: Context;
  metadata: ContextMetadata;
};

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
export type ContextHandler = (context: Context, metadata: ContextMetadata) => void;
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
 */
export type IntentHandler = (context: Context, metadata: ContextMetadata) => Promise<IntentResult> | void;
