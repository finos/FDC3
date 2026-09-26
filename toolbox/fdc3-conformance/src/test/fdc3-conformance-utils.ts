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

/**
 * Close the non-FDC3 Open App B fixture. It cannot receive the FDC3 control-channel
 * message used by closeMockAppWindow, so this uses a same-origin BroadcastChannel.
 */
export async function closeNonFdc3OpenAppBWindows() {
  if (!('BroadcastChannel' in window)) {
    console.warn('BroadcastChannel is unavailable; cannot request cleanup of non-FDC3 Open App B windows');
    return;
  }

  const channel = new BroadcastChannel('fdc3-conformance-open-b-cleanup');
  const requestId = crypto.randomUUID();
  let retryTimer: number | undefined;
  let timeout: number | undefined;

  try {
    await new Promise<void>(resolve => {
      const finish = () => {
        if (retryTimer !== undefined) window.clearInterval(retryTimer);
        if (timeout !== undefined) window.clearTimeout(timeout);
        resolve();
      };

      channel.addEventListener('message', event => {
        if (event.data?.type === 'close-open-b-ack' && event.data.requestId === requestId) {
          finish();
        }
      });

      const sendCloseRequest = () => channel.postMessage({ type: 'close-open-b', requestId });
      sendCloseRequest();
      retryTimer = window.setInterval(sendCloseRequest, constants.ShortWait / 4);
      timeout = window.setTimeout(finish, constants.WaitTime);
    });
  } finally {
    channel.close();
  }

  await wait(constants.WindowCloseWaitTime);
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
