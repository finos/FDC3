import { TestMessaging } from '../support/TestMessaging';
import { Given, When } from '@cucumber/cucumber';
import { CustomWorld } from '../world/index';
import {
  DesktopAgentProxy,
  DefaultAppSupport,
  DefaultChannelSupport,
  DefaultIntentSupport,
  DefaultHeartbeatSupport,
} from '../../src';
import { SimpleIntentResolver, setupGenericSteps } from '@finos/testing';
import { CHANNEL_STATE, SimpleChannelSelector } from '@finos/testing/dist/src/agent';
import { HeartbeatEvent } from '@finos/fdc3-schema/generated/api/BrowserTypes';

Given('A Desktop Agent in {string}', async function (this: CustomWorld, field: string) {
  if (!this.messaging) {
    this.messaging = new TestMessaging(this.props[CHANNEL_STATE]);
  }

  const cs = new DefaultChannelSupport(this.messaging, new SimpleChannelSelector(this));
  const hs = new DefaultHeartbeatSupport(this.messaging);
  const is = new DefaultIntentSupport(this.messaging, new SimpleIntentResolver(this));
  const as = new DefaultAppSupport(this.messaging);

  const da = new DesktopAgentProxy(hs, cs, is, as, [hs], { debug: false, heartbeat: false });
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
  } as HeartbeatEvent);
});

setupGenericSteps();
