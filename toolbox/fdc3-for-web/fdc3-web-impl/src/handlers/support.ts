import { AgentResponseMessage, AppRequestMessage } from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { AppRegistration, ServerContext } from '../ServerContext';
import { AppIdentifier } from '@kite9/fdc3-standard';

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
  sc: ServerContext<AppRegistration>,
  request: AppRequestMessage,
  to: FullAppIdentifier,
  payload: any,
  type: AgentResponseMessage['type']
) {
  return successResponseId(sc, request.meta.requestUuid, to, payload, type);
}

export function errorResponse(
  sc: ServerContext<AppRegistration>,
  request: AppRequestMessage,
  to: FullAppIdentifier,
  error: string,
  type: AgentResponseMessage['type']
) {
  return errorResponseId(sc, request.meta.requestUuid, to, error, type);
}

export function successResponseId(
  sc: ServerContext<AppRegistration>,
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
  sc: ServerContext<AppRegistration>,
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

/*
 * from: https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates#14438954
 */
export function onlyUnique(value: any, index: any, self: any) {
  return self.indexOf(value) === index;
}
