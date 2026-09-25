// To parse this data:
//
//   import { Convert, AgentErrorResponseMessage, AgentRequestMessage, AgentResponseMessage, BridgeErrorResponseMessage, BridgeRequestMessage, BridgeResponseMessage, BroadcastAgentRequest, BroadcastBridgeRequest, ConnectionStepMessage, ConnectionStep2Hello, ConnectionStep3Handshake, ConnectionStep4AuthenticationFailed, ConnectionStep6ConnectedAgentsUpdate, FindInstancesAgentErrorResponse, FindInstancesAgentRequest, FindInstancesAgentResponse, FindInstancesBridgeErrorResponse, FindInstancesBridgeRequest, FindInstancesBridgeResponse, FindIntentAgentErrorResponse, FindIntentAgentRequest, FindIntentAgentResponse, FindIntentBridgeErrorResponse, FindIntentBridgeRequest, FindIntentBridgeResponse, FindIntentsByContextAgentErrorResponse, FindIntentsByContextAgentRequest, FindIntentsByContextAgentResponse, FindIntentsByContextBridgeErrorResponse, FindIntentsByContextBridgeRequest, FindIntentsByContextBridgeResponse, GetAppMetadataAgentErrorResponse, GetAppMetadataAgentRequest, GetAppMetadataAgentResponse, GetAppMetadataBridgeErrorResponse, GetAppMetadataBridgeRequest, GetAppMetadataBridgeResponse, OpenAgentErrorResponse, OpenAgentRequest, OpenAgentResponse, OpenBridgeErrorResponse, OpenBridgeRequest, OpenBridgeResponse, PrivateChannelBroadcastAgentRequest, PrivateChannelBroadcastBridgeRequest, PrivateChannelEventListenerAddedAgentRequest, PrivateChannelEventListenerAddedBridgeRequest, PrivateChannelEventListenerRemovedAgentRequest, PrivateChannelEventListenerRemovedBridgeRequest, PrivateChannelOnAddContextListenerAgentRequest, PrivateChannelOnAddContextListenerBridgeRequest, PrivateChannelOnDisconnectAgentRequest, PrivateChannelOnDisconnectBridgeRequest, PrivateChannelOnUnsubscribeAgentRequest, PrivateChannelOnUnsubscribeBridgeRequest, RaiseIntentAgentErrorResponse, RaiseIntentAgentRequest, RaiseIntentAgentResponse, RaiseIntentBridgeErrorResponse, RaiseIntentBridgeRequest, RaiseIntentBridgeResponse, RaiseIntentResultAgentErrorResponse, RaiseIntentResultAgentResponse, RaiseIntentResultBridgeErrorResponse, RaiseIntentResultBridgeResponse } from "./file";
//
//   const agentErrorResponseMessage = Convert.toAgentErrorResponseMessage(json);
//   const agentRequestMessage = Convert.toAgentRequestMessage(json);
//   const agentResponseMessage = Convert.toAgentResponseMessage(json);
//   const bridgeErrorResponseMessage = Convert.toBridgeErrorResponseMessage(json);
//   const bridgeRequestMessage = Convert.toBridgeRequestMessage(json);
//   const bridgeResponseMessage = Convert.toBridgeResponseMessage(json);
//   const broadcastAgentRequest = Convert.toBroadcastAgentRequest(json);
//   const broadcastBridgeRequest = Convert.toBroadcastBridgeRequest(json);
//   const bridgeCommonDefinitions = Convert.toBridgeCommonDefinitions(json);
//   const connectionStepMessage = Convert.toConnectionStepMessage(json);
//   const connectionStep2Hello = Convert.toConnectionStep2Hello(json);
//   const connectionStep3Handshake = Convert.toConnectionStep3Handshake(json);
//   const connectionStep4AuthenticationFailed = Convert.toConnectionStep4AuthenticationFailed(json);
//   const connectionStep6ConnectedAgentsUpdate = Convert.toConnectionStep6ConnectedAgentsUpdate(json);
//   const findInstancesAgentErrorResponse = Convert.toFindInstancesAgentErrorResponse(json);
//   const findInstancesAgentRequest = Convert.toFindInstancesAgentRequest(json);
//   const findInstancesAgentResponse = Convert.toFindInstancesAgentResponse(json);
//   const findInstancesBridgeErrorResponse = Convert.toFindInstancesBridgeErrorResponse(json);
//   const findInstancesBridgeRequest = Convert.toFindInstancesBridgeRequest(json);
//   const findInstancesBridgeResponse = Convert.toFindInstancesBridgeResponse(json);
//   const findIntentAgentErrorResponse = Convert.toFindIntentAgentErrorResponse(json);
//   const findIntentAgentRequest = Convert.toFindIntentAgentRequest(json);
//   const findIntentAgentResponse = Convert.toFindIntentAgentResponse(json);
//   const findIntentBridgeErrorResponse = Convert.toFindIntentBridgeErrorResponse(json);
//   const findIntentBridgeRequest = Convert.toFindIntentBridgeRequest(json);
//   const findIntentBridgeResponse = Convert.toFindIntentBridgeResponse(json);
//   const findIntentsByContextAgentErrorResponse = Convert.toFindIntentsByContextAgentErrorResponse(json);
//   const findIntentsByContextAgentRequest = Convert.toFindIntentsByContextAgentRequest(json);
//   const findIntentsByContextAgentResponse = Convert.toFindIntentsByContextAgentResponse(json);
//   const findIntentsByContextBridgeErrorResponse = Convert.toFindIntentsByContextBridgeErrorResponse(json);
//   const findIntentsByContextBridgeRequest = Convert.toFindIntentsByContextBridgeRequest(json);
//   const findIntentsByContextBridgeResponse = Convert.toFindIntentsByContextBridgeResponse(json);
//   const getAppMetadataAgentErrorResponse = Convert.toGetAppMetadataAgentErrorResponse(json);
//   const getAppMetadataAgentRequest = Convert.toGetAppMetadataAgentRequest(json);
//   const getAppMetadataAgentResponse = Convert.toGetAppMetadataAgentResponse(json);
//   const getAppMetadataBridgeErrorResponse = Convert.toGetAppMetadataBridgeErrorResponse(json);
//   const getAppMetadataBridgeRequest = Convert.toGetAppMetadataBridgeRequest(json);
//   const getAppMetadataBridgeResponse = Convert.toGetAppMetadataBridgeResponse(json);
//   const openAgentErrorResponse = Convert.toOpenAgentErrorResponse(json);
//   const openAgentRequest = Convert.toOpenAgentRequest(json);
//   const openAgentResponse = Convert.toOpenAgentResponse(json);
//   const openBridgeErrorResponse = Convert.toOpenBridgeErrorResponse(json);
//   const openBridgeRequest = Convert.toOpenBridgeRequest(json);
//   const openBridgeResponse = Convert.toOpenBridgeResponse(json);
//   const privateChannelBroadcastAgentRequest = Convert.toPrivateChannelBroadcastAgentRequest(json);
//   const privateChannelBroadcastBridgeRequest = Convert.toPrivateChannelBroadcastBridgeRequest(json);
//   const privateChannelEventListenerAddedAgentRequest = Convert.toPrivateChannelEventListenerAddedAgentRequest(json);
//   const privateChannelEventListenerAddedBridgeRequest = Convert.toPrivateChannelEventListenerAddedBridgeRequest(json);
//   const privateChannelEventListenerRemovedAgentRequest = Convert.toPrivateChannelEventListenerRemovedAgentRequest(json);
//   const privateChannelEventListenerRemovedBridgeRequest = Convert.toPrivateChannelEventListenerRemovedBridgeRequest(json);
//   const privateChannelOnAddContextListenerAgentRequest = Convert.toPrivateChannelOnAddContextListenerAgentRequest(json);
//   const privateChannelOnAddContextListenerBridgeRequest = Convert.toPrivateChannelOnAddContextListenerBridgeRequest(json);
//   const privateChannelOnDisconnectAgentRequest = Convert.toPrivateChannelOnDisconnectAgentRequest(json);
//   const privateChannelOnDisconnectBridgeRequest = Convert.toPrivateChannelOnDisconnectBridgeRequest(json);
//   const privateChannelOnUnsubscribeAgentRequest = Convert.toPrivateChannelOnUnsubscribeAgentRequest(json);
//   const privateChannelOnUnsubscribeBridgeRequest = Convert.toPrivateChannelOnUnsubscribeBridgeRequest(json);
//   const raiseIntentAgentErrorResponse = Convert.toRaiseIntentAgentErrorResponse(json);
//   const raiseIntentAgentRequest = Convert.toRaiseIntentAgentRequest(json);
//   const raiseIntentAgentResponse = Convert.toRaiseIntentAgentResponse(json);
//   const raiseIntentBridgeErrorResponse = Convert.toRaiseIntentBridgeErrorResponse(json);
//   const raiseIntentBridgeRequest = Convert.toRaiseIntentBridgeRequest(json);
//   const raiseIntentBridgeResponse = Convert.toRaiseIntentBridgeResponse(json);
//   const raiseIntentResultAgentErrorResponse = Convert.toRaiseIntentResultAgentErrorResponse(json);
//   const raiseIntentResultAgentResponse = Convert.toRaiseIntentResultAgentResponse(json);
//   const raiseIntentResultBridgeErrorResponse = Convert.toRaiseIntentResultBridgeErrorResponse(json);
//   const raiseIntentResultBridgeResponse = Convert.toRaiseIntentResultBridgeResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

/**
 * A response message from a Desktop Agent to the Bridge containing an error, to be used in
 * preference to the standard response when an error needs to be returned.
 */
export interface AgentErrorResponseMessage {
  meta: AgentResponseMetadata;
  /**
   * Error message payload containing an standardized error string.
   */
  payload: ErrorResponseMessagePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: ResponseMessageType;
}

/**
 * Metadata for a response messages sent by a Desktop Agent to the Bridge
 */
