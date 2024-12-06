import { FDC3Server } from "@kite9/fdc3-web-impl"
import { TestServerContext } from "./TestServerContext"
import { MockWindow } from "./MockWindow"
import { AutomaticResponse } from "./responses/AutomaticResponses"
import { FindIntent } from "./responses/FindIntent"
import { RaiseIntent } from "./responses/RaiseIntent"
import { Handshake } from "./responses/Handshake"
import { UserChannels } from "./responses/UserChannels"
import { CurrentChannel } from "./responses/CurrentChannel"
import { BrowserTypes } from "@kite9/fdc3-schema"
import { GetInfo } from "./responses/GetInfo"

type AppRequestMessage = BrowserTypes.AppRequestMessage
type WebConnectionProtocol2LoadURL = BrowserTypes.WebConnectionProtocol2LoadURL
type WebConnectionProtocol3Handshake = BrowserTypes.WebConnectionProtocol3Handshake

export const dummyInstanceId = { appId: "Test App Id", instanceId: "1" }

export const EMBED_URL = "http://localhost:8080/static/da/embed.html"

export const CHANNEL_SELECTOR_URL = "https://mock.fdc3.com/channelSelector"

export const INTENT_RESOLVER_URL = "https://mock.fdc3.com/resolver"

export class MockFDC3Server implements FDC3Server {

    private useIframe: boolean
    private window: MockWindow
    private tsc: TestServerContext
    private receivedGoodbye = false;

    readonly automaticResponses: AutomaticResponse[] = [
        new FindIntent(),
        new RaiseIntent(),
        new Handshake(),
        new UserChannels(),
        new CurrentChannel(),
        new GetInfo()
    ]

    constructor(window: MockWindow, useIframe: boolean, ctx: TestServerContext) {
        this.useIframe = useIframe
        this.window = window
        this.tsc = ctx
        this.init()
    }

    receive(message: AppRequestMessage, from: string): void {
        this.automaticResponses.forEach((r) => {
            if (r.filter(message.type)) {
                r.action(message, this.tsc, from)
            }
        })
    }

    shutdown() {
        this.tsc.shutdown()
    }

    hasReceivedGoodbye(): boolean {
        return this.receivedGoodbye;
    }

    init() {
        this.window.addEventListener(
            "message",
            (e) => {
                const event = e as MessageEvent
                const data = event.data;
                const source = event.source as Window
                const origin = event.origin;

                if (this.tsc.cw.debugLogs) { console.log("MockFDC3Server received: ", event.data); }
                if (data.type == "WCP1Hello") {
                    if (this.useIframe) {
                        const message: WebConnectionProtocol2LoadURL = {
                            type: "WCP2LoadUrl",
                            meta: {
                                connectionAttemptUuid: data.meta.connectionAttemptUuid,
                                timestamp: new Date()
                            },
                            payload: {
                                iframeUrl: EMBED_URL + "?connectionAttemptUuid=" + data.meta.connectionAttemptUuid
                            }
                        };
                        source.postMessage(message, origin);
                    } else {
                        const details = this.tsc.getMatchingInstance(data.payload.identityUrl)
                        if (details) {
                            const message: WebConnectionProtocol3Handshake = {
                                type: "WCP3Handshake",
                                meta: {
                                    connectionAttemptUuid: data.meta.connectionAttemptUuid,
                                    timestamp: new Date()
                                },
                                payload: {
                                    fdc3Version: "2.2",
                                    intentResolverUrl: INTENT_RESOLVER_URL,
                                    channelSelectorUrl: CHANNEL_SELECTOR_URL,
                                }
                            };
                            source.postMessage(message , origin, [details.externalPort]);
                        } //getMatchingInstance will log if it didn't find anything
                    }
                } else if (data.type == "WCP6Goodbye") {
                    this.receivedGoodbye = true;
                }
            });
    }
}



