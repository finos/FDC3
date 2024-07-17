import { DataTable, Given, When } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { TestMessaging } from '../support/TestMessaging';
import { handleResolve, setupGenericSteps, SimpleIntentResolver } from '@kite9/testing';
import { BasicDesktopAgent, DefaultChannelSupport, DefaultIntentSupport, NoopAppSupport, NoopHandshakeSupport } from '@kite9/da-proxy';
import { MockDocument, MockWindow } from '../support/MockDocument';
import { getAgentAPI } from '../../src';
import { Options } from '@kite9/fdc3-common';
import { MockFDC3Server } from '../support/MockFDC3Server';

setupGenericSteps()
Given('Parent Window desktop {string} listens for postMessage events in {string}, returns direct message response', async function (this: CustomWorld, field: string, w: string) {
    const mockWindow = handleResolve(w, this)
    const mock = new MockFDC3Server(mockWindow as any, false, this)
    this.props[field] = mock
})

Given('Parent Window desktop {string} listens for postMessage events in {string}, returns iframe response', async function (this: CustomWorld, field: string, w: string) {
    const mockWindow = handleResolve(w, this)
    const mock = new MockFDC3Server(mockWindow as any, true, this)
    this.props[field] = mock
})

Given('A Dummy Desktop Agent in {string}', async function (this: CustomWorld, field: string) {

    if (!this.messaging) {
        this.messaging = new TestMessaging();
    }

    const version = "2.0"
    const cs = new DefaultChannelSupport(this.messaging, [], null)
    const hs = new NoopHandshakeSupport()
    const is = new DefaultIntentSupport(this.messaging, new SimpleIntentResolver(this))
    const as = new NoopAppSupport(this.messaging, {
        appId: "Test App Id",
        desktopAgent: "Test DA",
        instanceId: "123-ABC"
    }, 'cucumber-desktop-agent')

    const da = new BasicDesktopAgent(hs, cs, is, as, version)
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
        this.props['result'] = getAgentAPI()
    } catch (error) {
        this.props['result'] = error
    }
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
        this.props['result'] = getAgentAPI(toArgs as Options)
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
})