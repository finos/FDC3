---
id: spec
sidebar_label: Overview
title: API Bridging Overview (next)
---

The FDC3 Desktop Agent API addresses interoperability between apps running within the context of a single Desktop Agent (DA), facilitating cross-application workflows. Desktop Agent API Bridging addresses the interconnection of desktop agents (DAs) such that apps running under different desktop agents can also interoperate, allowing workflows to span multiple desktop agents.

In any desktop agent bridging scenario, it is expected that each DA is being operated by the same user (as the scope of FDC3 contemplates cross-application workflows for a single user, rather than cross-user workflows), although DAs may be run on different machines operated by the same user.

## Open questions / TODO list

* Handshake
  * Confirm we want to add optional auth token to `hello` message coming from the bridge for DA to authenticate the bridge? (Two-way authentication)
* Channel State Synchronization
  * Add details about potential race conditions or workflows broken by disconnection
  * Handling race conditions - e.g. on startup apps might load and start broadcasting state immediately - concurrent with the desktop agent connecting to the bridge and receiving state
    * Handle handshakes sequentially one at a time
    * Atomic operations for broadcasts and channel synchronization messages
    * Other suggestions?
* Define generic protocol for interacting with the bridge when handling fdc3 API calls
  * Handle of slow responding DAs?
    * Recommended timeout of 2500ms/3000ms
  * An agent that is repeatedly timing out should be disconnected?
  * Advise on whether other agents report to users on connect/disconnect events?
* Confirm recommended port range for bridge - (4475 - 4575)


## Connection Overview

### Topology

In order to implement Desktop Agent Bridging some means for desktop agents to connect to and communicate with each other is needed. This Standard assumes that Desktop Agent Bridging is implemented via a standalone 'bridge' which each agent connects to and will use to route messages to or from other agents. This topology is similar to a star topology in networking, where the Desktop Agent Bridge (a 'bridge') will be the central node acting as a router.

```mermaid
flowchart TD;
    A[DA A]
    B[DA B]
    C[DA C]
    D[DA D]
    E{Bridge} 
    A <--> |websocket| E
    E <--> |websocket| B
    E <--> |websocket| C
    D <--> |websocket| E
    E --> |loopback - 127.0.0.1| E
```

Other possible topologies include peer-to-peer or client/server networks, however, these introduce significant additional complexity into multiple aspects of the bridging protocol that must be implemented by desktop agents, (including discovery, authentication and message routing), where a star topology/standalone bridge enables a relatively simple set of protocols, with the most difficult parts being implemented in the bridge itself.

Whilst the standalone bridge represents a single point of failure for the interconnection of desktop agents, it will also be significantly simpler than a full desktop agent implementation. Further, failures may be mitigated by setting the bridge up as a system service, such that it is started when the user's computer is started and may be restarted automatically if it fails. In the event of a bridge failure or manual shutdown, then desktop agents will no longer be bridged and should act as single agents.

In Financial services it is not unusual for a single user to be working with applications on more than one desktop. As desktop agents do not span desktops bridging desktop agents across multiple machines is an additional use case for desktop agent bridging. However, as FDC3 only contemplates interoperability between apps for a single user, it is expected that in multi-machine use cases each machine is being operated by the same user.

### Technology & Service Discovery

Connections between desktop agents and the Desktop Agent Bridge will be made via websocket connections, with the bridge acting as the websocket server and each connected desktop agent as a client.

The bridge MUST run on the same machine as the desktop agents, and the websocket MUST be bound to the loopback adapter IP address (127.0.0.1), ensuring that the websocket is not exposed to wider networks.

Bridge implementations SHOULD default to binding the websocket server to a port in the recommended port range 4475 - 4575, enabling simple discovery of a running bridge via attempting socket connections to ports in that range and attempting a handshake (as defined later in this proposal) that will identify the websocket as belong to a Desktop Agent Bridge. A port range is used, in preference to a single nominated port, in order to enable the automatic resolution of port clashes with other services.

Both DAs and bridge implementations MUST support at least connection to the recommended port range and MAY also support configuration for connection to an alternative bridging port range.

As part of the Desktop Agent Bridging protocol, a bridge will implement "server" behavior by:

* Accepting connections from client desktop agents, receiving and authenticating credentials and assigning a name (for routing purposes)
* Receiving requests from client desktop agents.
* Routing requests to client desktop agents.
* Receiving responses (and collating?) from client desktop agents.
* Routing responses to client desktop agents.

A desktop agent will implement "client" behavior by:

* Connecting to the bridge, providing authentication credentials and receiving an assigned named (for purposes)
* Forwarding requests to the bridge.
* Awaiting response(s) (and collating them?) from the bridge.
* Receiving requests from the bridge.
* Sending responses to the bridge.

Hence, message paths and propagation are simple. All messages to other desktop agents are passed to the bridge for routing and all messages (both requests and responses) are received back from it, i.e. the bridge is responsible for all message routing.

#### Collating responses

Whilst some FDC3 requests are fire and forget (e.g. broadcast) the main requests such as `findIntent` or `raiseIntent` expect a response. In a bridging scenario, the response can come from multiple Desktop Agents and therefore need to be aggregated and augmented before they are sent back to the requesting DA.

The DAB is the responsible entity for collating responses together from all DAs. Whilst this approach may add some complexity to bridge implementations, it will simplify DA implementations since they only need to handle one response.

The DAB MUST allow for timeout configuration.

The Bridge SHOULD also implement timeout for waiting on DA responses. Assuming the message exchange will be all intra-machine, a recommended timeout of 2500ms/3000ms at most, should be implemented.

#### Channels

It is assumed that Desktop Agents SHOULD adopt the recommended 8 channel set (and the respective display metadata). Desktop Agents MAY support channel customization through configuration.

