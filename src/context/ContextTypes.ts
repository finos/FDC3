// To parse this data:
//
//   import { Convert, Chart, ChatInitSettings, Contact, ContactList, Context, Country, Currency, Email, Instrument, InstrumentList, Nothing, Order, Organization, Portfolio, Position, Product, TimeRange, Trade, Valuation } from "./file";
//
//   const chart = Convert.toChart(json);
//   const chatInitSettings = Convert.toChatInitSettings(json);
//   const contact = Convert.toContact(json);
//   const contactList = Convert.toContactList(json);
//   const context = Convert.toContext(json);
//   const country = Convert.toCountry(json);
//   const currency = Convert.toCurrency(json);
//   const email = Convert.toEmail(json);
//   const instrument = Convert.toInstrument(json);
//   const instrumentList = Convert.toInstrumentList(json);
//   const nothing = Convert.toNothing(json);
//   const order = Convert.toOrder(json);
//   const organization = Convert.toOrganization(json);
//   const portfolio = Convert.toPortfolio(json);
//   const position = Convert.toPosition(json);
//   const product = Convert.toProduct(json);
//   const timeRange = Convert.toTimeRange(json);
//   const trade = Convert.toTrade(json);
//   const valuation = Convert.toValuation(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Chart {
  instruments: InstrumentElement[];
  otherConfig?: { [key: string]: any };
  range?: TimeRangeObject;
  style?: Style;
  type: string;
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

export interface InstrumentElement {
  id: PurpleID;
  market?: PurpleMarket;
  type: string;
  name?: string;
  [property: string]: any;
}

export interface PurpleID {
  BBG?: string;
  CUSIP?: string;
  FDS_ID?: string;
  FIGI?: string;
  ISIN?: string;
  PERMID?: string;
  RIC?: string;
  SEDOL?: string;
  ticker?: string;
  [property: string]: any;
}

export interface PurpleMarket {
  BBG?: string;
  COUNTRY_ISOALPHA2?: string;
  MIC?: string;
  name?: string;
  [property: string]: any;
}

export interface TimeRangeObject {
  endTime?: Date;
  startTime?: Date;
  type: string;
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
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
  members?: ContactListObject;
  options?: any;
  type: any;
  [property: string]: any;
}

