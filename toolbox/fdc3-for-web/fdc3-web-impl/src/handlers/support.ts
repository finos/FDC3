import { AppRegistration, ServerContext } from '../ServerContext';
import { BrowserTypes } from '@kite9/fdc3-schema';
import { AppIdentifier } from '@kite9/fdc3-standard';

type AppRequestMessage = BrowserTypes.AppRequestMessage;
type AgentResponseMessage = BrowserTypes.AgentResponseMessage;

export function successResponse(
  sc: ServerContext<AppRegistration>,
  request: AppRequestMessage,
  to: AppIdentifier,
  payload: any,
  type: string
) {
  return successResponseId(sc, request.meta.requestUuid, to, payload, type);
}

export function errorResponse(
  sc: ServerContext<AppRegistration>,
  request: AppRequestMessage,
  to: AppIdentifier,
  error: string,
  type: string
) {
  return errorResponseId(sc, request.meta.requestUuid, to, error, type);
}

export function successResponseId(
  sc: ServerContext<AppRegistration>,
  requestId: string,
  to: AppIdentifier,
  payload: any,
  type: string
) {
  sc.post(
    {
      meta: {
        responseUuid: sc.createUUID(),
        requestUuid: requestId,
        timestamp: new Date(),
      },
      type,
      payload,
    } as AgentResponseMessage,
    to.instanceId!!
  );
}

export function errorResponseId(
  sc: ServerContext<AppRegistration>,
  requestId: string,
  to: AppIdentifier,
  error: string,
  type: string
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
    to.instanceId!!
  );
}

/*
 * from: https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates#14438954
 */
export function onlyUnique(value: any, index: any, self: any) {
  return self.indexOf(value) === index;
}
