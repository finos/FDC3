import { Channel, Context, DesktopAgent, Listener } from '@finos/fdc3';
import { AppControlContext, AppControlContextListener } from '../context-types';
import constants from '../constants';
import { wait } from '../utils';

declare let fdc3: DesktopAgent;

/**
 * Tracks how many mock apps each test id has opened, so that cleanup code can close only the
 * mock apps that were actually opened - and wait for an acknowledgement from each of them -
 * instead of relying on hard-coded per-test exclusion lists or a fixed acknowledgement count.
 */
export class MockAppTracker {
  private readonly openedAppCountsByTestId = new Map<string, number>();

  markOpened(testId: string): void {
    const currentCount = this.openedAppCountsByTestId.get(testId) ?? 0;
    this.openedAppCountsByTestId.set(testId, currentCount + 1);
  }

  async closeIfOpened(testId: string): Promise<void> {
    const openedAppCount = this.openedAppCountsByTestId.get(testId);
    if (openedAppCount) {
      this.openedAppCountsByTestId.delete(testId);
      await closeMockAppWindow(testId, openedAppCount);
    }
  }
}

/**
 * Closes the mock app window(s) opened for a given test, waiting for a `windowClosed`
 * acknowledgement from each. The initial `closeWindow` broadcast and its acknowledgement(s)
 * occasionally go missing (e.g. under load, or if a mock app's close listener was still being
 * set up), so the broadcast is retried once, part-way through the overall wait, for whichever
 * acknowledgements have not yet arrived - rather than only ever waiting passively on the single
 * initial broadcast.
 */
export async function closeMockAppWindow(testId: string, count: number = 1) {
  const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
  const { listenerPromise: contextPromise, listener } = await waitForContext(
    'windowClosed',
    testId,
    appControlChannel,
    count,
    constants.WaitTime,
    () => broadcastCloseWindow(testId) // retry callback, invoked if not all acknowledgements have arrived by the midpoint
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
  timeoutMs = constants.WaitTime,
  onRetry?: () => void
): Promise<AppControlContextListener & { listener: Listener }> => {
  let promiseResolve: (c: Context) => void;
  let promiseReject: (x: unknown) => void;

  const listenerPromise = new Promise<Context>((resolve, reject) => {
    promiseResolve = resolve;
    promiseReject = reject;
  });

  if (onRetry) {
    // Re-send the triggering action part-way through the wait, in case the original
    // acknowledgement(s) were missed, rather than only ever waiting on a single attempt.
    setTimeout(() => {
      if (count > 0) {
        console.log(`Still waiting for ${count} more ${contextType}, retrying`);
        onRetry();
      }
    }, timeoutMs / 2);
  }

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
