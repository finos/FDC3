---
id: version-next-Context
sidebar_label: Context
title: Context
hide_title: true
original_id: Context
---
# `Context`

The `fdc3.context` type defines the basic contract or "shape" for all data exchanged by FDC3 operations. As such, it is not 
really meant to be used on its own, but is imported by more specific type definitions (standardised or custom) to provide
the structure and properties shared by all FDC3 context data types.

The key element of FDC3 context types is their mandatory `type` property, which is used to identify what type of data the
object represents, and what shape it has.

Notes:

- The FDC3 context type, and all derived types, define the minimum set of fields a context data object of a particular type
can be expected to have, but this can always be extended with custom fields as appropriate.

## Type

`fdc3.context`

## Schema

https://fdc3.finos.org/schemas/next/context.schema.json

## Details

| Property    | Type    | Required | Example Value                    |
|-------------|---------|----------|----------------------------------|
| `type`      | string  | Yes      | `'fdc3.context'`                 |
| `name`      | string  | No       | `'Display name'`                 |
| `id`        | object  | No       | `{ id: 'value', 'id': 'value' }` |

### `type` (required)

The type property is the only _required_ part of the FDC3 context data schema. 
The FDC3 [API](../../api/overview) relies on the `type` property being present to route shared context data appropriately.

FDC3 [Intents](../../intents/overview) also register the context data types they support in an FDC3 [App Directory](../..app-directory/overview), used for intent discovery and routing.

Standardised FDC3 context types have well-known `type` properties prefixed with the `fdc3` namespace, e.g. `fdc3.instrument`. 
For non-standard types, e.g. those defined and used by a particular organisation, the convention is to prefix them with an
organization-specific namespace, e.g. `blackrock.fund`.

See the [Context Data Specification](../../context/spec) for more information about context data types.

### `name` (optional)

Context data objects may include a name property that can be used for more information, or display purposes. Some
derived types may require the name object as mandatory, depending on use case.

### `id` (optional)

Context data objects may include a set of equivalent key-value pairs that can be used to help applications
identify and look up the context type they receive in their own domain. The idea behind this design is that applications can provide as many equivalent identifiers to a target application as possible, e.g. an instrument may be represented by an ISIN, CUSIP or Bloomberg identifier.

Identifiers do not make sense for all types of data, so the `id` property is therefore optional, but some derived types may choose to require at least one identifier.

## See Also

FDC3 Specifications
- [Context Data](../../context/spec)
- [Intents](../../intents/spec)
- [API](../../api/spec)
- [App Directory](../../app-directory/spec)

FDC3 Context Types
- [Contact](Contact)
- [ContactList](ContactList)
- [Country](Country)
- [Instrument](Instrument)
- [InstrumentList](InstrumentList)
- [Organization](Organization)
- [Position](Position)
- [Portfolio](Portfolio)
