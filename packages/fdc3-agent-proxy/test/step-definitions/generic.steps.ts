import { TestMessaging } from '../support/TestMessaging';
import { Given, When } from '@cucumber/cucumber';
import { CustomWorld } from '../world/index';
import {
  BasicDesktopAgent,
  DefaultAppSupport,
  DefaultChannelSupport,
  DefaultIntentSupport,
  DefaultHandshakeSupport,
} from '../../src';
import { SimpleIntentResolver, setupGenericSteps } from '@kite9/testing';
import { CHANNEL_STATE, SimpleChannelSelector } from '@kite9/testing/dist/src/agent';
import { BrowserTypes } from '@kite9/fdc3-schema';

Given('A Desktop Agent in {string}', async function (this: CustomWorld, field: string) {
  if (!this.messaging) {
    this.messaging = new TestMessaging(this.props[CHANNEL_STATE]);
  }

  const cs = new DefaultChannelSupport(this.messaging, new SimpleChannelSelector(this));
  const hs = new DefaultHandshakeSupport(this.messaging);
  const is = new DefaultIntentSupport(this.messaging, new SimpleIntentResolver(this));
  const as = new DefaultAppSupport(this.messaging);

  const da = new BasicDesktopAgent(hs, cs, is, as, [hs]);
  await da.connect();

  this.props[field] = da;
  this.props['result'] = null;
});

When('messaging receives a heartbeat event', function (this: CustomWorld) {
  this.messaging?.receive({
    type: 'heartbeatEvent',
    meta: this.messaging.createEventMeta(),
    payload: {
      timestamp: new Date(),
    },
  } as BrowserTypes.HeartbeatEvent);
});

setupGenericSteps();
