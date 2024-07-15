import { Given, When } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { TestMessaging } from '../support/TestMessaging';
import { handleResolve, setupGenericSteps, SimpleIntentResolver } from '@kite9/testing';
import { BasicDesktopAgent, DefaultChannelSupport, DefaultIntentSupport, NoopAppSupport, NoopHandshakeSupport } from '@kite9/da-proxy';
import { BasicDirectory, DefaultFDC3Server, FDC3Server, desktopAgentSupplier } from '@kite9/da-server';
import { mockWindow } from '../support/Mockwindow';
import { mockDocument } from '../support/MockDocument';
import { getAgentAPI } from '../../src';
import { AppChecker } from '@kite9/fdc3-common';
import { TestServerContext } from '../support/TestServerContext';

globalThis.window = mockWindow as any
globalThis.window.parent = mockWindow as any
globalThis.document = mockDocument as any

setupGenericSteps()

var theServer: FDC3Server | null = null

Given('Parent Window listens for postMessage events', async function (this: CustomWorld) {

    const dummyInstanceId = { appId: "Test App Id", instanceId: "1" }

    const appChecker: AppChecker = _o => { return dummyInstanceId }

    const detailsResolver = (_o: Window, _a: any) => {
        return {
            apiKey: "ABC",
            uri: "http://localhost:8080/static/da/embed.html",
            desktopAgentId: "123",
            intentResolver: null,
            channelSelector: null
        }
    }

    const portResolver = (_o: Window, _a: any) => {
        const channel = new MessageChannel()
        channel.port2.start()

        const dir = new BasicDirectory([dummyInstanceId])
        theServer = new DefaultFDC3Server(new TestServerContext(this, channel.port2), dir, "Client Test Server", {})
        channel.port2.onmessage = (event) => {
            theServer?.receive(event.data, dummyInstanceId)
        }

        return channel.port1
    }

    desktopAgentSupplier(appChecker, detailsResolver, portResolver, mockWindow as any)
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