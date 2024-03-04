/**
 * Typescript related to the getAgent() function. Note that GetAgent.md is a copy of this file which has been modified
 * for display in markdown format.
 */
import { DesktopAgent } from "./DesktopAgent";
import { ImplementationMetadata } from "./ImplementationMetadata";
import { AppMetadata } from "./AppMetadata";

/** 
 * Retrieves an FDC3 DesktopAgent instance either from a Desktop Agent that supports
 * injection or by using the FDC3 Web Connection Protocol (WCP) to establish a connection
 * with a browser-resident Desktop Agent.
 * 
 * @param {GetAgentParams} params Required parameters for the function.
 *  
 * @return A promise that resolves to an object which contains a DesktopAgent, or which
 * rejects with a string from the AgentError union if a DesktopAgent cannot be established.
 * 
 * @example  
 * const { desktopAgent: fdc3 } = await getAgent({ 
 *     appId: “myApp@myorg.com/appd”
 * }); 
 * 
 *  * @example Using appDUrl
 * const { desktopAgent: fdc3 } = await getAgent({ 
 *     appId: “myApp”,
 *     appDUrl: "myorg.com/appd"
 * }); 
 */

export type GetAgentFunction = ( 
	params: GetAgentParams,  
) => Promise<{
    desktopAgent: DesktopAgent,
    implementationMetadata: ImplementationMetadata,
    appMetadata: AppMetadata
}>; 

/** 
 * @typedef {Object} GetAgentParams Type representing parameters passed to the 
 * getAgent function.
 * 
 * @property {string} appId The fully qualified appId that represents the application.
 * (in the form <app id>@<appd origin>)
 * 
 * @property {URL} appDUrl A URL that points to an appD record for the application.
 * Used as an alternative to providing a fully qualified appId.
 * 
 * @property {number} timeout Number of milliseconds to allow for establishing a 
 * DesktopAgent. When the timeout expires, the optional provided failover function will be
 * run. Default 750.
 * 
 * @property {boolean} channelSelector Flag indicating that the application  
 * requires getAgent() to create a channel selector UI. Defaults to true.
 * 
 * @property {boolean} intentResolver Flag indicating that the application  
 * requires getAgent() to create an intent resolver UI. Defaults to true.
 * 
 * @property {function} failover A optional function that can establish connectivity
 * to a DesktopAgent if standard mechanisms fail. If a WindowProxy or URL is provided
 * then getAgent() will re-run its internal algorithm with those objects (restarting
 * the timeout). The function may also simply return a DesktopAgent.
 */ 

export type GetAgentParams = {
    timeout ?: number, // Defaults to 750
    appId ?: string,
    appDUrl ?: string,
    failover ?: (args: GetAgentParams) =>  Promise<WindowProxy | URL | DesktopAgent>
}; 

/** 
 * Represents the set of errors that may be returned by getAgent() if connectivity
 * cannot be established with a DesktopAgent.
 * 
 * "AgentNotFound" - Returned when connectivity to a DA cannot be established.
 * 
 * "InvalidAgent" - Returned when a DA does not conform to the Web Connection Protocol (WCP).
 * 
 * "IdentityValidationFailed" - Returned when the app fails DA identity verification.
 * 
 * "NoAppIdentityProvided" - Returned when the DA refuses a connection from application.
 * 
 * "AccessDenied" - TODO? Returned when the app does not pass one of the required identity parameters indicating an app directory record.
 * 
 * "InvalidFailover" - Returned when the failover function itself, or its resolution is not the right type.
 * 
 * "ReestablishConnectionFailed" - Returned when reestablishment of an instance via persisted StorageSession data fails (e.g. after a page navigation)
 * 
 * "ErrorOnConnect" - Returned when any other error or exception occurs.
 */

export type AgentError = "AgentNotFound" | "InvalidAgent" | "IdentityValidationFailed" | "NoAppIdentityProvided" | "AccessDenied" | "ErrorOnConnect" | "InvalidFailover" | "ReestablishConnectionFailed";

/**
 * Connection data from a previous call to getAgent() that may be persisted to SessionStorage.
 * getAgent() will use this connection information when it exists to ensure a consistent instanceId.
 */
export type DesktopAgentDetails = { 
    /** The type of DA. Prevents an inadvertent switch to a different agent.*/ 
    agentType: WebDesktopAgentType,

    /** May contain the URL that was used to connect to the prior DA.
     *  This may have been provided by a parent window that has since 
     *  closed. It may therefore be used to open a new window/iframe and restart the DA. */ 
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
 * "URL" - The DA is loaded as an iframe in the app window.
 */ 
export type WebDesktopAgentType = "INJECTED" | "PARENT" | "URL";