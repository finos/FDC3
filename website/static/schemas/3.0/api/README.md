# Intro

The _schemas/api_ folder contains JSONSchema definitions that are used to implement wire protocols for an app working with a Desktop Agent, and for import into the Bridging wire protocols that shares many of the same structures.

Please note: Quicktype, the chosen generation tool currently has some limitations that prevent fully automatic schema generation from the existing TS types. For example, it can not handle interfaces that contain methods in their definition (as you can't define methods in JSON). It also fails to generate schemas even if a type contains unused references to other types or interfaces that contain async functions (`Promise` return types). Therefore, in order to generate the `api\schemas\api.schema.json` some manual intervention was needed.

Once these limitations are not an issue the `api\schemas\t2sQuicktypeUtil.js` script should be moved to the root level of the project and a new npm script `"api-schema-gen": "node t2sQuicktypeUtil.js src/api schemas/api/api.schema.json"` should be added. Alternatively, schemas (for API types) may be manually maintained against the matching TypeScript definitions

Contents:

- `api\schemas\t2sQuicktypeUtil.js` - Script used to run the generation of the schema from the types. Should be moved to the root level of the repo once fully-automated generation can be achieved.
- `api\schemas\api.schema.json` - Partially auto-generated schema from the existing `src\api` types and metadata objects. Expected to be manually maintained in future.
- `api\schemas\common.schema.json` - Common element definitions referenced in multiple other schemas in both the API and Bridging API protocols.
- `api\schemas\appRequest.schema.json` - The base message definition that requests from an app to the DA are derived from.
- `api\schemas\agentResponse.schema.json` - The base message definition that API call response messages from a DA to an app are derived from.
- `api\schemas\agentEvent.schema.json` - The base message definition that event messages from a DA to an app are derived from.
- `api\schemas\*Request.schema.json` - Schemas defining request messages sent from apps to Desktop Agents.
- `api\schemas\*Response.schema.json` - Schemas defining responses from DAs to apps for request messages (sent from apps to Desktop Agents).
- `api\schemas\*Event.schema.json` - Schemas defining event messages sent from Desktop Agents to Apps.

Please note that when adding a particular message type, that it needs its own schema file, which will declare the type (string). That type string MUST also be added to an enumeration in the base message schema it was derived from - each base message schema (appRequest, agentResponse, agentEvent) has an enumeration of the valid types and it must appear in that or the message will not validate. Unhelpfully, if you've forgotten to do that Quicktype will only report:

```
Error: Internal error: We got an empty string type.
```

or another similar error - its not always the same one!

It can be very hard to figure out in which file the problem occurs. Generally, to figure out where an issue is, you can enable Quicktype's debug output by adding `--debug all` or `--debug print-schema-resolving` to the arguments assembled in s2tQuicktypeUtil.js or by taking the command it constructs (printed to the console) and manually add the option and re-run the command. If you're lucky, the error will be hit during the resolution steps which will point to the file(s) with an issue (often a disagreement between types combined with `allOf`).
