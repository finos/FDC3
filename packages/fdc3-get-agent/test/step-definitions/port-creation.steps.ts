import { Given, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../world';
import { handleResolve } from '@kite9/testing';

Given(
  '{string} receives a {string} message for the {string} and creates port {string}',
  async function (this: CustomWorld, frame: string, type: string, _item: string, port: string) {
    const channelSelectorIframe = handleResolve(frame, this);
    const mc = new MessageChannel();
    const internalPort = mc.port1;
    const externalPort = mc.port2;

    if (type == 'SelectorMessageInitialize') {
      // TODO: Update typings
      const eventDetails: any = {
        type: 'message',
        data: {
          type: 'SelectorMessageInitialize',
        },
        origin: globalThis.window.location.origin,
        ports: [externalPort],
        source: channelSelectorIframe,
      };
      globalThis.window.dispatchEvent(eventDetails);
    }

    internalPort.start();
    this.props[port] = internalPort;
  }
);

Given('{string} pipes messages to {string}', async function (this: CustomWorld, port: string, output: string) {
  // TODO: Update typings
  const out: any[] = [];
  this.props[output] = out;

  const internalPort = handleResolve(port, this);
  internalPort.onmessage = (e: any) => {
    out.push({ type: e.type, data: e.data });
  };
});

Then('{string} receives a {string} message', function (this: CustomWorld, port: string, type: string) {
  const internalPort: MessagePort = handleResolve(port, this);

  if (type == 'ResolverMessageChoice') {
    internalPort.postMessage({
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
