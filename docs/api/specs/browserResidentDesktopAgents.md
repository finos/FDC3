# FDC for the Web: Browser-Resident Desktop Agent Specification

This document specifies the required behavior for Browser-Resident Desktop Agents (DA). Such agents allow FDC3 applications running directly in a browser to participate in FDC3 interop by way of a `getAgent()` function that is provided by FINOS. This approach is in contrast to "Preload DAs" which run on technology that allows the FDC3 interface to be injected (such as Electron, WebView or Browser Extension based implementations.)

> Note - Prior to FDC 3.0, only Preload DAs were supported.

> Note - Along with this specification, a new general connection strategy has been established for _all_ FDC3 compliant applications: FDC3 compliant apps SHOULD make use of the `@finos/fdc3` library to establish their FDC3 interface (a `DesktopAgent` object instance). Apps that follow these guidelines will be able to interop through either Browser-Resident DAs or Preload DAs without code modification. We refer to this concept as Write Once Run Anywhere (WORA).

> Note - This specification only applies to apps running in a browser and therefore assumes use of JavaScript and HTML APIs. Implementations in other languages such as .NET are not covered by this specification. 

This document only covers the requirements for _implementors of Browser-Resident DAs_. The `getAgent()` function that applications use to gain access to an fdc3 interface is provided by the `@finos/fdc3` library. Many behavioral details of `getAgent()` are purposefully omitted from this document in order to reduce the required scope of understanding. Please refer to the [getAgent() specification](getAgent.md) for information on how the client side operates.

> Note - When referencing "DA" in this document we will hereafter always mean a "Browser-Resident Desktop Agent" - code that runs in a browser page (iframe or window) and which conforms to this specification.

## Launching apps

As a prerequisite for running FDC3 in the browser, a DA must first exist as running code in a browser window (See failover functions for an exception to this rule). We will refer to this window as the "DA Window".

> Note - It is possible to have multiple DA Windows. For instance, a DA may propagate itself into new windows. Communications between DA Windows is an implementation detail.

When an app runs `getAgent()`, it checks for the existence of `window.parent`, `window.opener` and `window.parent.opener` (collectively called "Parents"). This function sends a "Handshake" message to each Parent via a `postMessage` in the hopes of discovering a DA.

If we run this logic in reverse we see that apps may be launched:

(1) By creating an iframe in a DA Window
(2) By calling `window.open` from a DA Window
(3) By creating an iframe in a window that was opened from a DA Window

> Note - This covers most typical cases but it leaves out more complex launching scenarios such as "daisy chains" (frame -> frame or open -> open) or allowing end users to open tabs in an adhoc manner. To cover these cases, DAs may choose to allow themselves to be opened as hidden iframes within app windows. See the section on hidden iframes at the end of this document.

## Responding to app instance connections - Web Connection Protocol (WCP)

DAs MUST run `addEventListener("message",...)` to receive incoming connection requests from apps. This will receive the initial `postMessage` "Handshake" messages from apps. Handshakes do not contain any identifying data. They contain only a "nonce" (a unique id).

Upon receiving an incoming Handshake the DA MUST:

1) Create a [MessageChannel](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API)
2) Set up a processing thread to receive and process BCP requests for this connection
3) Respond to the event's `source` window by echoing the nonce and transferring `port2` from the channel

Example WCP negotiation
```JavaScript
window.addEventListener("message", (event) => {
    const { origin, data, source } = event
    const channel = new MessageChannel()
    startBCPProcessing(event, channel) // See next step
    source.postMessage({ nonce: data.nonce }, origin, [channel.port2])
});
```

Alternatively for step 3, a DA MAY return a `url` instead of transferring a MessagePort. When `url` is provided in the response, `getAgent()` will open that `url` in a hidden iframe and initiate another WCP handshake with that frame.

Example WCP negotiation with URL
```JavaScript
window.addEventListener("message", (event) => {
    const { origin, data, source } = event
    source.postMessage({ nonce: data.nonce, url }, origin)
});
```

## Responding to app communications with Browser Communication Protocol (BCP)