The Desktop Agent Bridge MAY support channel mapping ability to deal with channel differences that can arise.

A key responsibility of the DAB is ensuring that the channel state of the connected agents is kept in-sync, which requires an initial synchronization step as part of the connection protocol.

#### Bridging Desktop Agent on Multiple Machines

As the bridge binds its websocket on the loopback address (127.0.0.1) it cannot be connected to from another device. Hence, an instance of the standalone bridge may be run on each device and those instances exchange messages in order to implement the bridge cross-device.

However, cross-machine routing is an internal concern of the Desktop Agent Bridge, with each desktop agent simply communicating with a bridge instance located on the same machine. The connection protocol between bridges themselves is implementation specific and beyond the scope of this standard. Further, as FDC3 only contemplates interoperability between apps for a single user, it is expected that in multi-machine use cases each machine is being operated by the same user. However, methods of verifying the identity of user are currently beyond the scope of this Standard.

### Connection Protocol

On connection to the bridge's websocket, a handshake must be completed that may include an authentication step before a name is assigned  to the desktop agent for use in routing messages. The purpose of the handshake is to allow:

* The desktop agent to confirm that it is connecting to an FDC3 Desktop Agent Bridge, rather than another service exposed via a websocket.
* The bridge to require that the desktop agent authenticate itself, allowing it to control access to the network of bridged desktop agents.
* The desktop agent to request a particular name by which it will be addressed by other agents and for the bridge to assign the requested name, after confirming that no other agent is connected with that name, or a derivative of that name if it is already in use.

The bridge is ultimately responsible for assigning each desktop agent a name and for routing messages using those names. Desktop agents MUST accept the name they are assigned by the bridge.

#### Step 1. Handshake

Exchange standardized hello messages that identify:

* That the server is a bridge, including:
  * implementation details for logging by DA.
  * supported FDC3 version(s).
* That the client is an FDC3 DA, including:
  * implementation details (ImplementationMeta returned by fdc3.getInfo() call) for logging by DA and sharing with other DAs.
    * already includes supported FDC3 version.
  * request for a specific agent name.

```mermaid
sequenceDiagram
    participant DA as Desktop Agent A
    participant DAB as Desktop Agent Bridge
    participant DB as Desktop Agent B
    participant DC as Desktop Agent C
    DA ->>+ DAB: connect
    DAB ->>+ DA: hello
    DA ->>+ DAB: handshake
    DAB ->>+ DA: connectedAgentsUpdate
    DAB ->>+ DB: connectedAgentsUpdate
    DAB ->>+ DC: connectedAgentsUpdate

```

When a new connection is made to the DAB websocket, it sends a `hello` message, including its metadata.

```typescript
{
    type: "hello",
    payload: {
        desktopAgentBridgeVersion: number,
        supportedFDC3Versions: string[],
        authRequired: boolean,
        /** The DAB JWT authentication token */
        authToken?: string
    },
    meta: {
        timestamp: date
    }
}
```

A Desktop Agent can use the structure of this message to determine that it has connected to a Desktop Agent Bridge (i.e by checking `msg.type === "hello" && msg.payload.desktopAgentBridgeVersion`), whether it supports a compatible FDC3 version and whether it is expected to provide authentication credentials in the next step (`if(msg.payload.authRequired) { ... }`).

An optional JWT token can be included in the `hello` message to allow the connecting agent to authenticate the bridge. Verification of the JWM by the DA is option but recommended, meaning that the DA SHOULD verify the received JWT when one is included in the `hello` message.

DA should respond to the `hello` message with a `handshake` request to the bridge, including an auth token (JWT) if required.

```typescript
{
    type:  "handshake",
    /** Request body, containing the arguments to the function called.*/
    payload: {
        /** The JWT authentication token */
        authToken?: string,
        /** DesktopAgent implementationMetadata trying to connect to the bridge */
        implementationMetadata: ImplementationMetadata,
        /** The requested DA name */
        requestedName: string,
        /** The current state of the Desktop Agent's channels, excluding any private channels,
         *  as a mapping of channel id to an array of Context objects, most recent first.*/
        channelsState: Record<string, Context[]>
    },
    meta: {
        /** Unique GUID for this request */
        requestGuid: string,
        /** Timestamp at which request was generated */
        timestamp:  date
    }
}
```

#### Step 2. Authentication (optional?)

If requested by the server, the JWT auth token payload should take the form:

```typescript
{
    "sub": string, // UUID for the keypair used to sign the token
    "iat": date    // timestamp at which the the token was generated as specified in ISO 8601
}
```

e.g.
```JSON
{
    "sub": "65141135-7200-47d3-9777-eb8786dd31c7",
    "iat": "2022-07-06T10:11:43.492Z"
}
```

Note that the `sub` SHOULD be a UUID that does NOT need to match the name requested by the Desktop Agent. It will be used to identify the keypair that should be used to validate the JWT token. Further, multiple Desktop Agent's MAY share the same keys for authentication and hence the same `sub`, but they will be assigned different names for routing purposes by the DAB. If an agent disconnects from the bridge and later re-connects it MAY request and be assigned the same name it connected with before.

#### Step 3. Auth Confirmation and Name Assignment

The DAB will extract the authentication token `sub` from the JWT token's claims and then verify the token's signature against any public key it has been configured with. If the signature can't be verified, the bridge should respond with the below authentication failed message and the socket should be disconnected by the bridge.

```typescript
{
    type:  "authenticationFailed",
    meta: {
        /** Timestamp at which response was generated */
        timestamp:  date,
        /** GUID for the handshake request */
        requestGuid: string,
        /** Unique guid for this message */
        responseGuid: string,
    }
}
```

