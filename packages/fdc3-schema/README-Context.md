# Context types generation README

This folder contains Typescript interfaces, in ContextTypes.ts generated from the context JSONSchema (https://json-schema.org/) files via quicktype (https://quicktype.io/).

Please note that these definitions are provided to help developers working in TypeScript to produce valid context objects - but should not be considered the 'source of truth' for context definitions (instead look to the schemas and documentation). Source files may also be generated for us in other languages supported by quicktype.

It is not always possible to perfectly replicate a type/interface defined in JSONSchema via TypeScript. Hence, in the event of any disagreement between the definitions, the JSONSchema should be assumed to be correct, rather than the Typescript. For example, JSONSchema may define optional fields on an object + a restriction on the type of additional properties (via `"additionalProperties": { "type": "string"}`), which will result in an index signature `[property: string]: string;` in generated TypeScript. That signature, is incompatible with with an optional properties (including string properties) as they have type `string | undefined`. A similar problem may occur in JSON Schema if the schema is used to create a subtype via composition as `additionalProperties` is not aware of teh subschema's definitions. Both issues can be worked around by using `unevaluatedProperties` in the schema, which will defer to the declared type of the optional property in the subschema, but is also currently ignored by quicktype - resulting in a type that will compile, but doesn't restrict the type of optional property values as defined in the schema.

Further, quicktype doesn't always perfectly replicate polymorphic fields specified with `oneOf` in JSONSchema as it will usually merge the different objects into a single type (where fields not in one of the constituent schemas become optional) rather than creating a union type. In such situations, the type produced is usable (has all the necessary fields) but may allow the construction of invalid instances which are missing required properties or include properties from the multiple schemas combined, which are not possible/valid according to JSONSchema.

Hence, the Types provided here can be used to provide valid Context objects and to read/write their JSON encodings, but may not detect or prevent a limited set of invalid objects that would be identified by JSONSchema.

Please also note that quicktype will generate types or interfaces representing subunits of the schema, which are then referenced in the main interface definition. These often do not have unique names (e.g. fields of the `id` object in the Context schema, defined for a specific context type such as fdc3.instrument). Quicktype will generate a random name for such an interface, to use to reference it, and as it is randomly generated it may appear oddly named (e.g. `PurpleId`, `FluffyMarket`, `TentacledIdentifier` etc.). Please ignore such names as these types/interfaces will not normally be used outside of the composition of the main type, e.g.:

```TypeScript
export interface Instrument {
  id: StickyId;
  market?: FluffyMarket;
  type: string;
  name?: string;
  [property: string]: any;
}

export interface StickyId {
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
```

and should not be considered a planned part of the type structure (which should not be replicated in any derivative work). When applied, the naming of these sub-units is not used, rather they are replaced with their contents. It is hoped that we will be to generate better names of these sub-units in future.

Finally, please note that the latest version of quicktype (at the time of writing `23.0.19`) has a number of bugs that must be worked around:

- Using a directory or .schema.json files as a source will cause the input type argument `-s schema` to be ignored, causing the files to be interpreted as JSON rather than JSON Schema.
  - A utility is provided in this repository (_../../quicktypeUtil.js_) to work around this bug by listing directories and constructing a call to quicktype where each file is provided as an individual source.
- Setting the `--nice-property-names` TypeScript output option will crash the generator and can't be used.