BCP processing should begin by setting up an inactive connection instance. This instance will become active after the first BCP "WCPValidateAppIdentity" message is received and processed (or deleted if it fails). It is important to remember the WindowProxy (event.source).

An `instanceUuid` should be established at this point. This will be used in following steps.

```JavaScript
const startBCPProcessing(event, channel) => {
    const instanceUuid = uuid();
    const connection = {
        status: "inactive",
        windowProxy: event.source,
        origin: event.origin,
        channel,
        instanceUuid
    };
    connections[instanceUuid] = connection;
    channel.port1.onmessage = (e) => {
        processIncomingBCP(connection, e); // This function should switch based on message type
    }
}
```

### Step 1 - Validating a connection

The first BCP message received should be a "WCPValidateAppIdentity" message. With this message, the DA establishes or denies the connection.

1) If the message contains an `instanceUuid` field then the app window might have navigated or refreshed and simply require reconnecting on a previously established instance. The DA SHOULD reestablish the connection if the `instanceUuid`, `appId`, WindowProxy and origin match what is already on record. When a connection is reestablished the DA MUST respond with a valid "WCPValidateAppIdentityResponse" message.

2) If the message does not contain an `instanceUuid`, or the record does not match, then proceed to authenticate the application.

> Note - Apps that call `window.open()` to create new instances of themselves can appear to be their Parent. This is because browsers may clone SessionStorage for newly opened windows. When a child window calls `getAgent()` with the same appId as the parent window, it will appear to the DA that a navigation event occurred on the parent window (because `instanceUuid` will be set, and will appear to match the appId). DAs therefore MUST track the WindowProxy object that is used to establish each connection and use it as an additional comparison criteria.

Example BCP validation
```JavaScript
const processValidateAppIdentityBCP = (connection, e) => {
    const { data, source, origin } = e;

    if(data.payload?.instanceUuid) {
        const maybeExistingConnection = connections[data.payload.instanceUuid];
        // Maybe re-establish an existing connection that was lost due to page navigation
        if (data.payload?.appId === maybeExistingConnection.appId && connection.windowProxy === maybeExistingConnection.windowProxy && origin === maybeExistingConnection.origin) {
            // Close the ports that are now known to be defunct
            maybeExistingConnection.channel.port1.close();
            maybeExistingConnection.channel.port2.close();

            // Swap out the old and new connection
            connections[maybeExistingConnection.instanceUuid] = connection;
            delete connections[connection.instanceUuid];

            // Copy the old into the new. The transfer is now complete.
            connection.instanceUuid = maybeExistingConnection.instanceUuid;
            connection.instanceId = maybeExistingConnection.instanceId;
            connection.appId = maybeExistingConnection.appId;
            connection.appMetadata = maybeExistingConnection.appMetadata;
            connection.channel.port1.postMessage({
                type: "validateAppIdentityResponse",
                payload: {
                    desktopAgentDetails: {
                        agentType: "PARENT",
                        appId: data.appId,
                        instanceUUid: data.instanceUuid,
                        instanceId: connection.instanceId,
                    },
                    appMetaData: connection.appMetaData,
                    implementationMetadata // The DA's representation of itself as ImplementationMetadata type
                }
            }, connection.origin);
            return;
        }
    }
    authenticateApp(connection, e); // See next step
}
```

### Step 2 - Authentication

An app is authenticated by retrieving the app's AppD record and checking to ensure that the app's origin is contained in either the AppD record's `url` or `allowedOrigins` fields. Apps may provide either a fully qualified `appId` field (containing the domain of the AppD server) or a combination of `appId` and `appDUrl` fields (where `appDUrl` is the url of the AppD server). See [AppD endpoint specification](https://fdc3.finos.org/docs/app-directory/spec)

**Examples**

Each of these should result in a request to "https://myapp.com/appd/v2/apps/myApp"
`appId="myApp@myapp.com/appd`
`appId="myApp", appDUrl="https://muyapp.com/appd"`
`appDUrl="https://myapp.com/appd/v2/apps/myApp"`

