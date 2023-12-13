import { GetAppMetadataAgentRequest, GetAppMetadataAgentResponse } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { SimpleServer } from "./SimpleServer";

export function handleAppMetadata(e: MessageEvent, client: MessagePort, ss: SimpleServer) {
    const message = e.data as GetAppMetadataAgentRequest

    const response : GetAppMetadataAgentResponse = {
        type: "getAppMetadataResponse",
        meta: {
            requestUuid: message.meta.requestUuid,
            responseUuid: ss.createUUID(),
            timestamp: new Date(),
        },
        payload: {
            appMetadata: {
                appId: message.payload.app.appId,
                name: "YOYO",
                version: "3.2"
            }
        }
    } 
    
    client.postMessage(response)
}