---
id: GetAgent
sidebar_label: GetAgent
title: GetAgent
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The `getAgent()` function is the recommended way for **web applications** to connect to an FDC3 Desktop Agent. The function is exported by the [`@finos/fdc3`](https://www.npmjs.com/package/@finos/fdc3) NPM module and returns a [Desktop Agent](./DesktopAgent) implementation:

<Tabs groupId="lang">
<TabItem value="ts" label="TypeScript">

```ts
import { getAgent, DesktopAgent, AgentError } from "@finos/fdc3";

try {
    const desktopAgent: DesktopAgent = await getAgent();
    //do FDC3 things here
} catch (e: AgentError) {
    // Failed to connect
}
```

</TabItem>
<TabItem value="js" label="JavaScript">

```js
import { getAgent } from "@finos/fdc3";

try {
    const desktopAgent = await getAgent();
    //do FDC3 things here
} catch (e) {
    // Failed to connect
}
```

</TabItem>
</Tabs>

The  `getAgent()` function allows web applications to retrieve an FDC3 Desktop Agent API interface to work with, whether they are running in an environment that supports a Desktop Agent Preload (a container-injected API implementation) or a Desktop Agent Proxy (a Browser-based Desktop Agent running in another window or frame). The behavior of `getAgent()` is defined by the [FDC3 Web Connection Protocol (WCP)](../specs/webConnectionProtocol) and communication with a Desktop Agent Proxy in a web-browser is defined by the [Desktop Agent Communication Protocol (DACP)](../specs/desktopAgentCommunicationProtocol). Hence, it allows applications to be written that will work in either scenario without modification or the inclusion of vendor-specific libraries.

To handle situations where no Desktop Agent is found, a failover function may be supplied by an app allowing it to start or otherwise connect to a Desktop Agent (e.g. by loading a proprietary adaptor that returns a `DesktopAgent` implementation or by creating a window or iframe of its own that will provide a Desktop Agent Proxy).

The definition of the `getAgent()` function is as follows:

```ts
type GetAgentType = ( 
  params?: GetAgentParams,  
) => Promise<DesktopAgent>; 
```

A small number of arguments are accepted that can affect the behavior of `getAgent` and to provide a fallback in case a Desktop Agent is not found, allowing the application to start its own agent or use another mechanism (such as a proprietary adaptor) to connect to one.

```ts
/** 
 * @typedef {Object} GetAgentParams Type representing parameters passed to the 
 * getAgent function. 
 * 
 * @property {number} timeoutMs Number of milliseconds to allow for an FDC3
 * implementation to be found before calling the failover function or
 * rejecting (default 750). Note that the timeout is cancelled as soon as a
 * Desktop Agent is detected. There may be additional set-up steps to perform
 * which will happen outside the timeout.
 * 
 * @property {string} identityUrl The app's current URL is normally sent to
 * a web-based desktop agent to help establish its identity. This property
 * may be used to override the URL sent (to handle situations where an app's
 * URL is not sufficiently stable to use for identity purposes,  e.g. due to
 * client-side route changes when navigating within the app). The URL set MUST
 * match the origin of the application (scheme, hostname, and port) or it will
 * be ignored. If not specified, the app's current URL will be used.
 * 
 * @property {boolean} channelSelector Flag indicating that the application
 * needs access to a channel selector UI (i.e. because it supports User Channels
 * and does not implement its own UI for selecting channels). Defaults to 
 * `true`. MAY be ignored by Desktop Agent Preload (container) implementations.
 * 
 * @property {boolean} intentResolver Flag indicating that the application
 * needs access to an intent resolver UI (i.e. because it supports raising one
 * or more intents and and does not implement its own UI for selecting target
 * apps). Defaults to `true`. MAY be ignored by Desktop Agent Preload (container)
 * implementations. 
 * 
 * @property {boolean} dontSetWindowFdc3 For backwards compatibility, `getAgent`
 * will set a reference to the Desktop Agent implementation at `window.fdc3`
 * if one does not already exist, and will fire the fdc3Ready event. Defaults to
 * `false`. Setting this flag to `true` will inhibit that behavior, leaving 
 * `window.fdc3` unset.
 * 
 * @property {function} failover An optional function that provides a
 * means of connecting to or starting a Desktop Agent, which will be called
 * if no Desktop Agent is detected. Must return either a Desktop Agent
 * implementation directly (e.g. by using a proprietary adaptor) or a
 * WindowProxy (e.g a reference to another window returned by `window.open`
 * or an iframe's `contentWindow`) for a window or frame in which it has loaded
 * a Desktop Agent or suitable proxy to one that works with FDC3 Web Connection
 * and Desktop Agent Communication Protocols.
 * 
 * @property {GetAgentLogSettings} logging Settings that determine what should
 * will logged by the getAgent() implementation and DesktopAgentProxy to the 
 * JavaScript console.
 */
type GetAgentParams = { 
    timeoutMs?: number, 
    identityUrl?: string, 
    channelSelector?: boolean, 
    intentResolver?: boolean,
    dontSetWindowFdc3?: boolean,
    failover?: (args: GetAgentParams) => Promise<WindowProxy | DesktopAgent>
    logging?: GetAgentLogSettings;
};

/**
 * @typedef {Object} GetAgentLogSettings Type representing parameters passed to the
 * getAgent function that control what is logged to the JavaScript console by the
 * getAgent() implementation and any DesktopAgentProxy implementations it creates.
 *
 * @property {boolean} connection Log-level messages relating to establishing a 
 * connection to the Desktop Agent (default true).
 * 
 * @property {boolean} connectionDebug Debug-level messages relating to establishing 
 * a connection to the Desktop Agent (default false).
 * 
 * @property {boolean} proxyDebug Debug-level messages that provide details of
 * all messages sent to or received from the DesktopAgent (excluding heartbeat
 * messages) by the DesktopAgentProxy (default false).
 * 
 * @property {boolean} heartbeat Debug-level messages relating to heartbeat messages
 * sent to or received from the DesktopAgent by the DesktopAgentProxy (default false).
 */
export type GetAgentLogSettings = {
  connection: boolean,
  connectionDebug: boolean,
  proxyDebug: boolean,
  heartbeat: boolean
};
```

:::note

As web applications can navigate to or be navigated by users to different URLs and become different applications, validation of an app's identity is necessary. The web application's current URL is passed to web browser-based Desktop Agents to allow them to establish the app's identity - usually connecting it with an App Directory record already known to the Desktop Agent. For more details on identity validation see the identity validation section of the  [Web Connection Protocol (WCP)](specs/webConnectionProtocol).

:::

Finally, if there is still no Desktop Agent available, or an issue prevents connection to it, the `getAgent()` function will reject its promise with a message from the [`AgentError`](./Errors#agenterror) enumeration.

## Injected iframes for adaptors and user interfaces

The `getAgent()` function may try to create hidden iframes within an application window in order to load either an adaptor to a Desktop Agent, or Intent Resolver and Channel Selector user interfaces when needed. The iframes are used in order to sandbox the relevant software, and are communicated with securely via the HTML Standard's Channel Messaging API ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API), [HTML Living Standard](https://html.spec.whatwg.org/multipage/web-messaging.html)).

:::warning

The [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) directives [frame-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-src), [child-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/child-src) and [default-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/default-src) can prevent iframes injected into an application from loading content. Where these are used, please ensure that they allow the loading of content from the domains of Desktop Agents and UI implementations that you wish to work with (including [fdc3.finos.org](https://fdc3.finos.org/) where the reference Intent Resolver and Channel Selector UIs may be loaded from).

:::

## Failover function

Desktop Agent retrieval can time out, for instance if the DA doesn't exist or is unresponsive. The default timeout of 750 milliseconds can be overridden by setting the `timeoutMs` parameter. An application may also provide a failover function which will be called if an interface cannot be retrieved or times out.

Example: Decreasing the timeout and providing a failover function

```js
    const desktopAgent = await getAgent({
        timeoutMs: 250,
        failover: async (params: GetAgentParams) => {
            // return WindowProxy | DesktopAgent
        }
    }); 
```

The failover function allows an application to provide a backup mechanism for connecting to a DA. It is called only when establishment through normal procedures fails or times out.

:::note

If you wish to _completely override FDC3's standard discovery mechanisms_, then do not use a failover function. Instead, simply skip the `getAgent()` call and provide your own DesktopAgent object.

:::

Failover functions MUST be asynchronous and MUST resolve to one of the following types:

1. [`DesktopAgent`](./DesktopAgent)
  The application may choose to directly import or load code that provides a `DesktopAgent` implementation. `getAgent()` will then resolve to the provided `DesktopAgent`.
2. [`WindowProxy`](https://html.spec.whatwg.org/multipage/nav-history-apis.html#the-windowproxy-exotic-object) ([MDN](https://developer.mozilla.org/en-US/docs/Glossary/WindowProxy))
  The application may open a window or create a hidden iframe which may then provide access to a compliant browser-resident DA. Ensure that the iframe has loaded (listen for the `load` event) or for separate windows allow a suitable timeout for the window load, then resolve to the `WindowProxy` object for the window or iframe. The `getAgent()` call will then use the supplied `WindowProxy` to establish a connection.

## Persisted Connection Data

The `getAgent()` function uses [`SessionStorage`](https://html.spec.whatwg.org/multipage/webstorage.html) ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)) to persist information on an instance of an app under the key `"FDC3-Desktop-Agent-Details"` and how it connected to a Desktop Agent in order to ensure a consistent connection type and `instanceId` when reconnecting after navigation or refresh events. 

:::info

Applications are not expected to interact with this information directly, rather it is set and used by the `getAgent()` implementation.

:::

The details persisted conform to the following type:

```ts
/** Type representing data on the Desktop Agent that an app 
 *  connected to that is persisted by the getAgent function 
 *  to be used when re-connecting (after a navigation or  
 *  refresh event) and to ensure a consistent instanceId.  
 */ 
type DesktopAgentDetails = { 
    /** The type of Desktop Agent connected to. Used to  
     *  prevent an inadvertent switch to a different agent.*/ 
    agentType: WebDesktopAgentType,

    /** The URL that was previously sent to the Desktop Agent 
     * to establish the app's identity.*/ 
    identityUrl?: string,

    /** The current URL at the time of the last connection to 
     * a Desktop Agent.*/ 
    actualUrl?: string,

    /** Optional URL field that should be used to store any 
     *  URL that was used to connect to a Desktop Agent. URLs 
     *  may have been provided by a parent window that has since 
     *  gone away and persisting may allow re-connection in such 
     *  cases. */ 
    agentUrl?: string,

    /** The appId that was identified for the application by the 
     * Desktop Agent.*/ 
    appId: string,

    /** The instanceId that was issued to the app by the Desktop  
     * Agent. */ 
    instanceId: string,

    /** The instanceUuid that was issued to the app. This should be 
     *  passed when connecting to the Desktop Agent to help  
     *  identify that this app has connected before and which  
     *  instance it is, enabling the Desktop Agent to reissue 
     *  the same instanceId. The instanceUuid should never be shared 
     *  with other applications and is not available through the 
     *  FDC3 API, allowing it to be used as a shared secret with 
     *  the Desktop Agent that issued the associated instanceId.*/ 
    instanceUuid: string 
} 
 
/** Enumeration of values used to describe types of web-based 
 *  Desktop Agent. Each 'type' refers to the means by which 
 *  a connection to the agent is made and/or an interface to it 
 *  received. */ 
enum WebDesktopAgentType { 
    /** Denotes Desktop Agents that inject the FDC3 interface  
     *  at `window.fdc3`. */ 
    Preload = "PRELOAD",

    /** Denotes Desktop Agents that run (or provide an interface) 
     *  within a parent window or frame, a reference to which  
     *  will be found at `window.opener`, `window.parent`, 
     * `window.parent.opener` etc. */ 
    ProxyParent = "PROXY_PARENT",

    /** Denotes Desktop Agents that are connected to by loading a URL 
     *  into a hidden iframe whose URL was returned by a parent window
     * or frame. */ 
    ProxyUrl = "PROXY_URL",

    /** Denotes a Desktop Agent that was returned by a failover 
     * function that was passed by the application. */ 
    Failover = "FAILOVER" 
}
```
