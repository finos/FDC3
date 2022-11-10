// To parse this data:
//
//   import { Convert, Context, Chart, ChatInitSettings, Contact, ContactList, Country, Currency, Email, Instrument, InstrumentList, Nothing, Organization, Portfolio, Position, TimeRange, Valuation } from "./file";
//
//   const context = Convert.toContext(json);
//   const chart = Convert.toChart(json);
//   const chatInitSettings = Convert.toChatInitSettings(json);
//   const contact = Convert.toContact(json);
//   const contactList = Convert.toContactList(json);
//   const country = Convert.toCountry(json);
//   const currency = Convert.toCurrency(json);
//   const email = Convert.toEmail(json);
//   const instrument = Convert.toInstrument(json);
//   const instrumentList = Convert.toInstrumentList(json);
//   const nothing = Convert.toNothing(json);
//   const organization = Convert.toOrganization(json);
//   const portfolio = Convert.toPortfolio(json);
//   const position = Convert.toPosition(json);
//   const timeRange = Convert.toTimeRange(json);
//   const valuation = Convert.toValuation(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Context {
  id?: { [key: string]: string };
  name?: string;
  type: string;
}

export interface Chart {
  instruments: Instrument[];
  otherConfig?: { [key: string]: any };
  range?: TimeRange;
  style?: Style;
  type: string;
  id?: { [key: string]: string };
  name?: string;
}

export interface Instrument {
  id: InstrumentID;
  type: string;
  name?: string;
}

export interface InstrumentID {
  BBG?: string;
  CUSIP?: string;
  FDS_ID?: string;
  FIGI?: string;
  ISIN?: string;
  PERMID?: string;
  RIC?: string;
  SEDOL?: string;
  ticker?: string;
}

export interface TimeRange {
  endTime?: Date;
  startTime?: Date;
  type: string;
  id?: { [key: string]: string };
  name?: string;
}

export enum Style {
  Bar = 'bar',
  Candle = 'candle',
  Custom = 'custom',
  Heatmap = 'heatmap',
  Histogram = 'histogram',
  Line = 'line',
  Mountain = 'mountain',
  Pie = 'pie',
  Scatter = 'scatter',
  StackedBar = 'stacked-bar',
}

export interface ChatInitSettings {
  chatName?: string;
  initMessage?: string;
  members?: ContactList;
  options?: any;
  type: any;
}

export interface ContactList {
  contacts: Contact[];
  type: string;
  id?: { [key: string]: string };
  name?: string;
}

export interface Contact {
  id: ContactID;
  type: string;
  name?: string;
}

export interface ContactID {
  email?: string;
  FDS_ID?: string;
}

export interface Country {
  id: CountryID;
  type: string;
  name?: string;
}

export interface CountryID {
  COUNTRY_ISOALPHA2?: string;
  COUNTRY_ISOALPHA3?: string;
  ISOALPHA2?: string;
  ISOALPHA3?: string;
}

export interface Currency {
  id: CurrencyID;
  name?: string;
  type: string;
}

export interface CurrencyID {
  CURRENCY_ISOCODE?: string;
}

export interface Email {
  recipients: RecipientsObject;
  subject?: string;
  textBody?: string;
  type: string;
  id?: { [key: string]: string };
  name?: string;
}

export interface RecipientsObject {
  id?: RecipientsID;
  type: string;
  name?: string;
  contacts?: Contact[];
}

export interface RecipientsID {
  email?: string;
  FDS_ID?: string;
}

export interface InstrumentList {
  instruments: Instrument[];
  type: string;
  id?: { [key: string]: string };
  name?: string;
}

export interface Nothing {
  type: string;
  id?: { [key: string]: string };
  name?: string;
}

export interface Organization {
  id: OrganizationID;
  type: string;
  name?: string;
}

export interface OrganizationID {
  FDS_ID?: string;
  LEI?: string;
  PERMID?: string;
}

export interface Portfolio {
  positions: Position[];
  type: string;
  id?: { [key: string]: string };
  name?: string;
}

export interface Position {
  holding: number;
  instrument: Instrument;
  type: string;
  id?: { [key: string]: string };
  name?: string;
}

export interface ChatSearchCriteria {
  criteria: (Instrument | Organization | Contact | string)[];
  type: string;
}

export interface Valuation {
  CURRENCY_ISCODE?: string;
  expiryTime?: Date;
  price?: number;
  type: string;
  valuationTime?: Date;
  value: number;
  CURRENCY_ISOCODE: any;
  id?: { [key: string]: string };
  name?: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toContext(json: string): Context {
    return cast(JSON.parse(json), r('Context'));
  }

  public static contextToJson(value: Context): string {
    return JSON.stringify(uncast(value, r('Context')), null, 2);
  }

