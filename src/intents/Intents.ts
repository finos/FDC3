/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { IntentsConfiguration } from './IntentsConfiguration';

/**
 * @see https://fdc3.finos.org/docs/intents/spec#standard-intents
 */
export type StandardIntent =
  | 'CreateInteraction'
  | 'SendChatMessage'
  | 'StartCall'
  | 'StartChat'
  | 'StartEmail'
  | 'ViewAnalysis'
  | 'ViewChat'
  | 'ViewChart'
  | 'ViewContact'
  | 'ViewHoldings'
  | 'ViewInstrument'
  | 'ViewInteractions'
  | 'ViewMessages'
  | 'ViewNews'
  | 'ViewOrders'
  | 'ViewProfile'
  | 'ViewQuote'
  | 'ViewResearch';

/**
 * @see https://fdc3.finos.org/docs/intents/spec
 */
export type Intent = StandardIntent | (string & {});

/**
 * Typed possible context for a given intent
 *
 * @example `ContextTypeFor<'StartCall'>` is equivalent to `'fdc3.contact' | 'fdc3.contactList' | 'fdc3.nothing'`
 */
export type ContextTypeFor<I extends StandardIntent> = typeof IntentsConfiguration[I][number];
