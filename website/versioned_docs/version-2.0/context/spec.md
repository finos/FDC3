---
sidebar_label: Overview
title: Context Data 2.0
original_id: spec
---

To interoperate, apps need to exchange commonly recognized context structures that can indicate topic with any number of identifiers or mappings to different systems. FDC3 Context Data defines a standard for passing common identifiers and data between apps to create a seamless workflow. FDC3 Context Data is not a symbology solution and is not specifically focused on modeling financial objects. The focus is on providing a standard payload structure that can be used to establish a lowest common denominator for interoperability.

Context objects are used when raising [intents](../intents/spec) and when broadcasting context to other applications.

There are two main use cases for exchanging context data:

* **Transmitting reference data between applications.**
  The source application will send as many known identifiers as possible, and the target application will try to match the entity based on the identifiers. It may then choose to map to its own internal domain representation for rendering purposes.

  An example of this is sending an instrument or contact, when only an ISIN or email is required to reference the same data in another application.

* **Transferring information between applications.**
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

## The Context Interface

Context can be summarised as:

* Having a unique _type_ identifier, used for routing.
* Optionally providing a name.
* Optionally providing a map of equivalent identifiers.
* Any other properties or metadata.

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

### Namespacing

All well-known types at FDC3 level should be prefixed with `fdc3`. For private type definitions, or type definitions issued by other organisations, different namespaces can be used, e.g. `blackrock.fund`, etc.

### Versioning

The specification recognises that evolving context data definitions over time, and helping applications to deal with changes to types, are very important.

It may be as simple as adding an optional `$version` property to types, but it could also be a set of guidelines for adding new properties, without removing or changing existing ones. For example, web technologies like REST or GraphQL do not take a particular opinion about versioning.

## Field Type Conventions

This Standard defines a number of conventions for the fields of context types that all context objects SHOULD adhere to in order to reduce or prevent competing conventions from being established in both standardized types and proprietary types created by app developers.

### Identifiers

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

### Times

Fields representing a point in time SHOULD be string encoded according to [ISO 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator included, e.g.:

* Time in UTC: `"2022-03-30T15:44:44Z"`
* Also time in UTC: `"2022-03-30T15:44:44+00:00"`
* Same time in EDT: `"2022-03-30T11:44:44-04:00"`

Times MAY be expressed with millisecond precision, e.g.:

* `"2022-03-30T11:44:44.123-04:00"`
* `"2022-03-30T11:44:44.123Z"`

Parsing in JavaScript:

```javascript
let aDate = new Date("2022-03-30T11:44:44.123-04:00")
```

### Dates

Fields representing a point in time SHOULD be string encoded using the `YYYY-MM-DD` date format from [ISO 8601-1:2019](https://www.iso.org/standard/70907.html).

E.g. `"2022-03-30"`

Parsing in JavaScript:

```javascript
let aDate = new Date("2022-03-30")
```

### Country codes

Fields representing a country SHOULD be string encoded using the Alpha-2-codes from [ISO 3166-1](https://www.iso.org/iso-3166-country-codes.html) and field name `COUNTRY_ISOALPHA2`. The Alpha-3-codes from [ISO 3166-1](https://www.iso.org/iso-3166-country-codes.html) MAY be used in addition to the Alpha-2-code with the field name `COUNTRY_ISOALPHA3`.

E.g. `"COUNTRY_ISOALPHA2": "GB"`

### Currency codes

Fields representing a currency SHOULD be string encoded using the Alphabetic code from [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html) with the field name `CURRENCY_ISOCODE`.

E.g. `"CURRENCY_ISOCODE": "GBP"`

:::note
ISO 4217 only includes major currency codes, conversions to minor currencies is the responsibility of the consuming system (where required).
:::

## Context Data Standard Compliance

An FDC3 Standard compliant application that supports the use of context data **MUST**:

* Ensure that any FDC3-defined standard context types used meet the interface defined for that type of context data.
* Where Channels are supported or an app is intended to receive context from [`fdc3.open`](../api/ref/DesktopAgent#open) calls, use the [`fdc3.addContextListener`](../api/ref/DesktopAgent#addcontextlistener) API call to set up appropriate handlers on start-up (for User channels and for receiving context from [`fdc3.open`](../api/ref/DesktopAgent#open)) or when the channel is first created or retrieved (for App and Private channels).

An FDC3 Standard compliant application that supports the use of context data **SHOULD**:

* Prefer FDC3-defined standard context types over proprietary contexts, where a suitable FDC3-defined standard context type is available.
* Ensure that any proprietary context data types defined follow any the recommended [namespacing](#namespacing) and [field type conventions](#field-type-conventions) in the specification.

An FDC3 Standard compliant application that supports the use of context data **MAY**:

* Define proprietary context data types to support use cases not currently supported via FDC3-defined standard context types.

For more details on FDC3 Standards compliance (including the versioning, deprecation and experimental features policies) please see the [FDC3 Compliance page](../fdc3-compliance).

## Standard Context Types

The following are standard FDC3 context types:

* [`fdc3.chart`](ref/Chart) ([schema](pathname:///schemas/2.0/chart.schema.json))
* [`fdc3.chat.initSettings`](ref/ChatInitSettings) ([schema](pathname:///schemas/2.0/chatInitSettings.schema.json))
* [`fdc3.contact`](ref/Contact) ([schema](pathname:///schemas/2.0/contact.schema.json))
* [`fdc3.contactList`](ref/ContactList) ([schema](pathname:///schemas/2.0/contactList.schema.json))
* [`fdc3.country`](ref/Country) ([schema](pathname:///schemas/2.0/country.schema.json))
* [`fdc3.currency`](ref/Currency) ([schema](pathname:///schemas/2.0/currency.schema.json))
* [`fdc3.email`](ref/Email) ([schema](pathname:///schemas/2.0/email.schema.json))
* [`fdc3.instrument`](ref/Instrument) ([schema](pathname:///schemas/2.0/instrument.schema.json))
* [`fdc3.instrumentList`](ref/InstrumentList) ([schema](pathname:///schemas/2.0/instrumentList.schema.json))
* [`fdc3.organization`](ref/Organization) ([schema](pathname:///schemas/2.0/organization.schema.json))
* [`fdc3.portfolio`](ref/Portfolio) ([schema](pathname:///schemas/2.0/portfolio.schema.json))
* [`fdc3.position`](ref/Position) ([schema](pathname:///schemas/2.0/position.schema.json))
* [`fdc3.nothing`](ref/Nothing) ([schema](pathname:///schemas/2.0/nothing.schema.json))
* [`fdc3.timeRange`](ref/TimeRange) ([schema](pathname:///schemas/2.0/timeRange.schema.json))
* [`fdc3.valuation`](ref/Valuation) ([schema](pathname:///schemas/2.0/valuation.schema.json))

:::note
The below examples show how the base context data interface can be used to define specific context data objects.
:::

### Examples

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