export interface AgentResponseMetadata {
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * Error message payload containing an standardized error string.
 */
export interface ErrorResponseMessagePayload {
  error: ResponseErrorDetail;
  [property: string]: any;
}

/**
 * Array of error message strings for responses that were not returned to the bridge before
 * the timeout or because an error occurred. Should be the same length as the `errorSources`
 * array and ordered the same. May be omitted if all sources responded without errors.
 *
 * Constants representing the errors that can be encountered when calling the `open` method
 * on the DesktopAgent object (`fdc3`).
 *
 * Constants representing the errors that can be encountered when calling the
 * `addIntentListener`, `findIntent`, `findIntentsByContext`, `raiseIntent` or
 * `raiseIntentForContext` methods on the DesktopAgent (`fdc3`).
 */
export type ResponseErrorDetail =
  | 'AccessDenied'
  | 'CreationFailed'
  | 'MalformedContext'
  | 'NoChannelFound'
  | 'ApiTimeout'
  | 'InvalidArguments'
  | 'AppNotFound'
  | 'AppTimeout'
  | 'DesktopAgentNotFound'
  | 'ErrorOnLaunch'
  | 'ResolverUnavailable'
  | 'IntentDeliveryFailed'
  | 'NoAppsFound'
  | 'ResolverTimeout'
  | 'TargetAppUnavailable'
  | 'TargetInstanceUnavailable'
  | 'UserCancelledResolution'
  | 'IntentListenerConflict'
  | 'IntentHandlerRejected'
  | 'NoResultReturned'
  | 'AgentDisconnected'
  | 'NotConnectedToBridge'
  | 'ResponseToBridgeTimedOut'
  | 'MalformedMessage';

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */
export type ResponseMessageType =
  | 'findInstancesResponse'
  | 'findIntentResponse'
  | 'findIntentsByContextResponse'
  | 'getAppMetadataResponse'
  | 'openResponse'
  | 'raiseIntentResponse'
  | 'raiseIntentResultResponse';

/**
 * A request message from a Desktop Agent to the Bridge.
 */
export interface AgentRequestMessage {
  meta: AgentRequestMetadata;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: { [key: string]: any };
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: RequestMessageType;
}

/**
 * Metadata for a request message sent by Desktop Agents to the Bridge.
 */
export interface AgentRequestMetadata {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: BridgeParticipantIdentifier;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself.
   */
  source?: SourceIdentifier;
  timestamp: Date;
}

/**
 * Optional field that represents the destination that the request should be routed to. Must
 * be set by the Desktop Agent for API calls that include a target app parameter and must
 * include the name of the Desktop Agent hosting the target application.
 *
 * Represents identifiers that MUST include the Desktop Agent name and MAY identify a
 * specific app or instance.
 *
 * Field that represents the source application that the request was received from, or the
 * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
 * be set by the bridge.
 *
 * Identifies a particular Desktop Agent in Desktop Agent Bridging scenarios
 * where a request needs to be directed to a Desktop Agent rather than a specific app, or a
 * response message is returned by the Desktop Agent (or more specifically its resolver)
 * rather than a specific app. Used as a substitute for `AppIdentifier` in cases where no
 * app details are available or are appropriate.
 *
 * Array of DesktopAgentIdentifiers for responses that were not returned to the bridge
 * before the timeout or because an error occurred. May be omitted if all sources responded
 * without errors. MUST include the `desktopAgent` field when returned by the bridge.
 *
 * Array of DesktopAgentIdentifiers for the sources that generated responses to the request.
 * Will contain a single value for individual responses and multiple values for responses
 * that were collated by the bridge. May be omitted if all sources errored. MUST include the
 * `desktopAgent` field when returned by the bridge.
 *
 * Field that represents a destination Desktop Agent that a request is to be sent to.
 *
 * Field that represents a destination App on a remote Desktop Agent that a request is to be
 * sent to.
 *
 * Identifies an application, or instance of an application, and is used to target FDC3 API
 * calls, such as `fdc3.open` or `fdc3.raiseIntent` at specific applications or application
 * instances.
 *
 * Will always include at least an `appId` field, which uniquely identifies a specific app.
 *
 * If the `instanceId` field is set then the `AppMetadata` object represents a specific
 * instance of the application that may be addressed using that Id.
 *
 * Field that represents the source application that a request or response was received
 * from.
 *
 * Identifier for the app instance that was selected (or started) to resolve the intent.
 * `source.instanceId` MUST be set, indicating the specific app instance that
 * received the intent.
 *
 * Identifier for the app instance that sent the context and/or intent.
 */
export interface BridgeParticipantIdentifier {
  /**
   * Used in Desktop Agent Bridging to attribute or target a message to a
   * particular Desktop Agent.
   *
   * The Desktop Agent that the app is available on. Used in Desktop Agent Bridging to
   * identify the Desktop Agent to target.
   */
  desktopAgent: string;
  /**
   * The unique application identifier located within a specific application directory
   * instance. An example of an appId might be 'app@sub.root'.
   */
  appId?: string;
  /**
   * An optional instance identifier, indicating that this object represents a specific
   * instance of the application described.
   */
  instanceId?: string;
  [property: string]: any;
}

/**
 * Field that represents the source application that the request was received from, or the
 * source Desktop Agent if it issued the request itself.
 *
 * Field that represents the source application that a request or response was received
 * from, or the source Desktop Agent if it issued the request or response itself.
 *
 * Identifies an application, or instance of an application, and is used to target FDC3 API
 * calls, such as `fdc3.open` or `fdc3.raiseIntent` at specific applications or application
 * instances.
 *
 * Will always include at least an `appId` field, which uniquely identifies a specific app.
 *
 * If the `instanceId` field is set then the `AppMetadata` object represents a specific
 * instance of the application that may be addressed using that Id.
 *
 * Field that represents the source application that a request or response was received
 * from.
 *
 * Identifier for the app instance that was selected (or started) to resolve the intent.
 * `source.instanceId` MUST be set, indicating the specific app instance that
 * received the intent.
 *
 * Identifier for the app instance that sent the context and/or intent.
 *
 * Identifies a particular Desktop Agent in Desktop Agent Bridging scenarios
 * where a request needs to be directed to a Desktop Agent rather than a specific app, or a
 * response message is returned by the Desktop Agent (or more specifically its resolver)
 * rather than a specific app. Used as a substitute for `AppIdentifier` in cases where no
 * app details are available or are appropriate.
 *
 * Array of DesktopAgentIdentifiers for responses that were not returned to the bridge
 * before the timeout or because an error occurred. May be omitted if all sources responded
 * without errors. MUST include the `desktopAgent` field when returned by the bridge.
 *
 * Array of DesktopAgentIdentifiers for the sources that generated responses to the request.
 * Will contain a single value for individual responses and multiple values for responses
 * that were collated by the bridge. May be omitted if all sources errored. MUST include the
 * `desktopAgent` field when returned by the bridge.
 *
 * Field that represents a destination Desktop Agent that a request is to be sent to.
 */
export interface SourceIdentifier {
  /**
   * The unique application identifier located within a specific application directory
   * instance. An example of an appId might be 'app@sub.root'.
   */
  appId?: string;
  /**
   * The Desktop Agent that the app is available on. Used in Desktop Agent Bridging to
   * identify the Desktop Agent to target.
   *
   * Used in Desktop Agent Bridging to attribute or target a message to a
   * particular Desktop Agent.
   */
  desktopAgent?: string;
  /**
   * An optional instance identifier, indicating that this object represents a specific
   * instance of the application described.
   */
  instanceId?: string;
  [property: string]: any;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */
export type RequestMessageType =
  | 'broadcastRequest'
  | 'findInstancesRequest'
  | 'findIntentRequest'
  | 'findIntentsByContextRequest'
  | 'getAppMetadataRequest'
  | 'openRequest'
  | 'PrivateChannel.broadcast'
  | 'PrivateChannel.eventListenerAdded'
  | 'PrivateChannel.eventListenerRemoved'
  | 'PrivateChannel.onAddContextListener'
  | 'PrivateChannel.onDisconnect'
  | 'PrivateChannel.onUnsubscribe'
  | 'raiseIntentRequest';

/**
 * A response message from a Desktop Agent to the Bridge.
 */
export interface AgentResponseMessage {
  meta: AgentResponseMetadata;
  /**
   * The message payload typically contains return values for FDC3 API functions.
   */
  payload: { [key: string]: any };
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: ResponseMessageType;
}

/**
 * A response message from the Bridge back to the original Desktop Agent that raised the
 * request, used where all connected agents returned errors.
 */
export interface BridgeErrorResponseMessage {
  meta: BridgeErrorResponseMessageMeta;
  /**
   * The error message payload contains details of an error return to the app or agent that
   * raised the original request.
   */
  payload: ResponseErrorMessagePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: string;
}

/**
 * Metadata required in a response message collated and/or forwarded on by the Bridge
 */
export interface BridgeErrorResponseMessageMeta {
  errorDetails: ResponseErrorDetail[];
  errorSources: DesktopAgentIdentifier[];
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * Identifies a particular Desktop Agent in Desktop Agent Bridging scenarios
 * where a request needs to be directed to a Desktop Agent rather than a specific app, or a
 * response message is returned by the Desktop Agent (or more specifically its resolver)
 * rather than a specific app. Used as a substitute for `AppIdentifier` in cases where no
 * app details are available or are appropriate.
 *
 * Array of DesktopAgentIdentifiers for responses that were not returned to the bridge
 * before the timeout or because an error occurred. May be omitted if all sources responded
 * without errors. MUST include the `desktopAgent` field when returned by the bridge.
 *
 * Array of DesktopAgentIdentifiers for the sources that generated responses to the request.
 * Will contain a single value for individual responses and multiple values for responses
 * that were collated by the bridge. May be omitted if all sources errored. MUST include the
 * `desktopAgent` field when returned by the bridge.
 *
 * Field that represents a destination Desktop Agent that a request is to be sent to.
 */
export interface DesktopAgentIdentifier {
  /**
   * Used in Desktop Agent Bridging to attribute or target a message to a
   * particular Desktop Agent.
   */
  desktopAgent: string;
  [property: string]: any;
}

/**
 * The error message payload contains details of an error return to the app or agent that
 * raised the original request.
 */
export interface ResponseErrorMessagePayload {
  error?: ResponseErrorDetail;
  [property: string]: any;
}

/**
 * A request message forwarded from the Bridge onto a Desktop Agent connected to it.
 */
export interface BridgeRequestMessage {
  meta: BridgeRequestMetadata;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: { [key: string]: any };
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: string;
}

/**
 * Metadata required in a request message forwarded on by the Bridge
 */
export interface BridgeRequestMetadata {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: BridgeParticipantIdentifier;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
   * be set by the bridge.
   */
  source: BridgeParticipantIdentifier;
  timestamp: Date;
}

/**
 * A response message from the Bridge back to the original Desktop Agent that raised the
 * request.
 */
export interface BridgeResponseMessage {
  meta: BridgeResponseMessageMeta;
  /**
   * The message payload typically contains return values for FDC3 API functions.
   */
  payload: { [key: string]: any };
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: string;
}

/**
 * Metadata required in a response message collated and/or forwarded on by the Bridge
 */
export interface BridgeResponseMessageMeta {
  errorDetails?: ResponseErrorDetail[];
  errorSources?: DesktopAgentIdentifier[];
  requestUuid: string;
  responseUuid: string;
  sources?: DesktopAgentIdentifier[];
  timestamp: Date;
}

/**
 * A request to broadcast context on a channel.
 *
 * A request message from a Desktop Agent to the Bridge.
 */
export interface BroadcastAgentRequest {
  meta: BroadcastAgentRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: BroadcastAgentRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'broadcastRequest';
}

/**
 * Metadata for a request message sent by Desktop Agents to the Bridge.
 */
export interface BroadcastAgentRequestMeta {
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself.
   */
  source: SourceObject;
  timestamp: Date;
}

/**
 * Identifies an application, or instance of an application, and is used to target FDC3 API
 * calls, such as `fdc3.open` or `fdc3.raiseIntent` at specific applications or application
 * instances.
 *
 * Will always include at least an `appId` field, which uniquely identifies a specific app.
 *
 * If the `instanceId` field is set then the `AppMetadata` object represents a specific
 * instance of the application that may be addressed using that Id.
 *
 * Field that represents the source application that a request or response was received
 * from.
 *
 * Identifier for the app instance that was selected (or started) to resolve the intent.
 * `source.instanceId` MUST be set, indicating the specific app instance that
 * received the intent.
 *
 * Identifier for the app instance that sent the context and/or intent.
 *
 * Field that represents the source application that the request was received from, or the
 * source Desktop Agent if it issued the request itself.
 *
 * Field that represents the source application that a request or response was received
 * from, or the source Desktop Agent if it issued the request or response itself.
 *
 * Identifies a particular Desktop Agent in Desktop Agent Bridging scenarios
 * where a request needs to be directed to a Desktop Agent rather than a specific app, or a
 * response message is returned by the Desktop Agent (or more specifically its resolver)
 * rather than a specific app. Used as a substitute for `AppIdentifier` in cases where no
 * app details are available or are appropriate.
 *
 * Array of DesktopAgentIdentifiers for responses that were not returned to the bridge
 * before the timeout or because an error occurred. May be omitted if all sources responded
 * without errors. MUST include the `desktopAgent` field when returned by the bridge.
 *
 * Array of DesktopAgentIdentifiers for the sources that generated responses to the request.
 * Will contain a single value for individual responses and multiple values for responses
 * that were collated by the bridge. May be omitted if all sources errored. MUST include the
 * `desktopAgent` field when returned by the bridge.
 *
 * Field that represents a destination Desktop Agent that a request is to be sent to.
 */
export interface SourceObject {
  /**
   * The unique application identifier located within a specific application directory
   * instance. An example of an appId might be 'app@sub.root'.
   */
  appId: string;
  /**
   * The Desktop Agent that the app is available on. Used in Desktop Agent Bridging to
   * identify the Desktop Agent to target.
   *
   * Used in Desktop Agent Bridging to attribute or target a message to a
   * particular Desktop Agent.
   */
  desktopAgent?: string;
  /**
   * An optional instance identifier, indicating that this object represents a specific
   * instance of the application described.
   */
  instanceId?: string;
  [property: string]: any;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface BroadcastAgentRequestPayload {
  /**
   * The Id of the Channel that the broadcast was sent on.
   */
  channelId: string;
  /**
   * The context object that is to be broadcast.
   */
  context: Context;
  /**
   * Optional metadata supplied by the broadcasting app (`traceId`, `signature`, `antiReplay`
   * and `custom`). This field carries only the app-provided portion of the metadata; the
   * Desktop Agent adds its own `source` and `timestamp` before delivering the enriched
   * `ContextMetadata` to receiving apps. It MUST be omitted when the app did not supply a
   * metadata argument to `broadcast()`.
   */
  metadata?: AppProvidableContextMetadata;
}

/**
 * The context object that is to be broadcast.
 *
 * The context object that was the payload of a broadcast message.
 *
 * The `fdc3.context` type defines the basic contract or "shape" for all data exchanged by
 * FDC3 operations. As such, it is not really meant to be used on its own, but is imported
 * by more specific type definitions (standardized or custom) to provide the structure and
 * properties shared by all FDC3 context data types.
 *
 * The key element of FDC3 context types is their mandatory `type` property, which is used
 * to identify what type of data the object represents, and what shape it has.
 *
 * The FDC3 context type, and all derived types, define the minimum set of fields a context
 * data object of a particular type can be expected to have, but this can always be extended
 * with custom fields as appropriate.
 */
export interface Context {
  /**
   * Context data objects may include a set of equivalent key-value pairs that can be used to
   * help applications identify and look up the context type they receive in their own domain.
   * The idea behind this design is that applications can provide as many equivalent
   * identifiers to a target application as possible, e.g. an instrument may be represented by
   * an ISIN, CUSIP or Bloomberg identifier.
   *
   * Identifiers do not make sense for all types of data, so the `id` property is therefore
   * optional, but some derived types may choose to require at least one identifier.
   * Identifier values SHOULD always be of type string.
   */
  id?: { [key: string]: any };
  /**
   * Context data objects may include a name property that can be used for more information,
   * or display purposes. Some derived types may require the name object as mandatory,
   * depending on use case.
   */
  name?: string;
  /**
   * The type property is the only _required_ part of the FDC3 context data schema. The FDC3
   * [API](https://fdc3.finos.org/docs/api/spec) relies on the `type` property being present
   * to route shared context data appropriately.
   *
   * FDC3 [Intents](https://fdc3.finos.org/docs/intents/spec) also register the context data
   * types they support in an FDC3 [App
   * Directory](https://fdc3.finos.org/docs/app-directory/overview), used for intent discovery
   * and routing.
   *
   * Standardized FDC3 context types have well-known `type` properties prefixed with the
   * `fdc3` namespace, e.g. `fdc3.instrument`. For non-standard types, e.g. those defined and
   * used by a particular organization, the convention is to prefix them with an
   * organization-specific namespace, e.g. `blackrock.fund`.
   *
   * See the [Context Data Specification](https://fdc3.finos.org/docs/context/spec) for more
   * information about context data types.
   */
  type: string;
  [property: string]: any;
}

/**
 * Optional metadata supplied by the broadcasting app (`traceId`, `signature`, `antiReplay`
 * and `custom`). This field carries only the app-provided portion of the metadata; the
 * Desktop Agent adds its own `source` and `timestamp` before delivering the enriched
 * `ContextMetadata` to receiving apps. It MUST be omitted when the app did not supply a
 * metadata argument to `broadcast()`.
 *
 * Metadata that can be provided by an app as part of a broadcast, raise intent or open API
 * call.
 */
export interface AppProvidableContextMetadata {
  /**
   * Should be populated when the context is signed.  Included in the signature.  Prevents
   * replay attacks where context objects are re-used.
   */
  antiReplay?: AntiReplayClaims;
  custom?: { [key: string]: any };
  /**
   * A Detached JSON Web Signature (JWS) proving the authenticity and integrity of the context.
   */
  signature?: DetachedSignature;
  traceId?: string;
}

/**
 * Should be populated when the context is signed.  Included in the signature.  Prevents
 * replay attacks where context objects are re-used.
 *
 * Anti-replay claims extracted from the context's antiReplay field after verification.
 *
 * Anti-replay claims supplied with signed context (e.g. merged from intentResultRequest
 * metadata into resultMetadata).
 */
export interface AntiReplayClaims {
  /**
   * Expiration time as a Unix timestamp (seconds since epoch).
   */
  exp: number;
  /**
   * Issued at time as a Unix timestamp (seconds since epoch).
   */
  iat: number;
  /**
   * Unique identifier for this context instance.
   */
  jti: string;
}

/**
 * A Detached JSON Web Signature (JWS) proving the authenticity and integrity of the
 * context.
 *
 * A Detached JSON Web Signature (JWS) proving the authenticity and integrity of signed
 * data. The signature is computed over the canonicalized JSON representation of the data
 * (the payload is not included in the signature structure - it is the data itself). Created
 * using the signing app's private key and verified using the public key from the JWKS URL
 * in the protected header. See the FDC3 Security & Identity documentation for details.
 */
export interface DetachedSignature {
  /**
   * The BASE64URL-encoded protected header. When decoded, contains fields including: 'alg'
   * (signature algorithm, e.g., 'EdDSA'), 'jku' (JSON Web Key Set URL for key verification),
   * and 'kid' (key identifier).
   */
  protected: string;
  /**
   * The BASE64URL-encoded digital signature computed over the protected header and the
   * canonicalized data (detached payload).
   */
  signature: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A request to broadcast context on a channel.
 *
 * A request message forwarded from the Bridge onto a Desktop Agent connected to it.
 */
export interface BroadcastBridgeRequest {
  meta: BroadcastBridgeRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: BroadcastBridgeRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'broadcastRequest';
}

/**
 * Metadata required in a request message forwarded on by the Bridge
 */
export interface BroadcastBridgeRequestMeta {
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
   * be set by the bridge.
   */
  source: MetaSource;
  timestamp: Date;
}

/**
 * Identifies an application, or instance of an application, and is used to target FDC3 API
 * calls, such as `fdc3.open` or `fdc3.raiseIntent` at specific applications or application
 * instances.
 *
 * Will always include at least an `appId` field, which uniquely identifies a specific app.
 *
 * If the `instanceId` field is set then the `AppMetadata` object represents a specific
 * instance of the application that may be addressed using that Id.
 *
 * Field that represents the source application that a request or response was received
 * from.
 *
 * Identifier for the app instance that was selected (or started) to resolve the intent.
 * `source.instanceId` MUST be set, indicating the specific app instance that
 * received the intent.
 *
 * Identifier for the app instance that sent the context and/or intent.
 *
 * Optional field that represents the destination that the request should be routed to. Must
 * be set by the Desktop Agent for API calls that include a target app parameter and must
 * include the name of the Desktop Agent hosting the target application.
 *
 * Represents identifiers that MUST include the Desktop Agent name and MAY identify a
 * specific app or instance.
 *
 * Field that represents the source application that the request was received from, or the
 * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
 * be set by the bridge.
 *
 * Identifies a particular Desktop Agent in Desktop Agent Bridging scenarios
 * where a request needs to be directed to a Desktop Agent rather than a specific app, or a
 * response message is returned by the Desktop Agent (or more specifically its resolver)
 * rather than a specific app. Used as a substitute for `AppIdentifier` in cases where no
 * app details are available or are appropriate.
 *
 * Array of DesktopAgentIdentifiers for responses that were not returned to the bridge
 * before the timeout or because an error occurred. May be omitted if all sources responded
 * without errors. MUST include the `desktopAgent` field when returned by the bridge.
 *
 * Array of DesktopAgentIdentifiers for the sources that generated responses to the request.
 * Will contain a single value for individual responses and multiple values for responses
 * that were collated by the bridge. May be omitted if all sources errored. MUST include the
 * `desktopAgent` field when returned by the bridge.
 *
 * Field that represents a destination Desktop Agent that a request is to be sent to.
 *
 * Field that represents a destination App on a remote Desktop Agent that a request is to be
 * sent to.
 */
export interface MetaSource {
  /**
   * The unique application identifier located within a specific application directory
   * instance. An example of an appId might be 'app@sub.root'.
   */
  appId: string;
  /**
   * The Desktop Agent that the app is available on. Used in Desktop Agent Bridging to
   * identify the Desktop Agent to target.
   *
   * Used in Desktop Agent Bridging to attribute or target a message to a
   * particular Desktop Agent.
   */
  desktopAgent: string;
  /**
   * An optional instance identifier, indicating that this object represents a specific
   * instance of the application described.
   */
  instanceId?: string;
  [property: string]: any;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface BroadcastBridgeRequestPayload {
  /**
   * The Id of the Channel that the broadcast was sent on.
   */
  channelId: string;
  /**
   * The context object that is to be broadcast.
   */
  context: Context;
  /**
   * Optional metadata supplied by the broadcasting app (`traceId`, `signature`, `antiReplay`
   * and `custom`). This field carries only the app-provided portion of the metadata; the
   * Desktop Agent adds its own `source` and `timestamp` before delivering the enriched
   * `ContextMetadata` to receiving apps. It MUST be omitted when the app did not supply a
   * metadata argument to `broadcast()`.
   */
  metadata?: AppProvidableContextMetadata;
}

/**
 * A message used during the connection flow for a Desktop Agent to the Bridge. Used for
 * messages sent in either direction.
 */
export interface ConnectionStepMessage {
  meta: ConnectionStepMetadata;
  /**
   * The message payload, containing data pertaining to this connection step.
   */
  payload: { [key: string]: any };
  /**
   * Identifies the type of the connection step message.
   */
  type: ConnectionStepMessageType;
}

/**
 * Metadata for this connection step message.
 */
export interface ConnectionStepMetadata {
  requestUuid?: string;
  responseUuid?: string;
  timestamp: Date;
}

/**
 * Identifies the type of the connection step message.
 */
export type ConnectionStepMessageType = 'hello' | 'handshake' | 'authenticationFailed' | 'connectedAgentsUpdate';

/**
 * Hello message sent by the Bridge to anyone connecting to the Bridge (enables
 * identification as a bridge and confirmation of whether authentication is required)
 *
 * A message used during the connection flow for a Desktop Agent to the Bridge. Used for
 * messages sent in either direction.
 */
export interface ConnectionStep2Hello {
  meta: ConnectionStep2HelloMeta;
  /**
   * The message payload, containing data pertaining to this connection step.
   */
  payload: ConnectionStep2HelloPayload;
  /**
   * Identifies the type of the connection step message.
   */
  type: 'hello';
}

/**
 * Metadata for this connection step message.
 */
export interface ConnectionStep2HelloMeta {
  timestamp: Date;
}

/**
 * The message payload, containing data pertaining to this connection step.
 */
export interface ConnectionStep2HelloPayload {
  /**
   * A flag indicating whether the Desktop Agent Bridge requires authentication or not.
   */
  authRequired: boolean;
  /**
   * An optional Desktop Agent Bridge JWT authentication token if the Desktop Agent want to
   * authenticate a bridge.
   */
  authToken?: string;
  /**
   * The version of the Bridge
   */
  desktopAgentBridgeVersion: string;
  /**
   * The FDC3 versions supported by the Bridge
   */
  supportedFDC3Versions: string[];
}

/**
 * Identifies the type of the connection step message.
 */

/**
 * Handshake message sent by the Desktop Agent to the Bridge (including requested name,
 * channel state and authentication data)
 *
 * A message used during the connection flow for a Desktop Agent to the Bridge. Used for
 * messages sent in either direction.
 */
export interface ConnectionStep3Handshake {
  meta: ConnectionStep3HandshakeMeta;
  /**
   * The message payload, containing data pertaining to this connection step.
   */
  payload: ConnectionStep3HandshakePayload;
  /**
   * Identifies the type of the connection step message.
   */
  type: 'handshake';
}

/**
 * Metadata for this connection step message.
 */
export interface ConnectionStep3HandshakeMeta {
  requestUuid: string;
  timestamp: Date;
}

/**
 * The message payload, containing data pertaining to this connection step.
 */
export interface ConnectionStep3HandshakePayload {
  authToken?: string;
  /**
   * The current state of the Desktop Agent's App and User channels (exclude any Private
   * channels), as a mapping of channel id to an array of Context objects, one per type found
   * in the channel, most recent first.
   */
  channelsState: { [key: string]: Context[] };
  /**
   * Desktop Agent ImplementationMetadata trying to connect to the bridge.
   */
  implementationMetadata: ConnectingAgentImplementationMetadata;
  /**
   * The requested Desktop Agent name
   */
  requestedName: string;
}

/**
 * Desktop Agent ImplementationMetadata trying to connect to the bridge.
 *
 * Metadata relating to the FDC3 Desktop Agent implementation and its provider.
 */
export interface ConnectingAgentImplementationMetadata {
  /**
   * The version number of the FDC3 specification that the implementation provides.
   * The string must be a numeric semver version, e.g. 1.2 or 1.2.1.
   */
  fdc3Version: string;
  /**
   * Metadata indicating whether the Desktop Agent implements optional features of
   * the Desktop Agent API.
   */
  optionalFeatures: OptionalFeatures;
  /**
   * The name of the provider of the Desktop Agent implementation (e.g. Finsemble, Glue42,
   * OpenFin etc.).
   */
  provider: string;
  /**
   * The version of the provider of the Desktop Agent implementation (e.g. 5.3.0).
   */
  providerVersion?: string;
}

/**
 * Metadata indicating whether the Desktop Agent implements optional features of
 * the Desktop Agent API.
 */
export interface OptionalFeatures {
  /**
   * Used to indicate whether the experimental Desktop Agent Bridging
   * feature is implemented by the Desktop Agent.
   */
  DesktopAgentBridging: boolean;
  /**
   * Used to indicate whether the optional `fdc3.joinUserChannel`,
   * `fdc3.getCurrentChannel` and `fdc3.leaveCurrentChannel` are implemented by
   * the Desktop Agent.
   */
  UserChannelMembershipAPIs: boolean;
}

/**
 * Identifies the type of the connection step message.
 */

/**
 * Message sent by Bridge to Desktop Agent if their authentication fails.
 *
 * A message used during the connection flow for a Desktop Agent to the Bridge. Used for
 * messages sent in either direction.
 */
export interface ConnectionStep4AuthenticationFailed {
  meta: ConnectionStep4AuthenticationFailedMeta;
  /**
   * The message payload, containing data pertaining to this connection step.
   */
  payload: ConnectionStep4AuthenticationFailedPayload;
  /**
   * Identifies the type of the connection step message.
   */
  type: 'authenticationFailed';
}

/**
 * Metadata for this connection step message.
 */
export interface ConnectionStep4AuthenticationFailedMeta {
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * The message payload, containing data pertaining to this connection step.
 */
export interface ConnectionStep4AuthenticationFailedPayload {
  message?: string;
}

/**
 * Identifies the type of the connection step message.
 */

/**
 * Message sent by Bridge to all Desktop Agent when an agent joins or leaves the bridge,
 * includes the details of all agents, the change made and the expected channel state for
 * all agents.
 *
 * A message used during the connection flow for a Desktop Agent to the Bridge. Used for
 * messages sent in either direction.
 */
export interface ConnectionStep6ConnectedAgentsUpdate {
  meta: ConnectionStep6ConnectedAgentsUpdateMeta;
  /**
   * The message payload, containing data pertaining to this connection step.
   */
  payload: ConnectionStep6ConnectedAgentsUpdatePayload;
  /**
   * Identifies the type of the connection step message.
   */
  type: 'connectedAgentsUpdate';
}

/**
 * Metadata for this connection step message.
 */
export interface ConnectionStep6ConnectedAgentsUpdateMeta {
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * The message payload, containing data pertaining to this connection step.
 */
export interface ConnectionStep6ConnectedAgentsUpdatePayload {
  /**
   * Should be set when an agent first connects to the bridge and provide its assigned name.
   */
  addAgent?: string;
  /**
   * Desktop Agent Bridge implementation metadata of all connected agents.
   */
  allAgents: DesktopAgentImplementationMetadata[];
  /**
   * The updated state of channels that should be adopted by the agents. Should only be set
   * when an agent is connecting to the bridge.
   */
  channelsState?: { [key: string]: Context[] };
  /**
   * Should be set when an agent disconnects from the bridge and provide the name that no
   * longer is assigned.
   */
  removeAgent?: string;
}

/**
 * Includes the name assigned to the Desktop Agent by the Bridge.
 *
 * Metadata relating to the FDC3 Desktop Agent implementation and its provider.
 */
export interface DesktopAgentImplementationMetadata {
  /**
   * Used in Desktop Agent Bridging to attribute or target a message to a particular Desktop
   * Agent.
   */
  desktopAgent: string;
  /**
   * The version number of the FDC3 specification that the implementation provides.
   * The string must be a numeric semver version, e.g. 1.2 or 1.2.1.
   */
  fdc3Version: string;
  /**
   * Metadata indicating whether the Desktop Agent implements optional features of
   * the Desktop Agent API.
   */
  optionalFeatures: OptionalFeatures;
  /**
   * The name of the provider of the Desktop Agent implementation (e.g. Finsemble, Glue42,
   * OpenFin etc.).
   */
  provider: string;
  /**
   * The version of the provider of the Desktop Agent implementation (e.g. 5.3.0).
   */
  providerVersion?: string;
}

/**
 * Identifies the type of the connection step message.
 */

/**
 * A response to a findInstances request that contains an error.
 *
 * A response message from a Desktop Agent to the Bridge containing an error, to be used in
 * preference to the standard response when an error needs to be returned.
 */
export interface FindInstancesAgentErrorResponse {
  meta: FindInstancesAgentErrorResponseMeta;
  /**
   * Error message payload containing an standardized error string.
   */
  payload: PayloadClass;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'findInstancesResponse';
}

/**
 * Metadata for a response messages sent by a Desktop Agent to the Bridge
 */
export interface FindInstancesAgentErrorResponseMeta {
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * Error message payload containing an standardized error string.
 */
export interface PayloadClass {
  error: FindInstancesErrors;
}

/**
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 *
 * Should be set if the raiseIntent request returned an error.
 *
 * Constants representing the errors that can be encountered when calling the
 * `addIntentListener`, `findIntent`, `findIntentsByContext`, `raiseIntent` or
 * `raiseIntentForContext` methods on the DesktopAgent (`fdc3`).
 *
 * Array of error message strings for responses that were not returned to the bridge before
 * the timeout or because an error occurred. Should be the same length as the `errorSources`
 * array and ordered the same. May be omitted if all sources responded without errors.
 *
 * Constants representing the errors that can be encountered when calling the `open` method
 * on the DesktopAgent object (`fdc3`).
 */
export type FindInstancesErrors =
  | 'DesktopAgentNotFound'
  | 'IntentDeliveryFailed'
  | 'MalformedContext'
  | 'NoAppsFound'
  | 'ResolverTimeout'
  | 'ResolverUnavailable'
  | 'TargetAppUnavailable'
  | 'TargetInstanceUnavailable'
  | 'UserCancelledResolution'
  | 'ApiTimeout'
  | 'InvalidArguments'
  | 'IntentListenerConflict'
  | 'AgentDisconnected'
  | 'NotConnectedToBridge'
  | 'ResponseToBridgeTimedOut'
  | 'MalformedMessage';

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A request for details of instances of a particular app
 *
 * A request message from a Desktop Agent to the Bridge.
 */
export interface FindInstancesAgentRequest {
  meta: FindInstancesAgentRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: FindInstancesAgentRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'findInstancesRequest';
}

/**
 * Metadata for a request message sent by Desktop Agents to the Bridge.
 */
export interface FindInstancesAgentRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: DestinationObject;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself.
   */
  source?: SourceIdentifier;
  timestamp: Date;
}

/**
 * Identifies a particular Desktop Agent in Desktop Agent Bridging scenarios
 * where a request needs to be directed to a Desktop Agent rather than a specific app, or a
 * response message is returned by the Desktop Agent (or more specifically its resolver)
 * rather than a specific app. Used as a substitute for `AppIdentifier` in cases where no
 * app details are available or are appropriate.
 *
 * Array of DesktopAgentIdentifiers for responses that were not returned to the bridge
 * before the timeout or because an error occurred. May be omitted if all sources responded
 * without errors. MUST include the `desktopAgent` field when returned by the bridge.
 *
 * Array of DesktopAgentIdentifiers for the sources that generated responses to the request.
 * Will contain a single value for individual responses and multiple values for responses
 * that were collated by the bridge. May be omitted if all sources errored. MUST include the
 * `desktopAgent` field when returned by the bridge.
 *
 * Field that represents a destination Desktop Agent that a request is to be sent to.
 *
 * Optional field that represents the destination that the request should be routed to. Must
 * be set by the Desktop Agent for API calls that include a target app parameter and must
 * include the name of the Desktop Agent hosting the target application.
 *
 * Represents identifiers that MUST include the Desktop Agent name and MAY identify a
 * specific app or instance.
 *
 * Field that represents the source application that the request was received from, or the
 * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
 * be set by the bridge.
 *
 * Field that represents a destination App on a remote Desktop Agent that a request is to be
 * sent to.
 *
 * Identifies an application, or instance of an application, and is used to target FDC3 API
 * calls, such as `fdc3.open` or `fdc3.raiseIntent` at specific applications or application
 * instances.
 *
 * Will always include at least an `appId` field, which uniquely identifies a specific app.
 *
 * If the `instanceId` field is set then the `AppMetadata` object represents a specific
 * instance of the application that may be addressed using that Id.
 *
 * Field that represents the source application that a request or response was received
 * from.
 *
 * Identifier for the app instance that was selected (or started) to resolve the intent.
 * `source.instanceId` MUST be set, indicating the specific app instance that
 * received the intent.
 *
 * Identifier for the app instance that sent the context and/or intent.
 */
export interface DestinationObject {
  /**
   * Used in Desktop Agent Bridging to attribute or target a message to a
   * particular Desktop Agent.
   *
   * The Desktop Agent that the app is available on. Used in Desktop Agent Bridging to
   * identify the Desktop Agent to target.
   */
  desktopAgent: string;
  /**
   * The unique application identifier located within a specific application directory
   * instance. An example of an appId might be 'app@sub.root'.
   */
  appId?: string;
  /**
   * An optional instance identifier, indicating that this object represents a specific
   * instance of the application described.
   */
  instanceId?: string;
  [property: string]: any;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface FindInstancesAgentRequestPayload {
  app: AppIdentifier;
}

/**
 * Identifies an application, or instance of an application, and is used to target FDC3 API
 * calls, such as `fdc3.open` or `fdc3.raiseIntent` at specific applications or application
 * instances.
 *
 * Will always include at least an `appId` field, which uniquely identifies a specific app.
 *
 * If the `instanceId` field is set then the `AppMetadata` object represents a specific
 * instance of the application that may be addressed using that Id.
 *
 * Field that represents the source application that a request or response was received
 * from.
 *
 * Identifier for the app instance that was selected (or started) to resolve the intent.
 * `source.instanceId` MUST be set, indicating the specific app instance that
 * received the intent.
 *
 * Identifier for the app instance that sent the context and/or intent.
 */
export interface AppIdentifier {
  /**
   * The unique application identifier located within a specific application directory
   * instance. An example of an appId might be 'app@sub.root'.
   */
  appId: string;
  /**
   * The Desktop Agent that the app is available on. Used in Desktop Agent Bridging to
   * identify the Desktop Agent to target.
   */
  desktopAgent?: string;
  /**
   * An optional instance identifier, indicating that this object represents a specific
   * instance of the application described.
   */
  instanceId?: string;
  [property: string]: any;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A response to a findInstances request.
 *
 * A response message from a Desktop Agent to the Bridge.
 */
export interface FindInstancesAgentResponse {
  meta: AgentResponseMetadata;
  /**
   * The message payload typically contains return values for FDC3 API functions.
   */
  payload: FindInstancesAgentResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'findInstancesResponse';
}

/**
 * The message payload contains a flag indicating whether the API call was successful, plus
 * any return values for the FDC3 API function called, or indicating that the request
 * resulted in an error and including a standardized error message.
 *
 * The message payload typically contains return values for FDC3 API functions.
 */
export interface FindInstancesAgentResponsePayload {
  appIdentifiers: AppMetadata[];
}

/**
 * Extends an `AppIdentifier`, describing an application or instance of an application, with
 * additional descriptive metadata that is usually provided by an FDC3 App Directory that
 * the Desktop Agent connects to.
 *
 * The additional information from an app directory can aid in rendering UI elements, such
 * as a launcher menu or resolver UI. This includes a title, description, tooltip and icon
 * and screenshot URLs.
 *
 * Note that as `AppMetadata` instances are also `AppIdentifiers` they may be passed to the
 * `app` argument of `fdc3.open`, `fdc3.raiseIntent` etc.
 */
export interface AppMetadata {
  /**
   * The unique application identifier located within a specific application directory
   * instance. An example of an appId might be 'app@sub.root'.
   */
  appId: string;
  /**
   * A longer, multi-paragraph description for the application that could include markup.
   */
  description?: string;
  /**
   * The Desktop Agent that the app is available on. Used in Desktop Agent Bridging to
   * identify the Desktop Agent to target.
   */
  desktopAgent?: string;
  /**
   * A list of icon URLs for the application that can be used to render UI elements.
   */
  icons?: Icon[];
  /**
   * An optional instance identifier, indicating that this object represents a specific
   * instance of the application described.
   */
  instanceId?: string;
  /**
   * An optional set of, implementation specific, metadata fields that can be used to
   * disambiguate instances, such as a window title or screen position. Must only be set if
   * `instanceId` is set.
   */
  instanceMetadata?: { [key: string]: any };
  /**
   * The 'friendly' app name.
   * This field was used with the `open` and `raiseIntent` calls in FDC3 <2.0, which now
   * require an `AppIdentifier` wth `appId` set.
   * Note that for display purposes the `title` field should be used, if set, in preference to
   * this field.
   */
  name?: string;
  /**
   * The type of output returned for any intent specified during resolution. May express a
   * particular context type (e.g. "fdc3.instrument"), channel (e.g. "channel") or a channel
   * that will receive a specified type (e.g. "channel<fdc3.instrument>").
   */
  resultType?: null | string;
  /**
   * Images representing the app in common usage scenarios that can be used to render UI
   * elements.
   */
  screenshots?: Image[];
  /**
   * A more user-friendly application title that can be used to render UI elements.
   */
  title?: string;
  /**
   * A tooltip for the application that can be used to render UI elements.
   */
  tooltip?: string;
  /**
   * The Version of the application.
   */
  version?: string;
}

/**
 * Describes an Icon image that may be used to represent the application.
 */
export interface Icon {
  /**
   * The icon dimension, formatted as `<height>x<width>`.
   */
  size?: string;
  /**
   * The icon url.
   */
  src: string;
  /**
   * Icon media type. If not present the Desktop Agent may use the src file extension.
   */
  type?: string;
}

/**
 * Describes an image file, typically a screenshot, that often represents the application in
 * a common usage scenario.
 */
export interface Image {
  /**
   * Caption for the image.
   */
  label?: string;
  /**
   * The image dimension, formatted as `<height>x<width>`.
   */
  size?: string;
  /**
   * The image url.
   */
  src: string;
  /**
   * Image media type. If not present the Desktop Agent may use the src file extension.
   */
  type?: string;
}

/**
 * A response to a findInstances request that contains an error.
 *
 * A response message from the Bridge back to the original Desktop Agent that raised the
 * request, used where all connected agents returned errors.
 */
export interface FindInstancesBridgeErrorResponse {
  meta: FindInstancesBridgeErrorResponseMeta;
  /**
   * The error message payload contains details of an error return to the app or agent that
   * raised the original request.
   */
  payload: MessagePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'findInstancesResponse';
}

/**
 * Metadata required in a response message collated and/or forwarded on by the Bridge
 */
export interface FindInstancesBridgeErrorResponseMeta {
  errorDetails: ResponseErrorDetail[];
  errorSources: DesktopAgentIdentifier[];
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * The error message payload contains details of an error return to the app or agent that
 * raised the original request.
 */
export interface MessagePayload {
  error: FindInstancesErrors;
}

/**
 * A request for details of instances of a particular app
 *
 * A request message forwarded from the Bridge onto a Desktop Agent connected to it.
 */
export interface FindInstancesBridgeRequest {
  meta: FindInstancesBridgeRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: FindInstancesBridgeRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'findInstancesRequest';
}

/**
 * Metadata required in a request message forwarded on by the Bridge
 */
export interface FindInstancesBridgeRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: DestinationObject;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
   * be set by the bridge.
   */
  source: MetaSourceObject;
  timestamp: Date;
}

/**
 * Field that represents the source application that the request was received from, or the
 * source Desktop Agent if it issued the request itself.
 *
 * Field that represents the source application that a request or response was received
 * from, or the source Desktop Agent if it issued the request or response itself.
 *
 * Identifies an application, or instance of an application, and is used to target FDC3 API
 * calls, such as `fdc3.open` or `fdc3.raiseIntent` at specific applications or application
 * instances.
 *
 * Will always include at least an `appId` field, which uniquely identifies a specific app.
 *
 * If the `instanceId` field is set then the `AppMetadata` object represents a specific
 * instance of the application that may be addressed using that Id.
 *
 * Field that represents the source application that a request or response was received
 * from.
 *
 * Identifier for the app instance that was selected (or started) to resolve the intent.
 * `source.instanceId` MUST be set, indicating the specific app instance that
 * received the intent.
 *
 * Identifier for the app instance that sent the context and/or intent.
 *
 * Identifies a particular Desktop Agent in Desktop Agent Bridging scenarios
 * where a request needs to be directed to a Desktop Agent rather than a specific app, or a
 * response message is returned by the Desktop Agent (or more specifically its resolver)
 * rather than a specific app. Used as a substitute for `AppIdentifier` in cases where no
 * app details are available or are appropriate.
 *
 * Array of DesktopAgentIdentifiers for responses that were not returned to the bridge
 * before the timeout or because an error occurred. May be omitted if all sources responded
 * without errors. MUST include the `desktopAgent` field when returned by the bridge.
 *
 * Array of DesktopAgentIdentifiers for the sources that generated responses to the request.
 * Will contain a single value for individual responses and multiple values for responses
 * that were collated by the bridge. May be omitted if all sources errored. MUST include the
 * `desktopAgent` field when returned by the bridge.
 *
 * Field that represents a destination Desktop Agent that a request is to be sent to.
 *
 * Optional field that represents the destination that the request should be routed to. Must
 * be set by the Desktop Agent for API calls that include a target app parameter and must
 * include the name of the Desktop Agent hosting the target application.
 *
 * Represents identifiers that MUST include the Desktop Agent name and MAY identify a
 * specific app or instance.
 *
 * Field that represents the source application that the request was received from, or the
 * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
 * be set by the bridge.
 *
 * Field that represents a destination App on a remote Desktop Agent that a request is to be
 * sent to.
 */
export interface MetaSourceObject {
  /**
   * The unique application identifier located within a specific application directory
   * instance. An example of an appId might be 'app@sub.root'.
   */
  appId?: string;
  /**
   * The Desktop Agent that the app is available on. Used in Desktop Agent Bridging to
   * identify the Desktop Agent to target.
   *
   * Used in Desktop Agent Bridging to attribute or target a message to a
   * particular Desktop Agent.
   */
  desktopAgent: string;
  /**
   * An optional instance identifier, indicating that this object represents a specific
   * instance of the application described.
   */
  instanceId?: string;
  [property: string]: any;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface FindInstancesBridgeRequestPayload {
  app: AppIdentifier;
}

/**
 * A response to a findInstances request.
 *
 * A response message from the Bridge back to the original Desktop Agent that raised the
 * request.
 */
export interface FindInstancesBridgeResponse {
  meta: BridgeResponseMessageMeta;
  /**
   * The message payload typically contains return values for FDC3 API functions.
   */
  payload: FindInstancesBridgeResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'findInstancesResponse';
}

/**
 * The message payload contains a flag indicating whether the API call was successful, plus
 * any return values for the FDC3 API function called, or indicating that the request
 * resulted in an error and including a standardized error message.
 *
 * The message payload typically contains return values for FDC3 API functions.
 */
export interface FindInstancesBridgeResponsePayload {
  appIdentifiers: AppMetadata[];
}

/**
 * A response to a findIntent request that contains an error.
 *
 * A response message from a Desktop Agent to the Bridge containing an error, to be used in
 * preference to the standard response when an error needs to be returned.
 */
export interface FindIntentAgentErrorResponse {
  meta: FindIntentAgentErrorResponseMeta;
  /**
   * Error message payload containing an standardized error string.
   */
  payload: FindIntentAgentErrorResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'findIntentResponse';
}

/**
 * Metadata for a response messages sent by a Desktop Agent to the Bridge
 */
export interface FindIntentAgentErrorResponseMeta {
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * Error message payload containing an standardized error string.
 */
export interface FindIntentAgentErrorResponsePayload {
  error: FindInstancesErrors;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A request for details of apps available to resolve a particular intent and context pair.
 *
 * A request message from a Desktop Agent to the Bridge.
 */
export interface FindIntentAgentRequest {
  meta: FindIntentAgentRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: FindIntentAgentRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'findIntentRequest';
}

/**
 * Metadata for a request message sent by Desktop Agents to the Bridge.
 */
export interface FindIntentAgentRequestMeta {
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself.
   */
  source?: SourceIdentifier;
  timestamp: Date;
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: BridgeParticipantIdentifier;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface FindIntentAgentRequestPayload {
  context?: Context;
  intent: string;
  resultType?: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A response to a findIntent request.
 *
 * A response message from a Desktop Agent to the Bridge.
 */
export interface FindIntentAgentResponse {
  meta: FindIntentAgentResponseMeta;
  /**
   * The message payload typically contains return values for FDC3 API functions.
   */
  payload: FindIntentAgentResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'findIntentResponse';
}

/**
 * Metadata for a response messages sent by a Desktop Agent to the Bridge
 */
export interface FindIntentAgentResponseMeta {
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * The message payload typically contains return values for FDC3 API functions.
 */
export interface FindIntentAgentResponsePayload {
  appIntent: AppIntent;
}

/**
 * An interface that relates an intent to apps.
 */
export interface AppIntent {
  /**
   * Details of applications that can resolve the intent.
   */
  apps: AppMetadata[];
  /**
   * Details of the intent whose relationship to resolving applications is being described.
   */
  intent: IntentMetadata;
}

/**
 * Details of the intent whose relationship to resolving applications is being described.
 *
 * Metadata describing an Intent.
 */
export interface IntentMetadata {
  /**
   * Display name for the intent.
   */
  displayName?: string;
  /**
   * The unique name of the intent that can be invoked by the raiseIntent call.
   */
  name: string;
}

/**
 * A response to a findIntent request that contains an error.
 *
 * A response message from the Bridge back to the original Desktop Agent that raised the
 * request, used where all connected agents returned errors.
 */
export interface FindIntentBridgeErrorResponse {
  meta: FindIntentBridgeErrorResponseMeta;
  /**
   * The error message payload contains details of an error return to the app or agent that
   * raised the original request.
   */
  payload: FindIntentBridgeErrorResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'findIntentResponse';
}

/**
 * Metadata required in a response message collated and/or forwarded on by the Bridge
 */
export interface FindIntentBridgeErrorResponseMeta {
  errorDetails: ResponseErrorDetail[];
  errorSources: DesktopAgentIdentifier[];
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * The error message payload contains details of an error return to the app or agent that
 * raised the original request.
 */
export interface FindIntentBridgeErrorResponsePayload {
  error: FindInstancesErrors;
}

/**
 * A request for details of apps available to resolve a particular intent and context pair.
 *
 * A request message forwarded from the Bridge onto a Desktop Agent connected to it.
 */
export interface FindIntentBridgeRequest {
  meta: FindIntentBridgeRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: FindIntentBridgeRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'findIntentRequest';
}

/**
 * Metadata required in a request message forwarded on by the Bridge
 */
export interface FindIntentBridgeRequestMeta {
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
   * be set by the bridge.
   */
  source: BridgeParticipantIdentifier;
  timestamp: Date;
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: BridgeParticipantIdentifier;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface FindIntentBridgeRequestPayload {
  context?: Context;
  intent: string;
  resultType?: string;
}

/**
 * A response to a findIntent request.
 *
 * A response message from the Bridge back to the original Desktop Agent that raised the
 * request.
 */
export interface FindIntentBridgeResponse {
  meta: FindIntentBridgeResponseMeta;
  /**
   * The message payload typically contains return values for FDC3 API functions.
   */
  payload: FindIntentBridgeResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'findIntentResponse';
}

/**
 * Metadata required in a response message collated and/or forwarded on by the Bridge
 */
export interface FindIntentBridgeResponseMeta {
  errorDetails?: ResponseErrorDetail[];
  errorSources?: DesktopAgentIdentifier[];
  requestUuid: string;
  responseUuid: string;
  sources?: DesktopAgentIdentifier[];
  timestamp: Date;
}

/**
 * The message payload typically contains return values for FDC3 API functions.
 */
export interface FindIntentBridgeResponsePayload {
  appIntent: AppIntent;
}

/**
 * A response to a findIntentsByContext request that contains an error.
 *
 * A response message from a Desktop Agent to the Bridge containing an error, to be used in
 * preference to the standard response when an error needs to be returned.
 */
export interface FindIntentsByContextAgentErrorResponse {
  meta: FindIntentsByContextAgentErrorResponseMeta;
  /**
   * Error message payload containing an standardized error string.
   */
  payload: FindIntentsByContextAgentErrorResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'findIntentsByContextResponse';
}

/**
 * Metadata for a response messages sent by a Desktop Agent to the Bridge
 */
export interface FindIntentsByContextAgentErrorResponseMeta {
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * Error message payload containing an standardized error string.
 */
export interface FindIntentsByContextAgentErrorResponsePayload {
  error: FindInstancesErrors;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A request for details of intents and apps available to resolve them for a particular
 * context.
 *
 * A request message from a Desktop Agent to the Bridge.
 */
export interface FindIntentsByContextAgentRequest {
  meta: FindIntentsByContextAgentRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: FindIntentsByContextAgentRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'findIntentsByContextRequest';
}

/**
 * Metadata for a request message sent by Desktop Agents to the Bridge.
 */
export interface FindIntentsByContextAgentRequestMeta {
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself.
   */
  source?: SourceObject;
  timestamp: Date;
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: BridgeParticipantIdentifier;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface FindIntentsByContextAgentRequestPayload {
  context: Context;
  resultType?: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A response to a findIntentsByContext request.
 *
 * A response message from a Desktop Agent to the Bridge.
 */
export interface FindIntentsByContextAgentResponse {
  meta: FindIntentsByContextAgentResponseMeta;
  /**
   * The message payload typically contains return values for FDC3 API functions.
   */
  payload: FindIntentsByContextAgentResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'findIntentsByContextResponse';
}

/**
 * Metadata for a response messages sent by a Desktop Agent to the Bridge
 */
export interface FindIntentsByContextAgentResponseMeta {
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * The message payload typically contains return values for FDC3 API functions.
 */
export interface FindIntentsByContextAgentResponsePayload {
  appIntents: AppIntent[];
}

/**
 * A response to a findIntentsByContext request that contains an error.
 *
 * A response message from the Bridge back to the original Desktop Agent that raised the
 * request, used where all connected agents returned errors.
 */
export interface FindIntentsByContextBridgeErrorResponse {
  meta: FindIntentsByContextBridgeErrorResponseMeta;
  /**
   * The error message payload contains details of an error return to the app or agent that
   * raised the original request.
   */
  payload: FindIntentsByContextBridgeErrorResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'findIntentsByContextResponse';
}

/**
 * Metadata required in a response message collated and/or forwarded on by the Bridge
 */
export interface FindIntentsByContextBridgeErrorResponseMeta {
  errorDetails: ResponseErrorDetail[];
  errorSources: DesktopAgentIdentifier[];
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * The error message payload contains details of an error return to the app or agent that
 * raised the original request.
 */
export interface FindIntentsByContextBridgeErrorResponsePayload {
  error: FindInstancesErrors;
}

/**
 * A request for details of intents and apps available to resolve them for a particular
 * context.
 *
 * A request message forwarded from the Bridge onto a Desktop Agent connected to it.
 */
export interface FindIntentsByContextBridgeRequest {
  meta: FindIntentsByContextBridgeRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: FindIntentsByContextBridgeRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'findIntentsByContextRequest';
}

/**
 * Metadata required in a request message forwarded on by the Bridge
 */
export interface FindIntentsByContextBridgeRequestMeta {
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
   * be set by the bridge.
   */
  source: MetaSource;
  timestamp: Date;
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: BridgeParticipantIdentifier;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface FindIntentsByContextBridgeRequestPayload {
  context: Context;
  resultType?: string;
}

/**
 * A response to a findIntentsByContext request.
 *
 * A response message from the Bridge back to the original Desktop Agent that raised the
 * request.
 */
export interface FindIntentsByContextBridgeResponse {
  meta: FindIntentsByContextBridgeResponseMeta;
  /**
   * The message payload typically contains return values for FDC3 API functions.
   */
  payload: FindIntentsByContextBridgeResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'findIntentsByContextResponse';
}

/**
 * Metadata required in a response message collated and/or forwarded on by the Bridge
 */
export interface FindIntentsByContextBridgeResponseMeta {
  errorDetails?: ResponseErrorDetail[];
  errorSources?: DesktopAgentIdentifier[];
  requestUuid: string;
  responseUuid: string;
  sources?: DesktopAgentIdentifier[];
  timestamp: Date;
}

/**
 * The message payload typically contains return values for FDC3 API functions.
 */
export interface FindIntentsByContextBridgeResponsePayload {
  appIntents: AppIntent[];
}

/**
 * A response to a getAppMetadata request that contains an error.
 *
 * A response message from a Desktop Agent to the Bridge containing an error, to be used in
 * preference to the standard response when an error needs to be returned.
 */
export interface GetAppMetadataAgentErrorResponse {
  meta: GetAppMetadataAgentErrorResponseMeta;
  /**
   * Error message payload containing an standardized error string.
   */
  payload: GetAppMetadataAgentErrorResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'getAppMetadataResponse';
}

/**
 * Metadata for a response messages sent by a Desktop Agent to the Bridge
 */
export interface GetAppMetadataAgentErrorResponseMeta {
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * Error message payload containing an standardized error string.
 */
export interface GetAppMetadataAgentErrorResponsePayload {
  error: FindInstancesErrors;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A request for metadata about an app
 *
 * A request message from a Desktop Agent to the Bridge.
 */
export interface GetAppMetadataAgentRequest {
  meta: GetAppMetadataAgentRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: GetAppMetadataAgentRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'getAppMetadataRequest';
}

/**
 * Metadata for a request message sent by Desktop Agents to the Bridge.
 */
export interface GetAppMetadataAgentRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: DestinationObject;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself.
   */
  source?: SourceIdentifier;
  timestamp: Date;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface GetAppMetadataAgentRequestPayload {
  app: AppObject;
}

/**
 * Field that represents a destination App on a remote Desktop Agent that a request is to be
 * sent to.
 *
 * Identifies a particular Desktop Agent in Desktop Agent Bridging scenarios
 * where a request needs to be directed to a Desktop Agent rather than a specific app, or a
 * response message is returned by the Desktop Agent (or more specifically its resolver)
 * rather than a specific app. Used as a substitute for `AppIdentifier` in cases where no
 * app details are available or are appropriate.
 *
 * Array of DesktopAgentIdentifiers for responses that were not returned to the bridge
 * before the timeout or because an error occurred. May be omitted if all sources responded
 * without errors. MUST include the `desktopAgent` field when returned by the bridge.
 *
 * Array of DesktopAgentIdentifiers for the sources that generated responses to the request.
 * Will contain a single value for individual responses and multiple values for responses
 * that were collated by the bridge. May be omitted if all sources errored. MUST include the
 * `desktopAgent` field when returned by the bridge.
 *
 * Field that represents a destination Desktop Agent that a request is to be sent to.
 *
 * Identifies an application, or instance of an application, and is used to target FDC3 API
 * calls, such as `fdc3.open` or `fdc3.raiseIntent` at specific applications or application
 * instances.
 *
 * Will always include at least an `appId` field, which uniquely identifies a specific app.
 *
 * If the `instanceId` field is set then the `AppMetadata` object represents a specific
 * instance of the application that may be addressed using that Id.
 *
 * Field that represents the source application that a request or response was received
 * from.
 *
 * Identifier for the app instance that was selected (or started) to resolve the intent.
 * `source.instanceId` MUST be set, indicating the specific app instance that
 * received the intent.
 *
 * Identifier for the app instance that sent the context and/or intent.
 */
export interface AppObject {
  /**
   * Used in Desktop Agent Bridging to attribute or target a message to a
   * particular Desktop Agent.
   *
   * The Desktop Agent that the app is available on. Used in Desktop Agent Bridging to
   * identify the Desktop Agent to target.
   */
  desktopAgent: string;
  /**
   * The unique application identifier located within a specific application directory
   * instance. An example of an appId might be 'app@sub.root'.
   */
  appId: string;
  /**
   * An optional instance identifier, indicating that this object represents a specific
   * instance of the application described.
   */
  instanceId?: string;
  [property: string]: any;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A response to a getAppMetadata request.
 *
 * A response message from a Desktop Agent to the Bridge.
 */
export interface GetAppMetadataAgentResponse {
  meta: GetAppMetadataAgentResponseMeta;
  /**
   * The message payload typically contains return values for FDC3 API functions.
   */
  payload: GetAppMetadataAgentResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'getAppMetadataResponse';
}

/**
 * Metadata for a response messages sent by a Desktop Agent to the Bridge
 */
export interface GetAppMetadataAgentResponseMeta {
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * The message payload typically contains return values for FDC3 API functions.
 */
export interface GetAppMetadataAgentResponsePayload {
  appMetadata: AppMetadata;
}

/**
 * A response to a getAppMetadata request that contains an error.
 *
 * A response message from the Bridge back to the original Desktop Agent that raised the
 * request, used where all connected agents returned errors.
 */
export interface GetAppMetadataBridgeErrorResponse {
  meta: GetAppMetadataBridgeErrorResponseMeta;
  /**
   * The error message payload contains details of an error return to the app or agent that
   * raised the original request.
   */
  payload: GetAppMetadataBridgeErrorResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'getAppMetadataResponse';
}

/**
 * Metadata required in a response message collated and/or forwarded on by the Bridge
 */
export interface GetAppMetadataBridgeErrorResponseMeta {
  errorDetails: ResponseErrorDetail[];
  errorSources: DesktopAgentIdentifier[];
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * The error message payload contains details of an error return to the app or agent that
 * raised the original request.
 */
export interface GetAppMetadataBridgeErrorResponsePayload {
  error: FindInstancesErrors;
}

/**
 * A request for metadata about an app
 *
 * A request message forwarded from the Bridge onto a Desktop Agent connected to it.
 */
export interface GetAppMetadataBridgeRequest {
  meta: GetAppMetadataBridgeRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: GetAppMetadataBridgeRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'getAppMetadataRequest';
}

/**
 * Metadata required in a request message forwarded on by the Bridge
 */
export interface GetAppMetadataBridgeRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: DestinationObject;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
   * be set by the bridge.
   */
  source: MetaSourceObject;
  timestamp: Date;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface GetAppMetadataBridgeRequestPayload {
  app: AppObject;
}

/**
 * A response to a getAppMetadata request.
 *
 * A response message from the Bridge back to the original Desktop Agent that raised the
 * request.
 */
export interface GetAppMetadataBridgeResponse {
  meta: GetAppMetadataBridgeResponseMeta;
  /**
   * The message payload typically contains return values for FDC3 API functions.
   */
  payload: GetAppMetadataBridgeResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'getAppMetadataResponse';
}

/**
 * Metadata required in a response message collated and/or forwarded on by the Bridge
 */
export interface GetAppMetadataBridgeResponseMeta {
  errorDetails?: ResponseErrorDetail[];
  errorSources?: DesktopAgentIdentifier[];
  requestUuid: string;
  responseUuid: string;
  sources?: DesktopAgentIdentifier[];
  timestamp: Date;
}

/**
 * The message payload typically contains return values for FDC3 API functions.
 */
export interface GetAppMetadataBridgeResponsePayload {
  appMetadata: AppMetadata;
}

/**
 * A response to an open request that contains an error
 *
 * A response message from a Desktop Agent to the Bridge containing an error, to be used in
 * preference to the standard response when an error needs to be returned.
 */
export interface OpenAgentErrorResponse {
  meta: OpenAgentErrorResponseMeta;
  /**
   * Error message payload containing an standardized error string.
   */
  payload: OpenAgentErrorResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'openResponse';
}

/**
 * Metadata for a response messages sent by a Desktop Agent to the Bridge
 */
export interface OpenAgentErrorResponseMeta {
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * Error message payload containing an standardized error string.
 */
export interface OpenAgentErrorResponsePayload {
  error: OpenErrorResponsePayload;
}

/**
 * Constants representing the errors that can be encountered when calling the `open` method
 * on the DesktopAgent object (`fdc3`).
 *
 * Array of error message strings for responses that were not returned to the bridge before
 * the timeout or because an error occurred. Should be the same length as the `errorSources`
 * array and ordered the same. May be omitted if all sources responded without errors.
 *
 * Constants representing the errors that can be encountered when calling the
 * `addIntentListener`, `findIntent`, `findIntentsByContext`, `raiseIntent` or
 * `raiseIntentForContext` methods on the DesktopAgent (`fdc3`).
 */
export type OpenErrorResponsePayload =
  | 'AppNotFound'
  | 'AppTimeout'
  | 'DesktopAgentNotFound'
  | 'ErrorOnLaunch'
  | 'MalformedContext'
  | 'ResolverUnavailable'
  | 'ApiTimeout'
  | 'InvalidArguments'
  | 'AgentDisconnected'
  | 'NotConnectedToBridge'
  | 'ResponseToBridgeTimedOut'
  | 'MalformedMessage';

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A request to open an application
 *
 * A request message from a Desktop Agent to the Bridge.
 */
export interface OpenAgentRequest {
  meta: OpenAgentRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: OpenAgentRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'openRequest';
}

/**
 * Metadata for a request message sent by Desktop Agents to the Bridge.
 */
export interface OpenAgentRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: DestinationObject;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself.
   */
  source: SourceObject;
  timestamp: Date;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface OpenAgentRequestPayload {
  /**
   * The application to open on the specified Desktop Agent
   */
  app: AppToOpen;
  context?: Context;
}

/**
 * The application to open on the specified Desktop Agent
 *
 * Identifies a particular Desktop Agent in Desktop Agent Bridging scenarios
 * where a request needs to be directed to a Desktop Agent rather than a specific app, or a
 * response message is returned by the Desktop Agent (or more specifically its resolver)
 * rather than a specific app. Used as a substitute for `AppIdentifier` in cases where no
 * app details are available or are appropriate.
 *
 * Array of DesktopAgentIdentifiers for responses that were not returned to the bridge
 * before the timeout or because an error occurred. May be omitted if all sources responded
 * without errors. MUST include the `desktopAgent` field when returned by the bridge.
 *
 * Array of DesktopAgentIdentifiers for the sources that generated responses to the request.
 * Will contain a single value for individual responses and multiple values for responses
 * that were collated by the bridge. May be omitted if all sources errored. MUST include the
 * `desktopAgent` field when returned by the bridge.
 *
 * Field that represents a destination Desktop Agent that a request is to be sent to.
 *
 * Identifies an application, or instance of an application, and is used to target FDC3 API
 * calls, such as `fdc3.open` or `fdc3.raiseIntent` at specific applications or application
 * instances.
 *
 * Will always include at least an `appId` field, which uniquely identifies a specific app.
 *
 * If the `instanceId` field is set then the `AppMetadata` object represents a specific
 * instance of the application that may be addressed using that Id.
 *
 * Field that represents the source application that a request or response was received
 * from.
 *
 * Identifier for the app instance that was selected (or started) to resolve the intent.
 * `source.instanceId` MUST be set, indicating the specific app instance that
 * received the intent.
 *
 * Identifier for the app instance that sent the context and/or intent.
 */
export interface AppToOpen {
  /**
   * Used in Desktop Agent Bridging to attribute or target a message to a
   * particular Desktop Agent.
   *
   * The Desktop Agent that the app is available on. Used in Desktop Agent Bridging to
   * identify the Desktop Agent to target.
   */
  desktopAgent: string;
  /**
   * The unique application identifier located within a specific application directory
   * instance. An example of an appId might be 'app@sub.root'.
   */
  appId: string;
  /**
   * An optional instance identifier, indicating that this object represents a specific
   * instance of the application described.
   */
  instanceId?: string;
  [property: string]: any;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A response to an open request
 *
 * A response message from a Desktop Agent to the Bridge.
 */
export interface OpenAgentResponse {
  meta: OpenAgentResponseMeta;
  /**
   * The message payload typically contains return values for FDC3 API functions.
   */
  payload: OpenAgentResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'openResponse';
}

/**
 * Metadata for a response messages sent by a Desktop Agent to the Bridge
 */
export interface OpenAgentResponseMeta {
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * The message payload typically contains return values for FDC3 API functions.
 */
export interface OpenAgentResponsePayload {
  appIdentifier: AppIdentifier;
}

/**
 * A response to an open request that contains an error
 *
 * A response message from the Bridge back to the original Desktop Agent that raised the
 * request, used where all connected agents returned errors.
 */
export interface OpenBridgeErrorResponse {
  meta: OpenBridgeErrorResponseMeta;
  /**
   * The error message payload contains details of an error return to the app or agent that
   * raised the original request.
   */
  payload: OpenBridgeErrorResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'openResponse';
}

/**
 * Metadata required in a response message collated and/or forwarded on by the Bridge
 */
export interface OpenBridgeErrorResponseMeta {
  errorDetails: ResponseErrorDetail[];
  errorSources: DesktopAgentIdentifier[];
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * The error message payload contains details of an error return to the app or agent that
 * raised the original request.
 */
export interface OpenBridgeErrorResponsePayload {
  error: OpenErrorResponsePayload;
}

/**
 * A request to open an application
 *
 * A request message forwarded from the Bridge onto a Desktop Agent connected to it.
 */
export interface OpenBridgeRequest {
  meta: OpenBridgeRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: OpenBridgeRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'openRequest';
}

/**
 * Metadata required in a request message forwarded on by the Bridge
 */
export interface OpenBridgeRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: DestinationObject;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
   * be set by the bridge.
   */
  source: MetaSource;
  timestamp: Date;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface OpenBridgeRequestPayload {
  /**
   * The application to open on the specified Desktop Agent
   */
  app: AppToOpen;
  context?: Context;
}

/**
 * A response to an open request
 *
 * A response message from the Bridge back to the original Desktop Agent that raised the
 * request.
 */
export interface OpenBridgeResponse {
  meta: OpenBridgeResponseMeta;
  /**
   * The message payload typically contains return values for FDC3 API functions.
   */
  payload: OpenBridgeResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'openResponse';
}

/**
 * Metadata required in a response message collated and/or forwarded on by the Bridge
 */
export interface OpenBridgeResponseMeta {
  errorDetails?: ResponseErrorDetail[];
  errorSources?: DesktopAgentIdentifier[];
  requestUuid: string;
  responseUuid: string;
  sources?: DesktopAgentIdentifier[];
  timestamp: Date;
}

/**
 * The message payload typically contains return values for FDC3 API functions.
 */
export interface OpenBridgeResponsePayload {
  appIdentifier: AppIdentifier;
}

/**
 * A request to broadcast on a PrivateChannel.
 *
 * A request message from a Desktop Agent to the Bridge.
 */
export interface PrivateChannelBroadcastAgentRequest {
  meta: PrivateChannelBroadcastAgentRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: PrivateChannelBroadcastAgentRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'PrivateChannel.broadcast';
}

/**
 * Metadata for a request message sent by Desktop Agents to the Bridge.
 */
export interface PrivateChannelBroadcastAgentRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: MetaDestination;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself.
   */
  source?: SourceObject;
  timestamp: Date;
}

/**
 * Field that represents a destination App on a remote Desktop Agent that a request is to be
 * sent to.
 *
 * Identifies a particular Desktop Agent in Desktop Agent Bridging scenarios
 * where a request needs to be directed to a Desktop Agent rather than a specific app, or a
 * response message is returned by the Desktop Agent (or more specifically its resolver)
 * rather than a specific app. Used as a substitute for `AppIdentifier` in cases where no
 * app details are available or are appropriate.
 *
 * Array of DesktopAgentIdentifiers for responses that were not returned to the bridge
 * before the timeout or because an error occurred. May be omitted if all sources responded
 * without errors. MUST include the `desktopAgent` field when returned by the bridge.
 *
 * Array of DesktopAgentIdentifiers for the sources that generated responses to the request.
 * Will contain a single value for individual responses and multiple values for responses
 * that were collated by the bridge. May be omitted if all sources errored. MUST include the
 * `desktopAgent` field when returned by the bridge.
 *
 * Field that represents a destination Desktop Agent that a request is to be sent to.
 *
 * Identifies an application, or instance of an application, and is used to target FDC3 API
 * calls, such as `fdc3.open` or `fdc3.raiseIntent` at specific applications or application
 * instances.
 *
 * Will always include at least an `appId` field, which uniquely identifies a specific app.
 *
 * If the `instanceId` field is set then the `AppMetadata` object represents a specific
 * instance of the application that may be addressed using that Id.
 *
 * Field that represents the source application that a request or response was received
 * from.
 *
 * Identifier for the app instance that was selected (or started) to resolve the intent.
 * `source.instanceId` MUST be set, indicating the specific app instance that
 * received the intent.
 *
 * Identifier for the app instance that sent the context and/or intent.
 *
 * Optional field that represents the destination that the request should be routed to. Must
 * be set by the Desktop Agent for API calls that include a target app parameter and must
 * include the name of the Desktop Agent hosting the target application.
 *
 * Represents identifiers that MUST include the Desktop Agent name and MAY identify a
 * specific app or instance.
 *
 * Field that represents the source application that the request was received from, or the
 * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
 * be set by the bridge.
 */
export interface MetaDestination {
  /**
   * Used in Desktop Agent Bridging to attribute or target a message to a
   * particular Desktop Agent.
   *
   * The Desktop Agent that the app is available on. Used in Desktop Agent Bridging to
   * identify the Desktop Agent to target.
   */
  desktopAgent: string;
  /**
   * The unique application identifier located within a specific application directory
   * instance. An example of an appId might be 'app@sub.root'.
   */
  appId: string;
  /**
   * An optional instance identifier, indicating that this object represents a specific
   * instance of the application described.
   */
  instanceId?: string;
  [property: string]: any;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface PrivateChannelBroadcastAgentRequestPayload {
  /**
   * The Id of the PrivateChannel that the broadcast was sent on
   */
  channelId: string;
  /**
   * The context object that was the payload of a broadcast message.
   */
  context: Context;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A request to broadcast on a PrivateChannel.
 *
 * A request message forwarded from the Bridge onto a Desktop Agent connected to it.
 */
export interface PrivateChannelBroadcastBridgeRequest {
  meta: PrivateChannelBroadcastBridgeRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: PrivateChannelBroadcastBridgeRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'PrivateChannel.broadcast';
}

/**
 * Metadata required in a request message forwarded on by the Bridge
 */
export interface PrivateChannelBroadcastBridgeRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: MetaDestination;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
   * be set by the bridge.
   */
  source: MetaSource;
  timestamp: Date;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface PrivateChannelBroadcastBridgeRequestPayload {
  /**
   * The Id of the PrivateChannel that the broadcast was sent on
   */
  channelId: string;
  /**
   * The context object that was the payload of a broadcast message.
   */
  context: Context;
}

/**
 * A request to forward on an EventListenerAdded event, relating to a PrivateChannel
 *
 * A request message from a Desktop Agent to the Bridge.
 */
export interface PrivateChannelEventListenerAddedAgentRequest {
  meta: PrivateChannelEventListenerAddedAgentRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: PrivateChannelEventListenerAddedAgentRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'PrivateChannel.eventListenerAdded';
}

/**
 * Metadata for a request message sent by Desktop Agents to the Bridge.
 */
export interface PrivateChannelEventListenerAddedAgentRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: MetaDestination;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself.
   */
  source?: SourceObject;
  timestamp: Date;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface PrivateChannelEventListenerAddedAgentRequestPayload {
  /**
   * The id of the PrivateChannel that the event listener was added to.
   */
  channelId: string;
  listenerType: PrivateChannelEventType;
}

/**
 * Type defining valid type strings for Private Channel events.
 */
export type PrivateChannelEventType = 'addContextListener' | 'unsubscribe' | 'disconnect';

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A request to forward on an EventListenerAdded event, relating to a PrivateChannel
 *
 * A request message forwarded from the Bridge onto a Desktop Agent connected to it.
 */
export interface PrivateChannelEventListenerAddedBridgeRequest {
  meta: PrivateChannelEventListenerAddedBridgeRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: PrivateChannelEventListenerAddedBridgeRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'PrivateChannel.eventListenerAdded';
}

/**
 * Metadata required in a request message forwarded on by the Bridge
 */
export interface PrivateChannelEventListenerAddedBridgeRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: MetaDestination;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
   * be set by the bridge.
   */
  source: MetaSource;
  timestamp: Date;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface PrivateChannelEventListenerAddedBridgeRequestPayload {
  /**
   * The id of the PrivateChannel that the event listener was added to.
   */
  channelId: string;
  listenerType: PrivateChannelEventType;
}

/**
 * A request to forward on an EventListenerRemoved event, relating to a PrivateChannel
 *
 * A request message from a Desktop Agent to the Bridge.
 */
export interface PrivateChannelEventListenerRemovedAgentRequest {
  meta: PrivateChannelEventListenerRemovedAgentRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: PrivateChannelEventListenerRemovedAgentRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'PrivateChannel.eventListenerRemoved';
}

/**
 * Metadata for a request message sent by Desktop Agents to the Bridge.
 */
export interface PrivateChannelEventListenerRemovedAgentRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: MetaDestination;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself.
   */
  source?: SourceObject;
  timestamp: Date;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface PrivateChannelEventListenerRemovedAgentRequestPayload {
  /**
   * The id of the PrivateChannel that the event listener was removed from.
   */
  channelId: string;
  listenerType: PrivateChannelEventType;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A request to forward on an EventListenerRemoved event, relating to a PrivateChannel
 *
 * A request message forwarded from the Bridge onto a Desktop Agent connected to it.
 */
export interface PrivateChannelEventListenerRemovedBridgeRequest {
  meta: PrivateChannelEventListenerRemovedBridgeRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: PrivateChannelEventListenerRemovedBridgeRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'PrivateChannel.eventListenerRemoved';
}

/**
 * Metadata required in a request message forwarded on by the Bridge
 */
export interface PrivateChannelEventListenerRemovedBridgeRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: MetaDestination;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
   * be set by the bridge.
   */
  source: MetaSource;
  timestamp: Date;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface PrivateChannelEventListenerRemovedBridgeRequestPayload {
  /**
   * The id of the PrivateChannel that the event listener was removed from.
   */
  channelId: string;
  listenerType: PrivateChannelEventType;
}

/**
 * A request to forward on an AddContextListener event, relating to a PrivateChannel
 *
 * A request message from a Desktop Agent to the Bridge.
 */
export interface PrivateChannelOnAddContextListenerAgentRequest {
  meta: PrivateChannelOnAddContextListenerAgentRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: PrivateChannelOnAddContextListenerAgentRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'PrivateChannel.onAddContextListener';
}

/**
 * Metadata for a request message sent by Desktop Agents to the Bridge.
 */
export interface PrivateChannelOnAddContextListenerAgentRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: MetaDestination;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself.
   */
  source?: SourceObject;
  timestamp: Date;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface PrivateChannelOnAddContextListenerAgentRequestPayload {
  /**
   * The id of the PrivateChannel that the context listener was added to.
   */
  channelId: string;
  /**
   * The type of the context listener added. Should be null for an untyped listener.
   */
  contextType: null | string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A request to forward on an AddContextListener event, relating to a PrivateChannel
 *
 * A request message forwarded from the Bridge onto a Desktop Agent connected to it.
 */
export interface PrivateChannelOnAddContextListenerBridgeRequest {
  meta: PrivateChannelOnAddContextListenerBridgeRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: PrivateChannelOnAddContextListenerBridgeRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'PrivateChannel.onAddContextListener';
}

/**
 * Metadata required in a request message forwarded on by the Bridge
 */
export interface PrivateChannelOnAddContextListenerBridgeRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: MetaDestination;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
   * be set by the bridge.
   */
  source: MetaSource;
  timestamp: Date;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface PrivateChannelOnAddContextListenerBridgeRequestPayload {
  /**
   * The id of the PrivateChannel that the context listener was added to.
   */
  channelId: string;
  /**
   * The type of the context listener added. Should be null for an untyped listener.
   */
  contextType: null | string;
}

/**
 * A request to forward on a Disconnect event, relating to a PrivateChannel
 *
 * A request message from a Desktop Agent to the Bridge.
 */
export interface PrivateChannelOnDisconnectAgentRequest {
  meta: PrivateChannelOnDisconnectAgentRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: PrivateChannelOnDisconnectAgentRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'PrivateChannel.onDisconnect';
}

/**
 * Metadata for a request message sent by Desktop Agents to the Bridge.
 */
export interface PrivateChannelOnDisconnectAgentRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: MetaDestination;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself.
   */
  source?: SourceObject;
  timestamp: Date;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface PrivateChannelOnDisconnectAgentRequestPayload {
  /**
   * The id of the PrivateChannel that the agent discconnected from.
   */
  channelId: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A request to forward on a Disconnect event, relating to a PrivateChannel
 *
 * A request message forwarded from the Bridge onto a Desktop Agent connected to it.
 */
export interface PrivateChannelOnDisconnectBridgeRequest {
  meta: PrivateChannelOnDisconnectBridgeRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: PrivateChannelOnDisconnectBridgeRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'PrivateChannel.onDisconnect';
}

/**
 * Metadata required in a request message forwarded on by the Bridge
 */
export interface PrivateChannelOnDisconnectBridgeRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: MetaDestination;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
   * be set by the bridge.
   */
  source: MetaSource;
  timestamp: Date;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface PrivateChannelOnDisconnectBridgeRequestPayload {
  /**
   * The id of the PrivateChannel that the agent discconnected from.
   */
  channelId: string;
}

/**
 * A request to forward on an Unsubscribe event, relating to a PrivateChannel
 *
 * A request message from a Desktop Agent to the Bridge.
 */
export interface PrivateChannelOnUnsubscribeAgentRequest {
  meta: PrivateChannelOnUnsubscribeAgentRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: PrivateChannelOnUnsubscribeAgentRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'PrivateChannel.onUnsubscribe';
}

/**
 * Metadata for a request message sent by Desktop Agents to the Bridge.
 */
export interface PrivateChannelOnUnsubscribeAgentRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: MetaDestination;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself.
   */
  source?: SourceObject;
  timestamp: Date;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface PrivateChannelOnUnsubscribeAgentRequestPayload {
  /**
   * The id of the PrivateChannel that the context listener was unsubscribed from.
   */
  channelId: string;
  /**
   * The type of the context listener that was unsubscribed. Should be null for an untyped
   * listener.
   */
  contextType: null | string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A request to forward on an Unsubscribe event, relating to a PrivateChannel
 *
 * A request message forwarded from the Bridge onto a Desktop Agent connected to it.
 */
export interface PrivateChannelOnUnsubscribeBridgeRequest {
  meta: ERequestMetadata;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: PrivateChannelOnUnsubscribeBridgeRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'PrivateChannel.onUnsubscribe';
}

/**
 * Metadata required in a request message forwarded on by the Bridge
 */
export interface ERequestMetadata {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination?: MetaDestination;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
   * be set by the bridge.
   */
  source: MetaSource;
  timestamp: Date;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface PrivateChannelOnUnsubscribeBridgeRequestPayload {
  /**
   * The id of the PrivateChannel that the context listener was unsubscribed from.
   */
  channelId: string;
  /**
   * The type of the context listener that was unsubscribed. Should be null for an untyped
   * listener.
   */
  contextType: null | string;
}

/**
 * A response to a request to raise an intent that contains an error.
 *
 * A response message from a Desktop Agent to the Bridge containing an error, to be used in
 * preference to the standard response when an error needs to be returned.
 */
export interface RaiseIntentAgentErrorResponse {
  meta: RaiseIntentAgentErrorResponseMeta;
  /**
   * Error message payload containing an standardized error string.
   */
  payload: RaiseIntentAgentErrorResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'raiseIntentResponse';
}

/**
 * Metadata for a response messages sent by a Desktop Agent to the Bridge
 */
export interface RaiseIntentAgentErrorResponseMeta {
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * Used if a raiseIntent request resulted in an error.
 *
 * Error message payload containing an standardized error string.
 */
export interface RaiseIntentAgentErrorResponsePayload {
  /**
   * Should be set if the raiseIntent request returned an error.
   */
  error: FindInstancesErrors;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A request to raise an intent.
 *
 * A request message from a Desktop Agent to the Bridge.
 */
export interface RaiseIntentAgentRequest {
  meta: RaiseIntentAgentRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: RaiseIntentAgentRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'raiseIntentRequest';
}

/**
 * Metadata for a request message sent by Desktop Agents to the Bridge.
 */
export interface RaiseIntentAgentRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination: MetaDestination;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself.
   */
  source: SourceObject;
  timestamp: Date;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface RaiseIntentAgentRequestPayload {
  app: AppDestinationIdentifier;
  context: Context;
  intent: string;
}

/**
 * Field that represents a destination App on a remote Desktop Agent that a request is to be
 * sent to.
 *
 * Identifies a particular Desktop Agent in Desktop Agent Bridging scenarios
 * where a request needs to be directed to a Desktop Agent rather than a specific app, or a
 * response message is returned by the Desktop Agent (or more specifically its resolver)
 * rather than a specific app. Used as a substitute for `AppIdentifier` in cases where no
 * app details are available or are appropriate.
 *
 * Array of DesktopAgentIdentifiers for responses that were not returned to the bridge
 * before the timeout or because an error occurred. May be omitted if all sources responded
 * without errors. MUST include the `desktopAgent` field when returned by the bridge.
 *
 * Array of DesktopAgentIdentifiers for the sources that generated responses to the request.
 * Will contain a single value for individual responses and multiple values for responses
 * that were collated by the bridge. May be omitted if all sources errored. MUST include the
 * `desktopAgent` field when returned by the bridge.
 *
 * Field that represents a destination Desktop Agent that a request is to be sent to.
 *
 * Identifies an application, or instance of an application, and is used to target FDC3 API
 * calls, such as `fdc3.open` or `fdc3.raiseIntent` at specific applications or application
 * instances.
 *
 * Will always include at least an `appId` field, which uniquely identifies a specific app.
 *
 * If the `instanceId` field is set then the `AppMetadata` object represents a specific
 * instance of the application that may be addressed using that Id.
 *
 * Field that represents the source application that a request or response was received
 * from.
 *
 * Identifier for the app instance that was selected (or started) to resolve the intent.
 * `source.instanceId` MUST be set, indicating the specific app instance that
 * received the intent.
 *
 * Identifier for the app instance that sent the context and/or intent.
 */
export interface AppDestinationIdentifier {
  /**
   * Used in Desktop Agent Bridging to attribute or target a message to a
   * particular Desktop Agent.
   *
   * The Desktop Agent that the app is available on. Used in Desktop Agent Bridging to
   * identify the Desktop Agent to target.
   */
  desktopAgent: string;
  /**
   * The unique application identifier located within a specific application directory
   * instance. An example of an appId might be 'app@sub.root'.
   */
  appId: string;
  /**
   * An optional instance identifier, indicating that this object represents a specific
   * instance of the application described.
   */
  instanceId?: string;
  [property: string]: any;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A response to a request to raise an intent.
 *
 * A response message from a Desktop Agent to the Bridge.
 */
export interface RaiseIntentAgentResponse {
  meta: RaiseIntentAgentResponseMeta;
  /**
   * The message payload typically contains return values for FDC3 API functions.
   */
  payload: RaiseIntentAgentResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'raiseIntentResponse';
}

/**
 * Metadata for a response messages sent by a Desktop Agent to the Bridge
 */
export interface RaiseIntentAgentResponseMeta {
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * The message payload typically contains return values for FDC3 API functions.
 */
export interface RaiseIntentAgentResponsePayload {
  /**
   * Used if the raiseIntent request was successfully resolved.
   */
  intentResolution: IntentResolution;
}

/**
 * Used if the raiseIntent request was successfully resolved.
 *
 * IntentResolution provides a standard format for data returned upon resolving an intent.
 *
 * ```javascript
 * //resolve a "Chain" type intent
 * let resolution = await agent.raiseIntent("intentName", context);
 *
 * //resolve a "Client-Service" type intent with a data response or a Channel
 * let resolution = await agent.raiseIntent("intentName", context);
 * try {
 * const result = await resolution.getResult();
 * if (result && result.broadcast) {
 * console.log(`${resolution.source} returned a channel with id ${result.id}`);
 * } else if (result){
 * console.log(`${resolution.source} returned data: ${JSON.stringify(result)}`);
 * } else {
 * console.error(`${resolution.source} didn't return data`
 * }
 * } catch(error) {
 * console.error(`${resolution.source} returned an error: ${error}`);
 * }
 *
 * // Use metadata about the resolving app instance to target a further intent
 * await agent.raiseIntent("intentName", context, resolution.source);
 * ```
 */
export interface IntentResolution {
  /**
   * The intent that was raised. May be used to determine which intent the user
   * chose in response to `fdc3.raiseIntentForContext()`.
   */
  intent: string;
  /**
   * Identifier for the app instance that was selected (or started) to resolve the intent.
   * `source.instanceId` MUST be set, indicating the specific app instance that
   * received the intent.
   */
  source: AppIdentifier;
}

/**
 * A response to a request to raise an intent that contains an error.
 *
 * A response message from the Bridge back to the original Desktop Agent that raised the
 * request, used where all connected agents returned errors.
 */
export interface RaiseIntentBridgeErrorResponse {
  meta: RaiseIntentBridgeErrorResponseMeta;
  /**
   * The error message payload contains details of an error return to the app or agent that
   * raised the original request.
   */
  payload: RaiseIntentBridgeErrorResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'raiseIntentResponse';
}

/**
 * Metadata required in a response message collated and/or forwarded on by the Bridge
 */
export interface RaiseIntentBridgeErrorResponseMeta {
  errorDetails: ResponseErrorDetail[];
  errorSources: DesktopAgentIdentifier[];
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * Used if a raiseIntent request resulted in an error.
 *
 * The error message payload contains details of an error return to the app or agent that
 * raised the original request.
 */
export interface RaiseIntentBridgeErrorResponsePayload {
  /**
   * Should be set if the raiseIntent request returned an error.
   */
  error: FindInstancesErrors;
}

/**
 * A request to raise an intent.
 *
 * A request message forwarded from the Bridge onto a Desktop Agent connected to it.
 */
export interface RaiseIntentBridgeRequest {
  meta: RaiseIntentBridgeRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: RaiseIntentBridgeRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'raiseIntentRequest';
}

/**
 * Metadata required in a request message forwarded on by the Bridge
 */
export interface RaiseIntentBridgeRequestMeta {
  /**
   * Optional field that represents the destination that the request should be routed to. Must
   * be set by the Desktop Agent for API calls that include a target app parameter and must
   * include the name of the Desktop Agent hosting the target application.
   */
  destination: MetaDestination;
  requestUuid: string;
  /**
   * Field that represents the source application that the request was received from, or the
   * source Desktop Agent if it issued the request itself. The Desktop Agent identifier MUST
   * be set by the bridge.
   */
  source: MetaSource;
  timestamp: Date;
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface RaiseIntentBridgeRequestPayload {
  app: AppDestinationIdentifier;
  context: Context;
  intent: string;
}

/**
 * A response to a request to raise an intent.
 *
 * A response message from the Bridge back to the original Desktop Agent that raised the
 * request.
 */
export interface RaiseIntentBridgeResponse {
  meta: RaiseIntentBridgeResponseMeta;
  /**
   * The message payload typically contains return values for FDC3 API functions.
   */
  payload: RaiseIntentBridgeResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'raiseIntentResponse';
}

/**
 * Metadata required in a response message collated and/or forwarded on by the Bridge
 */
export interface RaiseIntentBridgeResponseMeta {
  errorDetails?: ResponseErrorDetail[];
  errorSources?: DesktopAgentIdentifier[];
  requestUuid: string;
  responseUuid: string;
  sources?: DesktopAgentIdentifier[];
  timestamp: Date;
}

/**
 * The message payload typically contains return values for FDC3 API functions.
 */
export interface RaiseIntentBridgeResponsePayload {
  /**
   * Used if the raiseIntent request was successfully resolved.
   */
  intentResolution: IntentResolution;
}

/**
 * A secondary response to a request to raise an intent used to deliver the intent result,
 * which contains an error
 *
 * A response message from a Desktop Agent to the Bridge containing an error, to be used in
 * preference to the standard response when an error needs to be returned.
 */
export interface RaiseIntentResultAgentErrorResponse {
  meta: RaiseIntentResultAgentErrorResponseMeta;
  /**
   * Error message payload containing an standardized error string.
   */
  payload: RaiseIntentResultAgentErrorResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'raiseIntentResultResponse';
}

/**
 * Metadata for a response messages sent by a Desktop Agent to the Bridge
 */
export interface RaiseIntentResultAgentErrorResponseMeta {
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * Error message payload containing an standardized error string.
 */
export interface RaiseIntentResultAgentErrorResponsePayload {
  error: RaiseIntentResultErrorMessage;
}

/**
 * Array of error message strings for responses that were not returned to the bridge before
 * the timeout or because an error occurred. Should be the same length as the `errorSources`
 * array and ordered the same. May be omitted if all sources responded without errors.
 *
 * Constants representing the errors that can be encountered when calling the `open` method
 * on the DesktopAgent object (`fdc3`).
 *
 * Constants representing the errors that can be encountered when calling the
 * `addIntentListener`, `findIntent`, `findIntentsByContext`, `raiseIntent` or
 * `raiseIntentForContext` methods on the DesktopAgent (`fdc3`).
 */
export type RaiseIntentResultErrorMessage =
  | 'IntentHandlerRejected'
  | 'NoResultReturned'
  | 'ApiTimeout'
  | 'AgentDisconnected'
  | 'NotConnectedToBridge'
  | 'ResponseToBridgeTimedOut'
  | 'MalformedMessage';

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 */

/**
 * A secondary response to a request to raise an intent used to deliver the intent result
 *
 * A response message from a Desktop Agent to the Bridge.
 */
export interface RaiseIntentResultAgentResponse {
  meta: RaiseIntentResultAgentResponseMeta;
  /**
   * The message payload typically contains return values for FDC3 API functions.
   */
  payload: RaiseIntentResultAgentResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'raiseIntentResultResponse';
}

/**
 * Metadata for a response messages sent by a Desktop Agent to the Bridge
 */
export interface RaiseIntentResultAgentResponseMeta {
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * The message payload typically contains return values for FDC3 API functions.
 */
export interface RaiseIntentResultAgentResponsePayload {
  intentResult: IntentResult;
  /**
   * Metadata for the intent result, generated by the Desktop Agent and merged with any
   * app-provided metadata from the intentResultRequest. Always present, even for void or
   * channel results.
   */
  resultMetadata?: ContextMetadata;
}

export interface IntentResult {
  context?: Context;
  channel?: Channel;
}

/**
 * Represents a context channel that applications can use to send and receive
 * context data.
 *
 * Please note that There are differences in behavior when you interact with a
 * User channel via the `DesktopAgent` interface and the `Channel` interface.
 * Specifically, when 'joining' a User channel or adding a context listener
 * when already joined to a channel via the `DesktopAgent` interface, existing
 * context (matching the type of the context listener) on the channel is
 * received by the context listener immediately. Whereas, when a context
 * listener is added via the Channel interface, context is not received
 * automatically, but may be retrieved manually via the `getCurrentContext()`
 * function.
 */
export interface Channel {
  /**
   * Channels may be visualized and selectable by users. DisplayMetadata may be used to
   * provide hints on how to see them.
   * For App channels, displayMetadata would typically not be present.
   */
  displayMetadata?: DisplayMetadata;
  /**
   * Constant that uniquely identifies this channel.
   */
  id: string;
  /**
   * Uniquely defines each channel type.
   * Can be "user", "app" or "private".
   */
  type: Type;
}

/**
 * Channels may be visualized and selectable by users. DisplayMetadata may be used to
 * provide hints on how to see them.
 * For App channels, displayMetadata would typically not be present.
 *
 * A system channel will be global enough to have a presence across many apps. This gives us
 * some hints
 * to render them in a standard way. It is assumed it may have other properties too, but if
 * it has these,
 * this is their meaning.
 */
export interface DisplayMetadata {
  /**
   * The color that should be associated within this channel when displaying this channel in a
   * UI, e.g: `0xFF0000`.
   */
  color?: string;
  /**
   * A URL of an image that can be used to display this channel.
   */
  glyph?: string;
  /**
   * A user-readable name for this channel, e.g: `"Red"`.
   */
  name?: string;
}

/**
 * Uniquely defines each channel type.
 * Can be "user", "app" or "private".
 */
export type Type = 'app' | 'private' | 'user';

/**
 * Metadata for the intent result, generated by the Desktop Agent and merged with any
 * app-provided metadata from the intentResultRequest. Always present, even for void or
 * channel results.
 *
 * Metadata relating to a broadcastEvent or intentEvent, which may include metadata provided
 * by the Desktop Agent or the App that initiated the broadcast, raise intent or open
 * request.
 */
export interface ContextMetadata {
  /**
   * Anti-replay claims supplied with signed context (e.g. merged from intentResultRequest
   * metadata into resultMetadata).
   */
  antiReplay?: AntiReplayClaims;
  /**
   * Custom metadata that can be used to provide additional information about the context or
   * intent. This allows for individuals to use metadata fields that have yet to be
   * standardized.
   */
  custom?: { [key: string]: any };
  /**
   * A Detached JSON Web Signature (JWS) proving the authenticity and integrity of the context.
   */
  signature?: DetachedSignature;
  /**
   * Identifier for the app instance that sent the context and/or intent.
   */
  source: AppIdentifier;
  /**
   * The timestamp when the context or intent was created, encoded according to [ISO
   * 8601-1:2019](https://www.iso.org/standard/70907.html) with a timezone indicator.
   */
  timestamp: Date;
  /**
   * A unique identifier for the context or intent that can be used to trace the context or
   * intent through the system.
   */
  traceId: string;
}

/**
 * A secondary response to a request to raise an intent used to deliver the intent result,
 * which contains an error
 *
 * A response message from the Bridge back to the original Desktop Agent that raised the
 * request, used where all connected agents returned errors.
 */
export interface RaiseIntentResultBridgeErrorResponse {
  meta: RaiseIntentResultBridgeErrorResponseMeta;
  /**
   * The error message payload contains details of an error return to the app or agent that
   * raised the original request.
   */
  payload: RaiseIntentResultBridgeErrorResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'raiseIntentResultResponse';
}

/**
 * Metadata required in a response message collated and/or forwarded on by the Bridge
 */
export interface RaiseIntentResultBridgeErrorResponseMeta {
  errorDetails: ResponseErrorDetail[];
  errorSources: DesktopAgentIdentifier[];
  requestUuid: string;
  responseUuid: string;
  timestamp: Date;
}

/**
 * The error message payload contains details of an error return to the app or agent that
 * raised the original request.
 */
export interface RaiseIntentResultBridgeErrorResponsePayload {
  error: RaiseIntentResultErrorMessage;
}

/**
 * A secondary response to a request to raise an intent used to deliver the intent result
 *
 * A response message from the Bridge back to the original Desktop Agent that raised the
 * request.
 */
export interface RaiseIntentResultBridgeResponse {
  meta: RaiseIntentResultBridgeResponseMeta;
  /**
   * The message payload typically contains return values for FDC3 API functions.
   */
  payload: RaiseIntentResultBridgeResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'raiseIntentResultResponse';
}

/**
 * Metadata required in a response message collated and/or forwarded on by the Bridge
 */
export interface RaiseIntentResultBridgeResponseMeta {
  errorDetails?: ResponseErrorDetail[];
  errorSources?: DesktopAgentIdentifier[];
  requestUuid: string;
  responseUuid: string;
  sources?: DesktopAgentIdentifier[];
  timestamp: Date;
}

/**
 * The message payload typically contains return values for FDC3 API functions.
 */
export interface RaiseIntentResultBridgeResponsePayload {
  intentResult: IntentResult;
  /**
   * Metadata for the intent result, generated by the Desktop Agent and merged with any
   * app-provided metadata from the intentResultRequest. Always present, even for void or
   * channel results.
   */
  resultMetadata?: ContextMetadata;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
