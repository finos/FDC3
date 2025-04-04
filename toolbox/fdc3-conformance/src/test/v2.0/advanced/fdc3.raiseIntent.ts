import { ChannelError, PrivateChannel, Listener } from 'fdc3_2_0';
import { assert, expect } from 'chai';
import {
  RaiseIntentControl2_0,
  IntentResultType,
  IntentApp,
  ContextType,
  Intent,
  ControlContextType,
} from '../support/intent-support-2.0';
import { closeMockAppWindow } from '../fdc3-2_0-utils';

const control = new RaiseIntentControl2_0();

/**
 * Details on the mock apps used in these tests can be found in /mock/README.md
 */
export default () =>
  describe('fdc3.raiseIntent', () => {
    let errorListener: Listener = undefined;

    afterEach(async function afterEach() {
      await closeMockAppWindow(this.currentTest.title);

      if (errorListener) {
        errorListener.unsubscribe();
        errorListener = undefined;
      }
    });

    const RaiseIntentSingleResolve =
      "(2.0-RaiseIntentSingleResolve) Should start app intent-a when raising intent 'aTestingIntent1' with context 'testContextX'";
    it(RaiseIntentSingleResolve, async () => {
      errorListener = await control.listenForError();
      const result = control.receiveContext(ControlContextType.aTestingIntentListenerTriggered);
      const intentResolution = await control.raiseIntent(Intent.aTestingIntent, ContextType.testContextX);
      control.validateIntentResolution(IntentApp.IntentAppA, intentResolution);
      await result;
    });

    const RaiseIntentTargetedAppResolve =
      "(2.0-RaiseIntentTargetedAppResolve) Should start app intent-b when raising intent 'sharedTestingIntent1' with context 'testContextX'";
    it(RaiseIntentTargetedAppResolve, async () => {
      errorListener = await control.listenForError();
      const result = control.receiveContext(ControlContextType.sharedTestingIntent1ListenerTriggered);
      const intentResolution = await control.raiseIntent(Intent.sharedTestingIntent1, ContextType.testContextX, {
        appId: IntentApp.IntentAppB,
      });
      control.validateIntentResolution(IntentApp.IntentAppB, intentResolution);
      await result;
    });

    const RaiseIntentTargetedInstanceResolveOpen =
      "(2.0-RaiseIntentTargetedInstanceResolveOpen) Should target running instance of intent-a app when raising intent 'aTestingIntent1' with context 'testContextX' after opening intent-a app";
    it(RaiseIntentTargetedInstanceResolveOpen, async () => {
      // add app control listeners
      errorListener = await control.listenForError();
      const confirmAppOpened = control.receiveContext('intent-app-a-opened');
      const result = control.receiveContext(ControlContextType.aTestingIntentListenerTriggered);

      const appIdentifier = await control.openIntentApp(IntentApp.IntentAppA);
      await confirmAppOpened;

      const intentResolution = await control.raiseIntent(
        Intent.aTestingIntent,
        ContextType.testContextX,
        appIdentifier
      );
      await result;
      control.validateIntentResolution(IntentApp.IntentAppA, intentResolution);
      const instances = await control.findInstances(IntentApp.IntentAppA);
      control.validateInstances(instances, 1, appIdentifier.instanceId, (await result).instanceId);
    });

    const RaiseIntentTargetedInstanceResolveFindInstances =
      "(2.0-RaiseIntentTargetedInstanceResolveFindInstances) Should start app intent-a when targeted by raising intent 'aTestingIntent1' with context 'testContextX'";
    it(RaiseIntentTargetedInstanceResolveFindInstances, async () => {
      // add app control listeners
      errorListener = await control.listenForError();
      const confirmAppOpened = control.receiveContext('intent-app-a-opened');
      const result = control.receiveContext(ControlContextType.aTestingIntentListenerTriggered);

      const appOpen = control.receiveContext(ControlContextType.intentAppAOpened, 2000, 1);
      const appIdentifier = await control.openIntentApp(IntentApp.IntentAppA);

      await appOpen;

      const instances = await control.findInstances(IntentApp.IntentAppA);
      control.validateInstances(instances, 1, appIdentifier.instanceId);
      await confirmAppOpened;

      const intentResolution = await control.raiseIntent(Intent.aTestingIntent, ContextType.testContextX, instances[0]);
      await result;
      control.validateIntentResolution(IntentApp.IntentAppA, intentResolution);

      const instances2 = await control.findInstances(IntentApp.IntentAppA);
      expect(instances2.length).to.be.equal(1); //make sure no other instance is started
    });

    const PrivateChannelsAreNotAppChannels =
      '(2.0-PrivateChannelsAreNotAppChannels) Cannot create an app channel using a private channel id';
    it(PrivateChannelsAreNotAppChannels, async () => {
      errorListener = await control.listenForError();
      const privChan = await control.createPrivateChannel();
      control.validatePrivateChannel(privChan);
      const privChan2 = await control.createPrivateChannel();
      control.validatePrivateChannel(privChan2);

      expect(privChan.id).to.not.be.equal(privChan2.id); //check that the ids of both private channels are different
      try {
        await control.createAppChannel(privChan.id);
        assert.fail('No error was not thrown when calling fdc3.getOrCreateChannel(privateChannel.id)');
      } catch (ex) {
        expect(ex).to.have.property(
          'message',
          ChannelError.AccessDenied,
          `Incorrect error received when calling fdc3.getOrCreateChannel(privateChannel.id). Expected AccessDenied, got ${ex.message}`
        );
      }

      const intentResolution = await control.raiseIntent(
        Intent.privateChannelIsPrivate,
        ContextType.privateChannelDetails,
        undefined,
        undefined,
        { key: privChan2.id }
      );
      control.validateIntentResolution(IntentApp.IntentAppJ, intentResolution);
      let result = await control.getIntentResult(intentResolution);
      control.validateIntentResult(result, IntentResultType.Context, ContextType.privateChannelDetails);
    });

    const PrivateChannelsLifecycleEvents =
      '(2.0-PrivateChannelsLifecycleEvents) PrivateChannel lifecycle events are triggered when expected';
    it(PrivateChannelsLifecycleEvents, async () => {
      errorListener = await control.listenForError();
      const onUnsubscribeReceiver = control.receiveContext(ControlContextType.onUnsubscribeTriggered);
      const intentResolution = await control.raiseIntent(Intent.kTestingIntent, ContextType.testContextX, {
        appId: IntentApp.IntentAppK,
      });
      control.validateIntentResolution(IntentApp.IntentAppK, intentResolution);
      let result = await control.getIntentResult(intentResolution);
      control.validateIntentResult(result, IntentResultType.PrivateChannel);
      let listener = await control.receiveContextStreamFromMockApp(<PrivateChannel>result, 1, 5);
      control.unsubscribeListener(listener);

      await onUnsubscribeReceiver; //should receive context from privChannel.onUnsubscribe in mock app
      const textContextXReceiver = control.receiveContext(ContextType.testContextX);
      control.privateChannelBroadcast(<PrivateChannel>result, ContextType.testContextX);
      await textContextXReceiver;
      const onUnsubscribeReceiver2 = control.receiveContext(ControlContextType.onUnsubscribeTriggered);
      const onDisconnectReceiver = control.receiveContext(ControlContextType.onDisconnectTriggered);
      let listener2 = await control.receiveContextStreamFromMockApp(<PrivateChannel>result, 6, 10);
      control.disconnectPrivateChannel(<PrivateChannel>result);

      //confirm that onUnsubscribe and onDisconnect were triggered in intent-k
      await onUnsubscribeReceiver2;
      await onDisconnectReceiver;
      control.unsubscribeListener(listener2);
    });
  });
