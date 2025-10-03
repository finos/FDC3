// To parse this data:
//
//   import { Convert, Action, Chart, ChatInitSettings, ChatMessage, ChatRoom, ChatSearchCriteria, Contact, ContactList, Context, Country, Currency, Email, FileAttachment, Instrument, InstrumentList, Interaction, Message, Nothing, Order, OrderList, Organization, Portfolio, Position, Product, TimeRange, Trade, TradeList, TransactionResult, Valuation } from "./file";
//
//   const action = Convert.toAction(json);
//   const chart = Convert.toChart(json);
//   const chatInitSettings = Convert.toChatInitSettings(json);
//   const chatMessage = Convert.toChatMessage(json);
//   const chatRoom = Convert.toChatRoom(json);
//   const chatSearchCriteria = Convert.toChatSearchCriteria(json);
//   const contact = Convert.toContact(json);
//   const contactList = Convert.toContactList(json);
//   const context = Convert.toContext(json);
//   const country = Convert.toCountry(json);
//   const currency = Convert.toCurrency(json);
//   const email = Convert.toEmail(json);
//   const fileAttachment = Convert.toFileAttachment(json);
//   const instrument = Convert.toInstrument(json);
//   const instrumentList = Convert.toInstrumentList(json);
//   const interaction = Convert.toInteraction(json);
//   const message = Convert.toMessage(json);
//   const nothing = Convert.toNothing(json);
//   const order = Convert.toOrder(json);
//   const orderList = Convert.toOrderList(json);
//   const organization = Convert.toOrganization(json);
//   const portfolio = Convert.toPortfolio(json);
//   const position = Convert.toPosition(json);
//   const product = Convert.toProduct(json);
//   const timeRange = Convert.toTimeRange(json);
//   const trade = Convert.toTrade(json);
//   const tradeList = Convert.toTradeList(json);
//   const transactionResult = Convert.toTransactionResult(json);
//   const valuation = Convert.toValuation(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

/**
 * A representation of an FDC3 Action (specified via a Context or Context & Intent) that can
 * be inserted inside another object, for example a chat message.
 *
 * The action may be completed by calling:
 * - `fdc3.raiseIntent()` with the specified Intent and Context
 * - `fdc3.raiseIntentForContext()` if only a context is specified, (which the Desktop Agent
 * will resolve by presenting the user with a list of available Intents for the Context).
 * - `channel.broadcast()` with the specified Context, if the `broadcast` action has been
 * defined.
 *
 * Accepts an optional `app` parameter in order to specify a specific app.
 */
