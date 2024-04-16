# Intro

The _schemas/api_ folder contains JSONSchema definitions that are used to implement wire protocols for an app working with a Desktop Agent, and for import into the Bridging wire protocols that shares many of the same structures.

Please note: Quicktype, the chosen generation tool currently has some limitations that prevent fully automatic schema generation from the existing TS types. For example it can not handle interfaces that contain methods in their definition. It also fails to generate schemas even if a type contains unused references to other types or interfaces that contain async functions (Promise return types). Therefore, in order to generate the `api\schemas\api.schema.json` some manual intervention was needed.

Once these limitations are not an issue the `api\schemas\t2sQuicktypeUtil.js` script should be moved to the root level of the project and a new npm script `"api-schema-gen": "node t2sQuicktypeUtil.js src/api schemas/api/api.schema.json"` should be added.

Contents:

- `api\schemas\t2sQuicktypeUtil.js` - Script used to run the generation of the schema from the types. Should be moved to the root level of the repo once fully-automated generation can be achieved.
- `api\schemas\api.schema.json` - partially auto-generated schema from the existing `src\api` types and metadata objects.
- `api\schemas\common.schema.json` - common element definitions referenced in multiple other schemas in both the API and Bridging API protocols.
- `api\schemas\appRequest.schema.json` - The base message definition that requests from an app to the DA are derived from.
- `api\schemas\agentResponseMessage.schema.json` - The base message definition that API call response messages from a DA to an app are derived from.
- `api\schemas\agentEventMessage.schema.json` - The base message definition that event messages from a DA to an app are derived from.
- `api\schemas\*Request.schema.json` - Schemas defining request messages sent from apps to Desktop Agents.
- `api\schemas\*Response.schema.json` - Schemas defining responses from DAs to apps for request messages (sent from apps to Desktop Agents).
- `api\schemas\*Event.schema.json` - Schemas defining event messages sent from Desktop Agents to Apps.
