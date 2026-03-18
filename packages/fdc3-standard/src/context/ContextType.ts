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
  | 'fdc3.fileAttachment'
  | 'fdc3.instrument'
  | 'fdc3.instrumentList'
  | 'fdc3.interaction'
  | 'fdc3.message'
  | 'fdc3.nothing'
  | 'fdc3.organization'
  | 'fdc3.portfolio'
  | 'fdc3.position'
  | 'fdc3.timeRange'
  | 'fdc3.transactionResult'
  | 'fdc3.valuation';

/**
 * @see https://fdc3.finos.org/docs/context/spec#standard-context-types
 */
export type ExperimentalContextType =
  | 'fdc3.order'
  | 'fdc3.orderList'
  | 'fdc3.product'
  | 'fdc3.trade'
  | 'fdc3.tradeList';

/**
 * @see https://fdc3.finos.org/docs/context/spec
 */
export type ContextType = StandardContextType | ExperimentalContextType | (string & {});

/**
 * @deprecated Use {@link StandardContextType} instead
 */
export enum ContextTypes {
  Action = 'fdc3.action',
  Chart = 'fdc3.chart',
  ChatInitSettings = 'fdc3.chat.initSettings',
  ChatMessage = 'fdc3.chat.message',
  ChatRoom = 'fdc3.chat.room',
  ChatSearchCriteria = 'fdc3.chat.searchCriteria',
  Contact = 'fdc3.contact',
  ContactList = 'fdc3.contactList',
  Country = 'fdc3.country',
  Currency = 'fdc3.currency',
  Email = 'fdc3.email',
  FileAttachment = 'fdc3.fileAttachment',
  Instrument = 'fdc3.instrument',
  InstrumentList = 'fdc3.instrumentList',
  Interaction = 'fdc3.interaction',
  Message = 'fdc3.message',
  Nothing = 'fdc3.nothing',
  Order = 'fdc3.order',
  OrderList = 'fdc3.orderList',
  Organization = 'fdc3.organization',
  Portfolio = 'fdc3.portfolio',
  Position = 'fdc3.position',
  Product = 'fdc3.product',
  TimeRange = 'fdc3.timeRange',
  Trade = 'fdc3.trade',
  TradeList = 'fdc3.tradeList',
  TransactionResult = 'fdc3.transactionResult',
  Valuation = 'fdc3.valuation',
}
