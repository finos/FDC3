---
id: version-next-spec
sidebar_label: Context Data Specification
title: Context Data Specification
hide_title: true
original_id: spec
---

# Context Data Specification

## Introduction

To interoperate, apps need to exchange commonly recognized context structures that can indicate topic with any number of identifiers or mappings to different systems.

Exchanging context is the most basic entry point to desktop interoperability. The barriers to adoption for this interaction must be kept as low as possible.

There are two main use cases for exchanging context data:

* __Transmitting reference data between applications.__
  The source application will send as many known identifiers as possible, and the target application will try to match the entity based on the identifiers. It may then choose to map to its own internal domain representation for rendering purposes.

  An example of this is sending an instrument or contact, when only an ISIN or email is required to reference the same data in another application.

* __Transferring information between applications.__
  The source application may have data required to compose a workflow with another application, e.g. a list of contacts that have been selected, or a complex object representing an RFQ request.

  In many such cases there isn't any sensible reference identifiers that can be shared, it is instead the data itself being transferred.

## Assumptions

1. Context data objects are identified and routed according to their type, which is unique.
2. Any names, identifiers or extra properties are optional.
3. More complex objects can be composed from simpler objects by defining a new type, e.g a position from an instrument and a holding amount.
4. If multiple pieces of data need to be sent, an embedded array can be used, identified as a collection type, e.g. "contactList" or "portfolio". This allows for additional metadata and data relationships to be expressed.
5. There needs to be a way to reference or look up the structure of well-known context types, e.g. from a directory.

## Other Standards

FDC3 recognizes that there are other object definitions for providing context between applications. Most, if not all of these definitions though are platform-specific. FDC3, as a rule, sets out to be platform-agnostic and focused on creating bridges between the various walled gardens on the financial desktop.

## The Context Interface

