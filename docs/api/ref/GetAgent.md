---
id: GetAgent
sidebar_label: GetAgent
title: GetAgent
---

The `getAgent()` function allows web applications to retrieve a Desktop Agent API interface to work with, whether they are running in environment that supports injection of the Desktop Agent API (e.g. a Desktop container or browser with an extension) or in a standard web browser, where the FDC3 Web Connection Protocol (WCP) is used to connect back to Desktop Agent. Hence, it allows applications to be written that will work in either scenario without modification or the inclusion of vendor-specific libraries.

The function accepts a number of arguments that can be used to affect its behavior and to provide a fallback in case a Desktop Agent is not found, allowing the application to start its own agent or use another mechanism (such a proprietary adaptor) to connect to one.

As web applications can navigate to or be navigated by users to different URLs and become different applications, validation of apps identity is often necessary. Hence, applications are expected to provide details of an app directory record to help validate their identity. For more details on identity validation see Web section of the [Supported Platforms page](../supported-platforms#web).

If no Desktop Agent is found, or an issue prevent connection to it, the `getAgent()` function will eventually reject
its promise, which apps can handle to set themselves up to run without connection to a Desktop Agent or to display an error.

```ts
/** 
 * Retrieves an FDC3 DesktopAgent instance either from a Desktop Agent that supports
 * injection of the API or by using the FDC3 Web Connection Protocol (WCP) to establish 
 * a connection to a browser-resident Desktop Agent.
 * 
 * If a Desktop Agent is not found initially, any `failover` function supplied as an argument 
 * will be run allowing an app to alternative means of connecting to a Desktop Agent, such 
 * as the use of a proprietary adaptor, starting on in a new window or iframe, etc. 
 * 
 * If no agent is found, via neither the default strategies or any failover function supplied,
 * then `getAgent()` will reject with an error from the AgentError enumeration.
 * 
 * @param {GetAgentParams} params Required parameters for the function.
 *  
 * @return A promise that resolves to an object which contains a DesktopAgent, or which
 * rejects with a string from the `AgentError` union if a DesktopAgent cannot be established.
 * 
 * @example  
 * const { desktopAgent: fdc3 } = await getAgent({ 
 *     appId: “myApp@myorg.com”
 * }); 
 * 
 *  * @example Using appDUrl
 * const { desktopAgent: fdc3 } = await getAgent({ 
 *     appDUrl: "https://myorg.com/api/appd/apps/myApp"
 * }); 
 */

export type GetAgentFunction = ( 
    params: GetAgentParams,  
) => Promise<{
    desktopAgent: DesktopAgent
}>;

/** 
 * @typedef {Object} GetAgentParams Type representing parameters passed to the 
 * getAgent function.
 * 
 * @property {string} appId The fully qualified appId that represents the application.
 * (in the form <app id>@<appd origin>)
 * 
 * @property {string} appDUrl A URL that points to an appD record for the application.
 * Used as an alternative to providing a fully qualified appId.
 * 
 * @property {number} timeout Number of milliseconds to allow for establishing a 
 * DesktopAgent. When the timeout expires, the optional provided failover function will be
 * run. Default 750.
 * 
 * @property {boolean} channelSelector Flag indicating that the application  
 * requires `getAgent() `to create a channel selector UI, which may be provided 
 * either by the Desktop Agent or the default FDC3 implementation. Defaults to true.
 * 
 * @property {boolean} intentResolver Flag indicating that the application  
 * requires `getAgent()` to create an intent resolver UI, which may be provided 
 * either by the Desktop Agent or the default FDC3 implementation. Defaults to true.
 * 
 * @property {function} failover A optional function that can establish connectivity
 * to a DesktopAgent if standard mechanisms fail or otherwise modify the behavior of the 
 * app when no Desktop Agent is available. If a URL is provided, `getAgent()` will 
 * create a hidden iframe to load it into. Alternatively, the app's failover function
 * may return a `WindowProxy` Object (i.e. the object returned by a `window.open()` 
 * call or the `contentWindow` property of an iframe). In either case, `getAgent()`
 * will re-run its internal algorithm with those objects (restarting the timeout). 
 * The function may also simply resolve to a DesktopAgent implementation, which will be
 * passed along to the app.
 */ 
export type GetAgentParams = {
    timeout ?: number, // Defaults to 750
    appId ?: string,
    appDUrl ?: string,
    channelSelector ?: boolean,
    intentResolver ?: boolean,
    failover ?: (args: GetAgentParams) =>  Promise<WindowProxy | URL | DesktopAgent>
}; 
```

## Persisted Connection Data

The `getAgent()` function uses SessionStorage ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage), [HTML Living Standard](https://html.spec.whatwg.org/multipage/webstorage.html)) to persist information on an instance of an app and how it connected to a Desktop Agent in order to ensure a consistent connection type and instance Id, in case it navigates or is refreshed. The details persisted conform to the following type:

```ts
/**
 * Connection data from a previous call to getAgent() that may be persisted to SessionStorage.
 * getAgent() will use this connection information when it exists to ensure a consistent instanceId
 * and connection type.
 */
export type DesktopAgentDetails = { 
    /** The type of DA. Prevents an inadvertent switch to a different agent.*/ 
    agentType: WebDesktopAgentType,

    /** May contain the URL that was used to connect to the prior DA.
     *  This may have been provided by a parent window that has since 
     *  closed or a failover function. It may therefore be used to open 
     * a new window/iframe and restart the DA. */ 
    url?: string, 

    /** The prior appId set by this window. If a appDUrl was previously set then
     * this appId will be set to the the representative fully qualified appId. */ 
    appId: string,

    /** The instanceId that was issued by the DA to this window. */ 
    instanceId: string,

    /** The instanceUuid that was previously issued by the DA.
     * This MUST be passed when connecting to the DA. The DA will use
     * this to determine whether the app has previously connected and
     * which instance it was. The DA uses this to reissue the same instanceId.
     * 
     * The instanceUuid is secret. It should never be shared with other applications
     * and is not available through the FDC3 API. */ 
    instanceUuid: string  
} 
 
/** Specifies the means by which a connection to the DA is made.
 * "INJECTED" - The DA injects the FDC3 interface at `window.fdc3`.
 * "PARENT" - The DA runs in a parent window or iframe.
 * "FAILOVER" - The DA, or details to connect to one, were provided by an app supplied failover function. 
 */ 
export type WebDesktopAgentType = "INJECTED" | "PARENT" | "FAILOVER";
```
