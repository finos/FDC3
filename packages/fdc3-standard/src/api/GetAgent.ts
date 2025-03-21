/**
 * Typescript related to the getAgent() function. Note that GetAgent.md is a copy of this file which has been modified
 * for display in markdown format.
 */
import { DesktopAgent } from './DesktopAgent';

/**
 * Function used to retrieve an FDC3 Desktop Agent API instance, which
 * supports the discovery of a Desktop Agent Preload (a container-injected
 * API implementation) or a Desktop Agent Proxy (a Browser-based Desktop Agent
 * running in another window or frame). Finally, if no Desktop Agent is found,
 * a failover function may be supplied by an app allowing it to start or otherwise
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
 *
 * // OR
 *
 * getAgent({
 *     identityUrl: "https://example.com/path?param=appName#example",
 *     channelSelector: false,
 *     intentResolver: false
 * }).then((fdc3) => {
 *     //do FDC3 stuff here
 * };
 */
export type GetAgentType = (params?: GetAgentParams) => Promise<DesktopAgent>;

/**
 * @typedef {Object} GetAgentParams Type representing parameters passed to the
 * getAgent function.
 *
 * @property {number} timeoutMs Number of milliseconds to allow for an FDC3
 * implementation to be found before calling the failover function or
 * rejecting (default 1000). Note that the timeout is cancelled as soon as a
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
 * @property {GetAgentLogLevels} logLevels Settings that determine what should
 * will logged by the getAgent() implementation and DesktopAgentProxy to the
 * JavaScript console.
 */
export type GetAgentParams = {
  timeoutMs?: number;
  identityUrl?: string;
  channelSelector?: boolean;
  intentResolver?: boolean;
  dontSetWindowFdc3?: boolean;
  failover?: (args: GetAgentParams) => Promise<WindowProxy | DesktopAgent>;
  logLevels?: GetAgentLogLevels;
};

/**
 * @typedef {Object} GetAgentLogLevels Type representing log-level parameters \
 * passed to the getAgent function that control what is logged to the JavaScript
 * console by the getAgent() implementation and any DesktopAgentProxy it creates.
 *
 * @property {boolean} connection Log-level for messages relating to establishing
 * a connection to the Desktop Agent (default INFO).
 *
 * @property {boolean} proxy Log-level for messages from a DesktopAgentProxy
 * created by getAgent. These include log of messages sent or received from the
 * DesktopAgent at the INFO level and heartbeat messages at the DEBUG level
 * (default WARN).
 *
 */
export type GetAgentLogLevels = {
  connection: LogLevel;
  proxy: LogLevel;
};

/**
 * Type representing the different log-levels that can be set.
 */
export enum LogLevel {
  NONE = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4,
}

/** Type representing the format of data stored by `getAgent`
 *  in Session Storage. The `identityUrl` of each app is used
 *  as the key. */
export type SessionStorageFormat = {
  /** */
  [key: string]: DesktopAgentDetails;
};

/** Type representing data on the Desktop Agent that an app
 *  connected to that is persisted by the getAgent function
 *  to be used when re-connecting (after a navigation or
 *  refresh event) and to ensure a consistent instanceId.
 */
export type DesktopAgentDetails = {
  /** The type of Desktop Agent connected to. Used to
   *  prevent an inadvertent switch to a different agent.*/
  agentType: WebDesktopAgentType;

  /** The URL that was previously sent to the Desktop Agent
   * to establish the app's identity.*/
  identityUrl: string;

  /** The current URL at the time of the last connection to
   * a Desktop Agent.*/
  actualUrl: string;

  /** Optional URL field that should be used to store any
   *  URL that was used to connect to a Desktop Agent. URLs
   *  may have been provided by a parent window that has since
   *  gone away and persisting may allow re-connection in such
   *  cases. */
  agentUrl?: string;

  /** The appId that was identified for the application by the
   * Desktop Agent.*/
  appId: string;

  /** The instanceId that was issued to the app by the Desktop
   * Agent. */
  instanceId: string;

  /** The instanceUuid that was issued to the app. This should be
   *  passed when connecting to the Desktop Agent to help
   *  identify that this app has connected before and which
   *  instance it is, enabling the Desktop Agent to reissue
   *  the same instanceId. The instanceUuid should never be shared
   *  with other applications and is not available through the
   *  FDC3 API, allowing it to be used as a shared secret with
   *  the Desktop Agent that issued the associated instanceId.*/
  instanceUuid: string;
};

/** Enumeration of values used to describe types of web-based
 *  Desktop Agent. Each 'type' refers to the means by which
 *  a connection to the agent is made and/or an interface to it
 *  received. */
export enum WebDesktopAgentType {
  /** Denotes Desktop Agents that inject the FDC3 interface
   *  at `window.fdc3`. */
  Preload = 'PRELOAD',

  /** Denotes Desktop Agents that run (or provide an interface)
   *  within a parent window or frame, a reference to which
   *  will be found at `window.opener`, `window.parent`,
   *  `window.parent.opener` etc. */
  ProxyParent = 'PROXY_PARENT',

  /** Denotes Desktop Agents that are connected to by loading a URL
   *  into a hidden iframe whose URL was returned by a parent window
   *  or frame. */
  ProxyUrl = 'PROXY_URL',

  /** Denotes a Desktop Agent that was returned by a failover
   *  function that was passed by the application. */
  Failover = 'FAILOVER',
}

export const DESKTOP_AGENT_SESSION_STORAGE_KEY_PREFIX = 'fdc3-desktop-agent-details';
