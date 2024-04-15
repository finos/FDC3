# Specification for getAgent() function

`getAgent()` is implemented in the `@finos/fdc3` library. This specification details how it retrieves and provides FDC3 interface object.

## Definition of Terms

**Browser Resident Desktop Agent (DA)**: A Desktop Agent loaded in a window or frame within a web browser (in contrast to a Desktop Agent that "injects" a global fdc3 object).

> Note - Throughout this document, when referring to "DA" without any other qualification we mean a Browser-Resident Desktop Agent.

**getAgent()**: The library function provided by `@finos/fdc3` that discovers and establishes communication to DAs. It may (1) return a reference to an injected `DesktopAgent` instance, (2) use the FDC3 Web Connection Protocol (WCP) to discover a DA (e.g. in a "parent" window or frame) and return a `DesktopAgent` instance that communicates with the DA using the FDC3 Browser Communication Protocol (BCP), or (3) run an application provided failover function that provides direct or indirect access to a `DesktopAgent`.

**Web Connection Protocol (WCP)**: A protocol for discovering and establishing communications with a DA. Ths includes a prescribed algorithm as well as some standard messages that are transmitted using `window.postMessage`.

**Browser Communication Protocol (BCP)**: A protocol that uses the standard HTML Channel Messaging API (MessagePort) to communicate with a DA in a remote iframe or window via messages.

**Parent**: A browser window or frame that creates the window or iframe in which an application runs. (The parent provides a `WindowProxy` object which is used by WCP.)

**WindowProxy**: An interface defined by the HTML standard that proxies a remote Window object: https://html.spec.whatwg.org/multipage/nav-history-apis.html#the-windowproxy-exotic-object. This is used by WCP.

**MessagePort**: An interface defined by the HTML Channel Messaging standard that can be used for cross-domain communication between windows. This is used by BCP.

**Flux Standard Action (FSA)**: An [industry standard](https://github.com/redux-utilities/flux-standard-action) JSON envelope. All WCP and BCP messages are defined as FSAs.

**SessionStorage**: A JavaScript storage API that persists data for web apps (segregated by domain) within a specific window or tab (SessionStorage is identical to the localStorage API but is tied to a particular window/tab, as defined by the HTML Standard: https://html.spec.whatwg.org/multipage/webstorage.html#dom-sessionstorage.)

## Establishing Connectivity Using the Web Connection Protocol (WCP)

The WCP algorithm (coordinated between `getAgent()` and DAs) has four steps. Each step may contain sub-steps.

1. Connect to DA
2. Validate app identity
3. Persist DesktopAgentDetails to SessionStorage
4. Resolve promise with DesktopAgent interface

### Connect to DA (Step 1)

1) Check for a possible navigation or refresh event

    Check the SessionStorage key `FDC3-Desktop-Agent-Details` for a `DesktopAgentDetails` record. If it exists **and the appId matches**, then a navigation or refresh event has occurred and the stored data MUST be used to reestablish a connection to the DA. This ensures that the window maintains a consistent `instanceId` between navigation events within an app. If it doesn't exist, or the appId does not match, then proceed to step (2).

    See [DesktopAgentDetails](./getAgent.d.ts).

    Existing `DesktopAgentDetails` records MUST be used to limit discovery actions (in the next step) to the same mechanism as previously used or to skip the discovery step entirely if a `url` exists (immediately opening a hidden iframe).

    If use of persisted data fails to establish a connection to the DA then `getAgent()` should reject its promise with "ReestablishConnectionFailed". 

2) Create a race between these four mutually exclusive threads: 

    **a) Timeout of 750ms** or the value provided by the `timeout` field

    **b) Preload DAs:**

    If a global (window or globalThis) `fdc3` object exists then return it immediately. If it does not exist then wait for the `fdc3Ready` event. After the `fdc3Ready` event triggers, recheck for the existence of the global `fdc3` object and return it if found.

    **c) Browser-resident DAs:**

    If a `url` exists from step (1) then proceed directly to step (iv), otherwise;

    Locate all "Parents" (`window.opener`, `window.parent` or `window.parent.opener`). If no Parent exists then return null, otherwise simultaneously attempt to contact to each existing Parent with the following steps.

    i) Add a listener (`<Parent>.addEventListener("message", (event) => {})`) to receive messages from each Parent.

    ii) Send a "Handshake" message to each Parent (set for any origin since parent origin is unknown) with a unique nonce (one time random key).

    iii) Accept the first correct response received (discard all others). Correct responses MUST include the original nonce. Stop the timer when a correct response is received. If the response has transferred a MessagePort (see HTML Channel Messaging API) then proceed to completion of step 2 (below). If the response contains a `url` then proceed to sub-step iv. If neither is provided then reject with "ErrorOnConnect".

    iv) If a `url` has been provided, open a hidden iframe to the URL and listen on the `onload` event. Once the iframe is loaded, repeat steps i through iii substituting the hidden iframe for Parents.

    **Race Resolution**

    If a timeout wins the race then call the failover function (if one was provided to `getAgent()`).
    
    If the failover function...
    
    **(I)** ...resolves to a DesktopAgent then return it.

    **(II)** ...resolves to a WindowProxy then race a new timer and return to previous step i.

    **(III)** ...resolves to a URL then race a new timer and return to previous step iv.

    **(IV)** ...resolves to anything else then return null.

    > If the _failover function itself_ results in a timeout then do not rerun the failover function.

    **Completion of Step 2**

    If neither MessagePort nor `DesktopAgent` has been obtained then reject the `getAgent()` promise with "AgentNotFound".
    
    If a MessagePort was obtained then create a `DesktopAgent` capable of using BCP to communicate with the remote DA (see below).

    Proceed to step 2.

