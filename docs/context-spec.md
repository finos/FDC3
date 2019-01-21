---
id: context-spec
sidebar_label: Context Data Specification
title: Context Data Specification
hide_title: true
---

# Context Data Specification (Draft)

## Introduction

To interoperate, apps need to exchange commonly recognized context structures that can indicate topic with any number of identifiers or mappings to different systems.

Exchanging context is the most basic entry point to desktop interoperability.  The barriers to adoption for this interaction must be kept as low as possible.

There are two main use case for exchanging context data:

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
4. If multiple pieces of data needs to be sent, an embbedded array can be used, identified as a collection type, e.g. "contactList" or "portfolio". This allows for extra metadata and data relationships to be expressed.
5. There needs to be a way to reference or look up the structure of well-known context types, e.g. from a directory.

## Other Standard

FDC3 recognizes that there are other object definitions for providing context between applications.  Most, if not all of these definitions though are platform-specific. FDC3, as a rule, sets out to be platform-agnostic and focused on creating bridges between the various walled gardens on the financial desktop.

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

### Examples ###

__Note:__ The below examples show how the base context data interface can be used to define specific context data objects. It is not the purpose of the specification at this stage to define standard representations for objects. It establishes the framework in which such definitions could be created.

#### Instrument ####
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
#### Contact ####
```json
{
    "type": "fdc3.contact",
    "name": "Nick Kolba",
    "id":{
        "email": "nick@openfin.co",
        "twitter": "nkolba",
        "phone": "9171234567"
    }
}
```
#### Organization ####
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
#### ContactList ####
```json
{
    "type": "fdc3.contactList",
    "contacts": [
        {
            "type" : "fdc3.contact",
            "name":"Nick Kolba",
            "id":{
                "email": "nick@openfin.co"
            }
        },
        {
            "type" : "$fdc3.contact",
            "name":"Espen Overbye",
            "id":{
                "email": "espen@openfin.co"
            }
        }
    ]
}
```
#### Position ####
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

### Namespacing ###

All well-known types at FDC3 level should be prefixed with `fdc3`. For private type definitions, or type definitions issued by other organisations, different namespaces can be used, e.g. `blackrock.fund`, etc.

### Versioning ###

The specification recognises that evolving context data definitions over time, and helping applications to deal with changes to types, are very important.

It may be as simple as adding an optional `$version` property to types, but it could also be a set of guidelines for adding new properties, without removing or changing existing ones. For example, web technologies like REST or GraphQL does not take a particular opinion about versioning.

### Identifiers ###

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
    "com.factset.symbology.entity": "000C7F-E"
}
```