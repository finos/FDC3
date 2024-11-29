import { Given, When } from '@cucumber/cucumber';
import { CustomWorld } from '../world';
import { handleResolve } from '@kite9/testing';
import { DefaultDesktopAgentIntentResolver } from '../../src/ui/DefaultDesktopAgentIntentResolver';
import { INTENT_RESPOLVER_URL } from '../support/MockFDC3Server';
import { FDC3_USER_INTERFACE_RESOLVE_ACTION_TYPE } from '@kite9/fdc3-schema/dist/generated/api/BrowserTypes';

const contextMap: Record<string, any> = {
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

Given('{string} is a {string} context', function (this: CustomWorld, field: string, type: string) {
  this.props[field] = contextMap[type];
});

Given('An Intent Resolver in {string}', async function (this: CustomWorld, field: string) {
  const cs = new DefaultDesktopAgentIntentResolver(INTENT_RESPOLVER_URL);
  this.props[field] = cs;
  await cs.connect();
});

Given(
  '{string} is an AppIntents array with a ViewNews intent and two apps',
  function (this: CustomWorld, field: string) {
    this.props[field] = [
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
  }
);

When(
  'I call {string} with {string} with parameters {string} and {string} for a promise',
  function (this: CustomWorld, field: string, fnName: string, param1: string, param2: string) {
    try {
      const object = handleResolve(field, this);
      const fn = object[fnName];
      const arg0 = handleResolve(param1, this);
      const arg1 = handleResolve(param2, this);
      const result = fn.call(object, arg0, arg1);
      this.props['result'] = result;
    } catch (error) {
      this.props['result'] = error;
    }
  }
);

Given('The intent resolver sends an intent selection message', async function (this: CustomWorld) {
  const port = handleResolve('{document.iframes[0].messageChannels[0].port2}', this);

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

Given('The intent resolver cancels the intent selection message', async function (this: CustomWorld) {
  const port = handleResolve('{document.iframes[0].messageChannels[0].port2}', this);

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
