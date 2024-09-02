---
id: browserDesktopAgents
sidebar_label: Browser Desktop Agents
title: Browser Desktop Agents (next)
---

:::info _[@experimental](../fdc3-compliance#experimental-features)_

Browser Resident Desktop Agents are an experimental feature added to FDC3 in 2.2. Limited aspects of their design may change in the future version and they are exempted from the FDC3 Standard's normal versioning and deprecation polices in order to facilitate any necessary change.

:::

This document specifies the required behavior for Browser-Resident Desktop Agents (DA). Such agents allow FDC3 applications running directly in a browser to participate in FDC3 interop by way of a `getAgent()` function that is provided by the [`@finos.fdc3` NPM module](https://www.npmjs.com/package/@finos/fdc3) and a standardized communication protocol. This approach is in contrast to "Preload DAs" which run on technology that allows the FDC3 interface to be injected (such as Electron, WebView2 or a browser-extension based implementation).

This specification only applies to apps running in a browser and therefore assumes use of JavaScript/TypeScript and HTML APIs. Implementations in other languages such as .NET are not covered.

Along with this specification, a new general connection strategy has been established for FDC3 compliant web-applications: FDC3 compliant apps SHOULD make use of `getAent()` function provided by the [`@finos/fdc3` NPM module](https://www.npmjs.com/package/@finos/fdc3) to retrieve their FDC3 interface (an instance of an implementation of the [`DesktopAgent`](../ref/DesktopAgent) interface). Apps that follow these guidelines will be able to interop through either Browser-Resident DAs or [Preload DAs](./preloadDesktopAgents) without code modification. We refer to this concept as Write Once Run Anywhere (WORA).

:::info

Prior to FDC3 2.2, only [Preload Desktop Agents](./preloadDesktopAgents) were supported.  

:::

:::note

This document only covers the requirements for _implementors of Browser-Resident DAs_. The `getAgent()` function that applications use to gain access to an fdc3 interface is provided by the [`@finos/fdc3` NPM module](https://www.npmjs.com/package/@finos/fdc3). Many behavioral details of `getAgent()` are purposefully omitted from this document in order to reduce the required scope of understanding. Please refer to the [getAgent() specification in the FDC3 Web Connection Protocol](webConnectionProtocol.md) for information on how the client side operates.

:::

:::tip

When referencing "DA" in this document we will hereafter always mean a "Browser-Resident Desktop Agent" - code that runs in a browser page (iframe or window) and which conforms to this specification.

:::

## Launching apps

As a prerequisite for running FDC3 in the browser, a DA must first exist as running code in a browser window (See failover functions for an exception to this rule), although that code MAY also connect to or rely on remotely hosted services. We will refer to this window as the "DA Window".

As the DA typically acts as a launcher for applications, it will often be the case that the DA window is related to the application window(s) in that it may have create the application window with `window.open()` or by creating an iframe and loading the application URL into it. Hence, the DA window may be referred to as a 'parent' (window or frame) of the application frame and the relationship may be used to implement communication between the frames.

:::note

It is possible to have multiple DA Windows. For instance, a DA may propagate itself into new windows. Communication and coordination between DA Windows is an implementation detail and is not covered by this specification.

:::

When an app runs `getAgent()`, it checks for the existence of `window.parent`, `window.opener` and `window.parent.opener` (and will continue up the chain of parent frames, e.g. `window.parent.parent`, `window.parent.parent.opener` until the reference to the next parent is equal to the current one (e.g. `window.parent.parent === window.parent` indicating that the frame does not have a parent). `getAgent()` will then send a standardized `WCP1Hello` message to each parent window or frame reference via [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) in to discover a DA.

Hence, apps may be launched:

1) By creating iframes in a DA Window
2) By calling `window.open` from a DA Window
3) By creating iframes in a window that was opened from a DA Window

and the Desktop Agent application will be found in a 'parent' of the application frame.

## Responding to app instance connections - Web Connection Protocol (WCP)

Browser Resident DAs MUST call `window.addEventListener("message",...)` to receive incoming connection requests from apps, in the form of `WCP1Hello` messages defined in the [Web Connection Protocol](./webConnectionProtocol).

Upon receiving an incoming `WCP1Hello` the DA MUST either:

1) Respond with a `WCP2LoadURL` message (as defined in the [Web Connection Protocol](./webConnectionProtocol)).
    - This message indicates that `getAgent()` should create an iframe, load the provided URL (for an adaptor to the Desktop Agent) into it and then restart the connection process by sending `WCP1Hello` to the iframe.
2) Create a [`MessageChannel`](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API) with two entangled `MessagePort` instances that will be used for further communication with the application.
    - Before returning one of `MessagePort` instances, the DA MUST set up event listeners to to receive and process a `WCPValidateAppIdentity` message from the application.
    - To deliver the `MessagePort`, the DA MUST respond to the event's `source` window by responding with a `WCP3Handshake` message (as defined in the [Web Connection Protocol](./webConnectionProtocol)) and append `port2` from the `MessageChannel`` to the message.

