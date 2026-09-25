// To parse this data:
//
//   import { Convert, WebConnectionProtocol1Hello, WebConnectionProtocol2LoadURL, WebConnectionProtocol3Handshake, WebConnectionProtocol4ValidateAppIdentity, WebConnectionProtocol5ValidateAppIdentityFailedResponse, WebConnectionProtocol5ValidateAppIdentitySuccessResponse, WebConnectionProtocol6Goodbye, WebConnectionProtocolMessage, AddContextListenerRequest, AddContextListenerResponse, AddEventListenerRequest, AddEventListenerResponse, AddIntentListenerRequest, AddIntentListenerResponse, AgentEventMessage, AgentResponseMessage, AppRequestMessage, BroadcastEvent, BroadcastRequest, BroadcastResponse, ChannelChangedEvent, ClearContextRequest, ClearContextResponse, CloseRequest, CloseResponse, ContextClearedEvent, ContextListenerUnsubscribeRequest, ContextListenerUnsubscribeResponse, CreatePrivateChannelRequest, CreatePrivateChannelResponse, EventListenerUnsubscribeRequest, EventListenerUnsubscribeResponse, Fdc3UserInterfaceChannelSelected, Fdc3UserInterfaceChannels, Fdc3UserInterfaceDrag, Fdc3UserInterfaceHandshake, Fdc3UserInterfaceHello, Fdc3UserInterfaceMessage, Fdc3UserInterfaceResolve, Fdc3UserInterfaceResolveAction, Fdc3UserInterfaceRestyle, FindInstancesRequest, FindInstancesResponse, FindIntentRequest, FindIntentResponse, FindIntentsByContextRequest, FindIntentsByContextResponse, GetAppMetadataRequest, GetAppMetadataResponse, GetCurrentChannelRequest, GetCurrentChannelResponse, GetCurrentContextRequest, GetCurrentContextResponse, GetInfoRequest, GetInfoResponse, GetOrCreateChannelRequest, GetOrCreateChannelResponse, GetUserChannelsRequest, GetUserChannelsResponse, HeartbeatAcknowledgementRequest, HeartbeatEvent, IntentEvent, IntentListenerUnsubscribeRequest, IntentListenerUnsubscribeResponse, IntentResultRequest, IntentResultResponse, JoinUserChannelRequest, JoinUserChannelResponse, LeaveCurrentChannelRequest, LeaveCurrentChannelResponse, OpenRequest, OpenResponse, PrivateChannelAddEventListenerRequest, PrivateChannelAddEventListenerResponse, PrivateChannelDisconnectRequest, PrivateChannelDisconnectResponse, PrivateChannelOnAddContextListenerEvent, PrivateChannelOnDisconnectEvent, PrivateChannelOnUnsubscribeEvent, PrivateChannelUnsubscribeEventListenerRequest, PrivateChannelUnsubscribeEventListenerResponse, RaiseIntentForContextRequest, RaiseIntentForContextResponse, RaiseIntentRequest, RaiseIntentResponse, RaiseIntentResultResponse } from "./file";
//
//   const webConnectionProtocol1Hello = Convert.toWebConnectionProtocol1Hello(json);
//   const webConnectionProtocol2LoadURL = Convert.toWebConnectionProtocol2LoadURL(json);
//   const webConnectionProtocol3Handshake = Convert.toWebConnectionProtocol3Handshake(json);
//   const webConnectionProtocol4ValidateAppIdentity = Convert.toWebConnectionProtocol4ValidateAppIdentity(json);
//   const webConnectionProtocol5ValidateAppIdentityFailedResponse = Convert.toWebConnectionProtocol5ValidateAppIdentityFailedResponse(json);
//   const webConnectionProtocol5ValidateAppIdentitySuccessResponse = Convert.toWebConnectionProtocol5ValidateAppIdentitySuccessResponse(json);
//   const webConnectionProtocol6Goodbye = Convert.toWebConnectionProtocol6Goodbye(json);
//   const webConnectionProtocolMessage = Convert.toWebConnectionProtocolMessage(json);
//   const addContextListenerRequest = Convert.toAddContextListenerRequest(json);
//   const addContextListenerResponse = Convert.toAddContextListenerResponse(json);
//   const addEventListenerRequest = Convert.toAddEventListenerRequest(json);
//   const addEventListenerResponse = Convert.toAddEventListenerResponse(json);
//   const addIntentListenerRequest = Convert.toAddIntentListenerRequest(json);
//   const addIntentListenerResponse = Convert.toAddIntentListenerResponse(json);
//   const agentEventMessage = Convert.toAgentEventMessage(json);
//   const agentResponseMessage = Convert.toAgentResponseMessage(json);
//   const appRequestMessage = Convert.toAppRequestMessage(json);
//   const broadcastEvent = Convert.toBroadcastEvent(json);
//   const broadcastRequest = Convert.toBroadcastRequest(json);
//   const broadcastResponse = Convert.toBroadcastResponse(json);
//   const channelChangedEvent = Convert.toChannelChangedEvent(json);
//   const clearContextRequest = Convert.toClearContextRequest(json);
//   const clearContextResponse = Convert.toClearContextResponse(json);
//   const closeRequest = Convert.toCloseRequest(json);
//   const closeResponse = Convert.toCloseResponse(json);
//   const contextClearedEvent = Convert.toContextClearedEvent(json);
//   const contextListenerUnsubscribeRequest = Convert.toContextListenerUnsubscribeRequest(json);
//   const contextListenerUnsubscribeResponse = Convert.toContextListenerUnsubscribeResponse(json);
//   const createPrivateChannelRequest = Convert.toCreatePrivateChannelRequest(json);
//   const createPrivateChannelResponse = Convert.toCreatePrivateChannelResponse(json);
//   const eventListenerUnsubscribeRequest = Convert.toEventListenerUnsubscribeRequest(json);
//   const eventListenerUnsubscribeResponse = Convert.toEventListenerUnsubscribeResponse(json);
//   const fdc3UserInterfaceChannelSelected = Convert.toFdc3UserInterfaceChannelSelected(json);
//   const fdc3UserInterfaceChannels = Convert.toFdc3UserInterfaceChannels(json);
//   const fdc3UserInterfaceDrag = Convert.toFdc3UserInterfaceDrag(json);
//   const fdc3UserInterfaceHandshake = Convert.toFdc3UserInterfaceHandshake(json);
//   const fdc3UserInterfaceHello = Convert.toFdc3UserInterfaceHello(json);
//   const fdc3UserInterfaceMessage = Convert.toFdc3UserInterfaceMessage(json);
//   const fdc3UserInterfaceResolve = Convert.toFdc3UserInterfaceResolve(json);
//   const fdc3UserInterfaceResolveAction = Convert.toFdc3UserInterfaceResolveAction(json);
//   const fdc3UserInterfaceRestyle = Convert.toFdc3UserInterfaceRestyle(json);
//   const findInstancesRequest = Convert.toFindInstancesRequest(json);
//   const findInstancesResponse = Convert.toFindInstancesResponse(json);
//   const findIntentRequest = Convert.toFindIntentRequest(json);
//   const findIntentResponse = Convert.toFindIntentResponse(json);
//   const findIntentsByContextRequest = Convert.toFindIntentsByContextRequest(json);
//   const findIntentsByContextResponse = Convert.toFindIntentsByContextResponse(json);
//   const getAppMetadataRequest = Convert.toGetAppMetadataRequest(json);
//   const getAppMetadataResponse = Convert.toGetAppMetadataResponse(json);
//   const getCurrentChannelRequest = Convert.toGetCurrentChannelRequest(json);
//   const getCurrentChannelResponse = Convert.toGetCurrentChannelResponse(json);
//   const getCurrentContextRequest = Convert.toGetCurrentContextRequest(json);
//   const getCurrentContextResponse = Convert.toGetCurrentContextResponse(json);
//   const getInfoRequest = Convert.toGetInfoRequest(json);
//   const getInfoResponse = Convert.toGetInfoResponse(json);
//   const getOrCreateChannelRequest = Convert.toGetOrCreateChannelRequest(json);
//   const getOrCreateChannelResponse = Convert.toGetOrCreateChannelResponse(json);
//   const getUserChannelsRequest = Convert.toGetUserChannelsRequest(json);
//   const getUserChannelsResponse = Convert.toGetUserChannelsResponse(json);
//   const heartbeatAcknowledgementRequest = Convert.toHeartbeatAcknowledgementRequest(json);
//   const heartbeatEvent = Convert.toHeartbeatEvent(json);
//   const intentEvent = Convert.toIntentEvent(json);
//   const intentListenerUnsubscribeRequest = Convert.toIntentListenerUnsubscribeRequest(json);
//   const intentListenerUnsubscribeResponse = Convert.toIntentListenerUnsubscribeResponse(json);
//   const intentResultRequest = Convert.toIntentResultRequest(json);
//   const intentResultResponse = Convert.toIntentResultResponse(json);
//   const joinUserChannelRequest = Convert.toJoinUserChannelRequest(json);
//   const joinUserChannelResponse = Convert.toJoinUserChannelResponse(json);
//   const leaveCurrentChannelRequest = Convert.toLeaveCurrentChannelRequest(json);
//   const leaveCurrentChannelResponse = Convert.toLeaveCurrentChannelResponse(json);
//   const openRequest = Convert.toOpenRequest(json);
//   const openResponse = Convert.toOpenResponse(json);
//   const privateChannelAddEventListenerRequest = Convert.toPrivateChannelAddEventListenerRequest(json);
//   const privateChannelAddEventListenerResponse = Convert.toPrivateChannelAddEventListenerResponse(json);
//   const privateChannelDisconnectRequest = Convert.toPrivateChannelDisconnectRequest(json);
//   const privateChannelDisconnectResponse = Convert.toPrivateChannelDisconnectResponse(json);
//   const privateChannelOnAddContextListenerEvent = Convert.toPrivateChannelOnAddContextListenerEvent(json);
//   const privateChannelOnDisconnectEvent = Convert.toPrivateChannelOnDisconnectEvent(json);
//   const privateChannelOnUnsubscribeEvent = Convert.toPrivateChannelOnUnsubscribeEvent(json);
//   const privateChannelUnsubscribeEventListenerRequest = Convert.toPrivateChannelUnsubscribeEventListenerRequest(json);
//   const privateChannelUnsubscribeEventListenerResponse = Convert.toPrivateChannelUnsubscribeEventListenerResponse(json);
//   const raiseIntentForContextRequest = Convert.toRaiseIntentForContextRequest(json);
//   const raiseIntentForContextResponse = Convert.toRaiseIntentForContextResponse(json);
//   const raiseIntentRequest = Convert.toRaiseIntentRequest(json);
//   const raiseIntentResponse = Convert.toRaiseIntentResponse(json);
//   const raiseIntentResultResponse = Convert.toRaiseIntentResultResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

/**
 * Hello message sent by an application to a parent window or frame when attempting to
 * establish connectivity to a Desktop Agent.
 *
 * A message used during the connection flow for an application to a Desktop Agent in a
 * browser window. Used for messages sent in either direction.
 */
export interface WebConnectionProtocol1Hello {
  /**
   * Metadata for a Web Connection Protocol message.
   */
  meta: WebConnectionProtocol1HelloMeta;
  /**
   * The message payload, containing data pertaining to this connection step.
   */
  payload: WebConnectionProtocol1HelloPayload;
  /**
   * Identifies the type of the connection step message.
   */
  type: 'WCP1Hello';
}

/**
 * Metadata for a Web Connection Protocol message.
 */
export interface WebConnectionProtocol1HelloMeta {
  connectionAttemptUuid: string;
  timestamp: Date;
}

/**
 * The message payload, containing data pertaining to this connection step.
 */
export interface WebConnectionProtocol1HelloPayload {
  /**
   * The current URL of the page attempting to connect. This may differ from the identityUrl,
   * but the origins MUST match.
   */
  actualUrl: string;
  /**
   * A flag that may be used to indicate that a channel selector user interface is or is not
   * required. Set to `false` if the app includes its own interface for selecting channels or
   * does not work with user channels.
   */
  channelSelector?: boolean;
  /**
   * The version of FDC3 API that the app supports.
   */
  fdc3Version: string;
  /**
   * URL to use for the identity of the application. Desktop Agents MUST validate that the
   * origin of the message matches the URL, but MAY implement custom comparison logic.
   */
  identityUrl: string;
  /**
   * A flag that may be used to indicate that an intent resolver is or is not required. Set to
   * `false` if no intents, or only targeted intents, are raised.
   */
  intentResolver?: boolean;
}

/**
 * Identifies the type of the connection step message.
 */

/**
 * Response from a Desktop Agent to an application requesting access to it indicating that
 * it should load a specified URL into a hidden iframe in order to establish connectivity to
 * a Desktop Agent.
 *
 * A message used during the connection flow for an application to a Desktop Agent in a
 * browser window. Used for messages sent in either direction.
 */
export interface WebConnectionProtocol2LoadURL {
  /**
   * Metadata for a Web Connection Protocol message.
   */
  meta: WebConnectionProtocol1HelloMeta;
  /**
   * The message payload, containing data pertaining to this connection step.
   */
  payload: WebConnectionProtocol2LoadURLPayload;
  /**
   * Identifies the type of the connection step message.
   */
  type: 'WCP2LoadUrl';
}

/**
 * The message payload, containing data pertaining to this connection step.
 */
export interface WebConnectionProtocol2LoadURLPayload {
  /**
   * A URL which can be used to establish communication with the Desktop Agent, via loading
   * the URL into an iframe and restarting the Web Connection protocol with the iframe as the
   * target.
   */
  iframeUrl: string;
}

/**
 * Identifies the type of the connection step message.
 */

