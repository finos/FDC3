# Desktop Agent Bridging

The FDC3 Desktop Agent API addresses interoperability between apps running within the context of a single Desktop Agent (DA), facilitating cross-application workflows. Desktop Agent Bridging addresses the interconnection of desktop agents (DAs) such that apps running under different desktop agents can also interoperate, allowing workflows to span multiple desktop agents.

In any desktop agent bridging scenario, it is expected that each DA is being operated by the same user (as the scope of FDC3 contemplates cross-application workflows for a single user, rather than cross-user workflows), although DAs may be run on different machines operated by the same user.

## Open questions / TODO list

* Define handshake, authentication and naming protocol
  * Should auth be optional? E.g. triggered by a challenge?

* How do we resolve differing state on channels (app/user/private) when a new DA joins the bridge?
  * Problems
    * DA joins the bridge on startup with no context on its channels, another DA already joined to the bridge has a different context on several channels
    * DA joins the bridge after it has context on a channel, another DA already joined to the bridge has a different context on the same named channel
      * N.B. current context is not just most recent context, but most recent of each type.
    * App channels are not normally discoverable in the FDC3 API, what about under bridging? When should context on an app channel be shared with other agents?
    * How do Private channels differ (as they are 'owned' by an app on a particular DA)?
  * Solutions
    * Assume bridge is up on start-up (system service) and that all DAs will connect to it as the first thing they do.
      * ❌ Some DAs may retain state between sessions
    * Ignore current context entirely, it will synchronize after one or messages have been sent.
      * ⚠ ignores the problem, but it very simple to implement
    * Get current context from other DAs when an app adds a context listener or calls `channel.getCurrentContext()` or `fdc3.joinChannel()`
      * ❌ Which DA's state takes priority? No obvious answer
      * Spreads out complexity throughout use, rather than getting it over with
    * Add an init flow where DAs share info about channels they have with context on them already
      * ✔️ Does actually solve the problem
      * ⚠ Requires sharing of known channels and current state (this type of discovery of channels does not happen in the regular FDC3 API).
      * ⚠ Requires state in the bridge.
      * ⚠ Which DA's state takes priority?
        * First to join bridge? Last to join bridge? use timestamps?
        * Most recently sent context might be from the last to join...
      * ⚠ Need to ensure agents join bridge serially so first/state of the first is known

* Who collates responses to queries (e.g. findIntent, raiseIntent, findInstances etc.)? Bridge or requesting DA?
  * How to handle slow responding DAs? Should there be a recommended timeout?
  * Should an agent that is repeatedly timing out be disconnected?
    * Should other agents report to users on connect/disconnect events?

* Select recommended port range for bridge

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
    A <--> E
    E <--> B
    E <--> C
    D <--> E
