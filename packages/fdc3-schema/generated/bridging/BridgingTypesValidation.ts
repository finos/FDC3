import type {
  AgentErrorResponseMessage,
  AgentRequestMessage,
  AgentResponseMessage,
  BridgeErrorResponseMessage,
  BridgeRequestMessage,
  BridgeResponseMessage,
  BroadcastAgentRequest,
  BroadcastBridgeRequest,
  ConnectionStep2Hello,
  ConnectionStep3Handshake,
  ConnectionStep4AuthenticationFailed,
  ConnectionStep6ConnectedAgentsUpdate,
  ConnectionStepMessage,
  FindInstancesAgentErrorResponse,
  FindInstancesAgentRequest,
  FindInstancesAgentResponse,
  FindInstancesBridgeErrorResponse,
  FindInstancesBridgeRequest,
  FindInstancesBridgeResponse,
  FindIntentAgentErrorResponse,
  FindIntentAgentRequest,
  FindIntentAgentResponse,
  FindIntentBridgeErrorResponse,
  FindIntentBridgeRequest,
  FindIntentBridgeResponse,
  FindIntentsByContextAgentErrorResponse,
  FindIntentsByContextAgentRequest,
  FindIntentsByContextAgentResponse,
  FindIntentsByContextBridgeErrorResponse,
  FindIntentsByContextBridgeRequest,
  FindIntentsByContextBridgeResponse,
  GetAppMetadataAgentErrorResponse,
  GetAppMetadataAgentRequest,
  GetAppMetadataAgentResponse,
  GetAppMetadataBridgeErrorResponse,
  GetAppMetadataBridgeRequest,
  GetAppMetadataBridgeResponse,
  OpenAgentErrorResponse,
  OpenAgentRequest,
  OpenAgentResponse,
  OpenBridgeErrorResponse,
  OpenBridgeRequest,
  OpenBridgeResponse,
  PrivateChannelBroadcastAgentRequest,
  PrivateChannelBroadcastBridgeRequest,
  PrivateChannelEventListenerAddedAgentRequest,
  PrivateChannelEventListenerAddedBridgeRequest,
  PrivateChannelEventListenerRemovedAgentRequest,
  PrivateChannelEventListenerRemovedBridgeRequest,
  PrivateChannelOnAddContextListenerAgentRequest,
  PrivateChannelOnAddContextListenerBridgeRequest,
  PrivateChannelOnDisconnectAgentRequest,
  PrivateChannelOnDisconnectBridgeRequest,
  PrivateChannelOnUnsubscribeAgentRequest,
  PrivateChannelOnUnsubscribeBridgeRequest,
  RaiseIntentAgentErrorResponse,
  RaiseIntentAgentRequest,
  RaiseIntentAgentResponse,
  RaiseIntentBridgeErrorResponse,
  RaiseIntentBridgeRequest,
  RaiseIntentBridgeResponse,
  RaiseIntentResultAgentErrorResponse,
  RaiseIntentResultAgentResponse,
  RaiseIntentResultBridgeErrorResponse,
  RaiseIntentResultBridgeResponse,
} from './BridgingTypes.js';

/**
 * Runtime validation for the message types in ./BridgingTypes.js.
 *
 * Split out from the main generated file so that consumers who only need the message type
 * interfaces and the fast `is<X>` predicates (i.e. everyone using getAgent()) don't pull this
 * validation runtime into their bundles. See https://github.com/finos/FDC3/issues/1901.
 */
export class Convert {
  public static toAgentErrorResponseMessage(json: string): AgentErrorResponseMessage {
    return cast(JSON.parse(json), r('AgentErrorResponseMessage'));
  }

  public static agentErrorResponseMessageToJson(value: AgentErrorResponseMessage): string {
    return JSON.stringify(uncast(value, r('AgentErrorResponseMessage')), null, 2);
  }

  public static toAgentRequestMessage(json: string): AgentRequestMessage {
    return cast(JSON.parse(json), r('AgentRequestMessage'));
  }

  public static agentRequestMessageToJson(value: AgentRequestMessage): string {
    return JSON.stringify(uncast(value, r('AgentRequestMessage')), null, 2);
  }

  public static toAgentResponseMessage(json: string): AgentResponseMessage {
    return cast(JSON.parse(json), r('AgentResponseMessage'));
  }

  public static agentResponseMessageToJson(value: AgentResponseMessage): string {
    return JSON.stringify(uncast(value, r('AgentResponseMessage')), null, 2);
  }

  public static toBridgeErrorResponseMessage(json: string): BridgeErrorResponseMessage {
    return cast(JSON.parse(json), r('BridgeErrorResponseMessage'));
  }

  public static bridgeErrorResponseMessageToJson(value: BridgeErrorResponseMessage): string {
    return JSON.stringify(uncast(value, r('BridgeErrorResponseMessage')), null, 2);
  }

  public static toBridgeRequestMessage(json: string): BridgeRequestMessage {
    return cast(JSON.parse(json), r('BridgeRequestMessage'));
  }

  public static bridgeRequestMessageToJson(value: BridgeRequestMessage): string {
    return JSON.stringify(uncast(value, r('BridgeRequestMessage')), null, 2);
  }

  public static toBridgeResponseMessage(json: string): BridgeResponseMessage {
    return cast(JSON.parse(json), r('BridgeResponseMessage'));
  }

  public static bridgeResponseMessageToJson(value: BridgeResponseMessage): string {
    return JSON.stringify(uncast(value, r('BridgeResponseMessage')), null, 2);
  }

  public static toBroadcastAgentRequest(json: string): BroadcastAgentRequest {
    return cast(JSON.parse(json), r('BroadcastAgentRequest'));
  }

  public static broadcastAgentRequestToJson(value: BroadcastAgentRequest): string {
    return JSON.stringify(uncast(value, r('BroadcastAgentRequest')), null, 2);
  }

  public static toBroadcastBridgeRequest(json: string): BroadcastBridgeRequest {
    return cast(JSON.parse(json), r('BroadcastBridgeRequest'));
  }

  public static broadcastBridgeRequestToJson(value: BroadcastBridgeRequest): string {
    return JSON.stringify(uncast(value, r('BroadcastBridgeRequest')), null, 2);
  }

  public static toBridgeCommonDefinitions(json: string): { [key: string]: any } {
    return cast(JSON.parse(json), m('any'));
  }

  public static bridgeCommonDefinitionsToJson(value: { [key: string]: any }): string {
    return JSON.stringify(uncast(value, m('any')), null, 2);
  }

  public static toConnectionStepMessage(json: string): ConnectionStepMessage {
    return cast(JSON.parse(json), r('ConnectionStepMessage'));
  }

  public static connectionStepMessageToJson(value: ConnectionStepMessage): string {
    return JSON.stringify(uncast(value, r('ConnectionStepMessage')), null, 2);
  }

  public static toConnectionStep2Hello(json: string): ConnectionStep2Hello {
    return cast(JSON.parse(json), r('ConnectionStep2Hello'));
  }

  public static connectionStep2HelloToJson(value: ConnectionStep2Hello): string {
    return JSON.stringify(uncast(value, r('ConnectionStep2Hello')), null, 2);
  }

  public static toConnectionStep3Handshake(json: string): ConnectionStep3Handshake {
    return cast(JSON.parse(json), r('ConnectionStep3Handshake'));
  }

  public static connectionStep3HandshakeToJson(value: ConnectionStep3Handshake): string {
    return JSON.stringify(uncast(value, r('ConnectionStep3Handshake')), null, 2);
  }

  public static toConnectionStep4AuthenticationFailed(json: string): ConnectionStep4AuthenticationFailed {
    return cast(JSON.parse(json), r('ConnectionStep4AuthenticationFailed'));
  }

  public static connectionStep4AuthenticationFailedToJson(value: ConnectionStep4AuthenticationFailed): string {
    return JSON.stringify(uncast(value, r('ConnectionStep4AuthenticationFailed')), null, 2);
  }

  public static toConnectionStep6ConnectedAgentsUpdate(json: string): ConnectionStep6ConnectedAgentsUpdate {
    return cast(JSON.parse(json), r('ConnectionStep6ConnectedAgentsUpdate'));
  }

  public static connectionStep6ConnectedAgentsUpdateToJson(value: ConnectionStep6ConnectedAgentsUpdate): string {
    return JSON.stringify(uncast(value, r('ConnectionStep6ConnectedAgentsUpdate')), null, 2);
  }

  public static toFindInstancesAgentErrorResponse(json: string): FindInstancesAgentErrorResponse {
    return cast(JSON.parse(json), r('FindInstancesAgentErrorResponse'));
  }

  public static findInstancesAgentErrorResponseToJson(value: FindInstancesAgentErrorResponse): string {
    return JSON.stringify(uncast(value, r('FindInstancesAgentErrorResponse')), null, 2);
  }

  public static toFindInstancesAgentRequest(json: string): FindInstancesAgentRequest {
    return cast(JSON.parse(json), r('FindInstancesAgentRequest'));
  }

  public static findInstancesAgentRequestToJson(value: FindInstancesAgentRequest): string {
    return JSON.stringify(uncast(value, r('FindInstancesAgentRequest')), null, 2);
  }

  public static toFindInstancesAgentResponse(json: string): FindInstancesAgentResponse {
    return cast(JSON.parse(json), r('FindInstancesAgentResponse'));
  }

  public static findInstancesAgentResponseToJson(value: FindInstancesAgentResponse): string {
    return JSON.stringify(uncast(value, r('FindInstancesAgentResponse')), null, 2);
  }

