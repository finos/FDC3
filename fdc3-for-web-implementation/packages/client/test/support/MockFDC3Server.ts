import { BasicDirectory, DefaultFDC3Server, desktopAgentSupplier } from "@kite9/da-server"
import { AppChecker } from "@kite9/fdc3-common"
import { TestServerContext } from "./TestServerContext"
import { CustomWorld } from "../world"
import { MockWindow } from "./MockDocument"

const dummyInstanceId = { appId: "Test App Id", instanceId: "1" }

const appChecker: AppChecker = _o => { return dummyInstanceId }

export const EMBED_URL = "http://localhost:8080/static/da/embed.html"

export type ConnectionDetails = {
    externalPort: MessagePort,
    internalPort: MessagePort
    server: DefaultFDC3Server
}

export function buildConnection(world: CustomWorld): ConnectionDetails {
    const mc = new MessageChannel()
    const internalPort = mc.port1
    const externalPort = mc.port2

    internalPort.start()

    const dir = new BasicDirectory([dummyInstanceId])
    const theServer = new DefaultFDC3Server(new TestServerContext(world, internalPort as any as MessagePort), dir, "Client Test Server", {})

    internalPort.addEventListener("message", (e) => {
        theServer?.receive((e as any).data, dummyInstanceId)
    })

    return {
        externalPort: externalPort as any as MessagePort,
        internalPort: internalPort as any as MessagePort,
        server: theServer
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
            const details = buildConnection(this.world)
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



