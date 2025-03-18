// To parse this data:
//
//   import { Convert, WebConnectionProtocol1Hello, WebConnectionProtocol2LoadURL, WebConnectionProtocol3Handshake, WebConnectionProtocol4ValidateAppIdentity, WebConnectionProtocol5ValidateAppIdentityFailedResponse, WebConnectionProtocol5ValidateAppIdentitySuccessResponse, WebConnectionProtocol6Goodbye, WebConnectionProtocolMessage, AddContextListenerRequest, AddContextListenerResponse, AddEventListenerRequest, AddEventListenerResponse, AddIntentListenerRequest, AddIntentListenerResponse, AgentEventMessage, AgentResponseMessage, AppRequestMessage, BroadcastEvent, BroadcastRequest, BroadcastResponse, ChannelChangedEvent, ContextListenerUnsubscribeRequest, ContextListenerUnsubscribeResponse, CreatePrivateChannelRequest, CreatePrivateChannelResponse, EventListenerUnsubscribeRequest, EventListenerUnsubscribeResponse, Fdc3UserInterfaceChannelSelected, Fdc3UserInterfaceChannels, Fdc3UserInterfaceDrag, Fdc3UserInterfaceHandshake, Fdc3UserInterfaceHello, Fdc3UserInterfaceMessage, Fdc3UserInterfaceResolve, Fdc3UserInterfaceResolveAction, Fdc3UserInterfaceRestyle, FindInstancesRequest, FindInstancesResponse, FindIntentRequest, FindIntentResponse, FindIntentsByContextRequest, FindIntentsByContextResponse, GetAppMetadataRequest, GetAppMetadataResponse, GetCurrentChannelRequest, GetCurrentChannelResponse, GetCurrentContextRequest, GetCurrentContextResponse, GetInfoRequest, GetInfoResponse, GetOrCreateChannelRequest, GetOrCreateChannelResponse, GetUserChannelsRequest, GetUserChannelsResponse, HeartbeatAcknowledgementRequest, HeartbeatEvent, IntentEvent, IntentListenerUnsubscribeRequest, IntentListenerUnsubscribeResponse, IntentResultRequest, IntentResultResponse, JoinUserChannelRequest, JoinUserChannelResponse, LeaveCurrentChannelRequest, LeaveCurrentChannelResponse, OpenRequest, OpenResponse, PrivateChannelAddEventListenerRequest, PrivateChannelAddEventListenerResponse, PrivateChannelDisconnectRequest, PrivateChannelDisconnectResponse, PrivateChannelOnAddContextListenerEvent, PrivateChannelOnDisconnectEvent, PrivateChannelOnUnsubscribeEvent, PrivateChannelUnsubscribeEventListenerRequest, PrivateChannelUnsubscribeEventListenerResponse, RaiseIntentForContextRequest, RaiseIntentForContextResponse, RaiseIntentRequest, RaiseIntentResponse, RaiseIntentResultResponse } from "./file";
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
  [property: string]: any;
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
  [property: string]: any;
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
   * Used to indicate whether the exposure of 'originating app metadata' for
   * context and intent messages is supported by the Desktop Agent.
   */
  OriginatingAppMetadata: boolean;
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
 * Details of the application instance that broadcast the context.
 *
 * The App resolution option chosen.
 *
 * Details of the application instance that raised the intent.
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
  contextType: null | string;
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
 * Constants representing the errors that can be encountered when calling the `findIntent`,
 * `findIntentsByContext`, `raiseIntent` or `raiseIntentForContext` methods on the
 * DesktopAgent (`fdc3`).
 */
export type PurpleError = 'AccessDenied' | 'CreationFailed' | 'MalformedContext' | 'NoChannelFound' | 'ApiTimeout';

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
   * The type of the event to be listened to or `null` to listen to all event types.
   */
  type: 'USER_CHANNEL_CHANGED' | null;
}

/**
 * The type of a (non-context and non-intent) event that may be received via the FDC3 API's
 * addEventListener function.
 */

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
 * Constants representing the errors that can be encountered when calling the `findIntent`,
 * `findIntentsByContext`, `raiseIntent` or `raiseIntentForContext` methods on the
 * DesktopAgent (`fdc3`).
 */
export type ResponsePayloadError =
  | 'AccessDenied'
  | 'CreationFailed'
  | 'MalformedContext'
  | 'NoChannelFound'
  | 'ApiTimeout'
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
 * Constants representing the errors that can be encountered when calling the `findIntent`,
 * `findIntentsByContext`, `raiseIntent` or `raiseIntentForContext` methods on the
 * DesktopAgent (`fdc3`).
 */
export type FluffyError =
  | 'MalformedContext'
  | 'ApiTimeout'
  | 'DesktopAgentNotFound'
  | 'ResolverUnavailable'
  | 'IntentDeliveryFailed'
  | 'NoAppsFound'
  | 'ResolverTimeout'
  | 'TargetAppUnavailable'
  | 'TargetInstanceUnavailable'
  | 'UserCancelledResolution';

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
  | 'privateChannelOnUnsubscribeEvent';

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
  | 'raiseIntentResultResponse';

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
  | 'raiseIntentRequest';

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
  /**
   * Details of the application instance that broadcast the context.
   */
  originatingApp?: AppIdentifier;
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
   * The Id of the channel that the app was added to or `null` if it was removed from a
   * channel.
   */
  newChannelId: null | string;
  /**
   * User Channel definitions
   */
  userChannels?: Channel[];
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
 * Constants representing the errors that can be encountered when calling the `findIntent`,
 * `findIntentsByContext`, `raiseIntent` or `raiseIntentForContext` methods on the
 * DesktopAgent (`fdc3`).
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
  | 'DesktopAgentNotFound'
  | 'ResolverUnavailable'
  | 'IntentDeliveryFailed'
  | 'NoAppsFound'
  | 'ResolverTimeout'
  | 'TargetAppUnavailable'
  | 'TargetInstanceUnavailable'
  | 'UserCancelledResolution'
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
 */
export interface GetCurrentContextResponsePayload {
  error?: PurpleError;
  /**
   * The most recently broadcast context object (of the specified type, if one was specified),
   * or `null` if none was available in the channel.
   */
  context?: null | Context;
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
  /**
   * Details of the application instance that raised the intent.
   */
  originatingApp?: AppIdentifier;
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
 * Constants representing the errors that can be encountered when calling the `findIntent`,
 * `findIntentsByContext`, `raiseIntent` or `raiseIntentForContext` methods on the
 * DesktopAgent (`fdc3`).
 */
export type OpenErrorResponsePayload =
  | 'MalformedContext'
  | 'ApiTimeout'
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
  contextType: null | string;
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
  contextType: null | string;
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
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toWebConnectionProtocol1Hello(json: string): WebConnectionProtocol1Hello {
    return cast(JSON.parse(json), r('WebConnectionProtocol1Hello'));
  }

  public static webConnectionProtocol1HelloToJson(value: WebConnectionProtocol1Hello): string {
    return JSON.stringify(uncast(value, r('WebConnectionProtocol1Hello')), null, 2);
  }

  public static toWebConnectionProtocol2LoadURL(json: string): WebConnectionProtocol2LoadURL {
    return cast(JSON.parse(json), r('WebConnectionProtocol2LoadURL'));
  }

  public static webConnectionProtocol2LoadURLToJson(value: WebConnectionProtocol2LoadURL): string {
    return JSON.stringify(uncast(value, r('WebConnectionProtocol2LoadURL')), null, 2);
  }

  public static toWebConnectionProtocol3Handshake(json: string): WebConnectionProtocol3Handshake {
    return cast(JSON.parse(json), r('WebConnectionProtocol3Handshake'));
  }

  public static webConnectionProtocol3HandshakeToJson(value: WebConnectionProtocol3Handshake): string {
    return JSON.stringify(uncast(value, r('WebConnectionProtocol3Handshake')), null, 2);
  }

  public static toWebConnectionProtocol4ValidateAppIdentity(json: string): WebConnectionProtocol4ValidateAppIdentity {
    return cast(JSON.parse(json), r('WebConnectionProtocol4ValidateAppIdentity'));
  }

  public static webConnectionProtocol4ValidateAppIdentityToJson(
    value: WebConnectionProtocol4ValidateAppIdentity
  ): string {
    return JSON.stringify(uncast(value, r('WebConnectionProtocol4ValidateAppIdentity')), null, 2);
  }

  public static toWebConnectionProtocol5ValidateAppIdentityFailedResponse(
    json: string
  ): WebConnectionProtocol5ValidateAppIdentityFailedResponse {
    return cast(JSON.parse(json), r('WebConnectionProtocol5ValidateAppIdentityFailedResponse'));
  }

  public static webConnectionProtocol5ValidateAppIdentityFailedResponseToJson(
    value: WebConnectionProtocol5ValidateAppIdentityFailedResponse
  ): string {
    return JSON.stringify(uncast(value, r('WebConnectionProtocol5ValidateAppIdentityFailedResponse')), null, 2);
  }

  public static toWebConnectionProtocol5ValidateAppIdentitySuccessResponse(
    json: string
  ): WebConnectionProtocol5ValidateAppIdentitySuccessResponse {
    return cast(JSON.parse(json), r('WebConnectionProtocol5ValidateAppIdentitySuccessResponse'));
  }

  public static webConnectionProtocol5ValidateAppIdentitySuccessResponseToJson(
    value: WebConnectionProtocol5ValidateAppIdentitySuccessResponse
  ): string {
    return JSON.stringify(uncast(value, r('WebConnectionProtocol5ValidateAppIdentitySuccessResponse')), null, 2);
  }

  public static toWebConnectionProtocol6Goodbye(json: string): WebConnectionProtocol6Goodbye {
    return cast(JSON.parse(json), r('WebConnectionProtocol6Goodbye'));
  }

  public static webConnectionProtocol6GoodbyeToJson(value: WebConnectionProtocol6Goodbye): string {
    return JSON.stringify(uncast(value, r('WebConnectionProtocol6Goodbye')), null, 2);
  }

  public static toWebConnectionProtocolMessage(json: string): WebConnectionProtocolMessage {
    return cast(JSON.parse(json), r('WebConnectionProtocolMessage'));
  }

  public static webConnectionProtocolMessageToJson(value: WebConnectionProtocolMessage): string {
    return JSON.stringify(uncast(value, r('WebConnectionProtocolMessage')), null, 2);
  }

  public static toAddContextListenerRequest(json: string): AddContextListenerRequest {
    return cast(JSON.parse(json), r('AddContextListenerRequest'));
  }

  public static addContextListenerRequestToJson(value: AddContextListenerRequest): string {
    return JSON.stringify(uncast(value, r('AddContextListenerRequest')), null, 2);
  }

  public static toAddContextListenerResponse(json: string): AddContextListenerResponse {
    return cast(JSON.parse(json), r('AddContextListenerResponse'));
  }

  public static addContextListenerResponseToJson(value: AddContextListenerResponse): string {
    return JSON.stringify(uncast(value, r('AddContextListenerResponse')), null, 2);
  }

  public static toAddEventListenerRequest(json: string): AddEventListenerRequest {
    return cast(JSON.parse(json), r('AddEventListenerRequest'));
  }

  public static addEventListenerRequestToJson(value: AddEventListenerRequest): string {
    return JSON.stringify(uncast(value, r('AddEventListenerRequest')), null, 2);
  }

  public static toAddEventListenerResponse(json: string): AddEventListenerResponse {
    return cast(JSON.parse(json), r('AddEventListenerResponse'));
  }

  public static addEventListenerResponseToJson(value: AddEventListenerResponse): string {
    return JSON.stringify(uncast(value, r('AddEventListenerResponse')), null, 2);
  }

  public static toAddIntentListenerRequest(json: string): AddIntentListenerRequest {
    return cast(JSON.parse(json), r('AddIntentListenerRequest'));
  }

  public static addIntentListenerRequestToJson(value: AddIntentListenerRequest): string {
    return JSON.stringify(uncast(value, r('AddIntentListenerRequest')), null, 2);
  }

  public static toAddIntentListenerResponse(json: string): AddIntentListenerResponse {
    return cast(JSON.parse(json), r('AddIntentListenerResponse'));
  }

  public static addIntentListenerResponseToJson(value: AddIntentListenerResponse): string {
    return JSON.stringify(uncast(value, r('AddIntentListenerResponse')), null, 2);
  }

  public static toAgentEventMessage(json: string): AgentEventMessage {
    return cast(JSON.parse(json), r('AgentEventMessage'));
  }

  public static agentEventMessageToJson(value: AgentEventMessage): string {
    return JSON.stringify(uncast(value, r('AgentEventMessage')), null, 2);
  }

  public static toAgentResponseMessage(json: string): AgentResponseMessage {
    return cast(JSON.parse(json), r('AgentResponseMessage'));
  }

  public static agentResponseMessageToJson(value: AgentResponseMessage): string {
    return JSON.stringify(uncast(value, r('AgentResponseMessage')), null, 2);
  }

  public static toAppRequestMessage(json: string): AppRequestMessage {
    return cast(JSON.parse(json), r('AppRequestMessage'));
  }

  public static appRequestMessageToJson(value: AppRequestMessage): string {
    return JSON.stringify(uncast(value, r('AppRequestMessage')), null, 2);
  }

  public static toBroadcastEvent(json: string): BroadcastEvent {
    return cast(JSON.parse(json), r('BroadcastEvent'));
  }

  public static broadcastEventToJson(value: BroadcastEvent): string {
    return JSON.stringify(uncast(value, r('BroadcastEvent')), null, 2);
  }

  public static toBroadcastRequest(json: string): BroadcastRequest {
    return cast(JSON.parse(json), r('BroadcastRequest'));
  }

  public static broadcastRequestToJson(value: BroadcastRequest): string {
    return JSON.stringify(uncast(value, r('BroadcastRequest')), null, 2);
  }

  public static toBroadcastResponse(json: string): BroadcastResponse {
    return cast(JSON.parse(json), r('BroadcastResponse'));
  }

  public static broadcastResponseToJson(value: BroadcastResponse): string {
    return JSON.stringify(uncast(value, r('BroadcastResponse')), null, 2);
  }

  public static toChannelChangedEvent(json: string): ChannelChangedEvent {
    return cast(JSON.parse(json), r('ChannelChangedEvent'));
  }

  public static channelChangedEventToJson(value: ChannelChangedEvent): string {
    return JSON.stringify(uncast(value, r('ChannelChangedEvent')), null, 2);
  }

  public static toContextListenerUnsubscribeRequest(json: string): ContextListenerUnsubscribeRequest {
    return cast(JSON.parse(json), r('ContextListenerUnsubscribeRequest'));
  }

  public static contextListenerUnsubscribeRequestToJson(value: ContextListenerUnsubscribeRequest): string {
    return JSON.stringify(uncast(value, r('ContextListenerUnsubscribeRequest')), null, 2);
  }

  public static toContextListenerUnsubscribeResponse(json: string): ContextListenerUnsubscribeResponse {
    return cast(JSON.parse(json), r('ContextListenerUnsubscribeResponse'));
  }

  public static contextListenerUnsubscribeResponseToJson(value: ContextListenerUnsubscribeResponse): string {
    return JSON.stringify(uncast(value, r('ContextListenerUnsubscribeResponse')), null, 2);
  }

  public static toCreatePrivateChannelRequest(json: string): CreatePrivateChannelRequest {
    return cast(JSON.parse(json), r('CreatePrivateChannelRequest'));
  }

  public static createPrivateChannelRequestToJson(value: CreatePrivateChannelRequest): string {
    return JSON.stringify(uncast(value, r('CreatePrivateChannelRequest')), null, 2);
  }

  public static toCreatePrivateChannelResponse(json: string): CreatePrivateChannelResponse {
    return cast(JSON.parse(json), r('CreatePrivateChannelResponse'));
  }

  public static createPrivateChannelResponseToJson(value: CreatePrivateChannelResponse): string {
    return JSON.stringify(uncast(value, r('CreatePrivateChannelResponse')), null, 2);
  }

  public static toEventListenerUnsubscribeRequest(json: string): EventListenerUnsubscribeRequest {
    return cast(JSON.parse(json), r('EventListenerUnsubscribeRequest'));
  }

  public static eventListenerUnsubscribeRequestToJson(value: EventListenerUnsubscribeRequest): string {
    return JSON.stringify(uncast(value, r('EventListenerUnsubscribeRequest')), null, 2);
  }

  public static toEventListenerUnsubscribeResponse(json: string): EventListenerUnsubscribeResponse {
    return cast(JSON.parse(json), r('EventListenerUnsubscribeResponse'));
  }

  public static eventListenerUnsubscribeResponseToJson(value: EventListenerUnsubscribeResponse): string {
    return JSON.stringify(uncast(value, r('EventListenerUnsubscribeResponse')), null, 2);
  }