### Validate App Identity (step 2)

Apps must identify themselves so that DAs can positively associate them with their corresponding AppD records. Identity is ascertained  from either:

(1) A fully qualified `appId` field (provided to `getAgent()`).

(2) An `appDUrl` field (provided to `getAgent()`) and then a subsequent http call (or internal lookup) to retrieve that AppD record.

(3) An `instanceUuid` field provided from SessionStorage (due to a navigation event).

The DA will validate the app's identity against the app window's origin (protocol, domain and port) by positively matching it with either the `details.url` or `details.allowedOrigins` fields in the AppD record referenced by either appId or appDUrl. To ensure the validity of this process, appD records and the application itself SHOULD be served via HTTPS.

1) If the DA is injected (using the `fdc` global object - Preload DA) then:

    Await the function `fdc3.validateAppIdentity()` if that function exists. `instanceUuid` SHOULD be provided if available from SessionStorage.

    The DA SHOULD validate the app identity against the URL of the window (window.location.href). If successful then it will resolve to an `AppMetaData` object, otherwise it will reject with `IdentityValidationFailed` error.

    After rejection, the DA will not respond to any further FDC3 API calls from the application instance.

    If the `fdc3.validateAppIdentity` function does not exist then simply return the global object as the DesktopAgent. (This should only occur when using legacy Desktop Agents.)

2) If the DA is browser-resident, then:

    Send a "WCPValidateAppIdentity" message to the DA via the MessagePort. Include the DesktopAgentDetails record if it exists in SessionStorage.
    
    The DA will validate the app's identity against the origin of the message. It will return either a "IdentityValidationSucceeded" or "IdentityValidationFailed" message. The `getAgent()` promise should reject on a failure message.

Success responses (from calls to `validateAppIdentity()` or "WCPValidateAppIdentityResponse" messages) MUST include `ImplementationMetadata` (describing the DA), `AppMetadata` (describing the instance), and `DesktopAgentDetails` record (to be persisted in the next step).

### Persist DesktopAgentDetails to SessionStorage (step 3)

Once a connection is established, the `DesktopAgentDetails` record that was returned by the DA MUST be stored in SessionStorage under the `FDC3-Desktop-Agent-Details` key.

> Note - SessionStorage is ephemeral, only existing for the duration of the window's life. There is no concern with the key being overwritten or conflicting with other DAs.

### Resolve promise with DesktopAgent interface (step 4)

Resolve the `getAgent()` promise with an object containing the `DesktopAgent` from step 1, and `ImplementationMetadata` and `AppMetadata` which were provided by the  response from step 2. 

## Communicating using the Browser Communication Protocol (BCP)

The `DesktopAgent` instantiated by calls to `getAgent()` uses the Browser Communication Protocol (BCP) to interact with the DA that is located in another frame. This protocol is based on exchanges of a standardized set of Flux Standard Actions (FSAs). The protocol is bi-directional. Every FSA that is transmitted results in a corresponding FSA in return, either containing requested data or simply acknowledging receipt.

BCP uses the HTML Channel Messaging API, communicating via the `MessagePort` object that was established by the Web Connection Protocol (WCP) covered above.

See [Browser Communication Protocol](./browserCommunicationProtocol.md)

## Built in UI (Channel Selector and Intent Resolver)

`getAgent()` MUST provide UI for channel selector and intent resolution. These can be OPTIONALLY utilized by the DA. The DA will send the `BCPInitializeChannelSelector` message if it does not have its own way to manage channel selection. It will send `BCPResolveIntent` if it does not have a way to present an intent resolver UI.

`getAgent()` SHOULD implement UI within the app's DOM, for instance with an overlay for channel selector and a modal dialog for intent resolution.
