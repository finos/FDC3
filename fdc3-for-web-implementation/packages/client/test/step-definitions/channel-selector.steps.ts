import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../world";
import { handleResolve } from "@kite9/testing";

Given('{string} receives a {string} message for the channel selector and pipes comms to {string}', async function (this: CustomWorld, frame: string, type: string, output: string) {
    const channelSelectorIframe = handleResolve(frame, this)
    const mc = new MessageChannel();
    const internalPort = mc.port1;
    const externalPort = mc.port2;

    if (type == "SelectorMessageInitialize") {
        globalThis.window.dispatchEvent({
            type: 'message',
            data: {
                type: 'SelectorMessageInitialize'
            },
            origin: globalThis.window.location.origin,
            ports: [externalPort],
            source: channelSelectorIframe
        } as any)
    }

    const out: any[] = []
    this.props[output] = out

    internalPort.start()
    internalPort.onmessage = (e) => {
        out.push({ type: e.type, data: e.data })
    }
});

Given('Testing ends after {string} ms', function (string) {
    setTimeout(() => {
        process.exit();
    }, parseInt(string))
})