If authentication succeeds (or is not required), then the DAB should assign the Desktop Agent, and associated socket connection, the name requested in the `handshake` message, unless another agent is already connected with that name in which case it should generate a new name which MAY be derived from the requested name.

#### Step 4. Synchronize the bridge's channel state

Channels are the only stateful mechanism in the FDC3 that we have to consider. A key responsibility of the DAB is ensuring that the channel state of the connected agents is kept in-sync. To do so, the states must be synchronized whenever a new agent connects. Hence, the Bridge must process the `channelState` provided by the new agent in the `handshake` request containing details of each known User Channel or App Channel and its state, compare it to its own representation of the current state of channels in connected agents, merge that state with that of the new agent and communicate the updated state to connected agents to ensure that they are synchronized with it.

Channel state of agents's already connected to the bridge should take precedence over agents that are connecting. However, if all agent's disconnect from the bridge it should reset (clear) its internal state and adopt that of the first agent to connect. The state of any Private channels does not need to be included as these can only be retrieved via a raised intent.

When an agent connects to the bridge, it should adopt the state of any channels that do not currently exist or do not currently contain state of a particular type. This synchronization is NOT performed via broadcast of context as it may result in an older context, of a type not already found on the channel being merged into the channel (and subsequently broadcast to context listeners with a matching type).

The incoming `channelsState` should be merged with the `existingChannelsState` as follows:

```typescript
Object.keys(channelsState).forEach((channelId) => {
    if (!existingChannelsState[channelId]) {
        //unknown channel, just aodopt its state
        existingChannelsState[channelId] = channelsState[channelId];
    } else {
        //known channel merge state, with existing state taking precedence
        const currentState = existingChannelsState[channelId];
        const incoming = channelsState[channelId];
        incoming.forEach((context) => {
            if (!currentState.find(element => element.type === context.type)){
                currentState.push(context);
            } 
            // ignore any types that are already known and 
            // preserve most recent channel state by adding to the end of the array           
        });
    }
});
```

For the scenario of multiple agents connecting to the Desktop Agent Bridge at the same time, this portion of the handshake should be handled by the DAB serially to ensure correct channel state synchronization.

#### Step 5. Connected agents update

The updated `existingChannelsState` will then be shared with all connected agents along with updated details of all connected agents via a `connectedAgentsUpdate` message sent to all connected sockets. The newly connected agent will receive both its assigned name and channel state via this message. The `connectedAgentsUpdate` message will be linked to the handshake request by quoting the `meta.requestGuid` of the `handshake` message.

The `connectedAgentsUpdate` message will take the form:

```typescript
{
    type:  "connectedAgentsUpdate",
    /** Request body, containing the arguments to the function called.*/
    payload: {
        /** Should be set when an agent first connects to the bridge and provide its assigned name. */
        addAgent?: string,
        /** Should be set when an agent disconnects from the bridge and provide the name that no longer is assigned. */
        removeAgent?: string,
        /** Desktop Agent Bridge implementation metadata of all connected agents. 
         *  Note that this object is extended to include a `desktopAgent` field with the name assigned by the DAB. */
        allAgents: ImplementationMetadata[],
        /** The updated state of channels that should be adopted by the agents. SHOULD only be set when an agent is connecting to the bridge. */
        channelsState?: ChannelState[] // see step4
    },
    meta: {
        /** For a new connection, should be the same as the handshake requestGuid. 
         *  Should be the same as the responseGuid for a disconnection.
        */
        requestGuid: string,
        /** Unique guid for this message */
        responseGuid: string,
        /** Timestamp at which response was generated */
        timestamp:  date,
    }
}
```

When applying the updated channel state, it should be noted that desktop agents will not have context listeners for previously unknown channels, and can simply record that channel's state for use when that channel is first used. For known channel names, the Desktop Agent must also compare its current state to that which it has just received and may need to broadcast context to existing connected listeners. As context listeners can be registered for either a specific type or all types some care is necessary when doing so (as the most recently transmitted Context should be received by un-typed listeners). Hence, updating listeners for a known channel should be performed as follows:

1. The incoming channel state `channelState` for a particular channel should be processed from last (oldest) to first.
2. If there is no current context of that type, broadcast it to listeners of that specific type only.
3. If there is a current context of that type, and it does not match the incoming object exactly, broadcast it to listeners of that specific type only.
4. If the most recent (first in the incoming array) type OR value of that type doesn't match the most recent context broadcast on the channel, broadcast it to un-typed listeners only.

After applying the `connectedAgentsUpdate` message, the newly connected desktop agent and other already connected agents are able to begin communicating through the bridge.

Channel state synchronization messages from the DAB to Desktop Agents should be handled atomically to prevent message overlap with `fdc3.broadcast`, `channel.broadcast`, `fdc3.addContextListener` or `channel.getCurrentContext`.

#### Step 6. Disconnects

Although not part of the connection protocol, it should be noted that the `connectedAgentsUpdate` message sent in step 5 should also be sent whenever an agent disconnects from the bridge to update other agents. If any agents remain connected, then the `channelState` does not change and can be omitted. However, if the last agent disconnects the bridge SHOULD discard its internal `channelState`, instead of issuing the update.



## Interactions between Desktop Agents

The use of Desktop Agent Bridging affects how a desktop agent must handle FDC3 API calls. Details on how this affects the FD3 API and how a desktop agent should interact with other agents over the bridge are provided below in this section.  

### Handling FDC3 calls When Bridged

TBC - describe generic protocol for working with the bridge for both fire and forget and request/response type calls.


### Identifying Desktop Agents Identity and Message Sources