export interface ContactListObject {
  contacts: ContactElement[];
  type: string;
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

export interface ContactElement {
  id: FluffyID;
  type: string;
  name?: string;
  [property: string]: any;
}

export interface FluffyID {
  email?: string;
  FDS_ID?: string;
  [property: string]: any;
}

export interface Contact {
  id: TentacledID;
  type: string;
  name?: string;
  [property: string]: any;
}

export interface TentacledID {
  email?: string;
  FDS_ID?: string;
  [property: string]: any;
}

export interface ContactList {
  contacts: ContactElement[];
  type: string;
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

export interface Context {
  id?: { [key: string]: any };
  name?: string;
  type: string;
  [property: string]: any;
}

export interface Country {
  id: CountryID;
  type: string;
  name?: string;
  [property: string]: any;
}

export interface CountryID {
  COUNTRY_ISOALPHA2?: string;
  COUNTRY_ISOALPHA3?: string;
  ISOALPHA2?: string;
  ISOALPHA3?: string;
  [property: string]: any;
}

export interface Currency {
  id: CurrencyID;
  name?: string;
  type: string;
  [property: string]: any;
}

export interface CurrencyID {
  CURRENCY_ISOCODE?: string;
  [property: string]: any;
}

export interface Email {
  recipients: RecipientsObject;
  subject?: string;
  textBody?: string;
  type: string;
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

export interface RecipientsObject {
  id?: RecipientsID;
  type: string;
  name?: string;
  contacts?: ContactElement[];
  [property: string]: any;
}

export interface RecipientsID {
  email?: string;
  FDS_ID?: string;
  [property: string]: any;
}

export interface Instrument {
  id: StickyID;
  market?: FluffyMarket;
  type: string;
  name?: string;
  [property: string]: any;
}

export interface StickyID {
  BBG?: string;
  CUSIP?: string;
  FDS_ID?: string;
  FIGI?: string;
  ISIN?: string;
  PERMID?: string;
  RIC?: string;
  SEDOL?: string;
  ticker?: string;
  [property: string]: any;
}

export interface FluffyMarket {
  BBG?: string;
  COUNTRY_ISOALPHA2?: string;
  MIC?: string;
  name?: string;
  [property: string]: any;
}

export interface InstrumentList {
  instruments: InstrumentElement[];
  type: string;
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

export interface Nothing {
  type: string;
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

/**
 * @experimental context type representing an order. To be used with OMS and EMS systems.
 *
 * This type currently only defines a required `id` field, which should provide a reference
 * to the order in one or more systems, an optional human readable `name` field to be used
 * to summarize the order and an optional `details` field that may be used to provide
 * additional detail about the order, including a context representing a `product`, which
 * may be extended with arbitrary properties. The `details.product` field is currently typed
 * as a unspecified Context type, but both `details` and `details.product` are expected to
 * be standardized in future.
 */
export interface Order {
  /**
   * Optional additional details about the order, which may include a product element that is
   * an, as yet undefined but extensible, Context
   */
  details?: OrderDetails;
  /**
   * One or more identifiers that refer to the order in an OMS, EMS or related system.
   * Specific key names for systems are expected to be standardized in future.
   */
  id: { [key: string]: string };
  /**
   * A human-readable summary of the order.
   */
  name?: string;
  type: string;
  [property: string]: any;
}

/**
 * Optional additional details about the order, which may include a product element that is
 * an, as yet undefined but extensible, Context
 */
export interface OrderDetails {
  product?: ProductObject;
  [property: string]: any;
}

/**
 * @experimental context type representing a tradable product. To be used with OMS and EMS
 * systems.
 *
 * This type is currently only loosely defined as an extensible context object, with an
 * optional instrument field.
 */
export interface ProductObject {
  /**
   * One or more identifiers that refer to the product. Specific key names for systems are
   * expected to be standardized in future.
   */
  id: { [key: string]: string };
  /**
   * A human-readable summary of the product.
   */
  name?: string;
  type: string;
  instrument?: InstrumentElement;
  [property: string]: any;
}

export interface Organization {
  id: OrganizationID;
  type: string;
  name?: string;
  [property: string]: any;
}

export interface OrganizationID {
  FDS_ID?: string;
  LEI?: string;
  PERMID?: string;
  [property: string]: any;
}

export interface Portfolio {
  positions: PositionElement[];
  type: string;
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

export interface PositionElement {
  holding: number;
  instrument: InstrumentElement;
  type: string;
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

export interface Position {
  holding: number;
  instrument: InstrumentElement;
  type: string;
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

/**
 * @experimental context type representing a tradable product. To be used with OMS and EMS
 * systems.
 *
 * This type is currently only loosely defined as an extensible context object, with an
 * optional instrument field.
 */
export interface Product {
  /**
   * One or more identifiers that refer to the product. Specific key names for systems are
   * expected to be standardized in future.
   */
  id: { [key: string]: string };
  /**
   * A human-readable summary of the product.
   */
  name?: string;
  type: string;
  instrument?: InstrumentElement;
  [property: string]: any;
}

export interface TimeRange {
  endTime?: Date;
  startTime?: Date;
  type: string;
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

/**
 * @experimental context type representing a trade. To be used with execution systems.
 *
 * This type currently only defines a required `id` field, which should provide a reference
 * to the trade in one or more systems, an optional human readable `name` field to be used
 * to summarize the trade and a required `product` field that may be used to provide
 * additional detail about the trade, which is currently typed as a unspecified Context
 * type, but `product` is expected to be standardized in future.
 */
export interface Trade {
  /**
   * One or more identifiers that refer to the trade in an OMS, EMS or related system.
   * Specific key names for systems are expected to be standardized in future.
   */
  id: { [key: string]: string };
  /**
   * A human-readable summary of the order.
   */
  name?: string;
  product: ProductObject;
  type: string;
  [property: string]: any;
}

export interface Valuation {
  CURRENCY_ISOCODE: string;
  expiryTime?: Date;
  price?: number;
  type: string;
  valuationTime?: Date;
  value: number;
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
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

  public static toContext(json: string): Context {
    return cast(JSON.parse(json), r('Context'));
  }

