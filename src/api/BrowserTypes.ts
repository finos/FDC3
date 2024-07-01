// To parse this data:
//
//   import { Convert, AppRequestMessage, AgentResponseMessage, AgentEventMessage, AddContextListenerRequest, AddContextListenerResponse, AddIntentListenerRequest, AddIntentListenerResponse, BroadcastEvent, BroadcastRequest, BroadcastResponse, ChannelChangedEvent, ContextListenerUnsubscribeRequest, ContextListenerUnsubscribeResponse, CreatePrivateChannelRequest, CreatePrivateChannelResponse, FindInstancesRequest, FindInstancesResponse, FindIntentRequest, FindIntentResponse, FindIntentsByContextRequest, FindIntentsByContextsByContextResponse, GetAppMetadataRequest, GetAppMetadataResponse, GetCurrentChannelRequest, GetCurrentChannelResponse, GetCurrentContextRequest, GetCurrentContextResponse, GetInfoRequest, GetInfoResponse, GetOrCreateChannelRequest, GetOrCreateChannelResponse, GetUserChannelsRequest, GetUserChannelsResponse, IframeChannelDrag, IframeChannelResize, IframeChannels, IframeChannelSelected, IframeHandshake, IframeHello, IframeMessage, IframeResolve, IframeResolveAction, IntentEvent, IntentListenerUnsubscribeRequest, IntentListenerUnsubscribeResponse, JoinUserChannelRequest, JoinUserChannelResponse, LeaveCurrentChannelRequest, LeaveCurrentChannelResponse, OpenRequest, OpenResponse, PrivateChannelAddEventListenerRequest, PrivateChannelAddEventListenerResponse, PrivateChannelDisconnectRequest, PrivateChannelDisconnectResponse, PrivateChannelOnAddContextListenerEvent, PrivateChannelOnDisconnectEvent, PrivateChannelOnUnsubscribeEventEvent, PrivateChannelUnsubscribeEventListenerRequest, PrivateChannelUnsubscribeEventListenerResponse, RaiseIntentForContextRequest, RaiseIntentForContextResponse, RaiseIntentRequest, RaiseIntentResponse, RaiseIntentResultResponse, WebConnectionProtocol1Hello, WebConnectionProtocol2LoadURL, WebConnectionProtocol3Handshake, WebConnectionProtocol4ValidateAppIdentity, WebConnectionProtocol5ValidateAppIdentityFailedResponse, WebConnectionProtocol5ValidateAppIdentitySuccessResponse, WebConnectionProtocolMessage } from "./file";
//
//   const fDC3DesktopAgentAPISchemas = Convert.toFDC3DesktopAgentAPISchemas(json);
//   const commonDefinitions = Convert.toCommonDefinitions(json);
//   const appRequestMessage = Convert.toAppRequestMessage(json);
//   const agentResponseMessage = Convert.toAgentResponseMessage(json);
//   const agentEventMessage = Convert.toAgentEventMessage(json);
//   const addContextListenerRequest = Convert.toAddContextListenerRequest(json);
//   const addContextListenerResponse = Convert.toAddContextListenerResponse(json);
//   const addIntentListenerRequest = Convert.toAddIntentListenerRequest(json);
//   const addIntentListenerResponse = Convert.toAddIntentListenerResponse(json);
//   const broadcastEvent = Convert.toBroadcastEvent(json);
//   const broadcastRequest = Convert.toBroadcastRequest(json);
//   const broadcastResponse = Convert.toBroadcastResponse(json);
//   const channelChangedEvent = Convert.toChannelChangedEvent(json);
//   const contextListenerUnsubscribeRequest = Convert.toContextListenerUnsubscribeRequest(json);
//   const contextListenerUnsubscribeResponse = Convert.toContextListenerUnsubscribeResponse(json);
//   const createPrivateChannelRequest = Convert.toCreatePrivateChannelRequest(json);
//   const createPrivateChannelResponse = Convert.toCreatePrivateChannelResponse(json);
//   const findInstancesRequest = Convert.toFindInstancesRequest(json);
//   const findInstancesResponse = Convert.toFindInstancesResponse(json);
//   const findIntentRequest = Convert.toFindIntentRequest(json);
//   const findIntentResponse = Convert.toFindIntentResponse(json);
//   const findIntentsByContextRequest = Convert.toFindIntentsByContextRequest(json);
//   const findIntentsByContextsByContextResponse = Convert.toFindIntentsByContextsByContextResponse(json);
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
//   const iframeChannelDrag = Convert.toIframeChannelDrag(json);
//   const iframeChannelResize = Convert.toIframeChannelResize(json);
//   const iframeChannels = Convert.toIframeChannels(json);
//   const iframeChannelSelected = Convert.toIframeChannelSelected(json);
//   const iframeHandshake = Convert.toIframeHandshake(json);
//   const iframeHello = Convert.toIframeHello(json);
//   const iframeMessage = Convert.toIframeMessage(json);
//   const iframeResolve = Convert.toIframeResolve(json);
//   const iframeResolveAction = Convert.toIframeResolveAction(json);
//   const intentEvent = Convert.toIntentEvent(json);
//   const intentListenerUnsubscribeRequest = Convert.toIntentListenerUnsubscribeRequest(json);
//   const intentListenerUnsubscribeResponse = Convert.toIntentListenerUnsubscribeResponse(json);
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
//   const privateChannelOnUnsubscribeEventEvent = Convert.toPrivateChannelOnUnsubscribeEventEvent(json);
//   const privateChannelUnsubscribeEventListenerRequest = Convert.toPrivateChannelUnsubscribeEventListenerRequest(json);
//   const privateChannelUnsubscribeEventListenerResponse = Convert.toPrivateChannelUnsubscribeEventListenerResponse(json);
//   const raiseIntentForContextRequest = Convert.toRaiseIntentForContextRequest(json);
//   const raiseIntentForContextResponse = Convert.toRaiseIntentForContextResponse(json);
//   const raiseIntentRequest = Convert.toRaiseIntentRequest(json);
//   const raiseIntentResponse = Convert.toRaiseIntentResponse(json);
//   const raiseIntentResultResponse = Convert.toRaiseIntentResultResponse(json);
//   const webConnectionProtocol1Hello = Convert.toWebConnectionProtocol1Hello(json);
//   const webConnectionProtocol2LoadURL = Convert.toWebConnectionProtocol2LoadURL(json);
//   const webConnectionProtocol3Handshake = Convert.toWebConnectionProtocol3Handshake(json);
//   const webConnectionProtocol4ValidateAppIdentity = Convert.toWebConnectionProtocol4ValidateAppIdentity(json);
//   const webConnectionProtocol5ValidateAppIdentityFailedResponse = Convert.toWebConnectionProtocol5ValidateAppIdentityFailedResponse(json);
//   const webConnectionProtocol5ValidateAppIdentitySuccessResponse = Convert.toWebConnectionProtocol5ValidateAppIdentitySuccessResponse(json);
//   const webConnectionProtocolMessage = Convert.toWebConnectionProtocolMessage(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

/**
 * A request message from an FDC3-enabled app to a Desktop Agent.
 */
