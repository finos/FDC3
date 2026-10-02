// SPDX-License-Identifier: Apache-2.0
import { AppIdentifier, Channel, Context, DesktopAgent, Listener } from '@finos/fdc3';
import { AppControlContext, AppControlContextListener } from '../context-types';
import constants from '../constants';
import { wait } from '../utils';

declare let fdc3: DesktopAgent;

export async function closeMockAppWindow(testId: string, count: number = 1) {
  const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
  const { listenerPromise: contextPromise, listener } = await waitForContext(
    'windowClosed',
    testId,
    appControlChannel,
    count
  );
  await broadcastCloseWindow(testId);
  try {
    await contextPromise;
  } finally {
    listener.unsubscribe();
  }
  await wait(constants.WindowCloseWaitTime); // wait for window to close
}

const broadcastCloseWindow = async (currentTest: string) => {
  const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
  await appControlChannel.broadcast({
    type: 'closeWindow',
    testId: currentTest,
  } as AppControlContext);
};

export const waitForContext = async (
  contextType: string,
  testId: string,
  channel: Channel,
  count = 1,
  timeoutMs = constants.WaitTime
): Promise<AppControlContextListener & { listener: Listener }> => {
  let promiseResolve: (c: Context) => void;
  let promiseReject: (x: unknown) => void;

  const listenerPromise = new Promise<Context>((resolve, reject) => {
    promiseResolve = resolve;
    promiseReject = reject;
  });

  setTimeout(() => {
    if (count > 0) {
      promiseReject(new Error(`App didn't return ${contextType} context within ${timeoutMs} ms`));
    }
  }, timeoutMs);

  const listener = await channel.addContextListener(contextType, ctx => {
    if (ctx['testId'] == testId) {
      console.log(`Received ${contextType}`);
      count--;
      if (count == 0) {
        promiseResolve(ctx);
      } else {
        console.log(`Waiting for ${count} more ${contextType}`);
      }
    } else {
      console.log(`Wrong test id expected:  ${testId} got: ${ctx['testId']}`);
    }
  });

  return {
    listenerPromise,
    listener,
  };
};

/** Register before opening an app, since its readiness broadcast may precede open() resolving. */
export async function listenForMockAppReady(agent: DesktopAgent, contextType: string) {
  const channel = await agent.getOrCreateChannel(constants.ControlChannel);
  const readyInstances = new Set<string>();
  const pending = new Map<string, () => void>();
  const key = (app: AppIdentifier) => JSON.stringify([app.appId, app.instanceId]);
  const listener = await channel.addContextListener(contextType, (_context, metadata) => {
    if (metadata?.source.instanceId) {
      const instance = key(metadata.source);
      readyInstances.add(instance);
      pending.get(instance)?.();
    }
  });

  return {
    async waitFor(app: AppIdentifier): Promise<void> {
      const instance = key(app);
      if (readyInstances.has(instance)) return;
      let timeout: ReturnType<typeof setTimeout> | undefined;
      try {
        await new Promise<void>((resolve, reject) => {
          pending.set(instance, resolve);
          timeout = setTimeout(
            () => reject(new Error(`Mock app ${instance} did not broadcast ${contextType}`)),
            constants.WaitTime
          );
        });
      } finally {
        clearTimeout(timeout);
        pending.delete(instance);
      }
    },
    unsubscribe: () => listener.unsubscribe(),
  };
}
