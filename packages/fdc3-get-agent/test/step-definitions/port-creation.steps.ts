import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../world';
import { handleResolve } from '@finos/fdc3-testing';
// used to debug tests not ending - only available as a commonJs module
// eslint-disable-next-line @typescript-eslint/no-require-imports
const wtf = require('wtfnode');

Given(
  '{string} receives a {string} message for the {string} and creates port {string}',
  async function (this: CustomWorld, frame: string, type: string, _item: string, port: string) {
    const channelSelectorIframe = handleResolve(frame, this);
    const mc = new MessageChannel();
    const internalPort = mc.port1;
    const externalPort = mc.port2;

    if (type == 'SelectorMessageInitialize') {
      globalThis.window.dispatchEvent({
        type: 'message',
        data: {
          type: 'SelectorMessageInitialize',
        },
        origin: globalThis.window.location.origin,
        ports: [externalPort],
        source: channelSelectorIframe,
      } as unknown as Event);
    }

    internalPort.start();
    this.props[port] = internalPort;
  }
);

Given('{string} pipes messages to {string}', async function (this: CustomWorld, port: string, output: string) {
  const out: { type: string; data: unknown }[] = [];
  this.props[output] = out;

  const internalPort = handleResolve(port, this);
  internalPort.onmessage = (e: MessageEvent) => {
    out.push({ type: e.type, data: e.data });
  };
});

/**
 * Avoid checking this in as a line in .features - just used for debugging
 */
Given('Testing ends after {string} ms', function (string) {
  setTimeout(() => {
    wtf.dump();

    process.exit();
  }, parseInt(string));
});

Then('{string} receives a {string} message', function (this: CustomWorld, port: string, type: string) {
  const internalPort = handleResolve(port, this);

  if (type == 'ResolverMessageChoice') {
    (internalPort as MessagePort).postMessage({
      type,
      payload: {
        intent: 'viewNews',
        target: {
          appId: 'test-app-1',
        },
      },
    });
  }
});