/**
 * Handshake message sent by the Desktop Agent to the app (with a MessagePort appended) that
 * should be used for subsequent communication steps.
 *
 * A message used during the connection flow for an application to a Desktop Agent in a
 * browser window. Used for messages sent in either direction.
 */
export interface WebConnectionProtocol3Handshake {
  /**
   * Metadata for a Web Connection Protocol message.
   */
  meta: WebConnectionProtocol1HelloMeta;
  /**
   * The message payload, containing data pertaining to this connection step.
   */
  payload: WebConnectionProtocol3HandshakePayload;
  /**
   * Identifies the type of the connection step message.
   */
  type: 'WCP3Handshake';
}

/**
 * The message payload, containing data pertaining to this connection step.
 */
export interface WebConnectionProtocol3HandshakePayload {
  /**
   * Indicates a custom timeout (in milliseconds) that should be used for API message
   * exchanges that may involve launching an application, instead of the default 100,000
   * millisecond timeout.
   */
  appLaunchTimeout?: number;
  /**
   * Indicates whether a channel selector user interface is required and the URL to use to do
   * so. Set to `true` to use the default or `false` to disable the channel selector (as the
   * Desktop Agent will handle it another way).
   */
  channelSelectorUrl: boolean | string;
  /**
   * The version of FDC3 API that the Desktop Agent will provide support for.
   */
  fdc3Version: string;
  /**
   * Indicates whether an intent resolver user interface is required and the URL to use to do
   * so. Set to `true` to use the default or `false` to disable the intent resolver (as the
   * Desktop Agent will handle it another way).
   */
  intentResolverUrl: boolean | string;
  /**
   * Indicates a custom timeout (in milliseconds) that should be used for the majority of API
   * message exchanges instead of the default 10,000 millisecond timeout.
   */
  messageExchangeTimeout?: number;
}

/**
 * Identifies the type of the connection step message.
 */

/**
 * Identity Validation request from an app attempting to connect to a Desktop Agent.
 *
 * A message used during the connection flow for an application to a Desktop Agent in a
 * browser window. Used for messages sent in either direction.
 */
export interface WebConnectionProtocol4ValidateAppIdentity {
  /**
   * Metadata for a Web Connection Protocol message.
   */
  meta: WebConnectionProtocol1HelloMeta;
  /**
   * The message payload, containing data pertaining to this connection step.
   */
  payload: WebConnectionProtocol4ValidateAppIdentityPayload;
  /**
   * Identifies the type of the connection step message.
   */
  type: 'WCP4ValidateAppIdentity';
}

/**
 * The message payload, containing data pertaining to this connection step.
 */
export interface WebConnectionProtocol4ValidateAppIdentityPayload {
  /**
   * The current URL of the page attempting to connect. This may differ from the identityUrl,
   * but the origins MUST match.
   */
  actualUrl: string;
  /**
   * URL to use for the identity of the application. Desktop Agents MUST validate that the
   * origin of the message matches the URL, but MAY implement custom comparison logic.
   */
  identityUrl: string;
  /**
   * If an application has previously connected to the Desktop Agent, it may specify its prior
   * instance id and associated instance UUID to request the same same instance Id be assigned.
   */
  instanceId?: string;
  /**
   * Instance UUID associated with the requested instanceId.
   */
  instanceUuid?: string;
}

/**
 * Identifies the type of the connection step message.
 */

/**
 * Message sent by the Desktop Agent to an app if their identity validation fails.
 *
 * A message used during the connection flow for an application to a Desktop Agent in a
 * browser window. Used for messages sent in either direction.
 */
export interface WebConnectionProtocol5ValidateAppIdentityFailedResponse {
  /**
   * Metadata for a Web Connection Protocol message.
   */
  meta: WebConnectionProtocol1HelloMeta;
  /**
   * The message payload, containing data pertaining to this connection step.
   */
  payload: WebConnectionProtocol5ValidateAppIdentityFailedResponsePayload;
  /**
   * Identifies the type of the connection step message.
   */
  type: 'WCP5ValidateAppIdentityFailedResponse';
}

/**
 * The message payload, containing data pertaining to this connection step.
 */
export interface WebConnectionProtocol5ValidateAppIdentityFailedResponsePayload {
  message?: string;
}

/**
 * Identifies the type of the connection step message.
 */

/**
 * Message sent by the Desktop Agent to an app after successful identity validation.
 *
 * A message used during the connection flow for an application to a Desktop Agent in a
 * browser window. Used for messages sent in either direction.
 */
export interface WebConnectionProtocol5ValidateAppIdentitySuccessResponse {
  /**
   * Metadata for a Web Connection Protocol message.
   */
  meta: WebConnectionProtocol1HelloMeta;
  /**
   * The message payload, containing data pertaining to this connection step.
   */
  payload: WebConnectionProtocol5ValidateAppIdentitySuccessResponsePayload;
  /**
   * Identifies the type of the connection step message.
   */
  type: 'WCP5ValidateAppIdentityResponse';
}

/**
 * The message payload, containing data pertaining to this connection step.
 */
export interface WebConnectionProtocol5ValidateAppIdentitySuccessResponsePayload {
  /**
   * The appId that the app's identity was validated against.
   */
  appId: string;
  /**
   * Implementation metadata for the Desktop Agent, which includes an appMetadata element
   * containing a copy of the app's own metadata.
   */
  implementationMetadata: ImplementationMetadata;
  /**
   * The instance Id granted to the application by the Desktop Agent.
   */
  instanceId: string;
  /**
   * Instance UUID associated with the instanceId granted, which may be used to retrieve the
   * same instanceId if the app is reloaded or navigates.
   */
  instanceUuid: string;
}

/**
 * Implementation metadata for the Desktop Agent, which includes an appMetadata element
 * containing a copy of the app's own metadata.
 *
 * Includes Metadata for the current application.
 *
 * Metadata relating to the FDC3 Desktop Agent implementation and its provider.
 */
export interface ImplementationMetadata {
  /**
   * The calling application instance's own metadata, according to the Desktop Agent (MUST
   * include at least the `appId` and `instanceId`).
   */
  appMetadata: AppMetadata;
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
 * The calling application instance's own metadata, according to the Desktop Agent (MUST
 * include at least the `appId` and `instanceId`).
 *
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
 * Goodbye message to be sent to the Desktop Agent when disconnecting (e.g. when closing the
 * window or navigating). Desktop Agents should close the MessagePort after receiving this
 * message, but retain instance details in case the application reconnects (e.g. after a
 * navigation event).
 *
 * A message used during the connection flow for an application to a Desktop Agent in a
 * browser window. Used for messages sent in either direction.
 */
export interface WebConnectionProtocol6Goodbye {
  /**
   * Metadata for a Web Connection Protocol message.
   */
  meta: WebConnectionProtocol6GoodbyeMeta;
  /**
   * Identifies the type of the connection step message.
   */
  type: 'WCP6Goodbye';
}

/**
 * Metadata for a Web Connection Protocol message.
 */
export interface WebConnectionProtocol6GoodbyeMeta {
  timestamp: Date;
}

/**
 * Identifies the type of the connection step message.
 */

/**
 * A message used during the connection flow for an application to a Desktop Agent in a
 * browser window. Used for messages sent in either direction.
 */
export interface WebConnectionProtocolMessage {
  /**
   * Metadata for a Web Connection Protocol message.
   */
  meta: ConnectionStepMetadata;
  /**
   * The message payload, containing data pertaining to this connection step.
   */
  payload?: { [key: string]: any };
  /**
   * Identifies the type of the connection step message.
   */
  type: ConnectionStepMessageType;
}

/**
 * Metadata for a Web Connection Protocol message.
 */
export interface ConnectionStepMetadata {
  timestamp: Date;
  connectionAttemptUuid?: string;
}

/**
 * Identifies the type of the connection step message.
 */
export type ConnectionStepMessageType =
  | 'WCP1Hello'
  | 'WCP2LoadUrl'
  | 'WCP3Handshake'
  | 'WCP4ValidateAppIdentity'
  | 'WCP5ValidateAppIdentityFailedResponse'
  | 'WCP5ValidateAppIdentityResponse'
  | 'WCP6Goodbye';

/**
 * A request to add a context listener to a specified Channel OR to the current user
 * channel. Where the listener is added to the current user channel (channelId == null), and
 * this app has already been added to a user channel, client code should make a subsequent
 * request to get the current context of that channel for this listener and then call its
 * handler with it.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface AddContextListenerRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: AddContextListenerRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'addContextListenerRequest';
}

/**
 * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
 */
export interface AddContextListenerRequestMeta {
  requestUuid: string;
  /**
   * Field that represents the source application that a request or response was received
   * from. Please note that this may be set by an app or Desktop Agent proxy for debugging
   * purposes but a Desktop Agent should make its own determination of the source of a message
   * to avoid spoofing.
   */
  source?: AppIdentifier;
  timestamp: Date;
}

/**
 * Field that represents the source application that a request or response was received
 * from. Please note that this may be set by an app or Desktop Agent proxy for debugging
 * purposes but a Desktop Agent should make its own determination of the source of a message
 * to avoid spoofing.
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
 * Field that represents the source application that the request being responded to was
 * received from, for debugging purposes.
 *
 * Identifier for the app instance that sent the context and/or intent.
 *
 * The App resolution option chosen.
 *
 * Identifier for the app instance that was selected (or started) to resolve the intent.
 * `source.instanceId` MUST be set, indicating the specific app instance that
 * received the intent.
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
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface AddContextListenerRequestPayload {
  /**
   * The id of the channel to add the listener to or `null` indicating that it should listen
   * to the current user channel (at the time of broadcast).
   */
  channelId: null | string;
  /**
   * The type of context to listen for OR `null` indicating that it should listen to all
   * context types.
   */
  contextType?: null | string;
  /**
   * Array of context types to listen for.
   */
  contextTypes?: string[];
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a addContextListener request. Where the listener was added to the current
 * user channel (channelId == null), and this app has already been added to a user channel,
 * client code should make a subsequent request to get the current context of that channel
 * for this listener and then call its handler with it.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface AddContextListenerResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: AddContextListenerResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'addContextListenerResponse';
}

/**
 * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
 */
export interface AddContextListenerResponseMeta {
  requestUuid: string;
  responseUuid: string;
  /**
   * Field that represents the source application that the request being responded to was
   * received from, for debugging purposes.
   */
  source?: AppIdentifier;
  timestamp: Date;
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface AddContextListenerResponsePayload {
  error?: PurpleError;
  listenerUUID?: string;
}

/**
 * Constants representing the errors that can be encountered when calling the `open` method
 * on the DesktopAgent object (`fdc3`).
 *
 * Constants representing the errors that can be encountered when calling the
 * `addIntentListener`, `findIntent`, `findIntentsByContext`, `raiseIntent` or
 * `raiseIntentForContext` methods on the DesktopAgent (`fdc3`).
 */
export type PurpleError =
  'AccessDenied' | 'CreationFailed' | 'MalformedContext' | 'NoChannelFound' | 'ApiTimeout' | 'InvalidArguments';

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request to add an event listener for a specified event type to the Desktop Agent.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface AddEventListenerRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: AddEventListenerRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'addEventListenerRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface AddEventListenerRequestPayload {
  /**
   * The Id of the Channel that a Channel-scoped listener registration applies to (as
   * registered via `Channel.addEventListener`). Set to `null` for Desktop Agent-level
   * listener registrations (as registered via `DesktopAgent.addEventListener`), whose scope
   * follows the app's current User channel. Currently only relevant to the `CONTEXT_CLEARED`
   * event type.
   */
  channelId: null | string;
  /**
   * The type of the event to be listened to or `null` to listen to all event types.
   */
  type: FDC3EventType | null;
}

/**
 * The type of a (non-context and non-intent) event that may be received via the FDC3 API's
 * addEventListener function.
 */
export type FDC3EventType = 'USER_CHANNEL_CHANGED' | 'CONTEXT_CLEARED';

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to an addEventListener request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface AddEventListenerResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: AddEventListenerResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'addEventListenerResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface AddEventListenerResponsePayload {
  error?: ResponsePayloadError;
  listenerUUID?: string;
}

/**
 * Constants representing the errors that can be encountered when calling the `open` method
 * on the DesktopAgent object (`fdc3`).
 *
 * Constants representing the errors that can be encountered when calling the
 * `addIntentListener`, `findIntent`, `findIntentsByContext`, `raiseIntent` or
 * `raiseIntentForContext` methods on the DesktopAgent (`fdc3`).
 */
export type ResponsePayloadError =
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

/**
 * A request to add an Intent listener for a specified intent type.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface AddIntentListenerRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: AddIntentListenerRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'addIntentListenerRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface AddIntentListenerRequestPayload {
  /**
   * Optional list of context types that the listener should be invoked for. If omitted, the
   * listener will be invoked for all context types that match the intent.
   */
  contextTypes?: string[];
  /**
   * The name of the intent to listen for.
   */
  intent: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a addIntentListener request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface AddIntentListenerResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: PayloadObject;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'addIntentListenerResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface PayloadObject {
  error?: FluffyError;
  listenerUUID?: string;
  [property: string]: any;
}

/**
 * Constants representing the errors that can be encountered when calling the `open` method
 * on the DesktopAgent object (`fdc3`).
 *
 * Constants representing the errors that can be encountered when calling the
 * `addIntentListener`, `findIntent`, `findIntentsByContext`, `raiseIntent` or
 * `raiseIntentForContext` methods on the DesktopAgent (`fdc3`).
 */
export type FluffyError =
  | 'MalformedContext'
  | 'ApiTimeout'
  | 'InvalidArguments'
  | 'DesktopAgentNotFound'
  | 'ResolverUnavailable'
  | 'IntentDeliveryFailed'
  | 'NoAppsFound'
  | 'ResolverTimeout'
  | 'TargetAppUnavailable'
  | 'TargetInstanceUnavailable'
  | 'UserCancelledResolution'
  | 'IntentListenerConflict';

