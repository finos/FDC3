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


## Generic request and response formats

### Request:
```typescript
{
   /** Unique guid for this request */
   requestGuid: string,
   /** Timestamp at which request was generated */
   timestamp:  date,
   /** FDC3 function name message relates to, e.g. "findIntent" */
   type:  string,
   /** Request body, containing the arguments to the function called.*/
   body: {
       //example fields for specific messages... wouldn't be specified in base type
       channel?: string,
       intent?: string,
       context?: Context,
       //fields for other possible arguments
   },
   /** Agent request received from, filled in by server on receipt of message */
   sourceAgent?: string
}
```

### Response:
Responses will be differentiated by the presence of a `responseGuid` field.
```typescript
{
    /** Value from request*/
    requestGuid: string,
    /** Unique guid for this response */
    responseGuid:  string,
    /** Timestamp at which request was generated */
    timestamp:  Date,
    /** FDC3 function name the original request related to, e.g. "findIntent" */
    type:  string, //same as request value
    /** Response body */
    body: {
        //example fields for specific messages... wouldn't be specified in base type
        intent?:  string,
        appIntent?:  AppIntent,
        //fields for other possible response values
    },
    /** Agent response received from, filled in by server on receipt of message */
    sourceAgent?: string,
    /** sourceAgent from request,  used to route response */
    targetAgent: string
}
```
Clients should send these messages on to the 'server', which will add the `sourceAgent` metadata. Further, when processing responses, the agent acting as the 'server' should augment any `AppMetadata` objects in responses with the the same id applied to sourceAgent.


## Individual message exchanges

Assume that we have 3 agents connected by bridge: agent-A, agent-B and agent-C. agent-C provides a websocket server that agent-A and agent-B have connected to.

### For broadcasts on channels
Only needs a single message (no response)
An app on agent-A does:
```javascript
fdc3.broadcast(contextObj);
``` 
or 
```javascript
(await fdc3.getOrCreateChannel("myChannel")).broadcast(contextObj)
```

It encodes this as a message which it sends to the websocket server(hosted by agent-C):

```JSON
{
    "requestGuid": "some-guid-string-here",
    "timestamp": "2020-03-...",
    "type": "broadcast",
    "body": {
        "channel": "myChannel",
        "context": { /*contxtObj*/ }
    }
}
```

which it repeats on to Agent-B with the `sourceAgent` metadata added:
```JSON
{
    "requestGuid": "some-guid-string-here",
    "timestamp": "2020-03-...",
    "type": "broadcast",
    "body": {
        "channel": "myChannel",
        "context": { /*contxtObj*/}
    },
    "sourceAgent": "agent-A"
}
```


### findIntent
```typescript
findIntent(intent: string, context?: Context): Promise<AppIntent>;
```

#### Request format:

A findIntent call is made on agent-A. 
```javascript
let appIntent = await fdc3.findIntent();
```

It sends an outward message to the other desktop agents (sent from A -> C):
```JSON
{
   "requestGuid": "4dd60b3b-9835-4cab-870c-6b9b099ed7ae",
   "timestamp": "2020-03-...",
   "type": "findIntent",
   "body": {
       "intent": "StartChat",
       "context": {/*contxtObj*/}
   }
}
```

which is repeated from C -> B as:
```JSON
{
    "requestGuid": "4dd60b3b-9835-4cab-870c-6b9b099ed7ae",
    "timestamp": 2020-03-...,
    "type": "findIntent",
    "body": {
        "intent": "StartChat",
        "context": {/*contxtObj*/},
    },
    "sourceAgent": "agent-A"
}
```

Note that the `sourceAgent` field has been populated with the id of the agent that raised the requests, enabling the routing of responses.

#### Response format

Normal response from:agent A, where the request was raised (a websocket client)
```JSON
{
    "intent": { "name": "StartChat", "displayName": "Chat" },
    "apps": [
        { "name": "myChat" }
    ]
}
```

Desktop agent B (a websocket client) woud produce response:
```JSON
{
    "intent": { "name": "StartChat", "displayName": "Chat" },
    "apps": [
        { "name": "Skype" },
        { "name": "Symphony" },
        { "name": "Symphony", "instanceId": "93d2fe3e-a66c-41e1-b80b-246b87120859" },
        { "name": "Slack" }
    ]
}
```

which is sent back over the bridge by Agent B -> C as a response to the request message as:
```JSON
{
    "requestGuid": "4dd60b3b-9835-4cab-870c-6b9b099ed7ae",
    "responseGuid":  "b4cf1b91-0b64-45b6-9f55-65503d507024",
    "timestamp":  2020-03-...,
    "type":  "findIntent",
    "body": {
        "intent":  "StartChat",
        "appIntent":  {
            "intent":  { "name": "StartChat", "displayName": "Chat" },
            "apps": [
                { "name": "Skype"},
                { "name": "Symphony" },
                { "name": "Symphony", "instanceId": "93d2fe3e-a66c-41e1-b80b-246b87120859" },
                { "name": "Slack" }
            ]
        }
    },
    "targetAgent": "agent-A"
}
```

Which gets repeated by the websocket server (agent-C) in augmented form as:
```JSON
{
    "requestGuid": "4dd60b3b-9835-4cab-870c-6b9b099ed7ae",
    "responseGuid":  "b4cf1b91-0b64-45b6-9f55-65503d507024",
    "timestamp":  2020-03-...,
    "type":  "findIntent",
    "body": {
        "intent":  "StartChat",
        "appIntent":  {
            "intent":  { "name": "StartChat", "displayName": "Chat" },
            "apps": [
                { "name": "Skype", "agent": "agent-B"},
                { "name": "Symphony", "agent": "agent-B" },
                { "name": "Symphony", "instanceId": "93d2fe3e-a66c-41e1-b80b-246b87120859", "agent": "agent-B" },
                { "name": "Slack", "agent": "agent-B" }
            ]
        }
    },
    "targetAgent": "agent-A",
    "sourceAgent": "agent-B"
}
```

Desktop agent C (the websocket server) also sends its own response:
```JSON
{
    "intent":  { "name": "StartChat", "displayName": "Chat" },
    "apps": [
       { "name": "WebIce"}
    ]
}
```

which it encodes as a message:
```JSON
{
    "requestGuid": "4dd60b3b-9835-4cab-870c-6b9b099ed7ae",
    "responseGuid":  "988a49c8-49c2-4fb4-aad4-be39d1471834",
    "timestamp":  2020-03-...,
    "type":  "findIntent",
    "body": {
        "intent":  "StartChat",
        "appIntent":  {
            "intent":  { "name": "StartChat", "displayName": "Chat" },
            "apps": [
            { "name": "WebIce", "agent": "agent-C"}
            ]
        }
    },
    "targetAgent": "agent-A",
    "sourceAgent": "agent-C"
}
```
Then on agent-A the originating app finally gets back the following response from the FDC3 desktop "agent":
```JSON
{
    "intent":  { "name": "StartChat", "displayName": "Chat" },
    "apps": [
        { "name": "myChat" }, // local to this agent
        { "name": "Skype", "agent": "agent-B" }, //agent-B responses
        { "name": "Symphony", "agent": "agent-B" },
        { "name": "Symphony", "instanceId": "93d2fe3e-a66c-41e1-b80b-246b87120859", "agent": "agent-B" },
        { "name": "Slack", "agent": "agent-B" },
        { "name": "WebIce", "agent": "agent-C"} //agent C response
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