---
id: spec
sidebar_label: Overview
title: Context Data (2.1)
---

To interoperate, apps need to exchange commonly recognized context structures that can indicate topic with any number of identifiers or mappings to different systems. FDC3 Context Data defines a standard for passing common identifiers and data, encoded in JSON, between apps to create a seamless workflow. FDC3 Context Data is not a symbology solution and is not specifically focused on modeling financial objects. The focus is on providing a standard JSON payload structure that can be used to establish a lowest common denominator for interoperability.

Context objects are used when raising [intents](../intents/spec) and when broadcasting context to other applications.

There are two main use cases for exchanging context data:

- **Transmitting reference data between applications.**
  The source application will send as many known identifiers as possible, and the target application will try to match the entity based on the identifiers. It may then choose to map to its own internal domain representation for rendering purposes.

  An example of this is sending an instrument or contact, when only an ISIN or email is required to reference the same data in another application.

- **Transferring information between applications.**
  The source application may have data required to compose a workflow with another application, e.g. a list of contacts that have been selected, or a complex object representing an RFQ request.

  In many such cases there aren't any sensible reference identifiers that can be shared, it is instead the data itself being transferred.

## Assumptions

1. Context data objects are identified and routed according to their type, which is unique.
2. Any names, identifiers or extra properties are optional.
3. More complex objects can be composed from simpler objects by defining a new type, e.g a position from an instrument and a holding amount.
4. If multiple pieces of data need to be sent, an embedded array can be used, identified as a collection type, e.g. "contactList" or "portfolio". This allows for additional metadata and data relationships to be expressed.
5. There needs to be a way to reference or look up the structure of well-known context types, e.g. from a directory.

## Other Standards

FDC3 recognizes that there are other object definitions for providing context between applications. Most, if not all of these definitions though are platform-specific. FDC3, as a rule, sets out to be platform-agnostic and focused on creating bridges between the various walled gardens on the financial desktop.

### Context Schemas

FDC3 Context data is primarily encoded in JSON, but may also be encoded in language specific formats for use with FDC3 API implementations in those languages, although it is advisable to ensure that they can be converted to and from JSON.

