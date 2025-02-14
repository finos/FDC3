# Bridging Message types generation README

This folder contains Typescript interfaces, in BridgingTypes.ts generated from the context JSONSchema (https://json-schema.org/) files via quicktype (https://quicktype.io/). Source files may also be generated for us in other languages supported by Quicktype.

Please note that these definitions are provided to help developers working in TypeScript to produce valid bridging messages objects - but should not be considered the 'source of truth' for message definitions (instead look to the schemas and documentation).

It is not always possible to perfectly replicate a type/interface defined in JSONSchema via TypeScript. Hence, if there is any disagreement between the definitions, the JSON Schema should be assumed to be correct, rather than the TypeScript. For example, JSON Schema may define optional fields on an object + a restriction on the type of additional properties (via `"additionalProperties": { "type": "string"}`), which will result in an index signature `[property: string]: string;` in generated TypeScript. That signature is incompatible with optional properties (including string properties) as they have type `string | undefined`. A similar problem may occur in JSON Schema if the schema is used to create a subtype via composition as `additionalProperties` is not aware of the subschema's definitions. Both issues can be worked around by using `unevaluatedProperties` in the schema, which will defer to the declared type of the optional property in the subschema, but is also currently ignored by Quicktype - resulting in a type that will compile but doesn't restrict the type of optional property values as defined in the schema.

Further, Quicktype doesn't always perfectly replicate polymorphic fields specified with `oneOf` in JSON Schema as it will usually merge the different objects into a single type (where fields not in one of the constituent schemas become optional) rather than creating a union type. In such situations, the type produced is usable (has all the necessary fields) but may allow the construction of invalid instances which are missing required properties or include properties from the multiple schemas combined, which are not possible/valid according to JSON Schema.

Hence, the Types provided here can be used to provide valid message objects and to read/write their JSON encodings, but may not detect or prevent a limited set of invalid objects that would be identified by JSON Schema.

Finally, Quicktype will generate types or interfaces representing subunits of the schema, which are then referenced in the primary interface definition. These often do not have unique names (generated from title fields in the schemas). If a name conflict is encountered, Quicktype will generate a random name for such an interface, to use to reference it, and as it is randomly generated it may appear oddly named (e.g. `PurpleId`, `FluffyMarket`, `TentacledIdentifier` etc.). Please ignore such names as these types/interfaces will not normally be used outside of the composition of the primary type, e.g.:

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

and should not be considered a planned part of the type structure (which should not be replicated in any derivative work). When applied, the naming of these sub-units is not used, rather they are replaced with their contents. Generating better names for these sub-units is usually a case of adding or adjusting `title` fields on the relevant elements of the schema documents.

Finally, please note that the latest version of Quicktype (at the time of writing `23.0.49`) has a number of bugs that must be worked around:

- Using a directory or .schema.json files as a source will cause the input type argument `-s schema` to be ignored, causing the files to be interpreted as JSON rather than JSON Schema.
  - A utility is provided in this repository (_../../quicktypeUtil.js_) to work around this bug by listing directories and constructing a call to quicktype where each file is provided as an individual source.
- Setting the `--nice-property-names` TypeScript output option will crash the generator and can't be used.
- The --debug setting must be the first argument passed or it will be ignored.
