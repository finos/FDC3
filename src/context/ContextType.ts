export enum ContextTypes {
  Contact = 'fdc3.contact',
  ContactList = 'fdc3.contactList',
  Country = 'fdc3.country',
  Instrument = 'fdc3.instrument',
  InstrumentList = 'fdc3.instrumentList',
  Organization = 'fdc3.organization',
  Portfolio = 'fdc3.portfolio',
  Position = 'fdc3.position',
  Nothing = 'fdc3.nothing',
  Valuation = 'fdc3.nothing',
}

export type ContextType = ContextTypes | string;
