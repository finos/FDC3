import { BasicDirectory, DefaultFDC3Server } from "@kite9/da-server"
import { WebConnectionProtocol2LoadURL, WebConnectionProtocol3Handshake } from "@kite9/fdc3-common"
import { TestServerContext } from "./TestServerContext"
import { CustomWorld } from "../world"
import { MockWindow } from "./MockDocument"
import { ChannelState, ChannelType } from "@kite9/da-server/src/handlers/BroadcastHandler"

const dummyInstanceId = { appId: "Test App Id", instanceId: "1" }

export const EMBED_URL = "http://localhost:8080/static/da/embed.html"

export type ConnectionDetails = {
    externalPort: MessagePort,
    internalPort: MessagePort
    server: DefaultFDC3Server
    context: TestServerContext
}

export function buildConnection(world: CustomWorld): ConnectionDetails {
    const mc = new MessageChannel()
    const internalPort = mc.port1
    const externalPort = mc.port2

    internalPort.start()

    const channelDetails: ChannelState[] = [
        { id: "one", type: ChannelType.user, context: [], displayMetadata: { name: "THE RED CHANNEL", color: "red" } },
        { id: "two", type: ChannelType.user, context: [], displayMetadata: { name: "THE BLUE CHANNEL", color: "blue" } },
        { id: "three", type: ChannelType.user, context: [], displayMetadata: { name: "THE GREEN CHANNEL", color: "green" } }
    ]

    const dir = new BasicDirectory([dummyInstanceId])
    const theContext = new TestServerContext(world, internalPort as any as MessagePort)
    const theServer = new DefaultFDC3Server(theContext, dir, channelDetails)

    internalPort.addEventListener("message", (e) => {
        theServer?.receive((e as any).data, "uuid")
    })

    return {
        externalPort: externalPort as any as MessagePort,
        internalPort: internalPort as any as MessagePort,
        server: theServer,
        context: theContext
    }
}

export class MockFDC3Server {

    instances: ConnectionDetails[] = []
    private useIframe: boolean
    private window: MockWindow
    private world: CustomWorld

    constructor(window: MockWindow, useIframe: boolean, world: CustomWorld) {
        this.useIframe = useIframe
        this.window = window
        this.world = world
        this.init()
        this.window.serverInstance = this
    }

    shutdown() {
        this.instances.forEach(i => {
            i.externalPort.close()
            i.internalPort.close()
        })
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
                        const details = buildConnection(this.world)
                        details.context.setInstanceDetails('uuid', { appId: 'Test App Id', instanceId: '1' })
                        this.instances.push(details)

                        source.postMessage({
                            type: "WCP3Handshake",
                            meta: {
                                connectionAttemptUuid: data.meta.connectionAttemptUuid,
                                timestamp: new Date()
                            },
                            payload: {
                                fdc3Version: "2.2",
                                resolver: "https://mock.fdc3.com/resolver",
                                channelSelector: "https://mock.fdc3.com/channelSelector",
                            }
                        } as WebConnectionProtocol3Handshake, origin, [details.externalPort])
                    }
                }
            });
    }
}