  public static toFindInstancesBridgeErrorResponse(json: string): FindInstancesBridgeErrorResponse {
    return cast(JSON.parse(json), r('FindInstancesBridgeErrorResponse'));
  }

  public static findInstancesBridgeErrorResponseToJson(value: FindInstancesBridgeErrorResponse): string {
    return JSON.stringify(uncast(value, r('FindInstancesBridgeErrorResponse')), null, 2);
  }

  public static toFindInstancesBridgeRequest(json: string): FindInstancesBridgeRequest {
    return cast(JSON.parse(json), r('FindInstancesBridgeRequest'));
  }

  public static findInstancesBridgeRequestToJson(value: FindInstancesBridgeRequest): string {
    return JSON.stringify(uncast(value, r('FindInstancesBridgeRequest')), null, 2);
  }

  public static toFindInstancesBridgeResponse(json: string): FindInstancesBridgeResponse {
    return cast(JSON.parse(json), r('FindInstancesBridgeResponse'));
  }

  public static findInstancesBridgeResponseToJson(value: FindInstancesBridgeResponse): string {
    return JSON.stringify(uncast(value, r('FindInstancesBridgeResponse')), null, 2);
  }

  public static toFindIntentAgentErrorResponse(json: string): FindIntentAgentErrorResponse {
    return cast(JSON.parse(json), r('FindIntentAgentErrorResponse'));
  }

  public static findIntentAgentErrorResponseToJson(value: FindIntentAgentErrorResponse): string {
    return JSON.stringify(uncast(value, r('FindIntentAgentErrorResponse')), null, 2);
  }

  public static toFindIntentAgentRequest(json: string): FindIntentAgentRequest {
    return cast(JSON.parse(json), r('FindIntentAgentRequest'));
  }

  public static findIntentAgentRequestToJson(value: FindIntentAgentRequest): string {
    return JSON.stringify(uncast(value, r('FindIntentAgentRequest')), null, 2);
  }

  public static toFindIntentAgentResponse(json: string): FindIntentAgentResponse {
    return cast(JSON.parse(json), r('FindIntentAgentResponse'));
  }

  public static findIntentAgentResponseToJson(value: FindIntentAgentResponse): string {
    return JSON.stringify(uncast(value, r('FindIntentAgentResponse')), null, 2);
  }

  public static toFindIntentBridgeErrorResponse(json: string): FindIntentBridgeErrorResponse {
    return cast(JSON.parse(json), r('FindIntentBridgeErrorResponse'));
  }

  public static findIntentBridgeErrorResponseToJson(value: FindIntentBridgeErrorResponse): string {
    return JSON.stringify(uncast(value, r('FindIntentBridgeErrorResponse')), null, 2);
  }

  public static toFindIntentBridgeRequest(json: string): FindIntentBridgeRequest {
    return cast(JSON.parse(json), r('FindIntentBridgeRequest'));
  }

  public static findIntentBridgeRequestToJson(value: FindIntentBridgeRequest): string {
    return JSON.stringify(uncast(value, r('FindIntentBridgeRequest')), null, 2);
  }

  public static toFindIntentBridgeResponse(json: string): FindIntentBridgeResponse {
    return cast(JSON.parse(json), r('FindIntentBridgeResponse'));
  }

  public static findIntentBridgeResponseToJson(value: FindIntentBridgeResponse): string {
    return JSON.stringify(uncast(value, r('FindIntentBridgeResponse')), null, 2);
  }

  public static toFindIntentsByContextAgentErrorResponse(json: string): FindIntentsByContextAgentErrorResponse {
    return cast(JSON.parse(json), r('FindIntentsByContextAgentErrorResponse'));
  }

  public static findIntentsByContextAgentErrorResponseToJson(value: FindIntentsByContextAgentErrorResponse): string {
    return JSON.stringify(uncast(value, r('FindIntentsByContextAgentErrorResponse')), null, 2);
  }

  public static toFindIntentsByContextAgentRequest(json: string): FindIntentsByContextAgentRequest {
    return cast(JSON.parse(json), r('FindIntentsByContextAgentRequest'));
  }

  public static findIntentsByContextAgentRequestToJson(value: FindIntentsByContextAgentRequest): string {
    return JSON.stringify(uncast(value, r('FindIntentsByContextAgentRequest')), null, 2);
  }

  public static toFindIntentsByContextAgentResponse(json: string): FindIntentsByContextAgentResponse {
    return cast(JSON.parse(json), r('FindIntentsByContextAgentResponse'));
  }

  public static findIntentsByContextAgentResponseToJson(value: FindIntentsByContextAgentResponse): string {
    return JSON.stringify(uncast(value, r('FindIntentsByContextAgentResponse')), null, 2);
  }

  public static toFindIntentsByContextBridgeErrorResponse(json: string): FindIntentsByContextBridgeErrorResponse {
    return cast(JSON.parse(json), r('FindIntentsByContextBridgeErrorResponse'));
  }

  public static findIntentsByContextBridgeErrorResponseToJson(value: FindIntentsByContextBridgeErrorResponse): string {
    return JSON.stringify(uncast(value, r('FindIntentsByContextBridgeErrorResponse')), null, 2);
  }

  public static toFindIntentsByContextBridgeRequest(json: string): FindIntentsByContextBridgeRequest {
    return cast(JSON.parse(json), r('FindIntentsByContextBridgeRequest'));
  }

  public static findIntentsByContextBridgeRequestToJson(value: FindIntentsByContextBridgeRequest): string {
    return JSON.stringify(uncast(value, r('FindIntentsByContextBridgeRequest')), null, 2);
  }

  public static toFindIntentsByContextBridgeResponse(json: string): FindIntentsByContextBridgeResponse {
    return cast(JSON.parse(json), r('FindIntentsByContextBridgeResponse'));
  }

  public static findIntentsByContextBridgeResponseToJson(value: FindIntentsByContextBridgeResponse): string {
    return JSON.stringify(uncast(value, r('FindIntentsByContextBridgeResponse')), null, 2);
  }

  public static toGetAppMetadataAgentErrorResponse(json: string): GetAppMetadataAgentErrorResponse {
    return cast(JSON.parse(json), r('GetAppMetadataAgentErrorResponse'));
  }

  public static getAppMetadataAgentErrorResponseToJson(value: GetAppMetadataAgentErrorResponse): string {
    return JSON.stringify(uncast(value, r('GetAppMetadataAgentErrorResponse')), null, 2);
  }

  public static toGetAppMetadataAgentRequest(json: string): GetAppMetadataAgentRequest {
    return cast(JSON.parse(json), r('GetAppMetadataAgentRequest'));
  }

  public static getAppMetadataAgentRequestToJson(value: GetAppMetadataAgentRequest): string {
    return JSON.stringify(uncast(value, r('GetAppMetadataAgentRequest')), null, 2);
  }

  public static toGetAppMetadataAgentResponse(json: string): GetAppMetadataAgentResponse {
    return cast(JSON.parse(json), r('GetAppMetadataAgentResponse'));
  }

  public static getAppMetadataAgentResponseToJson(value: GetAppMetadataAgentResponse): string {
    return JSON.stringify(uncast(value, r('GetAppMetadataAgentResponse')), null, 2);
  }

  public static toGetAppMetadataBridgeErrorResponse(json: string): GetAppMetadataBridgeErrorResponse {
    return cast(JSON.parse(json), r('GetAppMetadataBridgeErrorResponse'));
  }

  public static getAppMetadataBridgeErrorResponseToJson(value: GetAppMetadataBridgeErrorResponse): string {
    return JSON.stringify(uncast(value, r('GetAppMetadataBridgeErrorResponse')), null, 2);
  }

  public static toGetAppMetadataBridgeRequest(json: string): GetAppMetadataBridgeRequest {
    return cast(JSON.parse(json), r('GetAppMetadataBridgeRequest'));
  }

  public static getAppMetadataBridgeRequestToJson(value: GetAppMetadataBridgeRequest): string {
    return JSON.stringify(uncast(value, r('GetAppMetadataBridgeRequest')), null, 2);
  }

  public static toGetAppMetadataBridgeResponse(json: string): GetAppMetadataBridgeResponse {
    return cast(JSON.parse(json), r('GetAppMetadataBridgeResponse'));
  }

  public static getAppMetadataBridgeResponseToJson(value: GetAppMetadataBridgeResponse): string {
    return JSON.stringify(uncast(value, r('GetAppMetadataBridgeResponse')), null, 2);
  }

  public static toOpenAgentErrorResponse(json: string): OpenAgentErrorResponse {
    return cast(JSON.parse(json), r('OpenAgentErrorResponse'));
  }

  public static openAgentErrorResponseToJson(value: OpenAgentErrorResponse): string {
    return JSON.stringify(uncast(value, r('OpenAgentErrorResponse')), null, 2);
  }

  public static toOpenAgentRequest(json: string): OpenAgentRequest {
    return cast(JSON.parse(json), r('OpenAgentRequest'));
  }

  public static openAgentRequestToJson(value: OpenAgentRequest): string {
    return JSON.stringify(uncast(value, r('OpenAgentRequest')), null, 2);
  }

  public static toOpenAgentResponse(json: string): OpenAgentResponse {
    return cast(JSON.parse(json), r('OpenAgentResponse'));
  }

  public static openAgentResponseToJson(value: OpenAgentResponse): string {
    return JSON.stringify(uncast(value, r('OpenAgentResponse')), null, 2);
  }

  public static toOpenBridgeErrorResponse(json: string): OpenBridgeErrorResponse {
    return cast(JSON.parse(json), r('OpenBridgeErrorResponse'));
  }