In order to target intents and perform other actions that require specific routing between DAs, DAs need to have an identity. Identities should be assigned to clients when they connect to the bridge, although they might request a particular identity. This allows for multiple copies of the same underlying desktop agent implementation to be bridged and ensures that id clashes can be avoided.

To prevent spoofing and to simplify the implementation of clients, sender identities for bridging messages should be added, by the bridge to `AppIdentifier` objects embedded in them.

* Sender details to be added by the DAB to the embedded `AppIdentifier` objects.
  * `AppIdentifier` needs a new `desktopAgent` field
  * When a client connects to a DAB it should be assigned an identity of some sort, which can be used to augment messages with details of the agent
    * The DAB should do the assignments and could generate ids or accept them via config.
    * DAs don't need to know their own ids or even the ids of others, they just need to be able to pass around `AppIdentifier` objects that contain them.

#### AppIdentifier

`AppIdentifier` needs to be expanded to contain a `desktopAgent` field.

```typescript
interface AppIdentifier {
  readonly appId: string;
  readonly instanceId?: string;
  /** A string filled in by the bridge on receipt of a message, that represents 
   * the Desktop Agent that the app is available on. 
   **/
  readonly desktopAgent?: string;
}
```

### Identifying Individual Messages

There are a variety of message types we'll need to send between bridged DAs, several of which will need to be replied to specifically (e.g. a `fdc3.raiseIntent` call should receive and `IntentResponse` when an app has been chosen and the intent and context delivered to it). Hence, messages also need a unique identity.

* GUIDs required to uniquely identify messages
  * To be referenced in replies

This means that each request that gets generated, should contain a request GUID, and every response to a request should contain a response GUID AND reference the request GUID. A response the does not reference a request GUID should be considered invalid.

### Forwarding of Messages to Other Agents

//TODO: rewrite based on DA deciding to send to bridge, bridge forwards on
//if target specified, forward to specific agent only


The DAB MUST be able to forward messages received from one DA on to others (excluding obviously the Desktop Agent where the request was originated). There are a few simple rules which determine whether a message needs to be forwarded:

* the message does not have a target Desktop Agent (e.g. findIntent)
  * If you are a DA, send it on to the bridge
  * The bridge will send it on to other known DAs (except the source of the message)

* If the message has a target Desktop Agent (e.g. response to findIntent)
  * The bridge will forward the message to it.



## Generic request and response formats

//TODO explain basic message structure type/payload (original FDC3 call args/response), meta (routing info).

For simplicity, in this spec the request and response GUID will be just `requestGUID` and `responseGUID`. A GUID/UUID 128-bit integer number used to uniquely identify resources should be used.

### Request

```typescript
{
    /** FDC3 function name message relates to, e.g. "findIntent" */
    type:  string,
    /** Request body, containing the arguments to the function called.*/
    payload: {
        //example fields for specific messages... wouldn't be specified in base type
        channel?: string,
        intent?: string,
        context?: Context,
        //fields for other possible arguments
    },
    meta: {
        /** Unique guid for this request */
        requestGuid: string,
        /** Timestamp at which request was generated */
        timestamp:  date,
         /** AppIdentifier source request received from */
        source?: AppIdentifier
    }
}
```

### Response

Responses will be differentiated by the presence of a `responseGuid` field and MUST reference the `requestGuid` that they are responding to.

```typescript
{
    /** FDC3 function name the original request related to, e.g. "findIntent" */
    type:  string,
    /** Response body */
    payload: {
        //example fields for specific messages... wouldn't be specified in base type
        intent?:  string,
        appIntent?:  AppIntent,
        //fields for other possible response values
    },
    meta: {
        /** Value from request*/
        requestGuid: string,
        /** Unique guid for this response */
        responseGuid:  string,
        /** Timestamp at which request was generated */
        timestamp:  Date,
        /** AppIdentifier source request received from */
        source?: AppIdentifier,
        /** AppIdentifier destination response sent from */
        destination?: AppIdentifier
    }
}
```

DAs should send these messages on to the bridge, which will add the `source.desktopAgent` metadata. Further, when processing responses, the bridge should also augment any `AppIdentifier` objects in responses with the the same id applied to `source.desktopAgent`.

## Individual message exchanges

The sections below cover most scenarios for each of the Desktop Agent methods in order to explore how this protocol might work.

Each section assumes that we have 3 agents connected by a bridge:

* agent-A
* agent-B
* agent-C
* DAB

## Context

### broadcast (on channels)

Only needs a single message (no response).

An app on agent-A does:

```javascript
fdc3.broadcast(contextObj);
```

or

```javascript
(await fdc3.getOrCreateChannel("myChannel")).broadcast(contextObj)
```

```mermaid
sequenceDiagram
    participant DA as Desktop Agent A
    participant DAB as Desktop Agent Bridge
    participant DB as Desktop Agent B
    participant DC as Desktop Agent C
    DA ->>+ DAB: Broadcast
    DAB ->>+ DB: Broadcast
    DAB ->>+ DC: Broadcast
```

It encodes this as a message which it sends to the DAB

```JSON
// agent-A -> DAB
{
    "type": "broadcast",
    "payload": {
        "channel": "myChannel",
        "context": { /*contextObj*/ }
    },
    "meta": {
        "requestGuid": "requestGuid",
        "timestamp": "2020-03-...",
        "source": {
            "name": "...",
            "appId": "...",
            "version": "...",
            // ... other metadata fields
        }
    }
}
```

which it repeats on to agent-B AND agent-C with the `source.desktopAgent` metadata added.

