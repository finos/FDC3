import { Channel, Context, DesktopAgent, Listener } from 'fdc3_2_0';
import { AppControlContext } from '../../context-types';
import constants from '../../constants';
import { wait } from '../../utils';

declare let fdc3: DesktopAgent;

export async function closeMockAppWindow(testId: string) {
  await broadcastCloseWindow(testId);
  await waitForMockAppToClose(testId);
}

async function waitForMockAppToClose(testId: string) {
  const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
  await waitForContext('windowClosed', testId, appControlChannel);
  await wait(constants.WindowCloseWaitTime); // wait for window to close
}

const broadcastCloseWindow = async currentTest => {
  const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
  appControlChannel.broadcast({
    type: 'closeWindow',
    testId: currentTest,
  } as AppControlContext);
};

export const waitForContext = (contextType: string, testId: string, channel?: Channel): Promise<Context> => {
  let executionListener: Listener;
  return new Promise<Context>(async resolve => {
    console.log(Date.now() + ` Waiting for type: "${contextType}", on channel: "${channel.id}" in test: "${testId}"`);

    const handler = (context: AppControlContext) => {
      if (testId) {
        console.log(` ${testId} VS ${context.testId}`);
        if (testId == context.testId) {
          console.log(Date.now() + ` Received ${contextType} for test: ${testId}`);
          resolve(context);
          if (executionListener) executionListener.unsubscribe();
        } else {
          console.warn(
            Date.now() +
              ` Ignoring "${contextType}" context due to mismatched testId (expected: "${testId}", got "${context.testId}")`
          );
        }
      } else {
        console.log(Date.now() + ` Received (without testId) "${contextType}" for test: "${testId}"`);
        resolve(context);
        if (executionListener) executionListener.unsubscribe();
      }
    };

    if (channel === undefined) {
      executionListener = await fdc3.addContextListener(contextType, handler);
    } else {
      console.log('adding listener in waitforcontext');
      executionListener = await channel.addContextListener(contextType, handler);
      //App channels do not auto-broadcast current context when you start listening, so retrieve current context to avoid races
      const ccHandler = async (context: AppControlContext) => {
        if (context) {
          if (testId) {
            if (testId == context?.testId && context?.type == contextType) {
              console.log(Date.now() + ` Received "${contextType}" (from current context) for test: "${testId}"`);
              if (executionListener) executionListener.unsubscribe();
              resolve(context);
            } //do not warn as it will be ignoring mismatches which will be common
            else {
              console.log(
                Date.now() +
                  ` CHecking for current context of type "${contextType}" for test: "${testId}" Current context did ${context ? '' : 'NOT '} exist,
              had testId: "${context?.testId}" (${testId == context?.testId ? 'did match' : 'did NOT match'})
              and type "${context?.type}" vs ${contextType} (${context?.type == contextType ? 'did match' : 'did NOT match'})`
              );
            }
          } else {
            console.log(Date.now() + ` Received "${contextType}" (from current context) for an unspecified test`);
            if (executionListener) executionListener.unsubscribe();
            resolve(context);
          }
        }
      };
      channel.getCurrentContext().then(ccHandler);
    }
  });
};
