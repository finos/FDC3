import { TestMessaging } from '../support/TestMessaging';
import { Given } from '@cucumber/cucumber'
import { CustomWorld } from '../world/index';
import { BasicDesktopAgent, DefaultAppSupport, DefaultChannelSupport, DefaultIntentSupport, DefaultHandshakeSupport } from '../../src';
import { SimpleIntentResolver, setupGenericSteps } from '@kite9/testing';
import { CHANNEL_STATE } from '@kite9/testing/dist/src/agent';

Given('A Desktop Agent in {string}', async function (this: CustomWorld, field: string) {

    if (!this.messaging) {
        this.messaging = new TestMessaging(this.props[CHANNEL_STATE]);
    }

    const cs = new DefaultChannelSupport(this.messaging)
    const hs = new DefaultHandshakeSupport(this.messaging)
    const is = new DefaultIntentSupport(this.messaging, new SimpleIntentResolver(this))
    const as = new DefaultAppSupport(this.messaging)

    const da = new BasicDesktopAgent(hs, cs, is, as, [hs])
    await da.connect()

    this.props[field] = da
    this.props['result'] = null
})

setupGenericSteps()