```JSON
// DAB -> agent-B
// DAB -> agent-C
{
    "type": "broadcast",
    "payload": {
        "channel": "myChannel",
        "context": { /*contextObj*/}
    },
    "meta": {
        "requestGuid": "requestGuid",
        "timestamp": "2020-03-...",
        "source": {
            "desktopAgent": "agent-A",
            "name": "...",
            "appId": "...",
            "version": "...",
            // ... other metadata fields
        },
    }
}
```

When adding context listeners (either for User Channels or specific App Channels) no messages need to be exchanged. Instead, upon receiving a broadcast message the Desktop Agent just needs to pass it on to all listeners on that named channel.

## Intents

### findIntent

```typescript
findIntent(intent: string, context?: Context): Promise<AppIntent>;
```

```mermaid
sequenceDiagram
    participant DA as Desktop Agent A
    participant DAB as Desktop Agent Bridge
    participant DB as Desktop Agent B
    participant DC as Desktop Agent C
    DA ->>+ DAB: findIntent
    DAB ->>+ DB: findIntent
    DB -->>- DAB: findIntentResponse (B)
    DAB ->>+ DC: findIntent
    DC -->>- DAB: findIntentResponse (C)
    DAB -->>- DA: findIntentResponse (B + C)
```

#### Request format

A findIntent call is made on agent-A.

```javascript
let appIntent = await fdc3.findIntent();
```

Sends an outward message to the DAB.

```JSON
// agent-A -> DAB
{
   "type": "findIntent",
   "payload": {
        "intent": "StartChat",
        "context": {/*contextObj*/}
   },
   "meta": {
        "requestGuid": "requestGuid",
        "timestamp": "2020-03-...",
        "source": {
            "name": "",
            "appId": "",
            "version": "",
            // ... other metadata fields
        }
   }
}
```

The DAB fills in the `source.desktopAgent` field and forwards the request to the other desktop agents (agent-B AND agent-C).

```JSON
// DAB -> agent-B
// DAB -> agent-C
{
    "type": "findIntent",
    "payload": {
        "intent": "StartChat",
        "context": {/*contextObj*/},
    },
    "meta": {
        "requestGuid": "requestGuid",
        "timestamp": "2020-03-...",
        "source": {
            "desktopAgent": "agent-A", // filled by DAB
            "name": "",
            "appId": "",
            "version": "",
            // ... other metadata fields
        }
    }
}
```

Note that the `source.desktopAgent` field has been populated with the id of the agent that raised the requests, enabling the routing of responses.

#### Response format

Normal response from agent-A, where the request was raised.

```JSON
{
    "intent": { "name": "StartChat", "displayName": "Chat" },
    "apps": [
        { "name": "myChat" }
    ]
}
```

DA agent-B would produce response:

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

which is sent back over the bridge as a response to the request message as:

```JSON
// agent-B -> DAB
{
    "type":  "findIntentResponse",
    "payload": {
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
    "meta": {
        "requestGuid": "requestGuid",
        "responseGuid":  "responseGuidAgentB",
        "timestamp":  "2020-03-...",
        "destination": {
            "desktopAgent": "agent-A",
            "name": "",
            "appId": "",
            "version": "",
            // ... other metadata fields
        }
    }
}
```

Note the response guid generated by the agent-B and the reference to the request guid produced by agent-A where the request was originated.

This response gets repeated by the bridge in augmented form as:

```JSON
{
    "type":  "findIntentResponse",
    "payload": {
        "intent":  "StartChat",
        "appIntent":  {
            "intent":  { "name": "StartChat", "displayName": "Chat" },
            "apps": [
                { "name": "Skype", "desktopAgent": "agent-B"},
                { "name": "Symphony", "desktopAgent": "agent-B" },
                { "name": "Symphony", "instanceId": "93d2fe3e-a66c-41e1-b80b-246b87120859", "desktopAgent": "agent-B" },
                { "name": "Slack", "desktopAgent": "agent-B" }
            ]
        }
    },
    "meta": {
        "requestGuid": "requestGuid",
        "responseGuid":  "responseGuidAgentB",
        "timestamp":  "2020-03-...",
        "destination": {
            "desktopAgent": "agent-A",
            "name": "",
            "appId": "",
            "version": "",
            // ... other metadata fields
        },
        "source": {
            "desktopAgent": "agent-B",
        }
    }
}
```

DA agent-C would produce response:

```JSON
{
    "intent":  { "name": "StartChat", "displayName": "Chat" },
    "apps": [
       { "name": "WebIce"}
    ]
}
```

which is sent back over the bridge as a response to the request message as:

```JSON
// agent-C -> DAB
{
    "type":  "findIntentResponse",
    "payload": {
        "intent":  "StartChat",
        "appIntent":  {
            "intent":  { "name": "StartChat", "displayName": "Chat" },
            "apps": [
                { "name": "WebIce", "desktopAgent": "agent-C"}
            ]
        }
    },
    "meta": {
        "requestGuid": "requestGuid",
        "responseGuid":  "responseGuidAgentC",
        "timestamp":  "2020-03-...",
        "destination": {
           "desktopAgent": "agent-A",
           "name": "",
           "appId": "",
           "version": "",
           // ... other metadata fields
       }
    }
}
```

This response gets repeated by the bridge in augmented form as:

```JSON
{
    "type":  "findIntentResponse",
    "payload": {
        "intent":  "StartChat",
        "appIntent":  {
            "intent":  { "name": "StartChat", "displayName": "Chat" },
            "apps": [
                { "name": "WebIce", "desktopAgent": "agent-C"}
            ]
        }
    },
    "meta": {
        "requestGuid": "requestGuid",
        "responseGuid":  "responseGuidAgentC",
        "timestamp":  "2020-03-...",
        "destination": {
           "desktopAgent": "agent-A",
           "name": "",
           "appId": "",
           "version": "",
           // ... other metadata fields
       },
       "source": {
            "desktopAgent": "agent-C",
        }
    }
}
```

