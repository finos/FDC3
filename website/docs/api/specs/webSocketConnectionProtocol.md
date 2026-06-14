---
id: webSocketConnectionProtocol
title: WebSocket Connection Protocol (WSCP)
sidebar_label: WebSocket Connection Protocol
description: Handshake protocol for native applications connecting to a Desktop Agent over WebSocket.
---

:::info _[@experimental](../../fdc3-compliance#experimental-features)_

FDC3's WebSocket Connection Protocol (WSCP) is an experimental feature. Limited aspects of its design may change in future versions.

:::

# WebSocket Connection Protocol (WSCP)

WSCP establishes identity and instance binding between a **native application** and a **Desktop Agent (DA)** over a WebSocket transport. After the handshake completes, the connection carries [Desktop Agent Communication Protocol (DACP)](./desktopAgentCommunicationProtocol.md) messages unchanged.

WSCP is distinct from the [Web Connection Protocol (WCP)](./webConnectionProtocol.md), which is used for browser `postMessage` / iframe discovery only. Native and other non-browser clients MUST use WSCP (not WCP) for the WebSocket handshake.

## Messages

| Type | Sent by | Purpose |
|------|---------|---------|
| [`WSCPApplicationConnect`](pathname:///schemas/next/api/WSCPApplicationConnect.schema.json) | Native application | Application connect message |
| [`WSCPDesktopAgentConnect`](pathname:///schemas/next/api/WSCPDesktopAgentConnect.schema.json) | Desktop Agent | Desktop Agent connect message |
| [`WSCPConnectFailed`](pathname:///schemas/next/api/WSCPConnectFailed.schema.json) | Acceptor | Handshake failure |
| [`WSCPGoodbye`](pathname:///schemas/next/api/WSCPGoodbye.schema.json) | Either | Graceful disconnect |

All WSCP messages derive from [`WSCPConnectionStep`](pathname:///schemas/next/api/WSCPConnectionStep.schema.json).

The handshake uses **two role-specific connect messages**. Each party always sends its own connect message shape; only the **order** depends on who opened the WebSocket TCP connection:

- The **TCP initiator** sends its role's connect message first, **including `sharedSecret`**.
- The **acceptor** validates the initiator's `sharedSecret` and responds with its own role's connect message (**without `sharedSecret`**), or with [`WSCPConnectFailed`](#wscpconnectfailed) on failure.

Connect messages include `meta.connectionAttemptUuid` and `meta.timestamp`, following the same conventions as WCP.

## Message fields

WSCP messages share a common envelope derived from [`WSCPConnectionStep`](pathname:///schemas/next/api/WSCPConnectionStep.schema.json).

`webSocketUrl` is not carried in any message; it is deployment configuration used only when opening the TCP connection (e.g. `ws://host/fdc3/ws`).

A value for `meta.connectionAttemptUuid` MUST be generated as a version 4 UUID according to [IETF RFC 4122](https://datatracker.ietf.org/doc/html/rfc4122) by the TCP initiator at the start of the handshake. The acceptor MUST quote the same value in its response so both parties can correlate the exchange.

`meta.timestamp` fields are formatted as strings according to [ISO 8601-1:2019](https://www.iso.org/standard/70907.html), e.g. `(new Date()).toISOString()`.


### `sharedSecret`

The `sharedSecret` is the **pairing credential** that binds a WebSocket handshake to a specific native application instance within a specific FDC3 user session. It is minted and held by the Desktop Agent (for example when launching an app or when the user pairs an app in the DA UI) and presented on the wire by whichever party opens the TCP connection.

Each `sharedSecret` is scoped to exactly one `(fdc3Session, appInstance)` pair. It implicitly identifies the FDC3 session — there is no separate `sessionId` field in WSCP messages. The acceptor uses the secret to:

1. **Authenticate the initiator** — confirm that the connecting party is allowed to join this session.
2. **Route to the correct FDC3 session** — associate the WebSocket with the right user context on the Desktop Agent.
3. **Bind or resume an app instance** — on first use, create a new `appId` / `instanceId` assignment; on subsequent connects with the same secret, reattach the existing instance (superseding any prior WebSocket for that instance).

The TCP **initiator** MUST include `sharedSecret` in its connect message. The **acceptor** validates the secret from that message and MUST NOT echo it back in its response — the response is an acknowledgment only. Both parties MUST persist the `sharedSecret` locally for the lifetime of the app instance so that reconnection after interruption repeats the same two-message handshake, with the initiator presenting the same secret again.

| | |
|---|---|
| **Sent by** | TCP initiator only (`WSCPApplicationConnect` or `WSCPDesktopAgentConnect`, depending on flow) |
| **Validated by** | TCP acceptor |
| **Scoped to** | One `(fdc3Session, appInstance)` pair |
| **Persisted by** | Both parties until the app instance ends |

### `WSCPApplicationConnect`

Sent by the native application during the handshake.

When the application is the **TCP initiator** ([flow 1](#flow-1-application-initiated-connection)), it MUST include `sharedSecret`:

```json
{
  "type": "WSCPApplicationConnect", // identifies this message type
  "payload": {
    "protocolVersion": "1.0", // WSCP version; MUST be "1.0" for this specification
    "sharedSecret": "a1b2c3d4-e5f6-7890-abcd-ef1234567890" // pairing credential scoped to one (fdc3Session, appInstance) pair
  },
  "meta": {
    "connectionAttemptUuid": "79be3ff9-7c05-4371-842a-cf08427c174d", // generated by the TCP initiator; quoted in the acceptor's response
    "timestamp": "2026-06-11T14:30:00.000Z" // ISO 8601 time the message was sent
  }
}
```

When the application is the **acceptor** ([flow 2](#flow-2-desktop-agent-initiated-connection)), it MUST NOT include `sharedSecret` — the credential was already presented by the DA in [`WSCPDesktopAgentConnect`](#wscpdesktopagentconnect):

```json
{
  "type": "WSCPApplicationConnect",
  "payload": {
    "protocolVersion": "1.0"
  },
  "meta": {
    "connectionAttemptUuid": "79be3ff9-7c05-4371-842a-cf08427c174d", // MUST match the initiator's connect message
    "timestamp": "2026-06-11T14:30:00.200Z"
  }
}
```

- The application MUST persist `sharedSecret` locally for the lifetime of the app instance (whether received at launch or validated from the initiator's message).

### `WSCPDesktopAgentConnect`

Sent by the Desktop Agent during the handshake. Carries [`ImplementationMetadata`](../ref/Metadata#implementationmetadata) — the same shape returned by [`fdc3.getInfo()`](../ref/DesktopAgent#getinfo). Assigned app identity (`appId`, `instanceId`) is carried in `implementationMetadata.appMetadata`.

When the DA is the **TCP initiator** ([flow 2](#flow-2-desktop-agent-initiated-connection)), it MUST include `sharedSecret`:

```json
{
  "type": "WSCPDesktopAgentConnect", // identifies this message type
  "payload": {
    "protocolVersion": "1.0",
    "sharedSecret": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "implementationMetadata": {
      // same shape as fdc3.getInfo() — see ImplementationMetadata in the API spec
      "fdc3Version": "2.2",
      "provider": "ExampleDA",
      "providerVersion": "1.0.0",
      "optionalFeatures": {
        "OriginatingAppMetadata": true
      },
      "appMetadata": {
        // assigned app identity — MUST include appId and instanceId
        "appId": "my-native-app",
        "instanceId": "instance-42"
      }
    }
  },
  "meta": {
    "connectionAttemptUuid": "79be3ff9-7c05-4371-842a-cf08427c174d", // generated by the TCP initiator
    "timestamp": "2026-06-11T14:30:00.100Z"
  }
}
```

When the DA is the **acceptor** ([flow 1](#flow-1-application-initiated-connection)), it MUST NOT include `sharedSecret` — the credential was already presented by the application in [`WSCPApplicationConnect`](#wscpapplicationconnect):

```json
{
  "type": "WSCPDesktopAgentConnect",
  "payload": {
    "protocolVersion": "1.0",
    "implementationMetadata": {
      "fdc3Version": "2.2",
      "provider": "ExampleDA",
      "providerVersion": "1.0.0",
      "optionalFeatures": {
        "OriginatingAppMetadata": true
      },
      "appMetadata": {
        "appId": "my-native-app",
        "instanceId": "instance-42"
      }
    }
  },
  "meta": {
    "connectionAttemptUuid": "79be3ff9-7c05-4371-842a-cf08427c174d", // MUST match the initiator's connect message
    "timestamp": "2026-06-11T14:30:00.100Z"
  }
}
```

- On reconnect, `implementationMetadata.appMetadata.appId` and `implementationMetadata.appMetadata.instanceId` MUST match the values previously assigned to the `sharedSecret` presented by the initiator.

### `WSCPConnectFailed`

Sent by the acceptor when the handshake fails. The initiator MUST NOT send DACP messages on the WebSocket after receiving this message.

```json
{
  "type": "WSCPConnectFailed", // identifies this message type
  "payload": {
    "message": "Invalid or unknown sharedSecret" // human-readable reason for the failure
  },
  "meta": {
    "connectionAttemptUuid": "79be3ff9-7c05-4371-842a-cf08427c174d", // MUST match the initiator's connect message
    "timestamp": "2026-06-11T14:30:00.100Z"
  }
}
```

- Common failure reasons include a missing or invalid `sharedSecret`, or a mismatch between supplied identity fields and the pairing record.
- The acceptor SHOULD close the WebSocket after sending this message.

### `WSCPGoodbye`

Sent by either party to indicate a graceful disconnect. This message has no `payload`.

```json
{
  "type": "WSCPGoodbye", // identifies this message type
  "meta": {
    "timestamp": "2026-06-11T15:00:00.000Z" // ISO 8601 time the message was sent
  }
}
```

- Unlike connect messages, `WSCPGoodbye` does not include `connectionAttemptUuid`.
- The acceptor SHOULD close the WebSocket after receiving `WSCPGoodbye` but SHOULD retain the `sharedSecret` mapping so a subsequent connect can resume the app instance.

## Connection scenarios

There are two connection scenarios, determined by which party opens the WebSocket TCP connection. **Reconnection after interruption uses the same exchange and the same `sharedSecret`** — there is no separate reconnect handshake.

| # | TCP initiator | First message | Second message |
|---|---------------|---------------|----------------|
| 1 | Application | `WSCPApplicationConnect` | `WSCPDesktopAgentConnect` |
| 2 | Desktop Agent | `WSCPDesktopAgentConnect` | `WSCPApplicationConnect` |

---

### Flow 1: Application-initiated connection

A native application opens a WebSocket to the Desktop Agent.

```mermaid
sequenceDiagram
    participant App as NativeApp
    participant DA as DesktopAgent

    App->>DA: Open WebSocket TCP
    App->>DA: WSCPApplicationConnect
    Note right of App: sharedSecret
    alt sharedSecret recognized (reconnect)
        DA->>App: WSCPDesktopAgentConnect
        Note left of DA: same appMetadata
        Note over DA: MUST replace prior WebSocket for this instance
    else sharedSecret new (first connect)
        DA->>App: WSCPDesktopAgentConnect
        Note left of DA: implementationMetadata with appMetadata
    end
    Note over App,DA: App persists sharedSecret. DACP begins
```

**Steps**

1. The user obtains `webSocketUrl` and `sharedSecret` from their DA UI, or the DA supplies them when launching the application (see [Launching native apps via protocol handlers](#launching-native-apps-via-protocol-handlers)).
2. The native application opens a WebSocket TCP connection to `webSocketUrl`.
3. The application sends `WSCPApplicationConnect` with `protocolVersion: 1.0` and `sharedSecret`.
4. The DA validates `sharedSecret`:
   - If the secret is recognized as belonging to an existing app instance, the DA reassigns the existing app instance to the new WebSocket and MUST supersede any prior WebSocket connection for that instance.
   - If the secret is new, the DA resolves the native `appId` from the pairing, creates a new app instance, and assigns a new `instanceId`.
5. The DA sends `WSCPDesktopAgentConnect` containing `implementationMetadata` (including `appMetadata` with the assigned `appId` and `instanceId`). It MUST NOT include `sharedSecret`.
6. The application persists `sharedSecret`.
7. Both parties exchange DACP messages on the same WebSocket.

**Failure outcomes**

- Missing or invalid `sharedSecret` → `WSCPConnectFailed`
- DACP messages sent before handshake completes → MUST be rejected

---

### Flow 2: Desktop Agent-initiated connection

The Desktop Agent opens a WebSocket to a native application that is **listening** as a WebSocket server (reverse direction).

```mermaid
sequenceDiagram
    participant DA as DesktopAgent
    participant App as NativeApp_WS_Server

    DA->>App: Open WebSocket TCP
    DA->>App: WSCPDesktopAgentConnect
    Note right of DA: sharedSecret, implementationMetadata
    alt sharedSecret recognized (reconnect)
        App->>DA: WSCPApplicationConnect
        Note left of App: ack only, no sharedSecret
        Note over App: MUST replace prior WebSocket for this instance
    else sharedSecret new (first connect)
        App->>DA: WSCPApplicationConnect
        Note left of App: validates sharedSecret
    end
    Note over DA,App: DA persists sharedSecret. DACP begins
```

**Steps**

1. The user provides the native app's listen `webSocketUrl` and `sharedSecret` to the DA.
2. The DA opens a WebSocket TCP connection to the application's `webSocketUrl`.
3. The DA sends `WSCPDesktopAgentConnect` with `sharedSecret` and `implementationMetadata`.
4. The application reads assigned identity from `implementationMetadata.appMetadata`.
5. The application validates `sharedSecret` from the DA's message and sends `WSCPApplicationConnect` with `protocolVersion` only (MUST NOT include `sharedSecret`). If the secret is recognized as belonging to an existing app instance, the application MUST supersede any prior WebSocket connection for that instance.
6. The DA persists `sharedSecret` for the lifetime of the app instance.
7. DACP begins.

**Failure outcomes**

- Invalid `sharedSecret` → `WSCPConnectFailed`

---

## Disconnection

Either party MAY send `WSCPGoodbye` before closing the WebSocket. The acceptor SHOULD close the connection after receiving `WSCPGoodbye` but SHOULD retain the `sharedSecret` mapping for the app instance so that a subsequent connect with the same `sharedSecret` can resume the session (mirroring WCP `WCP6Goodbye` behaviour).

## Security considerations

- `sharedSecret` SHOULD NOT appear in logs.
- `sharedSecret` is required in the TCP initiator's connect message only. The acceptor MUST NOT echo it back.
- `sharedSecret` MUST be scoped to a single `(fdc3Session, appInstance)` pair and SHOULD be unguessable.
- On reconnect, the acceptor MUST replace the prior WebSocket for the app instance identified by the `sharedSecret`.

## Launching native apps via protocol handlers

When the DA **launches** a native application (via a protocol handler, process spawn, or `open` call), it MAY pass WSCP parameters so the app can connect immediately — [flow 1](#flow-1-application-initiated-connection).

For launch, the DA SHOULD mint a `sharedSecret` scoped to the `(fdc3Session, appInstance)` pair it is creating. The application MUST persist this `sharedSecret` so that reconnection after interruption uses the same credential. Leakage via a protocol-handler URL (e.g. `myapp://launch?sharedSecret=...`) is mitigated by the unguessable nature of the secret and by transport-level protections on the WebSocket connection.

```mermaid
sequenceDiagram
    participant User
    participant DA as DesktopAgent
    participant OS as OS_ProtocolHandler
    participant App as NativeApp

    User->>DA: Open native app from directory
    DA->>DA: Mint sharedSecret for new appInstance
    DA->>OS: Launch via protocol handler
    Note right of DA: webSocketUrl, sharedSecret
    OS->>App: Start process
    App->>DA: WSCPApplicationConnect
    DA->>App: WSCPDesktopAgentConnect
    Note over App: Persists sharedSecret
    Note over App,DA: DACP begins
```

**Example: Java application launched by the DA**

1. The DA mints a `sharedSecret` and launches the app via a protocol handler URL, embedding `webSocketUrl` and `sharedSecret` as query parameters. For example:

   ```
   fdc3-java-app://launch?webSocketUrl=ws%3A%2F%2Flocalhost%3A8090%2Ffdc3%2Fws&sharedSecret=a1b2c3d4e5f67890
   ```

   (`webSocketUrl` MUST be percent-encoded because it contains reserved characters.)

2. The app unpacks the parameters and calls `GetAgent`.