  public static toChart(json: string): Chart {
    return cast(JSON.parse(json), r('Chart'));
  }

  public static chartToJson(value: Chart): string {
    return JSON.stringify(uncast(value, r('Chart')), null, 2);
  }

  public static toChatInitSettings(json: string): ChatInitSettings {
    return cast(JSON.parse(json), r('ChatInitSettings'));
  }

  public static chatInitSettingsToJson(value: ChatInitSettings): string {
    return JSON.stringify(uncast(value, r('ChatInitSettings')), null, 2);
  }

  public static toContact(json: string): Contact {
    return cast(JSON.parse(json), r('Contact'));
  }

  public static contactToJson(value: Contact): string {
    return JSON.stringify(uncast(value, r('Contact')), null, 2);
  }

  public static toContactList(json: string): ContactList {
    return cast(JSON.parse(json), r('ContactList'));
  }

  public static contactListToJson(value: ContactList): string {
    return JSON.stringify(uncast(value, r('ContactList')), null, 2);
  }

  public static toCountry(json: string): Country {
    return cast(JSON.parse(json), r('Country'));
  }

  public static countryToJson(value: Country): string {
    return JSON.stringify(uncast(value, r('Country')), null, 2);
  }

  public static toCurrency(json: string): Currency {
    return cast(JSON.parse(json), r('Currency'));
  }

  public static currencyToJson(value: Currency): string {
    return JSON.stringify(uncast(value, r('Currency')), null, 2);
  }

  public static toEmail(json: string): Email {
    return cast(JSON.parse(json), r('Email'));
  }

  public static emailToJson(value: Email): string {
    return JSON.stringify(uncast(value, r('Email')), null, 2);
  }

  public static toInstrument(json: string): Instrument {
    return cast(JSON.parse(json), r('Instrument'));
  }

  public static instrumentToJson(value: Instrument): string {
    return JSON.stringify(uncast(value, r('Instrument')), null, 2);
  }

  public static toInstrumentList(json: string): InstrumentList {
    return cast(JSON.parse(json), r('InstrumentList'));
  }

  public static instrumentListToJson(value: InstrumentList): string {
    return JSON.stringify(uncast(value, r('InstrumentList')), null, 2);
  }

  public static toNothing(json: string): Nothing {
    return cast(JSON.parse(json), r('Nothing'));
  }

  public static nothingToJson(value: Nothing): string {
    return JSON.stringify(uncast(value, r('Nothing')), null, 2);
  }

  public static toOrganization(json: string): Organization {
    return cast(JSON.parse(json), r('Organization'));
  }

  public static organizationToJson(value: Organization): string {
    return JSON.stringify(uncast(value, r('Organization')), null, 2);
  }

  public static toPortfolio(json: string): Portfolio {
    return cast(JSON.parse(json), r('Portfolio'));
  }

  public static portfolioToJson(value: Portfolio): string {
    return JSON.stringify(uncast(value, r('Portfolio')), null, 2);
  }

  public static toPosition(json: string): Position {
    return cast(JSON.parse(json), r('Position'));
  }

  public static positionToJson(value: Position): string {
    return JSON.stringify(uncast(value, r('Position')), null, 2);
  }

  public static toTimeRange(json: string): TimeRange {
    return cast(JSON.parse(json), r('TimeRange'));
  }

  public static timeRangeToJson(value: TimeRange): string {
    return JSON.stringify(uncast(value, r('TimeRange')), null, 2);
  }

  public static toValuation(json: string): Valuation {
    return cast(JSON.parse(json), r('Valuation'));
  }

