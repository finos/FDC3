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
 * Optional metadata about the raised intent, including the app that originated
 * the message, SHOULD be provided by the desktop agent implementation.
 */
export type IntentHandler = (
  context: Context,
  metadata?: DesktopAgentProvidableContextMetadata
) => Promise<IntentResult> | void;
