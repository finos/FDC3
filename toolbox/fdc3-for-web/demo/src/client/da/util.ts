import { InstanceID } from "@kite9/fdc3-web-impl"
import { Socket } from "socket.io-client"
import { FDC3_APP_EVENT, FDC3_DA_EVENT } from "../../message-types"

export enum UI { DEFAULT, DEMO }

export const UI_URLS = {
    [UI.DEMO]: {
        intentResolverUrl: window.location.origin + "/static/da/intent-resolver.html",
        channelSelectorUrl: window.location.origin + "/static/da/channel-selector.html",
    },
    [UI.DEFAULT]: {
        // TODO: REPLACE WITH FDC3.FINOS.ORG URLS AFTER GO-LIVE
        intentResolverUrl: "http://localhost:4002/intent_resolver.html",
        channelSelectorUrl: "http://localhost:4002/channel_selector.html",
    }
}

export function link(socket: Socket, channel: MessageChannel, source: InstanceID) {
    socket.on(FDC3_DA_EVENT, (data: any) => {
        channel.port2.postMessage(data)
    })

    channel.port2.onmessage = function (event) {
        socket.emit(FDC3_APP_EVENT, event.data, source)
    }
}
