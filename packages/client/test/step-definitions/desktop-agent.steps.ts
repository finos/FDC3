import { Given, When } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { TestMessaging } from '../support/TestMessaging';
import { handleResolve, setupGenericSteps, SimpleIntentResolver } from '@kite9/testing';
import { BasicDesktopAgent, DefaultChannelSupport, DefaultIntentSupport, NoopAppSupport, NoopHandshakeSupport } from '@kite9/da-proxy';

type EventHandler = {
    type: string,
    callback: (e: Event) => void
}

class MockWindow {

    eventHandlers: EventHandler[] = []

    addEventListener(type: string, callback: (e: Event) => void): void {
        this.eventHandlers.push({ type, callback })
    }

    dispatchEvent(event: Event): void {
        this.eventHandlers.forEach((e) => {
            if (e.type === event.type) {
                e.callback(event)
            }
        })
    }
}

/**
 * This allows us to handle fdc3.ready events
 */
globalThis.window = new MockWindow() as any

/**
 * Need to do this after we've set up window
 */
import { getAgentAPI } from '../../src';


setupGenericSteps()

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