  public static toFdc3UserInterfaceChannelSelected(json: string): Fdc3UserInterfaceChannelSelected {
    return cast(JSON.parse(json), r('Fdc3UserInterfaceChannelSelected'));
  }

  public static fdc3UserInterfaceChannelSelectedToJson(value: Fdc3UserInterfaceChannelSelected): string {
    return JSON.stringify(uncast(value, r('Fdc3UserInterfaceChannelSelected')), null, 2);
  }

  public static toFdc3UserInterfaceChannels(json: string): Fdc3UserInterfaceChannels {
    return cast(JSON.parse(json), r('Fdc3UserInterfaceChannels'));
  }

  public static fdc3UserInterfaceChannelsToJson(value: Fdc3UserInterfaceChannels): string {
    return JSON.stringify(uncast(value, r('Fdc3UserInterfaceChannels')), null, 2);
  }

  public static toFdc3UserInterfaceDrag(json: string): Fdc3UserInterfaceDrag {
    return cast(JSON.parse(json), r('Fdc3UserInterfaceDrag'));
  }

  public static fdc3UserInterfaceDragToJson(value: Fdc3UserInterfaceDrag): string {
    return JSON.stringify(uncast(value, r('Fdc3UserInterfaceDrag')), null, 2);
  }

  public static toFdc3UserInterfaceHandshake(json: string): Fdc3UserInterfaceHandshake {
    return cast(JSON.parse(json), r('Fdc3UserInterfaceHandshake'));
  }

  public static fdc3UserInterfaceHandshakeToJson(value: Fdc3UserInterfaceHandshake): string {
    return JSON.stringify(uncast(value, r('Fdc3UserInterfaceHandshake')), null, 2);
  }

  public static toFdc3UserInterfaceHello(json: string): Fdc3UserInterfaceHello {
    return cast(JSON.parse(json), r('Fdc3UserInterfaceHello'));
  }

  public static fdc3UserInterfaceHelloToJson(value: Fdc3UserInterfaceHello): string {
    return JSON.stringify(uncast(value, r('Fdc3UserInterfaceHello')), null, 2);
  }

  public static toFdc3UserInterfaceMessage(json: string): Fdc3UserInterfaceMessage {
    return cast(JSON.parse(json), r('Fdc3UserInterfaceMessage'));
  }

  public static fdc3UserInterfaceMessageToJson(value: Fdc3UserInterfaceMessage): string {
    return JSON.stringify(uncast(value, r('Fdc3UserInterfaceMessage')), null, 2);
  }

  public static toFdc3UserInterfaceResolve(json: string): Fdc3UserInterfaceResolve {
    return cast(JSON.parse(json), r('Fdc3UserInterfaceResolve'));
  }

  public static fdc3UserInterfaceResolveToJson(value: Fdc3UserInterfaceResolve): string {
    return JSON.stringify(uncast(value, r('Fdc3UserInterfaceResolve')), null, 2);
  }

  public static toFdc3UserInterfaceResolveAction(json: string): Fdc3UserInterfaceResolveAction {
    return cast(JSON.parse(json), r('Fdc3UserInterfaceResolveAction'));
  }

  public static fdc3UserInterfaceResolveActionToJson(value: Fdc3UserInterfaceResolveAction): string {
    return JSON.stringify(uncast(value, r('Fdc3UserInterfaceResolveAction')), null, 2);
  }

  public static toFdc3UserInterfaceRestyle(json: string): Fdc3UserInterfaceRestyle {
    return cast(JSON.parse(json), r('Fdc3UserInterfaceRestyle'));
  }

  public static fdc3UserInterfaceRestyleToJson(value: Fdc3UserInterfaceRestyle): string {
    return JSON.stringify(uncast(value, r('Fdc3UserInterfaceRestyle')), null, 2);
  }

  public static toFindInstancesRequest(json: string): FindInstancesRequest {
    return cast(JSON.parse(json), r('FindInstancesRequest'));
  }

  public static findInstancesRequestToJson(value: FindInstancesRequest): string {
    return JSON.stringify(uncast(value, r('FindInstancesRequest')), null, 2);
  }

  public static toFindInstancesResponse(json: string): FindInstancesResponse {
    return cast(JSON.parse(json), r('FindInstancesResponse'));
  }

  public static findInstancesResponseToJson(value: FindInstancesResponse): string {
    return JSON.stringify(uncast(value, r('FindInstancesResponse')), null, 2);
  }

  public static toFindIntentRequest(json: string): FindIntentRequest {
    return cast(JSON.parse(json), r('FindIntentRequest'));
  }

  public static findIntentRequestToJson(value: FindIntentRequest): string {
    return JSON.stringify(uncast(value, r('FindIntentRequest')), null, 2);
  }

  public static toFindIntentResponse(json: string): FindIntentResponse {
    return cast(JSON.parse(json), r('FindIntentResponse'));
  }

  public static findIntentResponseToJson(value: FindIntentResponse): string {
    return JSON.stringify(uncast(value, r('FindIntentResponse')), null, 2);
  }

  public static toFindIntentsByContextRequest(json: string): FindIntentsByContextRequest {
    return cast(JSON.parse(json), r('FindIntentsByContextRequest'));
  }

  public static findIntentsByContextRequestToJson(value: FindIntentsByContextRequest): string {
    return JSON.stringify(uncast(value, r('FindIntentsByContextRequest')), null, 2);
  }

  public static toFindIntentsByContextResponse(json: string): FindIntentsByContextResponse {
    return cast(JSON.parse(json), r('FindIntentsByContextResponse'));
  }

  public static findIntentsByContextResponseToJson(value: FindIntentsByContextResponse): string {
    return JSON.stringify(uncast(value, r('FindIntentsByContextResponse')), null, 2);
  }

  public static toGetAppMetadataRequest(json: string): GetAppMetadataRequest {
    return cast(JSON.parse(json), r('GetAppMetadataRequest'));
  }

  public static getAppMetadataRequestToJson(value: GetAppMetadataRequest): string {
    return JSON.stringify(uncast(value, r('GetAppMetadataRequest')), null, 2);
  }

  public static toGetAppMetadataResponse(json: string): GetAppMetadataResponse {
    return cast(JSON.parse(json), r('GetAppMetadataResponse'));
  }

  public static getAppMetadataResponseToJson(value: GetAppMetadataResponse): string {
    return JSON.stringify(uncast(value, r('GetAppMetadataResponse')), null, 2);
  }

  public static toGetCurrentChannelRequest(json: string): GetCurrentChannelRequest {
    return cast(JSON.parse(json), r('GetCurrentChannelRequest'));
  }

  public static getCurrentChannelRequestToJson(value: GetCurrentChannelRequest): string {
    return JSON.stringify(uncast(value, r('GetCurrentChannelRequest')), null, 2);
  }

  public static toGetCurrentChannelResponse(json: string): GetCurrentChannelResponse {
    return cast(JSON.parse(json), r('GetCurrentChannelResponse'));
  }

  public static getCurrentChannelResponseToJson(value: GetCurrentChannelResponse): string {
    return JSON.stringify(uncast(value, r('GetCurrentChannelResponse')), null, 2);
  }

  public static toGetCurrentContextRequest(json: string): GetCurrentContextRequest {
    return cast(JSON.parse(json), r('GetCurrentContextRequest'));
  }

  public static getCurrentContextRequestToJson(value: GetCurrentContextRequest): string {
    return JSON.stringify(uncast(value, r('GetCurrentContextRequest')), null, 2);
  }

  public static toGetCurrentContextResponse(json: string): GetCurrentContextResponse {
    return cast(JSON.parse(json), r('GetCurrentContextResponse'));
  }

  public static getCurrentContextResponseToJson(value: GetCurrentContextResponse): string {
    return JSON.stringify(uncast(value, r('GetCurrentContextResponse')), null, 2);
  }

  public static toGetInfoRequest(json: string): GetInfoRequest {
    return cast(JSON.parse(json), r('GetInfoRequest'));
  }

  public static getInfoRequestToJson(value: GetInfoRequest): string {
    return JSON.stringify(uncast(value, r('GetInfoRequest')), null, 2);
  }

  public static toGetInfoResponse(json: string): GetInfoResponse {
    return cast(JSON.parse(json), r('GetInfoResponse'));
  }

  public static getInfoResponseToJson(value: GetInfoResponse): string {
    return JSON.stringify(uncast(value, r('GetInfoResponse')), null, 2);
  }

  public static toGetOrCreateChannelRequest(json: string): GetOrCreateChannelRequest {
    return cast(JSON.parse(json), r('GetOrCreateChannelRequest'));
  }

  public static getOrCreateChannelRequestToJson(value: GetOrCreateChannelRequest): string {
    return JSON.stringify(uncast(value, r('GetOrCreateChannelRequest')), null, 2);
  }

  public static toGetOrCreateChannelResponse(json: string): GetOrCreateChannelResponse {
    return cast(JSON.parse(json), r('GetOrCreateChannelResponse'));
  }

  public static getOrCreateChannelResponseToJson(value: GetOrCreateChannelResponse): string {
    return JSON.stringify(uncast(value, r('GetOrCreateChannelResponse')), null, 2);
  }

  public static toGetUserChannelsRequest(json: string): GetUserChannelsRequest {
    return cast(JSON.parse(json), r('GetUserChannelsRequest'));
  }

  public static getUserChannelsRequestToJson(value: GetUserChannelsRequest): string {
    return JSON.stringify(uncast(value, r('GetUserChannelsRequest')), null, 2);
  }

  public static toGetUserChannelsResponse(json: string): GetUserChannelsResponse {
    return cast(JSON.parse(json), r('GetUserChannelsResponse'));
  }

  public static getUserChannelsResponseToJson(value: GetUserChannelsResponse): string {
    return JSON.stringify(uncast(value, r('GetUserChannelsResponse')), null, 2);
  }

  public static toHeartbeatAcknowledgementRequest(json: string): HeartbeatAcknowledgementRequest {
    return cast(JSON.parse(json), r('HeartbeatAcknowledgementRequest'));
  }

  public static heartbeatAcknowledgementRequestToJson(value: HeartbeatAcknowledgementRequest): string {
    return JSON.stringify(uncast(value, r('HeartbeatAcknowledgementRequest')), null, 2);
  }

  public static toHeartbeatEvent(json: string): HeartbeatEvent {
    return cast(JSON.parse(json), r('HeartbeatEvent'));
  }

  public static heartbeatEventToJson(value: HeartbeatEvent): string {
    return JSON.stringify(uncast(value, r('HeartbeatEvent')), null, 2);
  }

  public static toIntentEvent(json: string): IntentEvent {
    return cast(JSON.parse(json), r('IntentEvent'));
  }

  public static intentEventToJson(value: IntentEvent): string {
    return JSON.stringify(uncast(value, r('IntentEvent')), null, 2);
  }

  public static toIntentListenerUnsubscribeRequest(json: string): IntentListenerUnsubscribeRequest {
    return cast(JSON.parse(json), r('IntentListenerUnsubscribeRequest'));
  }

  public static intentListenerUnsubscribeRequestToJson(value: IntentListenerUnsubscribeRequest): string {
    return JSON.stringify(uncast(value, r('IntentListenerUnsubscribeRequest')), null, 2);
  }

  public static toIntentListenerUnsubscribeResponse(json: string): IntentListenerUnsubscribeResponse {
    return cast(JSON.parse(json), r('IntentListenerUnsubscribeResponse'));
  }

  public static intentListenerUnsubscribeResponseToJson(value: IntentListenerUnsubscribeResponse): string {
    return JSON.stringify(uncast(value, r('IntentListenerUnsubscribeResponse')), null, 2);
  }

  public static toIntentResultRequest(json: string): IntentResultRequest {
    return cast(JSON.parse(json), r('IntentResultRequest'));
  }

  public static intentResultRequestToJson(value: IntentResultRequest): string {
    return JSON.stringify(uncast(value, r('IntentResultRequest')), null, 2);
  }

  public static toIntentResultResponse(json: string): IntentResultResponse {
    return cast(JSON.parse(json), r('IntentResultResponse'));
  }

  public static intentResultResponseToJson(value: IntentResultResponse): string {
    return JSON.stringify(uncast(value, r('IntentResultResponse')), null, 2);
  }

  public static toJoinUserChannelRequest(json: string): JoinUserChannelRequest {
    return cast(JSON.parse(json), r('JoinUserChannelRequest'));
  }

  public static joinUserChannelRequestToJson(value: JoinUserChannelRequest): string {
    return JSON.stringify(uncast(value, r('JoinUserChannelRequest')), null, 2);
  }

  public static toJoinUserChannelResponse(json: string): JoinUserChannelResponse {
    return cast(JSON.parse(json), r('JoinUserChannelResponse'));
  }

  public static joinUserChannelResponseToJson(value: JoinUserChannelResponse): string {
    return JSON.stringify(uncast(value, r('JoinUserChannelResponse')), null, 2);
  }

  public static toLeaveCurrentChannelRequest(json: string): LeaveCurrentChannelRequest {
    return cast(JSON.parse(json), r('LeaveCurrentChannelRequest'));
  }

  public static leaveCurrentChannelRequestToJson(value: LeaveCurrentChannelRequest): string {
    return JSON.stringify(uncast(value, r('LeaveCurrentChannelRequest')), null, 2);
  }

  public static toLeaveCurrentChannelResponse(json: string): LeaveCurrentChannelResponse {
    return cast(JSON.parse(json), r('LeaveCurrentChannelResponse'));
  }

  public static leaveCurrentChannelResponseToJson(value: LeaveCurrentChannelResponse): string {
    return JSON.stringify(uncast(value, r('LeaveCurrentChannelResponse')), null, 2);
  }

  public static toOpenRequest(json: string): OpenRequest {
    return cast(JSON.parse(json), r('OpenRequest'));
  }

  public static openRequestToJson(value: OpenRequest): string {
    return JSON.stringify(uncast(value, r('OpenRequest')), null, 2);
  }

  public static toOpenResponse(json: string): OpenResponse {
    return cast(JSON.parse(json), r('OpenResponse'));
  }

  public static openResponseToJson(value: OpenResponse): string {
    return JSON.stringify(uncast(value, r('OpenResponse')), null, 2);
  }

  public static toPrivateChannelAddEventListenerRequest(json: string): PrivateChannelAddEventListenerRequest {
    return cast(JSON.parse(json), r('PrivateChannelAddEventListenerRequest'));
  }

  public static privateChannelAddEventListenerRequestToJson(value: PrivateChannelAddEventListenerRequest): string {
    return JSON.stringify(uncast(value, r('PrivateChannelAddEventListenerRequest')), null, 2);
  }

  public static toPrivateChannelAddEventListenerResponse(json: string): PrivateChannelAddEventListenerResponse {
    return cast(JSON.parse(json), r('PrivateChannelAddEventListenerResponse'));
  }

  public static privateChannelAddEventListenerResponseToJson(value: PrivateChannelAddEventListenerResponse): string {
    return JSON.stringify(uncast(value, r('PrivateChannelAddEventListenerResponse')), null, 2);
  }

  public static toPrivateChannelDisconnectRequest(json: string): PrivateChannelDisconnectRequest {
    return cast(JSON.parse(json), r('PrivateChannelDisconnectRequest'));
  }

  public static privateChannelDisconnectRequestToJson(value: PrivateChannelDisconnectRequest): string {
    return JSON.stringify(uncast(value, r('PrivateChannelDisconnectRequest')), null, 2);
  }

  public static toPrivateChannelDisconnectResponse(json: string): PrivateChannelDisconnectResponse {
    return cast(JSON.parse(json), r('PrivateChannelDisconnectResponse'));
  }

  public static privateChannelDisconnectResponseToJson(value: PrivateChannelDisconnectResponse): string {
    return JSON.stringify(uncast(value, r('PrivateChannelDisconnectResponse')), null, 2);
  }

  public static toPrivateChannelOnAddContextListenerEvent(json: string): PrivateChannelOnAddContextListenerEvent {
    return cast(JSON.parse(json), r('PrivateChannelOnAddContextListenerEvent'));
  }

  public static privateChannelOnAddContextListenerEventToJson(value: PrivateChannelOnAddContextListenerEvent): string {
    return JSON.stringify(uncast(value, r('PrivateChannelOnAddContextListenerEvent')), null, 2);
  }

  public static toPrivateChannelOnDisconnectEvent(json: string): PrivateChannelOnDisconnectEvent {
    return cast(JSON.parse(json), r('PrivateChannelOnDisconnectEvent'));
  }

  public static privateChannelOnDisconnectEventToJson(value: PrivateChannelOnDisconnectEvent): string {
    return JSON.stringify(uncast(value, r('PrivateChannelOnDisconnectEvent')), null, 2);
  }

  public static toPrivateChannelOnUnsubscribeEvent(json: string): PrivateChannelOnUnsubscribeEvent {
    return cast(JSON.parse(json), r('PrivateChannelOnUnsubscribeEvent'));
  }

