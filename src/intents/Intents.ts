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

/**
 * @deprecated Use {@link StandardIntent} instead
 */
export enum Intents {
  CreateInteraction = 'CreateInteraction',
  SendChatMessage = 'SendChatMessage',
  StartCall = 'StartCall',
  StartChat = 'StartChat',
  StartEmail = 'StartEmail',
  ViewAnalysis = 'ViewAnalysis',
  ViewChat = 'ViewChat',
  ViewChart = 'ViewChart',
  ViewContact = 'ViewContact',
  ViewHoldings = 'ViewHoldings',
  ViewInstrument = 'ViewInstrument',
  ViewInteractions = 'ViewInteractions',
  ViewMessages = 'ViewMessages',
  ViewNews = 'ViewNews',
  ViewOrders = 'ViewOrders',
  ViewProfile = 'ViewProfile',
  ViewQuote = 'ViewQuote',
  ViewResearch = 'ViewResearch',
}
