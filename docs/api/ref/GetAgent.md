---
id: GetAgent
sidebar_label: GetAgent
title: GetAgent
---

The `getAgent()` is the recommended way to connect to a Desktop Agent in a web applications. The function allows web applications to retrieve a Desktop Agent API interface to work with, whether they are running in an environment that supports injection of the Desktop Agent API (e.g. a Desktop container or browser with an extension) or in a standard web browser, where a proxy based on the FDC3 Web Connection Protocol (WCP) and Desktop Agent Communication Protocol (DACP) is used to connect to Desktop Agent. Hence, it allows applications to be written that will work in either scenario without modification or the inclusion of vendor-specific libraries.

The small number of arguments are accepted that can affect the behavior of `getAgent` and to provide a fallback in case a Desktop Agent is not found, allowing the application to start its own agent or use another mechanism (such a proprietary adaptor) to connect to one.

As web applications can navigate to or be navigated by users to different URLs and become different applications, validation of apps identity is often necessary. The web application's current URL is passed to web browser-based Desktop Agents to allow them to establish the app's identity =- usually connecting it with an App Directory record already known to the Desktop Agent. For more details on identity validation see Web section of the [Supported Platforms page](../supported-platforms#web).

If no Desktop Agent is found, or an issue prevent connection to it, the `getAgent()` function will eventually reject
its promise, which apps can handle to set themselves up to run without connection to a Desktop Agent or to display an error.

```ts
/** 
 * Function used to retrieve an FDC3 Desktop Agent API instance, which  
 * supports the discovery of a Desktop Agent Preload (a container-injected  
 * API implementation) or a Desktop Agent Proxy (a Browser-based Desktop Agent 
 * running in another window or frame). Finally, if no Desktop Agent is found, 
 * a failover function may be supplied by app allowing it to start or otherwise 
 * connect to a Desktop Agent (e.g. by loading a proprietary adaptor that 
 * returns a `DesktopAgent` implementation or by creating a window or iframe of 
 * its own that will provide a Desktop Agent Proxy. 
 * 
 * @param {GetAgentParams} params Optional parameters object, which  
 * may include a URL to use for the app's identity, other settings 
 * that affect the behavior of the getAgent() function and a `failover`  
 * function that should be run if a Desktop Agent is not detected.  
 *  
 * @returns A promise that resolves to a DesktopAgent implementation or  
 * rejects with an error message from the `AgentError` enumeration if unable to 
 * return a Desktop Agent implementation. 
 * 
 * @example  
 * const fdc3 = await getAgent(); 
 * // OR 
 * getAgent({ 
 *     identityUrl: "https://example.com/path?param=appName#example",  
 *     channelSelector: false,  
 *     intentresolver: false 
 * }).then((fdc3) => { /* do FDC3 stuff */}; 
 */ 
type getAgent = ( 
	params?: GetAgentParams,  
): Promise<DesktopAgent>; 


/** 
 * @typedef {Object} GetAgentParams Type representing parameters passed to the 
 * getAgent function. 
 * 
 * @property {string} identityUrl The app's current URL is normally sent to 
 * a web-based desktop agent to help establish its identity. This property 
 * may be used to override the URL sent (to handle situations where an app's 
 * URL is not sufficiently stable to use for identity purposes). The URL set 
 * MUST match the origin of the application (scheme, hostname, and port) or  
 * it will be ignored. If not specified, the app's current URL will be used.  
 * 
 * @property {number} timeout Number of millisecs to allow for an fdc3  
 * implementation to be found before calling the failover function or 
 * rejecting (default 1000). Note that the timeout is cancelled as soon as a 
 * Desktop Agent is detected. There may be additional set-up steps to perform 
 * which will happen outside the timeout. 
 * 
 * @property {boolean} channelSelector Flag indicating that the application  
 * needs access to a channel selector UI (i.e. because it supports User Channels 
 * and does not implement its own UI for selecting channels). If not set will 
 * default to true. MAY be ignored by Desktop Agent Preload (container)  
 * implementations. 
 * 
 * @property {boolean} intentResolver Flag indicating that the application  
 * needs access to an intent resolver UI (i.e. because it supports raising on or 
 * more intents and and does not implement its own UI for selecting target apps. 
 * If not set will default to true. MAY be ignored by Desktop Agent Preload  
 * (container) implementations. 
 * 
 * @property {boolean} dontSetWindowFdc3 For backwards compatibility, `getAgent` 
 * will set a reference to the Desktop Agent implementation at `window.fdc3` 
 * if one does not already exist, and will fire the fdc3Ready event. Setting  
 * this flag to `false` will inhibit that behaviour, leaving `window.fdc3` unset. 
 *  
 * @property {function} failover A optional function that provides an  
 * means of connecting to or starting a Desktop Agent, which will be called 
 * if no Desktop Agent is detected. Must return either a Desktop Agent  
 * implementation directly (e.g. by using a proprietary adaptor) or a  
 * WindowProxy (e.g a reference to another window returned by `window.open`  
 * or an iframe's `contentWindow`) for a window or frame in which it has loaded 
 * a Desktop Agent or suitable proxy to one that works with FDC3 Web Connection 
 * and Desktop Agent Communication Protocols. 
 */ 
type GetAgentParams = { 
    timeout: number = 1000, 
    identityUrl?: string, 
    channelSelector: boolean = true, 
    intentResolver: boolean = true,
    dontSetWindowFdc3: boolean = false,
    failover?: (args: GetAgentParams) => Promise<WindowProxy | DesktopAgent> 
}; 

/** 
 * Contains constants representing the errors that can be encountered when  
 * trying to connect to a web-based Desktop Agent with the getAgent function. 
 */ 
enum AgentError { 
    /** Returned if no Desktop Agent was found by any means available or 
     * if the Agent previously connected to is not contactable on a  
     * subsequent connection attempt.*/
    AgentNotFound = "AgentNotFound",

    /** Returned if validation of the app identity by the Desktop Agent 
     * Failed or the app is not being allowed to connect to the Desktop Agent 
     * for another reason. */ 
    AccessDenied = "AccessDenied",

    /** Returned if an error or exception occurs while trying to set  
     * up communication with a Desktop Agent. */ 
    ErrorOnConnect = "ErrorOnConnect",

    /** Returned if either the failover function itself, or what it returned,  
     * was not the right type. */ 
    InvalidFailover = "InvalidFailover" 
} 
```

## Persisted Connection Data

The `getAgent()` function uses SessionStorage ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage), [HTML Living Standard](https://html.spec.whatwg.org/multipage/webstorage.html)) to persist information on an instance of an app and how it connected to a Desktop Agent in order to ensure a consistent connection type and instance Id, in case it navigates or is refreshed. The details persisted conform to the following type:

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
enum WebDesktopAgentType = { 
    /** Denotes Desktop Agents that inject the FDC3 interface  
     *  at `window.fdc3`. */ 
    PRELOAD = "PRELOAD",

    /** Denotes Desktop Agents that run (or provide an interface) 
     *  within a parent window or frame, a reference to which  
     *  will be found at `window.opener`, `window.parent` or 
     *  `window.parent.opener`. */ 
    PROXY_PARENT = "PROXY_PARENT",

    /** Denotes Desktop Agents that are connected to by loading 
     *  a URL into a iframe whose URL was returned by a parent 
     * window or frame. */ 
    PROXY_URL = "PROXY_URL",

    /** Denotes a Desktop Agent that was returned by a failover 
     * function that was passed by the application. */ 
    FAILOVER = "FAILOVER" 
}
```
