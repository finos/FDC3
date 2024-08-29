import { After, DataTable, Given, When } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { TestMessaging } from '../support/TestMessaging';
import { handleResolve, setupGenericSteps } from '@kite9/testing';
import { BasicDesktopAgent, DefaultChannelSupport, DefaultHandshakeSupport, DefaultIntentSupport } from '@kite9/da-proxy';
import { MockDocument, MockWindow } from '../support/MockDocument';
import { getAgent } from '../../src';
import { GetAgentParams } from '@kite9/fdc3-common';
import { dummyInstanceId, MockFDC3Server } from '../support/MockFDC3Server';
import { DefaultDesktopAgentIntentResolver } from '../../src/ui/DefaultDesktopAgentIntentResolver';
import { DefaultDesktopAgentChannelSelector } from '../../src/ui/DefaultDesktopAgentChannelSelector';
import { NoopAppSupport } from '../../src/apps/NoopAppSupport';
import { MockStorage } from '../support/MockStorage';
var wtf = require('wtfnode')

setupGenericSteps()
Given('Parent Window desktop {string} listens for postMessage events in {string}, returns direct message response', async function (this: CustomWorld, field: string, w: string) {
    const mockWindow = handleResolve(w, this)
    this.mockFDC3Server = new MockFDC3Server(mockWindow as any, false, this.mockContext)
    this.props[field] = this.mockFDC3Server
    this.mockContext.open(dummyInstanceId.appId)
})

Given('Parent Window desktop {string} listens for postMessage events in {string}, returns iframe response', async function (this: CustomWorld, field: string, w: string) {
    const mockWindow = handleResolve(w, this)
    this.mockFDC3Server = new MockFDC3Server(mockWindow as any, true, this.mockContext)
    this.props[field] = this.mockFDC3Server
    this.mockContext.open(dummyInstanceId.appId)
})


Given('A Dummy Desktop Agent in {string}', async function (this: CustomWorld, field: string) {

    if (!this.messaging) {
        this.messaging = new TestMessaging();
    }

    const intentResolver = new DefaultDesktopAgentIntentResolver("https://localhost:8080/dummy-intent-resolver.html")
    const channelSelector = new DefaultDesktopAgentChannelSelector("https://localhost:8080/dummy-channel-selector.html")
    const cs = new DefaultChannelSupport(this.messaging, channelSelector)
    const hs = new DefaultHandshakeSupport(this.messaging)
    const is = new DefaultIntentSupport(this.messaging, intentResolver)
    const as = new NoopAppSupport(this.messaging)

    const da = new BasicDesktopAgent(hs, cs, is, as, [hs, intentResolver, channelSelector])
    await da.connect()

    this.props[field] = da
    this.props['result'] = null
})

Given('`window.fdc3` is injected into the runtime with the value in {string}', async function (this: CustomWorld, field: string) {
    const object = handleResolve(field, this)
    window.fdc3 = object
    window.dispatchEvent(new Event('fdc3.ready'))
});

When('I call getAgentAPI for a promise result', function (this: CustomWorld) {
    try {
        this.props['result'] = getAgent()
    } catch (error) {
        this.props['result'] = error
    }
})

After(function (this: CustomWorld) {
    console.log("Cleaning up")
    console.log((process as any)._getActiveHandles())
    setTimeout(() => { wtf.dump() }, 10000)
})

When('I call getAgentAPI for a promise result with the following options', function (this: CustomWorld, dt: DataTable) {
    try {
        const first = dt.hashes()[0]
        const toArgs = Object.fromEntries(Object.entries(first)
            .map(([k, v]) => {
                const val = handleResolve(v, this)
                const val2 = isNaN(val) ? val : Number(val)
                const val3 = val2 === "true" ? true : val2 === "false" ? false : val2
                return [k, val3]
            })
        )
        this.props['result'] = getAgent(toArgs as GetAgentParams)
    } catch (error) {
        this.props['result'] = error
    }
})

Given('a browser document in {string} and window in {string}', async function (this: CustomWorld, d: string, w: string) {
    // creates the mock app window
    const mw = new MockWindow("mockWindow", this)
    globalThis.window = mw as any
    this.props[w] = globalThis.window;

    // to keep it simple, mock app window parent is set to itself, to avoid excess routing
    mw.parent = mw;

    // mock document exists in the window
    globalThis.document = new MockDocument("mockDocument", mw) as any
    this.props[d] = globalThis.document as any;

    // browser storage
    globalThis.sessionStorage = new MockStorage() as any

})