import { Given, When } from 'quickpickle';
import { CustomWorld } from '../world/index.js';
import { handleResolve } from '@finos/testing';
import { DefaultDesktopAgentIntentResolver } from '../../src/ui/DefaultDesktopAgentIntentResolver.js';
import { INTENT_RESOLVER_URL } from '../support/MockFDC3Server.js';
import { FDC3_USER_INTERFACE_RESOLVE_ACTION_TYPE } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { Context } from '@finos/fdc3-context';
import { loggingSettings } from './desktop-agent.steps.js';
import { Logger } from '@finos/fdc3-agent-proxy/src/util/Logger';

Logger.setLogLevel(loggingSettings.connection);

const contextMap: Record<string, Context> = {
  'fdc3.instrument': {
    type: 'fdc3.instrument',
    name: 'Apple',
    id: {
      ticker: 'AAPL',
    },
  },
  'fdc3.country': {
    type: 'fdc3.country',
    name: 'Sweden',
    id: {
      COUNTRY_ISOALPHA2: 'SE',
      COUNTRY_ISOALPHA3: 'SWE',
    },
  },
  'fdc3.unsupported': {
    type: 'fdc3.unsupported',
    bogus: true,
  },
};

Given('{string} is a {string} context', (world: CustomWorld, field: string, type: string) => {
  world.props[field] = contextMap[type];
});

Given('An Intent Resolver in {string}', async (world: CustomWorld, field: string) => {
  const cs = new DefaultDesktopAgentIntentResolver(INTENT_RESOLVER_URL);
  world.props[field] = cs;
  await cs.connect();
});

Given('{string} is an AppIntents array with a ViewNews intent and two apps', (world: CustomWorld, field: string) => {
  world.props[field] = [
    {
      intent: {
        name: 'ViewNews',
      },
      apps: [
        {
          appId: 'app1',
        },
        {
          appId: 'app2',
        },
      ],
    },
  ];
});

When(
  'I call {string} with {string} with parameters {string} and {string} for a promise',
  (world: CustomWorld, field: string, fnName: string, param1: string, param2: string) => {
    try {
      const object = handleResolve(field, world);
      const fn = object[fnName];
      const arg0 = handleResolve(param1, world);
      const arg1 = handleResolve(param2, world);
      const result = fn.call(object, arg0, arg1);
      world.props['result'] = result;
    } catch (error) {
      world.props['result'] = error;
    }
  }
);

Given('The intent resolver sends an intent selection message', async (world: CustomWorld) => {
  const port = handleResolve('{childDoc.iframes[0].messageChannels[0].port2}', world);

  port.postMessage({
    type: FDC3_USER_INTERFACE_RESOLVE_ACTION_TYPE,
    payload: {
      action: 'click',
      appIdentifier: {
        appId: 'app1',
      },
      intent: 'ViewNews',
    },
  });
});

Given('The intent resolver cancels the intent selection message', async (world: CustomWorld) => {
  const port = handleResolve('{childDoc.iframes[0].messageChannels[0].port2}', world);

  port.postMessage({
    type: FDC3_USER_INTERFACE_RESOLVE_ACTION_TYPE,
    payload: {
      action: 'cancel',
    },
  });
});

// Given('{string} receives a {string} message for the intent resolver and pipes comms to {string}', async function (this: CustomWorld, frame: string, type: string, output: string) {
//     const channelSelectorIframe = handleResolve(frame, this)
//     const mc = new MessageChannel();
//     const internalPort = mc.port1;
//     const externalPort = mc.port2;

//     if (type == "SelectorMessageInitialize") {
//         globalThis.window.dispatchEvent({
//             type: 'message',
//             data: {
//                 type: 'SelectorMessageInitialize'
//             },
//             origin: globalThis.window.location.origin,
//             ports: [externalPort],
//             source: channelSelectorIframe
//         } as any)
//     }

//     const out: any[] = []
//     this.props[output] = out

//     internalPort.start()
//     internalPort.onmessage = (e) => {
//         out.push({ type: e.type, data: e.data })
//     }
// });
