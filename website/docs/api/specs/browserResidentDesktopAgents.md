---
id: browserResidentDesktopAgents
sidebar_label: Browser Desktop Agents
title: Browser-Resident Desktop Agents (next)
---

:::info _[@experimental](../../fdc3-compliance#experimental-features)_

Browser Resident Desktop Agents (DAs) are an experimental feature added to FDC3 in 2.2. Limited aspects of their design may change in future versions and they are exempted from the FDC3 Standard's normal versioning and deprecation policies in order to facilitate any necessary change.

:::

This document specifies the required behavior for Browser-Resident Desktop Agents (DA). Such agents allow FDC3 applications running directly in a browser to participate in FDC3 interop by way of a `getAgent()` function that is provided by the [`@finos/fdc3` npm module](https://www.npmjs.com/package/@finos/fdc3) and a standardized communication protocol. This approach is in contrast to "Preload DAs" which run on technology that allows the FDC3 interface to be injected (such as Electron, WebView2 or a browser-extension based implementation).

This specification only applies to apps running in a browser and therefore assumes use of JavaScript/TypeScript and HTML APIs. Implementations in other languages such as .NET are not covered.

Along with this specification, a new general connection strategy has been established for FDC3 compliant web-applications: FDC3 compliant apps SHOULD make use of `getAgent()` function provided by the [`@finos/fdc3` npm module](https://www.npmjs.com/package/@finos/fdc3) to retrieve their FDC3 interface (an instance of an implementation of the [`DesktopAgent`](../ref/DesktopAgent) interface). Apps that follow these guidelines will be able to interop through either Browser-Resident DAs or [Preload DAs](./preloadDesktopAgents) without the inclusion of code or libraries specific to a particular Desktop Agent vendor or implementation. We refer to this concept as Write Once Run Anywhere (WORA).

:::info

Prior to FDC3 2.2, only [Preload Desktop Agents](./preloadDesktopAgents) were supported.  

:::

:::note

This document covers the requirements for _implementors of Browser-Resident Desktop Agents_. The `getAgent()` function that applications use to gain access to an FDC3 interface is provided by the [`@finos/fdc3` npm module](https://www.npmjs.com/package/@finos/fdc3). Many behavioral details of `getAgent()` are purposefully omitted from this document in order to reduce the required scope of understanding. Please refer to the [getAgent() specification in the FDC3 Web Connection Protocol](webConnectionProtocol.md) for information on how the client side operates or [supported platforms](../supported-platforms) for details of how to access the Desktop Agent API in an application.

:::

:::tip

When referencing "DA" in the subsequent sections of this document we will hereafter always mean a "Browser-Resident Desktop Agent" - code that runs in a browser page (iframe or window) and which conforms to this specification.

:::

## Launching apps

As a prerequisite for launching an app via FDC3 in the browser, a DA must first exist as running code in a browser window (See failover functions for an exception to this rule), although that code MAY also connect to or rely on remotely hosted services. We will refer to this window as the "DA Window".

As the DA typically acts as a launcher for applications, it will often be the case that the DA window is related to the application window(s) in that it may have created the application window with `window.open()` or have created an iframe and loaded the application URL into it. Hence, the DA window may be referred to as a 'parent' (window or frame) of the application frame and the relationship may be used to implement communication between the frames.

:::note

It is possible to have multiple DA Windows. For instance, a DA may propagate itself into new windows. Communication and coordination between DA Windows is an implementation detail and is not covered by this specification.

:::

When an app runs `getAgent()`, it checks for the existence of `window.parent`, `window.opener` and `window.parent.opener` (and will continue up the chain of parent frames, e.g. `window.parent.parent`, `window.parent.parent.opener` until the reference to the next parent is equal to the current one (e.g. `window.parent.parent === window.parent` indicating that the frame does not have a parent). `getAgent()` will then send a standardized `WCP1Hello` message to each parent window or frame reference via [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) in order to discover a DA.

Hence, apps may be launched:

1. By creating iframes in a DA Window
2. By calling `window.open` from a DA Window
3. By creating iframes in a window that was opened from a DA Window

and the Desktop Agent application will be found in a 'parent' of the application frame.

## Responding to app instance connections - Web Connection Protocol (WCP)

Browser Resident DAs MUST call `window.addEventListener("message", ...)` to receive incoming connection requests from apps, in the form of [`"WCP1Hello"`](pathname:///schemas/next/api/WCP1Hello.schema.json) messages defined in the [Web Connection Protocol](./webConnectionProtocol).

Upon receiving an incoming [`"WCP1Hello"`](pathname:///schemas/next/api/WCP1Hello.schema.json) the Desktop Agent MUST either:

1. Respond with a [`WCP2LoadUrl`](pathname:///schemas/next/api/WCP2LoadUrl.schema.json) message (as defined in the [Web Connection Protocol](./webConnectionProtocol)).
    - This message indicates that `getAgent()` should create an iframe, load the provided URL (for an adaptor to the Desktop Agent) into it and then restart the connection process by sending [`"WCP1Hello"`](pathname:///schemas/next/api/WCP1Hello.schema.json) to the iframe.

    :::warning

    The [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) directives [frame-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-src), [child-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/child-src) and [default-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/default-src) can prevent iframes injected into an application from loading content. Wherever these are used in app implementations, please advise app implementors to include domains from which the adaptor content is served.

    :::
2. Create a [`MessageChannel`](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API) with two entangled `MessagePort` instances that will be used for further communication with the application.
    - Before returning one of `MessagePort` instances, the DA MUST set up event listeners to receive and process a [`"WCP4ValidateAppIdentity"`](pathname:///schemas/next/api/WCP4ValidateAppIdentity.schema.json) message from the application.
    - To deliver the `MessagePort`, the DA MUST respond to the event's `source` window by responding with a [`WCP3Handshake`](pathname:///schemas/next/api/WCP3Handshake.schema.json) message (as defined in the [Web Connection Protocol](./webConnectionProtocol)) and append `port2` from the `MessageChannel` to the message.

All further communication is conducted over the `MessageChannel`. The Desktop Agent should consider the newly created port to be inactive until a [`"WCP4ValidateAppIdentity"`](pathname:///schemas/next/api/WCP4ValidateAppIdentity.schema.json) message is received via the `MessagePort` and successfully processed.

### Validating app identity

The first message received by the Desktop Agent on `MessagePort` `port1` from an application via a `MessageChannel` it created MUST be [`"WCP4ValidateAppIdentity"`](pathname:///schemas/next/api/WCP4ValidateAppIdentity.schema.json). Once received and successfully processed, the Desktop Agent should respond with a [`WCP5ValidateAppIdentityResponse`](pathname:///schemas/next/api/WCP5ValidateAppIdentityResponse.schema.json) message containing an `appId`, `instanceId` and `instanceUuid` to identify the app and this specific instance and then enable processing of [Desktop Agent Communication Protocol](./desktopAgentCommunicationProtocol.md) messages for this application. If validation fails, it should instead respond with [`WCP5ValidateAppIdentityFailedResponse`](pathname:///schemas/next/api/WCP5ValidateAppIdentityFailedResponse.schema.json) and close the `MessageChannel`.

App identity is validated and an `appId` assigned by matching the application to an AppD record already known to the Desktop Agent. This is achieved by matching  `identityUrl` (supplied by the application via the `getAgent()` implementation) to the `details.url` field of the known App Directory records.

As web applications may vary their URL during use, or serve multiple applications from the same origin (differentiated by path, search params and/or hash), care must be taken in matching URLs to AppD records. Two URLs are sent to the Desktop Agent in the [`"WCP4ValidateAppIdentity"`](pathname:///schemas/next/api/WCP4ValidateAppIdentity.schema.json) message:

- `identityUrl`: the URL to match to the App Directory record.
- `actualUrl`: the current URL of the application, which MUST be captured automatically by the `getAgent()` implementation.

Applications _may_ specify the `identityUrl` value as an argument to `getAgent()`. If not specified, the `getAgent()` implementation MUST use the current URL of the application. The Desktop Agent MUST validate that the origin of the `identityUrl` is the same as the origin of _both_ the `actualUrl` and the `WCPValidateAppIdentity` message sent over the `MessagePort`. The Desktop Agent MUST then match the URL to that of applications known to the Desktop Agent.

The `actualUrl` field may be used for logging and debug purposes by the Desktop Agent and it differing from the `identityUrl` indicates that the application provided an override via `getAgent()`.

Owing to the fact that the different parts of a URL (origin, path, search parameters, anchor) are used differently by web applications, matching of the `identityUrl` to known application URLs can be more complex than a simple string match. To allow application developers control the requirements of matching, Desktop Agents SHOULD consider a URL to match if all elements (origin, path, search parameters, anchor) present in the App Directory record's URL are present in the `identityUrl`. As multiple App Directory records may match a given identity URL, Desktop Agents SHOULD look for the best match that meets the requirements.

For example, given an identity URL `url`, and an array of App Directory records `appDRecords`, a Desktop Agent MAY implement matching as follows:

```js
/** Return the AppD record whose URL best matches the input URL or `null` if no
 *  match is found. To be considered a match all elements of the AppD URL 
 *  (origin, path, searchParams and hash) MUST be found in the input URL.
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

    //score AppD records based on the match of their URL to the input URL
    // if any component of the AppD record URL is missing from input URL score 0, 
    // otherwise count the number of input elements matched.
    appDRecords.map((record) => {
        //record must contain a URL
        if (!record.details?.url) { return; }
        
        //parse record URL
        const parsedUrl = new URL(record.details.url);
        
        //origin of URL must match record
        if (parsedUrl.origin !== inputUrl.origin) { return; }
        let score = 1;
        
        //path must match if present in AppD record - Path of "/" is ignored
        const appDPath = trimTrailingSlash(parsedUrl.pathname);
        if (appDPath) {
            if (trimTrailingSlash(inputUrl.pathname) != appDPath) {
                return;
            } else {
                score++;
            }
        }
        
        //hash must match if present in AppD record
        if (parsedUrl.hash) {
            if (inputUrl.hash != parsedUrl.hash) {
                return; 
            } else {
                score++;
            }
        }
        
        if (!!parsedUrl.search) {
            //search params present in AppD record must be present in URL
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

If the [`"WCP4ValidateAppIdentity"`](pathname:///schemas/next/api/WCP4ValidateAppIdentity.schema.json) request message contains `instanceId` and `instanceUuid` fields then the window may represent an app instance that has navigated or refreshed and requires reconnecting with the previously assigned `instanceId`. The DA SHOULD reissue the same instanceId if the `instanceUuid`, `appId`, `WindowProxy` object and origin provided **all** match what is already on record and return details via the [`WCP5ValidateAppIdentityResponse`](pathname:///schemas/next/api/WCP5ValidateAppIdentityResponse.schema.json) message.

If an `instanceId` and `instanceUuid` are not provided or do not pass the checks defined above, a new `instanceId` and `instanceUuid` should be generated by the Desktop Agent and returned in the [`WCP5ValidateAppIdentityResponse`](pathname:///schemas/next/api/WCP5ValidateAppIdentityResponse.schema.json) message. All generated `instanceId` and `instanceUuid` values should be retained by the DA (for the session or other appropriate period of time), along with a reference to the `WindowProxy` (`event.source` from the initial message received), as these can later be used for comparison to help determine if a new connection request is coming from a previously connected window which may or may not represent an existing app instance. If a previously connected window is reconnecting, any existing `MessageChannel` instance created for it can be cleaned up.  

Details of the received `instanceId` and `instanceUuid` are stored by the `getAgent()` implementation in [SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) within the application window and are automatically reused when reconnecting to the Desktop Agent. SessionStorage is used as it is scoped to a particular window (rather than origin, as is the case with LocalStorage), allowing separate storage for each app instance.

:::warning

Apps launched via a call to `window.open()` from a window or app instance on the same origin can appear to be the original window. This is because browsers may clone SessionStorage for newly opened windows. When a child window calls `getAgent()` with the same `appId`, `instanceId` and `instanceUuid` as the parent window, it will appear to the DA that a navigation event occurred on the parent window. DAs therefore MUST also compare the `WindowProxy` object that is used to establish each connection to differentiate such cloned instances. If the WindowProxy objects do not match, then a new `instanceId` and `instanceUuid` MUST be assigned.

:::

For more details on the connection process, please see the documentation for the [Web Connection Protocol](./webConnectionProtocol).

### Disconnects

DAs are responsible for tracking when app windows close or navigate, which is necessary to provide accurate responses to the `findIntent`, `findIntentsByContext` & `findInstances` API calls, and to correctly resolve raised intents.

:::info

The HTML Standard specifies an [onclose event handler on `MessagePort`](https://html.spec.whatwg.org/multipage/web-messaging.html#handler-messageport-onclose) which would provide an ideal event-based solution for tracking the closing of app windows. However, this event is not currently implemented in Chrome/Chromium due to security concerns (it reveals the garbage collection activity of the process holding the other end of the pipe, see comment on [whatwg/html/issues/1766](https://github.com/whatwg/html/issues/1766#issuecomment-1958782062), see also proposals to [restrict when MessagePort's onclose event can fire](https://github.com/whatwg/html/issues/10201)).

:::

Checking whether an application has closed may be achieved by a number of approaches:

- By checking the `closed` property of WindowProxy objects that were received via the `source` property of the original `WCP1Hello` message, or any subsequent message over the `MessageChannel`. `closed` will be true if the window or frame was closed or destroyed, or the window or frame has navigated cross-domain.
  - However, it should be noted that the `closed` will be `false` if the window has navigated same-domain, but is no longer an FDC3 app or has become a different FDC3 app. Hence, checking the `closed` property will not catch all cases.
  - If an equivalent `WindowProxy` object (`WindowProxy` objects can be compared with `==` and will be equivalent if they represent the same window) is received from a different application the DA should consider the original application using that `WindowProxy` to have closed.
- By receiving a `WCP6Goodbye` message from the application when it is closing. The `getAgent()` implementation automates the sending of this message via the HTML Standard's [Page Life Cycle API](https://wicg.github.io/page-lifecycle/spec.html). Specifically, the `getAgent()` implementation MUST attempt to detect windows closing by listening for the `pagehide` event and considering a window to be closed if the event's `persisted` property is `false`.
  - Note that the `pagehide` event may not fire if the window's render thread crashes or is closed while 'frozen'.
- By polling the application for responses via the `heartbeatEvent` and `heartbeatAcknowledgement` messages provided in the [Desktop Agent Communication Protocol](./desktopAgentCommunicationProtocol#checking-apps-are-alive). These message may be used for both periodic and on-demand polling by DA implementations. On-demand polling could, for example, be used to check that all instances returned in a findIntent response or displayed in an intent resolver are still alive.
  - Desktop Agents MAY determine their own timeout, or support configuration, to be used for considering an application to have closed as this may be affected by the implementation details of app and DAs.

Finally, Desktop Agents SHOULD retain instance details for applications that have closed as they may appear to close during navigation events, or may navigate away and then navigate back. By retaining the instance data (`instanceId`, `instanceUuid` and `WindowProxy`) the same instance identity can be maintained or reissued. There is no standard length of time that such details should be retained, hence, Desktop Agents MAY determine for themselves how long to retain instance details for closed instances.

## Responding to app communications with Desktop Agent Communication Protocol (DACP)

After validating an application's identity and any instance identity to be reused, the Desktop Agent is ready to support communication with the application. This is achieved via the [Desktop Agent Communication Protocol](./desktopAgentCommunicationProtocol) (DACP) over the `MessageChannel` established in the previous steps.

## Implementing DAs in hidden iframes

As described above, DA providers can leverage hidden iframes to establish a communication mechanism that is independent of a parent window or frame. This approach allows apps to reconnect to a DA even when the parent window or frame has closed, or to connect a DA they've started themselves via a `failover` function.

The hidden iframe URL can be provided in two ways:

1. By a parent window or frame - This allows DAs to handle communication via a hidden iframe that loads a known URL. The main benefit of this approach is that it can allow a system to continue to operate even if the parent window or frame is closed.
2. By a `failover` function - When no parent DA can be found (such as when a tab is opened directly by an end user) then a failover function can create a hidden iframe and return a reference to it (a `WindowProxy`) that is used to initiate communication via the WCP in the same way as we do with a parent window or frame. Alternatively, a `DesktopAgent` implementation may be loaded directly and returned from the `failover` function, which `getAgent()` will pass-through.

## Channel Selector and Intent Resolver User Interfaces

Channel Selector and Intent Resolver user-interfaces are normally provided by Desktop Agents to applications. However, when running in a web browser, a DA may not have the ability to present a channel selector in a window that has been opened with `window.open()`, and it may be challenging to display a secondary window over the application when needed (due to pop-up blocking and user preferences).

The `getAgent()` implementation can facilitate the injection and management of iframes in an application window. An app may provide the optional `channelSelector` and `intentResolver` parameters to the `getAgent()` to indicate whether or not they need these interfaces. For example, the apps may not raise intents. Some apps may also resolve intents internally by leveraging the Desktop Agent's `findIntent` or `findIntentsForContext` API functions. In these situations, the apps won't need a DA-provided interface. Once an app calls `getAgent()`, the parameters that the app provides are forwarded onto the Desktop Agent in the `WCP1Hello` connection message.

Desktop Agents MAY implement their own user interfaces for channel selection and intent resolution. The URL for each interface may be returned in the `channelSelectorUrl` and `intentResolverUrl` properties of the payload of the `WCP3Handshake` message sent by the DA during the connection sequence. Alternatively, if the Desktop Agent is able to provide these user interfaces by other means (for example DAs that render applications in iframes within a window they control may use other iframes to render these UIs) or if they app indicated that it did not need them then `channelSelectorUrl` and `intentResolverUrl` MAY be set to `false`. Finally, `channelSelectorUrl` and `intentResolverUrl` MAY be set to `true` to indicate that `getAgent()` should use the default reference implementations of these UIs provided via the [https://fdc3.finos.org](https://fdc3.finos.org) website.

:::warning

The [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) directives [frame-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-src), [child-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/child-src) and [default-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/default-src) can prevent iframes injected into an application from loading content. Where these are used in app implementations, please advise app implementors to include domains from which the UI implementations are served (including [fdc3.finos.org](https://fdc3.finos.org/) if you are working with the reference Intent Resolver and Channel Selector UIs).

:::

User interface iframes are initially injected into the application window with CSS that prevents their display:

```css
{
    width: "0";
    height: "0";
    position: "fixed";
}
```

and are always displayed with `position: "fixed"` so that they are not part of the document flow.

Implementations of the UIs may then indicate a limited set of CSS to apply to their frame in the initial `Fdc3UserInterfaceHello` message (when the width and height will be removed if not explicitly set in that message), and later adjust that via `Fdc3UserInterfaceRestyle`. See the [Controlling injected User Interfaces section](./desktopAgentCommunicationProtocol#controlling-injected-user-interfaces) in the DACP specification for more details.

Communication between the `DesktopAgentProxy` and the iframes it injects is achieved via a similar mechanism to that used for communication between an app and the Desktop Agent: a `MessageChannel` is established between the app and iframe, via a `postMessage` sent from the iframe (`Fdc3UserInterfaceHello`) and responded to by the `DesktopAgentProxy` in the app's window (`Fdc3UserInterfaceHandshake`), with a `MessagePort` from a `MessageChannel` appended.

A further set of messages are provided for working with the injected user interfaces over their `MessageChannel` as part of the DACP, these are: `Fdc3UserInterfaceRestyle`, `Fdc3UserInterfaceDrag`, `Fdc3UserInterfaceChannels`, `Fdc3UserInterfaceChannelSelected`, `Fdc3UserInterfaceResolve` and `Fdc3UserInterfaceResolveAction`.

See the [Desktop Agent Communication Protocol](./desktopAgentCommunicationProtocol) (DACP) for more details.