  public static openBridgeErrorResponseToJson(value: OpenBridgeErrorResponse): string {
    return JSON.stringify(uncast(value, r('OpenBridgeErrorResponse')), null, 2);
  }

  public static toOpenBridgeRequest(json: string): OpenBridgeRequest {
    return cast(JSON.parse(json), r('OpenBridgeRequest'));
  }

  public static openBridgeRequestToJson(value: OpenBridgeRequest): string {
    return JSON.stringify(uncast(value, r('OpenBridgeRequest')), null, 2);
  }

  public static toOpenBridgeResponse(json: string): OpenBridgeResponse {
    return cast(JSON.parse(json), r('OpenBridgeResponse'));
  }

  public static openBridgeResponseToJson(value: OpenBridgeResponse): string {
    return JSON.stringify(uncast(value, r('OpenBridgeResponse')), null, 2);
  }

  public static toPrivateChannelBroadcastAgentRequest(json: string): PrivateChannelBroadcastAgentRequest {
    return cast(JSON.parse(json), r('PrivateChannelBroadcastAgentRequest'));
  }

  public static privateChannelBroadcastAgentRequestToJson(value: PrivateChannelBroadcastAgentRequest): string {
    return JSON.stringify(uncast(value, r('PrivateChannelBroadcastAgentRequest')), null, 2);
  }

  public static toPrivateChannelBroadcastBridgeRequest(json: string): PrivateChannelBroadcastBridgeRequest {
    return cast(JSON.parse(json), r('PrivateChannelBroadcastBridgeRequest'));
  }

  public static privateChannelBroadcastBridgeRequestToJson(value: PrivateChannelBroadcastBridgeRequest): string {
    return JSON.stringify(uncast(value, r('PrivateChannelBroadcastBridgeRequest')), null, 2);
  }

  public static toPrivateChannelEventListenerAddedAgentRequest(
    json: string
  ): PrivateChannelEventListenerAddedAgentRequest {
    return cast(JSON.parse(json), r('PrivateChannelEventListenerAddedAgentRequest'));
  }

  public static privateChannelEventListenerAddedAgentRequestToJson(
    value: PrivateChannelEventListenerAddedAgentRequest
  ): string {
    return JSON.stringify(uncast(value, r('PrivateChannelEventListenerAddedAgentRequest')), null, 2);
  }

  public static toPrivateChannelEventListenerAddedBridgeRequest(
    json: string
  ): PrivateChannelEventListenerAddedBridgeRequest {
    return cast(JSON.parse(json), r('PrivateChannelEventListenerAddedBridgeRequest'));
  }

  public static privateChannelEventListenerAddedBridgeRequestToJson(
    value: PrivateChannelEventListenerAddedBridgeRequest
  ): string {
    return JSON.stringify(uncast(value, r('PrivateChannelEventListenerAddedBridgeRequest')), null, 2);
  }

  public static toPrivateChannelEventListenerRemovedAgentRequest(
    json: string
  ): PrivateChannelEventListenerRemovedAgentRequest {
    return cast(JSON.parse(json), r('PrivateChannelEventListenerRemovedAgentRequest'));
  }

  public static privateChannelEventListenerRemovedAgentRequestToJson(
    value: PrivateChannelEventListenerRemovedAgentRequest
  ): string {
    return JSON.stringify(uncast(value, r('PrivateChannelEventListenerRemovedAgentRequest')), null, 2);
  }

  public static toPrivateChannelEventListenerRemovedBridgeRequest(
    json: string
  ): PrivateChannelEventListenerRemovedBridgeRequest {
    return cast(JSON.parse(json), r('PrivateChannelEventListenerRemovedBridgeRequest'));
  }

  public static privateChannelEventListenerRemovedBridgeRequestToJson(
    value: PrivateChannelEventListenerRemovedBridgeRequest
  ): string {
    return JSON.stringify(uncast(value, r('PrivateChannelEventListenerRemovedBridgeRequest')), null, 2);
  }

  public static toPrivateChannelOnAddContextListenerAgentRequest(
    json: string
  ): PrivateChannelOnAddContextListenerAgentRequest {
    return cast(JSON.parse(json), r('PrivateChannelOnAddContextListenerAgentRequest'));
  }

  public static privateChannelOnAddContextListenerAgentRequestToJson(
    value: PrivateChannelOnAddContextListenerAgentRequest
  ): string {
    return JSON.stringify(uncast(value, r('PrivateChannelOnAddContextListenerAgentRequest')), null, 2);
  }

  public static toPrivateChannelOnAddContextListenerBridgeRequest(
    json: string
  ): PrivateChannelOnAddContextListenerBridgeRequest {
    return cast(JSON.parse(json), r('PrivateChannelOnAddContextListenerBridgeRequest'));
  }

  public static privateChannelOnAddContextListenerBridgeRequestToJson(
    value: PrivateChannelOnAddContextListenerBridgeRequest
  ): string {
    return JSON.stringify(uncast(value, r('PrivateChannelOnAddContextListenerBridgeRequest')), null, 2);
  }

  public static toPrivateChannelOnDisconnectAgentRequest(json: string): PrivateChannelOnDisconnectAgentRequest {
    return cast(JSON.parse(json), r('PrivateChannelOnDisconnectAgentRequest'));
  }

  public static privateChannelOnDisconnectAgentRequestToJson(value: PrivateChannelOnDisconnectAgentRequest): string {
    return JSON.stringify(uncast(value, r('PrivateChannelOnDisconnectAgentRequest')), null, 2);
  }

  public static toPrivateChannelOnDisconnectBridgeRequest(json: string): PrivateChannelOnDisconnectBridgeRequest {
    return cast(JSON.parse(json), r('PrivateChannelOnDisconnectBridgeRequest'));
  }

  public static privateChannelOnDisconnectBridgeRequestToJson(value: PrivateChannelOnDisconnectBridgeRequest): string {
    return JSON.stringify(uncast(value, r('PrivateChannelOnDisconnectBridgeRequest')), null, 2);
  }

  public static toPrivateChannelOnUnsubscribeAgentRequest(json: string): PrivateChannelOnUnsubscribeAgentRequest {
    return cast(JSON.parse(json), r('PrivateChannelOnUnsubscribeAgentRequest'));
  }

  public static privateChannelOnUnsubscribeAgentRequestToJson(value: PrivateChannelOnUnsubscribeAgentRequest): string {
    return JSON.stringify(uncast(value, r('PrivateChannelOnUnsubscribeAgentRequest')), null, 2);
  }

  public static toPrivateChannelOnUnsubscribeBridgeRequest(json: string): PrivateChannelOnUnsubscribeBridgeRequest {
    return cast(JSON.parse(json), r('PrivateChannelOnUnsubscribeBridgeRequest'));
  }

  public static privateChannelOnUnsubscribeBridgeRequestToJson(
    value: PrivateChannelOnUnsubscribeBridgeRequest
  ): string {
    return JSON.stringify(uncast(value, r('PrivateChannelOnUnsubscribeBridgeRequest')), null, 2);
  }

  public static toRaiseIntentAgentErrorResponse(json: string): RaiseIntentAgentErrorResponse {
    return cast(JSON.parse(json), r('RaiseIntentAgentErrorResponse'));
  }

  public static raiseIntentAgentErrorResponseToJson(value: RaiseIntentAgentErrorResponse): string {
    return JSON.stringify(uncast(value, r('RaiseIntentAgentErrorResponse')), null, 2);
  }

  public static toRaiseIntentAgentRequest(json: string): RaiseIntentAgentRequest {
    return cast(JSON.parse(json), r('RaiseIntentAgentRequest'));
  }

  public static raiseIntentAgentRequestToJson(value: RaiseIntentAgentRequest): string {
    return JSON.stringify(uncast(value, r('RaiseIntentAgentRequest')), null, 2);
  }

  public static toRaiseIntentAgentResponse(json: string): RaiseIntentAgentResponse {
    return cast(JSON.parse(json), r('RaiseIntentAgentResponse'));
  }

  public static raiseIntentAgentResponseToJson(value: RaiseIntentAgentResponse): string {
    return JSON.stringify(uncast(value, r('RaiseIntentAgentResponse')), null, 2);
  }

  public static toRaiseIntentBridgeErrorResponse(json: string): RaiseIntentBridgeErrorResponse {
    return cast(JSON.parse(json), r('RaiseIntentBridgeErrorResponse'));
  }

  public static raiseIntentBridgeErrorResponseToJson(value: RaiseIntentBridgeErrorResponse): string {
    return JSON.stringify(uncast(value, r('RaiseIntentBridgeErrorResponse')), null, 2);
  }

  public static toRaiseIntentBridgeRequest(json: string): RaiseIntentBridgeRequest {
    return cast(JSON.parse(json), r('RaiseIntentBridgeRequest'));
  }

  public static raiseIntentBridgeRequestToJson(value: RaiseIntentBridgeRequest): string {
    return JSON.stringify(uncast(value, r('RaiseIntentBridgeRequest')), null, 2);
  }

  public static toRaiseIntentBridgeResponse(json: string): RaiseIntentBridgeResponse {
    return cast(JSON.parse(json), r('RaiseIntentBridgeResponse'));
  }

  public static raiseIntentBridgeResponseToJson(value: RaiseIntentBridgeResponse): string {
    return JSON.stringify(uncast(value, r('RaiseIntentBridgeResponse')), null, 2);
  }

  public static toRaiseIntentResultAgentErrorResponse(json: string): RaiseIntentResultAgentErrorResponse {
    return cast(JSON.parse(json), r('RaiseIntentResultAgentErrorResponse'));
  }