```

Other possible topologies include peer-to-peer or client/server networks, however, these introduce significant additional complexity into multiple aspects of the bridging protocol that must be implemented by desktop agents, (including discovery, authentication and message routing), where a star topology/standalone bridge enables a relatively simple set of protocols, with the most difficult parts being implemented in the bridge itself.

Whilst the standalone bridge represents a single point of failure for the interconnection of desktop agents, it will also be significantly simpler than a full desktop agent implementation. Further, failures may be mitigated by setting the bridge up as a system service, such that it is started when the user's computer is started and may be restarted automatically if it fails. In the event of a bridge failure or manual shutdown, then desktop agents will no longer be bridged and should act as single agents.

In Financial services it is not unusual for a single user to be working with applications on more than one desktop. As desktop agents do not span desktops bridging desktop agents across multiple machines is an additional use case for desktop agent bridging. However, as FDC3 only contemplates interoperability between apps for a single user, it is expected that in multi-machine use cases each machine is being operated by the same user.

### Technology & Service Discovery

Connections between desktop agents and the Desktop Agent Bridge will be made via websocket connections, with the bridge acting as the websocket server and each connected desktop agent as a client.

The bridge MUST run on the same machine as the desktop agents, and the websocket MUST be bound to the loopback adapter IP address (127.0.0.1), ensuring that the websocket is not exposed to wider networks.

Bridge implementations SHOULD default to binding the websocket server to a port in the recommended port range XXXX - XXYY, enabling simple discovery of a running bridge via attempting socket connections to ports in that range and attempting a handshake (as defined later in this proposal) that will identify the websocket as belong to a Desktop Agent Bridge. A port range is used, in preference to a single nominated port, in order to enable the automatic resolution of port clashes with other services.

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

TBD

#### Bridging Desktop Agent on Multiple Machines

As the bridge binds its websocket on the loopback address (127.0.0.1) it cannot be connected to from another device. Hence, an instance of the standalone bridge may be run on each device and those instances exchange messages in order to implement the bridge cross-device.

However, cross-machine routing is an internal concern of the Desktop Agent Bridge, with each desktop agent simply communicating with a bridge instance located on the same machine. The connection protocol between bridges themselves is implementation specific and beyond the scope of this standard. Further, as FDC3 only contemplates interoperability between apps for a single user, it is expected that in multi-machine use cases each machine is being operated by the same user. However, methods of verifying the identity of user are currently beyond the scope of this Standard.

### Connection Protocol

On connection to the bridge handshake, authentication and name assignment steps must be completed. These allow:

* The desktop agent to confirm that it is connecting to an FDC3 Desktop Agent Bridge, rather than another service exposed via a websocket.
* The bridge to require that the desktop agent authenticate itself, allowing it to control access to the network of bridged desktop agents.
* The desktop agent to request a particular name by which it will be addressed by other agents and for the bridge to assign the requested name, after confirming that no other agent is connected with that name, or a derivative of that name if it is already in use.
  * The bridge is ultimately responsible for assigning each desktop agent a name and for routing messages using those names. Desktop agents MUST accept the name they are assigned by the bridge.

#### Step 1. Handshake

Exchange standardized hello messages that identify:

* That the server is a bridge, including: 
  * implementation details for logging by DA.
  * supported FDC3 version(s).
* That the client is an FDC3 DA, including:
  * implementation details (ImplementationMeta returned by fdc3.getInfo() call) for logging by DA and sharing with other DAs.
    * already includes supported FDC3 version.
  * request for a specific agent name.

#### Step 2. Authentication (optional?)

If auth is enabled:

* Bridge sends auth challenge
* DA must reply with credentials

TBD:

* What is the auth scheme?
  * JWT token? or similar (return signature for some challenge data using private key)
    * Bridge will need to be configured with credentials (public keys) for each agent that should be able to connect.
    * Agents will need to be configured with credentials (private key).
  * Preshared access token
    * Simpler to configure, less secure
  * Some form of SSO, e.g. OAuth
    * Most complex to integrate
    * Can confirm same user on each agent
  * Integrated Windows auth?
    * Platform specific, but could confirm same user on each agent

If auth fails, server disconnects socket.
If auth succeeds move to next step.

#### Step 3. Auth Confirmation and Name Assignment

TBD:

* Receive back auth confirmation and assigned name
  * Name to appear in ImplementationMetadata when retrieved locally through `fdc3.getInfo()`
    * Note: own name is rarely used by the desktop agent, but useful to log for debugging purposes

#### Step 4. Synchronize channel state

TBD:

* Details of the current state of channels (of DAs already connected to the bridge) may need to shared so that the incoming agent can have its state synchronized with the bridged group of agents.

##### Channels

It is assumed that Desktop Agents SHOULD adopt the recommended 8 channel set (and the respective display metadata). Desktop Agents MAY support channel customization through configuration.
The Desktop Agent Bridge MAY support channel mapping ability to deal with channel differences that can arise.

#### Step 5. Connected agents update

To enable logging of connected agents and (optional) targeted API calls (e.g. `raiseIntent` to a specific agent), the details of all agents connected to the bridge is shared with all other agents connected to the bridge.

TBD:

* Message sent with names of *all* desktop agents connected to bridge to *all* connected agents
  * Message reissued whenever an agent connects or disconnects

## Interactions between Desktop Agents

The use of Desktop Agent Bridging affects how a desktop agent must handle FDC3 API calls. Details on how this affects the FD3 API and how a desktop agent should interact with other agents over the bridge are provided below in this section.  

### Handling FDC3 calls When Bridged

#### WIP

Desktop Agents that are bridged will need to wait for responses from other DAs before responding to API calls. For resilience, this may mean defining timeouts.

Different types of call

* fire and forget, e.g. broadcast
* request/response
  * send request, await responses
  * who collates responses and implements timeouts (bridge or DA)?

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
