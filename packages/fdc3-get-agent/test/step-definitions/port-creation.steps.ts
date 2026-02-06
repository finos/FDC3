import { Given, Then } from 'quickpickle';
import { CustomWorld } from '../world/index.js';
import { handleResolve } from '@finos/testing';
import wtf from 'wtfnode';

Given(
  '{string} receives a {string} message for the {string} and creates port {string}',
  async (world: CustomWorld, frame: string, type: string, _item: string, port: string) => {
    const channelSelectorIframe = handleResolve(frame, world);
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
    world.props[port] = internalPort;
  }
);

Given('{string} pipes messages to {string}', async (world: CustomWorld, port: string, output: string) => {
  const out: { type: string; data: unknown }[] = [];
  world.props[output] = out;

  const internalPort = handleResolve(port, world);
  internalPort.onmessage = (e: MessageEvent) => {
    out.push({ type: e.type, data: e.data });
  };
});

Given('Testing ends after {string} ms', (world: CustomWorld, string: string) => {
  setTimeout(() => {
    wtf.dump();

    process.exit();
  }, parseInt(string));
});

Then('{string} receives a {string} message', (world: CustomWorld, port: string, type: string) => {
  const internalPort = handleResolve(port, world);

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
