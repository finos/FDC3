# Notes
Need to product some description of a protocol, to be used over a websocket, for exchanging messages about FDC3 calls between Desktop Agents.
## Overall protocol details
* Sender details to be added by websocket server to top level messages AND any embedded AppMetadata objects.
    * AppMetadata needs a new `agent `field
    * When a client connects to a server it should be assigned an identity of some sort, which can be used to augment messages with details of the agent
        * The server should do the assignments and could generate ids or accept them via config.
        * Clients don't need to know their own ids or even the ids of others, they just need to be able to pass around AppMetadata objects that contain them.
* Preserve message path as it passes through different servers?
* GUIDs required to uniquely identify messages
    * To be referenced in replies
* Desktop agents that are bridged will need to wait for responses from other desktop agents before responding to API calls…
    * for resilience, this may mean defining timeouts
    * Desktop Agents may need GUIDs and / OR metadata - names?
## Individual message exchanges
### For broadcasts on channels
Only needs a single message (no response)
Somebody does `fdc3.broadcast(contextObj); `or`  \
(await fdc3.getOrCreateChannel(channelName)).broadcast(contextObj)`
```
{
   guid: "",
   timestamp: 2020-03-...,
   type: "broadcast",
   channel: channelName,
   context: contxtObj
}
```
 \
(server to add agent field)
### findIntent
```
findIntent(intent: string, context?: Context): Promise<AppIntent>;
```
#### Request format:
```
{
   requestGuid: string,
   timestamp: date,
   type: "findIntentRequest",
   intent: string
   context?: Context,
   sourceAgent?: string  //optional as filled in by server
}
```
E.g. Call outward to other desktop agents (sent from A -> C \
 \
`{`
```
   requestGuid: "4dd60b3b-9835-4cab-870c-6b9b099ed7ae",
   timestamp: 2020-03-...,
   type: "findIntentRequest",
   intent: "ViewInstrument"
   context?: contxtObj
}
```
And repeated from C -> B as:
```
{
   requestGuid: "4dd60b3b-9835-4cab-870c-6b9b099ed7ae",
   timestamp: 2020-03-...,
   type: "findIntentRequest",
   intent: "ViewInstrument"
   context?: contxtObj,
   sourceAgent: "agent-A"
}
```
#### Response format
```
{
   requestGuid: string
   responseGuid: string,
   timestamp: Date,
   type: "findIntentResponse",
   intent: string
   appIntent: AppIntent,
   sourceAgent?: string, //optional, filled in by server
   targetAgent: string
}
```
 \
Server should augment the AppIntent.apps[AppMetadata] objects with the desktop agent as well as the sourceAgent field. targetAgent field should always be filled in with the sourceAgent of the request \
E.g.
Normal response from:agent A (where the request was raised) - websocket client
```
{
    intent: { name: "StartChat", displayName: "Chat" },
    apps: [
        { name: "myChat" }
    ]
}
```
Desktop agent B - websocket client \
`{`
```
    intent: { name: "StartChat", displayName: "Chat" },
    apps: [
        { name: "Skype" },
        { name: "Symphony" },
        { name: "Symphony", instanceId: "93d2fe3e-a66c-41e1-b80b-246b87120859" },
        { name: "Slack" }
    ]
}
```
Desktop agent C - websocket server
```
{
    intent: { name: "StartChat", displayName: "Chat" },
    apps: [
       { name "WebIce"}
    ]
}
```
Sent back over the bridge (by Agent B - which happens to be a websocket client)  as:
```
{
    requestGuid: "4dd60b3b-9835-4cab-870c-6b9b099ed7ae",
    responseGuid: "b4cf1b91-0b64-45b6-9f55-65503d507024"
    timestamp: 2020-03-...,
    type: "findIntentResponse",
    intent: "StartChat",
    agent: undefined // can be undefined for server to fill in
    appIntent: {
        intent: { name: "StartChat", displayName: "Chat" },
        apps: [
            { name: "Skype"},
            { name: "Symphony" },
            { name: "Symphony", instanceId: "93d2fe3e-a66c-41e1-b80b-246b87120859" },
            { name: "Slack" }
        ]
    },
    targetAgent: "agent-A"
}
```
 \
Which gets repeated by a server (agent-C) in augmented form as:
```
{
    requestGuid: "4dd60b3b-9835-4cab-870c-6b9b099ed7ae",
    responseGuid: "b4cf1b91-0b64-45b6-9f55-65503d507024"
    timestamp: 2020-03-...,
    type: "findIntentResponse",
    intent: "StartChat",
    appIntent: {
        intent: { name: "StartChat", displayName: "Chat" },
        apps: [
            { name: "Skype", agent: "agent-B"},
            { name: "Symphony", agent: "agent-B" },
            { name: "Symphony", instanceId: "93d2fe3e-a66c-41e1-b80b-246b87120859", agent: "agent-B" },
            { name: "Slack", agent: "agent-B" }
        ]
     },
     targetAgent: "agent-A"
     sourceAgent: "agent-B"
}
```
Agent-C also sends its own response:
```
{
    requestGuid: "4dd60b3b-9835-4cab-870c-6b9b099ed7ae",
    responseGuid: "988a49c8-49c2-4fb4-aad4-be39d1471834"
    timestamp: 2020-03-...,
    type: "findIntentResponse",
    intent: "StartChat",
    appIntent: {
        intent: { name: "StartChat", displayName: "Chat" },
        apps: [
           { name "WebIce", agent: "agent-C"}
        ]
     },
     targetAgent: "agent-A"
     sourceAgent: "agent-C"
}
```
Then on agent-A the originating app finally gets back the following response from the FDC3 desktop agent C:
```
{
    intent: { name: "StartChat", displayName: "Chat" },
    apps: [
        { name: "myChat" }, // local to this agent
        { name: "Skype", agent: "agent-B" },
        { name: "Symphony", agent: "agent-B" },
        { name: "Symphony", instanceId: "93d2fe3e-a66c-41e1-b80b-246b87120859", agent: "agent-B" },
        { name: "Slack", agent: "agent-B" },
        { name "WebIce", agent: "agent-C"} //this came from another DA
    ]
}
```
### raiseIntent
```
raiseIntent(intent: string, context: Context, app?: TargetApp): Promise<IntentResolution>;
```
Note as IntentResolutions can now return a promise of result data there are multiple response formats required
#### Request format
#### Response format
#### Result Response format