All further communication is conducted over the `MessageChannel`. The Desktop Agent should consider the newly created port to be inactive until a `WCPValidateAppIdentity` message is received via the MessagePort and successfully processed.

### Validating app identity

The first message received by the Desktop Agent on `MessagePort` `port1` from an application via a `MessageChannel` it created MUST be `WCPValidateAppIdentity`. Once received and successfully processed, the Desktop Agent MUST add handlers to it's `MessagePort` (`port1`) to process [Desktop Agent Communication Protocol](./desktopAgentCommunicationProtocol.md) messages for this application and then respond with a `WCP5ValidateAppIdentityResponse` message containing an `appId`, `instanceId` and `instanceUuid` to identify the app and this specific instance. If validation fails, it should instead respond with `WCP5ValidateAppIdentityFailedResponse` and close the `MessageChannel`.

App identity is validated and an `appId` assigned by matching the application to an AppD record already known to the Desktop Agent. This is achieved by matching  `identityUrl`, `actualUrl` fields and `origin` of the `WCPValidateAppIdentity` message (supplied by the application via the `getAgent()` implementation) to the `details.url` field of the known App Directory records.

As web applications may vary their URL during use, or serve multiple applications from the same origin (differentiated by path, search params and/or hash), care must be taken in matching URLs to appD records. Two URLs are sent to the Desktop Agent in the `WCPValidateAppIdentity` message: 
- `actualUrl`: the current URL of the application, which MUST be captured automatically by the `getAgent()` implementation.
- `identityUrl`: the URL to match to the app directory record.

The `actualUrl` field may be used for logging and debug purposes by the Desktop Agent.

Applications _may_ specify the `identityUrl` value are an argument to `getAgent()`. If not specified, the `getAgent()` implementation MUST use the current URL of the application. The Deksotp Agent must validate that the origin of the `identityUrl` is the same as the origin of _both_ the `actualUrl` and the `WCPValidateAppIdentity` message sent over the `MessagePort`. The Desktop Agent SHOULD then match the URL to that of applications known to the Desktop Agent.

Owing to the fact that the different parts of a URL (origin, path, search parameters, anchor) are used differently by different web applications, matching of the `identityUrl` to known application URLs is more complex than a simple string match. To allow application developers control the requirements of matching, Desktop Agents MUST consider a URL to match if all elements (origin, path, search parameters, anchor) present in the App Directory record's URL are present in the `identityUrl`. As multiple App Directory may match a given identity URL, Desktop Agents SHOULD look for the best match that meets the requirements.

For example, given an identity URL `url`, and an array of App Directory records `appDRecords`, a Desktop Agent SHOULD implement matching as follows:

```js
/** Return the AppD record whose URL best matches the input URL or `null` if no match is found.
 *  To be considered a match all elements of the AppD URL (origin, path, searchParams and hash)
 *  must be found in the input URL.
 *  The best match is the AppD URL that contains the most elements from the
 *  input URL.
 */  
let matchUrlToAppD = (url, appDRecords) => {
    //parse the URL
    const inputUrl = new URL(url);

    //fn to trim trailing / from paths
    const trimTrailingSlash = (path) => {
        if (path.endsWith("/")) {
            const out = path.slice(0, -1);
            //return null if it was just a /
            return out === "" ? null : out;
        } else {
            return path;
        }
    };
                               
    const matchScores = [];

    //score appD records based on the match of their URL to the input URL
    // if any component of the appD record URL is missing from input URL, score 0
    // otherwise count the number of input elements matched 
    appDRecords.map((record) => {
        //record must contain a URL
        if (!record.details?.url) { return; }
        
        //parse record URL
        const parsedUrl = new URL(record.details.url);
        
        //origin of URL must match record
        if (parsedUrl.origin !== inputUrl.origin) { return; }
        let score = 1;
        
        //path must match if present in appD record - Path of "/" is ignored
        const appDPath = trimTrailingSlash(parsedUrl.pathname);
        if (appDPath) {
            if (trimTrailingSlash(inputUrl.pathname) != appDPath) {
                return;
            } else {
                score++;
            }
        }
        
        //hash must match if present in appD record
        if (parsedUrl.hash) {
            if (inputUrl.hash != parsedUrl.hash) {
                return; 
            } else {
                score++;
            }
        }
        
        if (!!parsedUrl.search) {
            //search params present in appD record must be present in URL
            const recordSearchKeys = parsedUrl.searchParams.keys().toArray();
            for (let i=0; i<recordSearchKeys.length; i++) {
                const key = recordSearchKeys[i];
                if (inputUrl.searchParams.get(key) !== parsedUrl.searchParams.get(key)) {
                    return;
                }
            }
            //count matched input URL search params for scoring
            inputUrl.searchParams.keys().forEach((key) => {
                if (parsedUrl.searchParams.get(key) === inputUrl.searchParams.get(key)) {
                    score++;
                } 
            });
        }
        
        //everything present in the record was found in the inputUrl
        matchScores.push([score, record]);
    });
    
    //return the best scoring match (ignore ties)
    matchScores.sort((a,b) => b[0]-a[0]);
    return matchScores[0][1] ?? null;
};
```

### Validating instance identity

If the `WCPValidateAppIdentity` request message contains `instanceId` and `instanceUuid` fields then the window may represent an app instance that has navigated or refreshed and requires reconnecting with the previously assigned `instanceId`. The DA SHOULD reissue the same instanceId if the `instanceUuid`, `appId`, `WindowProxy` object and origin provided **all** match what is already on record and return details via the `WCP5ValidateAppIdentityResponse` message.

If an `instanceId` and `instanceUuid` are not provided or do not pass the chjecks defined above, a new `instanceId` and `instanceUuid` should be generated by the Desktop Agent and returned in the `WCP5ValidateAppIdentityResponse` message. All generated `instanceId` and `instanceUuid` values should be retained by the DA (for the session or other appropriate period of time), along with a reference to the `WindowProxy` (`event.source` from the initial message received), as these can later be used for comparison to help determine if a new connection request is coming from a previously connected window which may or may not represent an existing app instance. If a previously connected window is reconnecting, any existing `MessageChannel` instance created for it can be cleaned up.  

Details of the received `instanceId` and `instanceUuid` are stored by the `getAgent()` implementation in [SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) within the application window and are automatically reused when reconnecting to the Desktop Agent. SessionStorage is used as it is scoped to a particular window (rather than origin, as is the case with LocalStorage), allowing separate storage for each app instance.

:::warn

Apps launched via a call to `window.open()` from a window or app instance on the same origin can appear to be the original window. This is because browsers may clone SessionStorage for newly opened windows. When a child window calls `getAgent()` with the same `appId`, `instanceId` and `instanceUuid` as the parent window, it will appear to the DA that a navigation event occurred on the parent window. DAs therefore MUST also compare the `WindowProxy` object that is used to establish each connection to differentiate such cloned instances. If the WindowProxy objects do not match, then a new `instanceId` and `instanceUuid` MUST be assigned.

:::

For more details on the connection process, please see the documentation for the [Web Connection Protocol](./webConnectionProtocol).

## Responding to app communications with Desktop Agent Communication Protocol (DACP)


See [Desktop Agent Communication Protocol ](./desktopAgentCommunicationProtocol .md)

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