The DA MUST validate the app's identity against the application's origin (protocol, domain and port) by positively matching it with either the `details.url` or `details.allowedOrigins` fields in the  _AppD record constructed from the WCPValidateAppIdentity message_.

> Note - The AppD record provided by the app may be different from the one that the DA used to launch the app. This is because a DA may launch apps from its own app directory or even without a directory. However, the responsibility to provide application identity _rests with its publisher_ (the entity that is _hosting_ the app) and hence DA's MUST reference the AppD record that is provided by the application itself for verification. DAs MAY choose to implement _additional_ identity verification procedures (such as comparison with their own configured app directories) and MAY choose to deny access to an application for any reason.

If authentication succeeds then the DA MUST respond with a "WCPValidateAppIdentityResponse" message which MUST include `ImplementationMetadata` (describing the DA), `AppMetadata` (describing the instance), and `DesktopAgentDetails` record (to support reconnecting after window navigation).

```JavaScript
const authenticateApp = (connection, e) => {
    const { data : {}, source, origin } = e;
    if(source!==connection.windowProxy) {
        // Message received from an unexpected window
        return;
    }
    const { appId, appDUrl } = data;
    const appDRecord = fetchAppDRecord(appId, appDUrl); // The DA implementor should implement AppD record fetching
    if ( originMatch(origin, appDRecord)) { // The DA implementor should build origin matching logic
        // The DA may implement any other validation here
        // The DA may perform any internal record keeping here
        connection.status = "active";
        connection.appId = appId; // Should be the resolved fully qualified appId
        connection.instanceId = uuid();
        connection.appMetadata = new AppMetadata(); // To be set by the DA
        connection.channel.port1.postMessage({
            type: "WCPValidateAppIdentityResponse",
            payload: {
                desktopAgentDetails: {
                    appId: data.appId,
                    instanceUUid: connection.instanceUuid,
                    instanceId: connection.instanceId,
                },
                appMetaData: connection.appMetaData,
                implementationMetadata // The DA's representation of itself as ImplementationMetadata type
            }
        }, connection.origin)
    } else {
        connection.port.postMessage({
            type: "WCPValidateAppIdentityResponse",
            payload: {
                error: `Origin "${origin}" for "${appId}" didn't match AppD record`
            }
        }, connection.origin)
    }
}
```

### Step 3 - DesktopAgent Operations (BCP)

Each message should be responded to with its corresponding response when a response should contain data, or with `BCPAck` if only an acknowledgement is required.

See [Browser Communication Protocol](./browserCommunicationProtocol.md)

See bcp.ts for a full list of BCP messages. 

## Implementing DAs in hidden iframes

DA providers can leverage hidden iframes to establish a communication mechanism that is independent of Parent windows. This approach allows apps to connect to a DA even when they were not opened by that DA.

The hidden iframe url can be provided in two ways:

1) By a Parent DA - This allows DAs to redirect communications to a DA in a hidden iframe at a known location. The main benefit of this approach is that it can allow a system to continue to operate even if the Parent is closed.

2) By a failover function - When no parent DA can be found (such as when a tab is opened directly by an end user) then a failover function can provide a url. In such a scenario, failover is instantaneous because the absence of Parent windows is deterministic. Note that this approach may compromise Write Once Run Anywhere (WORA) unless apps use dynamic mechanisms to determine the hidden url (such as through clues provided in their href.)

The same WCP mechanism is used to connect to DAs located in hidden iframes. Likewise, the same BCP messages are used for communications.

## UI Channel Selector and Intent Resolver

A DA may implement its own Channel Selector and Intent Resolver or may utilize the one provided by "@finos/fdc3" via `getAgent()` ("built-in UI"). For instance, a DA may not have the ability to present a channel selector in a window that has been opened with `window.open()`. The built-in UI can be leveraged in this circumstance. Send the `BCPResolveIntent` and `BCPInitializeChannelSelector` messages to invoke the built-in UI.

## Disconnects

DAs are responsible for tracking when app windows close by checking `win.closed` in a loop.

https://stackoverflow.com/questions/9388380/capture-the-close-event-of-popup-window-in-javascript/48240128#48240128



