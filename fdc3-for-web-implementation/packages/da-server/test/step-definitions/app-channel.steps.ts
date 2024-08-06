import { When } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { createMeta } from './generic.steps';
import {
    GetOrCreateChannelRequest
} from '@kite9/fdc3-common'
import { handleResolve } from "@kite9/testing";

When('{string} creates or gets an app channel called {string}', function (this: CustomWorld, app: string, channel: string) {
    const meta = createMeta(this, app)
    const uuid = this.sc.getInstanceUUID(meta.source)!!
    const message = {
        meta,
        payload: {
            channelId: handleResolve(channel, this)
        },
        type: 'getOrCreateChannelRequest'
    } as GetOrCreateChannelRequest

    this.server.receive(message, uuid)
})
