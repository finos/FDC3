export enum ContextTypes {
  Chart = 'fdc3.chart',
  Contact = 'fdc3.contact',
  ContactList = 'fdc3.contactList',
  Country = 'fdc3.country',
  Currency = 'fdc3.currency',
  DateRange = 'fdc3.dateRange',
  Indicator = 'fdc3.indicator',
  Instrument = 'fdc3.instrument',
  InstrumentList = 'fdc3.instrumentList',
  Organization = 'fdc3.organization',
  Portfolio = 'fdc3.portfolio',
  Position = 'fdc3.position',
  Nothing = 'fdc3.nothing',
  Trade = 'fdc3.trade',
  Valuation = 'fdc3.valuation',
}

export type ContextType = ContextTypes | string;