  public static contextToJson(value: Context): string {
    return JSON.stringify(uncast(value, r('Context')), null, 2);
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

  public static toOrder(json: string): Order {
    return cast(JSON.parse(json), r('Order'));
  }

  public static orderToJson(value: Order): string {
    return JSON.stringify(uncast(value, r('Order')), null, 2);
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

  public static toProduct(json: string): Product {
    return cast(JSON.parse(json), r('Product'));
  }

  public static productToJson(value: Product): string {
    return JSON.stringify(uncast(value, r('Product')), null, 2);
  }

  public static toTimeRange(json: string): TimeRange {
    return cast(JSON.parse(json), r('TimeRange'));
  }

  public static timeRangeToJson(value: TimeRange): string {
    return JSON.stringify(uncast(value, r('TimeRange')), null, 2);
  }

  public static toTrade(json: string): Trade {
    return cast(JSON.parse(json), r('Trade'));
  }

  public static tradeToJson(value: Trade): string {
    return JSON.stringify(uncast(value, r('Trade')), null, 2);
  }

  public static toValuation(json: string): Valuation {
    return cast(JSON.parse(json), r('Valuation'));
  }

  public static valuationToJson(value: Valuation): string {
    return JSON.stringify(uncast(value, r('Valuation')), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : '';
  const keyText = key ? ` for key "${key}"` : '';
  throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map(a => {
          return prettyTypeName(a);
        })
        .join(', ')}]`;
    }
  } else if (typeof typ === 'object' && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
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

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
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
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map(a => {
        return l(a);
      }),
      val,
      key,
      parent
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l('array'), val, key, parent);
    return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l('Date'), val, key, parent);
    }
    return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue(l(ref || 'object'), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach(key => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === 'object' && typ.ref !== undefined) {
    ref = typ.ref;
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
      : invalidValue(typ, val, key, parent);
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

function l(typ: any) {
  return { literal: typ };
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
  Chart: o(
    [
      { json: 'instruments', js: 'instruments', typ: a(r('InstrumentElement')) },
      { json: 'otherConfig', js: 'otherConfig', typ: u(undefined, m('any')) },
      { json: 'range', js: 'range', typ: u(undefined, r('TimeRangeObject')) },
      { json: 'style', js: 'style', typ: u(undefined, r('Style')) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  InstrumentElement: o(
    [
      { json: 'id', js: 'id', typ: r('PurpleID') },
      { json: 'market', js: 'market', typ: u(undefined, r('PurpleMarket')) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  PurpleID: o(
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
    'any'
  ),
  PurpleMarket: o(
    [
      { json: 'BBG', js: 'BBG', typ: u(undefined, '') },
      { json: 'COUNTRY_ISOALPHA2', js: 'COUNTRY_ISOALPHA2', typ: u(undefined, '') },
      { json: 'MIC', js: 'MIC', typ: u(undefined, '') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  TimeRangeObject: o(
    [
      { json: 'endTime', js: 'endTime', typ: u(undefined, Date) },
      { json: 'startTime', js: 'startTime', typ: u(undefined, Date) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  ChatInitSettings: o(
    [
      { json: 'chatName', js: 'chatName', typ: u(undefined, '') },
      { json: 'initMessage', js: 'initMessage', typ: u(undefined, '') },
      { json: 'members', js: 'members', typ: u(undefined, r('ContactListObject')) },
      { json: 'options', js: 'options', typ: u(undefined, 'any') },
      { json: 'type', js: 'type', typ: 'any' },
    ],
    'any'
  ),
  ContactListObject: o(
    [
      { json: 'contacts', js: 'contacts', typ: a(r('ContactElement')) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  ContactElement: o(
    [
      { json: 'id', js: 'id', typ: r('FluffyID') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  FluffyID: o(
    [
      { json: 'email', js: 'email', typ: u(undefined, '') },
      { json: 'FDS_ID', js: 'FDS_ID', typ: u(undefined, '') },
    ],
    'any'
  ),
  Contact: o(
    [
      { json: 'id', js: 'id', typ: r('TentacledID') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  TentacledID: o(
    [
      { json: 'email', js: 'email', typ: u(undefined, '') },
      { json: 'FDS_ID', js: 'FDS_ID', typ: u(undefined, '') },
    ],
    'any'
  ),
  ContactList: o(
    [
      { json: 'contacts', js: 'contacts', typ: a(r('ContactElement')) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Context: o(
    [
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: '' },
    ],
    'any'
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
    'any'
  ),
  Currency: o(
    [
      { json: 'id', js: 'id', typ: r('CurrencyID') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: '' },
    ],
    'any'
  ),
  CurrencyID: o([{ json: 'CURRENCY_ISOCODE', js: 'CURRENCY_ISOCODE', typ: u(undefined, '') }], 'any'),
  Email: o(
    [
      { json: 'recipients', js: 'recipients', typ: r('RecipientsObject') },
      { json: 'subject', js: 'subject', typ: u(undefined, '') },
      { json: 'textBody', js: 'textBody', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  RecipientsObject: o(
    [
      { json: 'id', js: 'id', typ: u(undefined, r('RecipientsID')) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'contacts', js: 'contacts', typ: u(undefined, a(r('ContactElement'))) },
    ],
    'any'
  ),
  RecipientsID: o(
    [
      { json: 'email', js: 'email', typ: u(undefined, '') },
      { json: 'FDS_ID', js: 'FDS_ID', typ: u(undefined, '') },
    ],
    'any'
  ),
  Instrument: o(
    [
      { json: 'id', js: 'id', typ: r('StickyID') },
      { json: 'market', js: 'market', typ: u(undefined, r('FluffyMarket')) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  StickyID: o(
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
    'any'
  ),
  FluffyMarket: o(
    [
      { json: 'BBG', js: 'BBG', typ: u(undefined, '') },
      { json: 'COUNTRY_ISOALPHA2', js: 'COUNTRY_ISOALPHA2', typ: u(undefined, '') },
      { json: 'MIC', js: 'MIC', typ: u(undefined, '') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  InstrumentList: o(
    [
      { json: 'instruments', js: 'instruments', typ: a(r('InstrumentElement')) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Nothing: o(
    [
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Order: o(
    [
      { json: 'details', js: 'details', typ: u(undefined, r('OrderDetails')) },
      { json: 'id', js: 'id', typ: m('') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: '' },
    ],
    'any'
  ),
  OrderDetails: o([{ json: 'product', js: 'product', typ: u(undefined, r('ProductObject')) }], 'any'),
  ProductObject: o(
    [
      { json: 'id', js: 'id', typ: m('') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'instrument', js: 'instrument', typ: u(undefined, r('InstrumentElement')) },
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
    'any'
  ),
  Portfolio: o(
    [
      { json: 'positions', js: 'positions', typ: a(r('PositionElement')) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  PositionElement: o(
    [
      { json: 'holding', js: 'holding', typ: 3.14 },
      { json: 'instrument', js: 'instrument', typ: r('InstrumentElement') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Position: o(
    [
      { json: 'holding', js: 'holding', typ: 3.14 },
      { json: 'instrument', js: 'instrument', typ: r('InstrumentElement') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Product: o(
    [
      { json: 'id', js: 'id', typ: m('') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'instrument', js: 'instrument', typ: u(undefined, r('InstrumentElement')) },
    ],
    'any'
  ),
  TimeRange: o(
    [
      { json: 'endTime', js: 'endTime', typ: u(undefined, Date) },
      { json: 'startTime', js: 'startTime', typ: u(undefined, Date) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Trade: o(
    [
      { json: 'id', js: 'id', typ: m('') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'product', js: 'product', typ: r('ProductObject') },
      { json: 'type', js: 'type', typ: '' },
    ],
    'any'
  ),
  Valuation: o(
    [
      { json: 'CURRENCY_ISOCODE', js: 'CURRENCY_ISOCODE', typ: '' },
      { json: 'expiryTime', js: 'expiryTime', typ: u(undefined, Date) },
      { json: 'price', js: 'price', typ: u(undefined, 3.14) },
      { json: 'type', js: 'type', typ: '' },
      { json: 'valuationTime', js: 'valuationTime', typ: u(undefined, Date) },
      { json: 'value', js: 'value', typ: 3.14 },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Style: ['bar', 'candle', 'custom', 'heatmap', 'histogram', 'line', 'mountain', 'pie', 'scatter', 'stacked-bar'],
};
