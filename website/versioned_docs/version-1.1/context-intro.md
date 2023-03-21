---
sidebar_label: Context Data Overview
title: Context Data Overview
hide_title: true
original_id: context-intro
---

# Context Data Overview
Extending APIs from one application to another is powerful. However, it requires bi-lateral agreements where implementors build to proprietary APIs. A standard language for interaction between applications allows us to create workflows on the fly, so that applications can discover and link to one another without any prior knowledge.  

FDC3 Context Data defines a standard for passing common identifiers and data between apps to create a seamless workflow. FDC3 Context Data is not a symbology solution and is not specifically focused on modeling financial objects. The focus is on providing a standard payload structure that can be used to establish a lowest common denominator for interoperability.

Context objects are used when raising [Intents](intents-intro) and when broadcasting context to other applications.

## Context Object

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
## Example Context Object

An instrument could for example be derived as (note that the name is required and the type is fixed):

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
    "country": "US"
}
```
 It is important to note that the context data specification allows extra identifiers and properties to be added as needed for each interop use case. In the example above, `country` could represent extra data in addition to the agreed instrument representation.
