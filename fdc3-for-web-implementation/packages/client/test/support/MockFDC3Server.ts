import { BasicDirectory, DefaultFDC3Server } from "@kite9/da-server"
import { WebConnectionProtocol2LoadURL, WebConnectionProtocol3Handshake } from "@kite9/fdc3-common"
import { TestServerContext } from "./TestServerContext"
import { MockWindow } from "./MockDocument"
import { ChannelState, ChannelType } from "@kite9/da-server/src/handlers/BroadcastHandler"

export const dummyInstanceId = { appId: "Test App Id", instanceId: "1" }

export const EMBED_URL = "http://localhost:8080/static/da/embed.html"

export const CHANNEL_SELECTOR_URL = "https://mock.fdc3.com/channelSelector"

export const INTENT_RESPOLVER_URL = "https://mock.fdc3.com/resolver"

export class MockFDC3Server extends DefaultFDC3Server {

    private useIframe: boolean
    private window: MockWindow
    private tsc: TestServerContext

    constructor(window: MockWindow, useIframe: boolean, ctx: TestServerContext) {
        const channelDetails: ChannelState[] = [
            { id: "one", type: ChannelType.user, context: [], displayMetadata: { name: "THE RED CHANNEL", color: "red" } },
            { id: "two", type: ChannelType.user, context: [], displayMetadata: { name: "THE BLUE CHANNEL", color: "blue" } },
            { id: "three", type: ChannelType.user, context: [], displayMetadata: { name: "THE GREEN CHANNEL", color: "green" } }
        ]

        const dir = new BasicDirectory([dummyInstanceId])
        super(ctx, dir, channelDetails)
        this.useIframe = useIframe
        this.window = window
        this.tsc = ctx
        this.init()
    }

    shutdown() {
        // this.theContext.forEach(i => {
        //     i.externalPort.close()
        //     i.internalPort.close()
        // })
    }

    init() {
        this.window.addEventListener(
            "message",
            (e) => {
                const event = e as MessageEvent
                const data = event.data;
                const source = event.source as Window
                const origin = event.origin;

                console.log("Received: " + JSON.stringify(event.data));
                if (data.type == "WCP1Hello") {
                    if (this.useIframe) {
                        source.postMessage({
                            type: "WCP2LoadUrl",
                            meta: {
                                connectionAttemptUuid: data.meta.connectionAttemptUuid,
                                timestamp: new Date()
                            },
                            payload: {
                                iframeUrl: EMBED_URL + "?connectionAttemptUuid=" + data.meta.connectionAttemptUuid
                            }
                        } as WebConnectionProtocol2LoadURL, origin)
                    } else {
                        const details = this.tsc.getMatchingInstance(data.payload.identityUrl)
                        source.postMessage({
                            type: "WCP3Handshake",
                            meta: {
                                connectionAttemptUuid: data.meta.connectionAttemptUuid,
                                timestamp: new Date()
                            },
                            payload: {
                                fdc3Version: "2.2",
                                resolver: INTENT_RESPOLVER_URL,
                                channelSelector: CHANNEL_SELECTOR_URL,
                            }
                        } as WebConnectionProtocol3Handshake, origin, [details!!.externalPort])
                    }
                }
            });
    }
}



