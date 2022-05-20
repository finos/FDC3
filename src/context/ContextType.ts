export enum ContextTypes {
  Contact = 'fdc3.contact',
  ContactList = 'fdc3.contactList',
  Country = 'fdc3.country',
  Currency = 'fdc3.currency',
  Instrument = 'fdc3.instrument',
  InstrumentList = 'fdc3.instrumentList',
  Organization = 'fdc3.organization',
  Portfolio = 'fdc3.portfolio',
  Position = 'fdc3.position',
  Nothing = 'fdc3.nothing',
  TimeRange = 'fdc3.timerange',
}

export type ContextType = ContextTypes | string;