  public static valuationToJson(value: Valuation): string {
    return JSON.stringify(uncast(value, r('Valuation')), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
  if (key) {
    throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
  }
  throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue('array', val);
    return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue('Date', val);
    }
    return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue('object', val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach(key => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === 'object' && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty('props')
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  Context: o(
    [
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: '' },
    ],
    'any'
  ),
  Chart: o(
    [
      { json: 'instruments', js: 'instruments', typ: a(r('Instrument')) },
      { json: 'otherConfig', js: 'otherConfig', typ: u(undefined, m('any')) },
      { json: 'range', js: 'range', typ: u(undefined, r('TimeRange')) },
      { json: 'style', js: 'style', typ: u(undefined, r('Style')) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Instrument: o(
    [
      { json: 'id', js: 'id', typ: r('InstrumentID') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  InstrumentID: o(
    [
      { json: 'BBG', js: 'BBG', typ: u(undefined, '') },
      { json: 'CUSIP', js: 'CUSIP', typ: u(undefined, '') },
      { json: 'FDS_ID', js: 'FDS_ID', typ: u(undefined, '') },
      { json: 'FIGI', js: 'FIGI', typ: u(undefined, '') },
      { json: 'ISIN', js: 'ISIN', typ: u(undefined, '') },
      { json: 'PERMID', js: 'PERMID', typ: u(undefined, '') },
      { json: 'RIC', js: 'RIC', typ: u(undefined, '') },
      { json: 'SEDOL', js: 'SEDOL', typ: u(undefined, '') },
      { json: 'ticker', js: 'ticker', typ: u(undefined, '') },
    ],
    ''
  ),
  TimeRange: o(
    [
      { json: 'endTime', js: 'endTime', typ: u(undefined, Date) },
      { json: 'startTime', js: 'startTime', typ: u(undefined, Date) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  ChatInitSettings: o(
    [
      { json: 'chatName', js: 'chatName', typ: u(undefined, '') },
      { json: 'initMessage', js: 'initMessage', typ: u(undefined, '') },
      { json: 'members', js: 'members', typ: u(undefined, r('ContactList')) },
      { json: 'options', js: 'options', typ: u(undefined, 'any') },
      { json: 'type', js: 'type', typ: 'any' },
    ],
    'any'
  ),
  ContactList: o(
    [
      { json: 'contacts', js: 'contacts', typ: a(r('Contact')) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Contact: o(
    [
      { json: 'id', js: 'id', typ: r('ContactID') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  ContactID: o(
    [
      { json: 'email', js: 'email', typ: u(undefined, '') },
      { json: 'FDS_ID', js: 'FDS_ID', typ: u(undefined, '') },
    ],
    ''
  ),
  Country: o(
    [
      { json: 'id', js: 'id', typ: r('CountryID') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  CountryID: o(
    [
      { json: 'COUNTRY_ISOALPHA2', js: 'COUNTRY_ISOALPHA2', typ: u(undefined, '') },
      { json: 'COUNTRY_ISOALPHA3', js: 'COUNTRY_ISOALPHA3', typ: u(undefined, '') },
      { json: 'ISOALPHA2', js: 'ISOALPHA2', typ: u(undefined, '') },
      { json: 'ISOALPHA3', js: 'ISOALPHA3', typ: u(undefined, '') },
    ],
    ''
  ),
  Currency: o(
    [
      { json: 'id', js: 'id', typ: r('CurrencyID') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: '' },
    ],
    'any'
  ),
  CurrencyID: o([{ json: 'CURRENCY_ISOCODE', js: 'CURRENCY_ISOCODE', typ: u(undefined, '') }], ''),
  Email: o(
    [
      { json: 'recipients', js: 'recipients', typ: r('RecipientsObject') },
      { json: 'subject', js: 'subject', typ: u(undefined, '') },
      { json: 'textBody', js: 'textBody', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  RecipientsObject: o(
    [
      { json: 'id', js: 'id', typ: u(undefined, r('RecipientsID')) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'contacts', js: 'contacts', typ: u(undefined, a(r('Contact'))) },
    ],
    'any'
  ),
  RecipientsID: o(
    [
      { json: 'email', js: 'email', typ: u(undefined, '') },
      { json: 'FDS_ID', js: 'FDS_ID', typ: u(undefined, '') },
    ],
    ''
  ),
  InstrumentList: o(
    [
      { json: 'instruments', js: 'instruments', typ: a(r('Instrument')) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Nothing: o(
    [
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Organization: o(
    [
      { json: 'id', js: 'id', typ: r('OrganizationID') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  OrganizationID: o(
    [
      { json: 'FDS_ID', js: 'FDS_ID', typ: u(undefined, '') },
      { json: 'LEI', js: 'LEI', typ: u(undefined, '') },
      { json: 'PERMID', js: 'PERMID', typ: u(undefined, '') },
    ],
    ''
  ),
  Portfolio: o(
    [
      { json: 'positions', js: 'positions', typ: a(r('Position')) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Position: o(
    [
      { json: 'holding', js: 'holding', typ: 3.14 },
      { json: 'instrument', js: 'instrument', typ: r('Instrument') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Valuation: o(
    [
      { json: 'CURRENCY_ISCODE', js: 'CURRENCY_ISCODE', typ: u(undefined, '') },
      { json: 'expiryTime', js: 'expiryTime', typ: u(undefined, Date) },
      { json: 'price', js: 'price', typ: u(undefined, 3.14) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'valuationTime', js: 'valuationTime', typ: u(undefined, Date) },
      { json: 'value', js: 'value', typ: 3.14 },
      { json: 'CURRENCY_ISOCODE', js: 'CURRENCY_ISOCODE', typ: 'any' },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Style: ['bar', 'candle', 'custom', 'heatmap', 'histogram', 'line', 'mountain', 'pie', 'scatter', 'stacked-bar'],
};