export interface Action {
  /**
   * The **action** field indicates the type of action:
   * - **raiseIntent** :  If no action or `raiseIntent` is specified, then `fdc3.raiseIntent`
   * or `fdc3.raiseIntentForContext` will be called with the specified context (and intent if
   * given).
   * - **broadcast** : If `broadcast` and a `channelId` are specified then
   * `fdc3.getOrCreateChannel(channelId)` is called to retrieve the channel and broadcast the
   * context to it with `channel.broadcast(context)`. If no `channelId` has been specified,
   * the context should be broadcast to the current channel (`fdc3.broadcast()`)
   */
  action?: ActionType;
  /**
   * An optional target application identifier that should perform the action. The `app`
   * property is ignored unless the action is raiseIntent.
   */
  app?: AppIdentifier;
  /**
   * Optional channel on which to broadcast the context. The `channelId` property is ignored
   * unless the `action` is broadcast.
   */
  channelId?: string;
  /**
   * A context object with which the action will be performed
   */
  context: ContextElement;
  /**
   * Optional Intent to raise to perform the actions. Should reference an intent type name,
   * such as those defined in the FDC3 Standard. If intent is not set then
   * `fdc3.raiseIntentForContext` should be used to perform the action as this will usually
   * allow the user to choose the intent to raise.
   */
  intent?: string;
  /**
   * A human readable display name for the action
   */
  title: string;
  type: 'fdc3.action';
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

/**
 * The **action** field indicates the type of action:
 * - **raiseIntent** :  If no action or `raiseIntent` is specified, then `fdc3.raiseIntent`
 * or `fdc3.raiseIntentForContext` will be called with the specified context (and intent if
 * given).
 * - **broadcast** : If `broadcast` and a `channelId` are specified then
 * `fdc3.getOrCreateChannel(channelId)` is called to retrieve the channel and broadcast the
 * context to it with `channel.broadcast(context)`. If no `channelId` has been specified,
 * the context should be broadcast to the current channel (`fdc3.broadcast()`)
 */
export type ActionType = 'broadcast' | 'raiseIntent';

/**
 * An optional target application identifier that should perform the action. The `app`
 * property is ignored unless the action is raiseIntent.
 *
 * Identifies an application, or instance of an application, and is used to target FDC3 API
 * calls, such as `fdc3.open` or `fdc3.raiseIntent` at specific applications or application
 * instances.
 *
 * Will always include at least an `appId` field, which uniquely identifies a specific app.
 *
 * If the `instanceId` field is set then the `AppMetadata` object represents a specific
 * instance of the application that may be addressed using that Id.
 */
export interface AppIdentifier {
  /**
   * The unique application identifier located within a specific application directory
   * instance. An example of an appId might be 'app@sub.root'.
   */
  appId: string;
  /**
   * The Desktop Agent that the app is available on. Used in Desktop Agent Bridging to
   * identify the Desktop Agent to target.
   */
  desktopAgent?: string;
  /**
   * An optional instance identifier, indicating that this object represents a specific
   * instance of the application described.
   */
  instanceId?: string;
  [property: string]: any;
}

/**
 * A context object with which the action will be performed
 *
 * A context object returned by the transaction, possibly with updated data.
 *
 * The `fdc3.context` type defines the basic contract or "shape" for all data exchanged by
 * FDC3 operations. As such, it is not really meant to be used on its own, but is imported
 * by more specific type definitions (standardized or custom) to provide the structure and
 * properties shared by all FDC3 context data types.
 *
 * The key element of FDC3 context types is their mandatory `type` property, which is used
 * to identify what type of data the object represents, and what shape it has.
 *
 * The FDC3 context type, and all derived types, define the minimum set of fields a context
 * data object of a particular type can be expected to have, but this can always be extended
 * with custom fields as appropriate.
 */
export interface ContextElement {
  /**
   * Context data objects may include a set of equivalent key-value pairs that can be used to
   * help applications identify and look up the context type they receive in their own domain.
   * The idea behind this design is that applications can provide as many equivalent
   * identifiers to a target application as possible, e.g. an instrument may be represented by
   * an ISIN, CUSIP or Bloomberg identifier.
   *
   * Identifiers do not make sense for all types of data, so the `id` property is therefore
   * optional, but some derived types may choose to require at least one identifier.
   * Identifier values SHOULD always be of type string.
   */
  id?: { [key: string]: any };
  /**
   * Context data objects may include a name property that can be used for more information,
   * or display purposes. Some derived types may require the name object as mandatory,
   * depending on use case.
   */
  name?: string;
  /**
   * The type property is the only _required_ part of the FDC3 context data schema. The FDC3
   * [API](https://fdc3.finos.org/docs/api/spec) relies on the `type` property being present
   * to route shared context data appropriately.
   *
   * FDC3 [Intents](https://fdc3.finos.org/docs/intents/spec) also register the context data
   * types they support in an FDC3 [App
   * Directory](https://fdc3.finos.org/docs/app-directory/overview), used for intent discovery
   * and routing.
   *
   * Standardized FDC3 context types have well-known `type` properties prefixed with the
   * `fdc3` namespace, e.g. `fdc3.instrument`. For non-standard types, e.g. those defined and
   * used by a particular organization, the convention is to prefix them with an
   * organization-specific namespace, e.g. `blackrock.fund`.
   *
   * See the [Context Data Specification](https://fdc3.finos.org/docs/context/spec) for more
   * information about context data types.
   */
  type: string;
  [property: string]: any;
}

/**
 * A context type representing details of a Chart, which may be used to request plotting of
 * a particular chart or to otherwise share details of its composition, such as:
 *
 * - A list of instruments for comparison
 * - The time period to plot the chart over
 * - The style of chart (line, bar, mountain, candle etc.)
 * - Other settings such as indicators to calculate, or data representing drawings and
 * annotations.
 *
 * In addition to handling requests to plot charts, a charting application may use this type
 * to output a representation of what it is currently displaying so that it can be recorded
 * by another application.
 */
export interface Chart {
  /**
   * An array of instrument contexts whose data should be plotted.
   */
  instruments: InstrumentElement[];
  /**
   * It is common for charts to support other configuration, such as indicators, annotations
   * etc., which do not have standardized formats, but may be included in the `otherConfig`
   * array as context objects.
   */
  otherConfig?: ContextElement[];
  /**
   * The time range that should be plotted
   */
  range?: TimeRangeObject;
  /**
   * The type of chart that should be plotted
   */
  style?: ChartStyle;
  type: 'fdc3.chart';
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

/**
 * A financial instrument that relates to the definition of this product
 *
 *
 *
 * A financial instrument from any asset class.
 */
export interface InstrumentElement {
  /**
   * @experimental The `classification` map can be used to specify the categorization of the
   * instrument and help achieve interoperability between disparate data sources.
   */
  classification?: OrganizationClassification;
  /**
   * Any combination of instrument identifiers can be used together to resolve ambiguity, or
   * for a better match. Not all applications will use the same instrument identifiers, which
   * is why FDC3 allows for multiple to be specified. In general, the more identifiers an
   * application can provide, the easier it will be to achieve interoperability.
   *
   * It is valid to include extra properties and metadata as part of the instrument payload,
   * but the minimum requirement is for at least one instrument identifier to be provided.
   *
   * Try to only use instrument identifiers as intended. E.g. the `ticker` property is meant
   * for tickers as used by an exchange.
   * If the identifier you want to share is not a ticker or one of the other standardized
   * fields, define a property that makes it clear what the value represents. Doing so will
   * make interpretation easier for the developers of target applications.
   */
  id: PurpleInstrumentIdentifiers;
  /**
   * The `market` map can be used to further specify the instrument and help achieve
   * interoperability between disparate data sources. This is especially useful when using an
   * `id` field that is not globally unique.
   */
  market?: OrganizationMarket;
  /**
   * An optional human-readable name for the instrument
   */
  name?: string;
  type: 'fdc3.instrument';
  [property: string]: any;
}

/**
 * @experimental The `classification` map can be used to specify the categorization of the
 * instrument and help achieve interoperability between disparate data sources.
 */
export interface OrganizationClassification {
  /**
   * classification of the instrument by type or category. SHOULD be one of the following
   * values, although other string values are permitted: '`commodity`', '`commodityIndex`',
   * '`corporateDebt`', '`creditDefaultSwapIndex`', '`deal`', '`debt`', '`debtIndex`',
   * '`etf`', '`fixedIncome`', '`future`', '`governmentBenchmarkDebt`', '`loan`',
   * '`mortgageBackedSecurity`', '`municipalDebt`', '`mutualFund`', '`mutualFundIndex`',
   * '`option`', '`otherDebt`', '`ownershipPrivateCompany`', '`pevcFirm`', '`pevcFund`',
   * '`privateCompany`', '`publicCompany`', '`publicCompanyIndex`', '`sovereignDebt`',
   * '`structuredProduct`', '`unknown`'
   */
  fdc3?: string;
  /**
   * FactSet classification for the instrument.
   */
  FDS_TYPE?: string;
  [property: string]: any;
}

/**
 * Any combination of instrument identifiers can be used together to resolve ambiguity, or
 * for a better match. Not all applications will use the same instrument identifiers, which
 * is why FDC3 allows for multiple to be specified. In general, the more identifiers an
 * application can provide, the easier it will be to achieve interoperability.
 *
 * It is valid to include extra properties and metadata as part of the instrument payload,
 * but the minimum requirement is for at least one instrument identifier to be provided.
 *
 * Try to only use instrument identifiers as intended. E.g. the `ticker` property is meant
 * for tickers as used by an exchange.
 * If the identifier you want to share is not a ticker or one of the other standardized
 * fields, define a property that makes it clear what the value represents. Doing so will
 * make interpretation easier for the developers of target applications.
 */
export interface PurpleInstrumentIdentifiers {
  /**
   * https://www.bloomberg.com/
   */
  BBG?: string;
  /**
   * https://www.cusip.com/
   */
  CUSIP?: string;
  /**
   * https://www.factset.com/
   */
  FDS_ID?: string;
  /**
   * https://www.openfigi.com/
   */
  FIGI?: string;
  /**
   * https://www.isin.org/
   */
  ISIN?: string;
  /**
   * https://permid.org/
   */
  PERMID?: string;
  /**
   * https://www.refinitiv.com/
   */
  RIC?: string;
  /**
   * https://www.lseg.com/sedol
   */
  SEDOL?: string;
  /**
   * Unstandardized stock tickers
   */
  ticker?: string;
  [property: string]: any;
}

/**
 * The `market` map can be used to further specify the instrument and help achieve
 * interoperability between disparate data sources. This is especially useful when using an
 * `id` field that is not globally unique.
 */
export interface OrganizationMarket {
  /**
   * https://www.bloomberg.com/
   */
  BBG?: string;
  /**
   * https://www.iso.org/iso-3166-country-codes.html
   */
  COUNTRY_ISOALPHA2?: string;
  /**
   * https://en.wikipedia.org/wiki/Market_Identifier_Code
   */
  MIC?: string;
  /**
   * Human readable market name
   */
  name?: string;
  [property: string]: any;
}

/**
 * The time range that should be plotted
 *
 * The time range over which the interaction occurred
 *
 * A context representing a period of time. Any user interfaces that represent or visualize
 * events or activity over time can be filtered or focused on a particular time period,
 * e.g.:
 *
 * - A pricing chart
 * - A trade blotter
 * - A record of client contact/activity in a CRM
 *
 * Example use cases:
 *
 * - User may want to view pricing/trades/customer activity for a security over a particular
 * time period, the time range might be specified as the context for the `ViewChart` intent
 * OR it might be embedded in another context (e.g. a context representing a chart to plot).
 * - User filters a visualization (e.g. a pricing chart) to show a particular period, the
 * `TimeRange` is broadcast and other visualizations (e.g. a heatmap of activity by
 * instrument, or industry sector etc.) receive it and filter themselves to show data over
 * the same range.
 *
 * Notes:
 *
 * - A `TimeRange` may be closed (i.e. `startTime` and `endTime` are both known) or open
 * (i.e. only one of `startTime` or `endTime` is known).
 * - Ranges corresponding to dates (e.g. `2022-05-12` to `2022-05-19`) should be specified
 * using times as this prevents issues with timezone conversions and inclusive/exclusive
 * date ranges.
 * - String fields representing times are encoded according to [ISO
 * 8601-1:2019](https://www.iso.org/standard/70907.html).
 * - A timezone indicator should be specified, e.g. `"2022-05-12T15:18:03Z"` or
 * `"2022-05-12T16:18:03+01:00"`
 * - Times MAY be specified with millisecond precision, e.g. `"2022-05-12T15:18:03.349Z"`
 */
export interface TimeRangeObject {
  /**
   * The end time of the range, encoded according to [ISO
   * 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator.
   */
  endTime?: Date;
  /**
   * The start time of the range, encoded according to [ISO
   * 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator.
   */
  startTime?: Date;
  type: 'fdc3.timeRange';
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

/**
 * The type of chart that should be plotted
 */
export type ChartStyle =
  | 'line'
  | 'bar'
  | 'stacked-bar'
  | 'mountain'
  | 'candle'
  | 'pie'
  | 'scatter'
  | 'histogram'
  | 'heatmap'
  | 'custom';

/**
 * A collection of settings to start a new chat conversation
 */
export interface ChatInitSettings {
  /**
   * Name to apply to the chat created
   */
  chatName?: string;
  /**
   * Contacts to add to the chat
   */
  members?: ContactListObject;
  /**
   * An initial message to post in the chat when created.
   */
  message?: MessageObject | string;
  /**
   * Option settings that affect the creation of the chat
   */
  options?: ChatOptions;
  type: 'fdc3.chat.initSettings';
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

/**
 * Contacts to add to the chat
 *
 * A list of contacts involved in the interaction
 *
 * A collection of contacts, e.g. for chatting to or calling multiple contacts.
 *
 * The contact list schema does not explicitly include identifiers in the `id` section, as
 * there is not a common standard for such identifiers. Applications can, however, populate
 * this part of the contract with custom identifiers if so desired.
 */
export interface ContactListObject {
  /**
   * An array of contact contexts that forms the list.
   */
  contacts: ContactElement[];
  /**
   * One or more identifiers that refer to the contact list in an OMS, EMS or related system.
   * Specific key names for systems are expected to be standardized in future.
   */
  id?: { [key: string]: string };
  /**
   * An optional human-readable summary of the contact list
   */
  name?: string;
  type: 'fdc3.contactList';
  [property: string]: any;
}

/**
 * The contact that initiated the interaction
 *
 * A person contact that can be engaged with through email, calling, messaging, CMS, etc.
 */
export interface ContactElement {
  /**
   * Identifiers that relate to the Contact represented by this context
   */
  id: PurpleContactIdentifiers;
  /**
   * An optional human-readable name for the contact
   */
  name?: string;
  type: 'fdc3.contact';
  [property: string]: any;
}

/**
 * Identifiers that relate to the Contact represented by this context
 */
export interface PurpleContactIdentifiers {
  /**
   * The email address for the contact
   */
  email?: string;
  /**
   * FactSet Permanent Identifier representing the contact
   */
  FDS_ID?: string;
  [property: string]: any;
}

/**
 * A chat message to be sent through an instant messaging application. Can contain one or
 * several text bodies (organized by mime-type, plaintext or markdown), as well as attached
 * entities (either arbitrary file attachments or FDC3 actions to be embedded in the
 * message). To be put inside a ChatInitSettings object.
 */
export interface MessageObject {
  /**
   * A map of string IDs to entities that should be attached to the message, such as an action
   * to perform, a file attachment, or other FDC3 context object.
   */
  entities?: { [key: string]: EntityValue };
  /**
   * A map of string mime-type to string content
   */
  text?: PurpleMessageText;
  type: 'fdc3.message';
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

/**
 * A representation of an FDC3 Action (specified via a Context or Context & Intent) that can
 * be inserted inside another object, for example a chat message.
 *
 * The action may be completed by calling:
 * - `fdc3.raiseIntent()` with the specified Intent and Context
 * - `fdc3.raiseIntentForContext()` if only a context is specified, (which the Desktop Agent
 * will resolve by presenting the user with a list of available Intents for the Context).
 * - `channel.broadcast()` with the specified Context, if the `broadcast` action has been
 * defined.
 *
 * Accepts an optional `app` parameter in order to specify a specific app.
 *
 * A File attachment encoded in the form of a data URI. Can be added to a Message.
 */
export interface EntityValue {
  /**
   * The **action** field indicates the type of action:
   * - **raiseIntent** :  If no action or `raiseIntent` is specified, then `fdc3.raiseIntent`
   * or `fdc3.raiseIntentForContext` will be called with the specified context (and intent if
   * given).
   * - **broadcast** : If `broadcast` and a `channelId` are specified then
   * `fdc3.getOrCreateChannel(channelId)` is called to retrieve the channel and broadcast the
   * context to it with `channel.broadcast(context)`. If no `channelId` has been specified,
   * the context should be broadcast to the current channel (`fdc3.broadcast()`)
   */
  action?: ActionType;
  /**
   * An optional target application identifier that should perform the action. The `app`
   * property is ignored unless the action is raiseIntent.
   */
  app?: AppIdentifier;
  /**
   * Optional channel on which to broadcast the context. The `channelId` property is ignored
   * unless the `action` is broadcast.
   */
  channelId?: string;
  /**
   * A context object with which the action will be performed
   */
  context?: ContextElement;
  /**
   * Optional Intent to raise to perform the actions. Should reference an intent type name,
   * such as those defined in the FDC3 Standard. If intent is not set then
   * `fdc3.raiseIntentForContext` should be used to perform the action as this will usually
   * allow the user to choose the intent to raise.
   */
  intent?: string;
  /**
   * A human readable display name for the action
   */
  title?: string;
  type: EntityType;
  id?: { [key: string]: any };
  name?: string;
  data?: EntityData;
  [property: string]: any;
}

export interface EntityData {
  /**
   * A data URI encoding the content of the file to be attached
   */
  dataUri: string;
  /**
   * The name of the attached file
   */
  name: string;
  [property: string]: any;
}

export type EntityType = 'fdc3.action' | 'fdc3.fileAttachment';

/**
 * A map of string mime-type to string content
 */
export interface PurpleMessageText {
  /**
   * Markdown encoded content
   */
  'text/markdown'?: string;
  /**
   * Plain text encoded content.
   */
  'text/plain'?: string;
  [property: string]: any;
}

/**
 * Option settings that affect the creation of the chat
 */
export interface ChatOptions {
  /**
   * if true members will be allowed to add other members to the chat
   */
  allowAddUser?: boolean;
  /**
   * if true members will be allowed to browse past messages
   */
  allowHistoryBrowsing?: boolean;
  /**
   * if true members will be allowed to copy/paste messages
   */
  allowMessageCopy?: boolean;
  /**
   * if false a separate chat will be created for each member
   */
  groupRecipients?: boolean;
  /**
   * if true the room will be visible to everyone in the chat application
   */
  isPublic?: boolean;
  [property: string]: any;
}

/**
 * A context representing a chat message. Typically used to send the message or to
 * pre-populate a message for sending.
 */
export interface ChatMessage {
  chatRoom: ChatRoomObject;
  message: MessageObject;
  type: 'fdc3.chat.message';
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

/**
 * Reference to the chat room which could be used to send a message to the room
 */
export interface ChatRoomObject {
  /**
   * Identifier(s) for the chat - currently unstandardized
   */
  id: { [key: string]: string };
  /**
   * Display name for the chat room
   */
  name?: string;
  /**
   * The name of the service that hosts the chat
   */
  providerName: string;
  type: 'fdc3.chat.room';
  /**
   * Universal url to access to the room. It could be opened from a browser, a mobile app,
   * etc...
   */
  url?: string;
  [property: string]: any;
}

/**
 * Reference to the chat room which could be used to send a message to the room
 */
export interface ChatRoom {
  /**
   * Identifier(s) for the chat - currently unstandardized
   */
  id: { [key: string]: string };
  /**
   * Display name for the chat room
   */
  name?: string;
  /**
   * The name of the service that hosts the chat
   */
  providerName: string;
  type: 'fdc3.chat.room';
  /**
   * Universal url to access to the room. It could be opened from a browser, a mobile app,
   * etc...
   */
  url?: string;
  [property: string]: any;
}

/**
 * A context type that represents a simple search criterion, based on a list of other
 * context objects, that can be used to search or filter messages in a chat application.
 */
export interface ChatSearchCriteria {
  /**
   * An array of criteria that should match chats returned from by a search.
   *
   * ⚠️ Operators (and/or/not) are not defined in `fdc3.chat.searchCriteria`. It is up to the
   * application that processes the FDC3 Intent to choose and apply the operators between the
   * criteria.
   *
   * Empty search criteria can be supported to allow resetting of filters.
   */
  criteria: Array<OrganizationObject | string>;
  type: 'fdc3.chat.searchCriteria';
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

/**
 * A financial instrument that relates to the definition of this product
 *
 *
 *
 * A financial instrument from any asset class.
 *
 * An entity that can be used when referencing private companies and other organizations
 * where a specific instrument is not available or desired e.g. CRM and News workflows.
 *
 * It is valid to include extra properties and metadata as part of the organization payload,
 * but the minimum requirement is for at least one specified identifier to be provided.
 *
 * The contact that initiated the interaction
 *
 * A person contact that can be engaged with through email, calling, messaging, CMS, etc.
 */
export interface OrganizationObject {
  /**
   * @experimental The `classification` map can be used to specify the categorization of the
   * instrument and help achieve interoperability between disparate data sources.
   */
  classification?: OrganizationClassification;
  /**
   * Any combination of instrument identifiers can be used together to resolve ambiguity, or
   * for a better match. Not all applications will use the same instrument identifiers, which
   * is why FDC3 allows for multiple to be specified. In general, the more identifiers an
   * application can provide, the easier it will be to achieve interoperability.
   *
   * It is valid to include extra properties and metadata as part of the instrument payload,
   * but the minimum requirement is for at least one instrument identifier to be provided.
   *
   * Try to only use instrument identifiers as intended. E.g. the `ticker` property is meant
   * for tickers as used by an exchange.
   * If the identifier you want to share is not a ticker or one of the other standardized
   * fields, define a property that makes it clear what the value represents. Doing so will
   * make interpretation easier for the developers of target applications.
   *
   * Identifiers for the organization, at least one must be provided.
   *
   * Identifiers that relate to the Contact represented by this context
   */
  id: Identifiers;
  /**
   * The `market` map can be used to further specify the instrument and help achieve
   * interoperability between disparate data sources. This is especially useful when using an
   * `id` field that is not globally unique.
   */
  market?: OrganizationMarket;
  /**
   * An optional human-readable name for the instrument
   *
   * An optional human-readable name of the organization
   *
   * An optional human-readable name for the contact
   */
  name?: string;
  type: TentacledAppID;
  [property: string]: any;
}

/**
 * Any combination of instrument identifiers can be used together to resolve ambiguity, or
 * for a better match. Not all applications will use the same instrument identifiers, which
 * is why FDC3 allows for multiple to be specified. In general, the more identifiers an
 * application can provide, the easier it will be to achieve interoperability.
 *
 * It is valid to include extra properties and metadata as part of the instrument payload,
 * but the minimum requirement is for at least one instrument identifier to be provided.
 *
 * Try to only use instrument identifiers as intended. E.g. the `ticker` property is meant
 * for tickers as used by an exchange.
 * If the identifier you want to share is not a ticker or one of the other standardized
 * fields, define a property that makes it clear what the value represents. Doing so will
 * make interpretation easier for the developers of target applications.
 *
 * Identifiers for the organization, at least one must be provided.
 *
 * Identifiers that relate to the Contact represented by this context
 */
export interface Identifiers {
  /**
   * https://www.bloomberg.com/
   */
  BBG?: string;
  /**
   * https://www.cusip.com/
   */
  CUSIP?: string;
  /**
   * https://www.factset.com/
   *
   * FactSet Permanent Identifier representing the organization
   *
   * FactSet Permanent Identifier representing the contact
   */
  FDS_ID?: string;
  /**
   * https://www.openfigi.com/
   */
  FIGI?: string;
  /**
   * https://www.isin.org/
   */
  ISIN?: string;
  /**
   * https://permid.org/
   *
   * Refinitiv Permanent Identifiers, or PermID for the organization
   */
  PERMID?: string;
  /**
   * https://www.refinitiv.com/
   */
  RIC?: string;
  /**
   * https://www.lseg.com/sedol
   */
  SEDOL?: string;
  /**
   * Unstandardized stock tickers
   */
  ticker?: string;
  /**
   * The Legal Entity Identifier (LEI) is a 20-character, alpha-numeric code based on the ISO
   * 17442 standard developed by the International Organization for Standardization (ISO). It
   * connects to key reference information that enables clear and unique identification of
   * legal entities participating in financial transactions.
   */
  LEI?: string;
  /**
   * The email address for the contact
   */
  email?: string;
  [property: string]: any;
}

export type TentacledAppID = 'fdc3.instrument' | 'fdc3.organization' | 'fdc3.contact';

/**
 * A person contact that can be engaged with through email, calling, messaging, CMS, etc.
 */
export interface Contact {
  /**
   * Identifiers that relate to the Contact represented by this context
   */
  id: FluffyContactIdentifiers;
  /**
   * An optional human-readable name for the contact
   */
  name?: string;
  type: 'fdc3.contact';
  [property: string]: any;
}

/**
 * Identifiers that relate to the Contact represented by this context
 */
export interface FluffyContactIdentifiers {
  /**
   * The email address for the contact
   */
  email?: string;
  /**
   * FactSet Permanent Identifier representing the contact
   */
  FDS_ID?: string;
  [property: string]: any;
}

/**
 * A collection of contacts, e.g. for chatting to or calling multiple contacts.
 *
 * The contact list schema does not explicitly include identifiers in the `id` section, as
 * there is not a common standard for such identifiers. Applications can, however, populate
 * this part of the contract with custom identifiers if so desired.
 */
export interface ContactList {
  /**
   * An array of contact contexts that forms the list.
   */
  contacts: ContactElement[];
  /**
   * One or more identifiers that refer to the contact list in an OMS, EMS or related system.
   * Specific key names for systems are expected to be standardized in future.
   */
  id?: { [key: string]: string };
  /**
   * An optional human-readable summary of the contact list
   */
  name?: string;
  type: 'fdc3.contactList';
  [property: string]: any;
}

/**
 * The `fdc3.context` type defines the basic contract or "shape" for all data exchanged by
 * FDC3 operations. As such, it is not really meant to be used on its own, but is imported
 * by more specific type definitions (standardized or custom) to provide the structure and
 * properties shared by all FDC3 context data types.
 *
 * The key element of FDC3 context types is their mandatory `type` property, which is used
 * to identify what type of data the object represents, and what shape it has.
 *
 * The FDC3 context type, and all derived types, define the minimum set of fields a context
 * data object of a particular type can be expected to have, but this can always be extended
 * with custom fields as appropriate.
 */
export interface Context {
  /**
   * Context data objects may include a set of equivalent key-value pairs that can be used to
   * help applications identify and look up the context type they receive in their own domain.
   * The idea behind this design is that applications can provide as many equivalent
   * identifiers to a target application as possible, e.g. an instrument may be represented by
   * an ISIN, CUSIP or Bloomberg identifier.
   *
   * Identifiers do not make sense for all types of data, so the `id` property is therefore
   * optional, but some derived types may choose to require at least one identifier.
   * Identifier values SHOULD always be of type string.
   */
  id?: { [key: string]: any };
  /**
   * Context data objects may include a name property that can be used for more information,
   * or display purposes. Some derived types may require the name object as mandatory,
   * depending on use case.
   */
  name?: string;
  /**
   * The type property is the only _required_ part of the FDC3 context data schema. The FDC3
   * [API](https://fdc3.finos.org/docs/api/spec) relies on the `type` property being present
   * to route shared context data appropriately.
   *
   * FDC3 [Intents](https://fdc3.finos.org/docs/intents/spec) also register the context data
   * types they support in an FDC3 [App
   * Directory](https://fdc3.finos.org/docs/app-directory/overview), used for intent discovery
   * and routing.
   *
   * Standardized FDC3 context types have well-known `type` properties prefixed with the
   * `fdc3` namespace, e.g. `fdc3.instrument`. For non-standard types, e.g. those defined and
   * used by a particular organization, the convention is to prefix them with an
   * organization-specific namespace, e.g. `blackrock.fund`.
   *
   * See the [Context Data Specification](https://fdc3.finos.org/docs/context/spec) for more
   * information about context data types.
   */
  type: string;
  [property: string]: any;
}

/**
 * A country entity.
 *
 * Notes:
 *
 * - It is valid to include extra properties and metadata as part of the country payload,
 * but the minimum requirement is for at least one standardized identifier to be provided
 *
 * - `COUNTRY_ISOALPHA2` SHOULD be preferred.
 *
 * - Try to only use country identifiers as intended and specified in the [ISO
 * standard](https://en.wikipedia.org/wiki/ISO_3166-1). E.g. the `COUNTRY_ISOALPHA2`
 * property must be a recognized value and not a proprietary two-letter code. If the
 * identifier you want to share is not a standardized and recognized one, rather define a
 * property that makes it clear what value it is. This makes it easier for target
 * applications.
 */
export interface Country {
  id: CountryID;
  /**
   * An optional human-readable name for the country
   */
  name?: string;
  type: 'fdc3.country';
  [property: string]: any;
}

export interface CountryID {
  /**
   * Two-letter ISO country code
   */
  COUNTRY_ISOALPHA2?: string;
  /**
   * Three-letter ISO country code
   */
  COUNTRY_ISOALPHA3?: string;
  /**
   * Two-letter ISO country code. Deprecated in FDC3 2.0 in favour of the version prefixed
   * with `COUNTRY_`.
   */
  ISOALPHA2?: string;
  /**
   * Three-letter ISO country code. Deprecated in FDC3 2.0 in favour of the version prefixed
   * with `COUNTRY_`.
   */
  ISOALPHA3?: string;
  [property: string]: any;
}

/**
 * A context representing an individual Currency.
 */
export interface Currency {
  id: CurrencyID;
  /**
   * The name of the currency for display purposes
   */
  name?: string;
  type: 'fdc3.currency';
  [property: string]: any;
}

export interface CurrencyID {
  /**
   * The `CURRENCY_ISOCODE` should conform to 3 character alphabetic codes defined in [ISO
   * 4217](https://www.iso.org/iso-4217-currency-codes.html)
   */
  CURRENCY_ISOCODE?: string;
  [property: string]: any;
}

/**
 * A collection of information to be used to initiate an email with a Contact or ContactList.
 */
export interface Email {
  /**
   * One or more recipients for the email.
   */
  recipients: EmailRecipients;
  /**
   * Subject line for the email.
   */
  subject?: string;
  /**
   * Body content for the email.
   */
  textBody?: string;
  type: 'fdc3.email';
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

/**
 * One or more recipients for the email.
 *
 * The contact that initiated the interaction
 *
 * A person contact that can be engaged with through email, calling, messaging, CMS, etc.
 *
 * Contacts to add to the chat
 *
 * A list of contacts involved in the interaction
 *
 * A collection of contacts, e.g. for chatting to or calling multiple contacts.
 *
 * The contact list schema does not explicitly include identifiers in the `id` section, as
 * there is not a common standard for such identifiers. Applications can, however, populate
 * this part of the contract with custom identifiers if so desired.
 */
export interface EmailRecipients {
  /**
   * Identifiers that relate to the Contact represented by this context
   *
   * One or more identifiers that refer to the contact list in an OMS, EMS or related system.
   * Specific key names for systems are expected to be standardized in future.
   */
  id?: ContactTIdentifiers;
  /**
   * An optional human-readable name for the contact
   *
   * An optional human-readable summary of the contact list
   */
  name?: string;
  type: EmailRecipientsType;
  /**
   * An array of contact contexts that forms the list.
   */
  contacts?: ContactElement[];
  [property: string]: any;
}

/**
 * Identifiers that relate to the Contact represented by this context
 *
 * One or more identifiers that refer to the contact list in an OMS, EMS or related system.
 * Specific key names for systems are expected to be standardized in future.
 */
export interface ContactTIdentifiers {
  /**
   * The email address for the contact
   */
  email?: string;
  /**
   * FactSet Permanent Identifier representing the contact
   */
  FDS_ID?: string;
  [property: string]: any;
}

export type EmailRecipientsType = 'fdc3.contact' | 'fdc3.contactList';

/**
 * A File attachment encoded in the form of a data URI. Can be added to a Message.
 */
export interface FileAttachment {
  data: FileAttachmentData;
  type: 'fdc3.fileAttachment';
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

export interface FileAttachmentData {
  /**
   * A data URI encoding the content of the file to be attached
   */
  dataUri: string;
  /**
   * The name of the attached file
   */
  name: string;
  [property: string]: any;
}

/**
 * A financial instrument from any asset class.
 */
export interface Instrument {
  /**
   * @experimental The `classification` map can be used to specify the categorization of the
   * instrument and help achieve interoperability between disparate data sources.
   */
  classification?: PurpleInstrumentClassification;
  /**
   * Any combination of instrument identifiers can be used together to resolve ambiguity, or
   * for a better match. Not all applications will use the same instrument identifiers, which
   * is why FDC3 allows for multiple to be specified. In general, the more identifiers an
   * application can provide, the easier it will be to achieve interoperability.
   *
   * It is valid to include extra properties and metadata as part of the instrument payload,
   * but the minimum requirement is for at least one instrument identifier to be provided.
   *
   * Try to only use instrument identifiers as intended. E.g. the `ticker` property is meant
   * for tickers as used by an exchange.
   * If the identifier you want to share is not a ticker or one of the other standardized
   * fields, define a property that makes it clear what the value represents. Doing so will
   * make interpretation easier for the developers of target applications.
   */
  id: FluffyInstrumentIdentifiers;
  /**
   * The `market` map can be used to further specify the instrument and help achieve
   * interoperability between disparate data sources. This is especially useful when using an
   * `id` field that is not globally unique.
   */
  market?: PurpleMarket;
  /**
   * An optional human-readable name for the instrument
   */
  name?: string;
  type: 'fdc3.instrument';
  [property: string]: any;
}

/**
 * @experimental The `classification` map can be used to specify the categorization of the
 * instrument and help achieve interoperability between disparate data sources.
 */
export interface PurpleInstrumentClassification {
  /**
   * classification of the instrument by type or category. SHOULD be one of the following
   * values, although other string values are permitted: '`commodity`', '`commodityIndex`',
   * '`corporateDebt`', '`creditDefaultSwapIndex`', '`deal`', '`debt`', '`debtIndex`',
   * '`etf`', '`fixedIncome`', '`future`', '`governmentBenchmarkDebt`', '`loan`',
   * '`mortgageBackedSecurity`', '`municipalDebt`', '`mutualFund`', '`mutualFundIndex`',
   * '`option`', '`otherDebt`', '`ownershipPrivateCompany`', '`pevcFirm`', '`pevcFund`',
   * '`privateCompany`', '`publicCompany`', '`publicCompanyIndex`', '`sovereignDebt`',
   * '`structuredProduct`', '`unknown`'
   */
  fdc3?: string;
  /**
   * FactSet classification for the instrument.
   */
  FDS_TYPE?: string;
  [property: string]: any;
}

/**
 * Any combination of instrument identifiers can be used together to resolve ambiguity, or
 * for a better match. Not all applications will use the same instrument identifiers, which
 * is why FDC3 allows for multiple to be specified. In general, the more identifiers an
 * application can provide, the easier it will be to achieve interoperability.
 *
 * It is valid to include extra properties and metadata as part of the instrument payload,
 * but the minimum requirement is for at least one instrument identifier to be provided.
 *
 * Try to only use instrument identifiers as intended. E.g. the `ticker` property is meant
 * for tickers as used by an exchange.
 * If the identifier you want to share is not a ticker or one of the other standardized
 * fields, define a property that makes it clear what the value represents. Doing so will
 * make interpretation easier for the developers of target applications.
 */
export interface FluffyInstrumentIdentifiers {
  /**
   * https://www.bloomberg.com/
   */
  BBG?: string;
  /**
   * https://www.cusip.com/
   */
  CUSIP?: string;
  /**
   * https://www.factset.com/
   */
  FDS_ID?: string;
  /**
   * https://www.openfigi.com/
   */
  FIGI?: string;
  /**
   * https://www.isin.org/
   */
  ISIN?: string;
  /**
   * https://permid.org/
   */
  PERMID?: string;
  /**
   * https://www.refinitiv.com/
   */
  RIC?: string;
  /**
   * https://www.lseg.com/sedol
   */
  SEDOL?: string;
  /**
   * Unstandardized stock tickers
   */
  ticker?: string;
  [property: string]: any;
}

/**
 * The `market` map can be used to further specify the instrument and help achieve
 * interoperability between disparate data sources. This is especially useful when using an
 * `id` field that is not globally unique.
 */
export interface PurpleMarket {
  /**
   * https://www.bloomberg.com/
   */
  BBG?: string;
  /**
   * https://www.iso.org/iso-3166-country-codes.html
   */
  COUNTRY_ISOALPHA2?: string;
  /**
   * https://en.wikipedia.org/wiki/Market_Identifier_Code
   */
  MIC?: string;
  /**
   * Human readable market name
   */
  name?: string;
  [property: string]: any;
}

/**
 * A collection of instruments. Use this type for use cases that require not just a single
 * instrument, but multiple (e.g. to populate a watchlist). However, when holding
 * information for each instrument is required, it is recommended to use the
 * [Portfolio](Portfolio) type.
 *
 * The instrument list schema does not explicitly include identifiers in the `id` section,
 * as there is not a common standard for such identifiers. Applications can, however,
 * populate this part of the contract with custom identifiers if so desired.
 */
export interface InstrumentList {
  /**
   * One or more identifiers that refer to the instrument list in an OMS, EMS or related
   * system. Specific key names for systems are expected to be standardized in future.
   */
  id?: { [key: string]: string };
  /**
   * An array of instrument contexts that forms the list.
   */
  instruments: InstrumentElement[];
  /**
   * An optional human-readable summary of the instrument list
   */
  name?: string;
  type: 'fdc3.instrumentList';
  [property: string]: any;
}

/**
 * An `Interaction` is a significant direct exchange of ideas or information between a
 * number of participants, e.g. a Sell Side party and one or more Buy Side parties. An
 * `Interaction` might be a call, a meeting (physical or virtual), an IM or the preparation
 * of some specialist data, such as financial data for a given company or sector.
 */
export interface Interaction {
  /**
   * A human-readable description of the interaction
   */
  description: string;
  /**
   * Can be used by a target application to pass an identifier back to the originating
   * application after an interaction record has been created, updated or deleted. An
   * interaction ID does not need to be populated by the originating application, however the
   * target application could store it for future reference and SHOULD return it in a
   * `TransactionResult`.
   */
  id?: InteractionID;
  /**
   * The contact that initiated the interaction
   */
  initiator?: ContactElement;
  /**
   * `interactionType` SHOULD be one of `'Instant Message'`, `'Email'`, `'Call'`, or
   * `'Meeting'` although other string values are permitted.
   */
  interactionType: string;
  /**
   * Used to represent the application or service that the interaction was created from to aid
   * in tracing the source of an interaction.
   */
  origin?: string;
  /**
   * A list of contacts involved in the interaction
   */
  participants: ContactListObject;
  /**
   * The time range over which the interaction occurred
   */
  timeRange: TimeRangeObject;
  type: 'fdc3.interaction';
  name?: string;
  [property: string]: any;
}

/**
 * Can be used by a target application to pass an identifier back to the originating
 * application after an interaction record has been created, updated or deleted. An
 * interaction ID does not need to be populated by the originating application, however the
 * target application could store it for future reference and SHOULD return it in a
 * `TransactionResult`.
 */
export interface InteractionID {
  /**
   * Interactions ID in Salesforce
   */
  SALESFORCE?: string;
  /**
   * Interaction ID in SingleTrack
   */
  SINGLETRACK?: string;
  /**
   * Can be used by a target application to pass a record's link back to the originating
   * application. This offers the originating application a way to open the record for a user
   * to view.
   */
  URI?: string;
  [property: string]: any;
}

/**
 * A chat message to be sent through an instant messaging application. Can contain one or
 * several text bodies (organized by mime-type, plaintext or markdown), as well as attached
 * entities (either arbitrary file attachments or FDC3 actions to be embedded in the
 * message). To be put inside a ChatInitSettings object.
 */
export interface Message {
  /**
   * A map of string IDs to entities that should be attached to the message, such as an action
   * to perform, a file attachment, or other FDC3 context object.
   */
  entities?: { [key: string]: EntityValue };
  /**
   * A map of string mime-type to string content
   */
  text?: FluffyMessageText;
  type: 'fdc3.message';
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

/**
 * A map of string mime-type to string content
 */
export interface FluffyMessageText {
  /**
   * Markdown encoded content
   */
  'text/markdown'?: string;
  /**
   * Plain text encoded content.
   */
  'text/plain'?: string;
  [property: string]: any;
}

/**
 * A type that explicitly represents a lack of context.
 *
 * Notes:
 *
 * - Intended to be used in situations where no context is desired.
 * - For example:
 * - Raising an intent without context (e.g. opening a blank order form, or chat interface
 * without a contact selected).
 * - Resetting context on a channel (e.g. when context is used to set a filter in other
 * applications a null context might release the filter).
 * - An explicit representation of a Null or empty context allows apps to declare support
 * for a lack of context, for example in their intent metadata in an app directory.
 */
export interface Nothing {
  type: 'fdc3.nothing';
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
  details?: PurpleOrderDetails;
  /**
   * One or more identifiers that refer to the order in an OMS, EMS or related system.
   * Specific key names for systems are expected to be standardized in future.
   */
  id: { [key: string]: string };
  /**
   * An optional human-readable summary of the order.
   */
  name?: string;
  /**
   * Additional notes or comments about the order.
   */
  notes?: string;
  type: 'fdc3.order';
  [property: string]: any;
}

/**
 * Optional additional details about the order, which may include a product element that is
 * an, as yet undefined but extensible, Context
 */
export interface PurpleOrderDetails {
  product?: ProductObject;
  [property: string]: any;
}

/**
 * A product that is the subject of the trade.
 *
 * @experimental context type representing a tradable product. To be used with OMS and EMS
 * systems.
 *
 * This type is currently only loosely defined as an extensible context object, with an
 * optional instrument field.
 *
 * The Product schema does not explicitly include identifiers in the id section, as there is
 * not a common standard for such identifiers. Applications can, however, populate this part
 * of the contract with custom identifiers if so desired.
 */
export interface ProductObject {
  /**
   * One or more identifiers that refer to the product. Specific key names for systems are
   * expected to be standardized in future.
   */
  id: { [key: string]: string };
  /**
   * A financial instrument that relates to the definition of this product
   */
  instrument?: InstrumentElement;
  /**
   * A human-readable summary of the product.
   */
  name?: string;
  /**
   * Additional notes or comments about the product.
   */
  notes?: string;
  type: 'fdc3.product';
  [property: string]: any;
}

/**
 * @experimental A list of orders. Use this type for use cases that require not just a
 * single order, but multiple.
 *
 * The OrderList schema does not explicitly include identifiers in the id section, as there
 * is not a common standard for such identifiers. Applications can, however, populate this
 * part of the contract with custom identifiers if so desired.
 */
export interface OrderList {
  /**
   * One or more identifiers that refer to the order list in an OMS, EMS or related system.
   * Specific key names for systems are expected to be standardized in future.
   */
  id?: { [key: string]: string };
  /**
   * An optional human-readable summary of the order list
   */
  name?: string;
  /**
   * An array of order contexts that forms the list.
   */
  orders: OrderElement[];
  type: 'fdc3.orderList';
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
export interface OrderElement {
  /**
   * Optional additional details about the order, which may include a product element that is
   * an, as yet undefined but extensible, Context
   */
  details?: FluffyOrderDetails;
  /**
   * One or more identifiers that refer to the order in an OMS, EMS or related system.
   * Specific key names for systems are expected to be standardized in future.
   */
  id: { [key: string]: string };
  /**
   * An optional human-readable summary of the order.
   */
  name?: string;
  /**
   * Additional notes or comments about the order.
   */
  notes?: string;
  type: 'fdc3.order';
  [property: string]: any;
}

/**
 * Optional additional details about the order, which may include a product element that is
 * an, as yet undefined but extensible, Context
 */
export interface FluffyOrderDetails {
  product?: ProductObject;
  [property: string]: any;
}

/**
 * An entity that can be used when referencing private companies and other organizations
 * where a specific instrument is not available or desired e.g. CRM and News workflows.
 *
 * It is valid to include extra properties and metadata as part of the organization payload,
 * but the minimum requirement is for at least one specified identifier to be provided.
 */
export interface Organization {
  /**
   * Identifiers for the organization, at least one must be provided.
   */
  id: OrganizationIdentifiers;
  /**
   * An optional human-readable name of the organization
   */
  name?: string;
  type: 'fdc3.organization';
  [property: string]: any;
}

/**
 * Identifiers for the organization, at least one must be provided.
 */
export interface OrganizationIdentifiers {
  /**
   * FactSet Permanent Identifier representing the organization
   */
  FDS_ID?: string;
  /**
   * The Legal Entity Identifier (LEI) is a 20-character, alpha-numeric code based on the ISO
   * 17442 standard developed by the International Organization for Standardization (ISO). It
   * connects to key reference information that enables clear and unique identification of
   * legal entities participating in financial transactions.
   */
  LEI?: string;
  /**
   * Refinitiv Permanent Identifiers, or PermID for the organization
   */
  PERMID?: string;
  [property: string]: any;
}

/**
 * A financial portfolio made up of multiple positions (holdings) in several instruments.
 * Contrast this with e.g. the [InstrumentList](InstrumentList) type, which is just a list
 * of instruments.
 *
 * This is a good example of how types can be composed and extended with extra properties to
 * define more complex types.
 *
 * The Portfolio type consists of an array of [Position](Position) types, each of which
 * refers to a single [Instrument](Instrument) and a holding amount for that instrument.
 *
 * The portfolio schema does not explicitly include identifiers in the `id` section, as
 * there bis not a common standard for such identifiers. Applications can, however, populate
 * this part of the contract with custom identifiers if so desired.
 */
export interface Portfolio {
  /**
   * One or more identifiers that refer to the portfolio in an OMS, EMS or related system.
   * Specific key names for systems are expected to be standardized in future.
   */
  id?: { [key: string]: string };
  /**
   * An optional human-readable name for the portfolio
   */
  name?: string;
  /**
   * The List of Positions which make up the Portfolio
   */
  positions: PositionElement[];
  type: 'fdc3.portfolio';
  [property: string]: any;
}

/**
 * A financial position made up of an instrument and a holding in that instrument. This type
 * is a good example of how new context types can be composed from existing types.
 *
 * In this case, the instrument and the holding amount for that instrument are required
 * values.
 *
 * The [Position](Position) type goes hand-in-hand with the [Portfolio](Portfolio) type,
 * which represents multiple holdings in a combination of instruments.
 *
 * The position schema does not explicitly include identifiers in the `id` section, as there
 * is not a common standard for such identifiers. Applications can, however, populate this
 * part of the contract with custom identifiers if so desired.
 */
export interface PositionElement {
  /**
   * The amount of the holding, e.g. a number of shares
   */
  holding: number;
  /**
   * One or more identifiers that refer to the position in an OMS, EMS or related system.
   * Specific key names for systems are expected to be standardized in future.
   */
  id?: { [key: string]: string };
  instrument: InstrumentElement;
  /**
   * An optional human-readable name for the position
   */
  name?: string;
  type: 'fdc3.position';
  [property: string]: any;
}

/**
 * A financial position made up of an instrument and a holding in that instrument. This type
 * is a good example of how new context types can be composed from existing types.
 *
 * In this case, the instrument and the holding amount for that instrument are required
 * values.
 *
 * The [Position](Position) type goes hand-in-hand with the [Portfolio](Portfolio) type,
 * which represents multiple holdings in a combination of instruments.
 *
 * The position schema does not explicitly include identifiers in the `id` section, as there
 * is not a common standard for such identifiers. Applications can, however, populate this
 * part of the contract with custom identifiers if so desired.
 */
export interface Position {
  /**
   * The amount of the holding, e.g. a number of shares
   */
  holding: number;
  /**
   * One or more identifiers that refer to the position in an OMS, EMS or related system.
   * Specific key names for systems are expected to be standardized in future.
   */
  id?: { [key: string]: string };
  instrument: InstrumentElement;
  /**
   * An optional human-readable name for the position
   */
  name?: string;
  type: 'fdc3.position';
  [property: string]: any;
}

/**
 * @experimental context type representing a tradable product. To be used with OMS and EMS
 * systems.
 *
 * This type is currently only loosely defined as an extensible context object, with an
 * optional instrument field.
 *
 * The Product schema does not explicitly include identifiers in the id section, as there is
 * not a common standard for such identifiers. Applications can, however, populate this part
 * of the contract with custom identifiers if so desired.
 */
export interface Product {
  /**
   * One or more identifiers that refer to the product. Specific key names for systems are
   * expected to be standardized in future.
   */
  id: { [key: string]: string };
  /**
   * A financial instrument that relates to the definition of this product
   */
  instrument?: InstrumentElement;
  /**
   * A human-readable summary of the product.
   */
  name?: string;
  /**
   * Additional notes or comments about the product.
   */
  notes?: string;
  type: 'fdc3.product';
  [property: string]: any;
}

/**
 * A context representing a period of time. Any user interfaces that represent or visualize
 * events or activity over time can be filtered or focused on a particular time period,
 * e.g.:
 *
 * - A pricing chart
 * - A trade blotter
 * - A record of client contact/activity in a CRM
 *
 * Example use cases:
 *
 * - User may want to view pricing/trades/customer activity for a security over a particular
 * time period, the time range might be specified as the context for the `ViewChart` intent
 * OR it might be embedded in another context (e.g. a context representing a chart to plot).
 * - User filters a visualization (e.g. a pricing chart) to show a particular period, the
 * `TimeRange` is broadcast and other visualizations (e.g. a heatmap of activity by
 * instrument, or industry sector etc.) receive it and filter themselves to show data over
 * the same range.
 *
 * Notes:
 *
 * - A `TimeRange` may be closed (i.e. `startTime` and `endTime` are both known) or open
 * (i.e. only one of `startTime` or `endTime` is known).
 * - Ranges corresponding to dates (e.g. `2022-05-12` to `2022-05-19`) should be specified
 * using times as this prevents issues with timezone conversions and inclusive/exclusive
 * date ranges.
 * - String fields representing times are encoded according to [ISO
 * 8601-1:2019](https://www.iso.org/standard/70907.html).
 * - A timezone indicator should be specified, e.g. `"2022-05-12T15:18:03Z"` or
 * `"2022-05-12T16:18:03+01:00"`
 * - Times MAY be specified with millisecond precision, e.g. `"2022-05-12T15:18:03.349Z"`
 */
export interface TimeRange {
  /**
   * The end time of the range, encoded according to [ISO
   * 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator.
   */
  endTime?: Date;
  /**
   * The start time of the range, encoded according to [ISO
   * 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator.
   */
  startTime?: Date;
  type: 'fdc3.timeRange';
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
 *
 * The Trade schema does not explicitly include identifiers in the id section, as there is
 * not a common standard for such identifiers. Applications can, however, populate this part
 * of the contract with custom identifiers if so desired.
 */
export interface Trade {
  /**
   * One or more identifiers that refer to the trade in an OMS, EMS or related system.
   * Specific key names for systems are expected to be standardized in future.
   */
  id: { [key: string]: string };
  /**
   * A human-readable summary of the trade.
   */
  name?: string;
  /**
   * Additional notes or comments about the trade.
   */
  notes?: string;
  /**
   * A product that is the subject of the trade.
   */
  product: ProductObject;
  type: 'fdc3.trade';
  [property: string]: any;
}

/**
 * @experimental A list of trades. Use this type for use cases that require not just a
 * single trade, but multiple.
 *
 * The TradeList schema does not explicitly include identifiers in the id section, as there
 * is not a common standard for such identifiers. Applications can, however, populate this
 * part of the contract with custom identifiers if so desired.
 */
export interface TradeList {
  /**
   * One or more identifiers that refer to the trade list in an OMS, EMS or related system.
   * Specific key names for systems are expected to be standardized in future.
   */
  id?: { [key: string]: string };
  /**
   * An optional human-readable name for the trade list
   */
  name?: string;
  /**
   * An array of trade contexts that forms the list.
   */
  trades: TradeElement[];
  type: 'fdc3.tradeList';
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
 *
 * The Trade schema does not explicitly include identifiers in the id section, as there is
 * not a common standard for such identifiers. Applications can, however, populate this part
 * of the contract with custom identifiers if so desired.
 */
export interface TradeElement {
  /**
   * One or more identifiers that refer to the trade in an OMS, EMS or related system.
   * Specific key names for systems are expected to be standardized in future.
   */
  id: { [key: string]: string };
  /**
   * A human-readable summary of the trade.
   */
  name?: string;
  /**
   * Additional notes or comments about the trade.
   */
  notes?: string;
  /**
   * A product that is the subject of the trade.
   */
  product: ProductObject;
  type: 'fdc3.trade';
  [property: string]: any;
}

/**
 * A context type representing the result of a transaction initiated via FDC3, which SHOULD
 * be returned as an `IntentResult` by intents that create, retrieve, update or delete
 * content or records in another application. Its purpose is to provide a status and message
 * (where needed) for the transaction and MAY wrap a returned context object.
 */
export interface TransactionResult {
  /**
   * A context object returned by the transaction, possibly with updated data.
   */
  context?: ContextElement;
  /**
   * A human readable message describing the outcome of the transaction.
   */
  message?: string;
  /**
   * The status of the transaction being reported.
   */
  status: TransactionStatus;
  type: 'fdc3.transactionResult';
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

/**
 * The status of the transaction being reported.
 */
export type TransactionStatus = 'Created' | 'Deleted' | 'Updated' | 'Failed';

/**
 * A context type representing the price and value of a holding.
 */
export interface Valuation {
  /**
   * The valuation currency, which should conform to 3 character alphabetic codes defined in
   * [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html)
   */
  CURRENCY_ISOCODE: string;
  /**
   * The time at which this valuation expires, encoded according to [ISO
   * 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator included.
   */
  expiryTime?: Date;
  /**
   * The price per unit the the valuation is based on.
   */
  price?: number;
  type: 'fdc3.valuation';
  /**
   * The time at which the valuation was performed, encoded according to [ISO
   * 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator included.
   */
  valuationTime?: Date;
  /**
   * The value of the holding, expresses in the nominated currency.
   */
  value: number;
  id?: { [key: string]: any };
  name?: string;
  [property: string]: any;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toAction(json: string): Action {
    return cast(JSON.parse(json), r('Action'));
  }

