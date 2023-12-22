/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

/**
 * @see https://fdc3.finos.org/docs/context/spec#standard-context-types
 */
export type StandardContextType =
  | 'fdc3.action'
  | 'fdc3.chart'
  | 'fdc3.chat.initSettings'
  | 'fdc3.chat.message'
  | 'fdc3.chat.room'
  | 'fdc3.chat.searchCriteria'
  | 'fdc3.contact'
  | 'fdc3.contactList'
  | 'fdc3.country'
  | 'fdc3.currency'
  | 'fdc3.email'
  | 'fdc3.instrument'
  | 'fdc3.instrumentList'
  | 'fdc3.interaction'
  | 'fdc3.message'
  | 'fdc3.organization'
  | 'fdc3.portfolio'
  | 'fdc3.position'
  | 'fdc3.nothing'
  | 'fdc3.timerange'
  | 'fdc3.transactionResult'
  | 'fdc3.valuation';

/**
 * @see https://fdc3.finos.org/docs/context/spec
 */
export type ContextType = StandardContextType | string;
