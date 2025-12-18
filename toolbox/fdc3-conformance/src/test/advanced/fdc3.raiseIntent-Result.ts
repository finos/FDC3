import { DesktopAgent, getAgent, Listener } from '@finos/fdc3';
import { closeMockAppWindow } from '../fdc3-2_0-utils';
import {
  RaiseIntentControl2_0,
  IntentResultType,
  IntentApp,
  ContextType,
  Intent,
  ControlContextType,
} from '../support/intent-support-2.0';
import constants from '../../constants';

export default () =>
  describe('fdc3.raiseIntent (Result)', () => {
    let errorListener: Listener | undefined = undefined;
    let control: RaiseIntentControl2_0;
    let fdc3: DesktopAgent;

    beforeEach(async () => {
      fdc3 = await getAgent();
      control = new RaiseIntentControl2_0(fdc3);
    });

    afterEach(async function afterEach() {
      await closeMockAppWindow(this.currentTest?.title ?? 'Unknown test');

      if (errorListener) {
        errorListener.unsubscribe();
        errorListener = undefined;
      }
    });

    const RaiseIntentVoidResult0secs = '(RaiseIntentVoidResult0secs) App A receives a void IntentResult';
    it(RaiseIntentVoidResult0secs, async () => {
      errorListener = await control.listenForError();
      const intentResolution = await control.raiseIntent(Intent.aTestingIntent, ContextType.testContextX);
      control.validateIntentResolution(IntentApp.IntentAppA, intentResolution);
      const intentResult = await control.getIntentResult(intentResolution);
      control.validateIntentResult(intentResult, IntentResultType.Void);
    });

    const RaiseIntentVoidResult5secs =
      '(RaiseIntentVoidResult5secs) App A receives a void IntentResult after a 5 second delay';
    it(RaiseIntentVoidResult5secs, async () => {
      errorListener = await control.listenForError();
      const receiver = control.receiveContext(ControlContextType.A_TESTING_INTENT_LISTENER_TRIGGERED, 8000);
      const intentResolution = await control.raiseIntent(
        Intent.aTestingIntent,
        ContextType.testContextX,
        undefined,
        5000
      );
      control.validateIntentResolution(IntentApp.IntentAppA, intentResolution);
      const intentResultPromise = control.getIntentResult(intentResolution);
      await receiver;

      if (intentResultPromise) {
        const intentResult = await intentResultPromise;
        control.validateIntentResult(intentResult, IntentResultType.Void);
      }
    });

    const RaiseIntentContextResult0secs = '(RaiseIntentContextResult0secs) IntentResult resolves to testContextY';
    it(RaiseIntentContextResult0secs, async () => {
      errorListener = await control.listenForError();
      const intentResolution = await control.raiseIntent(Intent.sharedTestingIntent1, ContextType.testContextY);
      control.validateIntentResolution(IntentApp.IntentAppB, intentResolution);
      const intentResult = await control.getIntentResult(intentResolution);
      control.validateIntentResult(intentResult, IntentResultType.Context, ContextType.testContextY);
    });

    const RaiseIntentContextResult5secs =
      '(RaiseIntentContextResult5secs) IntentResult resolves to testContextY instance after a 5 second delay';
    it(RaiseIntentContextResult5secs, async () => {
      errorListener = await control.listenForError();
      const receiver = control.receiveContext(ControlContextType.SHARED_TESTING_INTENT1_LISTENER_TRIGGERED, 8000);
      const intentResolution = await control.raiseIntent(
        Intent.sharedTestingIntent1,
        ContextType.testContextY,
        undefined,
        5000
      );
      control.validateIntentResolution(IntentApp.IntentAppB, intentResolution);
      const intentResultPromise = control.getIntentResult(intentResolution);
      await receiver;

      if (intentResultPromise) {
        const intentResult = await intentResultPromise;
        control.validateIntentResult(intentResult, IntentResultType.Context, ContextType.testContextY);
      }
    });

    const RaiseIntentChannelResult = '(RaiseIntentChannelResult) IntentResult resolves to a Channel object';
    it(RaiseIntentChannelResult, async () => {
      errorListener = await control.listenForError();
      const receiver = control.receiveContext(
        ControlContextType.SHARED_TESTING_INTENT_2_RESULT_SENT,
        constants.WaitTime
      );
      const intentResolution = await control.raiseIntent(Intent.sharedTestingIntent2, ContextType.testContextY, {
        appId: IntentApp.IntentAppE,
      });
      control.validateIntentResolution(IntentApp.IntentAppE, intentResolution);
      const intentResultPromise = control.getIntentResult(intentResolution);
      await receiver;

      if (intentResultPromise) {
        const intentResult = await intentResultPromise;
        control.validateIntentResult(intentResult, IntentResultType.Channel, (await receiver).instanceId);
      }
    });

    const RaiseIntentPrivateChannelResult =
      '(RaiseIntentPrivateChannelResult) IntentResult resolves to a private Channel object';
    it(RaiseIntentPrivateChannelResult, async () => {
      errorListener = await control.listenForError();
      const receiver = control.receiveContext(
        ControlContextType.SHARED_TESTING_INTENT_2_RESULT_SENT,
        constants.WaitTime
      );
      const intentResolution = await control.raiseIntent(Intent.sharedTestingIntent2, ContextType.testContextY, {
        appId: IntentApp.IntentAppF,
      });
      control.validateIntentResolution(IntentApp.IntentAppF, intentResolution);
      const intentResultPromise = control.getIntentResult(intentResolution);
      await receiver;

      if (intentResultPromise) {
        const intentResult = await intentResultPromise;
        control.validateIntentResult(intentResult, IntentResultType.PrivateChannel, (await receiver).instanceId);
      }
    });

    const RaiseIntentVoidResult61secs =
      '(RaiseIntentVoidResult61secs) App A receives a void IntentResult after a 61 second delay';
    it(RaiseIntentVoidResult61secs, async () => {
      errorListener = await control.listenForError();
      const receiver = control.receiveContext(ControlContextType.A_TESTING_INTENT_LISTENER_TRIGGERED, 64000);
      const intentResolution = await control.raiseIntent(
        Intent.aTestingIntent,
        ContextType.testContextX,
        undefined,
        61000
      );
      control.validateIntentResolution(IntentApp.IntentAppA, intentResolution);
      const intentResultPromise = control.getIntentResult(intentResolution);
      await receiver;

      if (intentResultPromise) {
        const intentResult = await intentResultPromise;
        control.validateIntentResult(intentResult, IntentResultType.Void);
      }
    }).timeout(80000);

    const RaiseIntentContextResult61secs =
      '(RaiseIntentContextResult61secs) IntentResult resolves to testContextY instance after a 61 second delay';
    it(RaiseIntentContextResult61secs, async () => {
      errorListener = await control.listenForError();
      const receiver = control.receiveContext(ControlContextType.SHARED_TESTING_INTENT1_LISTENER_TRIGGERED, 64000);
      const intentResolution = await control.raiseIntent(
        Intent.sharedTestingIntent1,
        ContextType.testContextY,
        undefined,
        61000
      );
      control.validateIntentResolution(IntentApp.IntentAppB, intentResolution);
      const intentResultPromise = control.getIntentResult(intentResolution);
      await receiver;

      if (intentResultPromise) {
        const intentResult = await intentResultPromise;
        control.validateIntentResult(intentResult, IntentResultType.Context, ContextType.testContextY);
      }
    }).timeout(80000);
  });
