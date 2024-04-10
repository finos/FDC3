import * as z from "zod";

// Array of error message strings for responses that were not returned to the bridge before
// the timeout or because an error occurred. Should be the same length as the `errorSources`
// array and ordered the same. May be omitted if all sources responded without errors.
//
// Constants representing the errors that can be encountered when calling the `open` method
// on the DesktopAgent object (`fdc3`).
//
// Constants representing the errors that can be encountered when calling the `findIntent`,
// `findIntentsByContext`, `raiseIntent` or `raiseIntentForContext` methods on the
// DesktopAgent (`fdc3`).

export const ResponseErrorDetailSchema = z.enum([
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
]);
export type ResponseErrorDetail = z.infer<typeof ResponseErrorDetailSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Response' appended.

export const ResponseMessageTypeSchema = z.enum([
    "findInstancesResponse",
    "findIntentResponse",
    "findIntentsByContextResponse",
    "getAppMetadataResponse",
    "openResponse",
    "raiseIntentResponse",
    "raiseIntentResultResponse",
]);
export type ResponseMessageType = z.infer<typeof ResponseMessageTypeSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Request' appended.

export const RequestMessageTypeSchema = z.enum([
    "broadcastRequest",
    "findInstancesRequest",
    "findIntentRequest",
    "findIntentsByContextRequest",
    "getAppMetadataRequest",
    "openRequest",
    "PrivateChannel.broadcast",
    "PrivateChannel.eventListenerAdded",
    "PrivateChannel.eventListenerRemoved",
    "PrivateChannel.onAddContextListener",
    "PrivateChannel.onDisconnect",
    "PrivateChannel.onUnsubscribe",
    "raiseIntentRequest",
]);
export type RequestMessageType = z.infer<typeof RequestMessageTypeSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Request' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const BroadcastAgentRequestTypeSchema = z.enum([
    "broadcastRequest",
]);
export type BroadcastAgentRequestType = z.infer<typeof BroadcastAgentRequestTypeSchema>;

// Identifies the type of the connection step message.

export const ConnectionStepMessageTypeSchema = z.enum([
    "authenticationFailed",
    "connectedAgentsUpdate",
    "handshake",
    "hello",
]);
export type ConnectionStepMessageType = z.infer<typeof ConnectionStepMessageTypeSchema>;

// Identifies the type of the connection step message.

export const ConnectionStep2HelloTypeSchema = z.enum([
    "hello",
]);
export type ConnectionStep2HelloType = z.infer<typeof ConnectionStep2HelloTypeSchema>;

// Identifies the type of the connection step message.

export const ConnectionStep3HandshakeTypeSchema = z.enum([
    "handshake",
]);
export type ConnectionStep3HandshakeType = z.infer<typeof ConnectionStep3HandshakeTypeSchema>;

// Identifies the type of the connection step message.

export const ConnectionStep4AuthenticationFailedTypeSchema = z.enum([
    "authenticationFailed",
]);
export type ConnectionStep4AuthenticationFailedType = z.infer<typeof ConnectionStep4AuthenticationFailedTypeSchema>;

// Identifies the type of the connection step message.

export const ConnectionStep6ConnectedAgentsUpdateTypeSchema = z.enum([
    "connectedAgentsUpdate",
]);
export type ConnectionStep6ConnectedAgentsUpdateType = z.infer<typeof ConnectionStep6ConnectedAgentsUpdateTypeSchema>;

// Constants representing the errors that can be encountered when calling the `findIntent`,
// `findIntentsByContext`, `raiseIntent` or `raiseIntentForContext` methods on the
// DesktopAgent (`fdc3`).
//
// Array of error message strings for responses that were not returned to the bridge before
// the timeout or because an error occurred. Should be the same length as the `errorSources`
// array and ordered the same. May be omitted if all sources responded without errors.
//
// Constants representing the errors that can be encountered when calling the `open` method
// on the DesktopAgent object (`fdc3`).

export const ErrorMessageSchema = z.enum([
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
]);
export type ErrorMessage = z.infer<typeof ErrorMessageSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Response' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const FindInstancesAgentErrorResponseTypeSchema = z.enum([
    "findInstancesResponse",
]);
export type FindInstancesAgentErrorResponseType = z.infer<typeof FindInstancesAgentErrorResponseTypeSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Request' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const FindInstancesAgentRequestTypeSchema = z.enum([
    "findInstancesRequest",
]);
export type FindInstancesAgentRequestType = z.infer<typeof FindInstancesAgentRequestTypeSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Response' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const FindIntentAgentErrorResponseTypeSchema = z.enum([
    "findIntentResponse",
]);
export type FindIntentAgentErrorResponseType = z.infer<typeof FindIntentAgentErrorResponseTypeSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Request' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const FindIntentAgentRequestTypeSchema = z.enum([
    "findIntentRequest",
]);
export type FindIntentAgentRequestType = z.infer<typeof FindIntentAgentRequestTypeSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Response' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const FindIntentsByContextAgentErrorResponseTypeSchema = z.enum([
    "findIntentsByContextResponse",
]);
export type FindIntentsByContextAgentErrorResponseType = z.infer<typeof FindIntentsByContextAgentErrorResponseTypeSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Request' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const FindIntentsByContextAgentRequestTypeSchema = z.enum([
    "findIntentsByContextRequest",
]);
export type FindIntentsByContextAgentRequestType = z.infer<typeof FindIntentsByContextAgentRequestTypeSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Response' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const GetAppMetadataAgentErrorResponseTypeSchema = z.enum([
    "getAppMetadataResponse",
]);
export type GetAppMetadataAgentErrorResponseType = z.infer<typeof GetAppMetadataAgentErrorResponseTypeSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Request' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const GetAppMetadataAgentRequestTypeSchema = z.enum([
    "getAppMetadataRequest",
]);
export type GetAppMetadataAgentRequestType = z.infer<typeof GetAppMetadataAgentRequestTypeSchema>;

// Constants representing the errors that can be encountered when calling the `open` method
// on the DesktopAgent object (`fdc3`).
//
// Array of error message strings for responses that were not returned to the bridge before
// the timeout or because an error occurred. Should be the same length as the `errorSources`
// array and ordered the same. May be omitted if all sources responded without errors.
//
// Constants representing the errors that can be encountered when calling the `findIntent`,
// `findIntentsByContext`, `raiseIntent` or `raiseIntentForContext` methods on the
// DesktopAgent (`fdc3`).

export const OpenErrorMessageSchema = z.enum([
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
]);
export type OpenErrorMessage = z.infer<typeof OpenErrorMessageSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Response' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const OpenAgentErrorResponseTypeSchema = z.enum([
    "openResponse",
]);
export type OpenAgentErrorResponseType = z.infer<typeof OpenAgentErrorResponseTypeSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Request' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const OpenAgentRequestTypeSchema = z.enum([
    "openRequest",
]);
export type OpenAgentRequestType = z.infer<typeof OpenAgentRequestTypeSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Request' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const PrivateChannelBroadcastAgentRequestTypeSchema = z.enum([
    "PrivateChannel.broadcast",
]);
export type PrivateChannelBroadcastAgentRequestType = z.infer<typeof PrivateChannelBroadcastAgentRequestTypeSchema>;

// Event listener type names for Private Channel events

export const PrivateChannelEventListenerTypesSchema = z.enum([
    "onAddContextListener",
    "onDisconnect",
    "onUnsubscribe",
]);
export type PrivateChannelEventListenerTypes = z.infer<typeof PrivateChannelEventListenerTypesSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Request' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const PrivateChannelEventListenerAddedAgentRequestTypeSchema = z.enum([
    "PrivateChannel.eventListenerAdded",
]);
export type PrivateChannelEventListenerAddedAgentRequestType = z.infer<typeof PrivateChannelEventListenerAddedAgentRequestTypeSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Request' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const PrivateChannelEventListenerRemovedAgentRequestTypeSchema = z.enum([
    "PrivateChannel.eventListenerRemoved",
]);
export type PrivateChannelEventListenerRemovedAgentRequestType = z.infer<typeof PrivateChannelEventListenerRemovedAgentRequestTypeSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Request' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const PrivateChannelOnAddContextListenerAgentRequestTypeSchema = z.enum([
    "PrivateChannel.onAddContextListener",
]);
export type PrivateChannelOnAddContextListenerAgentRequestType = z.infer<typeof PrivateChannelOnAddContextListenerAgentRequestTypeSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Request' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const PrivateChannelOnDisconnectAgentRequestTypeSchema = z.enum([
    "PrivateChannel.onDisconnect",
]);
export type PrivateChannelOnDisconnectAgentRequestType = z.infer<typeof PrivateChannelOnDisconnectAgentRequestTypeSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Request' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const PrivateChannelOnUnsubscribeAgentRequestTypeSchema = z.enum([
    "PrivateChannel.onUnsubscribe",
]);
export type PrivateChannelOnUnsubscribeAgentRequestType = z.infer<typeof PrivateChannelOnUnsubscribeAgentRequestTypeSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Response' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const RaiseIntentAgentErrorResponseTypeSchema = z.enum([
    "raiseIntentResponse",
]);
export type RaiseIntentAgentErrorResponseType = z.infer<typeof RaiseIntentAgentErrorResponseTypeSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Request' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const RaiseIntentAgentRequestTypeSchema = z.enum([
    "raiseIntentRequest",
]);
export type RaiseIntentAgentRequestType = z.infer<typeof RaiseIntentAgentRequestTypeSchema>;

// Array of error message strings for responses that were not returned to the bridge before
// the timeout or because an error occurred. Should be the same length as the `errorSources`
// array and ordered the same. May be omitted if all sources responded without errors.
//
// Constants representing the errors that can be encountered when calling the `open` method
// on the DesktopAgent object (`fdc3`).
//
// Constants representing the errors that can be encountered when calling the `findIntent`,
// `findIntentsByContext`, `raiseIntent` or `raiseIntentForContext` methods on the
// DesktopAgent (`fdc3`).

export const RaiseIntentResultErrorMessageSchema = z.enum([
    "AgentDisconnected",
    "IntentHandlerRejected",
    "MalformedMessage",
    "NoResultReturned",
    "NotConnectedToBridge",
    "ResponseToBridgeTimedOut",
]);
export type RaiseIntentResultErrorMessage = z.infer<typeof RaiseIntentResultErrorMessageSchema>;