  public static privateChannelOnUnsubscribeEventToJson(value: PrivateChannelOnUnsubscribeEvent): string {
    return JSON.stringify(uncast(value, r('PrivateChannelOnUnsubscribeEvent')), null, 2);
  }

  public static toPrivateChannelUnsubscribeEventListenerRequest(
    json: string
  ): PrivateChannelUnsubscribeEventListenerRequest {
    return cast(JSON.parse(json), r('PrivateChannelUnsubscribeEventListenerRequest'));
  }

  public static privateChannelUnsubscribeEventListenerRequestToJson(
    value: PrivateChannelUnsubscribeEventListenerRequest
  ): string {
    return JSON.stringify(uncast(value, r('PrivateChannelUnsubscribeEventListenerRequest')), null, 2);
  }

  public static toPrivateChannelUnsubscribeEventListenerResponse(
    json: string
  ): PrivateChannelUnsubscribeEventListenerResponse {
    return cast(JSON.parse(json), r('PrivateChannelUnsubscribeEventListenerResponse'));
  }

  public static privateChannelUnsubscribeEventListenerResponseToJson(
    value: PrivateChannelUnsubscribeEventListenerResponse
  ): string {
    return JSON.stringify(uncast(value, r('PrivateChannelUnsubscribeEventListenerResponse')), null, 2);
  }

  public static toRaiseIntentForContextRequest(json: string): RaiseIntentForContextRequest {
    return cast(JSON.parse(json), r('RaiseIntentForContextRequest'));
  }

  public static raiseIntentForContextRequestToJson(value: RaiseIntentForContextRequest): string {
    return JSON.stringify(uncast(value, r('RaiseIntentForContextRequest')), null, 2);
  }

  public static toRaiseIntentForContextResponse(json: string): RaiseIntentForContextResponse {
    return cast(JSON.parse(json), r('RaiseIntentForContextResponse'));
  }

  public static raiseIntentForContextResponseToJson(value: RaiseIntentForContextResponse): string {
    return JSON.stringify(uncast(value, r('RaiseIntentForContextResponse')), null, 2);
  }

  public static toRaiseIntentRequest(json: string): RaiseIntentRequest {
    return cast(JSON.parse(json), r('RaiseIntentRequest'));
  }

  public static raiseIntentRequestToJson(value: RaiseIntentRequest): string {
    return JSON.stringify(uncast(value, r('RaiseIntentRequest')), null, 2);
  }

  public static toRaiseIntentResponse(json: string): RaiseIntentResponse {
    return cast(JSON.parse(json), r('RaiseIntentResponse'));
  }

  public static raiseIntentResponseToJson(value: RaiseIntentResponse): string {
    return JSON.stringify(uncast(value, r('RaiseIntentResponse')), null, 2);
  }

  public static toRaiseIntentResultResponse(json: string): RaiseIntentResultResponse {
    return cast(JSON.parse(json), r('RaiseIntentResultResponse'));
  }

