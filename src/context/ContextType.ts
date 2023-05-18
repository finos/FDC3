export enum ContextTypes {
  Chart = 'fdc3.chart',
  ChatInitSettings = 'fdc3.chat.initSettings',
  ChatRoom = 'fdc3.chat.room',
  Contact = 'fdc3.contact',
  ContactList = 'fdc3.contactList',
  Country = 'fdc3.country',
  Currency = 'fdc3.currency',
  Email = 'fdc3.email',
  Instrument = 'fdc3.instrument',
  InstrumentList = 'fdc3.instrumentList',
  Interaction = 'fdc3.interaction',
  Nothing = 'fdc3.nothing',
  Organization = 'fdc3.organization',
  Portfolio = 'fdc3.portfolio',
  Position = 'fdc3.position',
  ChatSearchCriteria = 'fdc3.chat.searchCriteria',
  TimeRange = 'fdc3.timerange',
  TransactionResult = 'fdc3.transactionResult',
  Valuation = 'fdc3.valuation',
}

export type ContextType = ContextTypes | string;
