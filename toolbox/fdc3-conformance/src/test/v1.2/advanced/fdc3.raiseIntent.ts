import { AppMetadata, Context, IntentResolution, DesktopAgent } from 'fdc3_1_2';
import { assert, expect } from 'chai';
import constants from '../../../constants';
import { sleep } from '../../../utils';
import { APIDocumentation1_2 } from '../apiDocuments-1.2';
import { ContextType, Intent, IntentApp } from '../support/intent-support-1.2';
import { closeMockAppWindow } from '../fdc3-1_2-utils';

declare let fdc3: DesktopAgent;
const raiseIntentDocs = '\r\nDocumentation: ' + APIDocumentation1_2.raiseIntent + '\r\nCause';

/**
 * Details on the mock apps used in these tests can be found in /mock/README.md
 */
export default () =>
  describe('fdc3.raiseIntent', () => {
    afterEach(async function afterEach() {
      await closeMockAppWindow(this.currentTest.title);
    });

    const test1 =
      "(SingleResolve1) Should start app intent-b when raising intent 'sharedTestingIntent1' with context 'testContextY'";
    it(test1, async () => {
      const result = createReceiver('fdc3-intent-b-opened');
      console.log('receiver added');
      const intentResolution = await fdc3.raiseIntent(Intent.sharedTestingIntent1, {
        type: ContextType.testContextY,
      });

      validateIntentResolution(IntentApp.IntentAppB, intentResolution);
      await result;
    });

    const test2 =
      "(TargetedResolve1) Should start app intent-a when targeted by raising intent 'aTestingIntent' with context 'testContextX'";
    it(test2, async () => {
      const result = createReceiver('fdc3-intent-a-opened');
      const intentResolution = await fdc3.raiseIntent(
        Intent.aTestingIntent,
        {
          type: ContextType.testContextX,
        },
        IntentApp.IntentAppA
      );
      validateIntentResolution(IntentApp.IntentAppA, intentResolution);
      await result;
    });

    const test3 =
      "(TargetedResolve2) Should start app intent-a when targeted (name) by raising intent 'aTestingIntent' with context 'testContextX'";
    it(test3, async () => {
      const result = createReceiver('fdc3-intent-a-opened');
      const intentResolution = await fdc3.raiseIntent(
        Intent.aTestingIntent,
        {
          type: ContextType.testContextX,
        },
        { name: IntentApp.IntentAppA }
      );

      validateIntentResolution(IntentApp.IntentAppA, intentResolution);
      await result;
    });

    const test4 =
      "(TargetedResolve3) Should start app intent-a when targeted (name and appId) by raising intent 'aTestingIntent' with context 'testContextX'";
    it(test4, async () => {
      const result = createReceiver('fdc3-intent-a-opened');
      const intentResolution = await fdc3.raiseIntent(
        Intent.aTestingIntent,
        {
          type: ContextType.testContextX,
        },
        { name: IntentApp.IntentAppA, appId: 'IntentAppAId' }
      );
      validateIntentResolution(IntentApp.IntentAppA, intentResolution);
      await result;
    });
  });

const validateIntentResolution = (appName: string, intentResolution: IntentResolution) => {
  if (typeof intentResolution.source === 'string') {
    expect(intentResolution.source).to.eq(appName, raiseIntentDocs);
  } else if (typeof intentResolution.source === 'object') {
    expect((intentResolution.source as AppMetadata).name).to.eq(appName, raiseIntentDocs);
  } else assert.fail('Invalid intent resolution object');
};

// creates a channel and subscribes for broadcast contexts. This is
// used by the 'mock app' to send messages back to the test runner for validation
const createReceiver = async (contextType: string) => {
  let timeout;
  const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
  const messageReceived = new Promise<Context>(async (resolve, reject) => {
    const listener = appControlChannel.addContextListener(contextType, context => {
      resolve(context);
      clearTimeout(timeout);
      listener.unsubscribe();
    });

    //if no context received reject promise
    const { promise: sleepPromise, timeout: theTimeout } = sleep();
    timeout = theTimeout;
    await sleepPromise;
    reject(new Error('No context received from app B'));
  });

  return messageReceived;
};