Then on agent-A the originating app finally gets back the following response from the bridge:

```JSON
// DAB -> agent-A
{
    "intent":  { "name": "StartChat", "displayName": "Chat" },
    "apps": [
        { "name": "myChat" }, // local to this agent
        { "name": "Skype", "desktopAgent": "agent-B" }, //agent-B responses
        { "name": "Symphony", "desktopAgent": "agent-B" },
        { "name": "Symphony", "instanceId": "93d2fe3e-a66c-41e1-b80b-246b87120859", "desktopAgent": "agent-B" },
        { "name": "Slack", "desktopAgent": "agent-B" },
        { "name": "WebIce", "desktopAgent": "agent-C"} //agent C response
    ]
}
```

### raiseIntent

```typescript
raiseIntent(intent: string, context: Context, app?: TargetApp): Promise<IntentResolution>;
```

For Desktop Agent bridging, a `raiseIntent` call MUST always pass a `app:TargetApp` argument. If one is not passed a `findIntent` will be sent instead to collect options to display in a local resolver UI, allowing for a targeted intent to be raised afterwards. See details below.

When receiving a response from invoking `raiseIntent` the new app instances MUST be fully initialized ie. the responding Desktop Agent will need to return an `AppIdentifier` with an `instanceId`.

Note that the below diagram assumes a `raiseIntent` WITH a `app:TargetApp` was specified and therefore agent-C is not involved.

```mermaid
sequenceDiagram
    participant DA as Desktop Agent A
    participant DAB as Desktop Agent Bridge
    participant DB as Desktop Agent B
    participant DC as Desktop Agent C
    DA ->>+ DAB: raiseIntent
    DAB ->>+ DB: raiseIntent
    DB -->>- DAB: intentResolution
    DAB -->>- DA: intentResolution
    DB ->>+ DAB: intentResult
    DAB ->>+ DA: intentResult
```

#### Request format

A raiseIntent call, __without__ `app:TargetApp` argument is made on agent-A.

```typescript
raiseIntent(intent: string, context: Context): Promise<IntentResolution>;
```

agent-A sends an outward `findIntent` message to the DAB:

```JSON
// agent-A -> DAB
{
    "type": "findIntent",
    "payload": {
        "intent": "StartChat",
        "context": {/*contextObj*/}
    },
    "meta": {
        "requestGuid": "requestGuid",
        "timestamp": "2020-03-...",
        "source": {
            "name": "someOtherApp", //should this be the desktop agent or the app?
            "appId": "...",
            "version": "...",
            // ... other metadata fields
        }
    }
}
```

This will trigger the same flow as `findIntent`. Upon receiving a `findIntentResponse`, the resolver is shown.

User selects an option which will trigger a `raiseIntent` call with a `app:TargetApp` argument.

---

A `raiseIntent` call is made on agent-A which targets an `AChatApp` in agent-B.

```typescript
raiseIntent(intent: string, context: Context, app: TargetApp): Promise<IntentResolution>;
```

```JSON
// agent-A -> DAB
{
    "type": "raiseIntent",
    "payload": {
        "intent": "StartChat",
        "context": {/*contextObj*/},
        "app": {
            "name": "AChatApp",
            "desktopAgent": "agent-B"
        }
    },
    "meta": {
        "requestGuid": "requestGuid",
        "timestamp": "2020-03-...",
        "source": {
                "name": "someOtherApp",
                "appId": "...",
                "version": "...",
                // ... other metadata fields
        },
        "destination": { // duplicates the app argument so that the message is routed like any other
                "app": {
                "name": "AChatApp",
                "desktopAgent": "agent-B"
            }
        }
    }
}
```

The bridge fills in the `source.desktopAgent` field and forwards the request to the target desktop agent

```JSON
// DAB -> agent-B
{
    "type": "raiseIntent",
    "payload": {
        "intent": "StartChat",
        "context": {/*contextObj*/},
    },
    "meta": {
        "requestGuid": "requestGuid",
        "timestamp": "2020-03-...",
        "source": {
            "name": "someOtherApp",
            "appId": "...",
            "version": "...",
            "desktopAgent": "agent-A" // <---- filled by DAB
            // ... other metadata fields
        },
        "destination": {
            "app": {
                "name": "AChatApp",
                "desktopAgent": "agent-B"
            }
        },
    }
}
```

#### Response format

Normal response from agent-B, where the request was targeted to by agent-A. It sends this `intentResolution` as soon as it delivers the `raiseIntent` to the target app

```JSON
// agent-B -> DAB
{
    "type": "intentResolution",
    "payload": {
        "intent": "StartChat",
        "source": {
            "name": "AChatApp",
            "appId": "",
            "version": "",
            // ... other metadata fields
        },
        "version": "...",
    },
    "meta": {
        "requestGuid": "requestGuid",
        "responseGuid": "intentResolutionResponseGuid",
        "timestamp": "2020-03-...",
        "error?:": "ResolveError Enum",
        "source": { //Note this was the destination of the raised intent
            "name": "AChatApp",
            "appId": "",
            "version": "",
            // ... other metadata fields
        },
        "destination": { 
            "app": { //note this was the source of the raised intent
            "name": "someOtherApp",
            "appId": "",
                "version": "",
                "desktopAgent": "agent-A"
                // ... other metadata fields
            }
        }
    }
}
```

The bridge will fill in the `source.DesktopAgent` and relay the message on to agent-A