  public static raiseIntentResultAgentErrorResponseToJson(value: RaiseIntentResultAgentErrorResponse): string {
    return JSON.stringify(uncast(value, r('RaiseIntentResultAgentErrorResponse')), null, 2);
  }

  public static toRaiseIntentResultAgentResponse(json: string): RaiseIntentResultAgentResponse {
    return cast(JSON.parse(json), r('RaiseIntentResultAgentResponse'));
  }

  public static raiseIntentResultAgentResponseToJson(value: RaiseIntentResultAgentResponse): string {
    return JSON.stringify(uncast(value, r('RaiseIntentResultAgentResponse')), null, 2);
  }

  public static toRaiseIntentResultBridgeErrorResponse(json: string): RaiseIntentResultBridgeErrorResponse {
    return cast(JSON.parse(json), r('RaiseIntentResultBridgeErrorResponse'));
  }

  public static raiseIntentResultBridgeErrorResponseToJson(value: RaiseIntentResultBridgeErrorResponse): string {
    return JSON.stringify(uncast(value, r('RaiseIntentResultBridgeErrorResponse')), null, 2);
  }

  public static toRaiseIntentResultBridgeResponse(json: string): RaiseIntentResultBridgeResponse {
    return cast(JSON.parse(json), r('RaiseIntentResultBridgeResponse'));
  }

