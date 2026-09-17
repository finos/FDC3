import type {
  AddContextListenerRequest,
  AddContextListenerResponse,
  AddEventListenerRequest,
  AddEventListenerResponse,
  AddIntentListenerRequest,
  AddIntentListenerResponse,
  AgentEventMessage,
  AgentResponseMessage,
  AppRequestMessage,
  BroadcastEvent,
  BroadcastRequest,
  BroadcastResponse,
  ChannelChangedEvent,
  ClearContextRequest,
  ClearContextResponse,
  CloseRequest,
  CloseResponse,
  ContextClearedEvent,
  ContextListenerUnsubscribeRequest,
  ContextListenerUnsubscribeResponse,
  CreatePrivateChannelRequest,
  CreatePrivateChannelResponse,
  EventListenerUnsubscribeRequest,
  EventListenerUnsubscribeResponse,
  Fdc3UserInterfaceChannelSelected,
  Fdc3UserInterfaceChannels,
  Fdc3UserInterfaceDrag,
  Fdc3UserInterfaceHandshake,
  Fdc3UserInterfaceHello,
  Fdc3UserInterfaceMessage,
  Fdc3UserInterfaceResolve,
  Fdc3UserInterfaceResolveAction,
  Fdc3UserInterfaceRestyle,
  FindInstancesRequest,
  FindInstancesResponse,
  FindIntentRequest,
  FindIntentResponse,
  FindIntentsByContextRequest,
  FindIntentsByContextResponse,
  GetAppMetadataRequest,
  GetAppMetadataResponse,
  GetCurrentChannelRequest,
  GetCurrentChannelResponse,
  GetCurrentContextRequest,
  GetCurrentContextResponse,
  GetInfoRequest,
  GetInfoResponse,
  GetOrCreateChannelRequest,
  GetOrCreateChannelResponse,
  GetUserChannelsRequest,
  GetUserChannelsResponse,
  HeartbeatAcknowledgementRequest,
  HeartbeatEvent,
  IntentEvent,
  IntentListenerUnsubscribeRequest,
  IntentListenerUnsubscribeResponse,
  IntentResultRequest,
  IntentResultResponse,
  JoinUserChannelRequest,
  JoinUserChannelResponse,
  LeaveCurrentChannelRequest,
  LeaveCurrentChannelResponse,
  OpenRequest,
  OpenResponse,
  PrivateChannelAddEventListenerRequest,
  PrivateChannelAddEventListenerResponse,
  PrivateChannelDisconnectRequest,
  PrivateChannelDisconnectResponse,
  PrivateChannelOnAddContextListenerEvent,
  PrivateChannelOnDisconnectEvent,
  PrivateChannelOnUnsubscribeEvent,
  PrivateChannelUnsubscribeEventListenerRequest,
  PrivateChannelUnsubscribeEventListenerResponse,
  RaiseIntentForContextRequest,
  RaiseIntentForContextResponse,
  RaiseIntentRequest,
  RaiseIntentResponse,
  RaiseIntentResultResponse,
  WebConnectionProtocol1Hello,
  WebConnectionProtocol2LoadURL,
  WebConnectionProtocol3Handshake,
  WebConnectionProtocol4ValidateAppIdentity,
  WebConnectionProtocol5ValidateAppIdentityFailedResponse,
  WebConnectionProtocol5ValidateAppIdentitySuccessResponse,
  WebConnectionProtocol6Goodbye,
  WebConnectionProtocolMessage,
} from './BrowserTypes.js';

/**
 * Runtime validation for the message types in ./BrowserTypes.js.
 *
 * Split out from the main generated file so that consumers who only need the message type
 * interfaces and the fast `is<X>` predicates (i.e. everyone using getAgent()) don't pull this
 * validation runtime into their bundles. See https://github.com/finos/FDC3/issues/1901.
 */

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

/**
 * Returns true if value is a valid ClearContextRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidClearContextRequest(value: any): value is ClearContextRequest {
  try {
    Convert.clearContextRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

/**
 * Returns true if value is a valid ClearContextResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidClearContextResponse(value: any): value is ClearContextResponse {
  try {
    Convert.clearContextResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

/**
 * Returns true if value is a valid CloseRequest. This checks the type against the json schema for the message and will be slower
 */
