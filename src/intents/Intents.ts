/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

/**
 * @see https://fdc3.finos.org/docs/intents/spec#standard-intents
 */
export type StandardIntent =
  | 'CreateInteraction'
  | 'CreateOrUpdateProfile'
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
// disable linter rule that dislikes {} - its necessary here to stop the TS compiler reducing this type to string
// eslint-disable-next-line @typescript-eslint/ban-types
export type Intent = StandardIntent | (string & {});

/**
 * @deprecated Use {@link StandardIntent} instead
 */
export enum Intents {
  CreateInteraction = 'CreateInteraction',
  CreateOrUpdateProfile = 'CreateOrUpdateProfile',
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
