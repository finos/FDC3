import { BasicDirectory, DefaultFDC3Server, desktopAgentSupplier } from "@kite9/da-server"
import { AppChecker } from "@kite9/fdc3-common"
import { TestServerContext } from "./TestServerContext"
import { CustomWorld } from "../world"
import { MockWindow } from "./MockDocument"

const dummyInstanceId = { appId: "Test App Id", instanceId: "1" }

const appChecker: AppChecker = _o => { return dummyInstanceId }

export const EMBED_URL = "http://localhost:8080/static/da/embed.html"

export type ServerDetails = {
    externalPort: MessagePort,
    channel: MessageChannel,
    server: DefaultFDC3Server
}

export function buildFDC3ServerInstance(world: CustomWorld): ServerDetails {
    const channel = new MessageChannel()
    channel.port2.start()

    const dir = new BasicDirectory([dummyInstanceId])
    const theServer = new DefaultFDC3Server(new TestServerContext(world, channel.port2), dir, "Client Test Server", {})
    channel.port2.onmessage = (event) => {
        theServer?.receive(event.data, dummyInstanceId)
    }

    return {
        externalPort: channel.port1,
        channel: channel,
        server: theServer
    }
}

export class MockFDC3Server {

    private instances: ServerDetails[] = []
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
        this.instances.forEach(i => {
            i.channel.port1.close()
            i.channel.port2.close()
        })
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
        if (!this.useIframe) {
            const details = buildFDC3ServerInstance(this.world)
            this.instances.push(details)
            return details.externalPort
        } else {
            return null
        }
    }

    init() {
        desktopAgentSupplier(appChecker, this.detailsResolver, this.portResolver, this.window as any)
    }
}