export function isValidCloseRequest(value: any): value is CloseRequest {
  try {
    Convert.closeRequestToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

/**
 * Returns true if value is a valid CloseResponse. This checks the type against the json schema for the message and will be slower
 */
export function isValidCloseResponse(value: any): value is CloseResponse {
  try {
    Convert.closeResponseToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
}

/**
 * Returns true if value is a valid ContextClearedEvent. This checks the type against the json schema for the message and will be slower
 */
export function isValidContextClearedEvent(value: any): value is ContextClearedEvent {
  try {
    Convert.contextClearedEventToJson(value);
    return true;
  } catch (_e: any) {
    return false;
  }
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

  public static toClearContextRequest(json: string): ClearContextRequest {
    return cast(JSON.parse(json), r('ClearContextRequest'));
  }

  public static clearContextRequestToJson(value: ClearContextRequest): string {
    return JSON.stringify(uncast(value, r('ClearContextRequest')), null, 2);
  }

  public static toClearContextResponse(json: string): ClearContextResponse {
    return cast(JSON.parse(json), r('ClearContextResponse'));
  }

  public static clearContextResponseToJson(value: ClearContextResponse): string {
    return JSON.stringify(uncast(value, r('ClearContextResponse')), null, 2);
  }

  public static toCloseRequest(json: string): CloseRequest {
    return cast(JSON.parse(json), r('CloseRequest'));
  }

  public static closeRequestToJson(value: CloseRequest): string {
    return JSON.stringify(uncast(value, r('CloseRequest')), null, 2);
  }

  public static toCloseResponse(json: string): CloseResponse {
    return cast(JSON.parse(json), r('CloseResponse'));
  }

  public static closeResponseToJson(value: CloseResponse): string {
    return JSON.stringify(uncast(value, r('CloseResponse')), null, 2);
  }

  public static toContextClearedEvent(json: string): ContextClearedEvent {
    return cast(JSON.parse(json), r('ContextClearedEvent'));
  }

  public static contextClearedEventToJson(value: ContextClearedEvent): string {
    return JSON.stringify(uncast(value, r('ContextClearedEvent')), null, 2);
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
    false
  ),
  WebConnectionProtocol2LoadURL: o(
    [
      { json: 'meta', js: 'meta', typ: r('WebConnectionProtocol1HelloMeta') },
      { json: 'payload', js: 'payload', typ: r('WebConnectionProtocol2LoadURLPayload') },
      { json: 'type', js: 'type', typ: r('WebConnectionProtocol2LoadURLType') },
    ],
    false
  ),
  WebConnectionProtocol2LoadURLPayload: o([{ json: 'iframeUrl', js: 'iframeUrl', typ: '' }], false),
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
      { json: 'contextType', js: 'contextType', typ: u(undefined, u(null, '')) },
      { json: 'contextTypes', js: 'contextTypes', typ: u(undefined, a('')) },
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
  AddEventListenerRequestPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: u(null, '') },
      { json: 'type', js: 'type', typ: u(r('FDC3EventType'), null) },
    ],
    false
  ),
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
  AddIntentListenerRequestPayload: o(
    [
      { json: 'contextTypes', js: 'contextTypes', typ: u(undefined, a('')) },
      { json: 'intent', js: 'intent', typ: '' },
    ],
    false
  ),
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
      { json: 'metadata', js: 'metadata', typ: r('ContextMetadata') },
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
  ContextMetadata: o(
    [
      { json: 'antiReplay', js: 'antiReplay', typ: u(undefined, r('AntiReplayClaims')) },
      { json: 'custom', js: 'custom', typ: u(undefined, m('any')) },
      { json: 'signature', js: 'signature', typ: u(undefined, r('DetachedSignature')) },
      { json: 'source', js: 'source', typ: r('AppIdentifier') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
      { json: 'traceId', js: 'traceId', typ: '' },
    ],
    false
  ),
  AntiReplayClaims: o(
    [
      { json: 'exp', js: 'exp', typ: 3.14 },
      { json: 'iat', js: 'iat', typ: 3.14 },
      { json: 'jti', js: 'jti', typ: '' },
    ],
    false
  ),
  DetachedSignature: o(
    [
      { json: 'protected', js: 'protected', typ: '' },
      { json: 'signature', js: 'signature', typ: '' },
    ],
    false
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
      { json: 'metadata', js: 'metadata', typ: u(undefined, r('AppProvidableContextMetadata')) },
    ],
    false
  ),
  AppProvidableContextMetadata: o(
    [
      { json: 'antiReplay', js: 'antiReplay', typ: u(undefined, r('AntiReplayClaims')) },
      { json: 'custom', js: 'custom', typ: u(undefined, m('any')) },
      { json: 'signature', js: 'signature', typ: u(undefined, r('DetachedSignature')) },
      { json: 'traceId', js: 'traceId', typ: u(undefined, '') },
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
      { json: 'newChannelId', js: 'newChannelId', typ: u(undefined, u(null, '')) },
      { json: 'currentChannelId', js: 'currentChannelId', typ: u(undefined, u(null, '')) },
    ],
    false
  ),
  ClearContextRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('ClearContextRequestPayload') },
      { json: 'type', js: 'type', typ: r('ClearContextRequestType') },
    ],
    false
  ),
  ClearContextRequestPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: '' },
      { json: 'contextType', js: 'contextType', typ: u(null, '') },
    ],
    false
  ),
  ClearContextResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('BroadcastResponseResponsePayload') },
      { json: 'type', js: 'type', typ: r('ClearContextResponseType') },
    ],
    false
  ),
  CloseRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('CloseRequestPayload') },
      { json: 'type', js: 'type', typ: r('CloseRequestType') },
    ],
    false
  ),
  CloseRequestPayload: o([], false),
  CloseResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AddContextListenerResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('CloseResponsePayload') },
      { json: 'type', js: 'type', typ: r('CloseResponseType') },
    ],
    false
  ),
  CloseResponsePayload: o([{ json: 'error', js: 'error', typ: u(undefined, r('TentacledError')) }], false),
  ContextClearedEvent: o(
    [
      { json: 'meta', js: 'meta', typ: r('BroadcastEventMeta') },
      { json: 'payload', js: 'payload', typ: r('ContextClearedEventPayload') },
      { json: 'type', js: 'type', typ: r('ContextClearedEventType') },
    ],
    false
  ),
  ContextClearedEventPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: u(null, '') },
      { json: 'contextType', js: 'contextType', typ: u(null, '') },
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
      { json: 'metadata', js: 'metadata', typ: u(undefined, u(r('ContextMetadata'), null)) },
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
      { json: 'metadata', js: 'metadata', typ: r('ContextMetadata') },
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
      { json: 'metadata', js: 'metadata', typ: u(undefined, r('AppProvidableContextMetadata')) },
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
      { json: 'metadata', js: 'metadata', typ: u(undefined, r('AppProvidableContextMetadata')) },
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
      { json: 'contextType', js: 'contextType', typ: u(undefined, u(null, '')) },
      { json: 'contextTypes', js: 'contextTypes', typ: u(undefined, a('')) },
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
      { json: 'contextType', js: 'contextType', typ: u(undefined, u(null, '')) },
      { json: 'contextTypes', js: 'contextTypes', typ: u(undefined, a('')) },
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
      { json: 'metadata', js: 'metadata', typ: u(undefined, r('AppProvidableContextMetadata')) },
      { json: 'newInstance', js: 'newInstance', typ: u(undefined, true) },
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
      { json: 'metadata', js: 'metadata', typ: u(undefined, r('AppProvidableContextMetadata')) },
      { json: 'newInstance', js: 'newInstance', typ: u(undefined, true) },
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
      { json: 'resultMetadata', js: 'resultMetadata', typ: u(undefined, r('ContextMetadata')) },
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
  PurpleError: [
    'ApiTimeout',
    'AccessDenied',
    'CreationFailed',
    'InvalidArguments',
    'MalformedContext',
    'NoChannelFound',
  ],
  AddContextListenerResponseType: ['addContextListenerResponse'],
  FDC3EventType: ['CONTEXT_CLEARED', 'USER_CHANNEL_CHANGED'],
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
    'IntentListenerConflict',
    'InvalidArguments',
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
    'IntentListenerConflict',
    'InvalidArguments',
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
    'contextClearedEvent',
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
    'clearContextResponse',
    'closeResponse',
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
    'clearContextRequest',
    'closeRequest',
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
  ChannelChangedEventType: ['channelChangedEvent'],
  ClearContextRequestType: ['clearContextRequest'],
  ClearContextResponseType: ['clearContextResponse'],
  CloseRequestType: ['closeRequest'],
  TentacledError: ['ApiTimeout'],
  CloseResponseType: ['closeResponse'],
  ContextClearedEventType: ['contextClearedEvent'],
  ContextListenerUnsubscribeRequestType: ['contextListenerUnsubscribeRequest'],
  ContextListenerUnsubscribeResponseType: ['contextListenerUnsubscribeResponse'],
  CreatePrivateChannelRequestType: ['createPrivateChannelRequest'],
  Type: ['app', 'private', 'user'],
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
    'IntentListenerConflict',
    'InvalidArguments',
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
    'InvalidArguments',
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
