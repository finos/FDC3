import { BasicDirectory, DefaultFDC3Server, desktopAgentSupplier } from "@kite9/da-server"
import { AppChecker } from "@kite9/fdc3-common"
import { TestServerContext } from "./TestServerContext"
import { CustomWorld } from "../world"
import { MockWindow } from "./MockDocument"

const dummyInstanceId = { appId: "Test App Id", instanceId: "1" }

const appChecker: AppChecker = _o => { return dummyInstanceId }

export const EMBED_URL = "http://localhost:8080/static/da/embed.html"

export class MockFDC3Server {

    externalPort: MessagePort | null = null
    private channel: MessageChannel | null = null
    private useIframe: boolean
    private window: MockWindow
    private world: CustomWorld

    constructor(window: MockWindow, useIframe: boolean, world: CustomWorld) {
        this.useIframe = useIframe
        this.window = window
        this.world = world
        this.init()
    }

    shutdown() {
        if (this.channel) {
            this.channel.port1.close()
            this.channel.port2.close()
        }
    }


    detailsResolver = (_o: Window, _a: any) => {
        return {
            apiKey: "ABC",
            desktopAgentId: "123",
            intentResolver: null,
            channelSelector: null,
            uri: this.useIframe ? EMBED_URL : undefined
        }
    }

    portResolver = (_o: Window, _a: any) => {
        this.channel = new MessageChannel()
        this.channel.port2.start()

        const dir = new BasicDirectory([dummyInstanceId])
        const theServer = new DefaultFDC3Server(new TestServerContext(this.world, this.channel.port2), dir, "Client Test Server", {})
        this.channel.port2.onmessage = (event) => {
            theServer?.receive(event.data, dummyInstanceId)
        }
        this.externalPort = this.channel.port1
        return this.channel.port1
    }

    init() {
        desktopAgentSupplier(appChecker, this.detailsResolver, this.portResolver, this.window as any)
    }
}



