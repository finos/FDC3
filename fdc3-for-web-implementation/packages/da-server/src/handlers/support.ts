import { ServerContext } from "../ServerContext";
import { AgentResponseMessage, AppIdentifier, AppRequestMessage } from "@kite9/fdc3-common";


export function successResponse(sc: ServerContext, request: AppRequestMessage, to: AppIdentifier, payload: any, type: string) {
    sc.post({
        meta: {
            responseUuid: sc.createUUID(),
            requestUuid: request.meta.requestUuid,
            timestamp: new Date()
        },
        type,
        payload,
    } as AgentResponseMessage, to)
}

export function errorResponse(sc: ServerContext, request: AppRequestMessage, to: AppIdentifier, error: string, type: string) {
    sc.post({
        meta: {
            responseUuid: sc.createUUID(),
            requestUuid: request.meta.requestUuid,
            timestamp: new Date()
        },
        type,
        payload: {
            error
        },
    } as AgentResponseMessage, to)
}

/* 
 * from: https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates#14438954
 */
export function onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
}