export interface AppRequestMessage {
    /**
     * Metadata for a request message sent by an FDC3-enabled app to a Desktop Agent.
     */
    meta: AppRequestMessageMeta;
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
    source?:   AppIdentifier;
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
 * The App resolution option chosen
 *
 * Details of the application instance that raised the intent
 *
 * Identifier for the app instance that was selected (or started) to resolve the intent.
 * `source.instanceId` MUST be set, indicating the specific app instance that
 * received the intent.
 */
export interface AppIdentifier {
    /**
     * The unique application identifier located within a specific application directory
     * instance. An example of an appId might be 'app@sub.root'
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
 */
export type RequestMessageType = "addContextListenerRequest" | "addIntentListenerRequest" | "broadcastRequest" | "contextListenerUnsubscribeRequest" | "createPrivateChannelRequest" | "findInstancesRequest" | "findIntentRequest" | "findIntentsByContextRequest" | "getAppMetadataRequest" | "getCurrentChannelRequest" | "getCurrentContextRequest" | "getInfoRequest" | "getOrCreateChannelRequest" | "getUserChannelsRequest" | "intentListenerUnsubscribeRequest" | "joinUserChannelRequest" | "leaveCurrentChannelRequest" | "openRequest" | "privateChannelAddEventListenerRequest" | "privateChannelDisconnectRequest" | "privateChannelUnsubscribeEventListenerRequest" | "raiseIntentForContextRequest" | "raiseIntentRequest";

/**
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface AgentResponseMessage {
    /**
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
     */
    meta: AgentResponseMessageMeta;
    /**
     * A payload for a response to an API call that will contain any return values or an `error`
     * property containing a standardized error message indicating that the request was
     * unsuccessful.
     */
    payload: AgentResponseMessageResponsePayload;
    /**
     * Identifies the type of the message and it is typically set to the FDC3 function name that
     * the message relates to, e.g. 'findIntent', with 'Response' appended.
     */
    type: ResponseMessageType;
}

/**
 * Metadata for messages sent by a Desktop Agent to an App in response to an API call
 */
export interface AgentResponseMessageMeta {
    requestUuid:  string;
    responseUuid: string;
    /**
     * Field that represents the source application that the request being responded to was
     * received from, for debugging purposes.
     */
    source?:   AppIdentifier;
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
 * Constants representing the errors that can be encountered when calling the `open` method
 * on the DesktopAgent object (`fdc3`).
 *
 * Constants representing the errors that can be encountered when calling the `findIntent`,
 * `findIntentsByContext`, `raiseIntent` or `raiseIntentForContext` methods on the
 * DesktopAgent (`fdc3`).
 */
export type ResponsePayloadError = "AccessDenied" | "CreationFailed" | "MalformedContext" | "NoChannelFound" | "AppNotFound" | "AppTimeout" | "DesktopAgentNotFound" | "ErrorOnLaunch" | "ResolverUnavailable" | "IntentDeliveryFailed" | "NoAppsFound" | "ResolverTimeout" | "TargetAppUnavailable" | "TargetInstanceUnavailable" | "UserCancelledResolution" | "IntentHandlerRejected" | "NoResultReturned" | "AgentDisconnected" | "NotConnectedToBridge" | "ResponseToBridgeTimedOut" | "MalformedMessage";

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */
export type ResponseMessageType = "addContextListenerResponse" | "addIntentListenerResponse" | "broadcastResponse" | "contextListenerUnsubscribeResponse" | "createPrivateChannelResponse" | "findInstancesResponse" | "findIntentResponse" | "findIntentsByContextResponse" | "getAppMetadataResponse" | "getCurrentChannelResponse" | "getCurrentContextResponse" | "getInfoResponse" | "getOrCreateChannelResponse" | "getUserChannelsResponse" | "intentListenerUnsubscribeResponse" | "joinUserChannelResponse" | "leaveCurrentChannelResponse" | "openResponse" | "privateChannelAddEventListenerResponse" | "privateChannelDisconnectResponse" | "privateChannelUnsubscribeEventListenerResponse" | "raiseIntentForContextResponse" | "raiseIntentResponse" | "raiseIntentResultResponse";

/**
 * A message from a Desktop Agent to an FDC3-enabled app representing an event.
 */
export interface AgentEventMessage {
    /**
     * Metadata for messages sent by a Desktop Agent to an App notifying it of an event.
     */
    meta: AgentEventMessageMeta;
    /**
     * The message payload contains details of the event that the app is being notified about.
     */
    payload: { [key: string]: any };
    /**
     * Identifies the type of the message and it is typically set to the FDC3 function name that
     * the message relates to, e.g. 'findIntent', with 'Response' appended.
     */
    type: EventMessageType;
}

/**
 * Metadata for messages sent by a Desktop Agent to an App notifying it of an event.
 */
export interface AgentEventMessageMeta {
    eventUuid: string;
    timestamp: Date;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */
export type EventMessageType = "intentEvent" | "broadcastEvent" | "channelChangedEvent" | "privateChannelOnAddContextListenerEvent" | "privateChannelOnDisconnectEvent" | "privateChannelOnUnsubscribeEvent";

/**
 * A request to add a context listener to a specified Channel OR to the current user
 * channel.
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
    type: "addContextListenerRequest";
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
    source?:   AppIdentifier;
    timestamp: Date;
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
 * A response to a addContextListener request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface AddContextListenerResponse {
    /**
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "addContextListenerResponse";
}

/**
 * Metadata for messages sent by a Desktop Agent to an App in response to an API call
 */
export interface AddContextListenerResponseMeta {
    requestUuid:  string;
    responseUuid: string;
    /**
     * Field that represents the source application that the request being responded to was
     * received from, for debugging purposes.
     */
    source?:   AppIdentifier;
    timestamp: Date;
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface AddContextListenerResponsePayload {
    error?:        PurpleError;
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
export type PurpleError = "AccessDenied" | "CreationFailed" | "MalformedContext" | "NoChannelFound";

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
    type: "addIntentListenerRequest";
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
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
     */
    meta: AddContextListenerResponseMeta;
    /**
     * A payload for a response to an API call that will contain any return values or an `error`
     * property containing a standardized error message indicating that the request was
     * unsuccessful.
     */
    payload: AddIntentListenerResponsePayload;
    /**
     * Identifies the type of the message and it is typically set to the FDC3 function name that
     * the message relates to, e.g. 'findIntent', with 'Response' appended.
     */
    type: "addIntentListenerResponse";
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface AddIntentListenerResponsePayload {
    error?:        FluffyError;
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
export type FluffyError = "MalformedContext" | "DesktopAgentNotFound" | "ResolverUnavailable" | "IntentDeliveryFailed" | "NoAppsFound" | "ResolverTimeout" | "TargetAppUnavailable" | "TargetInstanceUnavailable" | "UserCancelledResolution";

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * An event message from the Desktop Agent to an app indicating that context has been
 * broadcast on a channel it is listening to.
 *
 * A message from a Desktop Agent to an FDC3-enabled app representing an event.
 */
export interface BroadcastEvent {
    /**
     * Metadata for messages sent by a Desktop Agent to an App notifying it of an event.
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
    type: "broadcastEvent";
}

/**
 * Metadata for messages sent by a Desktop Agent to an App notifying it of an event.
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
     * The Id of the channel that the broadcast was sent on.
     */
    channelId: string;
    /**
     * The context object that was broadcast.
     */
    context: Context;
}

/**
 * The context object that was broadcast.
 *
 * The context object that is to be broadcast.
 *
 * The context object passed with the raised intent.
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
    type: "broadcastRequest";
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface BroadcastRequestPayload {
    /**
     * The Id of the Channel that the broadcast was sent on
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
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "broadcastResponse";
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
     * Metadata for messages sent by a Desktop Agent to an App notifying it of an event.
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
    type: "channelChangedEvent";
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
    type: "contextListenerUnsubscribeRequest";
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
 * A response to a request to a contextListenerUnsubscribe request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface ContextListenerUnsubscribeResponse {
    /**
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "contextListenerUnsubscribeResponse";
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
    type: "createPrivateChannelRequest";
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface CreatePrivateChannelRequestPayload {
}

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
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "createPrivateChannelResponse";
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface CreatePrivateChannelResponsePayload {
    error?:          PurpleError;
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
     * A URL of an image that can be used to display this channel
     */
    glyph?: string;
    /**
     * A user-readable name for this channel, e.g: `"Red"`
     */
    name?: string;
}

/**
 * Uniquely defines each channel type.
 * Can be "user", "app" or "private".
 */
export type Type = "app" | "private" | "user";

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
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
    type: "findInstancesRequest";
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
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "findInstancesResponse";
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
    error?:          FindInstancesErrors;
    appIdentifiers?: AppMetadata[];
}

/**
 * Extends an `AppIdentifier`, describing an application or instance of an application, with
 * additional descriptive metadata that is usually provided by an FDC3 App Directory that
 * the desktop agent connects to.
 *
 * The additional information from an app directory can aid in rendering UI elements, such
 * as a launcher menu or resolver UI. This includes a title, description, tooltip and icon
 * and screenshot URLs.
 *
 * Note that as `AppMetadata` instances are also `AppIdentifiers` they may be passed to the
 * `app` argument of `fdc3.open`, `fdc3.raiseIntent` etc.
 *
 * The calling application instance's own metadata, according to the Desktop Agent (MUST
 * include at least the `appId` and `instanceId`).
 */
export interface AppMetadata {
    /**
     * The unique application identifier located within a specific application directory
     * instance. An example of an appId might be 'app@sub.root'
     */
    appId: string;
    /**
     * A longer, multi-paragraph description for the application that could include markup
     */
    description?: string;
    /**
     * The Desktop Agent that the app is available on. Used in Desktop Agent Bridging to
     * identify the Desktop Agent to target.
     */
    desktopAgent?: string;
    /**
     * A list of icon URLs for the application that can be used to render UI elements
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
     * elements
     */
    screenshots?: Image[];
    /**
     * A more user-friendly application title that can be used to render UI elements
     */
    title?: string;
    /**
     * A tooltip for the application that can be used to render UI elements
     */
    tooltip?: string;
    /**
     * The Version of the application.
     */
    version?: string;
}

/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
export interface Icon {
    /**
     * The icon dimension, formatted as `<height>x<width>`.
     */
    size?: string;
    /**
     * The icon url
     */
    src: string;
    /**
     * Icon media type. If not present the Desktop Agent may use the src file extension.
     */
    type?: string;
}

/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
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
 * Constants representing the errors that can be encountered when calling the `open` method
 * on the DesktopAgent object (`fdc3`).
 *
 * Constants representing the errors that can be encountered when calling the `findIntent`,
 * `findIntentsByContext`, `raiseIntent` or `raiseIntentForContext` methods on the
 * DesktopAgent (`fdc3`).
 *
 * Unique identifier for a request or event message. Required in all message types
 *
 * Unique identifier for a response to a specific message and must always be accompanied by
 * a RequestUuid.
 *
 * Unique identifier for a `listener` object returned by a Desktop Agent to an app in
 * response to addContextListener, addIntentListener or one of the PrivateChannel event
 * listeners and used to identify it in messages (e.g. when unsubscribing).
 *
 * Unique identifier for a for an attempt to connect to a Desktop Agent
 */
export type FindInstancesErrors = "MalformedContext" | "DesktopAgentNotFound" | "ResolverUnavailable" | "IntentDeliveryFailed" | "NoAppsFound" | "ResolverTimeout" | "TargetAppUnavailable" | "TargetInstanceUnavailable" | "UserCancelledResolution" | "AgentDisconnected" | "NotConnectedToBridge" | "ResponseToBridgeTimedOut" | "MalformedMessage";

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
    type: "findIntentRequest";
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface FindIntentRequestPayload {
    context?:    Context;
    intent:      string;
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
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "findIntentResponse";
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface FindIntentResponsePayload {
    error?:     FindInstancesErrors;
    appIntent?: AppIntent;
}

/**
 * An interface that relates an intent to apps
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
 * Intent descriptor
 */
export interface IntentMetadata {
    /**
     * Display name for the intent.
     */
    displayName: string;
    /**
     * The unique name of the intent that can be invoked by the raiseIntent call
     */
    name: string;
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
    type: "findIntentsByContextRequest";
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface FindIntentsByContextRequestPayload {
    context:     Context;
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
export interface FindIntentsByContextsByContextResponse {
    /**
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
     */
    meta: AddContextListenerResponseMeta;
    /**
     * A payload for a response to an API call that will contain any return values or an `error`
     * property containing a standardized error message indicating that the request was
     * unsuccessful.
     */
    payload: FindIntentsByContextsByContextResponsePayload;
    /**
     * Identifies the type of the message and it is typically set to the FDC3 function name that
     * the message relates to, e.g. 'findIntent', with 'Response' appended.
     */
    type: "findIntentsByContextResponse";
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface FindIntentsByContextsByContextResponsePayload {
    error?:      FindInstancesErrors;
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
    type: "getAppMetadataRequest";
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
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "getAppMetadataResponse";
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface GetAppMetadataResponsePayload {
    error?:       FindInstancesErrors;
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
    type: "getCurrentChannelRequest";
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface GetCurrentChannelRequestPayload {
}

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
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "getCurrentChannelResponse";
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface GetCurrentChannelResponsePayload {
    error?:   ResponsePayloadError;
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
    type: "getCurrentContextRequest";
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface GetCurrentContextRequestPayload {
    /**
     * The id of the channel to return the current context of
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
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "getCurrentContextResponse";
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
     * or `null` if none was available in the channel
     */
    context?: null | Context;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * Request to retrieve information about the FDC3 Desktop Agent implementation  and the
 * metadata of the calling application according to the desktop agent.
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
    type: "getInfoRequest";
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface GetInfoRequestPayload {
}

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
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "getInfoResponse";
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface GetInfoResponsePayload {
    error?:                  ResponsePayloadError;
    implementationMetadata?: ImplementationMetadata;
}

/**
 * Implementation metadata for the Desktop Agent, which includes an appMetadata element
 * containing a copy of the app's own metadata
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
    type: "getOrCreateChannelRequest";
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
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "getOrCreateChannelResponse";
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface GetOrCreateChannelResponsePayload {
    error?:   PurpleError;
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
    type: "getUserChannelsRequest";
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface GetUserChannelsRequestPayload {
}

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
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "getUserChannelsResponse";
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface GetUserChannelsResponsePayload {
    error?:        PurpleError;
    userChannels?: Channel[];
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * Message from the channel selector UI to the DA proxy when the user drags the selector to
 * a new location.
 *
 * A message used to communicate with iframes injected by `getAgent()` for displaying UI
 * elements such as the intent resolver or channel selector. Used for messages sent in
 * either direction.
 */
export interface IframeChannelDrag {
    /**
     * The message payload
     */
    payload: IframeChannelDragPayload;
    /**
     * Identifies the type of the message to or from the iframe.
     */
    type: "iframeChannelDrag";
}

/**
 * The message payload
 */
export interface IframeChannelDragPayload {
    /**
     * The offset to move the frame by
     */
    mouse: MouseClass;
}

/**
 * The offset to move the frame by
 */
export interface MouseClass {
    offsetX: number;
    offsetY: number;
}

/**
 * Identifies the type of the message to or from the iframe.
 */

/**
 * Message from the channel selector UI to the DA proxy when the user hits a toggle button
 * that opens or closes the selector or otherwise resizes it. Includes the size that it
 * should change to and the corner (if any) at which the change should be made.
 *
 * A message used to communicate with iframes injected by `getAgent()` for displaying UI
 * elements such as the intent resolver or channel selector. Used for messages sent in
 * either direction.
 */
export interface IframeChannelResize {
    /**
     * The message payload
     */
    payload: IframeChannelResizePayload;
    /**
     * Identifies the type of the message to or from the iframe.
     */
    type: "iframeChannelResize";
}

/**
 * The message payload
 */
export interface IframeChannelResizePayload {
    /**
     * The updated dimensions of the UI
     */
    dimensions: DimensionsClass;
    /**
     * When resizing anchor at the indicated location,
     * e.g.
     * - for top-left and a larger size: the bottom right corner should move down and out.
     * - for top and smaller size: both the bottom corners should move in and up.
     */
    resizeAnchor: Resizing;
}

/**
 * The updated dimensions of the UI
 */
export interface DimensionsClass {
    height: number;
    width:  number;
}

/**
 * When resizing anchor at the indicated location,
 * e.g.
 * - for top-left and a larger size: the bottom right corner should move down and out.
 * - for top and smaller size: both the bottom corners should move in and up.
 */
export type Resizing = "top-left" | "top" | "top-right" | "right" | "bottom-right" | "bottom" | "bottom-left" | "left" | "center";

/**
 * Identifies the type of the message to or from the iframe.
 */

/**
 * Setup message sent by the DA proxy code in getAgent() to a channel selector UI in an
 * iframe with the channel definitions and current channel selection.
 *
 * A message used to communicate with iframes injected by `getAgent()` for displaying UI
 * elements such as the intent resolver or channel selector. Used for messages sent in
 * either direction.
 */
export interface IframeChannels {
    /**
     * The message payload
     */
    payload: IframeChannelsPayload;
    /**
     * Identifies the type of the message to or from the iframe.
     */
    type: "iframeChannels";
}

/**
 * The message payload
 */
export interface IframeChannelsPayload {
    /**
     * If the channel selector was previously displayed in this window its location may be
     * restored by setting the location coordinates
     */
    location?: Location;
    /**
     * The id of the channel that should be currently selected, or `null` if none should be
     * selected
     */
    selected: null | string;
    /**
     * User Channel definitions
     */
    userChannels: Channel[];
}

/**
 * If the channel selector was previously displayed in this window its location may be
 * restored by setting the location coordinates
 */
export interface Location {
    x: number;
    y: number;
}

/**
 * Identifies the type of the message to or from the iframe.
 */

/**
 * Message from the channel selector UI to the DA proxy sent when the channel selection
 * changes.
 *
 * A message used to communicate with iframes injected by `getAgent()` for displaying UI
 * elements such as the intent resolver or channel selector. Used for messages sent in
 * either direction.
 */
export interface IframeChannelSelected {
    /**
     * The message payload
     */
    payload: IframeChannelSelectedPayload;
    /**
     * Identifies the type of the message to or from the iframe.
     */
    type: "iframeChannelSelected";
}

/**
 * The message payload
 */
export interface IframeChannelSelectedPayload {
    /**
     * The id of the channel that should be currently selected, or `null` if none should be
     * selected
     */
    selected: null | string;
}

/**
 * Identifies the type of the message to or from the iframe.
 */

/**
 * Handshake message sent back by an iframe to the DA proxy code indicating that it is setup
 * and ready to communicate over the MessagePort.
 *
 * A message used to communicate with iframes injected by `getAgent()` for displaying UI
 * elements such as the intent resolver or channel selector. Used for messages sent in
 * either direction.
 */
export interface IframeHandshake {
    /**
     * The message payload
     */
    payload: IframeHandshakePayload;
    /**
     * Identifies the type of the message to or from the iframe.
     */
    type: "iframeHandshake";
}

/**
 * The message payload
 */
export interface IframeHandshakePayload {
    /**
     * Details about the UI implementation in the iframe, such as vendor and version, for
     * logging purposes.
     */
    implementationDetails: string;
}

/**
 * Identifies the type of the message to or from the iframe.
 */

/**
 * Hello message sent by the DA proxy code in getAgent() to an iframe, that it has injected
 * into the page, with a MessagePort appended that should be used for subsequent
 * communication steps.
 *
 * A message used to communicate with iframes injected by `getAgent()` for displaying UI
 * elements such as the intent resolver or channel selector. Used for messages sent in
 * either direction.
 */
export interface IframeHello {
    /**
     * The message payload
     */
    payload: IframeHelloPayload;
    /**
     * Identifies the type of the message to or from the iframe.
     */
    type: "iframeHello";
}

/**
 * The message payload
 */
export interface IframeHelloPayload {
    /**
     * The version of FDC3 API that the Desktop Agent proxy is providing support for.
     */
    fdc3Version: string;
}

/**
 * Identifies the type of the message to or from the iframe.
 */

/**
 * A message used to communicate with iframes injected by `getAgent()` for displaying UI
 * elements such as the intent resolver or channel selector. Used for messages sent in
 * either direction.
 */
export interface IframeMessage {
    /**
     * The message payload
     */
    payload?: { [key: string]: any };
    /**
     * Identifies the type of the message to or from the iframe.
     */
    type: IframeMessageType;
}

/**
 * Identifies the type of the message to or from the iframe.
 */
export type IframeMessageType = "iframeHello" | "iframeHandshake" | "iframeResolve" | "iframeResolveAction" | "iframeChannels" | "iframeChannelSelected" | "iframeChannelResize" | "iframeChannelDrag";

/**
 * Setup message sent by the DA proxy code in getAgent() to an intent resolver UI in an
 * iframe with the resolver data to setup the UI.
 *
 * A message used to communicate with iframes injected by `getAgent()` for displaying UI
 * elements such as the intent resolver or channel selector. Used for messages sent in
 * either direction.
 */
export interface IframeResolve {
    /**
     * The message payload
     */
    payload: IframeResolvePayload;
    /**
     * Identifies the type of the message to or from the iframe.
     */
    type: "iframeResolve";
}

/**
 * The message payload
 */
export interface IframeResolvePayload {
    /**
     * An array of AppIntent objects defining the resolution options.
     */
    appIntents: AppIntent[];
    context:    Context;
}

/**
 * Identifies the type of the message to or from the iframe.
 */

/**
 * Message from an intent resolver UI in an iframe to DA proxy code in getAgent() reporting
 * a user action.
 *
 * A message used to communicate with iframes injected by `getAgent()` for displaying UI
 * elements such as the intent resolver or channel selector. Used for messages sent in
 * either direction.
 */
export interface IframeResolveAction {
    /**
     * The message payload
     */
    payload: IframeResolveActionPayload;
    /**
     * Identifies the type of the message to or from the iframe.
     */
    type: "iframeResolveAction";
}

/**
 * The message payload
 */
export interface IframeResolveActionPayload {
    action: Action;
    /**
     * The App resolution option chosen
     */
    appIdentifier?: AppIdentifier;
    /**
     * The intent resolved
     */
    intent?: string;
}

export type Action = "hover" | "click" | "cancel";

/**
 * Identifies the type of the message to or from the iframe.
 */

/**
 * An event message from the Desktop Agent to an app indicating that it has been selected to
 * resolve a raised intent and context.
 *
 * A message from a Desktop Agent to an FDC3-enabled app representing an event.
 */
export interface IntentEvent {
    /**
     * Metadata for messages sent by a Desktop Agent to an App notifying it of an event.
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
    type: "intentEvent";
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
     * Details of the application instance that raised the intent
     */
    originatingApp?: AppIdentifier;
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
    type: "intentListenerUnsubscribeRequest";
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
 * A response to a request to a intentListenerUnsubscribe request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface IntentListenerUnsubscribeResponse {
    /**
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "intentListenerUnsubscribeResponse";
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * Request to join the app to the specified User channel.
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
    type: "joinUserChannelRequest";
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface JoinUserChannelRequestPayload {
    /**
     * The id of the channel to join
     */
    channelId: string;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Request' appended.
 */

/**
 * A response to a joinUserChannel request.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface JoinUserChannelResponse {
    /**
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "joinUserChannelResponse";
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
    type: "leaveCurrentChannelRequest";
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface LeaveCurrentChannelRequestPayload {
}

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
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "leaveCurrentChannelResponse";
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
    type: "openRequest";
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface OpenRequestPayload {
    app: AppIdentifier;
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
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "openResponse";
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface OpenResponsePayload {
    error?:         OpenErrorResponsePayload;
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
export type OpenErrorResponsePayload = "MalformedContext" | "AppNotFound" | "AppTimeout" | "DesktopAgentNotFound" | "ErrorOnLaunch" | "ResolverUnavailable" | "AgentDisconnected" | "NotConnectedToBridge" | "ResponseToBridgeTimedOut" | "MalformedMessage";

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * An event message from the Desktop Agent to an app indicating that another app has added a
 * context listener to a specific PrivateChannel.
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
    payload: TPayload;
    /**
     * Identifies the type of the message and it is typically set to the FDC3 function name that
     * the message relates to, e.g. 'findIntent', with 'Request' appended.
     */
    type: "privateChannelAddEventListenerRequest";
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface TPayload {
    /**
     * The type of the context listener to add to the channel, or null if it should listen to
     * all types.
     */
    contextType: null | string;
    /**
     * The Id of the PrivateChannel that the listener should be added to.
     */
    privateChannelId: string;
}

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
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "privateChannelAddEventListenerResponse";
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface PrivateChannelAddEventListenerResponsePayload {
    error?:        PurpleError;
    listenerUUID?: string;
    [property: string]: any;
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
    type: "privateChannelDisconnectRequest";
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
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "privateChannelDisconnectResponse";
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
     * Metadata for messages sent by a Desktop Agent to an App notifying it of an event.
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
    type: "privateChannelOnAddContextListenerEvent";
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
     * Metadata for messages sent by a Desktop Agent to an App notifying it of an event.
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
    type: "privateChannelOnDisconnectEvent";
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
export interface PrivateChannelOnUnsubscribeEventEvent {
    /**
     * Metadata for messages sent by a Desktop Agent to an App notifying it of an event.
     */
    meta: BroadcastEventMeta;
    /**
     * The message payload contains details of the event that the app is being notified about.
     */
    payload: PrivateChannelOnUnsubscribeEventEventPayload;
    /**
     * Identifies the type of the message and it is typically set to the FDC3 function name that
     * the message relates to, e.g. 'findIntent', with 'Response' appended.
     */
    type: "privateChannelOnUnsubscribeEvent";
}

/**
 * The message payload contains details of the event that the app is being notified about.
 */
export interface PrivateChannelOnUnsubscribeEventEventPayload {
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
    type: "privateChannelUnsubscribeEventListenerRequest";
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
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
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
    type: "privateChannelUnsubscribeEventListenerResponse";
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
    type: "raiseIntentForContextRequest";
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface RaiseIntentForContextRequestPayload {
    app?:    AppIdentifier;
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
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
     */
    meta: AddContextListenerResponseMeta;
    /**
     * A payload for a response to an API call that will contain any return values or an `error`
     * property containing a standardized error message indicating that the request was
     * unsuccessful.
     */
    payload: RaiseIntentForContextResponsePayload;
    /**
     * Identifies the type of the message and it is typically set to the FDC3 function name that
     * the message relates to, e.g. 'findIntent', with 'Response' appended.
     */
    type: "raiseIntentForContextResponse";
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 *
 * Response to a raiseIntent request that was successfully resolved
 *
 * Response to a raiseIntentForContext request that needs additional resolution (i.e. show
 * an intent resolver UI)
 *
 * Response to a raiseIntent request that resulted in an error
 */
export interface RaiseIntentForContextResponsePayload {
    error?:            FindInstancesErrors;
    intentResolution?: IntentResolution;
    appIntents?:       AppIntent[];
}

/**
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
    type: "raiseIntentRequest";
}

/**
 * The message payload typically contains the arguments to FDC3 API functions.
 */
export interface RaiseIntentRequestPayload {
    app?:    AppIdentifier;
    context: Context;
    intent:  string;
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
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
     */
    meta: AddContextListenerResponseMeta;
    /**
     * A payload for a response to an API call that will contain any return values or an `error`
     * property containing a standardized error message indicating that the request was
     * unsuccessful.
     */
    payload: RaiseIntentResponsePayload;
    /**
     * Identifies the type of the message and it is typically set to the FDC3 function name that
     * the message relates to, e.g. 'findIntent', with 'Response' appended.
     */
    type: "raiseIntentResponse";
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 *
 * Response to a raiseIntent request that was successfully resolved
 *
 * Response to a raiseIntent request that needs additional resolution (i.e. show an intent
 * resolver UI)
 *
 * Response to a raiseIntent request that resulted in an error
 */
export interface RaiseIntentResponsePayload {
    error?:            FindInstancesErrors;
    intentResolution?: IntentResolution;
    appIntent?:        AppIntent;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * A secondary response to a request to raise an intent used to deliver the intent result.
 *
 * A message from a Desktop Agent to an FDC3-enabled app responding to an API call. If the
 * payload contains an `error` property, the request was unsuccessful.
 */
export interface RaiseIntentResultResponse {
    /**
     * Metadata for messages sent by a Desktop Agent to an App in response to an API call
     */
    meta: AddContextListenerResponseMeta;
    /**
     * A payload for a response to an API call that will contain any return values or an `error`
     * property containing a standardized error message indicating that the request was
     * unsuccessful.
     */
    payload: ResponsePayload;
    /**
     * Identifies the type of the message and it is typically set to the FDC3 function name that
     * the message relates to, e.g. 'findIntent', with 'Response' appended.
     */
    type: "raiseIntentResultResponse";
}

/**
 * A payload for a response to an API call that will contain any return values or an `error`
 * property containing a standardized error message indicating that the request was
 * unsuccessful.
 */
export interface ResponsePayload {
    error?:        ResponsePayloadError;
    intentResult?: IntentResult;
}

export interface IntentResult {
    context?: Context;
    channel?: Channel;
}

/**
 * Identifies the type of the message and it is typically set to the FDC3 function name that
 * the message relates to, e.g. 'findIntent', with 'Response' appended.
 */

/**
 * Hello message sent by an application to a parent window or frame when attempting to
 * establish connectivity to a Desktop Agent
 *
 * A message used during the connection flow for an application to a Desktop Agent in a
 * browser window. Used for messages sent in either direction.
 */
export interface WebConnectionProtocol1Hello {
    meta: ConnectionStepMetadata;
    /**
     * The message payload, containing data pertaining to this connection step.
     */
    payload: WebConnectionProtocol1HelloPayload;
    /**
     * Identifies the type of the connection step message.
     */
    type: "WCP1Hello";
}

/**
 * Metadata for this connection step message
 */
export interface ConnectionStepMetadata {
    connectionAttemptUuid: string;
    timestamp:             Date;
}

/**
 * The message payload, containing data pertaining to this connection step.
 */
export interface WebConnectionProtocol1HelloPayload {
    /**
     * A flag that may be used to indicate that a channel selector UI is or is not required. If
     * the app includes its own UI for displaying
     */
    channelSelector?: boolean;
    /**
     * The version of FDC3 API that the app supports.
     */
    fdc3Version: string;
    /**
     * A flag that may be used to indicate that an intent resolver is or is not required. Set to
     * false if no intents, or only targeted intents, are raised
     */
    resolver?: boolean;
    [property: string]: any;
}

/**
 * Identifies the type of the connection step message.
 */

/**
 * Response from a Desktop Agent to an application requesting access to it indicating that
 * it should load a specified URL into a hidden iframe in order to establish connectivity to
 * a Desktop Agent
 *
 * A message used during the connection flow for an application to a Desktop Agent in a
 * browser window. Used for messages sent in either direction.
 */
export interface WebConnectionProtocol2LoadURL {
    meta: ConnectionStepMetadata;
    /**
     * The message payload, containing data pertaining to this connection step.
     */
    payload: WebConnectionProtocol2LoadURLPayload;
    /**
     * Identifies the type of the connection step message.
     */
    type: "WCP2LoadUrl";
}

/**
 * The message payload, containing data pertaining to this connection step.
 */
export interface WebConnectionProtocol2LoadURLPayload {
    /**
     * A URL which can be used to establish communication with the Desktop Agent, via loading
     * the URL into an iframe and restarting the Web Connection protocol with the iframe as the
     * target
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
    meta: ConnectionStepMetadata;
    /**
     * The message payload, containing data pertaining to this connection step.
     */
    payload: WebConnectionProtocol3HandshakePayload;
    /**
     * Identifies the type of the connection step message.
     */
    type: "WCP3Handshake";
}

/**
 * The message payload, containing data pertaining to this connection step.
 */
export interface WebConnectionProtocol3HandshakePayload {
    /**
     * Indicates whether a channel selector UI is required and the URL to use to do so. Set to
     * `true` to use the default or `false` to disable the channel selector (as the Desktop
     * Agent will handle another way)
     */
    channelSelector: boolean | string;
    /**
     * The version of FDC3 API that the Desktop Agent will provide support for.
     */
    fdc3Version: string;
    /**
     * Indicates whether an intent resolver UI is required and the URL to use to do so. Set to
     * `true` to use the default or `false` to disable the intent resolver (as the Desktop Agent
     * will handle another way)
     */
    resolver: boolean | string;
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
    meta: ConnectionStepMetadata;
    /**
     * The message payload, containing data pertaining to this connection step.
     */
    payload: WebConnectionProtocol4ValidateAppIdentityPayload;
    /**
     * Identifies the type of the connection step message.
     */
    type: "WCP4ValidateAppIdentity";
}

/**
 * The message payload, containing data pertaining to this connection step.
 */
export interface WebConnectionProtocol4ValidateAppIdentityPayload {
    /**
     * URL for an App Directory record that provides identity details for the application
     * attempting to connect
     */
    appDUrl?: string;
    /**
     * appId for the application attempting to connect. The appId must be fully qualified
     * (appId@host.domain.appD) such that the URL for the appD record can be determined for
     * identity validation purposes, or appDUrl must also be specified.
     */
    appId: string;
    /**
     * If an application has previously connected to the desktop agent, it may specify its prior
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
    meta: ConnectionStepMetadata;
    /**
     * The message payload, containing data pertaining to this connection step.
     */
    payload: WebConnectionProtocol5ValidateAppIdentityFailedResponsePayload;
    /**
     * Identifies the type of the connection step message.
     */
    type: "WCP5ValidateAppIdentityFailedResponse";
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
 * Message sent by the Desktop Agent to an app after successful identity validation
 *
 * A message used during the connection flow for an application to a Desktop Agent in a
 * browser window. Used for messages sent in either direction.
 */
export interface WebConnectionProtocol5ValidateAppIdentitySuccessResponse {
    meta: ConnectionStepMetadata;
    /**
     * The message payload, containing data pertaining to this connection step.
     */
    payload: WebConnectionProtocol5ValidateAppIdentitySuccessResponsePayload;
    /**
     * Identifies the type of the connection step message.
     */
    type: "WCP5ValidateAppIdentityResponse";
}

/**
 * The message payload, containing data pertaining to this connection step.
 */
export interface WebConnectionProtocol5ValidateAppIdentitySuccessResponsePayload {
    /**
     * The appId that the app's identity was validated against
     */
    appId: string;
    /**
     * Implementation metadata for the Desktop Agent, which includes an appMetadata element
     * containing a copy of the app's own metadata
     */
    implementationMetadata: ImplementationMetadata;
    /**
     * The instance Id granted to the application by the Desktop Agent.
     */
    instanceId: string;
    /**
     * Instance UUID associated with the instanceId granted, which may be used to retrieve the
     * same instance Id if the app is reloaded or navigates.
     */
    instanceUuid: string;
}

/**
 * Identifies the type of the connection step message.
 */

/**
 * A message used during the connection flow for an application to a Desktop Agent in a
 * browser window. Used for messages sent in either direction.
 */
export interface WebConnectionProtocolMessage {
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
 * Identifies the type of the connection step message.
 */
export type ConnectionStepMessageType = "WCP1Hello" | "WCP2LoadUrl" | "WCP3Handshake" | "WCP4ValidateAppIdentity" | "WCP5ValidateAppIdentityFailedResponse" | "WCP5ValidateAppIdentityResponse";

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toFDC3DesktopAgentAPISchemas(json: string): any {
        return cast(JSON.parse(json), "any");
    }

    public static fDC3DesktopAgentAPISchemasToJson(value: any): string {
        return JSON.stringify(uncast(value, "any"), null, 2);
    }

    public static toCommonDefinitions(json: string): { [key: string]: any } {
        return cast(JSON.parse(json), m("any"));
    }

    public static commonDefinitionsToJson(value: { [key: string]: any }): string {
        return JSON.stringify(uncast(value, m("any")), null, 2);
    }

    public static toAppRequestMessage(json: string): AppRequestMessage {
        return cast(JSON.parse(json), r("AppRequestMessage"));
    }

    public static appRequestMessageToJson(value: AppRequestMessage): string {
        return JSON.stringify(uncast(value, r("AppRequestMessage")), null, 2);
    }

    public static toAgentResponseMessage(json: string): AgentResponseMessage {
        return cast(JSON.parse(json), r("AgentResponseMessage"));
    }

    public static agentResponseMessageToJson(value: AgentResponseMessage): string {
        return JSON.stringify(uncast(value, r("AgentResponseMessage")), null, 2);
    }

    public static toAgentEventMessage(json: string): AgentEventMessage {
        return cast(JSON.parse(json), r("AgentEventMessage"));
    }

    public static agentEventMessageToJson(value: AgentEventMessage): string {
        return JSON.stringify(uncast(value, r("AgentEventMessage")), null, 2);
    }

    public static toAddContextListenerRequest(json: string): AddContextListenerRequest {
        return cast(JSON.parse(json), r("AddContextListenerRequest"));
    }

    public static addContextListenerRequestToJson(value: AddContextListenerRequest): string {
        return JSON.stringify(uncast(value, r("AddContextListenerRequest")), null, 2);
    }

    public static toAddContextListenerResponse(json: string): AddContextListenerResponse {
        return cast(JSON.parse(json), r("AddContextListenerResponse"));
    }

    public static addContextListenerResponseToJson(value: AddContextListenerResponse): string {
        return JSON.stringify(uncast(value, r("AddContextListenerResponse")), null, 2);
    }

    public static toAddIntentListenerRequest(json: string): AddIntentListenerRequest {
        return cast(JSON.parse(json), r("AddIntentListenerRequest"));
    }

    public static addIntentListenerRequestToJson(value: AddIntentListenerRequest): string {
        return JSON.stringify(uncast(value, r("AddIntentListenerRequest")), null, 2);
    }

    public static toAddIntentListenerResponse(json: string): AddIntentListenerResponse {
        return cast(JSON.parse(json), r("AddIntentListenerResponse"));
    }

    public static addIntentListenerResponseToJson(value: AddIntentListenerResponse): string {
        return JSON.stringify(uncast(value, r("AddIntentListenerResponse")), null, 2);
    }

    public static toBroadcastEvent(json: string): BroadcastEvent {
        return cast(JSON.parse(json), r("BroadcastEvent"));
    }

    public static broadcastEventToJson(value: BroadcastEvent): string {
        return JSON.stringify(uncast(value, r("BroadcastEvent")), null, 2);
    }

    public static toBroadcastRequest(json: string): BroadcastRequest {
        return cast(JSON.parse(json), r("BroadcastRequest"));
    }

    public static broadcastRequestToJson(value: BroadcastRequest): string {
        return JSON.stringify(uncast(value, r("BroadcastRequest")), null, 2);
    }

    public static toBroadcastResponse(json: string): BroadcastResponse {
        return cast(JSON.parse(json), r("BroadcastResponse"));
    }

    public static broadcastResponseToJson(value: BroadcastResponse): string {
        return JSON.stringify(uncast(value, r("BroadcastResponse")), null, 2);
    }

    public static toChannelChangedEvent(json: string): ChannelChangedEvent {
        return cast(JSON.parse(json), r("ChannelChangedEvent"));
    }

    public static channelChangedEventToJson(value: ChannelChangedEvent): string {
        return JSON.stringify(uncast(value, r("ChannelChangedEvent")), null, 2);
    }

    public static toContextListenerUnsubscribeRequest(json: string): ContextListenerUnsubscribeRequest {
        return cast(JSON.parse(json), r("ContextListenerUnsubscribeRequest"));
    }

    public static contextListenerUnsubscribeRequestToJson(value: ContextListenerUnsubscribeRequest): string {
        return JSON.stringify(uncast(value, r("ContextListenerUnsubscribeRequest")), null, 2);
    }

    public static toContextListenerUnsubscribeResponse(json: string): ContextListenerUnsubscribeResponse {
        return cast(JSON.parse(json), r("ContextListenerUnsubscribeResponse"));
    }

    public static contextListenerUnsubscribeResponseToJson(value: ContextListenerUnsubscribeResponse): string {
        return JSON.stringify(uncast(value, r("ContextListenerUnsubscribeResponse")), null, 2);
    }

    public static toCreatePrivateChannelRequest(json: string): CreatePrivateChannelRequest {
        return cast(JSON.parse(json), r("CreatePrivateChannelRequest"));
    }

    public static createPrivateChannelRequestToJson(value: CreatePrivateChannelRequest): string {
        return JSON.stringify(uncast(value, r("CreatePrivateChannelRequest")), null, 2);
    }

    public static toCreatePrivateChannelResponse(json: string): CreatePrivateChannelResponse {
        return cast(JSON.parse(json), r("CreatePrivateChannelResponse"));
    }

    public static createPrivateChannelResponseToJson(value: CreatePrivateChannelResponse): string {
        return JSON.stringify(uncast(value, r("CreatePrivateChannelResponse")), null, 2);
    }

    public static toFindInstancesRequest(json: string): FindInstancesRequest {
        return cast(JSON.parse(json), r("FindInstancesRequest"));
    }

    public static findInstancesRequestToJson(value: FindInstancesRequest): string {
        return JSON.stringify(uncast(value, r("FindInstancesRequest")), null, 2);
    }

    public static toFindInstancesResponse(json: string): FindInstancesResponse {
        return cast(JSON.parse(json), r("FindInstancesResponse"));
    }

    public static findInstancesResponseToJson(value: FindInstancesResponse): string {
        return JSON.stringify(uncast(value, r("FindInstancesResponse")), null, 2);
    }

    public static toFindIntentRequest(json: string): FindIntentRequest {
        return cast(JSON.parse(json), r("FindIntentRequest"));
    }

    public static findIntentRequestToJson(value: FindIntentRequest): string {
        return JSON.stringify(uncast(value, r("FindIntentRequest")), null, 2);
    }

    public static toFindIntentResponse(json: string): FindIntentResponse {
        return cast(JSON.parse(json), r("FindIntentResponse"));
    }

    public static findIntentResponseToJson(value: FindIntentResponse): string {
        return JSON.stringify(uncast(value, r("FindIntentResponse")), null, 2);
    }

    public static toFindIntentsByContextRequest(json: string): FindIntentsByContextRequest {
        return cast(JSON.parse(json), r("FindIntentsByContextRequest"));
    }

    public static findIntentsByContextRequestToJson(value: FindIntentsByContextRequest): string {
        return JSON.stringify(uncast(value, r("FindIntentsByContextRequest")), null, 2);
    }

    public static toFindIntentsByContextsByContextResponse(json: string): FindIntentsByContextsByContextResponse {
        return cast(JSON.parse(json), r("FindIntentsByContextsByContextResponse"));
    }

    public static findIntentsByContextsByContextResponseToJson(value: FindIntentsByContextsByContextResponse): string {
        return JSON.stringify(uncast(value, r("FindIntentsByContextsByContextResponse")), null, 2);
    }

    public static toGetAppMetadataRequest(json: string): GetAppMetadataRequest {
        return cast(JSON.parse(json), r("GetAppMetadataRequest"));
    }

    public static getAppMetadataRequestToJson(value: GetAppMetadataRequest): string {
        return JSON.stringify(uncast(value, r("GetAppMetadataRequest")), null, 2);
    }

    public static toGetAppMetadataResponse(json: string): GetAppMetadataResponse {
        return cast(JSON.parse(json), r("GetAppMetadataResponse"));
    }

    public static getAppMetadataResponseToJson(value: GetAppMetadataResponse): string {
        return JSON.stringify(uncast(value, r("GetAppMetadataResponse")), null, 2);
    }

    public static toGetCurrentChannelRequest(json: string): GetCurrentChannelRequest {
        return cast(JSON.parse(json), r("GetCurrentChannelRequest"));
    }

    public static getCurrentChannelRequestToJson(value: GetCurrentChannelRequest): string {
        return JSON.stringify(uncast(value, r("GetCurrentChannelRequest")), null, 2);
    }

    public static toGetCurrentChannelResponse(json: string): GetCurrentChannelResponse {
        return cast(JSON.parse(json), r("GetCurrentChannelResponse"));
    }

    public static getCurrentChannelResponseToJson(value: GetCurrentChannelResponse): string {
        return JSON.stringify(uncast(value, r("GetCurrentChannelResponse")), null, 2);
    }

    public static toGetCurrentContextRequest(json: string): GetCurrentContextRequest {
        return cast(JSON.parse(json), r("GetCurrentContextRequest"));
    }

    public static getCurrentContextRequestToJson(value: GetCurrentContextRequest): string {
        return JSON.stringify(uncast(value, r("GetCurrentContextRequest")), null, 2);
    }

    public static toGetCurrentContextResponse(json: string): GetCurrentContextResponse {
        return cast(JSON.parse(json), r("GetCurrentContextResponse"));
    }

    public static getCurrentContextResponseToJson(value: GetCurrentContextResponse): string {
        return JSON.stringify(uncast(value, r("GetCurrentContextResponse")), null, 2);
    }

    public static toGetInfoRequest(json: string): GetInfoRequest {
        return cast(JSON.parse(json), r("GetInfoRequest"));
    }

    public static getInfoRequestToJson(value: GetInfoRequest): string {
        return JSON.stringify(uncast(value, r("GetInfoRequest")), null, 2);
    }

    public static toGetInfoResponse(json: string): GetInfoResponse {
        return cast(JSON.parse(json), r("GetInfoResponse"));
    }

    public static getInfoResponseToJson(value: GetInfoResponse): string {
        return JSON.stringify(uncast(value, r("GetInfoResponse")), null, 2);
    }

    public static toGetOrCreateChannelRequest(json: string): GetOrCreateChannelRequest {
        return cast(JSON.parse(json), r("GetOrCreateChannelRequest"));
    }

    public static getOrCreateChannelRequestToJson(value: GetOrCreateChannelRequest): string {
        return JSON.stringify(uncast(value, r("GetOrCreateChannelRequest")), null, 2);
    }

    public static toGetOrCreateChannelResponse(json: string): GetOrCreateChannelResponse {
        return cast(JSON.parse(json), r("GetOrCreateChannelResponse"));
    }

    public static getOrCreateChannelResponseToJson(value: GetOrCreateChannelResponse): string {
        return JSON.stringify(uncast(value, r("GetOrCreateChannelResponse")), null, 2);
    }

    public static toGetUserChannelsRequest(json: string): GetUserChannelsRequest {
        return cast(JSON.parse(json), r("GetUserChannelsRequest"));
    }

    public static getUserChannelsRequestToJson(value: GetUserChannelsRequest): string {
        return JSON.stringify(uncast(value, r("GetUserChannelsRequest")), null, 2);
    }

    public static toGetUserChannelsResponse(json: string): GetUserChannelsResponse {
        return cast(JSON.parse(json), r("GetUserChannelsResponse"));
    }

    public static getUserChannelsResponseToJson(value: GetUserChannelsResponse): string {
        return JSON.stringify(uncast(value, r("GetUserChannelsResponse")), null, 2);
    }

    public static toIframeChannelDrag(json: string): IframeChannelDrag {
        return cast(JSON.parse(json), r("IframeChannelDrag"));
    }

    public static iframeChannelDragToJson(value: IframeChannelDrag): string {
        return JSON.stringify(uncast(value, r("IframeChannelDrag")), null, 2);
    }

    public static toIframeChannelResize(json: string): IframeChannelResize {
        return cast(JSON.parse(json), r("IframeChannelResize"));
    }

    public static iframeChannelResizeToJson(value: IframeChannelResize): string {
        return JSON.stringify(uncast(value, r("IframeChannelResize")), null, 2);
    }

    public static toIframeChannels(json: string): IframeChannels {
        return cast(JSON.parse(json), r("IframeChannels"));
    }

    public static iframeChannelsToJson(value: IframeChannels): string {
        return JSON.stringify(uncast(value, r("IframeChannels")), null, 2);
    }

    public static toIframeChannelSelected(json: string): IframeChannelSelected {
        return cast(JSON.parse(json), r("IframeChannelSelected"));
    }

    public static iframeChannelSelectedToJson(value: IframeChannelSelected): string {
        return JSON.stringify(uncast(value, r("IframeChannelSelected")), null, 2);
    }

    public static toIframeHandshake(json: string): IframeHandshake {
        return cast(JSON.parse(json), r("IframeHandshake"));
    }

    public static iframeHandshakeToJson(value: IframeHandshake): string {
        return JSON.stringify(uncast(value, r("IframeHandshake")), null, 2);
    }

    public static toIframeHello(json: string): IframeHello {
        return cast(JSON.parse(json), r("IframeHello"));
    }

    public static iframeHelloToJson(value: IframeHello): string {
        return JSON.stringify(uncast(value, r("IframeHello")), null, 2);
    }

    public static toIframeMessage(json: string): IframeMessage {
        return cast(JSON.parse(json), r("IframeMessage"));
    }

    public static iframeMessageToJson(value: IframeMessage): string {
        return JSON.stringify(uncast(value, r("IframeMessage")), null, 2);
    }

    public static toIframeResolve(json: string): IframeResolve {
        return cast(JSON.parse(json), r("IframeResolve"));
    }

    public static iframeResolveToJson(value: IframeResolve): string {
        return JSON.stringify(uncast(value, r("IframeResolve")), null, 2);
    }

    public static toIframeResolveAction(json: string): IframeResolveAction {
        return cast(JSON.parse(json), r("IframeResolveAction"));
    }

    public static iframeResolveActionToJson(value: IframeResolveAction): string {
        return JSON.stringify(uncast(value, r("IframeResolveAction")), null, 2);
    }

    public static toIntentEvent(json: string): IntentEvent {
        return cast(JSON.parse(json), r("IntentEvent"));
    }

    public static intentEventToJson(value: IntentEvent): string {
        return JSON.stringify(uncast(value, r("IntentEvent")), null, 2);
    }

    public static toIntentListenerUnsubscribeRequest(json: string): IntentListenerUnsubscribeRequest {
        return cast(JSON.parse(json), r("IntentListenerUnsubscribeRequest"));
    }

    public static intentListenerUnsubscribeRequestToJson(value: IntentListenerUnsubscribeRequest): string {
        return JSON.stringify(uncast(value, r("IntentListenerUnsubscribeRequest")), null, 2);
    }

    public static toIntentListenerUnsubscribeResponse(json: string): IntentListenerUnsubscribeResponse {
        return cast(JSON.parse(json), r("IntentListenerUnsubscribeResponse"));
    }

    public static intentListenerUnsubscribeResponseToJson(value: IntentListenerUnsubscribeResponse): string {
        return JSON.stringify(uncast(value, r("IntentListenerUnsubscribeResponse")), null, 2);
    }

    public static toJoinUserChannelRequest(json: string): JoinUserChannelRequest {
        return cast(JSON.parse(json), r("JoinUserChannelRequest"));
    }

    public static joinUserChannelRequestToJson(value: JoinUserChannelRequest): string {
        return JSON.stringify(uncast(value, r("JoinUserChannelRequest")), null, 2);
    }

    public static toJoinUserChannelResponse(json: string): JoinUserChannelResponse {
        return cast(JSON.parse(json), r("JoinUserChannelResponse"));
    }

    public static joinUserChannelResponseToJson(value: JoinUserChannelResponse): string {
        return JSON.stringify(uncast(value, r("JoinUserChannelResponse")), null, 2);
    }

    public static toLeaveCurrentChannelRequest(json: string): LeaveCurrentChannelRequest {
        return cast(JSON.parse(json), r("LeaveCurrentChannelRequest"));
    }

    public static leaveCurrentChannelRequestToJson(value: LeaveCurrentChannelRequest): string {
        return JSON.stringify(uncast(value, r("LeaveCurrentChannelRequest")), null, 2);
    }

    public static toLeaveCurrentChannelResponse(json: string): LeaveCurrentChannelResponse {
        return cast(JSON.parse(json), r("LeaveCurrentChannelResponse"));
    }

    public static leaveCurrentChannelResponseToJson(value: LeaveCurrentChannelResponse): string {
        return JSON.stringify(uncast(value, r("LeaveCurrentChannelResponse")), null, 2);
    }

    public static toOpenRequest(json: string): OpenRequest {
        return cast(JSON.parse(json), r("OpenRequest"));
    }

    public static openRequestToJson(value: OpenRequest): string {
        return JSON.stringify(uncast(value, r("OpenRequest")), null, 2);
    }

    public static toOpenResponse(json: string): OpenResponse {
        return cast(JSON.parse(json), r("OpenResponse"));
    }

    public static openResponseToJson(value: OpenResponse): string {
        return JSON.stringify(uncast(value, r("OpenResponse")), null, 2);
    }

    public static toPrivateChannelAddEventListenerRequest(json: string): PrivateChannelAddEventListenerRequest {
        return cast(JSON.parse(json), r("PrivateChannelAddEventListenerRequest"));
    }

    public static privateChannelAddEventListenerRequestToJson(value: PrivateChannelAddEventListenerRequest): string {
        return JSON.stringify(uncast(value, r("PrivateChannelAddEventListenerRequest")), null, 2);
    }

    public static toPrivateChannelAddEventListenerResponse(json: string): PrivateChannelAddEventListenerResponse {
        return cast(JSON.parse(json), r("PrivateChannelAddEventListenerResponse"));
    }

    public static privateChannelAddEventListenerResponseToJson(value: PrivateChannelAddEventListenerResponse): string {
        return JSON.stringify(uncast(value, r("PrivateChannelAddEventListenerResponse")), null, 2);
    }

    public static toPrivateChannelDisconnectRequest(json: string): PrivateChannelDisconnectRequest {
        return cast(JSON.parse(json), r("PrivateChannelDisconnectRequest"));
    }

    public static privateChannelDisconnectRequestToJson(value: PrivateChannelDisconnectRequest): string {
        return JSON.stringify(uncast(value, r("PrivateChannelDisconnectRequest")), null, 2);
    }

    public static toPrivateChannelDisconnectResponse(json: string): PrivateChannelDisconnectResponse {
        return cast(JSON.parse(json), r("PrivateChannelDisconnectResponse"));
    }

    public static privateChannelDisconnectResponseToJson(value: PrivateChannelDisconnectResponse): string {
        return JSON.stringify(uncast(value, r("PrivateChannelDisconnectResponse")), null, 2);
    }

    public static toPrivateChannelOnAddContextListenerEvent(json: string): PrivateChannelOnAddContextListenerEvent {
        return cast(JSON.parse(json), r("PrivateChannelOnAddContextListenerEvent"));
    }

    public static privateChannelOnAddContextListenerEventToJson(value: PrivateChannelOnAddContextListenerEvent): string {
        return JSON.stringify(uncast(value, r("PrivateChannelOnAddContextListenerEvent")), null, 2);
    }

    public static toPrivateChannelOnDisconnectEvent(json: string): PrivateChannelOnDisconnectEvent {
        return cast(JSON.parse(json), r("PrivateChannelOnDisconnectEvent"));
    }

    public static privateChannelOnDisconnectEventToJson(value: PrivateChannelOnDisconnectEvent): string {
        return JSON.stringify(uncast(value, r("PrivateChannelOnDisconnectEvent")), null, 2);
    }

    public static toPrivateChannelOnUnsubscribeEventEvent(json: string): PrivateChannelOnUnsubscribeEventEvent {
        return cast(JSON.parse(json), r("PrivateChannelOnUnsubscribeEventEvent"));
    }

    public static privateChannelOnUnsubscribeEventEventToJson(value: PrivateChannelOnUnsubscribeEventEvent): string {
        return JSON.stringify(uncast(value, r("PrivateChannelOnUnsubscribeEventEvent")), null, 2);
    }

    public static toPrivateChannelUnsubscribeEventListenerRequest(json: string): PrivateChannelUnsubscribeEventListenerRequest {
        return cast(JSON.parse(json), r("PrivateChannelUnsubscribeEventListenerRequest"));
    }

    public static privateChannelUnsubscribeEventListenerRequestToJson(value: PrivateChannelUnsubscribeEventListenerRequest): string {
        return JSON.stringify(uncast(value, r("PrivateChannelUnsubscribeEventListenerRequest")), null, 2);
    }

    public static toPrivateChannelUnsubscribeEventListenerResponse(json: string): PrivateChannelUnsubscribeEventListenerResponse {
        return cast(JSON.parse(json), r("PrivateChannelUnsubscribeEventListenerResponse"));
    }

    public static privateChannelUnsubscribeEventListenerResponseToJson(value: PrivateChannelUnsubscribeEventListenerResponse): string {
        return JSON.stringify(uncast(value, r("PrivateChannelUnsubscribeEventListenerResponse")), null, 2);
    }

    public static toRaiseIntentForContextRequest(json: string): RaiseIntentForContextRequest {
        return cast(JSON.parse(json), r("RaiseIntentForContextRequest"));
    }

    public static raiseIntentForContextRequestToJson(value: RaiseIntentForContextRequest): string {
        return JSON.stringify(uncast(value, r("RaiseIntentForContextRequest")), null, 2);
    }

    public static toRaiseIntentForContextResponse(json: string): RaiseIntentForContextResponse {
        return cast(JSON.parse(json), r("RaiseIntentForContextResponse"));
    }

    public static raiseIntentForContextResponseToJson(value: RaiseIntentForContextResponse): string {
        return JSON.stringify(uncast(value, r("RaiseIntentForContextResponse")), null, 2);
    }

    public static toRaiseIntentRequest(json: string): RaiseIntentRequest {
        return cast(JSON.parse(json), r("RaiseIntentRequest"));
    }

    public static raiseIntentRequestToJson(value: RaiseIntentRequest): string {
        return JSON.stringify(uncast(value, r("RaiseIntentRequest")), null, 2);
    }

    public static toRaiseIntentResponse(json: string): RaiseIntentResponse {
        return cast(JSON.parse(json), r("RaiseIntentResponse"));
    }

    public static raiseIntentResponseToJson(value: RaiseIntentResponse): string {
        return JSON.stringify(uncast(value, r("RaiseIntentResponse")), null, 2);
    }

    public static toRaiseIntentResultResponse(json: string): RaiseIntentResultResponse {
        return cast(JSON.parse(json), r("RaiseIntentResultResponse"));
    }

    public static raiseIntentResultResponseToJson(value: RaiseIntentResultResponse): string {
        return JSON.stringify(uncast(value, r("RaiseIntentResultResponse")), null, 2);
    }

    public static toWebConnectionProtocol1Hello(json: string): WebConnectionProtocol1Hello {
        return cast(JSON.parse(json), r("WebConnectionProtocol1Hello"));
    }

    public static webConnectionProtocol1HelloToJson(value: WebConnectionProtocol1Hello): string {
        return JSON.stringify(uncast(value, r("WebConnectionProtocol1Hello")), null, 2);
    }

    public static toWebConnectionProtocol2LoadURL(json: string): WebConnectionProtocol2LoadURL {
        return cast(JSON.parse(json), r("WebConnectionProtocol2LoadURL"));
    }

    public static webConnectionProtocol2LoadURLToJson(value: WebConnectionProtocol2LoadURL): string {
        return JSON.stringify(uncast(value, r("WebConnectionProtocol2LoadURL")), null, 2);
    }

    public static toWebConnectionProtocol3Handshake(json: string): WebConnectionProtocol3Handshake {
        return cast(JSON.parse(json), r("WebConnectionProtocol3Handshake"));
    }

    public static webConnectionProtocol3HandshakeToJson(value: WebConnectionProtocol3Handshake): string {
        return JSON.stringify(uncast(value, r("WebConnectionProtocol3Handshake")), null, 2);
    }

    public static toWebConnectionProtocol4ValidateAppIdentity(json: string): WebConnectionProtocol4ValidateAppIdentity {
        return cast(JSON.parse(json), r("WebConnectionProtocol4ValidateAppIdentity"));
    }

    public static webConnectionProtocol4ValidateAppIdentityToJson(value: WebConnectionProtocol4ValidateAppIdentity): string {
        return JSON.stringify(uncast(value, r("WebConnectionProtocol4ValidateAppIdentity")), null, 2);
    }

    public static toWebConnectionProtocol5ValidateAppIdentityFailedResponse(json: string): WebConnectionProtocol5ValidateAppIdentityFailedResponse {
        return cast(JSON.parse(json), r("WebConnectionProtocol5ValidateAppIdentityFailedResponse"));
    }

    public static webConnectionProtocol5ValidateAppIdentityFailedResponseToJson(value: WebConnectionProtocol5ValidateAppIdentityFailedResponse): string {
        return JSON.stringify(uncast(value, r("WebConnectionProtocol5ValidateAppIdentityFailedResponse")), null, 2);
    }

    public static toWebConnectionProtocol5ValidateAppIdentitySuccessResponse(json: string): WebConnectionProtocol5ValidateAppIdentitySuccessResponse {
        return cast(JSON.parse(json), r("WebConnectionProtocol5ValidateAppIdentitySuccessResponse"));
    }

    public static webConnectionProtocol5ValidateAppIdentitySuccessResponseToJson(value: WebConnectionProtocol5ValidateAppIdentitySuccessResponse): string {
        return JSON.stringify(uncast(value, r("WebConnectionProtocol5ValidateAppIdentitySuccessResponse")), null, 2);
    }

    public static toWebConnectionProtocolMessage(json: string): WebConnectionProtocolMessage {
        return cast(JSON.parse(json), r("WebConnectionProtocolMessage"));
    }

    public static webConnectionProtocolMessageToJson(value: WebConnectionProtocolMessage): string {
        return JSON.stringify(uncast(value, r("WebConnectionProtocolMessage")), null, 2);
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
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
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
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
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

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
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
    "AppRequestMessage": o([
        { json: "meta", js: "meta", typ: r("AppRequestMessageMeta") },
        { json: "payload", js: "payload", typ: m("any") },
        { json: "type", js: "type", typ: r("RequestMessageType") },
    ], false),
    "AppRequestMessageMeta": o([
        { json: "requestUuid", js: "requestUuid", typ: "" },
        { json: "source", js: "source", typ: u(undefined, r("AppIdentifier")) },
        { json: "timestamp", js: "timestamp", typ: Date },
    ], false),
    "AppIdentifier": o([
        { json: "appId", js: "appId", typ: "" },
        { json: "desktopAgent", js: "desktopAgent", typ: u(undefined, "") },
        { json: "instanceId", js: "instanceId", typ: u(undefined, "") },
    ], "any"),
    "AgentResponseMessage": o([
        { json: "meta", js: "meta", typ: r("AgentResponseMessageMeta") },
        { json: "payload", js: "payload", typ: r("AgentResponseMessageResponsePayload") },
        { json: "type", js: "type", typ: r("ResponseMessageType") },
    ], false),
    "AgentResponseMessageMeta": o([
        { json: "requestUuid", js: "requestUuid", typ: "" },
        { json: "responseUuid", js: "responseUuid", typ: "" },
        { json: "source", js: "source", typ: u(undefined, r("AppIdentifier")) },
        { json: "timestamp", js: "timestamp", typ: Date },
    ], false),
    "AgentResponseMessageResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("ResponsePayloadError")) },
    ], "any"),
    "AgentEventMessage": o([
        { json: "meta", js: "meta", typ: r("AgentEventMessageMeta") },
        { json: "payload", js: "payload", typ: m("any") },
        { json: "type", js: "type", typ: r("EventMessageType") },
    ], false),
    "AgentEventMessageMeta": o([
        { json: "eventUuid", js: "eventUuid", typ: "" },
        { json: "timestamp", js: "timestamp", typ: Date },
    ], false),
    "AddContextListenerRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("AddContextListenerRequestPayload") },
        { json: "type", js: "type", typ: r("AddContextListenerRequestType") },
    ], false),
    "AddContextListenerRequestMeta": o([
        { json: "requestUuid", js: "requestUuid", typ: "" },
        { json: "source", js: "source", typ: u(undefined, r("AppIdentifier")) },
        { json: "timestamp", js: "timestamp", typ: Date },
    ], false),
    "AddContextListenerRequestPayload": o([
        { json: "channelId", js: "channelId", typ: u(null, "") },
        { json: "contextType", js: "contextType", typ: u(null, "") },
    ], false),
    "AddContextListenerResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("AddContextListenerResponsePayload") },
        { json: "type", js: "type", typ: r("AddContextListenerResponseType") },
    ], false),
    "AddContextListenerResponseMeta": o([
        { json: "requestUuid", js: "requestUuid", typ: "" },
        { json: "responseUuid", js: "responseUuid", typ: "" },
        { json: "source", js: "source", typ: u(undefined, r("AppIdentifier")) },
        { json: "timestamp", js: "timestamp", typ: Date },
    ], false),
    "AddContextListenerResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("PurpleError")) },
        { json: "listenerUUID", js: "listenerUUID", typ: u(undefined, "") },
    ], false),
    "AddIntentListenerRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("AddIntentListenerRequestPayload") },
        { json: "type", js: "type", typ: r("AddIntentListenerRequestType") },
    ], false),
    "AddIntentListenerRequestPayload": o([
        { json: "intent", js: "intent", typ: "" },
    ], false),
    "AddIntentListenerResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("AddIntentListenerResponsePayload") },
        { json: "type", js: "type", typ: r("AddIntentListenerResponseType") },
    ], false),
    "AddIntentListenerResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("FluffyError")) },
        { json: "listenerUUID", js: "listenerUUID", typ: u(undefined, "") },
    ], "any"),
    "BroadcastEvent": o([
        { json: "meta", js: "meta", typ: r("BroadcastEventMeta") },
        { json: "payload", js: "payload", typ: r("BroadcastEventPayload") },
        { json: "type", js: "type", typ: r("BroadcastEventType") },
    ], false),
    "BroadcastEventMeta": o([
        { json: "eventUuid", js: "eventUuid", typ: "" },
        { json: "timestamp", js: "timestamp", typ: Date },
    ], false),
    "BroadcastEventPayload": o([
        { json: "channelId", js: "channelId", typ: "" },
        { json: "context", js: "context", typ: r("Context") },
    ], false),
    "Context": o([
        { json: "id", js: "id", typ: u(undefined, m("any")) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "type", js: "type", typ: "" },
    ], "any"),
    "BroadcastRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("BroadcastRequestPayload") },
        { json: "type", js: "type", typ: r("BroadcastRequestType") },
    ], false),
    "BroadcastRequestPayload": o([
        { json: "channelId", js: "channelId", typ: "" },
        { json: "context", js: "context", typ: r("Context") },
    ], false),
    "BroadcastResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("BroadcastResponseResponsePayload") },
        { json: "type", js: "type", typ: r("BroadcastResponseType") },
    ], false),
    "BroadcastResponseResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("ResponsePayloadError")) },
    ], "any"),
    "ChannelChangedEvent": o([
        { json: "meta", js: "meta", typ: r("BroadcastEventMeta") },
        { json: "payload", js: "payload", typ: r("ChannelChangedEventPayload") },
        { json: "type", js: "type", typ: r("ChannelChangedEventType") },
    ], false),
    "ChannelChangedEventPayload": o([
        { json: "newChannelId", js: "newChannelId", typ: u(null, "") },
    ], false),
    "ContextListenerUnsubscribeRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("ContextListenerUnsubscribeRequestPayload") },
        { json: "type", js: "type", typ: r("ContextListenerUnsubscribeRequestType") },
    ], false),
    "ContextListenerUnsubscribeRequestPayload": o([
        { json: "listenerUUID", js: "listenerUUID", typ: "" },
    ], false),
    "ContextListenerUnsubscribeResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("BroadcastResponseResponsePayload") },
        { json: "type", js: "type", typ: r("ContextListenerUnsubscribeResponseType") },
    ], false),
    "CreatePrivateChannelRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("CreatePrivateChannelRequestPayload") },
        { json: "type", js: "type", typ: r("CreatePrivateChannelRequestType") },
    ], false),
    "CreatePrivateChannelRequestPayload": o([
    ], false),
    "CreatePrivateChannelResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("CreatePrivateChannelResponsePayload") },
        { json: "type", js: "type", typ: r("CreatePrivateChannelResponseType") },
    ], false),
    "CreatePrivateChannelResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("PurpleError")) },
        { json: "privateChannel", js: "privateChannel", typ: u(undefined, r("Channel")) },
    ], false),
    "Channel": o([
        { json: "displayMetadata", js: "displayMetadata", typ: u(undefined, r("DisplayMetadata")) },
        { json: "id", js: "id", typ: "" },
        { json: "type", js: "type", typ: r("Type") },
    ], false),
    "DisplayMetadata": o([
        { json: "color", js: "color", typ: u(undefined, "") },
        { json: "glyph", js: "glyph", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], false),
    "FindInstancesRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("FindInstancesRequestPayload") },
        { json: "type", js: "type", typ: r("FindInstancesRequestType") },
    ], false),
    "FindInstancesRequestPayload": o([
        { json: "app", js: "app", typ: r("AppIdentifier") },
    ], false),
    "FindInstancesResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("FindInstancesResponsePayload") },
        { json: "type", js: "type", typ: r("FindInstancesResponseType") },
    ], false),
    "FindInstancesResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("FindInstancesErrors")) },
        { json: "appIdentifiers", js: "appIdentifiers", typ: u(undefined, a(r("AppMetadata"))) },
    ], false),
    "AppMetadata": o([
        { json: "appId", js: "appId", typ: "" },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "desktopAgent", js: "desktopAgent", typ: u(undefined, "") },
        { json: "icons", js: "icons", typ: u(undefined, a(r("Icon"))) },
        { json: "instanceId", js: "instanceId", typ: u(undefined, "") },
        { json: "instanceMetadata", js: "instanceMetadata", typ: u(undefined, m("any")) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "resultType", js: "resultType", typ: u(undefined, u(null, "")) },
        { json: "screenshots", js: "screenshots", typ: u(undefined, a(r("Image"))) },
        { json: "title", js: "title", typ: u(undefined, "") },
        { json: "tooltip", js: "tooltip", typ: u(undefined, "") },
        { json: "version", js: "version", typ: u(undefined, "") },
    ], false),
    "Icon": o([
        { json: "size", js: "size", typ: u(undefined, "") },
        { json: "src", js: "src", typ: "" },
        { json: "type", js: "type", typ: u(undefined, "") },
    ], false),
    "Image": o([
        { json: "label", js: "label", typ: u(undefined, "") },
        { json: "size", js: "size", typ: u(undefined, "") },
        { json: "src", js: "src", typ: "" },
        { json: "type", js: "type", typ: u(undefined, "") },
    ], false),
    "FindIntentRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("FindIntentRequestPayload") },
        { json: "type", js: "type", typ: r("FindIntentRequestType") },
    ], false),
    "FindIntentRequestPayload": o([
        { json: "context", js: "context", typ: u(undefined, r("Context")) },
        { json: "intent", js: "intent", typ: "" },
        { json: "resultType", js: "resultType", typ: u(undefined, "") },
    ], false),
    "FindIntentResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("FindIntentResponsePayload") },
        { json: "type", js: "type", typ: r("FindIntentResponseType") },
    ], false),
    "FindIntentResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("FindInstancesErrors")) },
        { json: "appIntent", js: "appIntent", typ: u(undefined, r("AppIntent")) },
    ], false),
    "AppIntent": o([
        { json: "apps", js: "apps", typ: a(r("AppMetadata")) },
        { json: "intent", js: "intent", typ: r("IntentMetadata") },
    ], false),
    "IntentMetadata": o([
        { json: "displayName", js: "displayName", typ: "" },
        { json: "name", js: "name", typ: "" },
    ], false),
    "FindIntentsByContextRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("FindIntentsByContextRequestPayload") },
        { json: "type", js: "type", typ: r("FindIntentsByContextRequestType") },
    ], false),
    "FindIntentsByContextRequestPayload": o([
        { json: "context", js: "context", typ: r("Context") },
        { json: "resultType", js: "resultType", typ: u(undefined, "") },
    ], false),
    "FindIntentsByContextsByContextResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("FindIntentsByContextsByContextResponsePayload") },
        { json: "type", js: "type", typ: r("FindIntentsByContextsByContextResponseType") },
    ], false),
    "FindIntentsByContextsByContextResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("FindInstancesErrors")) },
        { json: "appIntents", js: "appIntents", typ: u(undefined, a(r("AppIntent"))) },
    ], false),
    "GetAppMetadataRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("GetAppMetadataRequestPayload") },
        { json: "type", js: "type", typ: r("GetAppMetadataRequestType") },
    ], false),
    "GetAppMetadataRequestPayload": o([
        { json: "app", js: "app", typ: r("AppIdentifier") },
    ], false),
    "GetAppMetadataResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("GetAppMetadataResponsePayload") },
        { json: "type", js: "type", typ: r("GetAppMetadataResponseType") },
    ], false),
    "GetAppMetadataResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("FindInstancesErrors")) },
        { json: "appMetadata", js: "appMetadata", typ: u(undefined, r("AppMetadata")) },
    ], false),
    "GetCurrentChannelRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("GetCurrentChannelRequestPayload") },
        { json: "type", js: "type", typ: r("GetCurrentChannelRequestType") },
    ], false),
    "GetCurrentChannelRequestPayload": o([
    ], false),
    "GetCurrentChannelResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("GetCurrentChannelResponsePayload") },
        { json: "type", js: "type", typ: r("GetCurrentChannelResponseType") },
    ], false),
    "GetCurrentChannelResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("ResponsePayloadError")) },
        { json: "channel", js: "channel", typ: u(undefined, u(r("Channel"), null)) },
    ], false),
    "GetCurrentContextRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("GetCurrentContextRequestPayload") },
        { json: "type", js: "type", typ: r("GetCurrentContextRequestType") },
    ], false),
    "GetCurrentContextRequestPayload": o([
        { json: "channelId", js: "channelId", typ: "" },
        { json: "contextType", js: "contextType", typ: u(null, "") },
    ], false),
    "GetCurrentContextResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("GetCurrentContextResponsePayload") },
        { json: "type", js: "type", typ: r("GetCurrentContextResponseType") },
    ], false),
    "GetCurrentContextResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("PurpleError")) },
        { json: "context", js: "context", typ: u(undefined, u(null, r("Context"))) },
    ], false),
    "GetInfoRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("GetInfoRequestPayload") },
        { json: "type", js: "type", typ: r("GetInfoRequestType") },
    ], false),
    "GetInfoRequestPayload": o([
    ], false),
    "GetInfoResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("GetInfoResponsePayload") },
        { json: "type", js: "type", typ: r("GetInfoResponseType") },
    ], false),
    "GetInfoResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("ResponsePayloadError")) },
        { json: "implementationMetadata", js: "implementationMetadata", typ: u(undefined, r("ImplementationMetadata")) },
    ], false),
    "ImplementationMetadata": o([
        { json: "appMetadata", js: "appMetadata", typ: r("AppMetadata") },
        { json: "fdc3Version", js: "fdc3Version", typ: "" },
        { json: "optionalFeatures", js: "optionalFeatures", typ: r("OptionalFeatures") },
        { json: "provider", js: "provider", typ: "" },
        { json: "providerVersion", js: "providerVersion", typ: u(undefined, "") },
    ], false),
    "OptionalFeatures": o([
        { json: "DesktopAgentBridging", js: "DesktopAgentBridging", typ: true },
        { json: "OriginatingAppMetadata", js: "OriginatingAppMetadata", typ: true },
        { json: "UserChannelMembershipAPIs", js: "UserChannelMembershipAPIs", typ: true },
    ], false),
    "GetOrCreateChannelRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("GetOrCreateChannelRequestPayload") },
        { json: "type", js: "type", typ: r("GetOrCreateChannelRequestType") },
    ], false),
    "GetOrCreateChannelRequestPayload": o([
        { json: "channelId", js: "channelId", typ: "" },
    ], false),
    "GetOrCreateChannelResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("GetOrCreateChannelResponsePayload") },
        { json: "type", js: "type", typ: r("GetOrCreateChannelResponseType") },
    ], false),
    "GetOrCreateChannelResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("PurpleError")) },
        { json: "channel", js: "channel", typ: u(undefined, r("Channel")) },
    ], false),
    "GetUserChannelsRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("GetUserChannelsRequestPayload") },
        { json: "type", js: "type", typ: r("GetUserChannelsRequestType") },
    ], false),
    "GetUserChannelsRequestPayload": o([
    ], false),
    "GetUserChannelsResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("GetUserChannelsResponsePayload") },
        { json: "type", js: "type", typ: r("GetUserChannelsResponseType") },
    ], false),
    "GetUserChannelsResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("PurpleError")) },
        { json: "userChannels", js: "userChannels", typ: u(undefined, a(r("Channel"))) },
    ], false),
    "IframeChannelDrag": o([
        { json: "payload", js: "payload", typ: r("IframeChannelDragPayload") },
        { json: "type", js: "type", typ: r("IframeChannelDragType") },
    ], false),
    "IframeChannelDragPayload": o([
        { json: "mouse", js: "mouse", typ: r("MouseClass") },
    ], false),
    "MouseClass": o([
        { json: "offsetX", js: "offsetX", typ: 0 },
        { json: "offsetY", js: "offsetY", typ: 0 },
    ], false),
    "IframeChannelResize": o([
        { json: "payload", js: "payload", typ: r("IframeChannelResizePayload") },
        { json: "type", js: "type", typ: r("IframeChannelResizeType") },
    ], false),
    "IframeChannelResizePayload": o([
        { json: "dimensions", js: "dimensions", typ: r("DimensionsClass") },
        { json: "resizeAnchor", js: "resizeAnchor", typ: r("Resizing") },
    ], false),
    "DimensionsClass": o([
        { json: "height", js: "height", typ: 0 },
        { json: "width", js: "width", typ: 0 },
    ], false),
    "IframeChannels": o([
        { json: "payload", js: "payload", typ: r("IframeChannelsPayload") },
        { json: "type", js: "type", typ: r("IframeChannelsType") },
    ], false),
    "IframeChannelsPayload": o([
        { json: "location", js: "location", typ: u(undefined, r("Location")) },
        { json: "selected", js: "selected", typ: u(null, "") },
        { json: "userChannels", js: "userChannels", typ: a(r("Channel")) },
    ], false),
    "Location": o([
        { json: "x", js: "x", typ: 0 },
        { json: "y", js: "y", typ: 0 },
    ], false),
    "IframeChannelSelected": o([
        { json: "payload", js: "payload", typ: r("IframeChannelSelectedPayload") },
        { json: "type", js: "type", typ: r("IframeChannelSelectedType") },
    ], false),
    "IframeChannelSelectedPayload": o([
        { json: "selected", js: "selected", typ: u(null, "") },
    ], false),
    "IframeHandshake": o([
        { json: "payload", js: "payload", typ: r("IframeHandshakePayload") },
        { json: "type", js: "type", typ: r("IframeHandshakeType") },
    ], false),
    "IframeHandshakePayload": o([
        { json: "implementationDetails", js: "implementationDetails", typ: "" },
    ], false),
    "IframeHello": o([
        { json: "payload", js: "payload", typ: r("IframeHelloPayload") },
        { json: "type", js: "type", typ: r("IframeHelloType") },
    ], false),
    "IframeHelloPayload": o([
        { json: "fdc3Version", js: "fdc3Version", typ: "" },
    ], false),
    "IframeMessage": o([
        { json: "payload", js: "payload", typ: u(undefined, m("any")) },
        { json: "type", js: "type", typ: r("IframeMessageType") },
    ], false),
    "IframeResolve": o([
        { json: "payload", js: "payload", typ: r("IframeResolvePayload") },
        { json: "type", js: "type", typ: r("IframeResolveType") },
    ], false),
    "IframeResolvePayload": o([
        { json: "appIntents", js: "appIntents", typ: a(r("AppIntent")) },
        { json: "context", js: "context", typ: r("Context") },
    ], false),
    "IframeResolveAction": o([
        { json: "payload", js: "payload", typ: r("IframeResolveActionPayload") },
        { json: "type", js: "type", typ: r("IframeResolveActionType") },
    ], false),
    "IframeResolveActionPayload": o([
        { json: "action", js: "action", typ: r("Action") },
        { json: "appIdentifier", js: "appIdentifier", typ: u(undefined, r("AppIdentifier")) },
        { json: "intent", js: "intent", typ: u(undefined, "") },
    ], false),
    "IntentEvent": o([
        { json: "meta", js: "meta", typ: r("BroadcastEventMeta") },
        { json: "payload", js: "payload", typ: r("IntentEventPayload") },
        { json: "type", js: "type", typ: r("IntentEventType") },
    ], false),
    "IntentEventPayload": o([
        { json: "context", js: "context", typ: r("Context") },
        { json: "intent", js: "intent", typ: "" },
        { json: "originatingApp", js: "originatingApp", typ: u(undefined, r("AppIdentifier")) },
    ], false),
    "IntentListenerUnsubscribeRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("IntentListenerUnsubscribeRequestPayload") },
        { json: "type", js: "type", typ: r("IntentListenerUnsubscribeRequestType") },
    ], false),
    "IntentListenerUnsubscribeRequestPayload": o([
        { json: "listenerUUID", js: "listenerUUID", typ: "" },
    ], false),
    "IntentListenerUnsubscribeResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("BroadcastResponseResponsePayload") },
        { json: "type", js: "type", typ: r("IntentListenerUnsubscribeResponseType") },
    ], false),
    "JoinUserChannelRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("JoinUserChannelRequestPayload") },
        { json: "type", js: "type", typ: r("JoinUserChannelRequestType") },
    ], false),
    "JoinUserChannelRequestPayload": o([
        { json: "channelId", js: "channelId", typ: "" },
    ], false),
    "JoinUserChannelResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("JoinUserChannelResponsePayload") },
        { json: "type", js: "type", typ: r("JoinUserChannelResponseType") },
    ], false),
    "JoinUserChannelResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("PurpleError")) },
    ], false),
    "LeaveCurrentChannelRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("LeaveCurrentChannelRequestPayload") },
        { json: "type", js: "type", typ: r("LeaveCurrentChannelRequestType") },
    ], false),
    "LeaveCurrentChannelRequestPayload": o([
    ], false),
    "LeaveCurrentChannelResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("LeaveCurrentChannelResponsePayload") },
        { json: "type", js: "type", typ: r("LeaveCurrentChannelResponseType") },
    ], false),
    "LeaveCurrentChannelResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("PurpleError")) },
    ], false),
    "OpenRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("OpenRequestPayload") },
        { json: "type", js: "type", typ: r("OpenRequestType") },
    ], false),
    "OpenRequestPayload": o([
        { json: "app", js: "app", typ: r("AppIdentifier") },
    ], false),
    "OpenResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("OpenResponsePayload") },
        { json: "type", js: "type", typ: r("OpenResponseType") },
    ], false),
    "OpenResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("OpenErrorResponsePayload")) },
        { json: "appIdentifier", js: "appIdentifier", typ: u(undefined, r("AppIdentifier")) },
    ], false),
    "PrivateChannelAddEventListenerRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("TPayload") },
        { json: "type", js: "type", typ: r("PrivateChannelAddEventListenerRequestType") },
    ], false),
    "TPayload": o([
        { json: "contextType", js: "contextType", typ: u(null, "") },
        { json: "privateChannelId", js: "privateChannelId", typ: "" },
    ], false),
    "PrivateChannelAddEventListenerResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("PrivateChannelAddEventListenerResponsePayload") },
        { json: "type", js: "type", typ: r("PrivateChannelAddEventListenerResponseType") },
    ], false),
    "PrivateChannelAddEventListenerResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("PurpleError")) },
        { json: "listenerUUID", js: "listenerUUID", typ: u(undefined, "") },
    ], "any"),
    "PrivateChannelDisconnectRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("PrivateChannelDisconnectRequestPayload") },
        { json: "type", js: "type", typ: r("PrivateChannelDisconnectRequestType") },
    ], false),
    "PrivateChannelDisconnectRequestPayload": o([
        { json: "channelId", js: "channelId", typ: "" },
    ], false),
    "PrivateChannelDisconnectResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("PrivateChannelDisconnectResponsePayload") },
        { json: "type", js: "type", typ: r("PrivateChannelDisconnectResponseType") },
    ], false),
    "PrivateChannelDisconnectResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("PurpleError")) },
    ], false),
    "PrivateChannelOnAddContextListenerEvent": o([
        { json: "meta", js: "meta", typ: r("BroadcastEventMeta") },
        { json: "payload", js: "payload", typ: r("PrivateChannelOnAddContextListenerEventPayload") },
        { json: "type", js: "type", typ: r("PrivateChannelOnAddContextListenerEventType") },
    ], false),
    "PrivateChannelOnAddContextListenerEventPayload": o([
        { json: "contextType", js: "contextType", typ: u(null, "") },
        { json: "privateChannelId", js: "privateChannelId", typ: "" },
    ], false),
    "PrivateChannelOnDisconnectEvent": o([
        { json: "meta", js: "meta", typ: r("BroadcastEventMeta") },
        { json: "payload", js: "payload", typ: r("PrivateChannelOnDisconnectEventPayload") },
        { json: "type", js: "type", typ: r("PrivateChannelOnDisconnectEventType") },
    ], false),
    "PrivateChannelOnDisconnectEventPayload": o([
        { json: "privateChannelId", js: "privateChannelId", typ: "" },
    ], false),
    "PrivateChannelOnUnsubscribeEventEvent": o([
        { json: "meta", js: "meta", typ: r("BroadcastEventMeta") },
        { json: "payload", js: "payload", typ: r("PrivateChannelOnUnsubscribeEventEventPayload") },
        { json: "type", js: "type", typ: r("PrivateChannelOnUnsubscribeEventEventType") },
    ], false),
    "PrivateChannelOnUnsubscribeEventEventPayload": o([
        { json: "contextType", js: "contextType", typ: u(null, "") },
        { json: "privateChannelId", js: "privateChannelId", typ: "" },
    ], false),
    "PrivateChannelUnsubscribeEventListenerRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("PrivateChannelUnsubscribeEventListenerRequestPayload") },
        { json: "type", js: "type", typ: r("PrivateChannelUnsubscribeEventListenerRequestType") },
    ], false),
    "PrivateChannelUnsubscribeEventListenerRequestPayload": o([
        { json: "listenerUUID", js: "listenerUUID", typ: "" },
    ], false),
    "PrivateChannelUnsubscribeEventListenerResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("BroadcastResponseResponsePayload") },
        { json: "type", js: "type", typ: r("PrivateChannelUnsubscribeEventListenerResponseType") },
    ], false),
    "RaiseIntentForContextRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("RaiseIntentForContextRequestPayload") },
        { json: "type", js: "type", typ: r("RaiseIntentForContextRequestType") },
    ], false),
    "RaiseIntentForContextRequestPayload": o([
        { json: "app", js: "app", typ: u(undefined, r("AppIdentifier")) },
        { json: "context", js: "context", typ: r("Context") },
    ], false),
    "RaiseIntentForContextResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("RaiseIntentForContextResponsePayload") },
        { json: "type", js: "type", typ: r("RaiseIntentForContextResponseType") },
    ], false),
    "RaiseIntentForContextResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("FindInstancesErrors")) },
        { json: "intentResolution", js: "intentResolution", typ: u(undefined, r("IntentResolution")) },
        { json: "appIntents", js: "appIntents", typ: u(undefined, a(r("AppIntent"))) },
    ], false),
    "IntentResolution": o([
        { json: "intent", js: "intent", typ: "" },
        { json: "source", js: "source", typ: r("AppIdentifier") },
    ], false),
    "RaiseIntentRequest": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerRequestMeta") },
        { json: "payload", js: "payload", typ: r("RaiseIntentRequestPayload") },
        { json: "type", js: "type", typ: r("RaiseIntentRequestType") },
    ], false),
    "RaiseIntentRequestPayload": o([
        { json: "app", js: "app", typ: u(undefined, r("AppIdentifier")) },
        { json: "context", js: "context", typ: r("Context") },
        { json: "intent", js: "intent", typ: "" },
    ], false),
    "RaiseIntentResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("RaiseIntentResponsePayload") },
        { json: "type", js: "type", typ: r("RaiseIntentResponseType") },
    ], false),
    "RaiseIntentResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("FindInstancesErrors")) },
        { json: "intentResolution", js: "intentResolution", typ: u(undefined, r("IntentResolution")) },
        { json: "appIntent", js: "appIntent", typ: u(undefined, r("AppIntent")) },
    ], false),
    "RaiseIntentResultResponse": o([
        { json: "meta", js: "meta", typ: r("AddContextListenerResponseMeta") },
        { json: "payload", js: "payload", typ: r("ResponsePayload") },
        { json: "type", js: "type", typ: r("RaiseIntentResultResponseType") },
    ], false),
    "ResponsePayload": o([
        { json: "error", js: "error", typ: u(undefined, r("ResponsePayloadError")) },
        { json: "intentResult", js: "intentResult", typ: u(undefined, r("IntentResult")) },
    ], false),
    "IntentResult": o([
        { json: "context", js: "context", typ: u(undefined, r("Context")) },
        { json: "channel", js: "channel", typ: u(undefined, r("Channel")) },
    ], false),
    "WebConnectionProtocol1Hello": o([
        { json: "meta", js: "meta", typ: r("ConnectionStepMetadata") },
        { json: "payload", js: "payload", typ: r("WebConnectionProtocol1HelloPayload") },
        { json: "type", js: "type", typ: r("WebConnectionProtocol1HelloType") },
    ], false),
    "ConnectionStepMetadata": o([
        { json: "connectionAttemptUuid", js: "connectionAttemptUuid", typ: "" },
        { json: "timestamp", js: "timestamp", typ: Date },
    ], false),
    "WebConnectionProtocol1HelloPayload": o([
        { json: "channelSelector", js: "channelSelector", typ: u(undefined, true) },
        { json: "fdc3Version", js: "fdc3Version", typ: "" },
        { json: "resolver", js: "resolver", typ: u(undefined, true) },
    ], "any"),
    "WebConnectionProtocol2LoadURL": o([
        { json: "meta", js: "meta", typ: r("ConnectionStepMetadata") },
        { json: "payload", js: "payload", typ: r("WebConnectionProtocol2LoadURLPayload") },
        { json: "type", js: "type", typ: r("WebConnectionProtocol2LoadURLType") },
    ], false),
    "WebConnectionProtocol2LoadURLPayload": o([
        { json: "iframeUrl", js: "iframeUrl", typ: "" },
    ], "any"),
    "WebConnectionProtocol3Handshake": o([
        { json: "meta", js: "meta", typ: r("ConnectionStepMetadata") },
        { json: "payload", js: "payload", typ: r("WebConnectionProtocol3HandshakePayload") },
        { json: "type", js: "type", typ: r("WebConnectionProtocol3HandshakeType") },
    ], false),
    "WebConnectionProtocol3HandshakePayload": o([
        { json: "channelSelector", js: "channelSelector", typ: u(true, "") },
        { json: "fdc3Version", js: "fdc3Version", typ: "" },
        { json: "resolver", js: "resolver", typ: u(true, "") },
    ], false),
    "WebConnectionProtocol4ValidateAppIdentity": o([
        { json: "meta", js: "meta", typ: r("ConnectionStepMetadata") },
        { json: "payload", js: "payload", typ: r("WebConnectionProtocol4ValidateAppIdentityPayload") },
        { json: "type", js: "type", typ: r("WebConnectionProtocol4ValidateAppIdentityType") },
    ], false),
    "WebConnectionProtocol4ValidateAppIdentityPayload": o([
        { json: "appDUrl", js: "appDUrl", typ: u(undefined, "") },
        { json: "appId", js: "appId", typ: "" },
        { json: "instanceId", js: "instanceId", typ: u(undefined, "") },
        { json: "instanceUuid", js: "instanceUuid", typ: u(undefined, "") },
    ], false),
    "WebConnectionProtocol5ValidateAppIdentityFailedResponse": o([
        { json: "meta", js: "meta", typ: r("ConnectionStepMetadata") },
        { json: "payload", js: "payload", typ: r("WebConnectionProtocol5ValidateAppIdentityFailedResponsePayload") },
        { json: "type", js: "type", typ: r("WebConnectionProtocol5ValidateAppIdentityFailedResponseType") },
    ], false),
    "WebConnectionProtocol5ValidateAppIdentityFailedResponsePayload": o([
        { json: "message", js: "message", typ: u(undefined, "") },
    ], false),
    "WebConnectionProtocol5ValidateAppIdentitySuccessResponse": o([
        { json: "meta", js: "meta", typ: r("ConnectionStepMetadata") },
        { json: "payload", js: "payload", typ: r("WebConnectionProtocol5ValidateAppIdentitySuccessResponsePayload") },
        { json: "type", js: "type", typ: r("WebConnectionProtocol5ValidateAppIdentitySuccessResponseType") },
    ], false),
    "WebConnectionProtocol5ValidateAppIdentitySuccessResponsePayload": o([
        { json: "appId", js: "appId", typ: "" },
        { json: "implementationMetadata", js: "implementationMetadata", typ: r("ImplementationMetadata") },
        { json: "instanceId", js: "instanceId", typ: "" },
        { json: "instanceUuid", js: "instanceUuid", typ: "" },
    ], false),
    "WebConnectionProtocolMessage": o([
        { json: "meta", js: "meta", typ: r("ConnectionStepMetadata") },
        { json: "payload", js: "payload", typ: m("any") },
        { json: "type", js: "type", typ: r("ConnectionStepMessageType") },
    ], false),
    "RequestMessageType": [
        "addContextListenerRequest",
        "addIntentListenerRequest",
        "broadcastRequest",
        "contextListenerUnsubscribeRequest",
        "createPrivateChannelRequest",
        "findInstancesRequest",
        "findIntentRequest",
        "findIntentsByContextRequest",
        "getAppMetadataRequest",
        "getCurrentChannelRequest",
        "getCurrentContextRequest",
        "getInfoRequest",
        "getOrCreateChannelRequest",
        "getUserChannelsRequest",
        "intentListenerUnsubscribeRequest",
        "joinUserChannelRequest",
        "leaveCurrentChannelRequest",
        "openRequest",
        "privateChannelAddEventListenerRequest",
        "privateChannelDisconnectRequest",
        "privateChannelUnsubscribeEventListenerRequest",
        "raiseIntentForContextRequest",
        "raiseIntentRequest",
    ],
    "ResponsePayloadError": [
        "AccessDenied",
        "AgentDisconnected",
        "AppNotFound",
        "AppTimeout",
        "CreationFailed",
        "DesktopAgentNotFound",
        "ErrorOnLaunch",
        "IntentDeliveryFailed",
        "IntentHandlerRejected",
        "MalformedContext",
        "MalformedMessage",
        "NoAppsFound",
        "NoChannelFound",
        "NoResultReturned",
        "NotConnectedToBridge",
        "ResolverTimeout",
        "ResolverUnavailable",
        "ResponseToBridgeTimedOut",
        "TargetAppUnavailable",
        "TargetInstanceUnavailable",
        "UserCancelledResolution",
    ],
    "ResponseMessageType": [
        "addContextListenerResponse",
        "addIntentListenerResponse",
        "broadcastResponse",
        "contextListenerUnsubscribeResponse",
        "createPrivateChannelResponse",
        "findInstancesResponse",
        "findIntentResponse",
        "findIntentsByContextResponse",
        "getAppMetadataResponse",
        "getCurrentChannelResponse",
        "getCurrentContextResponse",
        "getInfoResponse",
        "getOrCreateChannelResponse",
        "getUserChannelsResponse",
        "intentListenerUnsubscribeResponse",
        "joinUserChannelResponse",
        "leaveCurrentChannelResponse",
        "openResponse",
        "privateChannelAddEventListenerResponse",
        "privateChannelDisconnectResponse",
        "privateChannelUnsubscribeEventListenerResponse",
        "raiseIntentForContextResponse",
        "raiseIntentResponse",
        "raiseIntentResultResponse",
    ],
    "EventMessageType": [
        "broadcastEvent",
        "channelChangedEvent",
        "intentEvent",
        "privateChannelOnAddContextListenerEvent",
        "privateChannelOnDisconnectEvent",
        "privateChannelOnUnsubscribeEvent",
    ],
    "AddContextListenerRequestType": [
        "addContextListenerRequest",
    ],
    "PurpleError": [
        "AccessDenied",
        "CreationFailed",
        "MalformedContext",
        "NoChannelFound",
    ],
    "AddContextListenerResponseType": [
        "addContextListenerResponse",
    ],
    "AddIntentListenerRequestType": [
        "addIntentListenerRequest",
    ],
    "FluffyError": [
        "DesktopAgentNotFound",
        "IntentDeliveryFailed",
        "MalformedContext",
        "NoAppsFound",
        "ResolverTimeout",
        "ResolverUnavailable",
        "TargetAppUnavailable",
        "TargetInstanceUnavailable",
        "UserCancelledResolution",
    ],
    "AddIntentListenerResponseType": [
        "addIntentListenerResponse",
    ],
    "BroadcastEventType": [
        "broadcastEvent",
    ],
    "BroadcastRequestType": [
        "broadcastRequest",
    ],
    "BroadcastResponseType": [
        "broadcastResponse",
    ],
    "ChannelChangedEventType": [
        "channelChangedEvent",
    ],
    "ContextListenerUnsubscribeRequestType": [
        "contextListenerUnsubscribeRequest",
    ],
    "ContextListenerUnsubscribeResponseType": [
        "contextListenerUnsubscribeResponse",
    ],
    "CreatePrivateChannelRequestType": [
        "createPrivateChannelRequest",
    ],
    "Type": [
        "app",
        "private",
        "user",
    ],
    "CreatePrivateChannelResponseType": [
        "createPrivateChannelResponse",
    ],
    "FindInstancesRequestType": [
        "findInstancesRequest",
    ],
    "FindInstancesErrors": [
        "AgentDisconnected",
        "DesktopAgentNotFound",
        "IntentDeliveryFailed",
        "MalformedContext",
        "MalformedMessage",
        "NoAppsFound",
        "NotConnectedToBridge",
        "ResolverTimeout",
        "ResolverUnavailable",
        "ResponseToBridgeTimedOut",
        "TargetAppUnavailable",
        "TargetInstanceUnavailable",
        "UserCancelledResolution",
    ],
    "FindInstancesResponseType": [
        "findInstancesResponse",
    ],
    "FindIntentRequestType": [
        "findIntentRequest",
    ],
    "FindIntentResponseType": [
        "findIntentResponse",
    ],
    "FindIntentsByContextRequestType": [
        "findIntentsByContextRequest",
    ],
    "FindIntentsByContextsByContextResponseType": [
        "findIntentsByContextResponse",
    ],
    "GetAppMetadataRequestType": [
        "getAppMetadataRequest",
    ],
    "GetAppMetadataResponseType": [
        "getAppMetadataResponse",
    ],
    "GetCurrentChannelRequestType": [
        "getCurrentChannelRequest",
    ],
    "GetCurrentChannelResponseType": [
        "getCurrentChannelResponse",
    ],
    "GetCurrentContextRequestType": [
        "getCurrentContextRequest",
    ],
    "GetCurrentContextResponseType": [
        "getCurrentContextResponse",
    ],
    "GetInfoRequestType": [
        "getInfoRequest",
    ],
    "GetInfoResponseType": [
        "getInfoResponse",
    ],
    "GetOrCreateChannelRequestType": [
        "getOrCreateChannelRequest",
    ],
    "GetOrCreateChannelResponseType": [
        "getOrCreateChannelResponse",
    ],
    "GetUserChannelsRequestType": [
        "getUserChannelsRequest",
    ],
    "GetUserChannelsResponseType": [
        "getUserChannelsResponse",
    ],
    "IframeChannelDragType": [
        "iframeChannelDrag",
    ],
    "Resizing": [
        "bottom",
        "bottom-left",
        "bottom-right",
        "center",
        "left",
        "right",
        "top",
        "top-left",
        "top-right",
    ],
    "IframeChannelResizeType": [
        "iframeChannelResize",
    ],
    "IframeChannelsType": [
        "iframeChannels",
    ],
    "IframeChannelSelectedType": [
        "iframeChannelSelected",
    ],
    "IframeHandshakeType": [
        "iframeHandshake",
    ],
    "IframeHelloType": [
        "iframeHello",
    ],
    "IframeMessageType": [
        "iframeChannelDrag",
        "iframeChannelResize",
        "iframeChannelSelected",
        "iframeChannels",
        "iframeHandshake",
        "iframeHello",
        "iframeResolve",
        "iframeResolveAction",
    ],
    "IframeResolveType": [
        "iframeResolve",
    ],
    "Action": [
        "cancel",
        "click",
        "hover",
    ],
    "IframeResolveActionType": [
        "iframeResolveAction",
    ],
    "IntentEventType": [
        "intentEvent",
    ],
    "IntentListenerUnsubscribeRequestType": [
        "intentListenerUnsubscribeRequest",
    ],
    "IntentListenerUnsubscribeResponseType": [
        "intentListenerUnsubscribeResponse",
    ],
    "JoinUserChannelRequestType": [
        "joinUserChannelRequest",
    ],
    "JoinUserChannelResponseType": [
        "joinUserChannelResponse",
    ],
    "LeaveCurrentChannelRequestType": [
        "leaveCurrentChannelRequest",
    ],
    "LeaveCurrentChannelResponseType": [
        "leaveCurrentChannelResponse",
    ],
    "OpenRequestType": [
        "openRequest",
    ],
    "OpenErrorResponsePayload": [
        "AgentDisconnected",
        "AppNotFound",
        "AppTimeout",
        "DesktopAgentNotFound",
        "ErrorOnLaunch",
        "MalformedContext",
        "MalformedMessage",
        "NotConnectedToBridge",
        "ResolverUnavailable",
        "ResponseToBridgeTimedOut",
    ],
    "OpenResponseType": [
        "openResponse",
    ],
    "PrivateChannelAddEventListenerRequestType": [
        "privateChannelAddEventListenerRequest",
    ],
    "PrivateChannelAddEventListenerResponseType": [
        "privateChannelAddEventListenerResponse",
    ],
    "PrivateChannelDisconnectRequestType": [
        "privateChannelDisconnectRequest",
    ],
    "PrivateChannelDisconnectResponseType": [
        "privateChannelDisconnectResponse",
    ],
    "PrivateChannelOnAddContextListenerEventType": [
        "privateChannelOnAddContextListenerEvent",
    ],
    "PrivateChannelOnDisconnectEventType": [
        "privateChannelOnDisconnectEvent",
    ],
    "PrivateChannelOnUnsubscribeEventEventType": [
        "privateChannelOnUnsubscribeEvent",
    ],
    "PrivateChannelUnsubscribeEventListenerRequestType": [
        "privateChannelUnsubscribeEventListenerRequest",
    ],
    "PrivateChannelUnsubscribeEventListenerResponseType": [
        "privateChannelUnsubscribeEventListenerResponse",
    ],
    "RaiseIntentForContextRequestType": [
        "raiseIntentForContextRequest",
    ],
    "RaiseIntentForContextResponseType": [
        "raiseIntentForContextResponse",
    ],
    "RaiseIntentRequestType": [
        "raiseIntentRequest",
    ],
    "RaiseIntentResponseType": [
        "raiseIntentResponse",
    ],
    "RaiseIntentResultResponseType": [
        "raiseIntentResultResponse",
    ],
    "WebConnectionProtocol1HelloType": [
        "WCP1Hello",
    ],
    "WebConnectionProtocol2LoadURLType": [
        "WCP2LoadUrl",
    ],
    "WebConnectionProtocol3HandshakeType": [
        "WCP3Handshake",
    ],
    "WebConnectionProtocol4ValidateAppIdentityType": [
        "WCP4ValidateAppIdentity",
    ],
    "WebConnectionProtocol5ValidateAppIdentityFailedResponseType": [
        "WCP5ValidateAppIdentityFailedResponse",
    ],
    "WebConnectionProtocol5ValidateAppIdentitySuccessResponseType": [
        "WCP5ValidateAppIdentityResponse",
    ],
    "ConnectionStepMessageType": [
        "WCP1Hello",
        "WCP2LoadUrl",
        "WCP3Handshake",
        "WCP4ValidateAppIdentity",
        "WCP5ValidateAppIdentityFailedResponse",
        "WCP5ValidateAppIdentityResponse",
    ],
};
