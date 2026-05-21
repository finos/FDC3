import { Channel, Context, DesktopAgent, Listener } from '@finos/fdc3';
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
  appControlChannel.broadcast({
    type: 'closeWindow',
    testId: currentTest,
  } as AppControlContext);
};

export const waitForContext = async (
  contextType: string,
  testId: string,
  channel: Channel,
  count = 1
): Promise<AppControlContextListener & { listener: Listener }> => {
  let promiseResolve: (c: Context) => void;
  let promiseReject: (x: unknown) => void;

  const listenerPromise = new Promise<Context>((resolve, reject) => {
    promiseResolve = resolve;
    promiseReject = reject;
  });

  setTimeout(() => {
    if (count > 0) {
      promiseReject(new Error("App didn't return close context within 1 sec"));
    }
  }, 1000);

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
