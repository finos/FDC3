# Intro

Quicktype, the chosen generation tool currently has some limitations that prevent fully automatic schema generation from the existing TS types. For example it can not handle interfaces that contain methods in their definition. It also fails to generate schemas even if a type contains unused references to other types or interfaces that contain async functions (Promise return types). Therefore, in order to generate the `api\schemas\api.schema.json` some manual intervention was needed.

Once these limitations are not an issue the `api\schemas\t2sQuicktypeUtil.js` script should be moved to the root level of the project and a new npm script `"api-schema-gen": "node t2sQuicktypeUtil.js src/api schemas/api/api.schema.json"` should be added.

`api\schemas\api.schema.json` - partially auto-generated schema from the existing `src\api` types.
`api\schemas\baseImplementationMetadata.schema.json` - Used by bridging types that leave out the metadata of the calling application as it does not apply to bridging.
`api\schemas\intentResolution.schema.json` - At the moment it is not possible to auto-generate this due to limitations in the generation tool (quicktype)
`api\schemas\t2sQuicktypeUtil.js` - Script used to run the generation of the schema from the types. Should be moved to the root level of the repo once fully-automated generation can be achieved.