```ts
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

### Identifiers

Where an identifier is the name of an existing standard, external to FDC3, it is represented in all caps. For example: FIGI, PERMID, CUSIP, ISO-2. When an identifer is a more general concept, it is represented in all lower case.  For example: ticker, name, geocode, email.

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

## Standard Context Types

The following are standard FDC3 context types. 
 __Note:__ The specification for these types are shared with the [FINOS Financial Objects](https://fo.finos.org) definitions, JSON schemas are hosted with FDC3.

- __fdc3.chart__
    - A visualization of data for a financial instrument or a set of instruments.
    - [Financial Objects Specification](https://fo.finos.org/docs/objects/chart)
    - [schema](/schemas/next/chart.schema.json)
- __fdc3.contact__
    - A person contact that can be engaged with through email, calling, messaging, CMS, etc.
    - [Financial Objects Specification](https://fo.finos.org/docs/objects/contact)
    - [schema](/schemas/next/contact.schema.json)
- __fd3.contactList__
    - A collection of contacts.
    - [Financial Objects Specification](https://fo.finos.org/docs/objects/contactlist)
    - [schema](/schemas/next/contactList.schema.json)
- __fdc3.country__
    - A standard country entity.
    - [Financial Objects Specification](https://fo.finos.org/docs/objects/country)
    - [schema](/schemas/next/country.schema.json)
- __fdc3.currency__
    - An entity that can be used when referencing currency.
    - [Financial Objects Specification](https://fo.finos.org/docs/objects/currency)
    - [schema](/schemas/next/currency.schema.json)
- __fdc3.dateRange__
    - A definition of a range of time, consisting of a start and end time..
    - [Financial Objects Specification](https://fo.finos.org/docs/objects/daterange)
    - [schema](/schemas/next/dateRange.schema.json)
- __fdc3.indicator__
    - A function or transformation performed on data..
    - [Financial Objects Specification](https://fo.finos.org/docs/objects/indicator)
    - [schema](/schemas/next/indicator.schema.json)
- __fdc3.instrument__
    - A financial instrument from any asset class.
    - [Financial Objects Specification](https://fo.finos.org/docs/objects/instrument)
    - [schema](/schemas/next/instrument.schema.json)
- __fdc3.instrumentList__
    - A collection of instruments.
    - [Financial Objects Specification](https://fo.finos.org/docs/objects/instrumentlist)
    - [schema](/schemas/next/instrumentList.schema.json)
- __fdd3.organization__
    - A standard organization entity.
    - [Financial Objects Specification](https://fo.finos.org/docs/objects/organization)
    - [schema](/schemas/next/organization.schema.json)
- __fdc3.portfolio__
    - A collection of positions.
    - [Financial Objects Specification](https://fo.finos.org/docs/objects/portfolio)
    - [schema](/schemas/next/portfolio.schema.json)
- __fdc3.position__
    - An instrument and a holding in that instrument.
    - [Financial Objects Specification](https://fo.finos.org/docs/objects/position)
    - [schema](/schemas/next/position.schema.json)
- __fdc3.trade__
    - A trade expresses a holding's duration, value and location.
    - [Financial Objects Specification](https://fo.finos.org/docs/objects/trade)
    - [schema](/schemas/next/trade.schema.json)
- __fdc3.valuation__
    - A valuation expresses a price and value of a holding.
    - [Financial Objects Specification](https://fo.finos.org/docs/objects/valuation)
    - [schema](/schemas/next/valuation.schema.json)

__Note:__ The below examples show how the base context data interface can be used to define specific context data objects. It is not the purpose of the specification at this stage to define standard representations for objects. It establishes the framework in which such definitions could be created.

### Examples

#### Chart
```json
{
    type: 'fdc3.chart'
    instruments: [
      {
        type: 'fdc3.instrument',
        id: {
          ticker: 'AAPL'
        }
      },
      {
        type: 'fdc3.instrument',
        id: {
          ticker: 'GOOG'
        }
      }
    ],
    range: {
      type: 'fdc3.dateRange',
      start: '2020-09-01T08:00:00.000Z',
      end: '2020-10-31T08:00:00.000Z'
    },
    style: 'line',
    indicators: [
      {
        type: 'fdc3.indicator',
        name: 'ma',
        parameters: {
          period: 14,
          type: 'ema'
        }
      },
      {
        type: 'fdc3.indicator',
        name: 'volume'
      }
    ]
}
```

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

#### ContactList
```json
{
    "type": "fdc3.contactList",
    "name": "client list",
    "contacts":[
        {
            "type":"fdc3.contact",
            "name":"joe",
            "id":{
                "email": "joe@company1.com",
            }
        },
        {
            "type":"fdc3.contact",
            "name":"jane",
            "id":{
                "email": "jane@company2.com",
            }
        }
    ]
}
```

#### Country
```json
{
    "type":"fdc3.country",
    "name":"the USA",
    "id":{
        "ISOALPHA2":"US",
        "ISOALPHA3":"USA"
    }
}
```

#### Currency
```json
{
    type: 'fdc3.currency',
    name: 'US Dollar',
    code: 'USD'
}
```

#### DateRange
```json
{
    type: 'fdc3.dateRange'
    starttime: '2020-09-01T08:00:00.000Z',
    endtime: '2020-10-31T08:00:00.000Z'
}
```

#### Indicator
```json
{
    type: 'fdc3.indicator'
    name: 'ma',
    parameters: {
      period: 14,
      matype: 'ema'
    }
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

#### InstrumentList
```json
{
    "type" : "fdc3.instrumentList",
    "name" : "my portfolio",
    "instruments" : [
        {  
            "type" : "fdc3.instrument",
            "name" : "Apple",
            "id": {
               "ticker" : "aapl"
            }
        },
        {  
            "type" : "fdc3.instrument",
            "name" : "International Business Machines",
            "id": {
               "ticker" : "ibm"
            }
        }
    ]
}
```

#### Organization
```json
{
    "type": "fdc3.organization",
    "name": "IBM",
    "id": {
        "PERMID" : "4295904307",
        "LEI" : "VGRQXHF3J8VDLUA7XE92"
    }
}
```

#### Portfolio
```json
{
    "type":"fdc3.portfolio"
    "name":"my portfolio",
    "positions":[
        {
            "type": "fdc3.position",
            "instrument": {
                "type" : "fdc3.instrument",
                "name" : "Apple",
                "id" : 
                {
                    "ISIN" : "US0378331005"
                }
            },
            "holding": 500
        },
         {
            "type": "fdc3.position",
            "instrument": {
                "type" : "fdc3.instrument",
                "name" : "IBM",
                "id" : 
                {
                    "ISIN" : "US4592001014"
                }
            },
            "holding": 1000
        }
    ]
}
```


#### Position
```json
{
    "type": "fdc3.position",
    "instrument": {
        "type" : "fdc3.instrument",
        "name" : "Apple",
        "id" : 
        {
            "ISIN" : "US0378331005"
        }
    },
    "holding": 500
}
```

#### Trade
```json
{
    type: 'fdc3.trade',
    tradedaterange: {
        type: 'fdc3.dateRange',
        starttime: '2020-09-01T08:00:00.000Z'
    },
    settledaterange: {
        type: 'fdc3.dateRange',
        starttime: '2020-09-02T08:00:00.000Z'
    },
    units: 1000000,
    open: {
        type: 'fdc3.valuation',
        price: 20.00,
        value: 20000000,
        currency: {
            type: 'fdc3.currency',
            code: 'USD'
        }
    },
    location: 'XYZ',
    account: 'cash'
}
```

#### Valuation
```json
{
    type: 'fdc3.valuation',
    price: 20.00,
    value: 20000000,
    currency: {
        type: 'fdc3.currency',
        code: 'USD'
    }
}
```