// Identifies the type of the message and it is typically set to the FDC3 function name that
// the message relates to, e.g. 'findIntent', with 'Response' appended.
//
// UUID for the request
//
// UUID for this specific response message.

export const RaiseIntentResultAgentErrorResponseTypeSchema = z.enum([
    "raiseIntentResultResponse",
]);
export type RaiseIntentResultAgentErrorResponseType = z.infer<typeof RaiseIntentResultAgentErrorResponseTypeSchema>;

// Uniquely defines each channel type.
// Can be "user", "app" or "private".

export const TypeSchema = z.enum([
    "app",
    "private",
    "user",
]);
export type Type = z.infer<typeof TypeSchema>;

export const AgentResponseMetadataSchema = z.object({
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type AgentResponseMetadata = z.infer<typeof AgentResponseMetadataSchema>;

export const ErrorResponseMessagePayloadSchema = z.object({
    "error": ResponseErrorDetailSchema,
});
export type ErrorResponseMessagePayload = z.infer<typeof ErrorResponseMessagePayloadSchema>;

export const BridgeParticipantIdentifierSchema = z.object({
    "desktopAgent": z.string(),
    "appId": z.union([z.null(), z.string()]).optional(),
    "instanceId": z.union([z.null(), z.string()]).optional(),
});
export type BridgeParticipantIdentifier = z.infer<typeof BridgeParticipantIdentifierSchema>;

export const SourceIdentifierSchema = z.object({
    "appId": z.union([z.null(), z.string()]).optional(),
    "desktopAgent": z.union([z.null(), z.string()]).optional(),
    "instanceId": z.union([z.null(), z.string()]).optional(),
});
export type SourceIdentifier = z.infer<typeof SourceIdentifierSchema>;

export const AgentResponseMessageSchema = z.object({
    "meta": AgentResponseMetadataSchema,
    "payload": z.record(z.string(), z.any()),
    "type": ResponseMessageTypeSchema,
});
export type AgentResponseMessage = z.infer<typeof AgentResponseMessageSchema>;

export const DesktopAgentIdentifierSchema = z.object({
    "desktopAgent": z.string(),
});
export type DesktopAgentIdentifier = z.infer<typeof DesktopAgentIdentifierSchema>;

export const ResponseErrorMessagePayloadSchema = z.object({
    "error": z.union([ResponseErrorDetailSchema, z.null()]).optional(),
});
export type ResponseErrorMessagePayload = z.infer<typeof ResponseErrorMessagePayloadSchema>;

export const BridgeRequestMetadataSchema = z.object({
    "destination": z.union([BridgeParticipantIdentifierSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": BridgeParticipantIdentifierSchema,
    "timestamp": z.coerce.date(),
});
export type BridgeRequestMetadata = z.infer<typeof BridgeRequestMetadataSchema>;

export const BridgeResponseMessageMetaSchema = z.object({
    "errorDetails": z.union([z.array(ResponseErrorDetailSchema), z.null()]).optional(),
    "errorSources": z.union([z.array(DesktopAgentIdentifierSchema), z.null()]).optional(),
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "sources": z.union([z.array(DesktopAgentIdentifierSchema), z.null()]).optional(),
    "timestamp": z.coerce.date(),
});
export type BridgeResponseMessageMeta = z.infer<typeof BridgeResponseMessageMetaSchema>;

export const SourceClassSchema = z.object({
    "appId": z.string(),
    "desktopAgent": z.union([z.null(), z.string()]).optional(),
    "instanceId": z.union([z.null(), z.string()]).optional(),
});
export type SourceClass = z.infer<typeof SourceClassSchema>;

export const ContextElementSchema = z.object({
    "id": z.union([z.record(z.string(), z.any()), z.null()]).optional(),
    "name": z.union([z.null(), z.string()]).optional(),
    "type": z.string(),
});
export type ContextElement = z.infer<typeof ContextElementSchema>;

export const MetaSourceSchema = z.object({
    "appId": z.string(),
    "desktopAgent": z.string(),
    "instanceId": z.union([z.null(), z.string()]).optional(),
});
export type MetaSource = z.infer<typeof MetaSourceSchema>;

export const BroadcastBridgeRequestPayloadSchema = z.object({
    "channelId": z.string(),
    "context": ContextElementSchema,
});
export type BroadcastBridgeRequestPayload = z.infer<typeof BroadcastBridgeRequestPayloadSchema>;

export const ConnectionStepMetadataSchema = z.object({
    "requestUuid": z.union([z.null(), z.string()]).optional(),
    "responseUuid": z.union([z.null(), z.string()]).optional(),
    "timestamp": z.coerce.date(),
});
export type ConnectionStepMetadata = z.infer<typeof ConnectionStepMetadataSchema>;

export const ConnectionStep2HelloMetaSchema = z.object({
    "timestamp": z.coerce.date(),
});
export type ConnectionStep2HelloMeta = z.infer<typeof ConnectionStep2HelloMetaSchema>;

export const ConnectionStep2HelloPayloadSchema = z.object({
    "authRequired": z.boolean(),
    "authToken": z.union([z.null(), z.string()]).optional(),
    "desktopAgentBridgeVersion": z.string(),
    "supportedFDC3Versions": z.array(z.string()),
});
export type ConnectionStep2HelloPayload = z.infer<typeof ConnectionStep2HelloPayloadSchema>;

export const ConnectionStep3HandshakeMetaSchema = z.object({
    "requestUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type ConnectionStep3HandshakeMeta = z.infer<typeof ConnectionStep3HandshakeMetaSchema>;

export const OptionalFeaturesSchema = z.object({
    "DesktopAgentBridging": z.boolean(),
    "OriginatingAppMetadata": z.boolean(),
    "UserChannelMembershipAPIs": z.boolean(),
});
export type OptionalFeatures = z.infer<typeof OptionalFeaturesSchema>;

export const ConnectionStep4AuthenticationFailedMetaSchema = z.object({
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type ConnectionStep4AuthenticationFailedMeta = z.infer<typeof ConnectionStep4AuthenticationFailedMetaSchema>;

export const ConnectionStep4AuthenticationFailedPayloadSchema = z.object({
    "message": z.union([z.null(), z.string()]).optional(),
});
export type ConnectionStep4AuthenticationFailedPayload = z.infer<typeof ConnectionStep4AuthenticationFailedPayloadSchema>;

export const ConnectionStep6ConnectedAgentsUpdateMetaSchema = z.object({
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type ConnectionStep6ConnectedAgentsUpdateMeta = z.infer<typeof ConnectionStep6ConnectedAgentsUpdateMetaSchema>;

export const DesktopAgentImplementationMetadataSchema = z.object({
    "desktopAgent": z.string(),
    "fdc3Version": z.string(),
    "optionalFeatures": OptionalFeaturesSchema,
    "provider": z.string(),
    "providerVersion": z.union([z.null(), z.string()]).optional(),
});
export type DesktopAgentImplementationMetadata = z.infer<typeof DesktopAgentImplementationMetadataSchema>;

export const FindInstancesAgentErrorResponseMetaSchema = z.object({
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type FindInstancesAgentErrorResponseMeta = z.infer<typeof FindInstancesAgentErrorResponseMetaSchema>;

export const FindInstancesAgentErrorResponsePayloadSchema = z.object({
    "error": ErrorMessageSchema,
});
export type FindInstancesAgentErrorResponsePayload = z.infer<typeof FindInstancesAgentErrorResponsePayloadSchema>;

export const DestinationClassSchema = z.object({
    "desktopAgent": z.string(),
    "appId": z.union([z.null(), z.string()]).optional(),
    "instanceId": z.union([z.null(), z.string()]).optional(),
});
export type DestinationClass = z.infer<typeof DestinationClassSchema>;

export const AppIdentifierSchema = z.object({
    "appId": z.string(),
    "desktopAgent": z.union([z.null(), z.string()]).optional(),
    "instanceId": z.union([z.null(), z.string()]).optional(),
});
export type AppIdentifier = z.infer<typeof AppIdentifierSchema>;

export const FindInstancesAgentResponseMetaSchema = z.object({
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type FindInstancesAgentResponseMeta = z.infer<typeof FindInstancesAgentResponseMetaSchema>;

export const IconSchema = z.object({
    "size": z.union([z.null(), z.string()]).optional(),
    "src": z.string(),
    "type": z.union([z.null(), z.string()]).optional(),
});
export type Icon = z.infer<typeof IconSchema>;

export const ImageSchema = z.object({
    "label": z.union([z.null(), z.string()]).optional(),
    "size": z.union([z.null(), z.string()]).optional(),
    "src": z.string(),
    "type": z.union([z.null(), z.string()]).optional(),
});
export type Image = z.infer<typeof ImageSchema>;

export const FindInstancesBridgeErrorResponseMetaSchema = z.object({
    "errorDetails": z.array(ResponseErrorDetailSchema),
    "errorSources": z.array(DesktopAgentIdentifierSchema),
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type FindInstancesBridgeErrorResponseMeta = z.infer<typeof FindInstancesBridgeErrorResponseMetaSchema>;

export const FindInstancesBridgeErrorResponsePayloadSchema = z.object({
    "error": ErrorMessageSchema,
});
export type FindInstancesBridgeErrorResponsePayload = z.infer<typeof FindInstancesBridgeErrorResponsePayloadSchema>;

export const MetaSourceClassSchema = z.object({
    "appId": z.union([z.null(), z.string()]).optional(),
    "desktopAgent": z.string(),
    "instanceId": z.union([z.null(), z.string()]).optional(),
});
export type MetaSourceClass = z.infer<typeof MetaSourceClassSchema>;

export const FindInstancesBridgeRequestPayloadSchema = z.object({
    "app": AppIdentifierSchema,
});
export type FindInstancesBridgeRequestPayload = z.infer<typeof FindInstancesBridgeRequestPayloadSchema>;

export const FindInstancesBridgeResponseMetaSchema = z.object({
    "errorDetails": z.union([z.array(ResponseErrorDetailSchema), z.null()]).optional(),
    "errorSources": z.union([z.array(DesktopAgentIdentifierSchema), z.null()]).optional(),
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "sources": z.union([z.array(DesktopAgentIdentifierSchema), z.null()]).optional(),
    "timestamp": z.coerce.date(),
});
export type FindInstancesBridgeResponseMeta = z.infer<typeof FindInstancesBridgeResponseMetaSchema>;

export const FindIntentAgentErrorResponseMetaSchema = z.object({
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type FindIntentAgentErrorResponseMeta = z.infer<typeof FindIntentAgentErrorResponseMetaSchema>;

export const FindIntentAgentErrorResponsePayloadSchema = z.object({
    "error": ErrorMessageSchema,
});
export type FindIntentAgentErrorResponsePayload = z.infer<typeof FindIntentAgentErrorResponsePayloadSchema>;

export const FindIntentAgentRequestMetaSchema = z.object({
    "requestUuid": z.string(),
    "source": z.union([SourceIdentifierSchema, z.null()]).optional(),
    "timestamp": z.coerce.date(),
    "destination": z.union([BridgeParticipantIdentifierSchema, z.null()]).optional(),
});
export type FindIntentAgentRequestMeta = z.infer<typeof FindIntentAgentRequestMetaSchema>;

export const FindIntentAgentRequestPayloadSchema = z.object({
    "context": z.union([ContextElementSchema, z.null()]).optional(),
    "intent": z.string(),
    "resultType": z.union([z.null(), z.string()]).optional(),
});
export type FindIntentAgentRequestPayload = z.infer<typeof FindIntentAgentRequestPayloadSchema>;

export const FindIntentAgentResponseMetaSchema = z.object({
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type FindIntentAgentResponseMeta = z.infer<typeof FindIntentAgentResponseMetaSchema>;

export const IntentMetadataSchema = z.object({
    "displayName": z.string(),
    "name": z.string(),
});
export type IntentMetadata = z.infer<typeof IntentMetadataSchema>;

export const FindIntentBridgeErrorResponseMetaSchema = z.object({
    "errorDetails": z.array(ResponseErrorDetailSchema),
    "errorSources": z.array(DesktopAgentIdentifierSchema),
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type FindIntentBridgeErrorResponseMeta = z.infer<typeof FindIntentBridgeErrorResponseMetaSchema>;

export const FindIntentBridgeErrorResponsePayloadSchema = z.object({
    "error": ErrorMessageSchema,
});
export type FindIntentBridgeErrorResponsePayload = z.infer<typeof FindIntentBridgeErrorResponsePayloadSchema>;

export const FindIntentBridgeRequestMetaSchema = z.object({
    "requestUuid": z.string(),
    "source": BridgeParticipantIdentifierSchema,
    "timestamp": z.coerce.date(),
    "destination": z.union([BridgeParticipantIdentifierSchema, z.null()]).optional(),
});
export type FindIntentBridgeRequestMeta = z.infer<typeof FindIntentBridgeRequestMetaSchema>;

export const FindIntentBridgeRequestPayloadSchema = z.object({
    "context": z.union([ContextElementSchema, z.null()]).optional(),
    "intent": z.string(),
    "resultType": z.union([z.null(), z.string()]).optional(),
});
export type FindIntentBridgeRequestPayload = z.infer<typeof FindIntentBridgeRequestPayloadSchema>;

export const FindIntentBridgeResponseMetaSchema = z.object({
    "errorDetails": z.union([z.array(ResponseErrorDetailSchema), z.null()]).optional(),
    "errorSources": z.union([z.array(DesktopAgentIdentifierSchema), z.null()]).optional(),
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "sources": z.union([z.array(DesktopAgentIdentifierSchema), z.null()]).optional(),
    "timestamp": z.coerce.date(),
});
export type FindIntentBridgeResponseMeta = z.infer<typeof FindIntentBridgeResponseMetaSchema>;

export const FindIntentsByContextAgentErrorResponseMetaSchema = z.object({
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type FindIntentsByContextAgentErrorResponseMeta = z.infer<typeof FindIntentsByContextAgentErrorResponseMetaSchema>;

export const FindIntentsByContextAgentErrorResponsePayloadSchema = z.object({
    "error": ErrorMessageSchema,
});
export type FindIntentsByContextAgentErrorResponsePayload = z.infer<typeof FindIntentsByContextAgentErrorResponsePayloadSchema>;

export const FindIntentsByContextAgentRequestMetaSchema = z.object({
    "requestUuid": z.string(),
    "source": z.union([SourceClassSchema, z.null()]).optional(),
    "timestamp": z.coerce.date(),
    "destination": z.union([BridgeParticipantIdentifierSchema, z.null()]).optional(),
});
export type FindIntentsByContextAgentRequestMeta = z.infer<typeof FindIntentsByContextAgentRequestMetaSchema>;

export const FindIntentsByContextAgentRequestPayloadSchema = z.object({
    "context": ContextElementSchema,
});
export type FindIntentsByContextAgentRequestPayload = z.infer<typeof FindIntentsByContextAgentRequestPayloadSchema>;

export const FindIntentsByContextAgentResponseMetaSchema = z.object({
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type FindIntentsByContextAgentResponseMeta = z.infer<typeof FindIntentsByContextAgentResponseMetaSchema>;

export const FindIntentsByContextBridgeErrorResponseMetaSchema = z.object({
    "errorDetails": z.array(ResponseErrorDetailSchema),
    "errorSources": z.array(DesktopAgentIdentifierSchema),
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type FindIntentsByContextBridgeErrorResponseMeta = z.infer<typeof FindIntentsByContextBridgeErrorResponseMetaSchema>;

export const FindIntentsByContextBridgeErrorResponsePayloadSchema = z.object({
    "error": ErrorMessageSchema,
});
export type FindIntentsByContextBridgeErrorResponsePayload = z.infer<typeof FindIntentsByContextBridgeErrorResponsePayloadSchema>;

export const FindIntentsByContextBridgeRequestMetaSchema = z.object({
    "requestUuid": z.string(),
    "source": MetaSourceSchema,
    "timestamp": z.coerce.date(),
    "destination": z.union([BridgeParticipantIdentifierSchema, z.null()]).optional(),
});
export type FindIntentsByContextBridgeRequestMeta = z.infer<typeof FindIntentsByContextBridgeRequestMetaSchema>;

export const FindIntentsByContextBridgeRequestPayloadSchema = z.object({
    "context": ContextElementSchema,
});
export type FindIntentsByContextBridgeRequestPayload = z.infer<typeof FindIntentsByContextBridgeRequestPayloadSchema>;

export const FindIntentsByContextBridgeResponseMetaSchema = z.object({
    "errorDetails": z.union([z.array(ResponseErrorDetailSchema), z.null()]).optional(),
    "errorSources": z.union([z.array(DesktopAgentIdentifierSchema), z.null()]).optional(),
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "sources": z.union([z.array(DesktopAgentIdentifierSchema), z.null()]).optional(),
    "timestamp": z.coerce.date(),
});
export type FindIntentsByContextBridgeResponseMeta = z.infer<typeof FindIntentsByContextBridgeResponseMetaSchema>;

export const GetAppMetadataAgentErrorResponseMetaSchema = z.object({
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type GetAppMetadataAgentErrorResponseMeta = z.infer<typeof GetAppMetadataAgentErrorResponseMetaSchema>;

export const GetAppMetadataAgentErrorResponsePayloadSchema = z.object({
    "error": ErrorMessageSchema,
});
export type GetAppMetadataAgentErrorResponsePayload = z.infer<typeof GetAppMetadataAgentErrorResponsePayloadSchema>;

export const GetAppMetadataAgentRequestMetaSchema = z.object({
    "destination": z.union([DestinationClassSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": z.union([SourceIdentifierSchema, z.null()]).optional(),
    "timestamp": z.coerce.date(),
});
export type GetAppMetadataAgentRequestMeta = z.infer<typeof GetAppMetadataAgentRequestMetaSchema>;

export const AppDestinationIdentifierSchema = z.object({
    "desktopAgent": z.string(),
    "appId": z.string(),
    "instanceId": z.union([z.null(), z.string()]).optional(),
});
export type AppDestinationIdentifier = z.infer<typeof AppDestinationIdentifierSchema>;

export const GetAppMetadataAgentResponseMetaSchema = z.object({
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type GetAppMetadataAgentResponseMeta = z.infer<typeof GetAppMetadataAgentResponseMetaSchema>;

export const GetAppMetadataBridgeErrorResponseMetaSchema = z.object({
    "errorDetails": z.array(ResponseErrorDetailSchema),
    "errorSources": z.array(DesktopAgentIdentifierSchema),
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type GetAppMetadataBridgeErrorResponseMeta = z.infer<typeof GetAppMetadataBridgeErrorResponseMetaSchema>;

export const GetAppMetadataBridgeErrorResponsePayloadSchema = z.object({
    "error": ErrorMessageSchema,
});
export type GetAppMetadataBridgeErrorResponsePayload = z.infer<typeof GetAppMetadataBridgeErrorResponsePayloadSchema>;

export const GetAppMetadataBridgeRequestMetaSchema = z.object({
    "destination": z.union([DestinationClassSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": MetaSourceClassSchema,
    "timestamp": z.coerce.date(),
});
export type GetAppMetadataBridgeRequestMeta = z.infer<typeof GetAppMetadataBridgeRequestMetaSchema>;

export const GetAppMetadataBridgeRequestPayloadSchema = z.object({
    "app": AppDestinationIdentifierSchema,
});
export type GetAppMetadataBridgeRequestPayload = z.infer<typeof GetAppMetadataBridgeRequestPayloadSchema>;

export const GetAppMetadataBridgeResponseMetaSchema = z.object({
    "errorDetails": z.union([z.array(ResponseErrorDetailSchema), z.null()]).optional(),
    "errorSources": z.union([z.array(DesktopAgentIdentifierSchema), z.null()]).optional(),
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "sources": z.union([z.array(DesktopAgentIdentifierSchema), z.null()]).optional(),
    "timestamp": z.coerce.date(),
});
export type GetAppMetadataBridgeResponseMeta = z.infer<typeof GetAppMetadataBridgeResponseMetaSchema>;

export const OpenAgentErrorResponseMetaSchema = z.object({
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type OpenAgentErrorResponseMeta = z.infer<typeof OpenAgentErrorResponseMetaSchema>;

export const OpenAgentErrorResponsePayloadSchema = z.object({
    "error": OpenErrorMessageSchema,
});
export type OpenAgentErrorResponsePayload = z.infer<typeof OpenAgentErrorResponsePayloadSchema>;

export const OpenAgentRequestMetaSchema = z.object({
    "destination": z.union([DestinationClassSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": SourceClassSchema,
    "timestamp": z.coerce.date(),
});
export type OpenAgentRequestMeta = z.infer<typeof OpenAgentRequestMetaSchema>;

export const AppToOpenSchema = z.object({
    "desktopAgent": z.string(),
    "appId": z.string(),
    "instanceId": z.union([z.null(), z.string()]).optional(),
});
export type AppToOpen = z.infer<typeof AppToOpenSchema>;

export const OpenAgentResponseMetaSchema = z.object({
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type OpenAgentResponseMeta = z.infer<typeof OpenAgentResponseMetaSchema>;

export const OpenAgentResponsePayloadSchema = z.object({
    "appIdentifier": AppIdentifierSchema,
});
export type OpenAgentResponsePayload = z.infer<typeof OpenAgentResponsePayloadSchema>;

export const OpenBridgeErrorResponseMetaSchema = z.object({
    "errorDetails": z.array(ResponseErrorDetailSchema),
    "errorSources": z.array(DesktopAgentIdentifierSchema),
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type OpenBridgeErrorResponseMeta = z.infer<typeof OpenBridgeErrorResponseMetaSchema>;

export const OpenBridgeErrorResponsePayloadSchema = z.object({
    "error": OpenErrorMessageSchema,
});
export type OpenBridgeErrorResponsePayload = z.infer<typeof OpenBridgeErrorResponsePayloadSchema>;

export const OpenBridgeRequestMetaSchema = z.object({
    "destination": z.union([DestinationClassSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": MetaSourceSchema,
    "timestamp": z.coerce.date(),
});
export type OpenBridgeRequestMeta = z.infer<typeof OpenBridgeRequestMetaSchema>;

export const OpenBridgeRequestPayloadSchema = z.object({
    "app": AppToOpenSchema,
    "context": z.union([ContextElementSchema, z.null()]).optional(),
});
export type OpenBridgeRequestPayload = z.infer<typeof OpenBridgeRequestPayloadSchema>;

export const OpenBridgeResponseMetaSchema = z.object({
    "errorDetails": z.union([z.array(ResponseErrorDetailSchema), z.null()]).optional(),
    "errorSources": z.union([z.array(DesktopAgentIdentifierSchema), z.null()]).optional(),
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "sources": z.union([z.array(DesktopAgentIdentifierSchema), z.null()]).optional(),
    "timestamp": z.coerce.date(),
});
export type OpenBridgeResponseMeta = z.infer<typeof OpenBridgeResponseMetaSchema>;

export const OpenBridgeResponsePayloadSchema = z.object({
    "appIdentifier": AppIdentifierSchema,
});
export type OpenBridgeResponsePayload = z.infer<typeof OpenBridgeResponsePayloadSchema>;

export const MetaDestinationSchema = z.object({
    "desktopAgent": z.string(),
    "appId": z.string(),
    "instanceId": z.union([z.null(), z.string()]).optional(),
});
export type MetaDestination = z.infer<typeof MetaDestinationSchema>;

export const PrivateChannelBroadcastAgentRequestPayloadSchema = z.object({
    "channelId": z.string(),
    "context": ContextElementSchema,
});
export type PrivateChannelBroadcastAgentRequestPayload = z.infer<typeof PrivateChannelBroadcastAgentRequestPayloadSchema>;

export const PrivateChannelBroadcastBridgeRequestMetaSchema = z.object({
    "destination": z.union([MetaDestinationSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": MetaSourceSchema,
    "timestamp": z.coerce.date(),
});
export type PrivateChannelBroadcastBridgeRequestMeta = z.infer<typeof PrivateChannelBroadcastBridgeRequestMetaSchema>;

export const PrivateChannelBroadcastBridgeRequestPayloadSchema = z.object({
    "channelId": z.string(),
    "context": ContextElementSchema,
});
export type PrivateChannelBroadcastBridgeRequestPayload = z.infer<typeof PrivateChannelBroadcastBridgeRequestPayloadSchema>;

export const PrivateChannelEventListenerAddedAgentRequestMetaSchema = z.object({
    "destination": z.union([MetaDestinationSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": z.union([SourceClassSchema, z.null()]).optional(),
    "timestamp": z.coerce.date(),
});
export type PrivateChannelEventListenerAddedAgentRequestMeta = z.infer<typeof PrivateChannelEventListenerAddedAgentRequestMetaSchema>;

export const PrivateChannelEventListenerAddedAgentRequestPayloadSchema = z.object({
    "channelId": z.string(),
    "listenerType": PrivateChannelEventListenerTypesSchema,
});
export type PrivateChannelEventListenerAddedAgentRequestPayload = z.infer<typeof PrivateChannelEventListenerAddedAgentRequestPayloadSchema>;

export const PrivateChannelEventListenerAddedBridgeRequestMetaSchema = z.object({
    "destination": z.union([MetaDestinationSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": MetaSourceSchema,
    "timestamp": z.coerce.date(),
});
export type PrivateChannelEventListenerAddedBridgeRequestMeta = z.infer<typeof PrivateChannelEventListenerAddedBridgeRequestMetaSchema>;

export const PrivateChannelEventListenerAddedBridgeRequestPayloadSchema = z.object({
    "channelId": z.string(),
    "listenerType": PrivateChannelEventListenerTypesSchema,
});
export type PrivateChannelEventListenerAddedBridgeRequestPayload = z.infer<typeof PrivateChannelEventListenerAddedBridgeRequestPayloadSchema>;

export const PrivateChannelEventListenerRemovedAgentRequestMetaSchema = z.object({
    "destination": z.union([MetaDestinationSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": z.union([SourceClassSchema, z.null()]).optional(),
    "timestamp": z.coerce.date(),
});
export type PrivateChannelEventListenerRemovedAgentRequestMeta = z.infer<typeof PrivateChannelEventListenerRemovedAgentRequestMetaSchema>;

export const PrivateChannelEventListenerRemovedAgentRequestPayloadSchema = z.object({
    "channelId": z.string(),
    "listenerType": PrivateChannelEventListenerTypesSchema,
});
export type PrivateChannelEventListenerRemovedAgentRequestPayload = z.infer<typeof PrivateChannelEventListenerRemovedAgentRequestPayloadSchema>;

export const PrivateChannelEventListenerRemovedBridgeRequestMetaSchema = z.object({
    "destination": z.union([MetaDestinationSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": MetaSourceSchema,
    "timestamp": z.coerce.date(),
});
export type PrivateChannelEventListenerRemovedBridgeRequestMeta = z.infer<typeof PrivateChannelEventListenerRemovedBridgeRequestMetaSchema>;

export const PrivateChannelEventListenerRemovedBridgeRequestPayloadSchema = z.object({
    "channelId": z.string(),
    "listenerType": PrivateChannelEventListenerTypesSchema,
});
export type PrivateChannelEventListenerRemovedBridgeRequestPayload = z.infer<typeof PrivateChannelEventListenerRemovedBridgeRequestPayloadSchema>;

export const PrivateChannelOnAddContextListenerAgentRequestMetaSchema = z.object({
    "destination": z.union([MetaDestinationSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": z.union([SourceClassSchema, z.null()]).optional(),
    "timestamp": z.coerce.date(),
});
export type PrivateChannelOnAddContextListenerAgentRequestMeta = z.infer<typeof PrivateChannelOnAddContextListenerAgentRequestMetaSchema>;

export const PrivateChannelOnAddContextListenerAgentRequestPayloadSchema = z.object({
    "channelId": z.string(),
    "contextType": z.union([z.null(), z.string()]),
});
export type PrivateChannelOnAddContextListenerAgentRequestPayload = z.infer<typeof PrivateChannelOnAddContextListenerAgentRequestPayloadSchema>;

export const PrivateChannelOnAddContextListenerBridgeRequestMetaSchema = z.object({
    "destination": z.union([MetaDestinationSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": MetaSourceSchema,
    "timestamp": z.coerce.date(),
});
export type PrivateChannelOnAddContextListenerBridgeRequestMeta = z.infer<typeof PrivateChannelOnAddContextListenerBridgeRequestMetaSchema>;

export const PrivateChannelOnAddContextListenerBridgeRequestPayloadSchema = z.object({
    "channelId": z.string(),
    "contextType": z.union([z.null(), z.string()]),
});
export type PrivateChannelOnAddContextListenerBridgeRequestPayload = z.infer<typeof PrivateChannelOnAddContextListenerBridgeRequestPayloadSchema>;

export const PrivateChannelOnDisconnectAgentRequestMetaSchema = z.object({
    "destination": z.union([MetaDestinationSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": z.union([SourceClassSchema, z.null()]).optional(),
    "timestamp": z.coerce.date(),
});
export type PrivateChannelOnDisconnectAgentRequestMeta = z.infer<typeof PrivateChannelOnDisconnectAgentRequestMetaSchema>;

export const PrivateChannelOnDisconnectAgentRequestPayloadSchema = z.object({
    "channelId": z.string(),
});
export type PrivateChannelOnDisconnectAgentRequestPayload = z.infer<typeof PrivateChannelOnDisconnectAgentRequestPayloadSchema>;

export const PrivateChannelOnDisconnectBridgeRequestMetaSchema = z.object({
    "destination": z.union([MetaDestinationSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": MetaSourceSchema,
    "timestamp": z.coerce.date(),
});
export type PrivateChannelOnDisconnectBridgeRequestMeta = z.infer<typeof PrivateChannelOnDisconnectBridgeRequestMetaSchema>;

export const PrivateChannelOnDisconnectBridgeRequestPayloadSchema = z.object({
    "channelId": z.string(),
});
export type PrivateChannelOnDisconnectBridgeRequestPayload = z.infer<typeof PrivateChannelOnDisconnectBridgeRequestPayloadSchema>;

export const PrivateChannelOnUnsubscribeAgentRequestMetaSchema = z.object({
    "destination": z.union([MetaDestinationSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": z.union([SourceClassSchema, z.null()]).optional(),
    "timestamp": z.coerce.date(),
});
export type PrivateChannelOnUnsubscribeAgentRequestMeta = z.infer<typeof PrivateChannelOnUnsubscribeAgentRequestMetaSchema>;

export const PrivateChannelOnUnsubscribeAgentRequestPayloadSchema = z.object({
    "channelId": z.string(),
    "contextType": z.union([z.null(), z.string()]),
});
export type PrivateChannelOnUnsubscribeAgentRequestPayload = z.infer<typeof PrivateChannelOnUnsubscribeAgentRequestPayloadSchema>;

export const ERequestMetadataSchema = z.object({
    "destination": z.union([MetaDestinationSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": MetaSourceSchema,
    "timestamp": z.coerce.date(),
});
export type ERequestMetadata = z.infer<typeof ERequestMetadataSchema>;

export const PrivateChannelOnUnsubscribeBridgeRequestPayloadSchema = z.object({
    "channelId": z.string(),
    "contextType": z.union([z.null(), z.string()]),
});
export type PrivateChannelOnUnsubscribeBridgeRequestPayload = z.infer<typeof PrivateChannelOnUnsubscribeBridgeRequestPayloadSchema>;

export const RaiseIntentAgentErrorResponseMetaSchema = z.object({
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type RaiseIntentAgentErrorResponseMeta = z.infer<typeof RaiseIntentAgentErrorResponseMetaSchema>;

export const RaiseIntentAgentErrorResponsePayloadSchema = z.object({
    "error": ErrorMessageSchema,
});
export type RaiseIntentAgentErrorResponsePayload = z.infer<typeof RaiseIntentAgentErrorResponsePayloadSchema>;

export const RaiseIntentAgentRequestMetaSchema = z.object({
    "destination": MetaDestinationSchema,
    "requestUuid": z.string(),
    "source": SourceClassSchema,
    "timestamp": z.coerce.date(),
});
export type RaiseIntentAgentRequestMeta = z.infer<typeof RaiseIntentAgentRequestMetaSchema>;

export const RaiseIntentAgentRequestPayloadSchema = z.object({
    "app": AppDestinationIdentifierSchema,
    "context": ContextElementSchema,
    "intent": z.string(),
});
export type RaiseIntentAgentRequestPayload = z.infer<typeof RaiseIntentAgentRequestPayloadSchema>;

export const RaiseIntentAgentResponseMetaSchema = z.object({
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type RaiseIntentAgentResponseMeta = z.infer<typeof RaiseIntentAgentResponseMetaSchema>;

export const IntentResolutionSchema = z.object({
    "intent": z.string(),
    "source": AppIdentifierSchema,
});
export type IntentResolution = z.infer<typeof IntentResolutionSchema>;

export const RaiseIntentBridgeErrorResponseMetaSchema = z.object({
    "errorDetails": z.array(ResponseErrorDetailSchema),
    "errorSources": z.array(DesktopAgentIdentifierSchema),
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type RaiseIntentBridgeErrorResponseMeta = z.infer<typeof RaiseIntentBridgeErrorResponseMetaSchema>;

export const RaiseIntentBridgeErrorResponsePayloadSchema = z.object({
    "error": ErrorMessageSchema,
});
export type RaiseIntentBridgeErrorResponsePayload = z.infer<typeof RaiseIntentBridgeErrorResponsePayloadSchema>;

export const RaiseIntentBridgeRequestMetaSchema = z.object({
    "destination": MetaDestinationSchema,
    "requestUuid": z.string(),
    "source": MetaSourceSchema,
    "timestamp": z.coerce.date(),
});
export type RaiseIntentBridgeRequestMeta = z.infer<typeof RaiseIntentBridgeRequestMetaSchema>;

export const RaiseIntentBridgeRequestPayloadSchema = z.object({
    "app": AppDestinationIdentifierSchema,
    "context": ContextElementSchema,
    "intent": z.string(),
});
export type RaiseIntentBridgeRequestPayload = z.infer<typeof RaiseIntentBridgeRequestPayloadSchema>;

export const RaiseIntentBridgeResponseMetaSchema = z.object({
    "errorDetails": z.union([z.array(ResponseErrorDetailSchema), z.null()]).optional(),
    "errorSources": z.union([z.array(DesktopAgentIdentifierSchema), z.null()]).optional(),
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "sources": z.union([z.array(DesktopAgentIdentifierSchema), z.null()]).optional(),
    "timestamp": z.coerce.date(),
});
export type RaiseIntentBridgeResponseMeta = z.infer<typeof RaiseIntentBridgeResponseMetaSchema>;

export const RaiseIntentBridgeResponsePayloadSchema = z.object({
    "intentResolution": IntentResolutionSchema,
});
export type RaiseIntentBridgeResponsePayload = z.infer<typeof RaiseIntentBridgeResponsePayloadSchema>;

export const RaiseIntentResultAgentErrorResponseMetaSchema = z.object({
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type RaiseIntentResultAgentErrorResponseMeta = z.infer<typeof RaiseIntentResultAgentErrorResponseMetaSchema>;

export const RaiseIntentResultAgentErrorResponsePayloadSchema = z.object({
    "error": RaiseIntentResultErrorMessageSchema,
});
export type RaiseIntentResultAgentErrorResponsePayload = z.infer<typeof RaiseIntentResultAgentErrorResponsePayloadSchema>;

export const RaiseIntentResultAgentResponseMetaSchema = z.object({
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type RaiseIntentResultAgentResponseMeta = z.infer<typeof RaiseIntentResultAgentResponseMetaSchema>;

export const DisplayMetadataSchema = z.object({
    "color": z.union([z.null(), z.string()]).optional(),
    "glyph": z.union([z.null(), z.string()]).optional(),
    "name": z.union([z.null(), z.string()]).optional(),
});
export type DisplayMetadata = z.infer<typeof DisplayMetadataSchema>;

export const RaiseIntentResultBridgeErrorResponseMetaSchema = z.object({
    "errorDetails": z.array(ResponseErrorDetailSchema),
    "errorSources": z.array(DesktopAgentIdentifierSchema),
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type RaiseIntentResultBridgeErrorResponseMeta = z.infer<typeof RaiseIntentResultBridgeErrorResponseMetaSchema>;

export const RaiseIntentResultBridgeErrorResponsePayloadSchema = z.object({
    "error": RaiseIntentResultErrorMessageSchema,
});
export type RaiseIntentResultBridgeErrorResponsePayload = z.infer<typeof RaiseIntentResultBridgeErrorResponsePayloadSchema>;

export const RaiseIntentResultBridgeResponseMetaSchema = z.object({
    "errorDetails": z.union([z.array(ResponseErrorDetailSchema), z.null()]).optional(),
    "errorSources": z.union([z.array(DesktopAgentIdentifierSchema), z.null()]).optional(),
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "sources": z.union([z.array(DesktopAgentIdentifierSchema), z.null()]).optional(),
    "timestamp": z.coerce.date(),
});
export type RaiseIntentResultBridgeResponseMeta = z.infer<typeof RaiseIntentResultBridgeResponseMetaSchema>;

export const ContextSchema = z.object({
    "id": z.union([z.record(z.string(), z.any()), z.null()]).optional(),
    "name": z.union([z.null(), z.string()]).optional(),
    "type": z.string(),
});
export type Context = z.infer<typeof ContextSchema>;

export const AgentErrorResponseMessageSchema = z.object({
    "meta": AgentResponseMetadataSchema,
    "payload": ErrorResponseMessagePayloadSchema,
    "type": ResponseMessageTypeSchema,
});
export type AgentErrorResponseMessage = z.infer<typeof AgentErrorResponseMessageSchema>;

export const AgentRequestMetadataSchema = z.object({
    "destination": z.union([BridgeParticipantIdentifierSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": z.union([SourceIdentifierSchema, z.null()]).optional(),
    "timestamp": z.coerce.date(),
});
export type AgentRequestMetadata = z.infer<typeof AgentRequestMetadataSchema>;

export const BridgeErrorResponseMessageMetaSchema = z.object({
    "errorDetails": z.array(ResponseErrorDetailSchema),
    "errorSources": z.array(DesktopAgentIdentifierSchema),
    "requestUuid": z.string(),
    "responseUuid": z.string(),
    "timestamp": z.coerce.date(),
});
export type BridgeErrorResponseMessageMeta = z.infer<typeof BridgeErrorResponseMessageMetaSchema>;

export const BridgeRequestMessageSchema = z.object({
    "meta": BridgeRequestMetadataSchema,
    "payload": z.record(z.string(), z.any()),
    "type": z.string(),
});
export type BridgeRequestMessage = z.infer<typeof BridgeRequestMessageSchema>;

export const BridgeResponseMessageSchema = z.object({
    "meta": BridgeResponseMessageMetaSchema,
    "payload": z.record(z.string(), z.any()),
    "type": z.string(),
});
export type BridgeResponseMessage = z.infer<typeof BridgeResponseMessageSchema>;

export const BroadcastAgentRequestMetaSchema = z.object({
    "requestUuid": z.string(),
    "source": SourceClassSchema,
    "timestamp": z.coerce.date(),
});
export type BroadcastAgentRequestMeta = z.infer<typeof BroadcastAgentRequestMetaSchema>;

export const BroadcastAgentRequestPayloadSchema = z.object({
    "channelId": z.string(),
    "context": ContextElementSchema,
});
export type BroadcastAgentRequestPayload = z.infer<typeof BroadcastAgentRequestPayloadSchema>;

export const BroadcastBridgeRequestMetaSchema = z.object({
    "requestUuid": z.string(),
    "source": MetaSourceSchema,
    "timestamp": z.coerce.date(),
});
export type BroadcastBridgeRequestMeta = z.infer<typeof BroadcastBridgeRequestMetaSchema>;

export const ConnectionStepMessageSchema = z.object({
    "meta": ConnectionStepMetadataSchema,
    "payload": z.record(z.string(), z.any()),
    "type": ConnectionStepMessageTypeSchema,
});
export type ConnectionStepMessage = z.infer<typeof ConnectionStepMessageSchema>;

export const ConnectionStep2HelloSchema = z.object({
    "meta": ConnectionStep2HelloMetaSchema,
    "payload": ConnectionStep2HelloPayloadSchema,
    "type": ConnectionStep2HelloTypeSchema,
});
export type ConnectionStep2Hello = z.infer<typeof ConnectionStep2HelloSchema>;

export const ConnectingAgentImplementationMetadataSchema = z.object({
    "fdc3Version": z.string(),
    "optionalFeatures": OptionalFeaturesSchema,
    "provider": z.string(),
    "providerVersion": z.union([z.null(), z.string()]).optional(),
});
export type ConnectingAgentImplementationMetadata = z.infer<typeof ConnectingAgentImplementationMetadataSchema>;

export const ConnectionStep4AuthenticationFailedSchema = z.object({
    "meta": ConnectionStep4AuthenticationFailedMetaSchema,
    "payload": ConnectionStep4AuthenticationFailedPayloadSchema,
    "type": ConnectionStep4AuthenticationFailedTypeSchema,
});
export type ConnectionStep4AuthenticationFailed = z.infer<typeof ConnectionStep4AuthenticationFailedSchema>;

export const ConnectionStep6ConnectedAgentsUpdatePayloadSchema = z.object({
    "addAgent": z.union([z.null(), z.string()]).optional(),
    "allAgents": z.array(DesktopAgentImplementationMetadataSchema),
    "channelsState": z.union([z.record(z.string(), z.array(ContextElementSchema)), z.null()]).optional(),
    "removeAgent": z.union([z.null(), z.string()]).optional(),
});
export type ConnectionStep6ConnectedAgentsUpdatePayload = z.infer<typeof ConnectionStep6ConnectedAgentsUpdatePayloadSchema>;

export const FindInstancesAgentErrorResponseSchema = z.object({
    "meta": FindInstancesAgentErrorResponseMetaSchema,
    "payload": FindInstancesAgentErrorResponsePayloadSchema,
    "type": FindInstancesAgentErrorResponseTypeSchema,
});
export type FindInstancesAgentErrorResponse = z.infer<typeof FindInstancesAgentErrorResponseSchema>;

export const FindInstancesAgentRequestMetaSchema = z.object({
    "destination": z.union([DestinationClassSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": z.union([SourceIdentifierSchema, z.null()]).optional(),
    "timestamp": z.coerce.date(),
});
export type FindInstancesAgentRequestMeta = z.infer<typeof FindInstancesAgentRequestMetaSchema>;

export const FindInstancesAgentRequestPayloadSchema = z.object({
    "app": AppIdentifierSchema,
});
export type FindInstancesAgentRequestPayload = z.infer<typeof FindInstancesAgentRequestPayloadSchema>;

export const AppMetadataSchema = z.object({
    "appId": z.string(),
    "description": z.union([z.null(), z.string()]).optional(),
    "desktopAgent": z.union([z.null(), z.string()]).optional(),
    "icons": z.union([z.array(IconSchema), z.null()]).optional(),
    "instanceId": z.union([z.null(), z.string()]).optional(),
    "instanceMetadata": z.union([z.record(z.string(), z.any()), z.null()]).optional(),
    "name": z.union([z.null(), z.string()]).optional(),
    "resultType": z.union([z.null(), z.string()]).optional(),
    "screenshots": z.union([z.array(ImageSchema), z.null()]).optional(),
    "title": z.union([z.null(), z.string()]).optional(),
    "tooltip": z.union([z.null(), z.string()]).optional(),
    "version": z.union([z.null(), z.string()]).optional(),
});
export type AppMetadata = z.infer<typeof AppMetadataSchema>;

export const FindInstancesBridgeErrorResponseSchema = z.object({
    "meta": FindInstancesBridgeErrorResponseMetaSchema,
    "payload": FindInstancesBridgeErrorResponsePayloadSchema,
    "type": FindInstancesAgentErrorResponseTypeSchema,
});
export type FindInstancesBridgeErrorResponse = z.infer<typeof FindInstancesBridgeErrorResponseSchema>;

export const FindInstancesBridgeRequestMetaSchema = z.object({
    "destination": z.union([DestinationClassSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": MetaSourceClassSchema,
    "timestamp": z.coerce.date(),
});
export type FindInstancesBridgeRequestMeta = z.infer<typeof FindInstancesBridgeRequestMetaSchema>;

export const FindInstancesBridgeResponsePayloadSchema = z.object({
    "appIdentifiers": z.array(AppMetadataSchema),
});
export type FindInstancesBridgeResponsePayload = z.infer<typeof FindInstancesBridgeResponsePayloadSchema>;

export const FindIntentAgentErrorResponseSchema = z.object({
    "meta": FindIntentAgentErrorResponseMetaSchema,
    "payload": FindIntentAgentErrorResponsePayloadSchema,
    "type": FindIntentAgentErrorResponseTypeSchema,
});
export type FindIntentAgentErrorResponse = z.infer<typeof FindIntentAgentErrorResponseSchema>;

export const FindIntentAgentRequestSchema = z.object({
    "meta": FindIntentAgentRequestMetaSchema,
    "payload": FindIntentAgentRequestPayloadSchema,
    "type": FindIntentAgentRequestTypeSchema,
});
export type FindIntentAgentRequest = z.infer<typeof FindIntentAgentRequestSchema>;

export const AppIntentSchema = z.object({
    "apps": z.array(AppMetadataSchema),
    "intent": IntentMetadataSchema,
});
export type AppIntent = z.infer<typeof AppIntentSchema>;

export const FindIntentBridgeErrorResponseSchema = z.object({
    "meta": FindIntentBridgeErrorResponseMetaSchema,
    "payload": FindIntentBridgeErrorResponsePayloadSchema,
    "type": FindIntentAgentErrorResponseTypeSchema,
});
export type FindIntentBridgeErrorResponse = z.infer<typeof FindIntentBridgeErrorResponseSchema>;

export const FindIntentBridgeRequestSchema = z.object({
    "meta": FindIntentBridgeRequestMetaSchema,
    "payload": FindIntentBridgeRequestPayloadSchema,
    "type": FindIntentAgentRequestTypeSchema,
});
export type FindIntentBridgeRequest = z.infer<typeof FindIntentBridgeRequestSchema>;

export const FindIntentBridgeResponsePayloadSchema = z.object({
    "appIntent": AppIntentSchema,
});
export type FindIntentBridgeResponsePayload = z.infer<typeof FindIntentBridgeResponsePayloadSchema>;

export const FindIntentsByContextAgentErrorResponseSchema = z.object({
    "meta": FindIntentsByContextAgentErrorResponseMetaSchema,
    "payload": FindIntentsByContextAgentErrorResponsePayloadSchema,
    "type": FindIntentsByContextAgentErrorResponseTypeSchema,
});
export type FindIntentsByContextAgentErrorResponse = z.infer<typeof FindIntentsByContextAgentErrorResponseSchema>;

export const FindIntentsByContextAgentRequestSchema = z.object({
    "meta": FindIntentsByContextAgentRequestMetaSchema,
    "payload": FindIntentsByContextAgentRequestPayloadSchema,
    "type": FindIntentsByContextAgentRequestTypeSchema,
});
export type FindIntentsByContextAgentRequest = z.infer<typeof FindIntentsByContextAgentRequestSchema>;

export const FindIntentsByContextAgentResponsePayloadSchema = z.object({
    "appIntents": z.array(AppIntentSchema),
});
export type FindIntentsByContextAgentResponsePayload = z.infer<typeof FindIntentsByContextAgentResponsePayloadSchema>;

export const FindIntentsByContextBridgeErrorResponseSchema = z.object({
    "meta": FindIntentsByContextBridgeErrorResponseMetaSchema,
    "payload": FindIntentsByContextBridgeErrorResponsePayloadSchema,
    "type": FindIntentsByContextAgentErrorResponseTypeSchema,
});
export type FindIntentsByContextBridgeErrorResponse = z.infer<typeof FindIntentsByContextBridgeErrorResponseSchema>;

export const FindIntentsByContextBridgeRequestSchema = z.object({
    "meta": FindIntentsByContextBridgeRequestMetaSchema,
    "payload": FindIntentsByContextBridgeRequestPayloadSchema,
    "type": FindIntentsByContextAgentRequestTypeSchema,
});
export type FindIntentsByContextBridgeRequest = z.infer<typeof FindIntentsByContextBridgeRequestSchema>;

export const FindIntentsByContextBridgeResponsePayloadSchema = z.object({
    "appIntents": z.array(AppIntentSchema),
});
export type FindIntentsByContextBridgeResponsePayload = z.infer<typeof FindIntentsByContextBridgeResponsePayloadSchema>;

export const GetAppMetadataAgentErrorResponseSchema = z.object({
    "meta": GetAppMetadataAgentErrorResponseMetaSchema,
    "payload": GetAppMetadataAgentErrorResponsePayloadSchema,
    "type": GetAppMetadataAgentErrorResponseTypeSchema,
});
export type GetAppMetadataAgentErrorResponse = z.infer<typeof GetAppMetadataAgentErrorResponseSchema>;

export const GetAppMetadataAgentRequestPayloadSchema = z.object({
    "app": AppDestinationIdentifierSchema,
});
export type GetAppMetadataAgentRequestPayload = z.infer<typeof GetAppMetadataAgentRequestPayloadSchema>;

export const GetAppMetadataAgentResponsePayloadSchema = z.object({
    "appMetadata": AppMetadataSchema,
});
export type GetAppMetadataAgentResponsePayload = z.infer<typeof GetAppMetadataAgentResponsePayloadSchema>;

export const GetAppMetadataBridgeErrorResponseSchema = z.object({
    "meta": GetAppMetadataBridgeErrorResponseMetaSchema,
    "payload": GetAppMetadataBridgeErrorResponsePayloadSchema,
    "type": GetAppMetadataAgentErrorResponseTypeSchema,
});
export type GetAppMetadataBridgeErrorResponse = z.infer<typeof GetAppMetadataBridgeErrorResponseSchema>;

export const GetAppMetadataBridgeRequestSchema = z.object({
    "meta": GetAppMetadataBridgeRequestMetaSchema,
    "payload": GetAppMetadataBridgeRequestPayloadSchema,
    "type": GetAppMetadataAgentRequestTypeSchema,
});
export type GetAppMetadataBridgeRequest = z.infer<typeof GetAppMetadataBridgeRequestSchema>;

export const GetAppMetadataBridgeResponsePayloadSchema = z.object({
    "appMetadata": AppMetadataSchema,
});
export type GetAppMetadataBridgeResponsePayload = z.infer<typeof GetAppMetadataBridgeResponsePayloadSchema>;

export const OpenAgentErrorResponseSchema = z.object({
    "meta": OpenAgentErrorResponseMetaSchema,
    "payload": OpenAgentErrorResponsePayloadSchema,
    "type": OpenAgentErrorResponseTypeSchema,
});
export type OpenAgentErrorResponse = z.infer<typeof OpenAgentErrorResponseSchema>;

export const OpenAgentRequestPayloadSchema = z.object({
    "app": AppToOpenSchema,
    "context": z.union([ContextElementSchema, z.null()]).optional(),
});
export type OpenAgentRequestPayload = z.infer<typeof OpenAgentRequestPayloadSchema>;

export const OpenAgentResponseSchema = z.object({
    "meta": OpenAgentResponseMetaSchema,
    "payload": OpenAgentResponsePayloadSchema,
    "type": OpenAgentErrorResponseTypeSchema,
});
export type OpenAgentResponse = z.infer<typeof OpenAgentResponseSchema>;

export const OpenBridgeErrorResponseSchema = z.object({
    "meta": OpenBridgeErrorResponseMetaSchema,
    "payload": OpenBridgeErrorResponsePayloadSchema,
    "type": OpenAgentErrorResponseTypeSchema,
});
export type OpenBridgeErrorResponse = z.infer<typeof OpenBridgeErrorResponseSchema>;

export const OpenBridgeRequestSchema = z.object({
    "meta": OpenBridgeRequestMetaSchema,
    "payload": OpenBridgeRequestPayloadSchema,
    "type": OpenAgentRequestTypeSchema,
});
export type OpenBridgeRequest = z.infer<typeof OpenBridgeRequestSchema>;

export const OpenBridgeResponseSchema = z.object({
    "meta": OpenBridgeResponseMetaSchema,
    "payload": OpenBridgeResponsePayloadSchema,
    "type": OpenAgentErrorResponseTypeSchema,
});
export type OpenBridgeResponse = z.infer<typeof OpenBridgeResponseSchema>;

export const PrivateChannelBroadcastAgentRequestMetaSchema = z.object({
    "destination": z.union([MetaDestinationSchema, z.null()]).optional(),
    "requestUuid": z.string(),
    "source": z.union([SourceClassSchema, z.null()]).optional(),
    "timestamp": z.coerce.date(),
});
export type PrivateChannelBroadcastAgentRequestMeta = z.infer<typeof PrivateChannelBroadcastAgentRequestMetaSchema>;

export const PrivateChannelBroadcastBridgeRequestSchema = z.object({
    "meta": PrivateChannelBroadcastBridgeRequestMetaSchema,
    "payload": PrivateChannelBroadcastBridgeRequestPayloadSchema,
    "type": PrivateChannelBroadcastAgentRequestTypeSchema,
});
export type PrivateChannelBroadcastBridgeRequest = z.infer<typeof PrivateChannelBroadcastBridgeRequestSchema>;

export const PrivateChannelEventListenerAddedAgentRequestSchema = z.object({
    "meta": PrivateChannelEventListenerAddedAgentRequestMetaSchema,
    "payload": PrivateChannelEventListenerAddedAgentRequestPayloadSchema,
    "type": PrivateChannelEventListenerAddedAgentRequestTypeSchema,
});
export type PrivateChannelEventListenerAddedAgentRequest = z.infer<typeof PrivateChannelEventListenerAddedAgentRequestSchema>;

export const PrivateChannelEventListenerAddedBridgeRequestSchema = z.object({
    "meta": PrivateChannelEventListenerAddedBridgeRequestMetaSchema,
    "payload": PrivateChannelEventListenerAddedBridgeRequestPayloadSchema,
    "type": PrivateChannelEventListenerAddedAgentRequestTypeSchema,
});
export type PrivateChannelEventListenerAddedBridgeRequest = z.infer<typeof PrivateChannelEventListenerAddedBridgeRequestSchema>;

export const PrivateChannelEventListenerRemovedAgentRequestSchema = z.object({
    "meta": PrivateChannelEventListenerRemovedAgentRequestMetaSchema,
    "payload": PrivateChannelEventListenerRemovedAgentRequestPayloadSchema,
    "type": PrivateChannelEventListenerRemovedAgentRequestTypeSchema,
});
export type PrivateChannelEventListenerRemovedAgentRequest = z.infer<typeof PrivateChannelEventListenerRemovedAgentRequestSchema>;

export const PrivateChannelEventListenerRemovedBridgeRequestSchema = z.object({
    "meta": PrivateChannelEventListenerRemovedBridgeRequestMetaSchema,
    "payload": PrivateChannelEventListenerRemovedBridgeRequestPayloadSchema,
    "type": PrivateChannelEventListenerRemovedAgentRequestTypeSchema,
});
export type PrivateChannelEventListenerRemovedBridgeRequest = z.infer<typeof PrivateChannelEventListenerRemovedBridgeRequestSchema>;

export const PrivateChannelOnAddContextListenerAgentRequestSchema = z.object({
    "meta": PrivateChannelOnAddContextListenerAgentRequestMetaSchema,
    "payload": PrivateChannelOnAddContextListenerAgentRequestPayloadSchema,
    "type": PrivateChannelOnAddContextListenerAgentRequestTypeSchema,
});
export type PrivateChannelOnAddContextListenerAgentRequest = z.infer<typeof PrivateChannelOnAddContextListenerAgentRequestSchema>;

export const PrivateChannelOnAddContextListenerBridgeRequestSchema = z.object({
    "meta": PrivateChannelOnAddContextListenerBridgeRequestMetaSchema,
    "payload": PrivateChannelOnAddContextListenerBridgeRequestPayloadSchema,
    "type": PrivateChannelOnAddContextListenerAgentRequestTypeSchema,
});
export type PrivateChannelOnAddContextListenerBridgeRequest = z.infer<typeof PrivateChannelOnAddContextListenerBridgeRequestSchema>;

export const PrivateChannelOnDisconnectAgentRequestSchema = z.object({
    "meta": PrivateChannelOnDisconnectAgentRequestMetaSchema,
    "payload": PrivateChannelOnDisconnectAgentRequestPayloadSchema,
    "type": PrivateChannelOnDisconnectAgentRequestTypeSchema,
});
export type PrivateChannelOnDisconnectAgentRequest = z.infer<typeof PrivateChannelOnDisconnectAgentRequestSchema>;

export const PrivateChannelOnDisconnectBridgeRequestSchema = z.object({
    "meta": PrivateChannelOnDisconnectBridgeRequestMetaSchema,
    "payload": PrivateChannelOnDisconnectBridgeRequestPayloadSchema,
    "type": PrivateChannelOnDisconnectAgentRequestTypeSchema,
});
export type PrivateChannelOnDisconnectBridgeRequest = z.infer<typeof PrivateChannelOnDisconnectBridgeRequestSchema>;

export const PrivateChannelOnUnsubscribeAgentRequestSchema = z.object({
    "meta": PrivateChannelOnUnsubscribeAgentRequestMetaSchema,
    "payload": PrivateChannelOnUnsubscribeAgentRequestPayloadSchema,
    "type": PrivateChannelOnUnsubscribeAgentRequestTypeSchema,
});
export type PrivateChannelOnUnsubscribeAgentRequest = z.infer<typeof PrivateChannelOnUnsubscribeAgentRequestSchema>;

export const PrivateChannelOnUnsubscribeBridgeRequestSchema = z.object({
    "meta": ERequestMetadataSchema,
    "payload": PrivateChannelOnUnsubscribeBridgeRequestPayloadSchema,
    "type": PrivateChannelOnUnsubscribeAgentRequestTypeSchema,
});
export type PrivateChannelOnUnsubscribeBridgeRequest = z.infer<typeof PrivateChannelOnUnsubscribeBridgeRequestSchema>;

export const RaiseIntentAgentErrorResponseSchema = z.object({
    "meta": RaiseIntentAgentErrorResponseMetaSchema,
    "payload": RaiseIntentAgentErrorResponsePayloadSchema,
    "type": RaiseIntentAgentErrorResponseTypeSchema,
});
export type RaiseIntentAgentErrorResponse = z.infer<typeof RaiseIntentAgentErrorResponseSchema>;

export const RaiseIntentAgentRequestSchema = z.object({
    "meta": RaiseIntentAgentRequestMetaSchema,
    "payload": RaiseIntentAgentRequestPayloadSchema,
    "type": RaiseIntentAgentRequestTypeSchema,
});
export type RaiseIntentAgentRequest = z.infer<typeof RaiseIntentAgentRequestSchema>;

export const RaiseIntentAgentResponsePayloadSchema = z.object({
    "intentResolution": IntentResolutionSchema,
});
export type RaiseIntentAgentResponsePayload = z.infer<typeof RaiseIntentAgentResponsePayloadSchema>;

export const RaiseIntentBridgeErrorResponseSchema = z.object({
    "meta": RaiseIntentBridgeErrorResponseMetaSchema,
    "payload": RaiseIntentBridgeErrorResponsePayloadSchema,
    "type": RaiseIntentAgentErrorResponseTypeSchema,
});
export type RaiseIntentBridgeErrorResponse = z.infer<typeof RaiseIntentBridgeErrorResponseSchema>;

export const RaiseIntentBridgeRequestSchema = z.object({
    "meta": RaiseIntentBridgeRequestMetaSchema,
    "payload": RaiseIntentBridgeRequestPayloadSchema,
    "type": RaiseIntentAgentRequestTypeSchema,
});
export type RaiseIntentBridgeRequest = z.infer<typeof RaiseIntentBridgeRequestSchema>;

export const RaiseIntentBridgeResponseSchema = z.object({
    "meta": RaiseIntentBridgeResponseMetaSchema,
    "payload": RaiseIntentBridgeResponsePayloadSchema,
    "type": RaiseIntentAgentErrorResponseTypeSchema,
});
export type RaiseIntentBridgeResponse = z.infer<typeof RaiseIntentBridgeResponseSchema>;

export const RaiseIntentResultAgentErrorResponseSchema = z.object({
    "meta": RaiseIntentResultAgentErrorResponseMetaSchema,
    "payload": RaiseIntentResultAgentErrorResponsePayloadSchema,
    "type": RaiseIntentResultAgentErrorResponseTypeSchema,
});
export type RaiseIntentResultAgentErrorResponse = z.infer<typeof RaiseIntentResultAgentErrorResponseSchema>;

export const ChannelSchema = z.object({
    "displayMetadata": z.union([DisplayMetadataSchema, z.null()]).optional(),
    "id": z.string(),
    "type": TypeSchema,
});
export type Channel = z.infer<typeof ChannelSchema>;

export const RaiseIntentResultBridgeErrorResponseSchema = z.object({
    "meta": RaiseIntentResultBridgeErrorResponseMetaSchema,
    "payload": RaiseIntentResultBridgeErrorResponsePayloadSchema,
    "type": RaiseIntentResultAgentErrorResponseTypeSchema,
});
export type RaiseIntentResultBridgeErrorResponse = z.infer<typeof RaiseIntentResultBridgeErrorResponseSchema>;

export const AgentRequestMessageSchema = z.object({
    "meta": AgentRequestMetadataSchema,
    "payload": z.record(z.string(), z.any()),
    "type": RequestMessageTypeSchema,
});
export type AgentRequestMessage = z.infer<typeof AgentRequestMessageSchema>;

export const BridgeErrorResponseMessageSchema = z.object({
    "meta": BridgeErrorResponseMessageMetaSchema,
    "payload": ResponseErrorMessagePayloadSchema,
    "type": z.string(),
});
export type BridgeErrorResponseMessage = z.infer<typeof BridgeErrorResponseMessageSchema>;

export const BroadcastAgentRequestSchema = z.object({
    "meta": BroadcastAgentRequestMetaSchema,
    "payload": BroadcastAgentRequestPayloadSchema,
    "type": BroadcastAgentRequestTypeSchema,
});
export type BroadcastAgentRequest = z.infer<typeof BroadcastAgentRequestSchema>;

export const BroadcastBridgeRequestSchema = z.object({
    "meta": BroadcastBridgeRequestMetaSchema,
    "payload": BroadcastBridgeRequestPayloadSchema,
    "type": BroadcastAgentRequestTypeSchema,
});
export type BroadcastBridgeRequest = z.infer<typeof BroadcastBridgeRequestSchema>;

export const ConnectionStep3HandshakePayloadSchema = z.object({
    "authToken": z.union([z.null(), z.string()]).optional(),
    "channelsState": z.record(z.string(), z.array(ContextElementSchema)),
    "implementationMetadata": ConnectingAgentImplementationMetadataSchema,
    "requestedName": z.string(),
});
export type ConnectionStep3HandshakePayload = z.infer<typeof ConnectionStep3HandshakePayloadSchema>;

export const ConnectionStep6ConnectedAgentsUpdateSchema = z.object({
    "meta": ConnectionStep6ConnectedAgentsUpdateMetaSchema,
    "payload": ConnectionStep6ConnectedAgentsUpdatePayloadSchema,
    "type": ConnectionStep6ConnectedAgentsUpdateTypeSchema,
});
export type ConnectionStep6ConnectedAgentsUpdate = z.infer<typeof ConnectionStep6ConnectedAgentsUpdateSchema>;

export const FindInstancesAgentRequestSchema = z.object({
    "meta": FindInstancesAgentRequestMetaSchema,
    "payload": FindInstancesAgentRequestPayloadSchema,
    "type": FindInstancesAgentRequestTypeSchema,
});
export type FindInstancesAgentRequest = z.infer<typeof FindInstancesAgentRequestSchema>;

export const FindInstancesAgentResponsePayloadSchema = z.object({
    "appIdentifiers": z.array(AppMetadataSchema),
});
export type FindInstancesAgentResponsePayload = z.infer<typeof FindInstancesAgentResponsePayloadSchema>;

export const FindInstancesBridgeRequestSchema = z.object({
    "meta": FindInstancesBridgeRequestMetaSchema,
    "payload": FindInstancesBridgeRequestPayloadSchema,
    "type": FindInstancesAgentRequestTypeSchema,
});
export type FindInstancesBridgeRequest = z.infer<typeof FindInstancesBridgeRequestSchema>;

export const FindInstancesBridgeResponseSchema = z.object({
    "meta": FindInstancesBridgeResponseMetaSchema,
    "payload": FindInstancesBridgeResponsePayloadSchema,
    "type": FindInstancesAgentErrorResponseTypeSchema,
});
export type FindInstancesBridgeResponse = z.infer<typeof FindInstancesBridgeResponseSchema>;

export const FindIntentAgentResponsePayloadSchema = z.object({
    "appIntent": AppIntentSchema,
});
export type FindIntentAgentResponsePayload = z.infer<typeof FindIntentAgentResponsePayloadSchema>;

export const FindIntentBridgeResponseSchema = z.object({
    "meta": FindIntentBridgeResponseMetaSchema,
    "payload": FindIntentBridgeResponsePayloadSchema,
    "type": FindIntentAgentErrorResponseTypeSchema,
});
export type FindIntentBridgeResponse = z.infer<typeof FindIntentBridgeResponseSchema>;

export const FindIntentsByContextAgentResponseSchema = z.object({
    "meta": FindIntentsByContextAgentResponseMetaSchema,
    "payload": FindIntentsByContextAgentResponsePayloadSchema,
    "type": FindIntentsByContextAgentErrorResponseTypeSchema,
});
export type FindIntentsByContextAgentResponse = z.infer<typeof FindIntentsByContextAgentResponseSchema>;

export const FindIntentsByContextBridgeResponseSchema = z.object({
    "meta": FindIntentsByContextBridgeResponseMetaSchema,
    "payload": FindIntentsByContextBridgeResponsePayloadSchema,
    "type": FindIntentsByContextAgentErrorResponseTypeSchema,
});
export type FindIntentsByContextBridgeResponse = z.infer<typeof FindIntentsByContextBridgeResponseSchema>;

export const GetAppMetadataAgentRequestSchema = z.object({
    "meta": GetAppMetadataAgentRequestMetaSchema,
    "payload": GetAppMetadataAgentRequestPayloadSchema,
    "type": GetAppMetadataAgentRequestTypeSchema,
});
export type GetAppMetadataAgentRequest = z.infer<typeof GetAppMetadataAgentRequestSchema>;

export const GetAppMetadataAgentResponseSchema = z.object({
    "meta": GetAppMetadataAgentResponseMetaSchema,
    "payload": GetAppMetadataAgentResponsePayloadSchema,
    "type": GetAppMetadataAgentErrorResponseTypeSchema,
});
export type GetAppMetadataAgentResponse = z.infer<typeof GetAppMetadataAgentResponseSchema>;

export const GetAppMetadataBridgeResponseSchema = z.object({
    "meta": GetAppMetadataBridgeResponseMetaSchema,
    "payload": GetAppMetadataBridgeResponsePayloadSchema,
    "type": GetAppMetadataAgentErrorResponseTypeSchema,
});
export type GetAppMetadataBridgeResponse = z.infer<typeof GetAppMetadataBridgeResponseSchema>;

export const OpenAgentRequestSchema = z.object({
    "meta": OpenAgentRequestMetaSchema,
    "payload": OpenAgentRequestPayloadSchema,
    "type": OpenAgentRequestTypeSchema,
});
export type OpenAgentRequest = z.infer<typeof OpenAgentRequestSchema>;

export const PrivateChannelBroadcastAgentRequestSchema = z.object({
    "meta": PrivateChannelBroadcastAgentRequestMetaSchema,
    "payload": PrivateChannelBroadcastAgentRequestPayloadSchema,
    "type": PrivateChannelBroadcastAgentRequestTypeSchema,
});
export type PrivateChannelBroadcastAgentRequest = z.infer<typeof PrivateChannelBroadcastAgentRequestSchema>;

export const RaiseIntentAgentResponseSchema = z.object({
    "meta": RaiseIntentAgentResponseMetaSchema,
    "payload": RaiseIntentAgentResponsePayloadSchema,
    "type": RaiseIntentAgentErrorResponseTypeSchema,
});
export type RaiseIntentAgentResponse = z.infer<typeof RaiseIntentAgentResponseSchema>;

export const IntentResultSchema = z.object({
    "context": z.union([ContextElementSchema, z.null()]).optional(),
    "channel": z.union([ChannelSchema, z.null()]).optional(),
});
export type IntentResult = z.infer<typeof IntentResultSchema>;

export const RaiseIntentResultBridgeResponsePayloadSchema = z.object({
    "intentResult": IntentResultSchema,
});
export type RaiseIntentResultBridgeResponsePayload = z.infer<typeof RaiseIntentResultBridgeResponsePayloadSchema>;

export const ConnectionStep3HandshakeSchema = z.object({
    "meta": ConnectionStep3HandshakeMetaSchema,
    "payload": ConnectionStep3HandshakePayloadSchema,
    "type": ConnectionStep3HandshakeTypeSchema,
});
export type ConnectionStep3Handshake = z.infer<typeof ConnectionStep3HandshakeSchema>;

export const FindInstancesAgentResponseSchema = z.object({
    "meta": FindInstancesAgentResponseMetaSchema,
    "payload": FindInstancesAgentResponsePayloadSchema,
    "type": FindInstancesAgentErrorResponseTypeSchema,
});
export type FindInstancesAgentResponse = z.infer<typeof FindInstancesAgentResponseSchema>;

export const FindIntentAgentResponseSchema = z.object({
    "meta": FindIntentAgentResponseMetaSchema,
    "payload": FindIntentAgentResponsePayloadSchema,
    "type": FindIntentAgentErrorResponseTypeSchema,
});
export type FindIntentAgentResponse = z.infer<typeof FindIntentAgentResponseSchema>;

export const RaiseIntentResultAgentResponsePayloadSchema = z.object({
    "intentResult": IntentResultSchema,
});
export type RaiseIntentResultAgentResponsePayload = z.infer<typeof RaiseIntentResultAgentResponsePayloadSchema>;

export const RaiseIntentResultBridgeResponseSchema = z.object({
    "meta": RaiseIntentResultBridgeResponseMetaSchema,
    "payload": RaiseIntentResultBridgeResponsePayloadSchema,
    "type": RaiseIntentResultAgentErrorResponseTypeSchema,
});
export type RaiseIntentResultBridgeResponse = z.infer<typeof RaiseIntentResultBridgeResponseSchema>;

export const RaiseIntentResultAgentResponseSchema = z.object({
    "meta": RaiseIntentResultAgentResponseMetaSchema,
    "payload": RaiseIntentResultAgentResponsePayloadSchema,
    "type": RaiseIntentResultAgentErrorResponseTypeSchema,
});
export type RaiseIntentResultAgentResponse = z.infer<typeof RaiseIntentResultAgentResponseSchema>;
