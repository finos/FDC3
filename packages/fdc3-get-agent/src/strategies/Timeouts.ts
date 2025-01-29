/**
 * The default timeout used by getAgent when discovering Desktop Agents.
 */
export const DEFAULT_GETAGENT_TIMEOUT_MS = 1000;

/** Default timeout used by a DesktopAgentProxy for all message exchanges
 * with a DesktopAgent, except those that involve the launch of an application.
 * May be overridden by a DesktopAgent by passing a value in the
 * payload.messageExchangeTimeout of a WCP3Handshake message.
 */
export const DEFAULT_MESSAGE_EXCHANGE_TIMEOUT_MS = 10000;

/** Default timeout used by a DesktopAgentProxy for message exchanges with a
 * DesktopAgent that involve launching applications. May be overridden by a
 * DesktopAgent by passing a value in the payload.appLaunchTimeout of a
 * WCP3Handshake message.
 * */
export const DEFAULT_APP_LAUNCH_TIMEOUT_MS = 100000;