```JSON
// DAB -> agent-A
{
    "type": "intentResolution",
    "payload": {
        "intent": "StartChat",
        "source": {
            "name": "AChatApp",
            "appId": "",
            "version": "",
            "desktopAgent": "agent-B" // filled by DAB
            // ... other metadata fields
        },
        "version": "...",
    },
    "meta": {
        "requestGuid": "requestGuid",
        "responseGuid": "intentResolutionResponseGuid",
        "timestamp": "2020-03-...",
        "source": {
            "name": "AChatApp",
            "appId": "",
            "version": "",
            "desktopAgent": "agent-B" // filled by DAB
            // ... other metadata fields
        },
        "destination": { // duplicates the app argument
            "app": {
               "name": "someOtherApp",
               "appId": "",
                "version": "",
                "desktopAgent": "agent-A"
                // ... other metadata fields
           }
       }
    }
}
```

When `AChatApp` produces a response, or the intent handler finishes running, it should send a further `intentResult` message to send that response onto the intent raiser (or throw an error if one occurred)

```JSON
// agent-B -> DAB -> agent-A
{
    "type": "intentResult",
    "payload?:": {
        "channel": {
            "id": "channel 1",
            "type": "system"
        },
        "context": {/*contextObj*/} // in alternative to channel
    },
    "meta": {
        "requestGuid": "requestGuid",
        "responseGuid": "intentResultResponseGuid",
        "timestamp": "2020-03-...",
        "error?:": "ResultError Enum",
        "source": {
            "name": "AChatApp",
            "appId": "",
            "version": "",
            "desktopAgent": "agent-B" // filled by DAB
            // ... other metadata fields
        },
        "destination": { // duplicates the app argument
            "app": {
               "name": "someOtherApp",
               "appId": "",
                "version": "",
                "desktopAgent": "agent-A"
                // ... other metadata fields
           }
       }
    }
}
```

If intent result is private channel:

```JSON
// agent-B -> DAB -> agent-A
{
    "type": "intentResult",
    "payload?:": {
        "channel": {
            "id": "channel a",
            "type": "private"
        },
        "context": {/*contextObj*/} // in alternative to channel
    },
    "meta": {
        "requestGuid": "requestGuid",
        "responseGuid": "intentResultResponseGuid",
        "timestamp": "2020-03-...",
        "error?:": "ResultError Enum",
        "source": {
            "name": "AChatApp",
            "appId": "",
            "version": "",
            "desktopAgent": "agent-B" // filled by DAB
            // ... other metadata fields
        },
        "destination": { // duplicates the app argument
            "app": {
            "name": "someOtherApp",
            "appId": "",
                "version": "",
                "desktopAgent": "agent-A"
                // ... other metadata fields
            }
        }
    }
}
```

---
`onSubscribe` to the private channel sent to server:

```JSON
// agent-A -> DAB
{
    "type": "privateChannelSubscribe",
    "payload": {},
    "meta": {
        "requestGuid": "requestGuid",
        "timestamp": "2020-03-...",
        "source": {
            "name": "AChatApp",
            "appId": "",
            "version": "",
            // ... other metadata fields
        },
        "destination": { // duplicates the app argument
            "app": {
            "name": "someOtherApp",
            "appId": "",
                "version": "",
                "desktopAgent": "agent-B"
                // ... other metadata fields
            }
        }
    }
}
```

The bridge will add in the source agent (agent-A) and forward the message to destination (agent-B)

```JSON
// DAB -> agent-B
{
    "type": "privateChannelSubscribe",
    "payload": {},
    "meta": {
        "requestGuid": "requestGuid",
        "timestamp": "2020-03-...",
        "source": {
            "name": "AChatApp",
            "appId": "",
            "version": "",
            "desktopAgent": "agent-A"
            // ... other metadata fields
        },
            "destination": { // duplicates the app argument
                "app": {
                "name": "someOtherApp",
                "appId": "",
                    "version": "",
                    "desktopAgent": "agent-B"
                    // ... other metadata fields
            }
        }
    }
}
```

---
`onUnsubscribe` to the private channel sent to the bridge

```JSON
// agent-A -> DAB
{
    "type": "privateChannelUnsubscribe",
    "payload": {},
    "meta": {
        "requestGuid": "requestGuid",
        "timestamp": "2020-03-...",
        "source": {
            "name": "AChatApp",
            "appId": "",
            "version": "",
            // ... other metadata fields
        },
        "destination": { // duplicates the app argument
            "app": {
               "name": "someOtherApp",
               "appId": "",
                "version": "",
                "desktopAgent": "agent-B"
                // ... other metadata fields
           }
       }
    }
}
```

The bridge will add in the source agent (agent-A) and forward the message to destination (agent-B)

```JSON
// DAB -> agent-B
{
    "requestGuid": "requestGuid",
    "timestamp": "2020-03-...",
    "type": "privateChannelUnsubscribe",
    "payload": {},
    "meta": {
        "source": {
            "name": "AChatApp",
            "appId": "",
            "version": "",
            "desktopAgent": "agent-A",
            // ... other metadata fields
        },
        "destination": { // duplicates the app argument
            "app": {
               "name": "someOtherApp",
               "appId": "",
                "version": "",
                "desktopAgent": "agent-B"
                // ... other metadata fields
           }
       }
    }
}
```

---
`onDisconnect` to the private channel sent to the bridge

```JSON
// agent-A -> DAB
{
    "type": "privateChannelDisconnect",
    "payload": {},
    "meta": {
        "requestGuid": "requestGuid",
        "timestamp": "2020-03-...",
        "source": {
            "name": "AChatApp",
            "appId": "",
            "version": "",
            // ... other metadata fields
        },
        "destination": { // duplicates the app argument
            "app": {
               "name": "someOtherApp",
               "appId": "",
                "version": "",
                "desktopAgent": "agent-B"
                // ... other metadata fields
           }
       }
    }
}
```

