---
title: DocumentedContext
sidebar_label: DocumentedContext

---

# DocumentedContext

## Schema

<https://github.com/finos/FDC3/tree/main/schemas/context/context.schema.json>

## Type

`undefined`

## Properties

<details>
  <summary><code>name</code></summary>

**type**: `string`

Context data objects may include a name property that can be used for more information, or display purposes. Some derived types may require the name object as mandatory, depending on use case.

</details>

<details>
  <summary><code>id</code></summary>

**type**: `object`

Context data objects may include a set of equivalent key-value pairs that can be used to help applications identify and look up the context type they receive in their own domain. The idea behind this design is that applications can provide as many equivalent identifiers to a target application as possible, e.g. an instrument may be represented by an ISIN, CUSIP or Bloomberg identifier.

Identifiers do not make sense for all types of data, so the `id` property is therefore optional, but some derived types may choose to require at least one identifier. Identifier values SHOULD always be of type string.

</details>