  public static actionToJson(value: Action): string {
    return JSON.stringify(uncast(value, r('Action')), null, 2);
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

  public static toChatMessage(json: string): ChatMessage {
    return cast(JSON.parse(json), r('ChatMessage'));
  }

  public static chatMessageToJson(value: ChatMessage): string {
    return JSON.stringify(uncast(value, r('ChatMessage')), null, 2);
  }

  public static toChatRoom(json: string): ChatRoom {
    return cast(JSON.parse(json), r('ChatRoom'));
  }

  public static chatRoomToJson(value: ChatRoom): string {
    return JSON.stringify(uncast(value, r('ChatRoom')), null, 2);
  }

  public static toChatSearchCriteria(json: string): ChatSearchCriteria {
    return cast(JSON.parse(json), r('ChatSearchCriteria'));
  }

  public static chatSearchCriteriaToJson(value: ChatSearchCriteria): string {
    return JSON.stringify(uncast(value, r('ChatSearchCriteria')), null, 2);
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

  public static toFileAttachment(json: string): FileAttachment {
    return cast(JSON.parse(json), r('FileAttachment'));
  }

  public static fileAttachmentToJson(value: FileAttachment): string {
    return JSON.stringify(uncast(value, r('FileAttachment')), null, 2);
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

  public static toInteraction(json: string): Interaction {
    return cast(JSON.parse(json), r('Interaction'));
  }

  public static interactionToJson(value: Interaction): string {
    return JSON.stringify(uncast(value, r('Interaction')), null, 2);
  }

  public static toMessage(json: string): Message {
    return cast(JSON.parse(json), r('Message'));
  }

  public static messageToJson(value: Message): string {
    return JSON.stringify(uncast(value, r('Message')), null, 2);
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

  public static toOrderList(json: string): OrderList {
    return cast(JSON.parse(json), r('OrderList'));
  }

  public static orderListToJson(value: OrderList): string {
    return JSON.stringify(uncast(value, r('OrderList')), null, 2);
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

  public static toTradeList(json: string): TradeList {
    return cast(JSON.parse(json), r('TradeList'));
  }

  public static tradeListToJson(value: TradeList): string {
    return JSON.stringify(uncast(value, r('TradeList')), null, 2);
  }

  public static toTransactionResult(json: string): TransactionResult {
    return cast(JSON.parse(json), r('TransactionResult'));
  }

  public static transactionResultToJson(value: TransactionResult): string {
    return JSON.stringify(uncast(value, r('TransactionResult')), null, 2);
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
  Action: o(
    [
      { json: 'action', js: 'action', typ: u(undefined, r('ActionType')) },
      { json: 'app', js: 'app', typ: u(undefined, r('AppIdentifier')) },
      { json: 'channelId', js: 'channelId', typ: u(undefined, '') },
      { json: 'context', js: 'context', typ: r('ContextElement') },
      { json: 'intent', js: 'intent', typ: u(undefined, '') },
      { json: 'title', js: 'title', typ: '' },
      { json: 'type', js: 'type', typ: r('ActionTypeEnum') },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  AppIdentifier: o(
    [
      { json: 'appId', js: 'appId', typ: '' },
      { json: 'desktopAgent', js: 'desktopAgent', typ: u(undefined, '') },
      { json: 'instanceId', js: 'instanceId', typ: u(undefined, '') },
    ],
    'any'
  ),
  ContextElement: o(
    [
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: '' },
    ],
    'any'
  ),
  Chart: o(
    [
      { json: 'instruments', js: 'instruments', typ: a(r('InstrumentElement')) },
      { json: 'otherConfig', js: 'otherConfig', typ: u(undefined, a(r('ContextElement'))) },
      { json: 'range', js: 'range', typ: u(undefined, r('TimeRangeObject')) },
      { json: 'style', js: 'style', typ: u(undefined, r('ChartStyle')) },
      { json: 'type', js: 'type', typ: r('ChartType') },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  InstrumentElement: o(
    [
      { json: 'classification', js: 'classification', typ: u(undefined, r('OrganizationClassification')) },
      { json: 'id', js: 'id', typ: r('PurpleInstrumentIdentifiers') },
      { json: 'market', js: 'market', typ: u(undefined, r('OrganizationMarket')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('PurpleAppID') },
    ],
    'any'
  ),
  OrganizationClassification: o(
    [
      { json: 'fdc3', js: 'fdc3', typ: u(undefined, '') },
      { json: 'FDS_TYPE', js: 'FDS_TYPE', typ: u(undefined, '') },
    ],
    'any'
  ),
  PurpleInstrumentIdentifiers: o(
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
  OrganizationMarket: o(
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
      { json: 'type', js: 'type', typ: r('TimeRangeType') },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  ChatInitSettings: o(
    [
      { json: 'chatName', js: 'chatName', typ: u(undefined, '') },
      { json: 'members', js: 'members', typ: u(undefined, r('ContactListObject')) },
      { json: 'message', js: 'message', typ: u(undefined, u(r('MessageObject'), '')) },
      { json: 'options', js: 'options', typ: u(undefined, r('ChatOptions')) },
      { json: 'type', js: 'type', typ: r('ChatInitSettingsType') },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  ContactListObject: o(
    [
      { json: 'contacts', js: 'contacts', typ: a(r('ContactElement')) },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('ContactListType') },
    ],
    'any'
  ),
  ContactElement: o(
    [
      { json: 'id', js: 'id', typ: r('PurpleContactIdentifiers') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('FluffyAppID') },
    ],
    'any'
  ),
  PurpleContactIdentifiers: o(
    [
      { json: 'email', js: 'email', typ: u(undefined, '') },
      { json: 'FDS_ID', js: 'FDS_ID', typ: u(undefined, '') },
    ],
    'any'
  ),
  MessageObject: o(
    [
      { json: 'entities', js: 'entities', typ: u(undefined, m(r('EntityValue'))) },
      { json: 'text', js: 'text', typ: u(undefined, r('PurpleMessageText')) },
      { json: 'type', js: 'type', typ: r('MessageType') },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  EntityValue: o(
    [
      { json: 'action', js: 'action', typ: u(undefined, r('ActionType')) },
      { json: 'app', js: 'app', typ: u(undefined, r('AppIdentifier')) },
      { json: 'channelId', js: 'channelId', typ: u(undefined, '') },
      { json: 'context', js: 'context', typ: u(undefined, r('ContextElement')) },
      { json: 'intent', js: 'intent', typ: u(undefined, '') },
      { json: 'title', js: 'title', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('EntityType') },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'data', js: 'data', typ: u(undefined, r('EntityData')) },
    ],
    'any'
  ),
  EntityData: o(
    [
      { json: 'dataUri', js: 'dataUri', typ: '' },
      { json: 'name', js: 'name', typ: '' },
    ],
    'any'
  ),
  PurpleMessageText: o(
    [
      { json: 'text/markdown', js: 'text/markdown', typ: u(undefined, '') },
      { json: 'text/plain', js: 'text/plain', typ: u(undefined, '') },
    ],
    'any'
  ),
  ChatOptions: o(
    [
      { json: 'allowAddUser', js: 'allowAddUser', typ: u(undefined, true) },
      { json: 'allowHistoryBrowsing', js: 'allowHistoryBrowsing', typ: u(undefined, true) },
      { json: 'allowMessageCopy', js: 'allowMessageCopy', typ: u(undefined, true) },
      { json: 'groupRecipients', js: 'groupRecipients', typ: u(undefined, true) },
      { json: 'isPublic', js: 'isPublic', typ: u(undefined, true) },
    ],
    'any'
  ),
  ChatMessage: o(
    [
      { json: 'chatRoom', js: 'chatRoom', typ: r('ChatRoomObject') },
      { json: 'message', js: 'message', typ: r('MessageObject') },
      { json: 'type', js: 'type', typ: r('ChatMessageType') },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  ChatRoomObject: o(
    [
      { json: 'id', js: 'id', typ: m('') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'providerName', js: 'providerName', typ: '' },
      { json: 'type', js: 'type', typ: r('ChatRoomType') },
      { json: 'url', js: 'url', typ: u(undefined, '') },
    ],
    'any'
  ),
  ChatRoom: o(
    [
      { json: 'id', js: 'id', typ: m('') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'providerName', js: 'providerName', typ: '' },
      { json: 'type', js: 'type', typ: r('ChatRoomType') },
      { json: 'url', js: 'url', typ: u(undefined, '') },
    ],
    'any'
  ),
  ChatSearchCriteria: o(
    [
      { json: 'criteria', js: 'criteria', typ: a(u(r('OrganizationObject'), '')) },
      { json: 'type', js: 'type', typ: r('ChatSearchCriteriaType') },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  OrganizationObject: o(
    [
      { json: 'classification', js: 'classification', typ: u(undefined, r('OrganizationClassification')) },
      { json: 'id', js: 'id', typ: r('Identifiers') },
      { json: 'market', js: 'market', typ: u(undefined, r('OrganizationMarket')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('TentacledAppID') },
    ],
    'any'
  ),
  Identifiers: o(
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
      { json: 'LEI', js: 'LEI', typ: u(undefined, '') },
      { json: 'email', js: 'email', typ: u(undefined, '') },
    ],
    'any'
  ),
  Contact: o(
    [
      { json: 'id', js: 'id', typ: r('FluffyContactIdentifiers') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('FluffyAppID') },
    ],
    'any'
  ),
  FluffyContactIdentifiers: o(
    [
      { json: 'email', js: 'email', typ: u(undefined, '') },
      { json: 'FDS_ID', js: 'FDS_ID', typ: u(undefined, '') },
    ],
    'any'
  ),
  ContactList: o(
    [
      { json: 'contacts', js: 'contacts', typ: a(r('ContactElement')) },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('ContactListType') },
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
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('CountryType') },
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
      { json: 'type', js: 'type', typ: r('CurrencyType') },
    ],
    'any'
  ),
  CurrencyID: o([{ json: 'CURRENCY_ISOCODE', js: 'CURRENCY_ISOCODE', typ: u(undefined, '') }], 'any'),
  Email: o(
    [
      { json: 'recipients', js: 'recipients', typ: r('EmailRecipients') },
      { json: 'subject', js: 'subject', typ: u(undefined, '') },
      { json: 'textBody', js: 'textBody', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('EmailType') },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  EmailRecipients: o(
    [
      { json: 'id', js: 'id', typ: u(undefined, r('ContactTIdentifiers')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('EmailRecipientsType') },
      { json: 'contacts', js: 'contacts', typ: u(undefined, a(r('ContactElement'))) },
    ],
    'any'
  ),
  ContactTIdentifiers: o(
    [
      { json: 'email', js: 'email', typ: u(undefined, '') },
      { json: 'FDS_ID', js: 'FDS_ID', typ: u(undefined, '') },
    ],
    'any'
  ),
  FileAttachment: o(
    [
      { json: 'data', js: 'data', typ: r('FileAttachmentData') },
      { json: 'type', js: 'type', typ: r('FileAttachmentType') },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  FileAttachmentData: o(
    [
      { json: 'dataUri', js: 'dataUri', typ: '' },
      { json: 'name', js: 'name', typ: '' },
    ],
    'any'
  ),
  Instrument: o(
    [
      { json: 'classification', js: 'classification', typ: u(undefined, r('PurpleInstrumentClassification')) },
      { json: 'id', js: 'id', typ: r('FluffyInstrumentIdentifiers') },
      { json: 'market', js: 'market', typ: u(undefined, r('PurpleMarket')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('PurpleAppID') },
    ],
    'any'
  ),
  PurpleInstrumentClassification: o(
    [
      { json: 'fdc3', js: 'fdc3', typ: u(undefined, '') },
      { json: 'FDS_TYPE', js: 'FDS_TYPE', typ: u(undefined, '') },
    ],
    'any'
  ),
  FluffyInstrumentIdentifiers: o(
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
  InstrumentList: o(
    [
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'instruments', js: 'instruments', typ: a(r('InstrumentElement')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('InstrumentListType') },
    ],
    'any'
  ),
  Interaction: o(
    [
      { json: 'description', js: 'description', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, r('InteractionID')) },
      { json: 'initiator', js: 'initiator', typ: u(undefined, r('ContactElement')) },
      { json: 'interactionType', js: 'interactionType', typ: '' },
      { json: 'origin', js: 'origin', typ: u(undefined, '') },
      { json: 'participants', js: 'participants', typ: r('ContactListObject') },
      { json: 'timeRange', js: 'timeRange', typ: r('TimeRangeObject') },
      { json: 'type', js: 'type', typ: r('InteractionType') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  InteractionID: o(
    [
      { json: 'SALESFORCE', js: 'SALESFORCE', typ: u(undefined, '') },
      { json: 'SINGLETRACK', js: 'SINGLETRACK', typ: u(undefined, '') },
      { json: 'URI', js: 'URI', typ: u(undefined, '') },
    ],
    'any'
  ),
  Message: o(
    [
      { json: 'entities', js: 'entities', typ: u(undefined, m(r('EntityValue'))) },
      { json: 'text', js: 'text', typ: u(undefined, r('FluffyMessageText')) },
      { json: 'type', js: 'type', typ: r('MessageType') },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  FluffyMessageText: o(
    [
      { json: 'text/markdown', js: 'text/markdown', typ: u(undefined, '') },
      { json: 'text/plain', js: 'text/plain', typ: u(undefined, '') },
    ],
    'any'
  ),
  Nothing: o(
    [
      { json: 'type', js: 'type', typ: r('NothingType') },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Order: o(
    [
      { json: 'details', js: 'details', typ: u(undefined, r('PurpleOrderDetails')) },
      { json: 'id', js: 'id', typ: m('') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'notes', js: 'notes', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('OrderType') },
    ],
    'any'
  ),
  PurpleOrderDetails: o([{ json: 'product', js: 'product', typ: u(undefined, r('ProductObject')) }], 'any'),
  ProductObject: o(
    [
      { json: 'id', js: 'id', typ: m('') },
      { json: 'instrument', js: 'instrument', typ: u(undefined, r('InstrumentElement')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'notes', js: 'notes', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('ProductType') },
    ],
    'any'
  ),
  OrderList: o(
    [
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'orders', js: 'orders', typ: a(r('OrderElement')) },
      { json: 'type', js: 'type', typ: r('OrderListType') },
    ],
    'any'
  ),
  OrderElement: o(
    [
      { json: 'details', js: 'details', typ: u(undefined, r('FluffyOrderDetails')) },
      { json: 'id', js: 'id', typ: m('') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'notes', js: 'notes', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('OrderType') },
    ],
    'any'
  ),
  FluffyOrderDetails: o([{ json: 'product', js: 'product', typ: u(undefined, r('ProductObject')) }], 'any'),
  Organization: o(
    [
      { json: 'id', js: 'id', typ: r('OrganizationIdentifiers') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('StickyAppID') },
    ],
    'any'
  ),
  OrganizationIdentifiers: o(
    [
      { json: 'FDS_ID', js: 'FDS_ID', typ: u(undefined, '') },
      { json: 'LEI', js: 'LEI', typ: u(undefined, '') },
      { json: 'PERMID', js: 'PERMID', typ: u(undefined, '') },
    ],
    'any'
  ),
  Portfolio: o(
    [
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'positions', js: 'positions', typ: a(r('PositionElement')) },
      { json: 'type', js: 'type', typ: r('PortfolioType') },
    ],
    'any'
  ),
  PositionElement: o(
    [
      { json: 'holding', js: 'holding', typ: 3.14 },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'instrument', js: 'instrument', typ: r('InstrumentElement') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('PositionType') },
    ],
    'any'
  ),
  Position: o(
    [
      { json: 'holding', js: 'holding', typ: 3.14 },
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'instrument', js: 'instrument', typ: r('InstrumentElement') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('PositionType') },
    ],
    'any'
  ),
  Product: o(
    [
      { json: 'id', js: 'id', typ: m('') },
      { json: 'instrument', js: 'instrument', typ: u(undefined, r('InstrumentElement')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'notes', js: 'notes', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: r('ProductType') },
    ],
    'any'
  ),
  TimeRange: o(
    [
      { json: 'endTime', js: 'endTime', typ: u(undefined, Date) },
      { json: 'startTime', js: 'startTime', typ: u(undefined, Date) },
      { json: 'type', js: 'type', typ: r('TimeRangeType') },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Trade: o(
    [
      { json: 'id', js: 'id', typ: m('') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'notes', js: 'notes', typ: u(undefined, '') },
      { json: 'product', js: 'product', typ: r('ProductObject') },
      { json: 'type', js: 'type', typ: r('TradeType') },
    ],
    'any'
  ),
  TradeList: o(
    [
      { json: 'id', js: 'id', typ: u(undefined, m('')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'trades', js: 'trades', typ: a(r('TradeElement')) },
      { json: 'type', js: 'type', typ: r('TradeListType') },
    ],
    'any'
  ),
  TradeElement: o(
    [
      { json: 'id', js: 'id', typ: m('') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'notes', js: 'notes', typ: u(undefined, '') },
      { json: 'product', js: 'product', typ: r('ProductObject') },
      { json: 'type', js: 'type', typ: r('TradeType') },
    ],
    'any'
  ),
  TransactionResult: o(
    [
      { json: 'context', js: 'context', typ: u(undefined, r('ContextElement')) },
      { json: 'message', js: 'message', typ: u(undefined, '') },
      { json: 'status', js: 'status', typ: r('TransactionStatus') },
      { json: 'type', js: 'type', typ: r('TransactionResultType') },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  Valuation: o(
    [
      { json: 'CURRENCY_ISOCODE', js: 'CURRENCY_ISOCODE', typ: '' },
      { json: 'expiryTime', js: 'expiryTime', typ: u(undefined, Date) },
      { json: 'price', js: 'price', typ: u(undefined, 3.14) },
      { json: 'type', js: 'type', typ: r('ValuationType') },
      { json: 'valuationTime', js: 'valuationTime', typ: u(undefined, Date) },
      { json: 'value', js: 'value', typ: 3.14 },
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    'any'
  ),
  ActionType: ['broadcast', 'raiseIntent'],
  ActionTypeEnum: ['fdc3.action'],
  PurpleAppID: ['fdc3.instrument'],
  TimeRangeType: ['fdc3.timeRange'],
  ChartStyle: ['bar', 'candle', 'custom', 'heatmap', 'histogram', 'line', 'mountain', 'pie', 'scatter', 'stacked-bar'],
  ChartType: ['fdc3.chart'],
  FluffyAppID: ['fdc3.contact'],
  ContactListType: ['fdc3.contactList'],
  EntityType: ['fdc3.action', 'fdc3.fileAttachment'],
  MessageType: ['fdc3.message'],
  ChatInitSettingsType: ['fdc3.chat.initSettings'],
  ChatRoomType: ['fdc3.chat.room'],
  ChatMessageType: ['fdc3.chat.message'],
  TentacledAppID: ['fdc3.contact', 'fdc3.instrument', 'fdc3.organization'],
  ChatSearchCriteriaType: ['fdc3.chat.searchCriteria'],
  CountryType: ['fdc3.country'],
  CurrencyType: ['fdc3.currency'],
  EmailRecipientsType: ['fdc3.contact', 'fdc3.contactList'],
  EmailType: ['fdc3.email'],
  FileAttachmentType: ['fdc3.fileAttachment'],
  InstrumentListType: ['fdc3.instrumentList'],
  InteractionType: ['fdc3.interaction'],
  NothingType: ['fdc3.nothing'],
  ProductType: ['fdc3.product'],
  OrderType: ['fdc3.order'],
  OrderListType: ['fdc3.orderList'],
  StickyAppID: ['fdc3.organization'],
  PositionType: ['fdc3.position'],
  PortfolioType: ['fdc3.portfolio'],
  TradeType: ['fdc3.trade'],
  TradeListType: ['fdc3.tradeList'],
  TransactionStatus: ['Created', 'Deleted', 'Failed', 'Updated'],
  TransactionResultType: ['fdc3.transactionResult'],
  ValuationType: ['fdc3.valuation'],
};
