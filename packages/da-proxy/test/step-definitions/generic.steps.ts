import { TestMessaging } from '../support/TestMessaging';
import { createDefaultChannels } from '../support/DefaultUserChannels';
import { Given } from '@cucumber/cucumber'
import { CustomWorld } from '../world/index';
import { BasicDesktopAgent, DefaultAppSupport, DefaultChannelSupport, DefaultIntentSupport, DefaultHandshakeSupport } from '../../src';
import { SimpleIntentResolver, setupGenericSteps } from '@kite9/testing';
import { CHANNEL_STATE } from '@kite9/testing/dist/src/agent';


Given('A Desktop Agent in {string}', async function (this: CustomWorld, field: string) {

    if (!this.messaging) {
        this.messaging = new TestMessaging(this.props[CHANNEL_STATE]);
    }

    const version = "2.0"
    const cs = new DefaultChannelSupport(this.messaging, createDefaultChannels(this.messaging), null)
    const hs = new DefaultHandshakeSupport(this.messaging, [version], cs)
    const is = new DefaultIntentSupport(this.messaging, new SimpleIntentResolver(this))
    const as = new DefaultAppSupport(this.messaging, {
        appId: "Test App Id",
        desktopAgent: "Test DA",
        instanceId: "123-ABC"
    }, 'cucumber-desktop-agent')

    const da = new BasicDesktopAgent(hs, cs, is, as, version)
    await da.connect()

    this.props[field] = da
    this.props['result'] = null
})

setupGenericSteps()