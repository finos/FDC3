import { Given, When } from "@cucumber/cucumber";
import { CustomWorld } from "../world";
import { handleResolve } from "@kite9/testing";


const contextMap: Record<string, any> = {
    "fdc3.instrument": {
        "type": "fdc3.instrument",
        "name": "Apple",
        "id": {
            "ticker": "AAPL"
        }
    },
    "fdc3.country": {
        "type": "fdc3.country",
        "name": "Sweden",
        "id": {
            "COUNTRY_ISOALPHA2": "SE",
            "COUNTRY_ISOALPHA3": "SWE",
        }
    },
    "fdc3.unsupported": {
        "type": "fdc3.unsupported",
        "bogus": true
    }
}

Given('{string} is a {string} context', function (this: CustomWorld, field: string, type: string) {
    this.props[field] = contextMap[type];
})

When('I call {string} with {string} with parameters {string} and {string} for a promise', function (this: CustomWorld, field: string, fnName: string, param1: string, param2: string) {
    try {
        const object = handleResolve(field, this)
        const fn = object[fnName];
        const arg0 = handleResolve(param1, this)
        const arg1 = handleResolve(param2, this)
        const result = fn.call(object, arg0, arg1)
        this.props['result'] = result;
    } catch (error) {
        this.props['result'] = error
    }
});

Given('{string} receives a {string} message for the intent resolver and pipes comms to {string}', async function (this: CustomWorld, frame: string, type: string, output: string) {
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