  public static raiseIntentResultResponseToJson(value: RaiseIntentResultResponse): string {
    return JSON.stringify(uncast(value, r('RaiseIntentResultResponse')), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : '';
  const keyText = key ? ` for key "${key}"` : '';
  throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map(a => {
          return prettyTypeName(a);
        })
        .join(', ')}]`;
    }
  } else if (typeof typ === 'object' && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map(a => {
        return l(a);
      }),
      val,
      key,
      parent
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l('array'), val, key, parent);
    return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l('Date'), val, key, parent);
    }
    return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue(l(ref || 'object'), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach(key => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === 'object' && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
        ? transformArray(typ.arrayItems, val)
        : typ.hasOwnProperty('props')
          ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  WebConnectionProtocol1Hello: o(
    [
      { json: 'meta', js: 'meta', typ: r('WebConnectionProtocol1HelloMeta') },
      { json: 'payload', js: 'payload', typ: r('WebConnectionProtocol1HelloPayload') },
      { json: 'type', js: 'type', typ: r('WebConnectionProtocol1HelloType') },
    ],
    false
  ),
  WebConnectionProtocol1HelloMeta: o(
    [
      { json: 'connectionAttemptUuid', js: 'connectionAttemptUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  WebConnectionProtocol1HelloPayload: o(
    [
      { json: 'actualUrl', js: 'actualUrl', typ: '' },
      { json: 'channelSelector', js: 'channelSelector', typ: u(undefined, true) },
      { json: 'fdc3Version', js: 'fdc3Version', typ: '' },
      { json: 'identityUrl', js: 'identityUrl', typ: '' },
      { json: 'intentResolver', js: 'intentResolver', typ: u(undefined, true) },
    ],
    'any'
  ),
  WebConnectionProtocol2LoadURL: o(
    [
      { json: 'meta', js: 'meta', typ: r('WebConnectionProtocol1HelloMeta') },
      { json: 'payload', js: 'payload', typ: r('WebConnectionProtocol2LoadURLPayload') },
      { json: 'type', js: 'type', typ: r('WebConnectionProtocol2LoadURLType') },
    ],
    false
  ),
  WebConnectionProtocol2LoadURLPayload: o([{ json: 'iframeUrl', js: 'iframeUrl', typ: '' }], 'any'),
  WebConnectionProtocol3Handshake: o(
    [
      { json: 'meta', js: 'meta', typ: r('WebConnectionProtocol1HelloMeta') },
      { json: 'payload', js: 'payload', typ: r('WebConnectionProtocol3HandshakePayload') },
      { json: 'type', js: 'type', typ: r('WebConnectionProtocol3HandshakeType') },
    ],
    false
  ),
  WebConnectionProtocol3HandshakePayload: o(
    [
      { json: 'appLaunchTimeout', js: 'appLaunchTimeout', typ: u(undefined, 3.14) },
      { json: 'channelSelectorUrl', js: 'channelSelectorUrl', typ: u(true, '') },
      { json: 'fdc3Version', js: 'fdc3Version', typ: '' },
      { json: 'intentResolverUrl', js: 'intentResolverUrl', typ: u(true, '') },
      { json: 'messageExchangeTimeout', js: 'messageExchangeTimeout', typ: u(undefined, 3.14) },
    ],
    false
  ),
  WebConnectionProtocol4ValidateAppIdentity: o(
    [
      { json: 'meta', js: 'meta', typ: r('WebConnectionProtocol1HelloMeta') },
      { json: 'payload', js: 'payload', typ: r('WebConnectionProtocol4ValidateAppIdentityPayload') },
      { json: 'type', js: 'type', typ: r('WebConnectionProtocol4ValidateAppIdentityType') },
    ],
    false
  ),
  WebConnectionProtocol4ValidateAppIdentityPayload: o(
    [
      { json: 'actualUrl', js: 'actualUrl', typ: '' },
      { json: 'identityUrl', js: 'identityUrl', typ: '' },
      { json: 'instanceId', js: 'instanceId', typ: u(undefined, '') },
      { json: 'instanceUuid', js: 'instanceUuid', typ: u(undefined, '') },
    ],
    false
  ),
  WebConnectionProtocol5ValidateAppIdentityFailedResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('WebConnectionProtocol1HelloMeta') },
      { json: 'payload', js: 'payload', typ: r('WebConnectionProtocol5ValidateAppIdentityFailedResponsePayload') },
      { json: 'type', js: 'type', typ: r('WebConnectionProtocol5ValidateAppIdentityFailedResponseType') },
    ],
    false
  ),
  WebConnectionProtocol5ValidateAppIdentityFailedResponsePayload: o(
    [{ json: 'message', js: 'message', typ: u(undefined, '') }],
    false
  ),
  WebConnectionProtocol5ValidateAppIdentitySuccessResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('WebConnectionProtocol1HelloMeta') },
      { json: 'payload', js: 'payload', typ: r('WebConnectionProtocol5ValidateAppIdentitySuccessResponsePayload') },
      { json: 'type', js: 'type', typ: r('WebConnectionProtocol5ValidateAppIdentitySuccessResponseType') },
    ],
    false
  ),
  WebConnectionProtocol5ValidateAppIdentitySuccessResponsePayload: o(
    [
      { json: 'appId', js: 'appId', typ: '' },
      { json: 'implementationMetadata', js: 'implementationMetadata', typ: r('ImplementationMetadata') },
      { json: 'instanceId', js: 'instanceId', typ: '' },
      { json: 'instanceUuid', js: 'instanceUuid', typ: '' },
    ],
    false
  ),
  ImplementationMetadata: o(
    [
      { json: 'appMetadata', js: 'appMetadata', typ: r('AppMetadata') },
      { json: 'fdc3Version', js: 'fdc3Version', typ: '' },
      { json: 'optionalFeatures', js: 'optionalFeatures', typ: r('OptionalFeatures') },
      { json: 'provider', js: 'provider', typ: '' },
      { json: 'providerVersion', js: 'providerVersion', typ: u(undefined, '') },
    ],
    false
  ),
  AppMetadata: o(
    [
      { json: 'appId', js: 'appId', typ: '' },
      { json: 'description', js: 'description', typ: u(undefined, '') },
      { json: 'desktopAgent', js: 'desktopAgent', typ: u(undefined, '') },
      { json: 'icons', js: 'icons', typ: u(undefined, a(r('Icon'))) },
      { json: 'instanceId', js: 'instanceId', typ: u(undefined, '') },
      { json: 'instanceMetadata', js: 'instanceMetadata', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'resultType', js: 'resultType', typ: u(undefined, u(null, '')) },
      { json: 'screenshots', js: 'screenshots', typ: u(undefined, a(r('Image'))) },
      { json: 'title', js: 'title', typ: u(undefined, '') },
      { json: 'tooltip', js: 'tooltip', typ: u(undefined, '') },
      { json: 'version', js: 'version', typ: u(undefined, '') },
    ],
    false
  ),
  Icon: o(
    [
      { json: 'size', js: 'size', typ: u(undefined, '') },
      { json: 'src', js: 'src', typ: '' },
      { json: 'type', js: 'type', typ: u(undefined, '') },
    ],
    false
  ),
  Image: o(
    [
      { json: 'label', js: 'label', typ: u(undefined, '') },
      { json: 'size', js: 'size', typ: u(undefined, '') },
      { json: 'src', js: 'src', typ: '' },
      { json: 'type', js: 'type', typ: u(undefined, '') },
    ],
    false
  ),
  OptionalFeatures: o(
    [
      { json: 'DesktopAgentBridging', js: 'DesktopAgentBridging', typ: true },
      { json: 'OriginatingAppMetadata', js: 'OriginatingAppMetadata', typ: true },
      { json: 'UserChannelMembershipAPIs', js: 'UserChannelMembershipAPIs', typ: true },
    ],
    false
  ),
  WebConnectionProtocol6Goodbye: o(
    [
      { json: 'meta', js: 'meta', typ: r('WebConnectionProtocol6GoodbyeMeta') },
      { json: 'type', js: 'type', typ: r('WebConnectionProtocol6GoodbyeType') },
    ],
    false
  ),
  WebConnectionProtocol6GoodbyeMeta: o([{ json: 'timestamp', js: 'timestamp', typ: Date }], false),
  WebConnectionProtocolMessage: o(
    [
      { json: 'meta', js: 'meta', typ: r('ConnectionStepMetadata') },
      { json: 'payload', js: 'payload', typ: u(undefined, m('any')) },
      { json: 'type', js: 'type', typ: r('ConnectionStepMessageType') },
    ],
    false
  ),
  ConnectionStepMetadata: o(
    [
      { json: 'timestamp', js: 'timestamp', typ: Date },
      { json: 'connectionAttemptUuid', js: 'connectionAttemptUuid', typ: u(undefined, '') },
    ],
    false
  ),
  AddContextListenerRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('AddContextListenerRequestPayload') },
      { json: 'type', js: 'type', typ: r('AddContextListenerRequestType') },
    ],
    false
  ),
  AddContextListenerRequestMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: u(undefined, r('AppIdentifier')) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  AppIdentifier: o(
    [
      { json: 'appId', js: 'appId', typ: '' },
      { json: 'desktopAgent', js: 'desktopAgent', typ: u(undefined, '') },
      { json: 'instanceId', js: 'instanceId', typ: u(undefined, '') },
    ],
    'any'
  ),
  AddContextListenerRequestPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: u(null, '') },
      { json: 'contextType', js: 'contextType', typ: u(null, '') },
    ],
    false
  ),
  AddContextListenerResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('AddContextListenerResponsePayload') },
      { json: 'type', js: 'type', typ: r('AddContextListenerResponseType') },
    ],
    false
  ),
  AddContextListenerResponseMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'source', js: 'source', typ: u(undefined, r('AppIdentifier')) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  AddContextListenerResponsePayload: o(
    [
      { json: 'error', js: 'error', typ: u(undefined, r('PurpleError')) },
      { json: 'listenerUUID', js: 'listenerUUID', typ: u(undefined, '') },
    ],
    false
  ),
  AddEventListenerRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('AddEventListenerRequestPayload') },
      { json: 'type', js: 'type', typ: r('AddEventListenerRequestType') },
    ],
    false
  ),
  AddEventListenerRequestPayload: o([{ json: 'type', js: 'type', typ: u(r('FDC3EventType'), null) }], false),
  AddEventListenerResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('AddEventListenerResponsePayload') },
      { json: 'type', js: 'type', typ: r('AddEventListenerResponseType') },
    ],
    false
  ),
  AddEventListenerResponsePayload: o(
    [
      { json: 'error', js: 'error', typ: u(undefined, r('ResponsePayloadError')) },
      { json: 'listenerUUID', js: 'listenerUUID', typ: u(undefined, '') },
    ],
    false
  ),
  AddIntentListenerRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('AddIntentListenerRequestPayload') },
      { json: 'type', js: 'type', typ: r('AddIntentListenerRequestType') },
    ],
    false
  ),
  AddIntentListenerRequestPayload: o([{ json: 'intent', js: 'intent', typ: '' }], false),
  AddIntentListenerResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('PayloadObject') },
      { json: 'type', js: 'type', typ: r('AddIntentListenerResponseType') },
    ],
    false
  ),
  PayloadObject: o(
    [
      { json: 'error', js: 'error', typ: u(undefined, r('FluffyError')) },
      { json: 'listenerUUID', js: 'listenerUUID', typ: u(undefined, '') },
    ],
    'any'
  ),
  AgentEventMessage: o(
    [
      { json: 'meta', js: 'meta', typ: r('AgentEventMessageMeta') },
      { json: 'payload', js: 'payload', typ: m('any') },
      { json: 'type', js: 'type', typ: r('EventMessageType') },
    ],
    false
  ),
  AgentEventMessageMeta: o(
    [
      { json: 'eventUuid', js: 'eventUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  AgentResponseMessage: o(
    [
      { json: 'meta', js: 'meta', typ: r('AgentResponseMessageMeta') },
      { json: 'payload', js: 'payload', typ: r('AgentResponseMessageResponsePayload') },
      { json: 'type', js: 'type', typ: r('ResponseMessageType') },
    ],
    false
  ),
  AgentResponseMessageMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'source', js: 'source', typ: u(undefined, r('AppIdentifier')) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  AgentResponseMessageResponsePayload: o(
    [{ json: 'error', js: 'error', typ: u(undefined, r('ResponsePayloadError')) }],
    'any'
  ),
  AppRequestMessage: o(
    [
      { json: 'meta', js: 'meta', typ: r('AppRequestMessageMeta') },
      { json: 'payload', js: 'payload', typ: m('any') },
      { json: 'type', js: 'type', typ: r('RequestMessageType') },
    ],
    false
  ),
  AppRequestMessageMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: u(undefined, r('AppIdentifier')) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  BroadcastEvent: o(
    [
      { json: 'meta', js: 'meta', typ: r('BroadcastEventMeta') },
      { json: 'payload', js: 'payload', typ: r('BroadcastEventPayload') },
      { json: 'type', js: 'type', typ: r('BroadcastEventType') },
    ],
    false
  ),
  BroadcastEventMeta: o(
    [
      { json: 'eventUuid', js: 'eventUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  BroadcastEventPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: u(null, '') },
      { json: 'context', js: 'context', typ: r('Context') },
      { json: 'originatingApp', js: 'originatingApp', typ: u(undefined, r('AppIdentifier')) },
    ],
    false
  ),
  Context: o(
    [
      { json: 'id', js: 'id', typ: u(undefined, m('any')) },
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: '' },
    ],
    'any'
  ),
  BroadcastRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('BroadcastRequestPayload') },
      { json: 'type', js: 'type', typ: r('BroadcastRequestType') },
    ],
    false
  ),
  BroadcastRequestPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: '' },
      { json: 'context', js: 'context', typ: r('Context') },
    ],
    false
  ),
  BroadcastResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('BroadcastResponseResponsePayload') },
      { json: 'type', js: 'type', typ: r('BroadcastResponseType') },
    ],
    false
  ),
  BroadcastResponseResponsePayload: o(
    [{ json: 'error', js: 'error', typ: u(undefined, r('ResponsePayloadError')) }],
    'any'
  ),
  ChannelChangedEvent: o(
    [
      { json: 'meta', js: 'meta', typ: r('BroadcastEventMeta') },
      { json: 'payload', js: 'payload', typ: r('ChannelChangedEventPayload') },
      { json: 'type', js: 'type', typ: r('ChannelChangedEventType') },
    ],
    false
  ),
  ChannelChangedEventPayload: o(
    [
      { json: 'newChannelId', js: 'newChannelId', typ: u(null, '') },
      { json: 'userChannels', js: 'userChannels', typ: u(undefined, a(r('Channel'))) },
    ],
    false
  ),
  Channel: o(
    [
      { json: 'displayMetadata', js: 'displayMetadata', typ: u(undefined, r('DisplayMetadata')) },
      { json: 'id', js: 'id', typ: '' },
      { json: 'type', js: 'type', typ: r('Type') },
    ],
    false
  ),
  DisplayMetadata: o(
    [
      { json: 'color', js: 'color', typ: u(undefined, '') },
      { json: 'glyph', js: 'glyph', typ: u(undefined, '') },
      { json: 'name', js: 'name', typ: u(undefined, '') },
    ],
    false
  ),
  ContextListenerUnsubscribeRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('ContextListenerUnsubscribeRequestPayload') },
      { json: 'type', js: 'type', typ: r('ContextListenerUnsubscribeRequestType') },
    ],
    false
  ),
  ContextListenerUnsubscribeRequestPayload: o([{ json: 'listenerUUID', js: 'listenerUUID', typ: '' }], false),
  ContextListenerUnsubscribeResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('BroadcastResponseResponsePayload') },
      { json: 'type', js: 'type', typ: r('ContextListenerUnsubscribeResponseType') },
    ],
    false
  ),
  CreatePrivateChannelRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('CreatePrivateChannelRequestPayload') },
      { json: 'type', js: 'type', typ: r('CreatePrivateChannelRequestType') },
    ],
    false
  ),
  CreatePrivateChannelRequestPayload: o([], false),
  CreatePrivateChannelResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('CreatePrivateChannelResponsePayload') },
      { json: 'type', js: 'type', typ: r('CreatePrivateChannelResponseType') },
    ],
    false
  ),
  CreatePrivateChannelResponsePayload: o(
    [
      { json: 'error', js: 'error', typ: u(undefined, r('PurpleError')) },
      { json: 'privateChannel', js: 'privateChannel', typ: u(undefined, r('Channel')) },
    ],
    false
  ),
  EventListenerUnsubscribeRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('EventListenerUnsubscribeRequestPayload') },
      { json: 'type', js: 'type', typ: r('EventListenerUnsubscribeRequestType') },
    ],
    false
  ),
  EventListenerUnsubscribeRequestPayload: o([{ json: 'listenerUUID', js: 'listenerUUID', typ: '' }], false),
  EventListenerUnsubscribeResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('BroadcastResponseResponsePayload') },
      { json: 'type', js: 'type', typ: r('EventListenerUnsubscribeResponseType') },
    ],
    false
  ),
  Fdc3UserInterfaceChannelSelected: o(
    [
      { json: 'payload', js: 'payload', typ: r('Fdc3UserInterfaceChannelSelectedPayload') },
      { json: 'type', js: 'type', typ: r('Fdc3UserInterfaceChannelSelectedType') },
    ],
    false
  ),
  Fdc3UserInterfaceChannelSelectedPayload: o([{ json: 'selected', js: 'selected', typ: u(null, '') }], false),
  Fdc3UserInterfaceChannels: o(
    [
      { json: 'payload', js: 'payload', typ: r('Fdc3UserInterfaceChannelsPayload') },
      { json: 'type', js: 'type', typ: r('Fdc3UserInterfaceChannelsType') },
    ],
    false
  ),
  Fdc3UserInterfaceChannelsPayload: o(
    [
      { json: 'selected', js: 'selected', typ: u(null, '') },
      { json: 'userChannels', js: 'userChannels', typ: a(r('Channel')) },
    ],
    false
  ),
  Fdc3UserInterfaceDrag: o(
    [
      { json: 'payload', js: 'payload', typ: r('Fdc3UserInterfaceDragPayload') },
      { json: 'type', js: 'type', typ: r('Fdc3UserInterfaceDragType') },
    ],
    false
  ),
  Fdc3UserInterfaceDragPayload: o([{ json: 'mouseOffsets', js: 'mouseOffsets', typ: r('MouseOffsets') }], false),
  MouseOffsets: o(
    [
      { json: 'x', js: 'x', typ: 0 },
      { json: 'y', js: 'y', typ: 0 },
    ],
    false
  ),
  Fdc3UserInterfaceHandshake: o(
    [
      { json: 'payload', js: 'payload', typ: r('Fdc3UserInterfaceHandshakePayload') },
      { json: 'type', js: 'type', typ: r('Fdc3UserInterfaceHandshakeType') },
    ],
    false
  ),
  Fdc3UserInterfaceHandshakePayload: o([{ json: 'fdc3Version', js: 'fdc3Version', typ: '' }], false),
  Fdc3UserInterfaceHello: o(
    [
      { json: 'payload', js: 'payload', typ: r('Fdc3UserInterfaceHelloPayload') },
      { json: 'type', js: 'type', typ: r('Fdc3UserInterfaceHelloType') },
    ],
    false
  ),
  Fdc3UserInterfaceHelloPayload: o(
    [
      { json: 'implementationDetails', js: 'implementationDetails', typ: '' },
      { json: 'initialCSS', js: 'initialCSS', typ: r('InitialCSS') },
    ],
    false
  ),
  InitialCSS: o(
    [
      { json: 'bottom', js: 'bottom', typ: u(undefined, '') },
      { json: 'height', js: 'height', typ: u(undefined, '') },
      { json: 'left', js: 'left', typ: u(undefined, '') },
      { json: 'maxHeight', js: 'maxHeight', typ: u(undefined, '') },
      { json: 'maxWidth', js: 'maxWidth', typ: u(undefined, '') },
      { json: 'right', js: 'right', typ: u(undefined, '') },
      { json: 'top', js: 'top', typ: u(undefined, '') },
      { json: 'transition', js: 'transition', typ: u(undefined, '') },
      { json: 'width', js: 'width', typ: u(undefined, '') },
      { json: 'zIndex', js: 'zIndex', typ: u(undefined, '') },
    ],
    'any'
  ),
  Fdc3UserInterfaceMessage: o(
    [
      { json: 'payload', js: 'payload', typ: u(undefined, m('any')) },
      { json: 'type', js: 'type', typ: r('Fdc3UserInterfaceMessageType') },
    ],
    false
  ),
  Fdc3UserInterfaceResolve: o(
    [
      { json: 'payload', js: 'payload', typ: r('Fdc3UserInterfaceResolvePayload') },
      { json: 'type', js: 'type', typ: r('Fdc3UserInterfaceResolveType') },
    ],
    false
  ),
  Fdc3UserInterfaceResolvePayload: o(
    [
      { json: 'appIntents', js: 'appIntents', typ: a(r('AppIntent')) },
      { json: 'context', js: 'context', typ: r('Context') },
    ],
    false
  ),
  AppIntent: o(
    [
      { json: 'apps', js: 'apps', typ: a(r('AppMetadata')) },
      { json: 'intent', js: 'intent', typ: r('IntentMetadata') },
    ],
    false
  ),
  IntentMetadata: o(
    [
      { json: 'displayName', js: 'displayName', typ: u(undefined, '') },
      { json: 'name', js: 'name', typ: '' },
    ],
    false
  ),
  Fdc3UserInterfaceResolveAction: o(
    [
      { json: 'payload', js: 'payload', typ: r('Fdc3UserInterfaceResolveActionPayload') },
      { json: 'type', js: 'type', typ: r('Fdc3UserInterfaceResolveActionType') },
    ],
    false
  ),
  Fdc3UserInterfaceResolveActionPayload: o(
    [
      { json: 'action', js: 'action', typ: r('Action') },
      { json: 'appIdentifier', js: 'appIdentifier', typ: u(undefined, r('AppIdentifier')) },
      { json: 'intent', js: 'intent', typ: u(undefined, '') },
    ],
    false
  ),
  Fdc3UserInterfaceRestyle: o(
    [
      { json: 'payload', js: 'payload', typ: r('Fdc3UserInterfaceRestylePayload') },
      { json: 'type', js: 'type', typ: r('Fdc3UserInterfaceRestyleType') },
    ],
    false
  ),
  Fdc3UserInterfaceRestylePayload: o([{ json: 'updatedCSS', js: 'updatedCSS', typ: r('UpdatedCSS') }], false),
  UpdatedCSS: o(
    [
      { json: 'bottom', js: 'bottom', typ: u(undefined, '') },
      { json: 'height', js: 'height', typ: u(undefined, '') },
      { json: 'left', js: 'left', typ: u(undefined, '') },
      { json: 'maxHeight', js: 'maxHeight', typ: u(undefined, '') },
      { json: 'maxWidth', js: 'maxWidth', typ: u(undefined, '') },
      { json: 'right', js: 'right', typ: u(undefined, '') },
      { json: 'top', js: 'top', typ: u(undefined, '') },
      { json: 'transition', js: 'transition', typ: u(undefined, '') },
      { json: 'width', js: 'width', typ: u(undefined, '') },
      { json: 'zIndex', js: 'zIndex', typ: u(undefined, '') },
    ],
    'any'
  ),
  FindInstancesRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('FindInstancesRequestPayload') },
      { json: 'type', js: 'type', typ: r('FindInstancesRequestType') },
    ],
    false
  ),
  FindInstancesRequestPayload: o([{ json: 'app', js: 'app', typ: r('AppIdentifier') }], false),
  FindInstancesResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('FindInstancesResponsePayload') },
      { json: 'type', js: 'type', typ: r('FindInstancesResponseType') },
    ],
    false
  ),
  FindInstancesResponsePayload: o(
    [
      { json: 'error', js: 'error', typ: u(undefined, r('FindInstancesErrors')) },
      { json: 'appIdentifiers', js: 'appIdentifiers', typ: u(undefined, a(r('AppMetadata'))) },
    ],
    false
  ),
  FindIntentRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('FindIntentRequestPayload') },
      { json: 'type', js: 'type', typ: r('FindIntentRequestType') },
    ],
    false
  ),
  FindIntentRequestPayload: o(
    [
      { json: 'context', js: 'context', typ: u(undefined, r('Context')) },
      { json: 'intent', js: 'intent', typ: '' },
      { json: 'resultType', js: 'resultType', typ: u(undefined, '') },
    ],
    false
  ),
  FindIntentResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('FindIntentResponsePayload') },
      { json: 'type', js: 'type', typ: r('FindIntentResponseType') },
    ],
    false
  ),
  FindIntentResponsePayload: o(
    [
      { json: 'error', js: 'error', typ: u(undefined, r('FindInstancesErrors')) },
      { json: 'appIntent', js: 'appIntent', typ: u(undefined, r('AppIntent')) },
    ],
    false
  ),
  FindIntentsByContextRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('FindIntentsByContextRequestPayload') },
      { json: 'type', js: 'type', typ: r('FindIntentsByContextRequestType') },
    ],
    false
  ),
  FindIntentsByContextRequestPayload: o(
    [
      { json: 'context', js: 'context', typ: r('Context') },
      { json: 'resultType', js: 'resultType', typ: u(undefined, '') },
    ],
    false
  ),
  FindIntentsByContextResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('FindIntentsByContextResponsePayload') },
      { json: 'type', js: 'type', typ: r('FindIntentsByContextResponseType') },
    ],
    false
  ),
  FindIntentsByContextResponsePayload: o(
    [
      { json: 'error', js: 'error', typ: u(undefined, r('FindInstancesErrors')) },
      { json: 'appIntents', js: 'appIntents', typ: u(undefined, a(r('AppIntent'))) },
    ],
    false
  ),
  GetAppMetadataRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('GetAppMetadataRequestPayload') },
      { json: 'type', js: 'type', typ: r('GetAppMetadataRequestType') },
    ],
    false
  ),
  GetAppMetadataRequestPayload: o([{ json: 'app', js: 'app', typ: r('AppIdentifier') }], false),
  GetAppMetadataResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('GetAppMetadataResponsePayload') },
      { json: 'type', js: 'type', typ: r('GetAppMetadataResponseType') },
    ],
    false
  ),
  GetAppMetadataResponsePayload: o(
    [
      { json: 'error', js: 'error', typ: u(undefined, r('FindInstancesErrors')) },
      { json: 'appMetadata', js: 'appMetadata', typ: u(undefined, r('AppMetadata')) },
    ],
    false
  ),
  GetCurrentChannelRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('GetCurrentChannelRequestPayload') },
      { json: 'type', js: 'type', typ: r('GetCurrentChannelRequestType') },
    ],
    false
  ),
  GetCurrentChannelRequestPayload: o([], false),
  GetCurrentChannelResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('GetCurrentChannelResponsePayload') },
      { json: 'type', js: 'type', typ: r('GetCurrentChannelResponseType') },
    ],
    false
  ),
  GetCurrentChannelResponsePayload: o(
    [
      { json: 'error', js: 'error', typ: u(undefined, r('ResponsePayloadError')) },
      { json: 'channel', js: 'channel', typ: u(undefined, u(r('Channel'), null)) },
    ],
    false
  ),
  GetCurrentContextRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('GetCurrentContextRequestPayload') },
      { json: 'type', js: 'type', typ: r('GetCurrentContextRequestType') },
    ],
    false
  ),
  GetCurrentContextRequestPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: '' },
      { json: 'contextType', js: 'contextType', typ: u(null, '') },
    ],
    false
  ),
  GetCurrentContextResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('GetCurrentContextResponsePayload') },
      { json: 'type', js: 'type', typ: r('GetCurrentContextResponseType') },
    ],
    false
  ),
  GetCurrentContextResponsePayload: o(
    [
      { json: 'error', js: 'error', typ: u(undefined, r('PurpleError')) },
      { json: 'context', js: 'context', typ: u(undefined, u(null, r('Context'))) },
    ],
    false
  ),
  GetInfoRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('GetInfoRequestPayload') },
      { json: 'type', js: 'type', typ: r('GetInfoRequestType') },
    ],
    false
  ),
  GetInfoRequestPayload: o([], false),
  GetInfoResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('GetInfoResponsePayload') },
      { json: 'type', js: 'type', typ: r('GetInfoResponseType') },
    ],
    false
  ),
  GetInfoResponsePayload: o(
    [
      { json: 'error', js: 'error', typ: u(undefined, r('ResponsePayloadError')) },
      { json: 'implementationMetadata', js: 'implementationMetadata', typ: u(undefined, r('ImplementationMetadata')) },
    ],
    false
  ),
  GetOrCreateChannelRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('GetOrCreateChannelRequestPayload') },
      { json: 'type', js: 'type', typ: r('GetOrCreateChannelRequestType') },
    ],
    false
  ),
  GetOrCreateChannelRequestPayload: o([{ json: 'channelId', js: 'channelId', typ: '' }], false),
  GetOrCreateChannelResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('GetOrCreateChannelResponsePayload') },
      { json: 'type', js: 'type', typ: r('GetOrCreateChannelResponseType') },
    ],
    false
  ),
  GetOrCreateChannelResponsePayload: o(
    [
      { json: 'error', js: 'error', typ: u(undefined, r('PurpleError')) },
      { json: 'channel', js: 'channel', typ: u(undefined, r('Channel')) },
    ],
    false
  ),
  GetUserChannelsRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('GetUserChannelsRequestPayload') },
      { json: 'type', js: 'type', typ: r('GetUserChannelsRequestType') },
    ],
    false
  ),
  GetUserChannelsRequestPayload: o([], false),
  GetUserChannelsResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('GetUserChannelsResponsePayload') },
      { json: 'type', js: 'type', typ: r('GetUserChannelsResponseType') },
    ],
    false
  ),
  GetUserChannelsResponsePayload: o(
    [
      { json: 'error', js: 'error', typ: u(undefined, r('PurpleError')) },
      { json: 'userChannels', js: 'userChannels', typ: u(undefined, a(r('Channel'))) },
    ],
    false
  ),
  HeartbeatAcknowledgementRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('HeartbeatAcknowledgementRequestPayload') },
      { json: 'type', js: 'type', typ: r('HeartbeatAcknowledgementRequestType') },
    ],
    false
  ),
  HeartbeatAcknowledgementRequestPayload: o([{ json: 'heartbeatEventUuid', js: 'heartbeatEventUuid', typ: '' }], false),
  HeartbeatEvent: o(
    [
      { json: 'meta', js: 'meta', typ: r('BroadcastEventMeta') },
      { json: 'payload', js: 'payload', typ: r('HeartbeatEventPayload') },
      { json: 'type', js: 'type', typ: r('HeartbeatEventType') },
    ],
    false
  ),
  HeartbeatEventPayload: o([], false),
  IntentEvent: o(
    [
      { json: 'meta', js: 'meta', typ: r('BroadcastEventMeta') },
      { json: 'payload', js: 'payload', typ: r('IntentEventPayload') },
      { json: 'type', js: 'type', typ: r('IntentEventType') },
    ],
    false
  ),
  IntentEventPayload: o(
    [
      { json: 'context', js: 'context', typ: r('Context') },
      { json: 'intent', js: 'intent', typ: '' },
      { json: 'originatingApp', js: 'originatingApp', typ: u(undefined, r('AppIdentifier')) },
      { json: 'raiseIntentRequestUuid', js: 'raiseIntentRequestUuid', typ: '' },
    ],
    false
  ),
  IntentListenerUnsubscribeRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('IntentListenerUnsubscribeRequestPayload') },
      { json: 'type', js: 'type', typ: r('IntentListenerUnsubscribeRequestType') },
    ],
    false
  ),
  IntentListenerUnsubscribeRequestPayload: o([{ json: 'listenerUUID', js: 'listenerUUID', typ: '' }], false),
  IntentListenerUnsubscribeResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('BroadcastResponseResponsePayload') },
      { json: 'type', js: 'type', typ: r('IntentListenerUnsubscribeResponseType') },
    ],
    false
  ),
  IntentResultRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('IntentResultRequestPayload') },
      { json: 'type', js: 'type', typ: r('IntentResultRequestType') },
    ],
    false
  ),
  IntentResultRequestPayload: o(
    [
      { json: 'intentEventUuid', js: 'intentEventUuid', typ: '' },
      { json: 'intentResult', js: 'intentResult', typ: r('IntentResult') },
      { json: 'raiseIntentRequestUuid', js: 'raiseIntentRequestUuid', typ: '' },
    ],
    false
  ),
  IntentResult: o(
    [
      { json: 'context', js: 'context', typ: u(undefined, r('Context')) },
      { json: 'channel', js: 'channel', typ: u(undefined, r('Channel')) },
    ],
    false
  ),
  IntentResultResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('BroadcastResponseResponsePayload') },
      { json: 'type', js: 'type', typ: r('IntentResultResponseType') },
    ],
    false
  ),
  JoinUserChannelRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('JoinUserChannelRequestPayload') },
      { json: 'type', js: 'type', typ: r('JoinUserChannelRequestType') },
    ],
    false
  ),
  JoinUserChannelRequestPayload: o([{ json: 'channelId', js: 'channelId', typ: '' }], false),
  JoinUserChannelResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('JoinUserChannelResponsePayload') },
      { json: 'type', js: 'type', typ: r('JoinUserChannelResponseType') },
    ],
    false
  ),
  JoinUserChannelResponsePayload: o([{ json: 'error', js: 'error', typ: u(undefined, r('PurpleError')) }], false),
  LeaveCurrentChannelRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('LeaveCurrentChannelRequestPayload') },
      { json: 'type', js: 'type', typ: r('LeaveCurrentChannelRequestType') },
    ],
    false
  ),
  LeaveCurrentChannelRequestPayload: o([], false),
  LeaveCurrentChannelResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('LeaveCurrentChannelResponsePayload') },
      { json: 'type', js: 'type', typ: r('LeaveCurrentChannelResponseType') },
    ],
    false
  ),
  LeaveCurrentChannelResponsePayload: o([{ json: 'error', js: 'error', typ: u(undefined, r('PurpleError')) }], false),
  OpenRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('OpenRequestPayload') },
      { json: 'type', js: 'type', typ: r('OpenRequestType') },
    ],
    false
  ),
  OpenRequestPayload: o(
    [
      { json: 'app', js: 'app', typ: r('AppIdentifier') },
      { json: 'context', js: 'context', typ: u(undefined, r('Context')) },
    ],
    false
  ),
  OpenResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('OpenResponsePayload') },
      { json: 'type', js: 'type', typ: r('OpenResponseType') },
    ],
    false
  ),
  OpenResponsePayload: o(
    [
      { json: 'error', js: 'error', typ: u(undefined, r('OpenErrorResponsePayload')) },
      { json: 'appIdentifier', js: 'appIdentifier', typ: u(undefined, r('AppIdentifier')) },
    ],
    false
  ),
  PrivateChannelAddEventListenerRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelAddEventListenerRequestPayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelAddEventListenerRequestType') },
    ],
    false
  ),
  PrivateChannelAddEventListenerRequestPayload: o(
    [
      { json: 'listenerType', js: 'listenerType', typ: u(r('PrivateChannelEventType'), null) },
      { json: 'privateChannelId', js: 'privateChannelId', typ: '' },
    ],
    false
  ),
  PrivateChannelAddEventListenerResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelAddEventListenerResponsePayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelAddEventListenerResponseType') },
    ],
    false
  ),
  PrivateChannelAddEventListenerResponsePayload: o(
    [
      { json: 'error', js: 'error', typ: u(undefined, r('PurpleError')) },
      { json: 'listenerUUID', js: 'listenerUUID', typ: u(undefined, '') },
    ],
    false
  ),
  PrivateChannelDisconnectRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelDisconnectRequestPayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelDisconnectRequestType') },
    ],
    false
  ),
  PrivateChannelDisconnectRequestPayload: o([{ json: 'channelId', js: 'channelId', typ: '' }], false),
  PrivateChannelDisconnectResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelDisconnectResponsePayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelDisconnectResponseType') },
    ],
    false
  ),
  PrivateChannelDisconnectResponsePayload: o(
    [{ json: 'error', js: 'error', typ: u(undefined, r('PurpleError')) }],
    false
  ),
  PrivateChannelOnAddContextListenerEvent: o(
    [
      { json: 'meta', js: 'meta', typ: r('BroadcastEventMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelOnAddContextListenerEventPayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelOnAddContextListenerEventType') },
    ],
    false
  ),
  PrivateChannelOnAddContextListenerEventPayload: o(
    [
      { json: 'contextType', js: 'contextType', typ: u(null, '') },
      { json: 'privateChannelId', js: 'privateChannelId', typ: '' },
    ],
    false
  ),
  PrivateChannelOnDisconnectEvent: o(
    [
      { json: 'meta', js: 'meta', typ: r('BroadcastEventMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelOnDisconnectEventPayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelOnDisconnectEventType') },
    ],
    false
  ),
  PrivateChannelOnDisconnectEventPayload: o([{ json: 'privateChannelId', js: 'privateChannelId', typ: '' }], false),
  PrivateChannelOnUnsubscribeEvent: o(
    [
      { json: 'meta', js: 'meta', typ: r('BroadcastEventMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelOnUnsubscribeEventPayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelOnUnsubscribeEventType') },
    ],
    false
  ),
  PrivateChannelOnUnsubscribeEventPayload: o(
    [
      { json: 'contextType', js: 'contextType', typ: u(null, '') },
      { json: 'privateChannelId', js: 'privateChannelId', typ: '' },
    ],
    false
  ),
  PrivateChannelUnsubscribeEventListenerRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelUnsubscribeEventListenerRequestPayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelUnsubscribeEventListenerRequestType') },
    ],
    false
  ),
  PrivateChannelUnsubscribeEventListenerRequestPayload: o(
    [{ json: 'listenerUUID', js: 'listenerUUID', typ: '' }],
    false
  ),
  PrivateChannelUnsubscribeEventListenerResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('BroadcastResponseResponsePayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelUnsubscribeEventListenerResponseType') },
    ],
    false
  ),
  RaiseIntentForContextRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('RaiseIntentForContextRequestPayload') },
      { json: 'type', js: 'type', typ: r('RaiseIntentForContextRequestType') },
    ],
    false
  ),
  RaiseIntentForContextRequestPayload: o(
    [
      { json: 'app', js: 'app', typ: u(undefined, r('AppIdentifier')) },
      { json: 'context', js: 'context', typ: r('Context') },
    ],
    false
  ),
  RaiseIntentForContextResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('RaiseIntentForContextResponsePayload') },
      { json: 'type', js: 'type', typ: r('RaiseIntentForContextResponseType') },
    ],
    false
  ),
  RaiseIntentForContextResponsePayload: o(
    [
      { json: 'error', js: 'error', typ: u(undefined, r('FindInstancesErrors')) },
      { json: 'intentResolution', js: 'intentResolution', typ: u(undefined, r('IntentResolution')) },
      { json: 'appIntents', js: 'appIntents', typ: u(undefined, a(r('AppIntent'))) },
    ],
    false
  ),
  IntentResolution: o(
    [
      { json: 'intent', js: 'intent', typ: '' },
      { json: 'source', js: 'source', typ: r('AppIdentifier') },
    ],
    false
  ),
  RaiseIntentRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('RaiseIntentRequestPayload') },
      { json: 'type', js: 'type', typ: r('RaiseIntentRequestType') },
    ],
    false
  ),
  RaiseIntentRequestPayload: o(
    [
      { json: 'app', js: 'app', typ: u(undefined, r('AppIdentifier')) },
      { json: 'context', js: 'context', typ: r('Context') },
      { json: 'intent', js: 'intent', typ: '' },
    ],
    false
  ),
  RaiseIntentResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('RaiseIntentResponsePayload') },
      { json: 'type', js: 'type', typ: r('RaiseIntentResponseType') },
    ],
    false
  ),
  RaiseIntentResponsePayload: o(
    [
      { json: 'error', js: 'error', typ: u(undefined, r('FindInstancesErrors')) },
      { json: 'intentResolution', js: 'intentResolution', typ: u(undefined, r('IntentResolution')) },
      { json: 'appIntent', js: 'appIntent', typ: u(undefined, r('AppIntent')) },
    ],
    false
  ),
  RaiseIntentResultResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('RaiseIntentResultResponsePayload') },
      { json: 'type', js: 'type', typ: r('RaiseIntentResultResponseType') },
    ],
    false
  ),
  RaiseIntentResultResponsePayload: o(
    [
      { json: 'error', js: 'error', typ: u(undefined, r('ResponsePayloadError')) },
      { json: 'intentResult', js: 'intentResult', typ: u(undefined, r('IntentResult')) },
    ],
    false
  ),
  WebConnectionProtocol1HelloType: ['WCP1Hello'],
  WebConnectionProtocol2LoadURLType: ['WCP2LoadUrl'],
  WebConnectionProtocol3HandshakeType: ['WCP3Handshake'],
  WebConnectionProtocol4ValidateAppIdentityType: ['WCP4ValidateAppIdentity'],
  WebConnectionProtocol5ValidateAppIdentityFailedResponseType: ['WCP5ValidateAppIdentityFailedResponse'],
  WebConnectionProtocol5ValidateAppIdentitySuccessResponseType: ['WCP5ValidateAppIdentityResponse'],
  WebConnectionProtocol6GoodbyeType: ['WCP6Goodbye'],
  ConnectionStepMessageType: [
    'WCP1Hello',
    'WCP2LoadUrl',
    'WCP3Handshake',
    'WCP4ValidateAppIdentity',
    'WCP5ValidateAppIdentityFailedResponse',
    'WCP5ValidateAppIdentityResponse',
    'WCP6Goodbye',
  ],
  AddContextListenerRequestType: ['addContextListenerRequest'],
  PurpleError: ['ApiTimeout', 'AccessDenied', 'CreationFailed', 'MalformedContext', 'NoChannelFound'],
  AddContextListenerResponseType: ['addContextListenerResponse'],
  FDC3EventType: ['USER_CHANNEL_CHANGED'],
  AddEventListenerRequestType: ['addEventListenerRequest'],
  ResponsePayloadError: [
    'ApiTimeout',
    'AccessDenied',
    'AgentDisconnected',
    'AppNotFound',
    'AppTimeout',
    'CreationFailed',
    'DesktopAgentNotFound',
    'ErrorOnLaunch',
    'IntentDeliveryFailed',
    'IntentHandlerRejected',
    'MalformedContext',
    'MalformedMessage',
    'NoAppsFound',
    'NoChannelFound',
    'NoResultReturned',
    'NotConnectedToBridge',
    'ResolverTimeout',
    'ResolverUnavailable',
    'ResponseToBridgeTimedOut',
    'TargetAppUnavailable',
    'TargetInstanceUnavailable',
    'UserCancelledResolution',
  ],
  AddEventListenerResponseType: ['addEventListenerResponse'],
  AddIntentListenerRequestType: ['addIntentListenerRequest'],
  FluffyError: [
    'ApiTimeout',
    'DesktopAgentNotFound',
    'IntentDeliveryFailed',
    'MalformedContext',
    'NoAppsFound',
    'ResolverTimeout',
    'ResolverUnavailable',
    'TargetAppUnavailable',
    'TargetInstanceUnavailable',
    'UserCancelledResolution',
  ],
  AddIntentListenerResponseType: ['addIntentListenerResponse'],
  EventMessageType: [
    'addEventListenerEvent',
    'broadcastEvent',
    'channelChangedEvent',
    'heartbeatEvent',
    'intentEvent',
    'privateChannelOnAddContextListenerEvent',
    'privateChannelOnDisconnectEvent',
    'privateChannelOnUnsubscribeEvent',
  ],
  ResponseMessageType: [
    'addContextListenerResponse',
    'addEventListenerResponse',
    'addIntentListenerResponse',
    'broadcastResponse',
    'contextListenerUnsubscribeResponse',
    'createPrivateChannelResponse',
    'eventListenerUnsubscribeResponse',
    'findInstancesResponse',
    'findIntentResponse',
    'findIntentsByContextResponse',
    'getAppMetadataResponse',
    'getCurrentChannelResponse',
    'getCurrentContextResponse',
    'getInfoResponse',
    'getOrCreateChannelResponse',
    'getUserChannelsResponse',
    'intentListenerUnsubscribeResponse',
    'intentResultResponse',
    'joinUserChannelResponse',
    'leaveCurrentChannelResponse',
    'openResponse',
    'privateChannelAddEventListenerResponse',
    'privateChannelDisconnectResponse',
    'privateChannelUnsubscribeEventListenerResponse',
    'raiseIntentForContextResponse',
    'raiseIntentResponse',
    'raiseIntentResultResponse',
  ],
  RequestMessageType: [
    'addContextListenerRequest',
    'addEventListenerRequest',
    'addIntentListenerRequest',
    'broadcastRequest',
    'contextListenerUnsubscribeRequest',
    'createPrivateChannelRequest',
    'eventListenerUnsubscribeRequest',
    'findInstancesRequest',
    'findIntentRequest',
    'findIntentsByContextRequest',
    'getAppMetadataRequest',
    'getCurrentChannelRequest',
    'getCurrentContextRequest',
    'getInfoRequest',
    'getOrCreateChannelRequest',
    'getUserChannelsRequest',
    'heartbeatAcknowledgementRequest',
    'intentListenerUnsubscribeRequest',
    'intentResultRequest',
    'joinUserChannelRequest',
    'leaveCurrentChannelRequest',
    'openRequest',
    'privateChannelAddEventListenerRequest',
    'privateChannelDisconnectRequest',
    'privateChannelUnsubscribeEventListenerRequest',
    'raiseIntentForContextRequest',
    'raiseIntentRequest',
  ],
  BroadcastEventType: ['broadcastEvent'],
  BroadcastRequestType: ['broadcastRequest'],
  BroadcastResponseType: ['broadcastResponse'],
  Type: ['app', 'private', 'user'],
  ChannelChangedEventType: ['channelChangedEvent'],
  ContextListenerUnsubscribeRequestType: ['contextListenerUnsubscribeRequest'],
  ContextListenerUnsubscribeResponseType: ['contextListenerUnsubscribeResponse'],
  CreatePrivateChannelRequestType: ['createPrivateChannelRequest'],
  CreatePrivateChannelResponseType: ['createPrivateChannelResponse'],
  EventListenerUnsubscribeRequestType: ['eventListenerUnsubscribeRequest'],
  EventListenerUnsubscribeResponseType: ['eventListenerUnsubscribeResponse'],
  Fdc3UserInterfaceChannelSelectedType: ['Fdc3UserInterfaceChannelSelected'],
  Fdc3UserInterfaceChannelsType: ['Fdc3UserInterfaceChannels'],
  Fdc3UserInterfaceDragType: ['Fdc3UserInterfaceDrag'],
  Fdc3UserInterfaceHandshakeType: ['Fdc3UserInterfaceHandshake'],
  Fdc3UserInterfaceHelloType: ['Fdc3UserInterfaceHello'],
  Fdc3UserInterfaceMessageType: [
    'Fdc3UserInterfaceChannelSelected',
    'Fdc3UserInterfaceChannels',
    'Fdc3UserInterfaceDrag',
    'Fdc3UserInterfaceHandshake',
    'Fdc3UserInterfaceHello',
    'Fdc3UserInterfaceResolve',
    'Fdc3UserInterfaceResolveAction',
    'Fdc3UserInterfaceRestyle',
  ],
  Fdc3UserInterfaceResolveType: ['Fdc3UserInterfaceResolve'],
  Action: ['cancel', 'click', 'hover'],
  Fdc3UserInterfaceResolveActionType: ['Fdc3UserInterfaceResolveAction'],
  Fdc3UserInterfaceRestyleType: ['Fdc3UserInterfaceRestyle'],
  FindInstancesRequestType: ['findInstancesRequest'],
  FindInstancesErrors: [
    'ApiTimeout',
    'AgentDisconnected',
    'DesktopAgentNotFound',
    'IntentDeliveryFailed',
    'MalformedContext',
    'MalformedMessage',
    'NoAppsFound',
    'NotConnectedToBridge',
    'ResolverTimeout',
    'ResolverUnavailable',
    'ResponseToBridgeTimedOut',
    'TargetAppUnavailable',
    'TargetInstanceUnavailable',
    'UserCancelledResolution',
  ],
  FindInstancesResponseType: ['findInstancesResponse'],
  FindIntentRequestType: ['findIntentRequest'],
  FindIntentResponseType: ['findIntentResponse'],
  FindIntentsByContextRequestType: ['findIntentsByContextRequest'],
  FindIntentsByContextResponseType: ['findIntentsByContextResponse'],
  GetAppMetadataRequestType: ['getAppMetadataRequest'],
  GetAppMetadataResponseType: ['getAppMetadataResponse'],
  GetCurrentChannelRequestType: ['getCurrentChannelRequest'],
  GetCurrentChannelResponseType: ['getCurrentChannelResponse'],
  GetCurrentContextRequestType: ['getCurrentContextRequest'],
  GetCurrentContextResponseType: ['getCurrentContextResponse'],
  GetInfoRequestType: ['getInfoRequest'],
  GetInfoResponseType: ['getInfoResponse'],
  GetOrCreateChannelRequestType: ['getOrCreateChannelRequest'],
  GetOrCreateChannelResponseType: ['getOrCreateChannelResponse'],
  GetUserChannelsRequestType: ['getUserChannelsRequest'],
  GetUserChannelsResponseType: ['getUserChannelsResponse'],
  HeartbeatAcknowledgementRequestType: ['heartbeatAcknowledgementRequest'],
  HeartbeatEventType: ['heartbeatEvent'],
  IntentEventType: ['intentEvent'],
  IntentListenerUnsubscribeRequestType: ['intentListenerUnsubscribeRequest'],
  IntentListenerUnsubscribeResponseType: ['intentListenerUnsubscribeResponse'],
  IntentResultRequestType: ['intentResultRequest'],
  IntentResultResponseType: ['intentResultResponse'],
  JoinUserChannelRequestType: ['joinUserChannelRequest'],
  JoinUserChannelResponseType: ['joinUserChannelResponse'],
  LeaveCurrentChannelRequestType: ['leaveCurrentChannelRequest'],
  LeaveCurrentChannelResponseType: ['leaveCurrentChannelResponse'],
  OpenRequestType: ['openRequest'],
  OpenErrorResponsePayload: [
    'ApiTimeout',
    'AgentDisconnected',
    'AppNotFound',
    'AppTimeout',
    'DesktopAgentNotFound',
    'ErrorOnLaunch',
    'MalformedContext',
    'MalformedMessage',
    'NotConnectedToBridge',
    'ResolverUnavailable',
    'ResponseToBridgeTimedOut',
  ],
  OpenResponseType: ['openResponse'],
  PrivateChannelEventType: ['addContextListener', 'disconnect', 'unsubscribe'],
  PrivateChannelAddEventListenerRequestType: ['privateChannelAddEventListenerRequest'],
  PrivateChannelAddEventListenerResponseType: ['privateChannelAddEventListenerResponse'],
  PrivateChannelDisconnectRequestType: ['privateChannelDisconnectRequest'],
  PrivateChannelDisconnectResponseType: ['privateChannelDisconnectResponse'],
  PrivateChannelOnAddContextListenerEventType: ['privateChannelOnAddContextListenerEvent'],
  PrivateChannelOnDisconnectEventType: ['privateChannelOnDisconnectEvent'],
  PrivateChannelOnUnsubscribeEventType: ['privateChannelOnUnsubscribeEvent'],
  PrivateChannelUnsubscribeEventListenerRequestType: ['privateChannelUnsubscribeEventListenerRequest'],
  PrivateChannelUnsubscribeEventListenerResponseType: ['privateChannelUnsubscribeEventListenerResponse'],
  RaiseIntentForContextRequestType: ['raiseIntentForContextRequest'],
  RaiseIntentForContextResponseType: ['raiseIntentForContextResponse'],
  RaiseIntentRequestType: ['raiseIntentRequest'],
  RaiseIntentResponseType: ['raiseIntentResponse'],
  RaiseIntentResultResponseType: ['raiseIntentResultResponse'],
};

export type AppRequestMessage =
  | AddContextListenerRequest
  | AddEventListenerRequest
  | AddIntentListenerRequest
  | BroadcastRequest
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

/**
 * Returns true if value is a valid WebConnectionProtocol1Hello. This checks the type against the json schema for the message and will be slower
 */
export function isValidWebConnectionProtocol1Hello(value: any): value is WebConnectionProtocol1Hello {
  try {
    Convert.webConnectionProtocol1HelloToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const WEB_CONNECTION_PROTOCOL1_HELLO_TYPE = 'WebConnectionProtocol1Hello';

/**
 * Returns true if the value has a type property with value 'WCP2LoadUrl'. This is a fast check that does not check the format of the message
 */
export function isWebConnectionProtocol2LoadURL(value: any): value is WebConnectionProtocol2LoadURL {
  return value != null && value.type === 'WCP2LoadUrl';
}

/**
 * Returns true if value is a valid WebConnectionProtocol2LoadURL. This checks the type against the json schema for the message and will be slower
 */
export function isValidWebConnectionProtocol2LoadURL(value: any): value is WebConnectionProtocol2LoadURL {
  try {
    Convert.webConnectionProtocol2LoadURLToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const WEB_CONNECTION_PROTOCOL2_LOAD_U_R_L_TYPE = 'WebConnectionProtocol2LoadURL';

/**
 * Returns true if the value has a type property with value 'WCP3Handshake'. This is a fast check that does not check the format of the message
 */
export function isWebConnectionProtocol3Handshake(value: any): value is WebConnectionProtocol3Handshake {
  return value != null && value.type === 'WCP3Handshake';
}

/**
 * Returns true if value is a valid WebConnectionProtocol3Handshake. This checks the type against the json schema for the message and will be slower
 */
export function isValidWebConnectionProtocol3Handshake(value: any): value is WebConnectionProtocol3Handshake {
  try {
    Convert.webConnectionProtocol3HandshakeToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
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

/**
 * Returns true if value is a valid WebConnectionProtocol4ValidateAppIdentity. This checks the type against the json schema for the message and will be slower
 */
export function isValidWebConnectionProtocol4ValidateAppIdentity(
  value: any
): value is WebConnectionProtocol4ValidateAppIdentity {
  try {
    Convert.webConnectionProtocol4ValidateAppIdentityToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
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

/**
 * Returns true if value is a valid WebConnectionProtocol5ValidateAppIdentityFailedResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidWebConnectionProtocol5ValidateAppIdentityFailedResponse(
  value: any
): value is WebConnectionProtocol5ValidateAppIdentityFailedResponse {
  try {
    Convert.webConnectionProtocol5ValidateAppIdentityFailedResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
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

/**
 * Returns true if value is a valid WebConnectionProtocol5ValidateAppIdentitySuccessResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidWebConnectionProtocol5ValidateAppIdentitySuccessResponse(
  value: any
): value is WebConnectionProtocol5ValidateAppIdentitySuccessResponse {
  try {
    Convert.webConnectionProtocol5ValidateAppIdentitySuccessResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const WEB_CONNECTION_PROTOCOL5_VALIDATE_APP_IDENTITY_SUCCESS_RESPONSE_TYPE =
  'WebConnectionProtocol5ValidateAppIdentitySuccessResponse';

/**
 * Returns true if the value has a type property with value 'WCP6Goodbye'. This is a fast check that does not check the format of the message
 */
export function isWebConnectionProtocol6Goodbye(value: any): value is WebConnectionProtocol6Goodbye {
  return value != null && value.type === 'WCP6Goodbye';
}

/**
 * Returns true if value is a valid WebConnectionProtocol6Goodbye. This checks the type against the json schema for the message and will be slower
 */
export function isValidWebConnectionProtocol6Goodbye(value: any): value is WebConnectionProtocol6Goodbye {
  try {
    Convert.webConnectionProtocol6GoodbyeToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const WEB_CONNECTION_PROTOCOL6_GOODBYE_TYPE = 'WebConnectionProtocol6Goodbye';

/**
 * Returns true if value is a valid WebConnectionProtocolMessage. This checks the type against the json schema for the message and will be slower
 */
export function isValidWebConnectionProtocolMessage(value: any): value is WebConnectionProtocolMessage {
  try {
    Convert.webConnectionProtocolMessageToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const WEB_CONNECTION_PROTOCOL_MESSAGE_TYPE = 'WebConnectionProtocolMessage';

/**
 * Returns true if the value has a type property with value 'addContextListenerRequest'. This is a fast check that does not check the format of the message
 */
export function isAddContextListenerRequest(value: any): value is AddContextListenerRequest {
  return value != null && value.type === 'addContextListenerRequest';
}

/**
 * Returns true if value is a valid AddContextListenerRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidAddContextListenerRequest(value: any): value is AddContextListenerRequest {
  try {
    Convert.addContextListenerRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const ADD_CONTEXT_LISTENER_REQUEST_TYPE = 'AddContextListenerRequest';

/**
 * Returns true if the value has a type property with value 'addContextListenerResponse'. This is a fast check that does not check the format of the message
 */
export function isAddContextListenerResponse(value: any): value is AddContextListenerResponse {
  return value != null && value.type === 'addContextListenerResponse';
}

/**
 * Returns true if value is a valid AddContextListenerResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidAddContextListenerResponse(value: any): value is AddContextListenerResponse {
  try {
    Convert.addContextListenerResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const ADD_CONTEXT_LISTENER_RESPONSE_TYPE = 'AddContextListenerResponse';

/**
 * Returns true if the value has a type property with value 'addEventListenerRequest'. This is a fast check that does not check the format of the message
 */
export function isAddEventListenerRequest(value: any): value is AddEventListenerRequest {
  return value != null && value.type === 'addEventListenerRequest';
}

/**
 * Returns true if value is a valid AddEventListenerRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidAddEventListenerRequest(value: any): value is AddEventListenerRequest {
  try {
    Convert.addEventListenerRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const ADD_EVENT_LISTENER_REQUEST_TYPE = 'AddEventListenerRequest';

/**
 * Returns true if the value has a type property with value 'addEventListenerResponse'. This is a fast check that does not check the format of the message
 */
export function isAddEventListenerResponse(value: any): value is AddEventListenerResponse {
  return value != null && value.type === 'addEventListenerResponse';
}

/**
 * Returns true if value is a valid AddEventListenerResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidAddEventListenerResponse(value: any): value is AddEventListenerResponse {
  try {
    Convert.addEventListenerResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const ADD_EVENT_LISTENER_RESPONSE_TYPE = 'AddEventListenerResponse';

/**
 * Returns true if the value has a type property with value 'addIntentListenerRequest'. This is a fast check that does not check the format of the message
 */
export function isAddIntentListenerRequest(value: any): value is AddIntentListenerRequest {
  return value != null && value.type === 'addIntentListenerRequest';
}

/**
 * Returns true if value is a valid AddIntentListenerRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidAddIntentListenerRequest(value: any): value is AddIntentListenerRequest {
  try {
    Convert.addIntentListenerRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const ADD_INTENT_LISTENER_REQUEST_TYPE = 'AddIntentListenerRequest';

/**
 * Returns true if the value has a type property with value 'addIntentListenerResponse'. This is a fast check that does not check the format of the message
 */
export function isAddIntentListenerResponse(value: any): value is AddIntentListenerResponse {
  return value != null && value.type === 'addIntentListenerResponse';
}

/**
 * Returns true if value is a valid AddIntentListenerResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidAddIntentListenerResponse(value: any): value is AddIntentListenerResponse {
  try {
    Convert.addIntentListenerResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const ADD_INTENT_LISTENER_RESPONSE_TYPE = 'AddIntentListenerResponse';

/**
 * Returns true if the value has a type property with value 'broadcastEvent'. This is a fast check that does not check the format of the message
 */
export function isBroadcastEvent(value: any): value is BroadcastEvent {
  return value != null && value.type === 'broadcastEvent';
}

/**
 * Returns true if value is a valid BroadcastEvent. This checks the type against the json schema for the message and will be slower
 */
export function isValidBroadcastEvent(value: any): value is BroadcastEvent {
  try {
    Convert.broadcastEventToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const BROADCAST_EVENT_TYPE = 'BroadcastEvent';

/**
 * Returns true if the value has a type property with value 'broadcastRequest'. This is a fast check that does not check the format of the message
 */
export function isBroadcastRequest(value: any): value is BroadcastRequest {
  return value != null && value.type === 'broadcastRequest';
}

/**
 * Returns true if value is a valid BroadcastRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidBroadcastRequest(value: any): value is BroadcastRequest {
  try {
    Convert.broadcastRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const BROADCAST_REQUEST_TYPE = 'BroadcastRequest';

/**
 * Returns true if the value has a type property with value 'broadcastResponse'. This is a fast check that does not check the format of the message
 */
export function isBroadcastResponse(value: any): value is BroadcastResponse {
  return value != null && value.type === 'broadcastResponse';
}

/**
 * Returns true if value is a valid BroadcastResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidBroadcastResponse(value: any): value is BroadcastResponse {
  try {
    Convert.broadcastResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const BROADCAST_RESPONSE_TYPE = 'BroadcastResponse';

/**
 * Returns true if the value has a type property with value 'channelChangedEvent'. This is a fast check that does not check the format of the message
 */
export function isChannelChangedEvent(value: any): value is ChannelChangedEvent {
  return value != null && value.type === 'channelChangedEvent';
}

/**
 * Returns true if value is a valid ChannelChangedEvent. This checks the type against the json schema for the message and will be slower
 */
export function isValidChannelChangedEvent(value: any): value is ChannelChangedEvent {
  try {
    Convert.channelChangedEventToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const CHANNEL_CHANGED_EVENT_TYPE = 'ChannelChangedEvent';

/**
 * Returns true if the value has a type property with value 'contextListenerUnsubscribeRequest'. This is a fast check that does not check the format of the message
 */
export function isContextListenerUnsubscribeRequest(value: any): value is ContextListenerUnsubscribeRequest {
  return value != null && value.type === 'contextListenerUnsubscribeRequest';
}

/**
 * Returns true if value is a valid ContextListenerUnsubscribeRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidContextListenerUnsubscribeRequest(value: any): value is ContextListenerUnsubscribeRequest {
  try {
    Convert.contextListenerUnsubscribeRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const CONTEXT_LISTENER_UNSUBSCRIBE_REQUEST_TYPE = 'ContextListenerUnsubscribeRequest';

/**
 * Returns true if the value has a type property with value 'contextListenerUnsubscribeResponse'. This is a fast check that does not check the format of the message
 */
export function isContextListenerUnsubscribeResponse(value: any): value is ContextListenerUnsubscribeResponse {
  return value != null && value.type === 'contextListenerUnsubscribeResponse';
}

/**
 * Returns true if value is a valid ContextListenerUnsubscribeResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidContextListenerUnsubscribeResponse(value: any): value is ContextListenerUnsubscribeResponse {
  try {
    Convert.contextListenerUnsubscribeResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const CONTEXT_LISTENER_UNSUBSCRIBE_RESPONSE_TYPE = 'ContextListenerUnsubscribeResponse';

/**
 * Returns true if the value has a type property with value 'createPrivateChannelRequest'. This is a fast check that does not check the format of the message
 */
export function isCreatePrivateChannelRequest(value: any): value is CreatePrivateChannelRequest {
  return value != null && value.type === 'createPrivateChannelRequest';
}

/**
 * Returns true if value is a valid CreatePrivateChannelRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidCreatePrivateChannelRequest(value: any): value is CreatePrivateChannelRequest {
  try {
    Convert.createPrivateChannelRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const CREATE_PRIVATE_CHANNEL_REQUEST_TYPE = 'CreatePrivateChannelRequest';

/**
 * Returns true if the value has a type property with value 'createPrivateChannelResponse'. This is a fast check that does not check the format of the message
 */
export function isCreatePrivateChannelResponse(value: any): value is CreatePrivateChannelResponse {
  return value != null && value.type === 'createPrivateChannelResponse';
}

/**
 * Returns true if value is a valid CreatePrivateChannelResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidCreatePrivateChannelResponse(value: any): value is CreatePrivateChannelResponse {
  try {
    Convert.createPrivateChannelResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const CREATE_PRIVATE_CHANNEL_RESPONSE_TYPE = 'CreatePrivateChannelResponse';

/**
 * Returns true if the value has a type property with value 'eventListenerUnsubscribeRequest'. This is a fast check that does not check the format of the message
 */
export function isEventListenerUnsubscribeRequest(value: any): value is EventListenerUnsubscribeRequest {
  return value != null && value.type === 'eventListenerUnsubscribeRequest';
}

/**
 * Returns true if value is a valid EventListenerUnsubscribeRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidEventListenerUnsubscribeRequest(value: any): value is EventListenerUnsubscribeRequest {
  try {
    Convert.eventListenerUnsubscribeRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const EVENT_LISTENER_UNSUBSCRIBE_REQUEST_TYPE = 'EventListenerUnsubscribeRequest';

/**
 * Returns true if the value has a type property with value 'eventListenerUnsubscribeResponse'. This is a fast check that does not check the format of the message
 */
export function isEventListenerUnsubscribeResponse(value: any): value is EventListenerUnsubscribeResponse {
  return value != null && value.type === 'eventListenerUnsubscribeResponse';
}

/**
 * Returns true if value is a valid EventListenerUnsubscribeResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidEventListenerUnsubscribeResponse(value: any): value is EventListenerUnsubscribeResponse {
  try {
    Convert.eventListenerUnsubscribeResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const EVENT_LISTENER_UNSUBSCRIBE_RESPONSE_TYPE = 'EventListenerUnsubscribeResponse';

/**
 * Returns true if the value has a type property with value 'Fdc3UserInterfaceChannelSelected'. This is a fast check that does not check the format of the message
 */
export function isFdc3UserInterfaceChannelSelected(value: any): value is Fdc3UserInterfaceChannelSelected {
  return value != null && value.type === 'Fdc3UserInterfaceChannelSelected';
}

/**
 * Returns true if value is a valid Fdc3UserInterfaceChannelSelected. This checks the type against the json schema for the message and will be slower
 */
export function isValidFdc3UserInterfaceChannelSelected(value: any): value is Fdc3UserInterfaceChannelSelected {
  try {
    Convert.fdc3UserInterfaceChannelSelectedToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const FDC3_USER_INTERFACE_CHANNEL_SELECTED_TYPE = 'Fdc3UserInterfaceChannelSelected';

/**
 * Returns true if the value has a type property with value 'Fdc3UserInterfaceChannels'. This is a fast check that does not check the format of the message
 */
export function isFdc3UserInterfaceChannels(value: any): value is Fdc3UserInterfaceChannels {
  return value != null && value.type === 'Fdc3UserInterfaceChannels';
}

/**
 * Returns true if value is a valid Fdc3UserInterfaceChannels. This checks the type against the json schema for the message and will be slower
 */
export function isValidFdc3UserInterfaceChannels(value: any): value is Fdc3UserInterfaceChannels {
  try {
    Convert.fdc3UserInterfaceChannelsToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const FDC3_USER_INTERFACE_CHANNELS_TYPE = 'Fdc3UserInterfaceChannels';

/**
 * Returns true if the value has a type property with value 'Fdc3UserInterfaceDrag'. This is a fast check that does not check the format of the message
 */
export function isFdc3UserInterfaceDrag(value: any): value is Fdc3UserInterfaceDrag {
  return value != null && value.type === 'Fdc3UserInterfaceDrag';
}

/**
 * Returns true if value is a valid Fdc3UserInterfaceDrag. This checks the type against the json schema for the message and will be slower
 */
export function isValidFdc3UserInterfaceDrag(value: any): value is Fdc3UserInterfaceDrag {
  try {
    Convert.fdc3UserInterfaceDragToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const FDC3_USER_INTERFACE_DRAG_TYPE = 'Fdc3UserInterfaceDrag';

/**
 * Returns true if the value has a type property with value 'Fdc3UserInterfaceHandshake'. This is a fast check that does not check the format of the message
 */
export function isFdc3UserInterfaceHandshake(value: any): value is Fdc3UserInterfaceHandshake {
  return value != null && value.type === 'Fdc3UserInterfaceHandshake';
}

/**
 * Returns true if value is a valid Fdc3UserInterfaceHandshake. This checks the type against the json schema for the message and will be slower
 */
export function isValidFdc3UserInterfaceHandshake(value: any): value is Fdc3UserInterfaceHandshake {
  try {
    Convert.fdc3UserInterfaceHandshakeToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const FDC3_USER_INTERFACE_HANDSHAKE_TYPE = 'Fdc3UserInterfaceHandshake';

/**
 * Returns true if the value has a type property with value 'Fdc3UserInterfaceHello'. This is a fast check that does not check the format of the message
 */
export function isFdc3UserInterfaceHello(value: any): value is Fdc3UserInterfaceHello {
  return value != null && value.type === 'Fdc3UserInterfaceHello';
}

/**
 * Returns true if value is a valid Fdc3UserInterfaceHello. This checks the type against the json schema for the message and will be slower
 */
export function isValidFdc3UserInterfaceHello(value: any): value is Fdc3UserInterfaceHello {
  try {
    Convert.fdc3UserInterfaceHelloToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const FDC3_USER_INTERFACE_HELLO_TYPE = 'Fdc3UserInterfaceHello';

/**
 * Returns true if value is a valid Fdc3UserInterfaceMessage. This checks the type against the json schema for the message and will be slower
 */
export function isValidFdc3UserInterfaceMessage(value: any): value is Fdc3UserInterfaceMessage {
  try {
    Convert.fdc3UserInterfaceMessageToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const FDC3_USER_INTERFACE_MESSAGE_TYPE = 'Fdc3UserInterfaceMessage';

/**
 * Returns true if the value has a type property with value 'Fdc3UserInterfaceResolve'. This is a fast check that does not check the format of the message
 */
export function isFdc3UserInterfaceResolve(value: any): value is Fdc3UserInterfaceResolve {
  return value != null && value.type === 'Fdc3UserInterfaceResolve';
}

/**
 * Returns true if value is a valid Fdc3UserInterfaceResolve. This checks the type against the json schema for the message and will be slower
 */
export function isValidFdc3UserInterfaceResolve(value: any): value is Fdc3UserInterfaceResolve {
  try {
    Convert.fdc3UserInterfaceResolveToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const FDC3_USER_INTERFACE_RESOLVE_TYPE = 'Fdc3UserInterfaceResolve';

/**
 * Returns true if the value has a type property with value 'Fdc3UserInterfaceResolveAction'. This is a fast check that does not check the format of the message
 */
export function isFdc3UserInterfaceResolveAction(value: any): value is Fdc3UserInterfaceResolveAction {
  return value != null && value.type === 'Fdc3UserInterfaceResolveAction';
}

/**
 * Returns true if value is a valid Fdc3UserInterfaceResolveAction. This checks the type against the json schema for the message and will be slower
 */
export function isValidFdc3UserInterfaceResolveAction(value: any): value is Fdc3UserInterfaceResolveAction {
  try {
    Convert.fdc3UserInterfaceResolveActionToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const FDC3_USER_INTERFACE_RESOLVE_ACTION_TYPE = 'Fdc3UserInterfaceResolveAction';

/**
 * Returns true if the value has a type property with value 'Fdc3UserInterfaceRestyle'. This is a fast check that does not check the format of the message
 */
export function isFdc3UserInterfaceRestyle(value: any): value is Fdc3UserInterfaceRestyle {
  return value != null && value.type === 'Fdc3UserInterfaceRestyle';
}

/**
 * Returns true if value is a valid Fdc3UserInterfaceRestyle. This checks the type against the json schema for the message and will be slower
 */
export function isValidFdc3UserInterfaceRestyle(value: any): value is Fdc3UserInterfaceRestyle {
  try {
    Convert.fdc3UserInterfaceRestyleToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const FDC3_USER_INTERFACE_RESTYLE_TYPE = 'Fdc3UserInterfaceRestyle';

/**
 * Returns true if the value has a type property with value 'findInstancesRequest'. This is a fast check that does not check the format of the message
 */
export function isFindInstancesRequest(value: any): value is FindInstancesRequest {
  return value != null && value.type === 'findInstancesRequest';
}

/**
 * Returns true if value is a valid FindInstancesRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidFindInstancesRequest(value: any): value is FindInstancesRequest {
  try {
    Convert.findInstancesRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const FIND_INSTANCES_REQUEST_TYPE = 'FindInstancesRequest';

/**
 * Returns true if the value has a type property with value 'findInstancesResponse'. This is a fast check that does not check the format of the message
 */
export function isFindInstancesResponse(value: any): value is FindInstancesResponse {
  return value != null && value.type === 'findInstancesResponse';
}

/**
 * Returns true if value is a valid FindInstancesResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidFindInstancesResponse(value: any): value is FindInstancesResponse {
  try {
    Convert.findInstancesResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const FIND_INSTANCES_RESPONSE_TYPE = 'FindInstancesResponse';

/**
 * Returns true if the value has a type property with value 'findIntentRequest'. This is a fast check that does not check the format of the message
 */
export function isFindIntentRequest(value: any): value is FindIntentRequest {
  return value != null && value.type === 'findIntentRequest';
}

/**
 * Returns true if value is a valid FindIntentRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidFindIntentRequest(value: any): value is FindIntentRequest {
  try {
    Convert.findIntentRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const FIND_INTENT_REQUEST_TYPE = 'FindIntentRequest';

/**
 * Returns true if the value has a type property with value 'findIntentResponse'. This is a fast check that does not check the format of the message
 */
export function isFindIntentResponse(value: any): value is FindIntentResponse {
  return value != null && value.type === 'findIntentResponse';
}

/**
 * Returns true if value is a valid FindIntentResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidFindIntentResponse(value: any): value is FindIntentResponse {
  try {
    Convert.findIntentResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const FIND_INTENT_RESPONSE_TYPE = 'FindIntentResponse';

/**
 * Returns true if the value has a type property with value 'findIntentsByContextRequest'. This is a fast check that does not check the format of the message
 */
export function isFindIntentsByContextRequest(value: any): value is FindIntentsByContextRequest {
  return value != null && value.type === 'findIntentsByContextRequest';
}

/**
 * Returns true if value is a valid FindIntentsByContextRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidFindIntentsByContextRequest(value: any): value is FindIntentsByContextRequest {
  try {
    Convert.findIntentsByContextRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const FIND_INTENTS_BY_CONTEXT_REQUEST_TYPE = 'FindIntentsByContextRequest';

/**
 * Returns true if the value has a type property with value 'findIntentsByContextResponse'. This is a fast check that does not check the format of the message
 */
export function isFindIntentsByContextResponse(value: any): value is FindIntentsByContextResponse {
  return value != null && value.type === 'findIntentsByContextResponse';
}

/**
 * Returns true if value is a valid FindIntentsByContextResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidFindIntentsByContextResponse(value: any): value is FindIntentsByContextResponse {
  try {
    Convert.findIntentsByContextResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const FIND_INTENTS_BY_CONTEXT_RESPONSE_TYPE = 'FindIntentsByContextResponse';

/**
 * Returns true if the value has a type property with value 'getAppMetadataRequest'. This is a fast check that does not check the format of the message
 */
export function isGetAppMetadataRequest(value: any): value is GetAppMetadataRequest {
  return value != null && value.type === 'getAppMetadataRequest';
}

/**
 * Returns true if value is a valid GetAppMetadataRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidGetAppMetadataRequest(value: any): value is GetAppMetadataRequest {
  try {
    Convert.getAppMetadataRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const GET_APP_METADATA_REQUEST_TYPE = 'GetAppMetadataRequest';

/**
 * Returns true if the value has a type property with value 'getAppMetadataResponse'. This is a fast check that does not check the format of the message
 */
export function isGetAppMetadataResponse(value: any): value is GetAppMetadataResponse {
  return value != null && value.type === 'getAppMetadataResponse';
}

/**
 * Returns true if value is a valid GetAppMetadataResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidGetAppMetadataResponse(value: any): value is GetAppMetadataResponse {
  try {
    Convert.getAppMetadataResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const GET_APP_METADATA_RESPONSE_TYPE = 'GetAppMetadataResponse';

/**
 * Returns true if the value has a type property with value 'getCurrentChannelRequest'. This is a fast check that does not check the format of the message
 */
export function isGetCurrentChannelRequest(value: any): value is GetCurrentChannelRequest {
  return value != null && value.type === 'getCurrentChannelRequest';
}

/**
 * Returns true if value is a valid GetCurrentChannelRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidGetCurrentChannelRequest(value: any): value is GetCurrentChannelRequest {
  try {
    Convert.getCurrentChannelRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const GET_CURRENT_CHANNEL_REQUEST_TYPE = 'GetCurrentChannelRequest';

/**
 * Returns true if the value has a type property with value 'getCurrentChannelResponse'. This is a fast check that does not check the format of the message
 */
export function isGetCurrentChannelResponse(value: any): value is GetCurrentChannelResponse {
  return value != null && value.type === 'getCurrentChannelResponse';
}

/**
 * Returns true if value is a valid GetCurrentChannelResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidGetCurrentChannelResponse(value: any): value is GetCurrentChannelResponse {
  try {
    Convert.getCurrentChannelResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const GET_CURRENT_CHANNEL_RESPONSE_TYPE = 'GetCurrentChannelResponse';

/**
 * Returns true if the value has a type property with value 'getCurrentContextRequest'. This is a fast check that does not check the format of the message
 */
export function isGetCurrentContextRequest(value: any): value is GetCurrentContextRequest {
  return value != null && value.type === 'getCurrentContextRequest';
}

/**
 * Returns true if value is a valid GetCurrentContextRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidGetCurrentContextRequest(value: any): value is GetCurrentContextRequest {
  try {
    Convert.getCurrentContextRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const GET_CURRENT_CONTEXT_REQUEST_TYPE = 'GetCurrentContextRequest';

/**
 * Returns true if the value has a type property with value 'getCurrentContextResponse'. This is a fast check that does not check the format of the message
 */
export function isGetCurrentContextResponse(value: any): value is GetCurrentContextResponse {
  return value != null && value.type === 'getCurrentContextResponse';
}

/**
 * Returns true if value is a valid GetCurrentContextResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidGetCurrentContextResponse(value: any): value is GetCurrentContextResponse {
  try {
    Convert.getCurrentContextResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const GET_CURRENT_CONTEXT_RESPONSE_TYPE = 'GetCurrentContextResponse';

/**
 * Returns true if the value has a type property with value 'getInfoRequest'. This is a fast check that does not check the format of the message
 */
export function isGetInfoRequest(value: any): value is GetInfoRequest {
  return value != null && value.type === 'getInfoRequest';
}

/**
 * Returns true if value is a valid GetInfoRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidGetInfoRequest(value: any): value is GetInfoRequest {
  try {
    Convert.getInfoRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const GET_INFO_REQUEST_TYPE = 'GetInfoRequest';

/**
 * Returns true if the value has a type property with value 'getInfoResponse'. This is a fast check that does not check the format of the message
 */
export function isGetInfoResponse(value: any): value is GetInfoResponse {
  return value != null && value.type === 'getInfoResponse';
}

/**
 * Returns true if value is a valid GetInfoResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidGetInfoResponse(value: any): value is GetInfoResponse {
  try {
    Convert.getInfoResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const GET_INFO_RESPONSE_TYPE = 'GetInfoResponse';

/**
 * Returns true if the value has a type property with value 'getOrCreateChannelRequest'. This is a fast check that does not check the format of the message
 */
export function isGetOrCreateChannelRequest(value: any): value is GetOrCreateChannelRequest {
  return value != null && value.type === 'getOrCreateChannelRequest';
}

/**
 * Returns true if value is a valid GetOrCreateChannelRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidGetOrCreateChannelRequest(value: any): value is GetOrCreateChannelRequest {
  try {
    Convert.getOrCreateChannelRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const GET_OR_CREATE_CHANNEL_REQUEST_TYPE = 'GetOrCreateChannelRequest';

/**
 * Returns true if the value has a type property with value 'getOrCreateChannelResponse'. This is a fast check that does not check the format of the message
 */
export function isGetOrCreateChannelResponse(value: any): value is GetOrCreateChannelResponse {
  return value != null && value.type === 'getOrCreateChannelResponse';
}

/**
 * Returns true if value is a valid GetOrCreateChannelResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidGetOrCreateChannelResponse(value: any): value is GetOrCreateChannelResponse {
  try {
    Convert.getOrCreateChannelResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const GET_OR_CREATE_CHANNEL_RESPONSE_TYPE = 'GetOrCreateChannelResponse';

/**
 * Returns true if the value has a type property with value 'getUserChannelsRequest'. This is a fast check that does not check the format of the message
 */
export function isGetUserChannelsRequest(value: any): value is GetUserChannelsRequest {
  return value != null && value.type === 'getUserChannelsRequest';
}

/**
 * Returns true if value is a valid GetUserChannelsRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidGetUserChannelsRequest(value: any): value is GetUserChannelsRequest {
  try {
    Convert.getUserChannelsRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const GET_USER_CHANNELS_REQUEST_TYPE = 'GetUserChannelsRequest';

/**
 * Returns true if the value has a type property with value 'getUserChannelsResponse'. This is a fast check that does not check the format of the message
 */
export function isGetUserChannelsResponse(value: any): value is GetUserChannelsResponse {
  return value != null && value.type === 'getUserChannelsResponse';
}

/**
 * Returns true if value is a valid GetUserChannelsResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidGetUserChannelsResponse(value: any): value is GetUserChannelsResponse {
  try {
    Convert.getUserChannelsResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const GET_USER_CHANNELS_RESPONSE_TYPE = 'GetUserChannelsResponse';

/**
 * Returns true if the value has a type property with value 'heartbeatAcknowledgementRequest'. This is a fast check that does not check the format of the message
 */
export function isHeartbeatAcknowledgementRequest(value: any): value is HeartbeatAcknowledgementRequest {
  return value != null && value.type === 'heartbeatAcknowledgementRequest';
}

/**
 * Returns true if value is a valid HeartbeatAcknowledgementRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidHeartbeatAcknowledgementRequest(value: any): value is HeartbeatAcknowledgementRequest {
  try {
    Convert.heartbeatAcknowledgementRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const HEARTBEAT_ACKNOWLEDGEMENT_REQUEST_TYPE = 'HeartbeatAcknowledgementRequest';

/**
 * Returns true if the value has a type property with value 'heartbeatEvent'. This is a fast check that does not check the format of the message
 */
export function isHeartbeatEvent(value: any): value is HeartbeatEvent {
  return value != null && value.type === 'heartbeatEvent';
}

/**
 * Returns true if value is a valid HeartbeatEvent. This checks the type against the json schema for the message and will be slower
 */
export function isValidHeartbeatEvent(value: any): value is HeartbeatEvent {
  try {
    Convert.heartbeatEventToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const HEARTBEAT_EVENT_TYPE = 'HeartbeatEvent';

/**
 * Returns true if the value has a type property with value 'intentEvent'. This is a fast check that does not check the format of the message
 */
export function isIntentEvent(value: any): value is IntentEvent {
  return value != null && value.type === 'intentEvent';
}

/**
 * Returns true if value is a valid IntentEvent. This checks the type against the json schema for the message and will be slower
 */
export function isValidIntentEvent(value: any): value is IntentEvent {
  try {
    Convert.intentEventToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const INTENT_EVENT_TYPE = 'IntentEvent';

/**
 * Returns true if the value has a type property with value 'intentListenerUnsubscribeRequest'. This is a fast check that does not check the format of the message
 */
export function isIntentListenerUnsubscribeRequest(value: any): value is IntentListenerUnsubscribeRequest {
  return value != null && value.type === 'intentListenerUnsubscribeRequest';
}

/**
 * Returns true if value is a valid IntentListenerUnsubscribeRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidIntentListenerUnsubscribeRequest(value: any): value is IntentListenerUnsubscribeRequest {
  try {
    Convert.intentListenerUnsubscribeRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const INTENT_LISTENER_UNSUBSCRIBE_REQUEST_TYPE = 'IntentListenerUnsubscribeRequest';

/**
 * Returns true if the value has a type property with value 'intentListenerUnsubscribeResponse'. This is a fast check that does not check the format of the message
 */
export function isIntentListenerUnsubscribeResponse(value: any): value is IntentListenerUnsubscribeResponse {
  return value != null && value.type === 'intentListenerUnsubscribeResponse';
}

/**
 * Returns true if value is a valid IntentListenerUnsubscribeResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidIntentListenerUnsubscribeResponse(value: any): value is IntentListenerUnsubscribeResponse {
  try {
    Convert.intentListenerUnsubscribeResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const INTENT_LISTENER_UNSUBSCRIBE_RESPONSE_TYPE = 'IntentListenerUnsubscribeResponse';

/**
 * Returns true if the value has a type property with value 'intentResultRequest'. This is a fast check that does not check the format of the message
 */
export function isIntentResultRequest(value: any): value is IntentResultRequest {
  return value != null && value.type === 'intentResultRequest';
}

/**
 * Returns true if value is a valid IntentResultRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidIntentResultRequest(value: any): value is IntentResultRequest {
  try {
    Convert.intentResultRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const INTENT_RESULT_REQUEST_TYPE = 'IntentResultRequest';

/**
 * Returns true if the value has a type property with value 'intentResultResponse'. This is a fast check that does not check the format of the message
 */
export function isIntentResultResponse(value: any): value is IntentResultResponse {
  return value != null && value.type === 'intentResultResponse';
}

/**
 * Returns true if value is a valid IntentResultResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidIntentResultResponse(value: any): value is IntentResultResponse {
  try {
    Convert.intentResultResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const INTENT_RESULT_RESPONSE_TYPE = 'IntentResultResponse';

/**
 * Returns true if the value has a type property with value 'joinUserChannelRequest'. This is a fast check that does not check the format of the message
 */
export function isJoinUserChannelRequest(value: any): value is JoinUserChannelRequest {
  return value != null && value.type === 'joinUserChannelRequest';
}

/**
 * Returns true if value is a valid JoinUserChannelRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidJoinUserChannelRequest(value: any): value is JoinUserChannelRequest {
  try {
    Convert.joinUserChannelRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const JOIN_USER_CHANNEL_REQUEST_TYPE = 'JoinUserChannelRequest';

/**
 * Returns true if the value has a type property with value 'joinUserChannelResponse'. This is a fast check that does not check the format of the message
 */
export function isJoinUserChannelResponse(value: any): value is JoinUserChannelResponse {
  return value != null && value.type === 'joinUserChannelResponse';
}

/**
 * Returns true if value is a valid JoinUserChannelResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidJoinUserChannelResponse(value: any): value is JoinUserChannelResponse {
  try {
    Convert.joinUserChannelResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const JOIN_USER_CHANNEL_RESPONSE_TYPE = 'JoinUserChannelResponse';

/**
 * Returns true if the value has a type property with value 'leaveCurrentChannelRequest'. This is a fast check that does not check the format of the message
 */
export function isLeaveCurrentChannelRequest(value: any): value is LeaveCurrentChannelRequest {
  return value != null && value.type === 'leaveCurrentChannelRequest';
}

/**
 * Returns true if value is a valid LeaveCurrentChannelRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidLeaveCurrentChannelRequest(value: any): value is LeaveCurrentChannelRequest {
  try {
    Convert.leaveCurrentChannelRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const LEAVE_CURRENT_CHANNEL_REQUEST_TYPE = 'LeaveCurrentChannelRequest';

/**
 * Returns true if the value has a type property with value 'leaveCurrentChannelResponse'. This is a fast check that does not check the format of the message
 */
export function isLeaveCurrentChannelResponse(value: any): value is LeaveCurrentChannelResponse {
  return value != null && value.type === 'leaveCurrentChannelResponse';
}

/**
 * Returns true if value is a valid LeaveCurrentChannelResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidLeaveCurrentChannelResponse(value: any): value is LeaveCurrentChannelResponse {
  try {
    Convert.leaveCurrentChannelResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const LEAVE_CURRENT_CHANNEL_RESPONSE_TYPE = 'LeaveCurrentChannelResponse';

/**
 * Returns true if the value has a type property with value 'openRequest'. This is a fast check that does not check the format of the message
 */
export function isOpenRequest(value: any): value is OpenRequest {
  return value != null && value.type === 'openRequest';
}

/**
 * Returns true if value is a valid OpenRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidOpenRequest(value: any): value is OpenRequest {
  try {
    Convert.openRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const OPEN_REQUEST_TYPE = 'OpenRequest';

/**
 * Returns true if the value has a type property with value 'openResponse'. This is a fast check that does not check the format of the message
 */
export function isOpenResponse(value: any): value is OpenResponse {
  return value != null && value.type === 'openResponse';
}

/**
 * Returns true if value is a valid OpenResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidOpenResponse(value: any): value is OpenResponse {
  try {
    Convert.openResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const OPEN_RESPONSE_TYPE = 'OpenResponse';

/**
 * Returns true if the value has a type property with value 'privateChannelAddEventListenerRequest'. This is a fast check that does not check the format of the message
 */
export function isPrivateChannelAddEventListenerRequest(value: any): value is PrivateChannelAddEventListenerRequest {
  return value != null && value.type === 'privateChannelAddEventListenerRequest';
}

/**
 * Returns true if value is a valid PrivateChannelAddEventListenerRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidPrivateChannelAddEventListenerRequest(
  value: any
): value is PrivateChannelAddEventListenerRequest {
  try {
    Convert.privateChannelAddEventListenerRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const PRIVATE_CHANNEL_ADD_EVENT_LISTENER_REQUEST_TYPE = 'PrivateChannelAddEventListenerRequest';

/**
 * Returns true if the value has a type property with value 'privateChannelAddEventListenerResponse'. This is a fast check that does not check the format of the message
 */
export function isPrivateChannelAddEventListenerResponse(value: any): value is PrivateChannelAddEventListenerResponse {
  return value != null && value.type === 'privateChannelAddEventListenerResponse';
}

/**
 * Returns true if value is a valid PrivateChannelAddEventListenerResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidPrivateChannelAddEventListenerResponse(
  value: any
): value is PrivateChannelAddEventListenerResponse {
  try {
    Convert.privateChannelAddEventListenerResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const PRIVATE_CHANNEL_ADD_EVENT_LISTENER_RESPONSE_TYPE = 'PrivateChannelAddEventListenerResponse';

/**
 * Returns true if the value has a type property with value 'privateChannelDisconnectRequest'. This is a fast check that does not check the format of the message
 */
export function isPrivateChannelDisconnectRequest(value: any): value is PrivateChannelDisconnectRequest {
  return value != null && value.type === 'privateChannelDisconnectRequest';
}

/**
 * Returns true if value is a valid PrivateChannelDisconnectRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidPrivateChannelDisconnectRequest(value: any): value is PrivateChannelDisconnectRequest {
  try {
    Convert.privateChannelDisconnectRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const PRIVATE_CHANNEL_DISCONNECT_REQUEST_TYPE = 'PrivateChannelDisconnectRequest';

/**
 * Returns true if the value has a type property with value 'privateChannelDisconnectResponse'. This is a fast check that does not check the format of the message
 */
export function isPrivateChannelDisconnectResponse(value: any): value is PrivateChannelDisconnectResponse {
  return value != null && value.type === 'privateChannelDisconnectResponse';
}

/**
 * Returns true if value is a valid PrivateChannelDisconnectResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidPrivateChannelDisconnectResponse(value: any): value is PrivateChannelDisconnectResponse {
  try {
    Convert.privateChannelDisconnectResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
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

/**
 * Returns true if value is a valid PrivateChannelOnAddContextListenerEvent. This checks the type against the json schema for the message and will be slower
 */
export function isValidPrivateChannelOnAddContextListenerEvent(
  value: any
): value is PrivateChannelOnAddContextListenerEvent {
  try {
    Convert.privateChannelOnAddContextListenerEventToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const PRIVATE_CHANNEL_ON_ADD_CONTEXT_LISTENER_EVENT_TYPE = 'PrivateChannelOnAddContextListenerEvent';

/**
 * Returns true if the value has a type property with value 'privateChannelOnDisconnectEvent'. This is a fast check that does not check the format of the message
 */
export function isPrivateChannelOnDisconnectEvent(value: any): value is PrivateChannelOnDisconnectEvent {
  return value != null && value.type === 'privateChannelOnDisconnectEvent';
}

/**
 * Returns true if value is a valid PrivateChannelOnDisconnectEvent. This checks the type against the json schema for the message and will be slower
 */
export function isValidPrivateChannelOnDisconnectEvent(value: any): value is PrivateChannelOnDisconnectEvent {
  try {
    Convert.privateChannelOnDisconnectEventToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const PRIVATE_CHANNEL_ON_DISCONNECT_EVENT_TYPE = 'PrivateChannelOnDisconnectEvent';

/**
 * Returns true if the value has a type property with value 'privateChannelOnUnsubscribeEvent'. This is a fast check that does not check the format of the message
 */
export function isPrivateChannelOnUnsubscribeEvent(value: any): value is PrivateChannelOnUnsubscribeEvent {
  return value != null && value.type === 'privateChannelOnUnsubscribeEvent';
}

/**
 * Returns true if value is a valid PrivateChannelOnUnsubscribeEvent. This checks the type against the json schema for the message and will be slower
 */
export function isValidPrivateChannelOnUnsubscribeEvent(value: any): value is PrivateChannelOnUnsubscribeEvent {
  try {
    Convert.privateChannelOnUnsubscribeEventToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
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

/**
 * Returns true if value is a valid PrivateChannelUnsubscribeEventListenerRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidPrivateChannelUnsubscribeEventListenerRequest(
  value: any
): value is PrivateChannelUnsubscribeEventListenerRequest {
  try {
    Convert.privateChannelUnsubscribeEventListenerRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
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

/**
 * Returns true if value is a valid PrivateChannelUnsubscribeEventListenerResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidPrivateChannelUnsubscribeEventListenerResponse(
  value: any
): value is PrivateChannelUnsubscribeEventListenerResponse {
  try {
    Convert.privateChannelUnsubscribeEventListenerResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const PRIVATE_CHANNEL_UNSUBSCRIBE_EVENT_LISTENER_RESPONSE_TYPE =
  'PrivateChannelUnsubscribeEventListenerResponse';

/**
 * Returns true if the value has a type property with value 'raiseIntentForContextRequest'. This is a fast check that does not check the format of the message
 */
export function isRaiseIntentForContextRequest(value: any): value is RaiseIntentForContextRequest {
  return value != null && value.type === 'raiseIntentForContextRequest';
}

/**
 * Returns true if value is a valid RaiseIntentForContextRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidRaiseIntentForContextRequest(value: any): value is RaiseIntentForContextRequest {
  try {
    Convert.raiseIntentForContextRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const RAISE_INTENT_FOR_CONTEXT_REQUEST_TYPE = 'RaiseIntentForContextRequest';

/**
 * Returns true if the value has a type property with value 'raiseIntentForContextResponse'. This is a fast check that does not check the format of the message
 */
export function isRaiseIntentForContextResponse(value: any): value is RaiseIntentForContextResponse {
  return value != null && value.type === 'raiseIntentForContextResponse';
}

/**
 * Returns true if value is a valid RaiseIntentForContextResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidRaiseIntentForContextResponse(value: any): value is RaiseIntentForContextResponse {
  try {
    Convert.raiseIntentForContextResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const RAISE_INTENT_FOR_CONTEXT_RESPONSE_TYPE = 'RaiseIntentForContextResponse';

/**
 * Returns true if the value has a type property with value 'raiseIntentRequest'. This is a fast check that does not check the format of the message
 */
export function isRaiseIntentRequest(value: any): value is RaiseIntentRequest {
  return value != null && value.type === 'raiseIntentRequest';
}

/**
 * Returns true if value is a valid RaiseIntentRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidRaiseIntentRequest(value: any): value is RaiseIntentRequest {
  try {
    Convert.raiseIntentRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const RAISE_INTENT_REQUEST_TYPE = 'RaiseIntentRequest';

/**
 * Returns true if the value has a type property with value 'raiseIntentResponse'. This is a fast check that does not check the format of the message
 */
export function isRaiseIntentResponse(value: any): value is RaiseIntentResponse {
  return value != null && value.type === 'raiseIntentResponse';
}

/**
 * Returns true if value is a valid RaiseIntentResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidRaiseIntentResponse(value: any): value is RaiseIntentResponse {
  try {
    Convert.raiseIntentResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const RAISE_INTENT_RESPONSE_TYPE = 'RaiseIntentResponse';

/**
 * Returns true if the value has a type property with value 'raiseIntentResultResponse'. This is a fast check that does not check the format of the message
 */
export function isRaiseIntentResultResponse(value: any): value is RaiseIntentResultResponse {
  return value != null && value.type === 'raiseIntentResultResponse';
}

/**
 * Returns true if value is a valid RaiseIntentResultResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidRaiseIntentResultResponse(value: any): value is RaiseIntentResultResponse {
  try {
    Convert.raiseIntentResultResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

export const RAISE_INTENT_RESULT_RESPONSE_TYPE = 'RaiseIntentResultResponse';
