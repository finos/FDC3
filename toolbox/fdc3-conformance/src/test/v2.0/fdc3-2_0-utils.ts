import { Channel, Context, DesktopAgent, Listener } from '@finos/fdc3';
import { AppControlContext, AppControlContextListener } from '../../context-types';
import constants from '../../constants';
import { wait } from '../../utils';

declare let fdc3: DesktopAgent;

export async function closeMockAppWindow(testId: string, count: number = 1) {
  const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
  const { listenerPromise: contextPromise } = await waitForContext('windowClosed', testId, appControlChannel, count);
  await broadcastCloseWindow(testId);
  await contextPromise;
  await wait(constants.WindowCloseWaitTime); // wait for window to close
}

const broadcastCloseWindow = async currentTest => {
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
): Promise<AppControlContextListener> => {
  let promiseResolve;
  let promiseReject;

  const listenerPromise = new Promise<Context>((resolve, reject) => {
    promiseResolve = resolve;
    promiseReject = reject;
  });

  setTimeout(() => {
    if (count > 0) {
      promiseReject(new Error("App didn't return close context within .5 secs"));
    }
  }, 500);

  return channel
    .addContextListener(contextType, ctx => {
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
    })
    .then(cl => {
      return {
        listenerPromise,
      };
    });
};
