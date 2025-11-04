import { AgentResponseMessage, AppRequestMessage } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';
import { AppIdentifier } from '@finos/fdc3-standard';
import { FDC3ServerInstance } from '../FDC3ServerInstance';

/** Interface representing a full specified app identifier (instanceId is optional in the API type). */
export interface FullAppIdentifier {
  readonly appId: string;
  readonly instanceId: string;
}

export function isFullAppIdentifier(identifier: AppIdentifier | FullAppIdentifier): identifier is FullAppIdentifier {
  const typedIdentifier = identifier as FullAppIdentifier;
  return typedIdentifier.instanceId !== undefined && typedIdentifier.appId !== undefined;
}

export function successResponse(
  sc: FDC3ServerInstance,
  request: AppRequestMessage,
  to: FullAppIdentifier,
  payload: AgentResponseMessage['payload'],
  type: AgentResponseMessage['type']
) {
  return successResponseId(sc, request.meta.requestUuid, to, payload, type);
}

export function errorResponse(
  sc: FDC3ServerInstance,
  request: AppRequestMessage,
  to: FullAppIdentifier,
  error: string,
  type: AgentResponseMessage['type']
) {
  return errorResponseId(sc, request.meta.requestUuid, to, error, type);
}

export function successResponseId(
  sc: FDC3ServerInstance,
  requestId: string,
  to: FullAppIdentifier,
  payload: AgentResponseMessage['payload'],
  type: AgentResponseMessage['type']
) {
  const msg = {
    meta: {
      responseUuid: sc.createUUID(),
      requestUuid: requestId,
      timestamp: new Date(),
    },
    type,
    payload,
  };
  sc.post(msg, to.instanceId!);
}

export function errorResponseId(
  sc: FDC3ServerInstance,
  requestId: string,
  to: FullAppIdentifier,
  error: string,
  type: AgentResponseMessage['type']
) {
  sc.post(
    {
      meta: {
        responseUuid: sc.createUUID(),
        requestUuid: requestId,
        timestamp: new Date(),
      },
      type,
      payload: {
        error,
      },
    } as AgentResponseMessage,
    to.instanceId!
  );
}