Each Standardized context type defined by the FDC3 Standard has an associated [JSON Schema](https://json-schema.org/) definition that should be considered the 'source of truth' for the context definition, although examples in documentation may also be given in TypeScript or JavaScript. The TypeScript definitions distributed in the FDC3 NPM module are generated from the JSON Schema files using [quicktype](https://quicktype.io/). Both documentation for fields defined (in the form of a `title` and `description` entry for each field defined) and examples SHOULD be included in JSON Schema definitions for Context types to ensure that the schema file can serve as a single source of truth, and that code generated from the schema files can also include that documentation.

## The Context Interface

Context can be summarized as:

- Having a unique _type_ identifier, used for routing.
- Optionally providing a name.
- Optionally providing a map of equivalent identifiers.
- Any other properties or metadata.

Hence, the Context Interface can be represented in TypeScript as:

```typescript
interface Context {
    type: string;
    name?: string;
    id?: {
        [x:string]: string;
    },
    [x: string]: any;
}
```

or in JSON Schema as:

```JSON
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "https://fdc3.finos.org/schemas/2.1/context/context.schema.json",
    "type": "object",
    "title": "Context",
    "description": "The `fdc3.context` type defines the basic contract or \"shape\" for all data exchanged by FDC3 operations. As such, it is not really meant to be used on its own, but is imported by more specific type definitions (standardized or custom) to provide the structure and properties shared by all FDC3 context data types.\n\nThe key element of FDC3 context types is their mandatory `type` property, which is used to identify what type of data the object represents, and what shape it has.\n\nThe FDC3 context type, and all derived types, define the minimum set of fields a context data object of a particular type can be expected to have, but this can always be extended with custom fields as appropriate.",
    "properties": {
        "type": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        "id": {
            "type": "object",
            "unevaluatedProperties": {
                "type": "string"
            }
        }
    },
    "additionalProperties": true,
    "required": [
        "type"
    ]
}
```

### Namespacing

All well-known types at FDC3 level should be prefixed with `fdc3`. For private type definitions, or type definitions issued by other organizations, different namespaces can be used, e.g. `blackrock.fund`, etc.

### Versioning

The specification recognizes that evolving context data definitions over time, and helping applications to deal with changes to types, are very important.

It may be as simple as adding an optional `$version` property to types, but it could also be a set of guidelines for adding new properties, without removing or changing existing ones. For example, web technologies like REST or GraphQL do not take a particular opinion about versioning.

### Field Type Conventions

This Standard defines a number of conventions for the fields of context types that all context objects SHOULD adhere to in order to reduce or prevent competing conventions from being established in both standardized types and proprietary types created by app developers.

#### Identifiers

An `id` field with type `object` is defined in the base [fdc3.context](ref/Context) type, from which all other context objects are derived, and SHOULD be used to encapsulate identifiers. Specific context types may define subfields for specific identifiers as needed.

Where an identifier is the name of an existing standard, external to FDC3, it is represented in all caps. For example: FIGI, PERMID, CUSIP, ISO-2. When an identifier is a more general concept, it is represented in all lower case.  For example: ticker, name, geocode, email.

All standard identifier names are reserved names. Applications may use their own identifiers ad hoc. For example:

```json
"id": {
    "CUSIP":"037833100",
    "foo":"bar"
}
```

The identifier "foo" is proprietary, an application that can use it is free to do so. However, since multiple applications may want to use the "foo" name and may use it to mean different things, there is a need for applications to ensure that their identifiers use naming conventions that will avoid collision. The recommended approach here is to prefix the identifier name with a namespace. For example:

```json
"id": {
    "CUSIP":"037833100",
    "com.company.foo": "000C7F-E"
}
```

#### Times

Fields representing a point in time SHOULD be string encoded according to [ISO 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator included, e.g.:

- Time in UTC: `"2022-03-30T15:44:44Z"`
- Also time in UTC: `"2022-03-30T15:44:44+00:00"`
- Same time in EDT: `"2022-03-30T11:44:44-04:00"`

Times MAY be expressed with millisecond precision, e.g.:

- `"2022-03-30T11:44:44.123-04:00"`
- `"2022-03-30T11:44:44.123Z"`

Parsing in JavaScript:

```javascript
let aDate = new Date("2022-03-30T11:44:44.123-04:00")
```

#### Dates

Fields representing a point in time SHOULD be string encoded using the `YYYY-MM-DD` date format from [ISO 8601-1:2019](https://www.iso.org/standard/70907.html).

E.g. `"2022-03-30"`

Parsing in JavaScript:

```javascript
let aDate = new Date("2022-03-30")
```

#### Country codes

Fields representing a country SHOULD be string encoded using the Alpha-2-codes from [ISO 3166-1](https://www.iso.org/iso-3166-country-codes.html) and field name `COUNTRY_ISOALPHA2`. The Alpha-3-codes from [ISO 3166-1](https://www.iso.org/iso-3166-country-codes.html) MAY be used in addition to the Alpha-2-code with the field name `COUNTRY_ISOALPHA3`.

E.g. `"COUNTRY_ISOALPHA2": "GB"`

#### Currency codes

Fields representing a currency SHOULD be string encoded using the Alphabetic code from [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html) with the field name `CURRENCY_ISOCODE`.

E.g. `"CURRENCY_ISOCODE": "GBP"`

:::note
ISO 4217 only includes major currency codes, conversions to minor currencies is the responsibility of the consuming system (where required).
:::

## Context Data Standard Compliance

An FDC3 Standard compliant application that supports the use of context data **MUST**:

- Ensure that any FDC3-defined standard context types used meet the interface defined for that type of context data.
- Where an app is intended to receive context from [`fdc3.open`](../api/ref/DesktopAgent#open) calls, use the [`fdc3.addContextListener`](../api/ref/DesktopAgent#addcontextlistener) API call to set up appropriate handlers.
- Where App or Private channels are supported, use the [`Channel.addContextListener`](../api/ref/Channel#addcontextlistener) API call to set up appropriate handlers.

An FDC3 Standard compliant application that supports the use of context data **SHOULD**:

- Prefer FDC3-defined standard context types over proprietary contexts, where a suitable FDC3-defined standard context type is available.
- Ensure that any proprietary context data types defined follow any the recommended [namespacing](#namespacing) and [field type conventions](#field-type-conventions) in the specification.
- Where an app is intended to receive context from [`fdc3.open`](../api/ref/DesktopAgent#open) calls, use the [`fdc3.addContextListener`](../api/ref/DesktopAgent#addcontextlistener) API call to set up appropriate handlers within 15 seconds of the application launch (the minimum timeout Desktop Agents are required to provide) in order to be widely compatible with Desktop Agent implementations.

An FDC3 Standard compliant application that supports the use of context data **MAY**:

- Define proprietary context data types to support use cases not currently supported via FDC3-defined standard context types.

For more details on FDC3 Standards compliance (including the versioning, deprecation and experimental features policies) please see the [FDC3 Compliance page](../fdc3-compliance).

## Standard Context Types

The following are standard FDC3 context types:

- [`fdc3.action`](ref/Action) ([schema](/schemas/2.1/context/action.schema.json))
- [`fdc3.chart`](ref/Chart) ([schema](/schemas/2.1/context/chart.schema.json))
- [`fdc3.chat.initSettings`](ref/ChatInitSettings) ([schema](/schemas/2.1/context/chatInitSettings.schema.json))
- [`fdc3.chat.message`](ref/ChatMessage) ([schema](/schemas/2.1/context/chatMessage.schema.json))
- [`fdc3.chat.room`](ref/ChatRoom) ([schema](/schemas/2.1/context/chatRoom.schema.json))
- [`fdc3.chat.searchCriteria`](ref/ChatSearchCriteria) ([schema](/schemas/2.1/context/chatSearchCriteria.schema.json))
- [`fdc3.contact`](ref/Contact) ([schema](/schemas/2.1/context/contact.schema.json))
- [`fdc3.contactList`](ref/ContactList) ([schema](/schemas/2.1/context/contactList.schema.json))
- [`fdc3.country`](ref/Country) ([schema](/schemas/2.1/context/country.schema.json))
- [`fdc3.currency`](ref/Currency) ([schema](/schemas/2.1/context/currency.schema.json))
- [`fdc3.email`](ref/Email) ([schema](/schemas/2.1/context/email.schema.json))
- [`fdc3.instrument`](ref/Instrument) ([schema](/schemas/2.1/context/instrument.schema.json))
- [`fdc3.instrumentList`](ref/InstrumentList) ([schema](/schemas/2.1/context/instrumentList.schema.json))
- [`fdc3.interaction`](ref/Interaction) ([schema](/schemas/2.1/context/interaction.schema.json))
- [`fdc3.message`](ref/Message) ([schema](/schemas/2.1/context/message.schema.json))
- [`fdc3.organization`](ref/Organization) ([schema](/schemas/2.1/context/organization.schema.json))
- [`fdc3.portfolio`](ref/Portfolio) ([schema](/schemas/2.1/context/portfolio.schema.json))
- [`fdc3.position`](ref/Position) ([schema](/schemas/2.1/context/position.schema.json))
- [`fdc3.nothing`](ref/Nothing) ([schema](/schemas/2.1/context/nothing.schema.json))
- [`fdc3.timeRange`](ref/TimeRange) ([schema](/schemas/2.1/context/timeRange.schema.json))
- [`fdc3.transactionResult`](ref/TransactionResult) ([schema](/schemas/2.1/context/transactionresult.schema.json))
- [`fdc3.valuation`](ref/Valuation) ([schema](/schemas/2.1/context/valuation.schema.json))

The following are [`@experimental`](/docs/fdc3-compliance#experimental-features) types, which are in the process of being defined:

- [`fdc3.order`](ref/Order) ([schema](/schemas/2.1/context/order.schema.json))
- [`fdc3.orderList`](ref/OrderList) ([schema](/schemas/2.1/context/orderList.schema.json))
- [`fdc3.product`](ref/Product) ([schema](/schemas/2.1/context/product.schema.json))
- [`fdc3.trade`](ref/Trade) ([schema](/schemas/2.1/context/trade.schema.json))
- [`fdc3.tradeList`](ref/TradeList) ([schema](/schemas/2.1/context/tradeList.schema.json))

### Examples

The below examples show how the base context data interface can be used to define specific context data objects.

#### Contact

```json
{
    "type": "fdc3.contact",
    "name": "John Smith",
    "id":{
        "email": "john.smith@company.com",
    }
}
```

#### Email

```json
{
  "type": "fdc3.email",
  "recipients": {
    "type": "fdc3.contact",
    "name": "Jane Doe",
    "id": {
      "email": "jane.doe@example.com"
    }
  },
  "subject": "The information you requested",
  "textBody": "Blah, blah, blah ..."
}
```

#### Instrument

```json
{
    "type" : "fdc3.instrument",
    "name" : "Apple",
    "id" :
    {
        "ticker" : "aapl",
        "ISIN" : "US0378331005",
        "CUSIP" : "037833100",
        "FIGI" : "BBG000B9XRY4",
    }
}
```

#### TypeScript definition

The `Instrument` type is derived from the `Context` type (note that the name becomes a required field, the type is fixed and optional `id` subfields are defined):

```typescript
interface Instrument extends Context {
    type: 'fdc3.instrument',
    name: string;
    id: {
        ticker?: string;
        ISIN?: string;
        CUSIP?: string;
    }
}
```

e.g. as a JSON payload:

```json
{
    "type" : "fdc3.instrument",
    "name" : "Apple",
    "id" : 
    {  
        "ticker" : "aapl",
        "ISIN" : "US0378331005",
        "CUSIP" : "037833100"
    },
}
```
