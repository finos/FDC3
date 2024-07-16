import { BasicDirectory, DefaultFDC3Server } from "@kite9/da-server"
import { AppChecker } from "@kite9/fdc3-common"
import { TestServerContext } from "./TestServerContext"





export const dummyInstanceId = { appId: "Test App Id", instanceId: "1" }

export const appChecker: AppChecker = _o => { return dummyInstanceId }

export const detailsResolver = (_o: Window, _a: any) => {
    return {
        apiKey: "ABC",
        desktopAgentId: "123",
        intentResolver: null,
        channelSelector: null
    }
}

export const portResolver = (_o: Window, _a: any) => {
    const channel = new MessageChannel()
    channel.port2.start()

    const dir = new BasicDirectory([dummyInstanceId])
    theServer = new DefaultFDC3Server(new TestServerContext(this, channel.port2), dir, "Client Test Server", {})
    channel.port2.onmessage = (event) => {
        theServer?.receive(event.data, dummyInstanceId)
    }

    return channel.port1
}