The bridge will add in the source agent (agent-A) and forward the message to destination (agent-B)

```JSON
// DAB -> agent-B
{
    "type": "privateChannelDisconnect",
    "payload": {},
    "meta": {
        "requestGuid": "requestGuid",
        "timestamp": "2020-03-...",
        "source": {
            "name": "AChatApp",
            "appId": "",
            "version": "",
            "desktopAgent": "agent-A"
            // ... other metadata fields
        },
        "destination": { // duplicates the app argument
            "app": {
               "name": "someOtherApp",
               "appId": "",
                "version": "",
                "desktopAgent": "agent-B"
                // ... other metadata fields
           }
       }
    }
}
```

### open

```typescript
open(app: TargetApp, context?: Context): Promise<AppIdentifier>;
```

When receiving a response from invoking `fdc3.open` the new app instances MUST be fully initialized ie. the responding Desktop Agent will need to return an `AppIdentifier` with an `instanceId`.

#### Request format

A `fdc3.open` call is made on agent-A.

```javascript
// Open an app without context, using the app name
let instanceMetadata = await fdc3.open('myApp');

// Open an app without context, using an AppIdentifier object to specify the target
let AppIdentifier = {name: 'myApp', appId: 'myApp-v1.0.1', version: '1.0.1'};
let instanceMetadata = await fdc3.open(AppIdentifier);

// Open an app without context, using an AppIdentifier object to specify the target and Desktop Agent
let AppIdentifier = {name: 'myApp', appId: 'myApp-v1.0.1', version: '1.0.1', desktopAgent:"DesktopAgentB"};
let instanceMetadata = await fdc3.open(AppIdentifier);
```

The `fdc3.open` command should result in a single copy of the specified app being opened and its instance data returned, or an error if it could not be opened. There are two possible scenarios:

1) The Desktop Agent that the app should open on is specified
2) The Desktop Agent that the app should open on is NOT specified app

The first case (target Desktop Agent is specified) is simple:

* If the local Desktop Agent is the target, handle the call normally
* Otherwise:
  * Request is sent to the bridge
  * DAB checks to see if any of the connected DAs is the target and transmit the call to it and awaits a response
  * otherwise return `OpenError.AppNotFound`

The second case is a little trickier as we don't know which agent may have the app available:

* If the local Desktop Agent has the app, open it and exit.
* Otherwise:
  * Request is sent to the bridge
  * Bridge will query each connected DA asynchronously and await a response
    * If the response is `AppIdentifier` then return it and exit (ignore every subsequent response)
    * If the response is `OpenError.AppNotFound` and there are pending responses, wait for the next response
    * If the response is `OpenError.AppNotFound` and there are NO pending responses, return `OpenError.AppNotFound`

```mermaid
sequenceDiagram
    participant DA as Desktop Agent A
    participant DAB as Desktop Agent Bridge
    participant DB as Desktop Agent B
    participant DC as Desktop Agent C
    DA ->>+ DAB: Open Chart
    DAB ->>+ DB: Open Chart
    DAB ->>+ DC: Open Chart
    DB ->> DB: App NOT Found
    DB -->>- DAB: OpenError.AppNotFound
    DC ->> DC: App Found
    DC ->> DC: Open App
    DC -->>- DAB: Return App Data
    DAB -->>- DA: Augmented App Data
```

__When the target Desktop Agent is set__

```mermaid
sequenceDiagram
    participant DA as Desktop Agent A
    participant DAB as Desktop Agent Bridge
    participant DB as Desktop Agent B
    participant DC as Desktop Agent C
    DA ->>+ DAB: Open App
    DAB ->>+ DC: Open App
    DC ->> DC: Desktop agent in list and App Found
    DC ->>x DC: Open App
    DC -->>- DAB: Return App Data
    DAB -->>- DA: Return App Data
```

It sends an outward message to the bridge:

```JSON
// agent-A -> DAB
{
    "type": "open",
    "payload": {
        "AppIdentifier": {
            "name": "myApp",
            "appId": "myApp-v1.0.1",
            "version": "1.0.1",
            "desktopAgent":"agent-B"
            },
        "context": {/*contextObj*/}
    },
    "meta": {
        "requestGuid": "requestGuid",
        "timestamp": "2020-03-...",
    }
}
```

which is repeated as:

```JSON
// DAB -> agent-B
{
    "type": "open",
    "payload": {
        "AppIdentifier": {
            "name": "myApp",
           "appId": "myApp-v1.0.1",
           "version": "1.0.1",
           "desktopAgent":"DesktopAgentB"
           },
       "context": {/*contextObj*/}
    },
    "meta": {
        "requestGuid": "requestGuid",
        "timestamp": 2020-03-...,
        "source": {
            "desktopAgent": "agent-A", // filled by DAB
            // ... other metadata fields
        }
    }
}
```

### findInstances

```typescript
findInstances(app: TargetApp): Promise<Array<AppIdentifier>>;
```

```mermaid
sequenceDiagram
    participant DA as Desktop Agent A
    participant DAB as Desktop Agent Bridge
    participant DB as Desktop Agent B
    participant DC as Desktop Agent C
    DA ->>+ DAB: Find Instances of App.
    DAB ->>+ DB: Find Instances of App
    DAB ->>+ DC: Find Instances of App
    DC --x DC: No Instance found
    DB ->> DB: App Instance found
    DB -->>- DA: Return App Data
```

## Channels

App Channels don't need specific messages sending for `fdc3.getOrCreateChannel` as other agents will be come aware of it when messages are broadcast.

However, `PrivateChannel` instances do require additional handling due to the listeners for subscription and disconnect. Please see the raiseIntent section for the messages sent in support of this functionality.