  public static raiseIntentResultBridgeResponseToJson(value: RaiseIntentResultBridgeResponse): string {
    return JSON.stringify(uncast(value, r('RaiseIntentResultBridgeResponse')), null, 2);
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
  AgentErrorResponseMessage: o(
    [
      { json: 'meta', js: 'meta', typ: r('AgentResponseMetadata') },
      { json: 'payload', js: 'payload', typ: r('ErrorResponseMessagePayload') },
      { json: 'type', js: 'type', typ: r('ResponseMessageType') },
    ],
    false
  ),
  AgentResponseMetadata: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  ErrorResponseMessagePayload: o([{ json: 'error', js: 'error', typ: r('ResponseErrorDetail') }], 'any'),
  AgentRequestMessage: o(
    [
      { json: 'meta', js: 'meta', typ: r('AgentRequestMetadata') },
      { json: 'payload', js: 'payload', typ: m('any') },
      { json: 'type', js: 'type', typ: r('RequestMessageType') },
    ],
    false
  ),
  AgentRequestMetadata: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('BridgeParticipantIdentifier')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: u(undefined, r('SourceIdentifier')) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  BridgeParticipantIdentifier: o(
    [
      { json: 'desktopAgent', js: 'desktopAgent', typ: '' },
      { json: 'appId', js: 'appId', typ: u(undefined, '') },
      { json: 'instanceId', js: 'instanceId', typ: u(undefined, '') },
    ],
    'any'
  ),
  SourceIdentifier: o(
    [
      { json: 'appId', js: 'appId', typ: u(undefined, '') },
      { json: 'desktopAgent', js: 'desktopAgent', typ: u(undefined, '') },
      { json: 'instanceId', js: 'instanceId', typ: u(undefined, '') },
    ],
    'any'
  ),
  AgentResponseMessage: o(
    [
      { json: 'meta', js: 'meta', typ: r('AgentResponseMetadata') },
      { json: 'payload', js: 'payload', typ: m('any') },
      { json: 'type', js: 'type', typ: r('ResponseMessageType') },
    ],
    false
  ),
  BridgeErrorResponseMessage: o(
    [
      { json: 'meta', js: 'meta', typ: r('BridgeErrorResponseMessageMeta') },
      { json: 'payload', js: 'payload', typ: r('ResponseErrorMessagePayload') },
      { json: 'type', js: 'type', typ: '' },
    ],
    false
  ),
  BridgeErrorResponseMessageMeta: o(
    [
      { json: 'errorDetails', js: 'errorDetails', typ: a(r('ResponseErrorDetail')) },
      { json: 'errorSources', js: 'errorSources', typ: a(r('DesktopAgentIdentifier')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  DesktopAgentIdentifier: o([{ json: 'desktopAgent', js: 'desktopAgent', typ: '' }], 'any'),
  ResponseErrorMessagePayload: o([{ json: 'error', js: 'error', typ: u(undefined, r('ResponseErrorDetail')) }], 'any'),
  BridgeRequestMessage: o(
    [
      { json: 'meta', js: 'meta', typ: r('BridgeRequestMetadata') },
      { json: 'payload', js: 'payload', typ: m('any') },
      { json: 'type', js: 'type', typ: '' },
    ],
    false
  ),
  BridgeRequestMetadata: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('BridgeParticipantIdentifier')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: r('BridgeParticipantIdentifier') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  BridgeResponseMessage: o(
    [
      { json: 'meta', js: 'meta', typ: r('BridgeResponseMessageMeta') },
      { json: 'payload', js: 'payload', typ: m('any') },
      { json: 'type', js: 'type', typ: '' },
    ],
    false
  ),
  BridgeResponseMessageMeta: o(
    [
      { json: 'errorDetails', js: 'errorDetails', typ: u(undefined, a(r('ResponseErrorDetail'))) },
      { json: 'errorSources', js: 'errorSources', typ: u(undefined, a(r('DesktopAgentIdentifier'))) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'sources', js: 'sources', typ: u(undefined, a(r('DesktopAgentIdentifier'))) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  BroadcastAgentRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('BroadcastAgentRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('BroadcastAgentRequestPayload') },
      { json: 'type', js: 'type', typ: r('BroadcastAgentRequestType') },
    ],
    false
  ),
  BroadcastAgentRequestMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: r('SourceObject') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  SourceObject: o(
    [
      { json: 'appId', js: 'appId', typ: '' },
      { json: 'desktopAgent', js: 'desktopAgent', typ: u(undefined, '') },
      { json: 'instanceId', js: 'instanceId', typ: u(undefined, '') },
    ],
    'any'
  ),
  BroadcastAgentRequestPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: '' },
      { json: 'context', js: 'context', typ: r('Context') },
      { json: 'metadata', js: 'metadata', typ: u(undefined, r('AppProvidableContextMetadata')) },
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
  AppProvidableContextMetadata: o(
    [
      { json: 'antiReplay', js: 'antiReplay', typ: u(undefined, r('AntiReplayClaims')) },
      { json: 'custom', js: 'custom', typ: u(undefined, m('any')) },
      { json: 'signature', js: 'signature', typ: u(undefined, r('DetachedSignature')) },
      { json: 'traceId', js: 'traceId', typ: u(undefined, '') },
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
  BroadcastBridgeRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('BroadcastBridgeRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('BroadcastBridgeRequestPayload') },
      { json: 'type', js: 'type', typ: r('BroadcastAgentRequestType') },
    ],
    false
  ),
  BroadcastBridgeRequestMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: r('MetaSource') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  MetaSource: o(
    [
      { json: 'appId', js: 'appId', typ: '' },
      { json: 'desktopAgent', js: 'desktopAgent', typ: '' },
      { json: 'instanceId', js: 'instanceId', typ: u(undefined, '') },
    ],
    'any'
  ),
  BroadcastBridgeRequestPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: '' },
      { json: 'context', js: 'context', typ: r('Context') },
      { json: 'metadata', js: 'metadata', typ: u(undefined, r('AppProvidableContextMetadata')) },
    ],
    false
  ),
  ConnectionStepMessage: o(
    [
      { json: 'meta', js: 'meta', typ: r('ConnectionStepMetadata') },
      { json: 'payload', js: 'payload', typ: m('any') },
      { json: 'type', js: 'type', typ: r('ConnectionStepMessageType') },
    ],
    false
  ),
  ConnectionStepMetadata: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: u(undefined, '') },
      { json: 'responseUuid', js: 'responseUuid', typ: u(undefined, '') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  ConnectionStep2Hello: o(
    [
      { json: 'meta', js: 'meta', typ: r('ConnectionStep2HelloMeta') },
      { json: 'payload', js: 'payload', typ: r('ConnectionStep2HelloPayload') },
      { json: 'type', js: 'type', typ: r('ConnectionStep2HelloType') },
    ],
    false
  ),
  ConnectionStep2HelloMeta: o([{ json: 'timestamp', js: 'timestamp', typ: Date }], false),
  ConnectionStep2HelloPayload: o(
    [
      { json: 'authRequired', js: 'authRequired', typ: true },
      { json: 'authToken', js: 'authToken', typ: u(undefined, '') },
      { json: 'desktopAgentBridgeVersion', js: 'desktopAgentBridgeVersion', typ: '' },
      { json: 'supportedFDC3Versions', js: 'supportedFDC3Versions', typ: a('') },
    ],
    false
  ),
  ConnectionStep3Handshake: o(
    [
      { json: 'meta', js: 'meta', typ: r('ConnectionStep3HandshakeMeta') },
      { json: 'payload', js: 'payload', typ: r('ConnectionStep3HandshakePayload') },
      { json: 'type', js: 'type', typ: r('ConnectionStep3HandshakeType') },
    ],
    false
  ),
  ConnectionStep3HandshakeMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  ConnectionStep3HandshakePayload: o(
    [
      { json: 'authToken', js: 'authToken', typ: u(undefined, '') },
      { json: 'channelsState', js: 'channelsState', typ: m(a(r('Context'))) },
      { json: 'implementationMetadata', js: 'implementationMetadata', typ: r('ConnectingAgentImplementationMetadata') },
      { json: 'requestedName', js: 'requestedName', typ: '' },
    ],
    false
  ),
  ConnectingAgentImplementationMetadata: o(
    [
      { json: 'fdc3Version', js: 'fdc3Version', typ: '' },
      { json: 'optionalFeatures', js: 'optionalFeatures', typ: r('OptionalFeatures') },
      { json: 'provider', js: 'provider', typ: '' },
      { json: 'providerVersion', js: 'providerVersion', typ: u(undefined, '') },
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
  ConnectionStep4AuthenticationFailed: o(
    [
      { json: 'meta', js: 'meta', typ: r('ConnectionStep4AuthenticationFailedMeta') },
      { json: 'payload', js: 'payload', typ: r('ConnectionStep4AuthenticationFailedPayload') },
      { json: 'type', js: 'type', typ: r('ConnectionStep4AuthenticationFailedType') },
    ],
    false
  ),
  ConnectionStep4AuthenticationFailedMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  ConnectionStep4AuthenticationFailedPayload: o([{ json: 'message', js: 'message', typ: u(undefined, '') }], false),
  ConnectionStep6ConnectedAgentsUpdate: o(
    [
      { json: 'meta', js: 'meta', typ: r('ConnectionStep6ConnectedAgentsUpdateMeta') },
      { json: 'payload', js: 'payload', typ: r('ConnectionStep6ConnectedAgentsUpdatePayload') },
      { json: 'type', js: 'type', typ: r('ConnectionStep6ConnectedAgentsUpdateType') },
    ],
    false
  ),
  ConnectionStep6ConnectedAgentsUpdateMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  ConnectionStep6ConnectedAgentsUpdatePayload: o(
    [
      { json: 'addAgent', js: 'addAgent', typ: u(undefined, '') },
      { json: 'allAgents', js: 'allAgents', typ: a(r('DesktopAgentImplementationMetadata')) },
      { json: 'channelsState', js: 'channelsState', typ: u(undefined, m(a(r('Context')))) },
      { json: 'removeAgent', js: 'removeAgent', typ: u(undefined, '') },
    ],
    false
  ),
  DesktopAgentImplementationMetadata: o(
    [
      { json: 'desktopAgent', js: 'desktopAgent', typ: '' },
      { json: 'fdc3Version', js: 'fdc3Version', typ: '' },
      { json: 'optionalFeatures', js: 'optionalFeatures', typ: r('OptionalFeatures') },
      { json: 'provider', js: 'provider', typ: '' },
      { json: 'providerVersion', js: 'providerVersion', typ: u(undefined, '') },
    ],
    false
  ),
  FindInstancesAgentErrorResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('FindInstancesAgentErrorResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('PayloadClass') },
      { json: 'type', js: 'type', typ: r('FindInstancesAgentErrorResponseType') },
    ],
    false
  ),
  FindInstancesAgentErrorResponseMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  PayloadClass: o([{ json: 'error', js: 'error', typ: r('FindInstancesErrors') }], false),
  FindInstancesAgentRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('FindInstancesAgentRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('FindInstancesAgentRequestPayload') },
      { json: 'type', js: 'type', typ: r('FindInstancesAgentRequestType') },
    ],
    false
  ),
  FindInstancesAgentRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('DestinationObject')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: u(undefined, r('SourceIdentifier')) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  DestinationObject: o(
    [
      { json: 'desktopAgent', js: 'desktopAgent', typ: '' },
      { json: 'appId', js: 'appId', typ: u(undefined, '') },
      { json: 'instanceId', js: 'instanceId', typ: u(undefined, '') },
    ],
    'any'
  ),
  FindInstancesAgentRequestPayload: o([{ json: 'app', js: 'app', typ: r('AppIdentifier') }], false),
  AppIdentifier: o(
    [
      { json: 'appId', js: 'appId', typ: '' },
      { json: 'desktopAgent', js: 'desktopAgent', typ: u(undefined, '') },
      { json: 'instanceId', js: 'instanceId', typ: u(undefined, '') },
    ],
    'any'
  ),
  FindInstancesAgentResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('AgentResponseMetadata') },
      { json: 'payload', js: 'payload', typ: r('FindInstancesAgentResponsePayload') },
      { json: 'type', js: 'type', typ: r('FindInstancesAgentErrorResponseType') },
    ],
    false
  ),
  FindInstancesAgentResponsePayload: o(
    [{ json: 'appIdentifiers', js: 'appIdentifiers', typ: a(r('AppMetadata')) }],
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
  FindInstancesBridgeErrorResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('FindInstancesBridgeErrorResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('MessagePayload') },
      { json: 'type', js: 'type', typ: r('FindInstancesAgentErrorResponseType') },
    ],
    false
  ),
  FindInstancesBridgeErrorResponseMeta: o(
    [
      { json: 'errorDetails', js: 'errorDetails', typ: a(r('ResponseErrorDetail')) },
      { json: 'errorSources', js: 'errorSources', typ: a(r('DesktopAgentIdentifier')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  MessagePayload: o([{ json: 'error', js: 'error', typ: r('FindInstancesErrors') }], false),
  FindInstancesBridgeRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('FindInstancesBridgeRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('FindInstancesBridgeRequestPayload') },
      { json: 'type', js: 'type', typ: r('FindInstancesAgentRequestType') },
    ],
    false
  ),
  FindInstancesBridgeRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('DestinationObject')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: r('MetaSourceObject') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  MetaSourceObject: o(
    [
      { json: 'appId', js: 'appId', typ: u(undefined, '') },
      { json: 'desktopAgent', js: 'desktopAgent', typ: '' },
      { json: 'instanceId', js: 'instanceId', typ: u(undefined, '') },
    ],
    'any'
  ),
  FindInstancesBridgeRequestPayload: o([{ json: 'app', js: 'app', typ: r('AppIdentifier') }], false),
  FindInstancesBridgeResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('BridgeResponseMessageMeta') },
      { json: 'payload', js: 'payload', typ: r('FindInstancesBridgeResponsePayload') },
      { json: 'type', js: 'type', typ: r('FindInstancesAgentErrorResponseType') },
    ],
    false
  ),
  FindInstancesBridgeResponsePayload: o(
    [{ json: 'appIdentifiers', js: 'appIdentifiers', typ: a(r('AppMetadata')) }],
    false
  ),
  FindIntentAgentErrorResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('FindIntentAgentErrorResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('FindIntentAgentErrorResponsePayload') },
      { json: 'type', js: 'type', typ: r('FindIntentAgentErrorResponseType') },
    ],
    false
  ),
  FindIntentAgentErrorResponseMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  FindIntentAgentErrorResponsePayload: o([{ json: 'error', js: 'error', typ: r('FindInstancesErrors') }], false),
  FindIntentAgentRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('FindIntentAgentRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('FindIntentAgentRequestPayload') },
      { json: 'type', js: 'type', typ: r('FindIntentAgentRequestType') },
    ],
    false
  ),
  FindIntentAgentRequestMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: u(undefined, r('SourceIdentifier')) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
      { json: 'destination', js: 'destination', typ: u(undefined, r('BridgeParticipantIdentifier')) },
    ],
    false
  ),
  FindIntentAgentRequestPayload: o(
    [
      { json: 'context', js: 'context', typ: u(undefined, r('Context')) },
      { json: 'intent', js: 'intent', typ: '' },
      { json: 'resultType', js: 'resultType', typ: u(undefined, '') },
    ],
    false
  ),
  FindIntentAgentResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('FindIntentAgentResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('FindIntentAgentResponsePayload') },
      { json: 'type', js: 'type', typ: r('FindIntentAgentErrorResponseType') },
    ],
    false
  ),
  FindIntentAgentResponseMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  FindIntentAgentResponsePayload: o([{ json: 'appIntent', js: 'appIntent', typ: r('AppIntent') }], false),
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
  FindIntentBridgeErrorResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('FindIntentBridgeErrorResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('FindIntentBridgeErrorResponsePayload') },
      { json: 'type', js: 'type', typ: r('FindIntentAgentErrorResponseType') },
    ],
    false
  ),
  FindIntentBridgeErrorResponseMeta: o(
    [
      { json: 'errorDetails', js: 'errorDetails', typ: a(r('ResponseErrorDetail')) },
      { json: 'errorSources', js: 'errorSources', typ: a(r('DesktopAgentIdentifier')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  FindIntentBridgeErrorResponsePayload: o([{ json: 'error', js: 'error', typ: r('FindInstancesErrors') }], false),
  FindIntentBridgeRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('FindIntentBridgeRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('FindIntentBridgeRequestPayload') },
      { json: 'type', js: 'type', typ: r('FindIntentAgentRequestType') },
    ],
    false
  ),
  FindIntentBridgeRequestMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: r('BridgeParticipantIdentifier') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
      { json: 'destination', js: 'destination', typ: u(undefined, r('BridgeParticipantIdentifier')) },
    ],
    false
  ),
  FindIntentBridgeRequestPayload: o(
    [
      { json: 'context', js: 'context', typ: u(undefined, r('Context')) },
      { json: 'intent', js: 'intent', typ: '' },
      { json: 'resultType', js: 'resultType', typ: u(undefined, '') },
    ],
    false
  ),
  FindIntentBridgeResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('FindIntentBridgeResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('FindIntentBridgeResponsePayload') },
      { json: 'type', js: 'type', typ: r('FindIntentAgentErrorResponseType') },
    ],
    false
  ),
  FindIntentBridgeResponseMeta: o(
    [
      { json: 'errorDetails', js: 'errorDetails', typ: u(undefined, a(r('ResponseErrorDetail'))) },
      { json: 'errorSources', js: 'errorSources', typ: u(undefined, a(r('DesktopAgentIdentifier'))) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'sources', js: 'sources', typ: u(undefined, a(r('DesktopAgentIdentifier'))) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  FindIntentBridgeResponsePayload: o([{ json: 'appIntent', js: 'appIntent', typ: r('AppIntent') }], false),
  FindIntentsByContextAgentErrorResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('FindIntentsByContextAgentErrorResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('FindIntentsByContextAgentErrorResponsePayload') },
      { json: 'type', js: 'type', typ: r('FindIntentsByContextAgentErrorResponseType') },
    ],
    false
  ),
  FindIntentsByContextAgentErrorResponseMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  FindIntentsByContextAgentErrorResponsePayload: o(
    [{ json: 'error', js: 'error', typ: r('FindInstancesErrors') }],
    false
  ),
  FindIntentsByContextAgentRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('FindIntentsByContextAgentRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('FindIntentsByContextAgentRequestPayload') },
      { json: 'type', js: 'type', typ: r('FindIntentsByContextAgentRequestType') },
    ],
    false
  ),
  FindIntentsByContextAgentRequestMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: u(undefined, r('SourceObject')) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
      { json: 'destination', js: 'destination', typ: u(undefined, r('BridgeParticipantIdentifier')) },
    ],
    false
  ),
  FindIntentsByContextAgentRequestPayload: o(
    [
      { json: 'context', js: 'context', typ: r('Context') },
      { json: 'resultType', js: 'resultType', typ: u(undefined, '') },
    ],
    false
  ),
  FindIntentsByContextAgentResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('FindIntentsByContextAgentResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('FindIntentsByContextAgentResponsePayload') },
      { json: 'type', js: 'type', typ: r('FindIntentsByContextAgentErrorResponseType') },
    ],
    false
  ),
  FindIntentsByContextAgentResponseMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  FindIntentsByContextAgentResponsePayload: o(
    [{ json: 'appIntents', js: 'appIntents', typ: a(r('AppIntent')) }],
    false
  ),
  FindIntentsByContextBridgeErrorResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('FindIntentsByContextBridgeErrorResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('FindIntentsByContextBridgeErrorResponsePayload') },
      { json: 'type', js: 'type', typ: r('FindIntentsByContextAgentErrorResponseType') },
    ],
    false
  ),
  FindIntentsByContextBridgeErrorResponseMeta: o(
    [
      { json: 'errorDetails', js: 'errorDetails', typ: a(r('ResponseErrorDetail')) },
      { json: 'errorSources', js: 'errorSources', typ: a(r('DesktopAgentIdentifier')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  FindIntentsByContextBridgeErrorResponsePayload: o(
    [{ json: 'error', js: 'error', typ: r('FindInstancesErrors') }],
    false
  ),
  FindIntentsByContextBridgeRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('FindIntentsByContextBridgeRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('FindIntentsByContextBridgeRequestPayload') },
      { json: 'type', js: 'type', typ: r('FindIntentsByContextAgentRequestType') },
    ],
    false
  ),
  FindIntentsByContextBridgeRequestMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: r('MetaSource') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
      { json: 'destination', js: 'destination', typ: u(undefined, r('BridgeParticipantIdentifier')) },
    ],
    false
  ),
  FindIntentsByContextBridgeRequestPayload: o(
    [
      { json: 'context', js: 'context', typ: r('Context') },
      { json: 'resultType', js: 'resultType', typ: u(undefined, '') },
    ],
    false
  ),
  FindIntentsByContextBridgeResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('FindIntentsByContextBridgeResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('FindIntentsByContextBridgeResponsePayload') },
      { json: 'type', js: 'type', typ: r('FindIntentsByContextAgentErrorResponseType') },
    ],
    false
  ),
  FindIntentsByContextBridgeResponseMeta: o(
    [
      { json: 'errorDetails', js: 'errorDetails', typ: u(undefined, a(r('ResponseErrorDetail'))) },
      { json: 'errorSources', js: 'errorSources', typ: u(undefined, a(r('DesktopAgentIdentifier'))) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'sources', js: 'sources', typ: u(undefined, a(r('DesktopAgentIdentifier'))) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  FindIntentsByContextBridgeResponsePayload: o(
    [{ json: 'appIntents', js: 'appIntents', typ: a(r('AppIntent')) }],
    false
  ),
  GetAppMetadataAgentErrorResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('GetAppMetadataAgentErrorResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('GetAppMetadataAgentErrorResponsePayload') },
      { json: 'type', js: 'type', typ: r('GetAppMetadataAgentErrorResponseType') },
    ],
    false
  ),
  GetAppMetadataAgentErrorResponseMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  GetAppMetadataAgentErrorResponsePayload: o([{ json: 'error', js: 'error', typ: r('FindInstancesErrors') }], false),
  GetAppMetadataAgentRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('GetAppMetadataAgentRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('GetAppMetadataAgentRequestPayload') },
      { json: 'type', js: 'type', typ: r('GetAppMetadataAgentRequestType') },
    ],
    false
  ),
  GetAppMetadataAgentRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('DestinationObject')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: u(undefined, r('SourceIdentifier')) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  GetAppMetadataAgentRequestPayload: o([{ json: 'app', js: 'app', typ: r('AppObject') }], false),
  AppObject: o(
    [
      { json: 'desktopAgent', js: 'desktopAgent', typ: '' },
      { json: 'appId', js: 'appId', typ: '' },
      { json: 'instanceId', js: 'instanceId', typ: u(undefined, '') },
    ],
    'any'
  ),
  GetAppMetadataAgentResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('GetAppMetadataAgentResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('GetAppMetadataAgentResponsePayload') },
      { json: 'type', js: 'type', typ: r('GetAppMetadataAgentErrorResponseType') },
    ],
    false
  ),
  GetAppMetadataAgentResponseMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  GetAppMetadataAgentResponsePayload: o([{ json: 'appMetadata', js: 'appMetadata', typ: r('AppMetadata') }], false),
  GetAppMetadataBridgeErrorResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('GetAppMetadataBridgeErrorResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('GetAppMetadataBridgeErrorResponsePayload') },
      { json: 'type', js: 'type', typ: r('GetAppMetadataAgentErrorResponseType') },
    ],
    false
  ),
  GetAppMetadataBridgeErrorResponseMeta: o(
    [
      { json: 'errorDetails', js: 'errorDetails', typ: a(r('ResponseErrorDetail')) },
      { json: 'errorSources', js: 'errorSources', typ: a(r('DesktopAgentIdentifier')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  GetAppMetadataBridgeErrorResponsePayload: o([{ json: 'error', js: 'error', typ: r('FindInstancesErrors') }], false),
  GetAppMetadataBridgeRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('GetAppMetadataBridgeRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('GetAppMetadataBridgeRequestPayload') },
      { json: 'type', js: 'type', typ: r('GetAppMetadataAgentRequestType') },
    ],
    false
  ),
  GetAppMetadataBridgeRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('DestinationObject')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: r('MetaSourceObject') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  GetAppMetadataBridgeRequestPayload: o([{ json: 'app', js: 'app', typ: r('AppObject') }], false),
  GetAppMetadataBridgeResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('GetAppMetadataBridgeResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('GetAppMetadataBridgeResponsePayload') },
      { json: 'type', js: 'type', typ: r('GetAppMetadataAgentErrorResponseType') },
    ],
    false
  ),
  GetAppMetadataBridgeResponseMeta: o(
    [
      { json: 'errorDetails', js: 'errorDetails', typ: u(undefined, a(r('ResponseErrorDetail'))) },
      { json: 'errorSources', js: 'errorSources', typ: u(undefined, a(r('DesktopAgentIdentifier'))) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'sources', js: 'sources', typ: u(undefined, a(r('DesktopAgentIdentifier'))) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  GetAppMetadataBridgeResponsePayload: o([{ json: 'appMetadata', js: 'appMetadata', typ: r('AppMetadata') }], false),
  OpenAgentErrorResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('OpenAgentErrorResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('OpenAgentErrorResponsePayload') },
      { json: 'type', js: 'type', typ: r('OpenAgentErrorResponseType') },
    ],
    false
  ),
  OpenAgentErrorResponseMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  OpenAgentErrorResponsePayload: o([{ json: 'error', js: 'error', typ: r('OpenErrorResponsePayload') }], false),
  OpenAgentRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('OpenAgentRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('OpenAgentRequestPayload') },
      { json: 'type', js: 'type', typ: r('OpenAgentRequestType') },
    ],
    false
  ),
  OpenAgentRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('DestinationObject')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: r('SourceObject') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  OpenAgentRequestPayload: o(
    [
      { json: 'app', js: 'app', typ: r('AppToOpen') },
      { json: 'context', js: 'context', typ: u(undefined, r('Context')) },
    ],
    false
  ),
  AppToOpen: o(
    [
      { json: 'desktopAgent', js: 'desktopAgent', typ: '' },
      { json: 'appId', js: 'appId', typ: '' },
      { json: 'instanceId', js: 'instanceId', typ: u(undefined, '') },
    ],
    'any'
  ),
  OpenAgentResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('OpenAgentResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('OpenAgentResponsePayload') },
      { json: 'type', js: 'type', typ: r('OpenAgentErrorResponseType') },
    ],
    false
  ),
  OpenAgentResponseMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  OpenAgentResponsePayload: o([{ json: 'appIdentifier', js: 'appIdentifier', typ: r('AppIdentifier') }], false),
  OpenBridgeErrorResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('OpenBridgeErrorResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('OpenBridgeErrorResponsePayload') },
      { json: 'type', js: 'type', typ: r('OpenAgentErrorResponseType') },
    ],
    false
  ),
  OpenBridgeErrorResponseMeta: o(
    [
      { json: 'errorDetails', js: 'errorDetails', typ: a(r('ResponseErrorDetail')) },
      { json: 'errorSources', js: 'errorSources', typ: a(r('DesktopAgentIdentifier')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  OpenBridgeErrorResponsePayload: o([{ json: 'error', js: 'error', typ: r('OpenErrorResponsePayload') }], false),
  OpenBridgeRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('OpenBridgeRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('OpenBridgeRequestPayload') },
      { json: 'type', js: 'type', typ: r('OpenAgentRequestType') },
    ],
    false
  ),
  OpenBridgeRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('DestinationObject')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: r('MetaSource') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  OpenBridgeRequestPayload: o(
    [
      { json: 'app', js: 'app', typ: r('AppToOpen') },
      { json: 'context', js: 'context', typ: u(undefined, r('Context')) },
    ],
    false
  ),
  OpenBridgeResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('OpenBridgeResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('OpenBridgeResponsePayload') },
      { json: 'type', js: 'type', typ: r('OpenAgentErrorResponseType') },
    ],
    false
  ),
  OpenBridgeResponseMeta: o(
    [
      { json: 'errorDetails', js: 'errorDetails', typ: u(undefined, a(r('ResponseErrorDetail'))) },
      { json: 'errorSources', js: 'errorSources', typ: u(undefined, a(r('DesktopAgentIdentifier'))) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'sources', js: 'sources', typ: u(undefined, a(r('DesktopAgentIdentifier'))) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  OpenBridgeResponsePayload: o([{ json: 'appIdentifier', js: 'appIdentifier', typ: r('AppIdentifier') }], false),
  PrivateChannelBroadcastAgentRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('PrivateChannelBroadcastAgentRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelBroadcastAgentRequestPayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelBroadcastAgentRequestType') },
    ],
    false
  ),
  PrivateChannelBroadcastAgentRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('MetaDestination')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: u(undefined, r('SourceObject')) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  MetaDestination: o(
    [
      { json: 'desktopAgent', js: 'desktopAgent', typ: '' },
      { json: 'appId', js: 'appId', typ: '' },
      { json: 'instanceId', js: 'instanceId', typ: u(undefined, '') },
    ],
    'any'
  ),
  PrivateChannelBroadcastAgentRequestPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: '' },
      { json: 'context', js: 'context', typ: r('Context') },
    ],
    false
  ),
  PrivateChannelBroadcastBridgeRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('PrivateChannelBroadcastBridgeRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelBroadcastBridgeRequestPayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelBroadcastAgentRequestType') },
    ],
    false
  ),
  PrivateChannelBroadcastBridgeRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('MetaDestination')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: r('MetaSource') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  PrivateChannelBroadcastBridgeRequestPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: '' },
      { json: 'context', js: 'context', typ: r('Context') },
    ],
    false
  ),
  PrivateChannelEventListenerAddedAgentRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('PrivateChannelEventListenerAddedAgentRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelEventListenerAddedAgentRequestPayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelEventListenerAddedAgentRequestType') },
    ],
    false
  ),
  PrivateChannelEventListenerAddedAgentRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('MetaDestination')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: u(undefined, r('SourceObject')) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  PrivateChannelEventListenerAddedAgentRequestPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: '' },
      { json: 'listenerType', js: 'listenerType', typ: r('PrivateChannelEventType') },
    ],
    false
  ),
  PrivateChannelEventListenerAddedBridgeRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('PrivateChannelEventListenerAddedBridgeRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelEventListenerAddedBridgeRequestPayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelEventListenerAddedAgentRequestType') },
    ],
    false
  ),
  PrivateChannelEventListenerAddedBridgeRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('MetaDestination')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: r('MetaSource') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  PrivateChannelEventListenerAddedBridgeRequestPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: '' },
      { json: 'listenerType', js: 'listenerType', typ: r('PrivateChannelEventType') },
    ],
    false
  ),
  PrivateChannelEventListenerRemovedAgentRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('PrivateChannelEventListenerRemovedAgentRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelEventListenerRemovedAgentRequestPayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelEventListenerRemovedAgentRequestType') },
    ],
    false
  ),
  PrivateChannelEventListenerRemovedAgentRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('MetaDestination')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: u(undefined, r('SourceObject')) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  PrivateChannelEventListenerRemovedAgentRequestPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: '' },
      { json: 'listenerType', js: 'listenerType', typ: r('PrivateChannelEventType') },
    ],
    false
  ),
  PrivateChannelEventListenerRemovedBridgeRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('PrivateChannelEventListenerRemovedBridgeRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelEventListenerRemovedBridgeRequestPayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelEventListenerRemovedAgentRequestType') },
    ],
    false
  ),
  PrivateChannelEventListenerRemovedBridgeRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('MetaDestination')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: r('MetaSource') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  PrivateChannelEventListenerRemovedBridgeRequestPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: '' },
      { json: 'listenerType', js: 'listenerType', typ: r('PrivateChannelEventType') },
    ],
    false
  ),
  PrivateChannelOnAddContextListenerAgentRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('PrivateChannelOnAddContextListenerAgentRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelOnAddContextListenerAgentRequestPayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelOnAddContextListenerAgentRequestType') },
    ],
    false
  ),
  PrivateChannelOnAddContextListenerAgentRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('MetaDestination')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: u(undefined, r('SourceObject')) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  PrivateChannelOnAddContextListenerAgentRequestPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: '' },
      { json: 'contextType', js: 'contextType', typ: u(null, '') },
    ],
    false
  ),
  PrivateChannelOnAddContextListenerBridgeRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('PrivateChannelOnAddContextListenerBridgeRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelOnAddContextListenerBridgeRequestPayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelOnAddContextListenerAgentRequestType') },
    ],
    false
  ),
  PrivateChannelOnAddContextListenerBridgeRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('MetaDestination')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: r('MetaSource') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  PrivateChannelOnAddContextListenerBridgeRequestPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: '' },
      { json: 'contextType', js: 'contextType', typ: u(null, '') },
    ],
    false
  ),
  PrivateChannelOnDisconnectAgentRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('PrivateChannelOnDisconnectAgentRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelOnDisconnectAgentRequestPayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelOnDisconnectAgentRequestType') },
    ],
    false
  ),
  PrivateChannelOnDisconnectAgentRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('MetaDestination')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: u(undefined, r('SourceObject')) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  PrivateChannelOnDisconnectAgentRequestPayload: o([{ json: 'channelId', js: 'channelId', typ: '' }], false),
  PrivateChannelOnDisconnectBridgeRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('PrivateChannelOnDisconnectBridgeRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelOnDisconnectBridgeRequestPayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelOnDisconnectAgentRequestType') },
    ],
    false
  ),
  PrivateChannelOnDisconnectBridgeRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('MetaDestination')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: r('MetaSource') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  PrivateChannelOnDisconnectBridgeRequestPayload: o([{ json: 'channelId', js: 'channelId', typ: '' }], false),
  PrivateChannelOnUnsubscribeAgentRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('PrivateChannelOnUnsubscribeAgentRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelOnUnsubscribeAgentRequestPayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelOnUnsubscribeAgentRequestType') },
    ],
    false
  ),
  PrivateChannelOnUnsubscribeAgentRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('MetaDestination')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: u(undefined, r('SourceObject')) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  PrivateChannelOnUnsubscribeAgentRequestPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: '' },
      { json: 'contextType', js: 'contextType', typ: u(null, '') },
    ],
    false
  ),
  PrivateChannelOnUnsubscribeBridgeRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('ERequestMetadata') },
      { json: 'payload', js: 'payload', typ: r('PrivateChannelOnUnsubscribeBridgeRequestPayload') },
      { json: 'type', js: 'type', typ: r('PrivateChannelOnUnsubscribeAgentRequestType') },
    ],
    false
  ),
  ERequestMetadata: o(
    [
      { json: 'destination', js: 'destination', typ: u(undefined, r('MetaDestination')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: r('MetaSource') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  PrivateChannelOnUnsubscribeBridgeRequestPayload: o(
    [
      { json: 'channelId', js: 'channelId', typ: '' },
      { json: 'contextType', js: 'contextType', typ: u(null, '') },
    ],
    false
  ),
  RaiseIntentAgentErrorResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('RaiseIntentAgentErrorResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('RaiseIntentAgentErrorResponsePayload') },
      { json: 'type', js: 'type', typ: r('RaiseIntentAgentErrorResponseType') },
    ],
    false
  ),
  RaiseIntentAgentErrorResponseMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  RaiseIntentAgentErrorResponsePayload: o([{ json: 'error', js: 'error', typ: r('FindInstancesErrors') }], false),
  RaiseIntentAgentRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('RaiseIntentAgentRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('RaiseIntentAgentRequestPayload') },
      { json: 'type', js: 'type', typ: r('RaiseIntentAgentRequestType') },
    ],
    false
  ),
  RaiseIntentAgentRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: r('MetaDestination') },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: r('SourceObject') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  RaiseIntentAgentRequestPayload: o(
    [
      { json: 'app', js: 'app', typ: r('AppDestinationIdentifier') },
      { json: 'context', js: 'context', typ: r('Context') },
      { json: 'intent', js: 'intent', typ: '' },
    ],
    false
  ),
  AppDestinationIdentifier: o(
    [
      { json: 'desktopAgent', js: 'desktopAgent', typ: '' },
      { json: 'appId', js: 'appId', typ: '' },
      { json: 'instanceId', js: 'instanceId', typ: u(undefined, '') },
    ],
    'any'
  ),
  RaiseIntentAgentResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('RaiseIntentAgentResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('RaiseIntentAgentResponsePayload') },
      { json: 'type', js: 'type', typ: r('RaiseIntentAgentErrorResponseType') },
    ],
    false
  ),
  RaiseIntentAgentResponseMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  RaiseIntentAgentResponsePayload: o(
    [{ json: 'intentResolution', js: 'intentResolution', typ: r('IntentResolution') }],
    false
  ),
  IntentResolution: o(
    [
      { json: 'intent', js: 'intent', typ: '' },
      { json: 'source', js: 'source', typ: r('AppIdentifier') },
    ],
    false
  ),
  RaiseIntentBridgeErrorResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('RaiseIntentBridgeErrorResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('RaiseIntentBridgeErrorResponsePayload') },
      { json: 'type', js: 'type', typ: r('RaiseIntentAgentErrorResponseType') },
    ],
    false
  ),
  RaiseIntentBridgeErrorResponseMeta: o(
    [
      { json: 'errorDetails', js: 'errorDetails', typ: a(r('ResponseErrorDetail')) },
      { json: 'errorSources', js: 'errorSources', typ: a(r('DesktopAgentIdentifier')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  RaiseIntentBridgeErrorResponsePayload: o([{ json: 'error', js: 'error', typ: r('FindInstancesErrors') }], false),
  RaiseIntentBridgeRequest: o(
    [
      { json: 'meta', js: 'meta', typ: r('RaiseIntentBridgeRequestMeta') },
      { json: 'payload', js: 'payload', typ: r('RaiseIntentBridgeRequestPayload') },
      { json: 'type', js: 'type', typ: r('RaiseIntentAgentRequestType') },
    ],
    false
  ),
  RaiseIntentBridgeRequestMeta: o(
    [
      { json: 'destination', js: 'destination', typ: r('MetaDestination') },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'source', js: 'source', typ: r('MetaSource') },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  RaiseIntentBridgeRequestPayload: o(
    [
      { json: 'app', js: 'app', typ: r('AppDestinationIdentifier') },
      { json: 'context', js: 'context', typ: r('Context') },
      { json: 'intent', js: 'intent', typ: '' },
    ],
    false
  ),
  RaiseIntentBridgeResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('RaiseIntentBridgeResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('RaiseIntentBridgeResponsePayload') },
      { json: 'type', js: 'type', typ: r('RaiseIntentAgentErrorResponseType') },
    ],
    false
  ),
  RaiseIntentBridgeResponseMeta: o(
    [
      { json: 'errorDetails', js: 'errorDetails', typ: u(undefined, a(r('ResponseErrorDetail'))) },
      { json: 'errorSources', js: 'errorSources', typ: u(undefined, a(r('DesktopAgentIdentifier'))) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'sources', js: 'sources', typ: u(undefined, a(r('DesktopAgentIdentifier'))) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  RaiseIntentBridgeResponsePayload: o(
    [{ json: 'intentResolution', js: 'intentResolution', typ: r('IntentResolution') }],
    false
  ),
  RaiseIntentResultAgentErrorResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('RaiseIntentResultAgentErrorResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('RaiseIntentResultAgentErrorResponsePayload') },
      { json: 'type', js: 'type', typ: r('RaiseIntentResultAgentErrorResponseType') },
    ],
    false
  ),
  RaiseIntentResultAgentErrorResponseMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  RaiseIntentResultAgentErrorResponsePayload: o(
    [{ json: 'error', js: 'error', typ: r('RaiseIntentResultErrorMessage') }],
    false
  ),
  RaiseIntentResultAgentResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('RaiseIntentResultAgentResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('RaiseIntentResultAgentResponsePayload') },
      { json: 'type', js: 'type', typ: r('RaiseIntentResultAgentErrorResponseType') },
    ],
    false
  ),
  RaiseIntentResultAgentResponseMeta: o(
    [
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  RaiseIntentResultAgentResponsePayload: o(
    [
      { json: 'intentResult', js: 'intentResult', typ: r('IntentResult') },
      { json: 'resultMetadata', js: 'resultMetadata', typ: u(undefined, r('ContextMetadata')) },
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
  RaiseIntentResultBridgeErrorResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('RaiseIntentResultBridgeErrorResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('RaiseIntentResultBridgeErrorResponsePayload') },
      { json: 'type', js: 'type', typ: r('RaiseIntentResultAgentErrorResponseType') },
    ],
    false
  ),
  RaiseIntentResultBridgeErrorResponseMeta: o(
    [
      { json: 'errorDetails', js: 'errorDetails', typ: a(r('ResponseErrorDetail')) },
      { json: 'errorSources', js: 'errorSources', typ: a(r('DesktopAgentIdentifier')) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  RaiseIntentResultBridgeErrorResponsePayload: o(
    [{ json: 'error', js: 'error', typ: r('RaiseIntentResultErrorMessage') }],
    false
  ),
  RaiseIntentResultBridgeResponse: o(
    [
      { json: 'meta', js: 'meta', typ: r('RaiseIntentResultBridgeResponseMeta') },
      { json: 'payload', js: 'payload', typ: r('RaiseIntentResultBridgeResponsePayload') },
      { json: 'type', js: 'type', typ: r('RaiseIntentResultAgentErrorResponseType') },
    ],
    false
  ),
  RaiseIntentResultBridgeResponseMeta: o(
    [
      { json: 'errorDetails', js: 'errorDetails', typ: u(undefined, a(r('ResponseErrorDetail'))) },
      { json: 'errorSources', js: 'errorSources', typ: u(undefined, a(r('DesktopAgentIdentifier'))) },
      { json: 'requestUuid', js: 'requestUuid', typ: '' },
      { json: 'responseUuid', js: 'responseUuid', typ: '' },
      { json: 'sources', js: 'sources', typ: u(undefined, a(r('DesktopAgentIdentifier'))) },
      { json: 'timestamp', js: 'timestamp', typ: Date },
    ],
    false
  ),
  RaiseIntentResultBridgeResponsePayload: o(
    [
      { json: 'intentResult', js: 'intentResult', typ: r('IntentResult') },
      { json: 'resultMetadata', js: 'resultMetadata', typ: u(undefined, r('ContextMetadata')) },
    ],
    false
  ),
  ResponseErrorDetail: [
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
  ResponseMessageType: [
    'findInstancesResponse',
    'findIntentResponse',
    'findIntentsByContextResponse',
    'getAppMetadataResponse',
    'openResponse',
    'raiseIntentResponse',
    'raiseIntentResultResponse',
  ],
  RequestMessageType: [
    'broadcastRequest',
    'findInstancesRequest',
    'findIntentRequest',
    'findIntentsByContextRequest',
    'getAppMetadataRequest',
    'openRequest',
    'PrivateChannel.broadcast',
    'PrivateChannel.eventListenerAdded',
    'PrivateChannel.eventListenerRemoved',
    'PrivateChannel.onAddContextListener',
    'PrivateChannel.onDisconnect',
    'PrivateChannel.onUnsubscribe',
    'raiseIntentRequest',
  ],
  BroadcastAgentRequestType: ['broadcastRequest'],
  ConnectionStepMessageType: ['authenticationFailed', 'connectedAgentsUpdate', 'handshake', 'hello'],
  ConnectionStep2HelloType: ['hello'],
  ConnectionStep3HandshakeType: ['handshake'],
  ConnectionStep4AuthenticationFailedType: ['authenticationFailed'],
  ConnectionStep6ConnectedAgentsUpdateType: ['connectedAgentsUpdate'],
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
  FindInstancesAgentErrorResponseType: ['findInstancesResponse'],
  FindInstancesAgentRequestType: ['findInstancesRequest'],
  FindIntentAgentErrorResponseType: ['findIntentResponse'],
  FindIntentAgentRequestType: ['findIntentRequest'],
  FindIntentsByContextAgentErrorResponseType: ['findIntentsByContextResponse'],
  FindIntentsByContextAgentRequestType: ['findIntentsByContextRequest'],
  GetAppMetadataAgentErrorResponseType: ['getAppMetadataResponse'],
  GetAppMetadataAgentRequestType: ['getAppMetadataRequest'],
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
  OpenAgentErrorResponseType: ['openResponse'],
  OpenAgentRequestType: ['openRequest'],
  PrivateChannelBroadcastAgentRequestType: ['PrivateChannel.broadcast'],
  PrivateChannelEventType: ['addContextListener', 'disconnect', 'unsubscribe'],
  PrivateChannelEventListenerAddedAgentRequestType: ['PrivateChannel.eventListenerAdded'],
  PrivateChannelEventListenerRemovedAgentRequestType: ['PrivateChannel.eventListenerRemoved'],
  PrivateChannelOnAddContextListenerAgentRequestType: ['PrivateChannel.onAddContextListener'],
  PrivateChannelOnDisconnectAgentRequestType: ['PrivateChannel.onDisconnect'],
  PrivateChannelOnUnsubscribeAgentRequestType: ['PrivateChannel.onUnsubscribe'],
  RaiseIntentAgentErrorResponseType: ['raiseIntentResponse'],
  RaiseIntentAgentRequestType: ['raiseIntentRequest'],
  RaiseIntentResultErrorMessage: [
    'ApiTimeout',
    'AgentDisconnected',
    'IntentHandlerRejected',
    'MalformedMessage',
    'NoResultReturned',
    'NotConnectedToBridge',
    'ResponseToBridgeTimedOut',
  ],
  RaiseIntentResultAgentErrorResponseType: ['raiseIntentResultResponse'],
  Type: ['app', 'private', 'user'],
};