/**
 * Metadata for messages sent by a Desktop Agent to an app notifying it of an event.
 */
export interface AgentEventMessageMeta {
  eventUuid: string;
  timestamp: Date;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */
export type EventMessageType =
  | 'addEventListenerEvent'
  | 'broadcastEvent'
  | 'channelChangedEvent'
  | 'heartbeatEvent'
  | 'intentEvent'
  | 'privateChannelOnAddContextListenerEvent'
  | 'privateChannelOnDisconnectEvent'
  | 'privateChannelOnUnsubscribeEvent'
  | 'contextClearedEvent';

/**
 * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
 */
export interface AgentResponseMessageMeta {
  requestUuid: string;
  responseUuid: string;
  /**
   * Field that represents the source application that the request being responded to was
   * received from, for debugging purposes.
   */
  source?: AppIdentifier;
  timestamp: Date;
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface AgentResponseMessageResponsePayload {
  error?: ResponsePayloadError;
  [property: string]: any;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */
export type ResponseMessageType =
  | 'addContextListenerResponse'
  | 'addEventListenerResponse'
  | 'addIntentListenerResponse'
  | 'broadcastResponse'
  | 'contextListenerUnsubscribeResponse'
  | 'createPrivateChannelResponse'
  | 'eventListenerUnsubscribeResponse'
  | 'findInstancesResponse'
  | 'findIntentResponse'
  | 'findIntentsByContextResponse'
  | 'getAppMetadataResponse'
  | 'getCurrentChannelResponse'
  | 'getCurrentContextResponse'
  | 'getInfoResponse'
  | 'getOrCreateChannelResponse'
  | 'getUserChannelsResponse'
  | 'intentListenerUnsubscribeResponse'
  | 'intentResultResponse'
  | 'joinUserChannelResponse'
  | 'leaveCurrentChannelResponse'
  | 'openResponse'
  | 'privateChannelAddEventListenerResponse'
  | 'privateChannelDisconnectResponse'
  | 'privateChannelUnsubscribeEventListenerResponse'
  | 'raiseIntentForContextResponse'
  | 'raiseIntentResponse'
  | 'raiseIntentResultResponse'
  | 'clearContextResponse'
  | 'closeResponse';

/**
 * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
 */
export interface AppRequestMessageMeta {
  requestUuid: string;
  /**
   * Field that represents the source application that a request or response was received
   * from. Please note that this may be set by an app or Desktop Agent proxy for debugging
   * purposes but a Desktop Agent should make its own determination of the source of a message
   * to avoid spoofing.
   */
  source?: AppIdentifier;
  timestamp: Date;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */
export type RequestMessageType =
  | 'addContextListenerRequest'
  | 'addEventListenerRequest'
  | 'addIntentListenerRequest'
  | 'broadcastRequest'
  | 'contextListenerUnsubscribeRequest'
  | 'createPrivateChannelRequest'
  | 'eventListenerUnsubscribeRequest'
  | 'findInstancesRequest'
  | 'findIntentRequest'
  | 'findIntentsByContextRequest'
  | 'getAppMetadataRequest'
  | 'getCurrentChannelRequest'
  | 'getCurrentContextRequest'
  | 'getInfoRequest'
  | 'getOrCreateChannelRequest'
  | 'getUserChannelsRequest'
  | 'heartbeatAcknowledgementRequest'
  | 'intentListenerUnsubscribeRequest'
  | 'intentResultRequest'
  | 'joinUserChannelRequest'
  | 'leaveCurrentChannelRequest'
  | 'openRequest'
  | 'privateChannelAddEventListenerRequest'
  | 'privateChannelDisconnectRequest'
  | 'privateChannelUnsubscribeEventListenerRequest'
  | 'raiseIntentForContextRequest'
  | 'raiseIntentRequest'
  | 'clearContextRequest'
  | 'closeRequest';

/**
 * An event message from the Desktop Agent to an app indicating that context has been
 * broadcast on a channel it is listening to, or specifically to this app instance if it was
 * launched via `fdc3.open` and context was passed.
 *
 * A message from a Desktop Agent to an FDC3-enabled app representing an event.
 */
export interface BroadcastEvent {
  /**
   * Metadata for messages sent by a Desktop Agent to an app notifying it of an event.
   */
  meta: BroadcastEventMeta;
  /**
   * The message payload contains details of the event that the app is being notified about.
   */
  payload: BroadcastEventPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'broadcastEvent';
}

/**
 * Metadata for messages sent by a Desktop Agent to an app notifying it of an event.
 */
export interface BroadcastEventMeta {
  eventUuid: string;
  timestamp: Date;
}

/**
 * The message payload contains details of the event that the app is being notified about.
 */
export interface BroadcastEventPayload {
  /**
   * The Id of the channel that the broadcast was sent on. May be `null` if the context is
   * being broadcast due to a call `fdc3.open` that passed context.
   */
  channelId: null | string;
  /**
   * The context object that was broadcast.
   */
  context: Context;
  metadata: ContextMetadata;
}

/**
 * The context object that was broadcast.
 *
 * The context object that is to be broadcast.
 *
 * The context object passed with the raised intent.
 *
 * If a Context object is passed in, this object will be provided to the opened application
 * via a contextListener. The Context argument is functionally equivalent to opening the
 * target app with no context and broadcasting the context directly to it.
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
 * Metadata relating to a broadcastEvent or intentEvent, which may include metadata provided
 * by the Desktop Agent or the App that initiated the broadcast, raise intent or open
 * request.
 *
 * Metadata for the intent result, generated by the Desktop Agent and merged with any
 * app-provided metadata from the intentResultRequest. Always present, even for void or
 * channel results.
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
 * Anti-replay claims supplied with signed context (e.g. merged from intentResultRequest
 * metadata into resultMetadata).
 *
 * Anti-replay claims extracted from the context's antiReplay field after verification.
 *
 * Should be populated when the context is signed.  Included in the signature.  Prevents
 * replay attacks where context objects are re-used.
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
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request to broadcast context on a channel.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface BroadcastRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: BroadcastRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'broadcastRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface BroadcastRequestPayload {
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
 * Optional metadata supplied by the broadcasting app (`traceId`, `signature`, `antiReplay`
 * and `custom`). This field carries only the app-provided portion of the metadata; the
 * Desktop Agent adds its own `source` and `timestamp` before delivering the enriched
 * `ContextMetadata` to receiving apps. It MUST be omitted when the app did not supply a
 * metadata argument to `broadcast()`.
 *
 * Metadata that can be provided by an app as part of a broadcast, raise intent or open API
 * call.
 *
 * Optional app-provided metadata returned by the intent handler alongside a context result
 * (i.e. when the handler returns a ContextWithMetadata object). The Desktop Agent will
 * merge this with its own generated metadata before delivering to the raising app via
 * raiseIntentResultResponse.
 *
 * Optional metadata supplied by the calling app (`traceId`, `signature`, `antiReplay` and
 * `custom`) to accompany any `context` delivered to the opened app. This field carries only
 * the app-provided portion of the metadata; the Desktop Agent adds its own `source` and
 * `timestamp` before delivering the enriched `ContextMetadata`. It MUST be omitted when the
 * app did not supply a metadata argument to `open()`.
 *
 * Optional metadata supplied by the calling app (`traceId`, `signature`, `antiReplay` and
 * `custom`) to accompany the `context`. This field carries only the app-provided portion of
 * the metadata; the Desktop Agent adds its own `source` and `timestamp` before delivering
 * the enriched `ContextMetadata`. It MUST be omitted when the app did not supply a metadata
 * argument to `raiseIntentForContext()`.
 *
 * Optional metadata supplied by the calling app (`traceId`, `signature`, `antiReplay` and
 * `custom`) to accompany the raised intent's `context`. This field carries only the
 * app-provided portion of the metadata; the Desktop Agent adds its own `source` and
 * `timestamp` before delivering the enriched `ContextMetadata`. It MUST be omitted when the
 * app did not supply a metadata argument to `raiseIntent()`.
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
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a request to broadcast context on a channel.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface BroadcastResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: BroadcastResponseResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'broadcastResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface BroadcastResponseResponsePayload {
  error?: ResponsePayloadError;
  [property: string]: any;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * An event message from the Desktop Agent to an app indicating that its current user
 * channel has changed.
 *
 * A message from a Desktop Agent to an FDC3-enabled app representing an event.
 */
export interface ChannelChangedEvent {
  /**
   * Metadata for messages sent by a Desktop Agent to an app notifying it of an event.
   */
  meta: BroadcastEventMeta;
  /**
   * The message payload contains details of the event that the app is being notified about.
   */
  payload: ChannelChangedEventPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'channelChangedEvent';
}

/**
 * The message payload contains details of the event that the app is being notified about.
 */
export interface ChannelChangedEventPayload {
  /**
   * Deprecated - allowed for backwards compatibility.  The Id of the channel that the app was
   * added to or `null` if it was removed from a channel.
   */
  newChannelId?: null | string;
  /**
   * The Id of the channel that the app was added to or `null` if it was removed from a
   * channel.
   */
  currentChannelId?: null | string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request to clear context on a channel.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface ClearContextRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: ClearContextRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'clearContextRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface ClearContextRequestPayload {
  /**
   * The id of the channel to clear the context on.
   */
  channelId: string;
  /**
   * The type of context to clear for OR `null` indicating that all context types on the
   * channel should be cleared.
   */
  contextType: null | string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a request to clear context on a channel.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface ClearContextResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: BroadcastResponseResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'clearContextResponse';
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request from an FDC3-enabled app to close its own window or frame.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface CloseRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: CloseRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'closeRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface CloseRequestPayload {}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a close request. On a successful close the app is destroyed before a
 * success response can be delivered; only error responses are received by the app in that
 * case.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface CloseResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: CloseResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'closeResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface CloseResponsePayload {
  error?: 'ApiTimeout';
}

/**
 * Constants representing the errors that can be encountered when calling the `open` method
 * on the DesktopAgent object (`fdc3`).
 *
 * Constants representing the errors that can be encountered when calling the
 * `addIntentListener`, `findIntent`, `findIntentsByContext`, `raiseIntent` or
 * `raiseIntentForContext` methods on the DesktopAgent (`fdc3`).
 *
 * Constants representing the errors that can be encountered when calling the `close` method
 * on the DesktopAgent object (`fdc3`).
 */

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * An event message from the Desktop Agent to an app indicating that context has been
 * cleared on a channel.
 *
 * A message from a Desktop Agent to an FDC3-enabled app representing an event.
 */
export interface ContextClearedEvent {
  /**
   * Metadata for messages sent by a Desktop Agent to an app notifying it of an event.
   */
  meta: BroadcastEventMeta;
  /**
   * The message payload contains details of the event that the app is being notified about.
   */
  payload: ContextClearedEventPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'contextClearedEvent';
}

/**
 * The message payload contains details of the event that the app is being notified about.
 */
export interface ContextClearedEventPayload {
  /**
   * The Id of the channel that was cleared.
   */
  channelId: null | string;
  /**
   * The type of context that was cleared, or null if all types were cleared.
   */
  contextType: null | string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request to unsubscribe a context listener.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface ContextListenerUnsubscribeRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: ContextListenerUnsubscribeRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'contextListenerUnsubscribeRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface ContextListenerUnsubscribeRequestPayload {
  listenerUUID: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a contextListenerUnsubscribe request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface ContextListenerUnsubscribeResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: BroadcastResponseResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'contextListenerUnsubscribeResponse';
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * Request to return a Channel with an auto-generated identity that is intended for private
 * communication between applications.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface CreatePrivateChannelRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: CreatePrivateChannelRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'createPrivateChannelRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface CreatePrivateChannelRequestPayload {}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a createPrivateChannel request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface CreatePrivateChannelResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: CreatePrivateChannelResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'createPrivateChannelResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface CreatePrivateChannelResponsePayload {
  error?: PurpleError;
  privateChannel?: Channel;
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
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request to unsubscribe an event listener.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface EventListenerUnsubscribeRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: EventListenerUnsubscribeRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'eventListenerUnsubscribeRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface EventListenerUnsubscribeRequestPayload {
  listenerUUID: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to an eventListenerUnsubscribe request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface EventListenerUnsubscribeResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: BroadcastResponseResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'eventListenerUnsubscribeResponse';
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * Message from a channel selector UI to the DA proxy sent when the channel selection
 * changes.
 *
 * A message used to communicate with user interface frames injected by `getAgent()` for
 * displaying UI elements such as the intent resolver or channel selector. Used for messages
 * sent in either direction.
 */
export interface Fdc3UserInterfaceChannelSelected {
  /**
   * The message payload.
   */
  payload: Fdc3UserInterfaceChannelSelectedPayload;
  /**
   * Identifies the type of the message to or from the user interface frame.
   */
  type: 'Fdc3UserInterfaceChannelSelected';
}

/**
 * The message payload.
 */
export interface Fdc3UserInterfaceChannelSelectedPayload {
  /**
   * The id of the channel that should be currently selected, or `null` if none should be
   * selected.
   */
  selected: null | string;
}

/**
 * Identifies the type of the message to or from the user interface frame.
 */

/**
 * Setup message sent by the DA proxy code in getAgent() to a channel selector UI in an
 * iframe with the channel definitions and current channel selection.
 *
 * A message used to communicate with user interface frames injected by `getAgent()` for
 * displaying UI elements such as the intent resolver or channel selector. Used for messages
 * sent in either direction.
 */
export interface Fdc3UserInterfaceChannels {
  /**
   * The message payload.
   */
  payload: Fdc3UserInterfaceChannelsPayload;
  /**
   * Identifies the type of the message to or from the user interface frame.
   */
  type: 'Fdc3UserInterfaceChannels';
}

/**
 * The message payload.
 */
export interface Fdc3UserInterfaceChannelsPayload {
  /**
   * The id of the channel that should be currently selected, or `null` if none should be
   * selected.
   */
  selected: null | string;
  /**
   * User Channel definitions.```````s
   */
  userChannels: Channel[];
}

/**
 * Identifies the type of the message to or from the user interface frame.
 */

/**
 * Message from a UI iframe to the DA proxy (setup by `getAgent()`) indicating that the user
 * is dragging the UI to a new location and providing the offset to apply to the location.
 * The DA proxy implementation should limit the location to the current bounds of the
 * window's viewport.
 *
 * A message used to communicate with user interface frames injected by `getAgent()` for
 * displaying UI elements such as the intent resolver or channel selector. Used for messages
 * sent in either direction.
 */
export interface Fdc3UserInterfaceDrag {
  /**
   * The message payload.
   */
  payload: Fdc3UserInterfaceDragPayload;
  /**
   * Identifies the type of the message to or from the user interface frame.
   */
  type: 'Fdc3UserInterfaceDrag';
}

/**
 * The message payload.
 */
export interface Fdc3UserInterfaceDragPayload {
  /**
   * The offset to move the frame by.
   */
  mouseOffsets: MouseOffsets;
}

/**
 * The offset to move the frame by.
 */
export interface MouseOffsets {
  x: number;
  y: number;
}

/**
 * Identifies the type of the message to or from the user interface frame.
 */

/**
 * Handshake message sent back to a user interface from the DA proxy code (setup by
 * `getAgent()`) over the `MessagePort` provided in the preceding Fdc3UserInterfaceHello
 * message, confirming that it is listening to the `MessagePort` for further communication.
 *
 * A message used to communicate with user interface frames injected by `getAgent()` for
 * displaying UI elements such as the intent resolver or channel selector. Used for messages
 * sent in either direction.
 */
export interface Fdc3UserInterfaceHandshake {
  /**
   * The message payload.
   */
  payload: Fdc3UserInterfaceHandshakePayload;
  /**
   * Identifies the type of the message to or from the user interface frame.
   */
  type: 'Fdc3UserInterfaceHandshake';
}

/**
 * The message payload.
 */
export interface Fdc3UserInterfaceHandshakePayload {
  /**
   * The version of FDC3 API that the Desktop Agent will provide support for.
   */
  fdc3Version: string;
}

/**
 * Identifies the type of the message to or from the user interface frame.
 */

/**
 * Hello message sent by a UI to the Desktop Agent proxy setup by `getAgent()` to indicate
 * it is ready to communicate, containing initial CSS to set on the iframe, and including an
 * appended `MessagePort` to be used for further communication.
 *
 * A message used to communicate with user interface frames injected by `getAgent()` for
 * displaying UI elements such as the intent resolver or channel selector. Used for messages
 * sent in either direction.
 */
export interface Fdc3UserInterfaceHello {
  /**
   * The message payload.
   */
  payload: Fdc3UserInterfaceHelloPayload;
  /**
   * Identifies the type of the message to or from the user interface frame.
   */
  type: 'Fdc3UserInterfaceHello';
}

/**
 * The message payload.
 */
export interface Fdc3UserInterfaceHelloPayload {
  /**
   * Details about the UI implementation, such as vendor and version, for logging purposes.
   */
  implementationDetails: string;
  /**
   * A constrained set of styling properties that should be set on the user interface before
   * it is displayed. Note `position` cannot be specified and should always be set to `fixed`.
   */
  initialCSS: InitialCSS;
}

/**
 * A constrained set of styling properties that should be set on the user interface before
 * it is displayed. Note `position` cannot be specified and should always be set to `fixed`.
 */
export interface InitialCSS {
  /**
   * The initial bottom property to apply to the iframe.
   */
  bottom?: string;
  /**
   * The initial height of the iframe.
   */
  height?: string;
  /**
   * The initial left property to apply to the iframe.
   */
  left?: string;
  /**
   * The maximum height to apply to the iframe.
   */
  maxHeight?: string;
  /**
   * The maximum with to apply to the iframe.
   */
  maxWidth?: string;
  /**
   * The initial right property to apply to the iframe.
   */
  right?: string;
  /**
   * The initial top property to apply to the iframe.
   */
  top?: string;
  /**
   * The transition property to apply to the iframe.
   */
  transition?: string;
  /**
   * The initial width of the iframe.
   */
  width?: string;
  /**
   * The initial zindex to apply to the iframe.
   */
  zIndex?: string;
  [property: string]: any;
}

/**
 * Identifies the type of the message to or from the user interface frame.
 */

/**
 * A message used to communicate with user interface frames injected by `getAgent()` for
 * displaying UI elements such as the intent resolver or channel selector. Used for messages
 * sent in either direction.
 */
export interface Fdc3UserInterfaceMessage {
  /**
   * The message payload.
   */
  payload?: { [key: string]: any };
  /**
   * Identifies the type of the message to or from the user interface frame.
   */
  type: Fdc3UserInterfaceMessageType;
}

/**
 * Identifies the type of the message to or from the user interface frame.
 */
export type Fdc3UserInterfaceMessageType =
  | 'Fdc3UserInterfaceHello'
  | 'Fdc3UserInterfaceHandshake'
  | 'Fdc3UserInterfaceRestyle'
  | 'Fdc3UserInterfaceDrag'
  | 'Fdc3UserInterfaceResolve'
  | 'Fdc3UserInterfaceResolveAction'
  | 'Fdc3UserInterfaceChannels'
  | 'Fdc3UserInterfaceChannelSelected';

/**
 * Setup message sent by the DA proxy code in getAgent() to an intent resolver UI with the
 * resolver data to setup the UI.
 *
 * A message used to communicate with user interface frames injected by `getAgent()` for
 * displaying UI elements such as the intent resolver or channel selector. Used for messages
 * sent in either direction.
 */
export interface Fdc3UserInterfaceResolve {
  /**
   * The message payload.
   */
  payload: Fdc3UserInterfaceResolvePayload;
  /**
   * Identifies the type of the message to or from the user interface frame.
   */
  type: 'Fdc3UserInterfaceResolve';
}

/**
 * The message payload.
 */
export interface Fdc3UserInterfaceResolvePayload {
  /**
   * An array of AppIntent objects defining the resolution options.
   */
  appIntents: AppIntent[];
  context: Context;
}

/**
 * An interface that relates an intent to apps.
 *
 * Used if a raiseIntent request requires additional resolution (e.g. by showing an intent
 * resolver) before it can be handled.
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
 * Identifies the type of the message to or from the user interface frame.
 */

/**
 * Message from an intent resolver UI to DA proxy code in getAgent() reporting a user
 * action.
 *
 * A message used to communicate with user interface frames injected by `getAgent()` for
 * displaying UI elements such as the intent resolver or channel selector. Used for messages
 * sent in either direction.
 */
export interface Fdc3UserInterfaceResolveAction {
  /**
   * The message payload.
   */
  payload: Fdc3UserInterfaceResolveActionPayload;
  /**
   * Identifies the type of the message to or from the user interface frame.
   */
  type: 'Fdc3UserInterfaceResolveAction';
}

/**
 * The message payload.
 */
export interface Fdc3UserInterfaceResolveActionPayload {
  action: Action;
  /**
   * The App resolution option chosen.
   */
  appIdentifier?: AppIdentifier;
  /**
   * The intent resolved.
   */
  intent?: string;
}

export type Action = 'hover' | 'click' | 'cancel';

/**
 * Identifies the type of the message to or from the user interface frame.
 */

/**
 * Message from a UI frame to the DA proxy code (setup by `getAgent()`) with updated styling
 * information to apply to it. Can be used to implement a pop-open or close interaction or
 * other transition needed by a UI implementation.
 *
 * A message used to communicate with user interface frames injected by `getAgent()` for
 * displaying UI elements such as the intent resolver or channel selector. Used for messages
 * sent in either direction.
 */
export interface Fdc3UserInterfaceRestyle {
  /**
   * The message payload.
   */
  payload: Fdc3UserInterfaceRestylePayload;
  /**
   * Identifies the type of the message to or from the user interface frame.
   */
  type: 'Fdc3UserInterfaceRestyle';
}

/**
 * The message payload.
 */
export interface Fdc3UserInterfaceRestylePayload {
  /**
   * A constrained set of styling properties that should be applied to the frame. Note
   * `position` cannot be set, and should always be `fixed`.
   */
  updatedCSS: UpdatedCSS;
}

/**
 * A constrained set of styling properties that should be applied to the frame. Note
 * `position` cannot be set, and should always be `fixed`.
 */
export interface UpdatedCSS {
  /**
   * The initial bottom property to apply to the iframe.
   */
  bottom?: string;
  /**
   * The updated height of the iframe.
   */
  height?: string;
  /**
   * The initial left property to apply to the iframe.
   */
  left?: string;
  /**
   * The updated maximum height to apply to the iframe.
   */
  maxHeight?: string;
  /**
   * The updated maximum with to apply to the iframe.
   */
  maxWidth?: string;
  /**
   * The initial right property to apply to the iframe.
   */
  right?: string;
  /**
   * The initial top property to apply to the iframe.
   */
  top?: string;
  /**
   * The updated transition property to apply to the iframe.
   */
  transition?: string;
  /**
   * The updated width of the iframe.
   */
  width?: string;
  /**
   * The updated zIndex to apply to the iframe.
   */
  zIndex?: string;
  [property: string]: any;
}

/**
 * Identifies the type of the message to or from the user interface frame.
 */

/**
 * A request for details of instances of a particular app.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface FindInstancesRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: FindInstancesRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'findInstancesRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface FindInstancesRequestPayload {
  app: AppIdentifier;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a findInstances request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface FindInstancesResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: FindInstancesResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'findInstancesResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 *
 * The message payload contains a flag indicating whether the API call was successful, plus
 * any return values for the FDC3 API function called, or indicating that the request
 * resulted in an error and including a standardized error message.
 */
export interface FindInstancesResponsePayload {
  error?: FindInstancesErrors;
  appIdentifiers?: AppMetadata[];
}

/**
 * Constants representing the errors that can be encountered when calling the `open` method
 * on the DesktopAgent object (`fdc3`).
 *
 * Constants representing the errors that can be encountered when calling the
 * `addIntentListener`, `findIntent`, `findIntentsByContext`, `raiseIntent` or
 * `raiseIntentForContext` methods on the DesktopAgent (`fdc3`).
 *
 * Unique identifier for a for an attempt to connect to a Desktop Agent. A Unique UUID
 * should be used in the first (WCP1Hello) message and should be quoted in all subsequent
 * messages to link them to the same connection attempt.
 *
 * Unique identifier for a request or event message. Required in all message types.
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 *
 * Unique identifier for a `listener` object returned by a Desktop Agent to an app in
 * response to addContextListener, addIntentListener or one of the PrivateChannel event
 * listeners and used to identify it in messages (e.g. when unsubscribing).
 *
 * Unique identifier for an event message sent from a Desktop Agent to an app.
 *
 * Should be set if the raiseIntent request returned an error.
 */
export type FindInstancesErrors =
  | 'MalformedContext'
  | 'ApiTimeout'
  | 'InvalidArguments'
  | 'DesktopAgentNotFound'
  | 'ResolverUnavailable'
  | 'IntentDeliveryFailed'
  | 'NoAppsFound'
  | 'ResolverTimeout'
  | 'TargetAppUnavailable'
  | 'TargetInstanceUnavailable'
  | 'UserCancelledResolution'
  | 'IntentListenerConflict'
  | 'AgentDisconnected'
  | 'NotConnectedToBridge'
  | 'ResponseToBridgeTimedOut'
  | 'MalformedMessage';

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request for details of apps available to resolve a particular intent and context pair.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface FindIntentRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: FindIntentRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'findIntentRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface FindIntentRequestPayload {
  context?: Context;
  intent: string;
  resultType?: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a findIntent request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface FindIntentResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: FindIntentResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'findIntentResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface FindIntentResponsePayload {
  error?: FindInstancesErrors;
  appIntent?: AppIntent;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request for details of intents and apps available to resolve them for a particular
 * context.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface FindIntentsByContextRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: FindIntentsByContextRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'findIntentsByContextRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface FindIntentsByContextRequestPayload {
  context: Context;
  resultType?: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a findIntentsByContext request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface FindIntentsByContextResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: FindIntentsByContextResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'findIntentsByContextResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface FindIntentsByContextResponsePayload {
  error?: FindInstancesErrors;
  appIntents?: AppIntent[];
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request for metadata about an app.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface GetAppMetadataRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: GetAppMetadataRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'getAppMetadataRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface GetAppMetadataRequestPayload {
  app: AppIdentifier;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a getAppMetadata request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface GetAppMetadataResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: GetAppMetadataResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'getAppMetadataResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface GetAppMetadataResponsePayload {
  error?: FindInstancesErrors;
  appMetadata?: AppMetadata;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request to return the Channel object for the current User channel membership. Returns
 * `null` if the app is not joined to a channel.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface GetCurrentChannelRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: GetCurrentChannelRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'getCurrentChannelRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface GetCurrentChannelRequestPayload {}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a getCurrentChannel request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface GetCurrentChannelResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: GetCurrentChannelResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'getCurrentChannelResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface GetCurrentChannelResponsePayload {
  error?: ResponsePayloadError;
  channel?: Channel | null;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request to return the current context (either of a specified type or most recent
 * broadcast) of a specified Channel. Returns `null` if no context (of the requested type if
 * one was specified) is available in the channel.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface GetCurrentContextRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: GetCurrentContextRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'getCurrentContextRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface GetCurrentContextRequestPayload {
  /**
   * The id of the channel to return the current context of.
   */
  channelId: string;
  /**
   * The type of context to return for OR `null` indicating that the most recently broadcast
   * context on the channel should be returned.
   */
  contextType: null | string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a getCurrentContext request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface GetCurrentContextResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: GetCurrentContextResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'getCurrentContextResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 *
 * The response payload for a getCurrentContext request. The `context` and `metadata` fields
 * are coupled: when `context` is a non-null context object, `metadata` MUST be present and
 * contain the complete `ContextMetadata` associated with that context (so that
 * `getCurrentContextWithMetadata()` never needs fabricated metadata); when `context` is
 * `null`, `metadata` MUST also be `null`.
 */
export interface GetCurrentContextResponsePayload {
  error?: PurpleError;
  /**
   * The most recently broadcast context object (of the specified type, if one was specified),
   * or `null` if none was available in the channel.
   */
  context?: null | Context;
  /**
   * The `ContextMetadata` associated with the returned context. When `context` is non-null
   * this MUST be present and complete, carrying the provenance (`source`, `timestamp` and any
   * app-provided fields such as `traceId`, `signature`, `antiReplay` and `custom`) retained
   * for that context by the Desktop Agent. When `context` is `null` this MUST be `null`. It
   * is used by `getCurrentContextWithMetadata()` to return both the context and its metadata;
   * `getCurrentContext()` uses the same response but ignores this field.
   */
  metadata?: ContextMetadata | null;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * Request to retrieve information about the FDC3 Desktop Agent implementation and the
 * metadata of the calling application according to the Desktop Agent.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface GetInfoRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: GetInfoRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'getInfoRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface GetInfoRequestPayload {}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a getInfo request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface GetInfoResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: GetInfoResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'getInfoResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface GetInfoResponsePayload {
  error?: ResponsePayloadError;
  implementationMetadata?: ImplementationMetadata;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * Request to return a Channel with an auto-generated identity that is intended for private
 * communication between applications.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface GetOrCreateChannelRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: GetOrCreateChannelRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'getOrCreateChannelRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface GetOrCreateChannelRequestPayload {
  /**
   * The id of the channel to return
   */
  channelId: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a getOrCreateChannel request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface GetOrCreateChannelResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: GetOrCreateChannelResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'getOrCreateChannelResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface GetOrCreateChannelResponsePayload {
  error?: PurpleError;
  channel?: Channel;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * Request to retrieve a list of the User Channels available for the app to join.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface GetUserChannelsRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: GetUserChannelsRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'getUserChannelsRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface GetUserChannelsRequestPayload {}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a getUserChannels request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface GetUserChannelsResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: GetUserChannelsResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'getUserChannelsResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface GetUserChannelsResponsePayload {
  error?: PurpleError;
  userChannels?: Channel[];
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request that serves as an acknowledgement of a heartbeat event from the Desktop Agent
 * and indicates that an application window or frame is still alive.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface HeartbeatAcknowledgementRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: HeartbeatAcknowledgementRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'heartbeatAcknowledgementRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface HeartbeatAcknowledgementRequestPayload {
  /**
   * The eventUuid value of the HeartbeatEvent that the acknowledgement being sent relates to.
   */
  heartbeatEventUuid: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A heartbeat message from the Desktop Agent to an app indicating that the Desktop Agent is
 * alive and that the application should send a heartbeatResponseRequest to the agent in
 * response.
 *
 * A message from a Desktop Agent to an FDC3-enabled app representing an event.
 */
export interface HeartbeatEvent {
  /**
   * Metadata for messages sent by a Desktop Agent to an app notifying it of an event.
   */
  meta: BroadcastEventMeta;
  /**
   * The message payload contains details of the event that the app is being notified about.
   */
  payload: HeartbeatEventPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'heartbeatEvent';
}

/**
 * The message payload contains details of the event that the app is being notified about.
 */
export interface HeartbeatEventPayload {}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * An event message from the Desktop Agent to an app indicating that it has been selected to
 * resolve a raised intent and context.
 *
 * A message from a Desktop Agent to an FDC3-enabled app representing an event.
 */
export interface IntentEvent {
  /**
   * Metadata for messages sent by a Desktop Agent to an app notifying it of an event.
   */
  meta: BroadcastEventMeta;
  /**
   * The message payload contains details of the event that the app is being notified about.
   */
  payload: IntentEventPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'intentEvent';
}

/**
 * The message payload contains details of the event that the app is being notified about.
 */
export interface IntentEventPayload {
  /**
   * The context object passed with the raised intent.
   */
  context: Context;
  /**
   * The intent that was raised.
   */
  intent: string;
  metadata: ContextMetadata;
  /**
   * The requestUuid value of the raiseIntentRequest that the intentEvent being sent relates
   * to.
   */
  raiseIntentRequestUuid: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request to unsubscribe a context listener.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface IntentListenerUnsubscribeRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: IntentListenerUnsubscribeRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'intentListenerUnsubscribeRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface IntentListenerUnsubscribeRequestPayload {
  listenerUUID: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a intentListenerUnsubscribe request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface IntentListenerUnsubscribeResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: BroadcastResponseResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'intentListenerUnsubscribeResponse';
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request to deliver a result for an intent (which may include a `void` result that just
 * indicates that the handler has run, returning no result). The result is tied to the
 * intentEvent it relates to by quoting the `eventUuid` of the intentEvent in its payload.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface IntentResultRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: IntentResultRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'intentResultRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface IntentResultRequestPayload {
  /**
   * The eventUuid value of the intentEvent that the result being sent relates to.
   */
  intentEventUuid: string;
  intentResult: IntentResult;
  /**
   * Optional app-provided metadata returned by the intent handler alongside a context result
   * (i.e. when the handler returns a ContextWithMetadata object). The Desktop Agent will
   * merge this with its own generated metadata before delivering to the raising app via
   * raiseIntentResultResponse.
   */
  metadata?: AppProvidableContextMetadata;
  /**
   * The requestUuid value of the raiseIntentRequest that the result being sent relates to.
   */
  raiseIntentRequestUuid: string;
}

export interface IntentResult {
  context?: Context;
  channel?: Channel;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a request to deliver an intent result.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface IntentResultResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: BroadcastResponseResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'intentResultResponse';
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * Request to join the app to the specified User channel. On successfully joining a channel,
 * client code should make subsequent requests to get the current context of that channel
 * for all registered context listeners and then call their handlers with it.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface JoinUserChannelRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: JoinUserChannelRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'joinUserChannelRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface JoinUserChannelRequestPayload {
  /**
   * The id of the channel to join.
   */
  channelId: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a joinUserChannel request. On receipt of this response, client code should
 * make subsequent requests to get the current context of that channel for all registered
 * context listeners and then call their handlers with it.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface JoinUserChannelResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: JoinUserChannelResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'joinUserChannelResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface JoinUserChannelResponsePayload {
  error?: PurpleError;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * Request to remove the app from any User channel membership.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface LeaveCurrentChannelRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: LeaveCurrentChannelRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'leaveCurrentChannelRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface LeaveCurrentChannelRequestPayload {}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a leaveCurrentChannel request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface LeaveCurrentChannelResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: LeaveCurrentChannelResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'leaveCurrentChannelResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface LeaveCurrentChannelResponsePayload {
  error?: PurpleError;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request to open an application.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface OpenRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: OpenRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'openRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface OpenRequestPayload {
  app: AppIdentifier;
  /**
   * If a Context object is passed in, this object will be provided to the opened application
   * via a contextListener. The Context argument is functionally equivalent to opening the
   * target app with no context and broadcasting the context directly to it.
   */
  context?: Context;
  /**
   * Optional metadata supplied by the calling app (`traceId`, `signature`, `antiReplay` and
   * `custom`) to accompany any `context` delivered to the opened app. This field carries only
   * the app-provided portion of the metadata; the Desktop Agent adds its own `source` and
   * `timestamp` before delivering the enriched `ContextMetadata`. It MUST be omitted when the
   * app did not supply a metadata argument to `open()`.
   */
  metadata?: AppProvidableContextMetadata;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a open request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface OpenResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: OpenResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'openResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface OpenResponsePayload {
  error?: OpenErrorResponsePayload;
  appIdentifier?: AppIdentifier;
}

/**
 * Constants representing the errors that can be encountered when calling the `open` method
 * on the DesktopAgent object (`fdc3`).
 *
 * Constants representing the errors that can be encountered when calling the
 * `addIntentListener`, `findIntent`, `findIntentsByContext`, `raiseIntent` or
 * `raiseIntentForContext` methods on the DesktopAgent (`fdc3`).
 */
export type OpenErrorResponsePayload =
  | 'MalformedContext'
  | 'ApiTimeout'
  | 'InvalidArguments'
  | 'AppNotFound'
  | 'AppTimeout'
  | 'DesktopAgentNotFound'
  | 'ErrorOnLaunch'
  | 'ResolverUnavailable'
  | 'AgentDisconnected'
  | 'NotConnectedToBridge'
  | 'ResponseToBridgeTimedOut'
  | 'MalformedMessage';

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request to add an event listener to a specific PrivateChannel.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface PrivateChannelAddEventListenerRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: PrivateChannelAddEventListenerRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'privateChannelAddEventListenerRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface PrivateChannelAddEventListenerRequestPayload {
  /**
   * The type of PrivateChannel event that the listener should be applied to, or null for all
   * event types.
   */
  listenerType: PrivateChannelEventType | null;
  /**
   * The Id of the PrivateChannel that the listener should be added to.
   */
  privateChannelId: string;
}

/**
 * Type defining valid type strings for Private Channel events.
 */
export type PrivateChannelEventType = 'addContextListener' | 'unsubscribe' | 'disconnect';

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a privateChannelAddEventListener request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface PrivateChannelAddEventListenerResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: PrivateChannelAddEventListenerResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'privateChannelAddEventListenerResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface PrivateChannelAddEventListenerResponsePayload {
  error?: PurpleError;
  listenerUUID?: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * Request that indicates that a participant will no longer interact with a specified
 * `PrivateChannel`.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface PrivateChannelDisconnectRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: PrivateChannelDisconnectRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'privateChannelDisconnectRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface PrivateChannelDisconnectRequestPayload {
  /**
   * The Id of the Channel that should be disconnected from
   */
  channelId: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a privateChannelDisconnect request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface PrivateChannelDisconnectResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: PrivateChannelDisconnectResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'privateChannelDisconnectResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface PrivateChannelDisconnectResponsePayload {
  error?: PurpleError;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * An event message from the Desktop Agent to an app indicating that another app has added a
 * context listener to a specific PrivateChannel.
 *
 * A message from a Desktop Agent to an FDC3-enabled app representing an event.
 */
export interface PrivateChannelOnAddContextListenerEvent {
  /**
   * Metadata for messages sent by a Desktop Agent to an app notifying it of an event.
   */
  meta: BroadcastEventMeta;
  /**
   * The message payload contains details of the event that the app is being notified about.
   */
  payload: PrivateChannelOnAddContextListenerEventPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'privateChannelOnAddContextListenerEvent';
}

/**
 * The message payload contains details of the event that the app is being notified about.
 */
export interface PrivateChannelOnAddContextListenerEventPayload {
  /**
   * The type of the context listener added to the channel by another app, or null if it will
   * listen to all types.
   */
  contextType?: null | string;
  /**
   * Array of context types the listener was added for.
   */
  contextTypes?: string[];
  /**
   * The Id of the PrivateChannel that the listener was added to.
   */
  privateChannelId: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * An event message from the Desktop Agent to an app indicating that another app has
 * disconnected from a specific PrivateChannel and will no longer interact with it.
 *
 * A message from a Desktop Agent to an FDC3-enabled app representing an event.
 */
export interface PrivateChannelOnDisconnectEvent {
  /**
   * Metadata for messages sent by a Desktop Agent to an app notifying it of an event.
   */
  meta: BroadcastEventMeta;
  /**
   * The message payload contains details of the event that the app is being notified about.
   */
  payload: PrivateChannelOnDisconnectEventPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'privateChannelOnDisconnectEvent';
}

/**
 * The message payload contains details of the event that the app is being notified about.
 */
export interface PrivateChannelOnDisconnectEventPayload {
  /**
   * The Id of the PrivateChannel that the app has disconnected from.
   */
  privateChannelId: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * An event message from the Desktop Agent to an app indicating that another app has
 * unsubscribed a context listener from a specific PrivateChannel.
 *
 * A message from a Desktop Agent to an FDC3-enabled app representing an event.
 */
export interface PrivateChannelOnUnsubscribeEvent {
  /**
   * Metadata for messages sent by a Desktop Agent to an app notifying it of an event.
   */
  meta: BroadcastEventMeta;
  /**
   * The message payload contains details of the event that the app is being notified about.
   */
  payload: PrivateChannelOnUnsubscribeEventPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'privateChannelOnUnsubscribeEvent';
}

/**
 * The message payload contains details of the event that the app is being notified about.
 */
export interface PrivateChannelOnUnsubscribeEventPayload {
  /**
   * The type of the context listener unsubscribed from the channel by another app, or null if
   * it was listening to all types.
   */
  contextType?: null | string;
  /**
   * Array of context types the listener was unsubscribed for.
   */
  contextTypes?: string[];
  /**
   * The Id of the PrivateChannel that the listener was unsubscribed from.
   */
  privateChannelId: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request to unsubscribe a context listener.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface PrivateChannelUnsubscribeEventListenerRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: PrivateChannelUnsubscribeEventListenerRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'privateChannelUnsubscribeEventListenerRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface PrivateChannelUnsubscribeEventListenerRequestPayload {
  listenerUUID: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a privateChannelUnsubscribeEventListener request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface PrivateChannelUnsubscribeEventListenerResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: BroadcastResponseResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'privateChannelUnsubscribeEventListenerResponse';
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request to raise an unspecified intent for a specified context.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface RaiseIntentForContextRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: RaiseIntentForContextRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'raiseIntentForContextRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface RaiseIntentForContextRequestPayload {
  app?: AppIdentifier;
  context: Context;
  /**
   * Optional metadata supplied by the calling app (`traceId`, `signature`, `antiReplay` and
   * `custom`) to accompany the `context`. This field carries only the app-provided portion of
   * the metadata; the Desktop Agent adds its own `source` and `timestamp` before delivering
   * the enriched `ContextMetadata`. It MUST be omitted when the app did not supply a metadata
   * argument to `raiseIntentForContext()`.
   */
  metadata?: AppProvidableContextMetadata;
  /**
   * Indicates how an instance of the target application should be selected. When `true`, a
   * new instance of the target application MUST be launched even if existing instances are
   * available. When `false`, an existing instance MUST be used and a new instance MUST NOT be
   * launched (if no suitable instance is available the request fails with
   * TargetInstanceUnavailable). When omitted, the Desktop Agent applies its default
   * resolution behavior.
   */
  newInstance?: boolean;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a raiseIntentForContext request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface RaiseIntentForContextResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   *
   * There are 3 possible responses to a raiseIntentForContext request, each of which sets a
   * single property in the payload: Success (`intentResolution`), Needs further resolution
   * (`appIntents`) or Error (`error`).
   */
  payload: RaiseIntentForContextResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'raiseIntentForContextResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 *
 * There are 3 possible responses to a raiseIntentForContext request, each of which sets a
 * single property in the payload: Success (`intentResolution`), Needs further resolution
 * (`appIntents`) or Error (`error`).
 *
 * Response to a raiseIntentForContext request that needs additional resolution (i.e. show
 * an intent resolver UI).
 *
 * Used if a raiseIntent request resulted in an error.
 */
export interface RaiseIntentForContextResponsePayload {
  /**
   * Should be set if the raiseIntent request returned an error.
   */
  error?: FindInstancesErrors;
  /**
   * Used if the raiseIntent request was successfully resolved.
   */
  intentResolution?: IntentResolution;
  /**
   * Used if a raiseIntentForContext request requires additional resolution (e.g. by showing
   * an intent resolver) before it can be handled.
   */
  appIntents?: AppIntent[];
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
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A request to raise an intent for a context.
 *
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface RaiseIntentRequest {
  /**
   * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
   */
  meta: AddContextListenerRequestMeta;
  /**
   * The message payload typically contains the arguments to FDC3 API functions.
   */
  payload: RaiseIntentRequestPayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Request' appended.
   */
  type: 'raiseIntentRequest';
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface RaiseIntentRequestPayload {
  app?: AppIdentifier;
  context: Context;
  intent: string;
  /**
   * Optional metadata supplied by the calling app (`traceId`, `signature`, `antiReplay` and
   * `custom`) to accompany the raised intent's `context`. This field carries only the
   * app-provided portion of the metadata; the Desktop Agent adds its own `source` and
   * `timestamp` before delivering the enriched `ContextMetadata`. It MUST be omitted when the
   * app did not supply a metadata argument to `raiseIntent()`.
   */
  metadata?: AppProvidableContextMetadata;
  /**
   * Indicates how an instance of the target application should be selected. When `true`, a
   * new instance of the target application MUST be launched even if existing instances are
   * available. When `false`, an existing instance MUST be used and a new instance MUST NOT be
   * launched (if no suitable instance is available the request fails with
   * TargetInstanceUnavailable). When omitted, the Desktop Agent applies its default
   * resolution behavior.
   */
  newInstance?: boolean;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a raiseIntent request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface RaiseIntentResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   *
   * There are 3 possible responses to a raiseIntent request, each of which sets a single
   * property in the payload: Success (`intentResolution`), Needs further resolution
   * (`appIntent`) or Error (`error`).
   */
  payload: RaiseIntentResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'raiseIntentResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 *
 * There are 3 possible responses to a raiseIntent request, each of which sets a single
 * property in the payload: Success (`intentResolution`), Needs further resolution
 * (`appIntent`) or Error (`error`).
 *
 * Response to a raiseIntent request that needs additional resolution (i.e. show an intent
 * resolver UI).
 *
 * Used if a raiseIntent request resulted in an error.
 */
export interface RaiseIntentResponsePayload {
  /**
   * Should be set if the raiseIntent request returned an error.
   */
  error?: FindInstancesErrors;
  /**
   * Used if the raiseIntent request was successfully resolved.
   */
  intentResolution?: IntentResolution;
  /**
   * Used if a raiseIntent request requires additional resolution (e.g. by showing an intent
   * resolver) before it can be handled.
   */
  appIntent?: AppIntent;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A secondary response to a request to raise an intent used to deliver the intent result.
 * This message should quote the original requestUuid of the raiseIntentRequest message in
 * its `meta.requestUuid` field.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface RaiseIntentResultResponse {
  /**
   * Metadata for messages sent by a Desktop Agent to an app in response to an API call.
   */
  meta: AddContextListenerResponseMeta;
  /**
   * A payload for a response to an API call that will contain any return values or an `error`
   * property containing a standardized error message indicating that the request was
   * unsuccessful.
   */
  payload: RaiseIntentResultResponsePayload;
  /**
   * Identifies the type of the message and it is typically set to the FDC3 function name that
   * the message relates to, e.g. 'findIntent', with 'Response' appended.
   */
  type: 'raiseIntentResultResponse';
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface RaiseIntentResultResponsePayload {
  error?: ResponsePayloadError;
  intentResult?: IntentResult;
  /**
   * Metadata for the intent result, generated by the Desktop Agent and merged with any
   * app-provided metadata from the intentResultRequest. Always present, even for void or
   * channel results.
   */
  resultMetadata?: ContextMetadata;
}

export type AppRequestMessage =
  | AddContextListenerRequest
  | AddEventListenerRequest
  | AddIntentListenerRequest
  | BroadcastRequest
  | ClearContextRequest
  | CloseRequest
  | ContextListenerUnsubscribeRequest
  | CreatePrivateChannelRequest
  | EventListenerUnsubscribeRequest
  | FindInstancesRequest
  | FindIntentRequest
  | FindIntentsByContextRequest
  | GetAppMetadataRequest
  | GetCurrentChannelRequest
  | GetCurrentContextRequest
  | GetInfoRequest
  | GetOrCreateChannelRequest
  | GetUserChannelsRequest
  | HeartbeatAcknowledgementRequest
  | IntentListenerUnsubscribeRequest
  | IntentResultRequest
  | JoinUserChannelRequest
  | LeaveCurrentChannelRequest
  | OpenRequest
  | PrivateChannelAddEventListenerRequest
  | PrivateChannelDisconnectRequest
  | PrivateChannelUnsubscribeEventListenerRequest
  | RaiseIntentForContextRequest
  | RaiseIntentRequest;

export type AgentResponseMessage =
  | AddContextListenerResponse
  | AddEventListenerResponse
  | AddIntentListenerResponse
  | BroadcastResponse
  | ClearContextResponse
  | CloseResponse
  | ContextListenerUnsubscribeResponse
  | CreatePrivateChannelResponse
  | EventListenerUnsubscribeResponse
  | FindInstancesResponse
  | FindIntentResponse
  | FindIntentsByContextResponse
  | GetAppMetadataResponse
  | GetCurrentChannelResponse
  | GetCurrentContextResponse
  | GetInfoResponse
  | GetOrCreateChannelResponse
  | GetUserChannelsResponse
  | IntentListenerUnsubscribeResponse
  | IntentResultResponse
  | JoinUserChannelResponse
  | LeaveCurrentChannelResponse
  | OpenResponse
  | PrivateChannelAddEventListenerResponse
  | PrivateChannelDisconnectResponse
  | PrivateChannelUnsubscribeEventListenerResponse
  | RaiseIntentForContextResponse
  | RaiseIntentResponse
  | RaiseIntentResultResponse;

export type AgentEventMessage =
  | BroadcastEvent
  | ChannelChangedEvent
  | ContextClearedEvent
  | HeartbeatEvent
  | IntentEvent
  | PrivateChannelOnAddContextListenerEvent
  | PrivateChannelOnDisconnectEvent
  | PrivateChannelOnUnsubscribeEvent;

/**
 * Returns true if the value has a type property with value 'WCP1Hello'. This is a fast check that does not check the format of the message
 */
export function isWebConnectionProtocol1Hello(value: any): value is WebConnectionProtocol1Hello {
  return value != null && value.type === 'WCP1Hello';
}

export const WEB_CONNECTION_PROTOCOL1_HELLO_TYPE = 'WebConnectionProtocol1Hello';

/**
 * Returns true if the value has a type property with value 'WCP2LoadUrl'. This is a fast check that does not check the format of the message
 */
export function isWebConnectionProtocol2LoadURL(value: any): value is WebConnectionProtocol2LoadURL {
  return value != null && value.type === 'WCP2LoadUrl';
}

export const WEB_CONNECTION_PROTOCOL2_LOAD_U_R_L_TYPE = 'WebConnectionProtocol2LoadURL';

/**
 * Returns true if the value has a type property with value 'WCP3Handshake'. This is a fast check that does not check the format of the message
 */
export function isWebConnectionProtocol3Handshake(value: any): value is WebConnectionProtocol3Handshake {
  return value != null && value.type === 'WCP3Handshake';
}

export const WEB_CONNECTION_PROTOCOL3_HANDSHAKE_TYPE = 'WebConnectionProtocol3Handshake';

/**
 * Returns true if the value has a type property with value 'WCP4ValidateAppIdentity'. This is a fast check that does not check the format of the message
 */
export function isWebConnectionProtocol4ValidateAppIdentity(
  value: any
): value is WebConnectionProtocol4ValidateAppIdentity {
  return value != null && value.type === 'WCP4ValidateAppIdentity';
}

export const WEB_CONNECTION_PROTOCOL4_VALIDATE_APP_IDENTITY_TYPE = 'WebConnectionProtocol4ValidateAppIdentity';

/**
 * Returns true if the value has a type property with value 'WCP5ValidateAppIdentityFailedResponse'. This is a fast check that does not check the format of the message
 */
export function isWebConnectionProtocol5ValidateAppIdentityFailedResponse(
  value: any
): value is WebConnectionProtocol5ValidateAppIdentityFailedResponse {
  return value != null && value.type === 'WCP5ValidateAppIdentityFailedResponse';
}

export const WEB_CONNECTION_PROTOCOL5_VALIDATE_APP_IDENTITY_FAILED_RESPONSE_TYPE =
  'WebConnectionProtocol5ValidateAppIdentityFailedResponse';

/**
 * Returns true if the value has a type property with value 'WCP5ValidateAppIdentityResponse'. This is a fast check that does not check the format of the message
 */
export function isWebConnectionProtocol5ValidateAppIdentitySuccessResponse(
  value: any
): value is WebConnectionProtocol5ValidateAppIdentitySuccessResponse {
  return value != null && value.type === 'WCP5ValidateAppIdentityResponse';
}

export const WEB_CONNECTION_PROTOCOL5_VALIDATE_APP_IDENTITY_SUCCESS_RESPONSE_TYPE =
  'WebConnectionProtocol5ValidateAppIdentitySuccessResponse';

/**
 * Returns true if the value has a type property with value 'WCP6Goodbye'. This is a fast check that does not check the format of the message
 */
export function isWebConnectionProtocol6Goodbye(value: any): value is WebConnectionProtocol6Goodbye {
  return value != null && value.type === 'WCP6Goodbye';
}

export const WEB_CONNECTION_PROTOCOL6_GOODBYE_TYPE = 'WebConnectionProtocol6Goodbye';

export const WEB_CONNECTION_PROTOCOL_MESSAGE_TYPE = 'WebConnectionProtocolMessage';

/**
 * Returns true if the value has a type property with value 'addContextListenerRequest'. This is a fast check that does not check the format of the message
 */
export function isAddContextListenerRequest(value: any): value is AddContextListenerRequest {
  return value != null && value.type === 'addContextListenerRequest';
}

export const ADD_CONTEXT_LISTENER_REQUEST_TYPE = 'AddContextListenerRequest';

/**
 * Returns true if the value has a type property with value 'addContextListenerResponse'. This is a fast check that does not check the format of the message
 */
export function isAddContextListenerResponse(value: any): value is AddContextListenerResponse {
  return value != null && value.type === 'addContextListenerResponse';
}

export const ADD_CONTEXT_LISTENER_RESPONSE_TYPE = 'AddContextListenerResponse';

/**
 * Returns true if the value has a type property with value 'addEventListenerRequest'. This is a fast check that does not check the format of the message
 */
export function isAddEventListenerRequest(value: any): value is AddEventListenerRequest {
  return value != null && value.type === 'addEventListenerRequest';
}

export const ADD_EVENT_LISTENER_REQUEST_TYPE = 'AddEventListenerRequest';

/**
 * Returns true if the value has a type property with value 'addEventListenerResponse'. This is a fast check that does not check the format of the message
 */
export function isAddEventListenerResponse(value: any): value is AddEventListenerResponse {
  return value != null && value.type === 'addEventListenerResponse';
}

export const ADD_EVENT_LISTENER_RESPONSE_TYPE = 'AddEventListenerResponse';

/**
 * Returns true if the value has a type property with value 'addIntentListenerRequest'. This is a fast check that does not check the format of the message
 */
export function isAddIntentListenerRequest(value: any): value is AddIntentListenerRequest {
  return value != null && value.type === 'addIntentListenerRequest';
}

export const ADD_INTENT_LISTENER_REQUEST_TYPE = 'AddIntentListenerRequest';

/**
 * Returns true if the value has a type property with value 'addIntentListenerResponse'. This is a fast check that does not check the format of the message
 */
export function isAddIntentListenerResponse(value: any): value is AddIntentListenerResponse {
  return value != null && value.type === 'addIntentListenerResponse';
}

export const ADD_INTENT_LISTENER_RESPONSE_TYPE = 'AddIntentListenerResponse';

/**
 * Returns true if the value has a type property with value 'broadcastEvent'. This is a fast check that does not check the format of the message
 */
export function isBroadcastEvent(value: any): value is BroadcastEvent {
  return value != null && value.type === 'broadcastEvent';
}

export const BROADCAST_EVENT_TYPE = 'BroadcastEvent';

/**
 * Returns true if the value has a type property with value 'broadcastRequest'. This is a fast check that does not check the format of the message
 */
export function isBroadcastRequest(value: any): value is BroadcastRequest {
  return value != null && value.type === 'broadcastRequest';
}

export const BROADCAST_REQUEST_TYPE = 'BroadcastRequest';

/**
 * Returns true if the value has a type property with value 'broadcastResponse'. This is a fast check that does not check the format of the message
 */
export function isBroadcastResponse(value: any): value is BroadcastResponse {
  return value != null && value.type === 'broadcastResponse';
}

export const BROADCAST_RESPONSE_TYPE = 'BroadcastResponse';

/**
 * Returns true if the value has a type property with value 'channelChangedEvent'. This is a fast check that does not check the format of the message
 */
export function isChannelChangedEvent(value: any): value is ChannelChangedEvent {
  return value != null && value.type === 'channelChangedEvent';
}

export const CHANNEL_CHANGED_EVENT_TYPE = 'ChannelChangedEvent';

/**
 * Returns true if the value has a type property with value 'clearContextRequest'. This is a fast check that does not check the format of the message
 */
export function isClearContextRequest(value: any): value is ClearContextRequest {
  return value != null && value.type === 'clearContextRequest';
}

export const CLEAR_CONTEXT_REQUEST_TYPE = 'ClearContextRequest';

/**
 * Returns true if the value has a type property with value 'clearContextResponse'. This is a fast check that does not check the format of the message
 */
export function isClearContextResponse(value: any): value is ClearContextResponse {
  return value != null && value.type === 'clearContextResponse';
}

export const CLEAR_CONTEXT_RESPONSE_TYPE = 'ClearContextResponse';

/**
 * Returns true if the value has a type property with value 'closeRequest'. This is a fast check that does not check the format of the message
 */
export function isCloseRequest(value: any): value is CloseRequest {
  return value != null && value.type === 'closeRequest';
}

export const CLOSE_REQUEST_TYPE = 'CloseRequest';

/**
 * Returns true if the value has a type property with value 'closeResponse'. This is a fast check that does not check the format of the message
 */
export function isCloseResponse(value: any): value is CloseResponse {
  return value != null && value.type === 'closeResponse';
}

export const CLOSE_RESPONSE_TYPE = 'CloseResponse';

/**
 * Returns true if the value has a type property with value 'contextClearedEvent'. This is a fast check that does not check the format of the message
 */
export function isContextClearedEvent(value: any): value is ContextClearedEvent {
  return value != null && value.type === 'contextClearedEvent';
}

export const CONTEXT_CLEARED_EVENT_TYPE = 'ContextClearedEvent';

/**
 * Returns true if the value has a type property with value 'contextListenerUnsubscribeRequest'. This is a fast check that does not check the format of the message
 */
export function isContextListenerUnsubscribeRequest(value: any): value is ContextListenerUnsubscribeRequest {
  return value != null && value.type === 'contextListenerUnsubscribeRequest';
}

export const CONTEXT_LISTENER_UNSUBSCRIBE_REQUEST_TYPE = 'ContextListenerUnsubscribeRequest';

/**
 * Returns true if the value has a type property with value 'contextListenerUnsubscribeResponse'. This is a fast check that does not check the format of the message
 */
export function isContextListenerUnsubscribeResponse(value: any): value is ContextListenerUnsubscribeResponse {
  return value != null && value.type === 'contextListenerUnsubscribeResponse';
}

export const CONTEXT_LISTENER_UNSUBSCRIBE_RESPONSE_TYPE = 'ContextListenerUnsubscribeResponse';

/**
 * Returns true if the value has a type property with value 'createPrivateChannelRequest'. This is a fast check that does not check the format of the message
 */
export function isCreatePrivateChannelRequest(value: any): value is CreatePrivateChannelRequest {
  return value != null && value.type === 'createPrivateChannelRequest';
}

export const CREATE_PRIVATE_CHANNEL_REQUEST_TYPE = 'CreatePrivateChannelRequest';

/**
 * Returns true if the value has a type property with value 'createPrivateChannelResponse'. This is a fast check that does not check the format of the message
 */
export function isCreatePrivateChannelResponse(value: any): value is CreatePrivateChannelResponse {
  return value != null && value.type === 'createPrivateChannelResponse';
}

export const CREATE_PRIVATE_CHANNEL_RESPONSE_TYPE = 'CreatePrivateChannelResponse';

/**
 * Returns true if the value has a type property with value 'eventListenerUnsubscribeRequest'. This is a fast check that does not check the format of the message
 */
export function isEventListenerUnsubscribeRequest(value: any): value is EventListenerUnsubscribeRequest {
  return value != null && value.type === 'eventListenerUnsubscribeRequest';
}

export const EVENT_LISTENER_UNSUBSCRIBE_REQUEST_TYPE = 'EventListenerUnsubscribeRequest';

/**
 * Returns true if the value has a type property with value 'eventListenerUnsubscribeResponse'. This is a fast check that does not check the format of the message
 */
export function isEventListenerUnsubscribeResponse(value: any): value is EventListenerUnsubscribeResponse {
  return value != null && value.type === 'eventListenerUnsubscribeResponse';
}

export const EVENT_LISTENER_UNSUBSCRIBE_RESPONSE_TYPE = 'EventListenerUnsubscribeResponse';

/**
 * Returns true if the value has a type property with value 'Fdc3UserInterfaceChannelSelected'. This is a fast check that does not check the format of the message
 */
export function isFdc3UserInterfaceChannelSelected(value: any): value is Fdc3UserInterfaceChannelSelected {
  return value != null && value.type === 'Fdc3UserInterfaceChannelSelected';
}

export const FDC3_USER_INTERFACE_CHANNEL_SELECTED_TYPE = 'Fdc3UserInterfaceChannelSelected';

/**
 * Returns true if the value has a type property with value 'Fdc3UserInterfaceChannels'. This is a fast check that does not check the format of the message
 */
export function isFdc3UserInterfaceChannels(value: any): value is Fdc3UserInterfaceChannels {
  return value != null && value.type === 'Fdc3UserInterfaceChannels';
}

export const FDC3_USER_INTERFACE_CHANNELS_TYPE = 'Fdc3UserInterfaceChannels';

/**
 * Returns true if the value has a type property with value 'Fdc3UserInterfaceDrag'. This is a fast check that does not check the format of the message
 */
export function isFdc3UserInterfaceDrag(value: any): value is Fdc3UserInterfaceDrag {
  return value != null && value.type === 'Fdc3UserInterfaceDrag';
}

export const FDC3_USER_INTERFACE_DRAG_TYPE = 'Fdc3UserInterfaceDrag';

/**
 * Returns true if the value has a type property with value 'Fdc3UserInterfaceHandshake'. This is a fast check that does not check the format of the message
 */
export function isFdc3UserInterfaceHandshake(value: any): value is Fdc3UserInterfaceHandshake {
  return value != null && value.type === 'Fdc3UserInterfaceHandshake';
}

export const FDC3_USER_INTERFACE_HANDSHAKE_TYPE = 'Fdc3UserInterfaceHandshake';

/**
 * Returns true if the value has a type property with value 'Fdc3UserInterfaceHello'. This is a fast check that does not check the format of the message
 */
export function isFdc3UserInterfaceHello(value: any): value is Fdc3UserInterfaceHello {
  return value != null && value.type === 'Fdc3UserInterfaceHello';
}

export const FDC3_USER_INTERFACE_HELLO_TYPE = 'Fdc3UserInterfaceHello';

export const FDC3_USER_INTERFACE_MESSAGE_TYPE = 'Fdc3UserInterfaceMessage';

/**
 * Returns true if the value has a type property with value 'Fdc3UserInterfaceResolve'. This is a fast check that does not check the format of the message
 */
export function isFdc3UserInterfaceResolve(value: any): value is Fdc3UserInterfaceResolve {
  return value != null && value.type === 'Fdc3UserInterfaceResolve';
}

export const FDC3_USER_INTERFACE_RESOLVE_TYPE = 'Fdc3UserInterfaceResolve';

/**
 * Returns true if the value has a type property with value 'Fdc3UserInterfaceResolveAction'. This is a fast check that does not check the format of the message
 */
export function isFdc3UserInterfaceResolveAction(value: any): value is Fdc3UserInterfaceResolveAction {
  return value != null && value.type === 'Fdc3UserInterfaceResolveAction';
}

export const FDC3_USER_INTERFACE_RESOLVE_ACTION_TYPE = 'Fdc3UserInterfaceResolveAction';

/**
 * Returns true if the value has a type property with value 'Fdc3UserInterfaceRestyle'. This is a fast check that does not check the format of the message
 */
export function isFdc3UserInterfaceRestyle(value: any): value is Fdc3UserInterfaceRestyle {
  return value != null && value.type === 'Fdc3UserInterfaceRestyle';
}

export const FDC3_USER_INTERFACE_RESTYLE_TYPE = 'Fdc3UserInterfaceRestyle';

/**
 * Returns true if the value has a type property with value 'findInstancesRequest'. This is a fast check that does not check the format of the message
 */
export function isFindInstancesRequest(value: any): value is FindInstancesRequest {
  return value != null && value.type === 'findInstancesRequest';
}

export const FIND_INSTANCES_REQUEST_TYPE = 'FindInstancesRequest';

/**
 * Returns true if the value has a type property with value 'findInstancesResponse'. This is a fast check that does not check the format of the message
 */
export function isFindInstancesResponse(value: any): value is FindInstancesResponse {
  return value != null && value.type === 'findInstancesResponse';
}

export const FIND_INSTANCES_RESPONSE_TYPE = 'FindInstancesResponse';

/**
 * Returns true if the value has a type property with value 'findIntentRequest'. This is a fast check that does not check the format of the message
 */
export function isFindIntentRequest(value: any): value is FindIntentRequest {
  return value != null && value.type === 'findIntentRequest';
}

export const FIND_INTENT_REQUEST_TYPE = 'FindIntentRequest';

/**
 * Returns true if the value has a type property with value 'findIntentResponse'. This is a fast check that does not check the format of the message
 */
export function isFindIntentResponse(value: any): value is FindIntentResponse {
  return value != null && value.type === 'findIntentResponse';
}

export const FIND_INTENT_RESPONSE_TYPE = 'FindIntentResponse';

/**
 * Returns true if the value has a type property with value 'findIntentsByContextRequest'. This is a fast check that does not check the format of the message
 */
export function isFindIntentsByContextRequest(value: any): value is FindIntentsByContextRequest {
  return value != null && value.type === 'findIntentsByContextRequest';
}

export const FIND_INTENTS_BY_CONTEXT_REQUEST_TYPE = 'FindIntentsByContextRequest';

/**
 * Returns true if the value has a type property with value 'findIntentsByContextResponse'. This is a fast check that does not check the format of the message
 */
export function isFindIntentsByContextResponse(value: any): value is FindIntentsByContextResponse {
  return value != null && value.type === 'findIntentsByContextResponse';
}

export const FIND_INTENTS_BY_CONTEXT_RESPONSE_TYPE = 'FindIntentsByContextResponse';

/**
 * Returns true if the value has a type property with value 'getAppMetadataRequest'. This is a fast check that does not check the format of the message
 */
export function isGetAppMetadataRequest(value: any): value is GetAppMetadataRequest {
  return value != null && value.type === 'getAppMetadataRequest';
}

export const GET_APP_METADATA_REQUEST_TYPE = 'GetAppMetadataRequest';

/**
 * Returns true if the value has a type property with value 'getAppMetadataResponse'. This is a fast check that does not check the format of the message
 */
export function isGetAppMetadataResponse(value: any): value is GetAppMetadataResponse {
  return value != null && value.type === 'getAppMetadataResponse';
}

export const GET_APP_METADATA_RESPONSE_TYPE = 'GetAppMetadataResponse';

/**
 * Returns true if the value has a type property with value 'getCurrentChannelRequest'. This is a fast check that does not check the format of the message
 */
export function isGetCurrentChannelRequest(value: any): value is GetCurrentChannelRequest {
  return value != null && value.type === 'getCurrentChannelRequest';
}

export const GET_CURRENT_CHANNEL_REQUEST_TYPE = 'GetCurrentChannelRequest';

/**
 * Returns true if the value has a type property with value 'getCurrentChannelResponse'. This is a fast check that does not check the format of the message
 */
export function isGetCurrentChannelResponse(value: any): value is GetCurrentChannelResponse {
  return value != null && value.type === 'getCurrentChannelResponse';
}

export const GET_CURRENT_CHANNEL_RESPONSE_TYPE = 'GetCurrentChannelResponse';

/**
 * Returns true if the value has a type property with value 'getCurrentContextRequest'. This is a fast check that does not check the format of the message
 */
export function isGetCurrentContextRequest(value: any): value is GetCurrentContextRequest {
  return value != null && value.type === 'getCurrentContextRequest';
}

export const GET_CURRENT_CONTEXT_REQUEST_TYPE = 'GetCurrentContextRequest';

/**
 * Returns true if the value has a type property with value 'getCurrentContextResponse'. This is a fast check that does not check the format of the message
 */
export function isGetCurrentContextResponse(value: any): value is GetCurrentContextResponse {
  return value != null && value.type === 'getCurrentContextResponse';
}

export const GET_CURRENT_CONTEXT_RESPONSE_TYPE = 'GetCurrentContextResponse';

/**
 * Returns true if the value has a type property with value 'getInfoRequest'. This is a fast check that does not check the format of the message
 */
export function isGetInfoRequest(value: any): value is GetInfoRequest {
  return value != null && value.type === 'getInfoRequest';
}

export const GET_INFO_REQUEST_TYPE = 'GetInfoRequest';

/**
 * Returns true if the value has a type property with value 'getInfoResponse'. This is a fast check that does not check the format of the message
 */
export function isGetInfoResponse(value: any): value is GetInfoResponse {
  return value != null && value.type === 'getInfoResponse';
}

export const GET_INFO_RESPONSE_TYPE = 'GetInfoResponse';

/**
 * Returns true if the value has a type property with value 'getOrCreateChannelRequest'. This is a fast check that does not check the format of the message
 */
export function isGetOrCreateChannelRequest(value: any): value is GetOrCreateChannelRequest {
  return value != null && value.type === 'getOrCreateChannelRequest';
}

export const GET_OR_CREATE_CHANNEL_REQUEST_TYPE = 'GetOrCreateChannelRequest';

/**
 * Returns true if the value has a type property with value 'getOrCreateChannelResponse'. This is a fast check that does not check the format of the message
 */
export function isGetOrCreateChannelResponse(value: any): value is GetOrCreateChannelResponse {
  return value != null && value.type === 'getOrCreateChannelResponse';
}

export const GET_OR_CREATE_CHANNEL_RESPONSE_TYPE = 'GetOrCreateChannelResponse';

/**
 * Returns true if the value has a type property with value 'getUserChannelsRequest'. This is a fast check that does not check the format of the message
 */
export function isGetUserChannelsRequest(value: any): value is GetUserChannelsRequest {
  return value != null && value.type === 'getUserChannelsRequest';
}

export const GET_USER_CHANNELS_REQUEST_TYPE = 'GetUserChannelsRequest';

/**
 * Returns true if the value has a type property with value 'getUserChannelsResponse'. This is a fast check that does not check the format of the message
 */
export function isGetUserChannelsResponse(value: any): value is GetUserChannelsResponse {
  return value != null && value.type === 'getUserChannelsResponse';
}

export const GET_USER_CHANNELS_RESPONSE_TYPE = 'GetUserChannelsResponse';

/**
 * Returns true if the value has a type property with value 'heartbeatAcknowledgementRequest'. This is a fast check that does not check the format of the message
 */
export function isHeartbeatAcknowledgementRequest(value: any): value is HeartbeatAcknowledgementRequest {
  return value != null && value.type === 'heartbeatAcknowledgementRequest';
}

export const HEARTBEAT_ACKNOWLEDGEMENT_REQUEST_TYPE = 'HeartbeatAcknowledgementRequest';

/**
 * Returns true if the value has a type property with value 'heartbeatEvent'. This is a fast check that does not check the format of the message
 */
export function isHeartbeatEvent(value: any): value is HeartbeatEvent {
  return value != null && value.type === 'heartbeatEvent';
}

export const HEARTBEAT_EVENT_TYPE = 'HeartbeatEvent';

/**
 * Returns true if the value has a type property with value 'intentEvent'. This is a fast check that does not check the format of the message
 */
export function isIntentEvent(value: any): value is IntentEvent {
  return value != null && value.type === 'intentEvent';
}

export const INTENT_EVENT_TYPE = 'IntentEvent';

/**
 * Returns true if the value has a type property with value 'intentListenerUnsubscribeRequest'. This is a fast check that does not check the format of the message
 */
export function isIntentListenerUnsubscribeRequest(value: any): value is IntentListenerUnsubscribeRequest {
  return value != null && value.type === 'intentListenerUnsubscribeRequest';
}

export const INTENT_LISTENER_UNSUBSCRIBE_REQUEST_TYPE = 'IntentListenerUnsubscribeRequest';

/**
 * Returns true if the value has a type property with value 'intentListenerUnsubscribeResponse'. This is a fast check that does not check the format of the message
 */
export function isIntentListenerUnsubscribeResponse(value: any): value is IntentListenerUnsubscribeResponse {
  return value != null && value.type === 'intentListenerUnsubscribeResponse';
}

export const INTENT_LISTENER_UNSUBSCRIBE_RESPONSE_TYPE = 'IntentListenerUnsubscribeResponse';

/**
 * Returns true if the value has a type property with value 'intentResultRequest'. This is a fast check that does not check the format of the message
 */
export function isIntentResultRequest(value: any): value is IntentResultRequest {
  return value != null && value.type === 'intentResultRequest';
}

export const INTENT_RESULT_REQUEST_TYPE = 'IntentResultRequest';

/**
 * Returns true if the value has a type property with value 'intentResultResponse'. This is a fast check that does not check the format of the message
 */
export function isIntentResultResponse(value: any): value is IntentResultResponse {
  return value != null && value.type === 'intentResultResponse';
}

export const INTENT_RESULT_RESPONSE_TYPE = 'IntentResultResponse';

/**
 * Returns true if the value has a type property with value 'joinUserChannelRequest'. This is a fast check that does not check the format of the message
 */
export function isJoinUserChannelRequest(value: any): value is JoinUserChannelRequest {
  return value != null && value.type === 'joinUserChannelRequest';
}

export const JOIN_USER_CHANNEL_REQUEST_TYPE = 'JoinUserChannelRequest';

/**
 * Returns true if the value has a type property with value 'joinUserChannelResponse'. This is a fast check that does not check the format of the message
 */
export function isJoinUserChannelResponse(value: any): value is JoinUserChannelResponse {
  return value != null && value.type === 'joinUserChannelResponse';
}

export const JOIN_USER_CHANNEL_RESPONSE_TYPE = 'JoinUserChannelResponse';

/**
 * Returns true if the value has a type property with value 'leaveCurrentChannelRequest'. This is a fast check that does not check the format of the message
 */
export function isLeaveCurrentChannelRequest(value: any): value is LeaveCurrentChannelRequest {
  return value != null && value.type === 'leaveCurrentChannelRequest';
}

export const LEAVE_CURRENT_CHANNEL_REQUEST_TYPE = 'LeaveCurrentChannelRequest';

/**
 * Returns true if the value has a type property with value 'leaveCurrentChannelResponse'. This is a fast check that does not check the format of the message
 */
export function isLeaveCurrentChannelResponse(value: any): value is LeaveCurrentChannelResponse {
  return value != null && value.type === 'leaveCurrentChannelResponse';
}

export const LEAVE_CURRENT_CHANNEL_RESPONSE_TYPE = 'LeaveCurrentChannelResponse';

/**
 * Returns true if the value has a type property with value 'openRequest'. This is a fast check that does not check the format of the message
 */
export function isOpenRequest(value: any): value is OpenRequest {
  return value != null && value.type === 'openRequest';
}

export const OPEN_REQUEST_TYPE = 'OpenRequest';

/**
 * Returns true if the value has a type property with value 'openResponse'. This is a fast check that does not check the format of the message
 */
export function isOpenResponse(value: any): value is OpenResponse {
  return value != null && value.type === 'openResponse';
}

export const OPEN_RESPONSE_TYPE = 'OpenResponse';

/**
 * Returns true if the value has a type property with value 'privateChannelAddEventListenerRequest'. This is a fast check that does not check the format of the message
 */
export function isPrivateChannelAddEventListenerRequest(value: any): value is PrivateChannelAddEventListenerRequest {
  return value != null && value.type === 'privateChannelAddEventListenerRequest';
}

export const PRIVATE_CHANNEL_ADD_EVENT_LISTENER_REQUEST_TYPE = 'PrivateChannelAddEventListenerRequest';

/**
 * Returns true if the value has a type property with value 'privateChannelAddEventListenerResponse'. This is a fast check that does not check the format of the message
 */
export function isPrivateChannelAddEventListenerResponse(value: any): value is PrivateChannelAddEventListenerResponse {
  return value != null && value.type === 'privateChannelAddEventListenerResponse';
}

export const PRIVATE_CHANNEL_ADD_EVENT_LISTENER_RESPONSE_TYPE = 'PrivateChannelAddEventListenerResponse';

/**
 * Returns true if the value has a type property with value 'privateChannelDisconnectRequest'. This is a fast check that does not check the format of the message
 */
export function isPrivateChannelDisconnectRequest(value: any): value is PrivateChannelDisconnectRequest {
  return value != null && value.type === 'privateChannelDisconnectRequest';
}

export const PRIVATE_CHANNEL_DISCONNECT_REQUEST_TYPE = 'PrivateChannelDisconnectRequest';

/**
 * Returns true if the value has a type property with value 'privateChannelDisconnectResponse'. This is a fast check that does not check the format of the message
 */
export function isPrivateChannelDisconnectResponse(value: any): value is PrivateChannelDisconnectResponse {
  return value != null && value.type === 'privateChannelDisconnectResponse';
}

export const PRIVATE_CHANNEL_DISCONNECT_RESPONSE_TYPE = 'PrivateChannelDisconnectResponse';

/**
 * Returns true if the value has a type property with value 'privateChannelOnAddContextListenerEvent'. This is a fast check that does not check the format of the message
 */
export function isPrivateChannelOnAddContextListenerEvent(
  value: any
): value is PrivateChannelOnAddContextListenerEvent {
  return value != null && value.type === 'privateChannelOnAddContextListenerEvent';
}

export const PRIVATE_CHANNEL_ON_ADD_CONTEXT_LISTENER_EVENT_TYPE = 'PrivateChannelOnAddContextListenerEvent';

/**
 * Returns true if the value has a type property with value 'privateChannelOnDisconnectEvent'. This is a fast check that does not check the format of the message
 */
export function isPrivateChannelOnDisconnectEvent(value: any): value is PrivateChannelOnDisconnectEvent {
  return value != null && value.type === 'privateChannelOnDisconnectEvent';
}

export const PRIVATE_CHANNEL_ON_DISCONNECT_EVENT_TYPE = 'PrivateChannelOnDisconnectEvent';

/**
 * Returns true if the value has a type property with value 'privateChannelOnUnsubscribeEvent'. This is a fast check that does not check the format of the message
 */
export function isPrivateChannelOnUnsubscribeEvent(value: any): value is PrivateChannelOnUnsubscribeEvent {
  return value != null && value.type === 'privateChannelOnUnsubscribeEvent';
}

export const PRIVATE_CHANNEL_ON_UNSUBSCRIBE_EVENT_TYPE = 'PrivateChannelOnUnsubscribeEvent';

/**
 * Returns true if the value has a type property with value 'privateChannelUnsubscribeEventListenerRequest'. This is a fast check that does not check the format of the message
 */
export function isPrivateChannelUnsubscribeEventListenerRequest(
  value: any
): value is PrivateChannelUnsubscribeEventListenerRequest {
  return value != null && value.type === 'privateChannelUnsubscribeEventListenerRequest';
}

export const PRIVATE_CHANNEL_UNSUBSCRIBE_EVENT_LISTENER_REQUEST_TYPE = 'PrivateChannelUnsubscribeEventListenerRequest';

/**
 * Returns true if the value has a type property with value 'privateChannelUnsubscribeEventListenerResponse'. This is a fast check that does not check the format of the message
 */
export function isPrivateChannelUnsubscribeEventListenerResponse(
  value: any
): value is PrivateChannelUnsubscribeEventListenerResponse {
  return value != null && value.type === 'privateChannelUnsubscribeEventListenerResponse';
}

export const PRIVATE_CHANNEL_UNSUBSCRIBE_EVENT_LISTENER_RESPONSE_TYPE =
  'PrivateChannelUnsubscribeEventListenerResponse';

/**
 * Returns true if the value has a type property with value 'raiseIntentForContextRequest'. This is a fast check that does not check the format of the message
 */
export function isRaiseIntentForContextRequest(value: any): value is RaiseIntentForContextRequest {
  return value != null && value.type === 'raiseIntentForContextRequest';
}

export const RAISE_INTENT_FOR_CONTEXT_REQUEST_TYPE = 'RaiseIntentForContextRequest';

/**
 * Returns true if the value has a type property with value 'raiseIntentForContextResponse'. This is a fast check that does not check the format of the message
 */
export function isRaiseIntentForContextResponse(value: any): value is RaiseIntentForContextResponse {
  return value != null && value.type === 'raiseIntentForContextResponse';
}

export const RAISE_INTENT_FOR_CONTEXT_RESPONSE_TYPE = 'RaiseIntentForContextResponse';

/**
 * Returns true if the value has a type property with value 'raiseIntentRequest'. This is a fast check that does not check the format of the message
 */
export function isRaiseIntentRequest(value: any): value is RaiseIntentRequest {
  return value != null && value.type === 'raiseIntentRequest';
}

export const RAISE_INTENT_REQUEST_TYPE = 'RaiseIntentRequest';

/**
 * Returns true if the value has a type property with value 'raiseIntentResponse'. This is a fast check that does not check the format of the message
 */
export function isRaiseIntentResponse(value: any): value is RaiseIntentResponse {
  return value != null && value.type === 'raiseIntentResponse';
}

export const RAISE_INTENT_RESPONSE_TYPE = 'RaiseIntentResponse';

/**
 * Returns true if the value has a type property with value 'raiseIntentResultResponse'. This is a fast check that does not check the format of the message
 */
export function isRaiseIntentResultResponse(value: any): value is RaiseIntentResultResponse {
  return value != null && value.type === 'raiseIntentResultResponse';
}

export const RAISE_INTENT_RESULT_RESPONSE_TYPE = 'RaiseIntentResultResponse';
