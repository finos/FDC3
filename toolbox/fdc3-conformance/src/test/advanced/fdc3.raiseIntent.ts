import { ChannelError, PrivateChannel, Listener, getAgent, DesktopAgent } from '@finos/fdc3';
import { assert, expect } from 'chai';
import {
  RaiseIntentControl,
  IntentResultType,
  IntentApp,
  ContextType,
  Intent,
  ControlContextType,
} from '../support/intent-support';
import { closeMockAppWindow } from '../fdc3-conformance-utils';

/**
 * Details on the mock apps used in these tests can be found in /mock/README.md
 */
export default async () =>
  describe('fdc3.raiseIntent', () => {
    let errorListener: Listener | undefined = undefined;
    let control: RaiseIntentControl;
    let fdc3: DesktopAgent;

    beforeEach(async () => {
      fdc3 = await getAgent();
      control = new RaiseIntentControl(fdc3);
    });

    afterEach(async function afterEach() {
      await closeMockAppWindow(this.currentTest?.title ?? 'Unknown Test');

      if (errorListener) {
        errorListener.unsubscribe();
        errorListener = undefined;
      }
    });

    const RaiseIntentSingleResolve =
      "(RaiseIntentSingleResolve) Should start app intent-a when raising intent 'aTestingIntent1' with context 'testContextX'";
    it(RaiseIntentSingleResolve, async () => {
      errorListener = await control.listenForError();
      const result = control.receiveContext(ControlContextType.A_TESTING_INTENT_LISTENER_TRIGGERED);
      const intentResolution = await control.raiseIntent(Intent.aTestingIntent, ContextType.testContextX);
      control.validateIntentResolution(IntentApp.IntentAppA, intentResolution);
      await result;
    });

    const RaiseIntentTargetedAppResolve =
      "(RaiseIntentTargetedAppResolve) Should start app intent-b when raising intent 'sharedTestingIntent1' with context 'testContextX'";
    it(RaiseIntentTargetedAppResolve, async () => {
      errorListener = await control.listenForError();
      const result = control.receiveContext(ControlContextType.SHARED_TESTING_INTENT1_LISTENER_TRIGGERED);
      const intentResolution = await control.raiseIntent(Intent.sharedTestingIntent1, ContextType.testContextX, {
        appId: IntentApp.IntentAppB,
      });
      control.validateIntentResolution(IntentApp.IntentAppB, intentResolution);
      await result;
    });

    const RaiseIntentTargetedInstanceResolveOpen =
      "(RaiseIntentTargetedInstanceResolveOpen) Should target running instance of intent-a app when raising intent 'aTestingIntent1' with context 'testContextX' after opening intent-a app";
    it(RaiseIntentTargetedInstanceResolveOpen, async () => {
      // add app control listeners
      errorListener = await control.listenForError();
      const confirmAppOpened = control.receiveContext('intent-app-a-opened');
      const result = control.receiveContext(ControlContextType.A_TESTING_INTENT_LISTENER_TRIGGERED);

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
      "(RaiseIntentTargetedInstanceResolveFindInstances) Should start app intent-a when targeted by raising intent 'aTestingIntent1' with context 'testContextX'";
    it(RaiseIntentTargetedInstanceResolveFindInstances, async () => {
      // add app control listeners
      errorListener = await control.listenForError();
      const confirmAppOpened = control.receiveContext('intent-app-a-opened');
      const result = control.receiveContext(ControlContextType.A_TESTING_INTENT_LISTENER_TRIGGERED);

      const appOpen = control.receiveContext(ControlContextType.INTENT_APP_A_OPENED, 2000, 1);
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

    const RaiseIntentNewInstanceForced =
      "(RaiseIntentNewInstanceForced) Should launch a new instance of intent-a when raising intent 'aTestingIntent1' with context 'testContextX', newInstance=true and an instance is already running";
    it(RaiseIntentNewInstanceForced, async () => {
      // add app control listeners
      errorListener = await control.listenForError();
      const appOpen = control.receiveContext(ControlContextType.INTENT_APP_A_OPENED, 2000, 1);
      const result = control.receiveContext(ControlContextType.A_TESTING_INTENT_LISTENER_TRIGGERED);

      // Start an instance of intent-a up front so there is an existing instance available
      const appIdentifier = await control.openIntentApp(IntentApp.IntentAppA);
      await appOpen;
      const instancesBefore = await control.findInstances(IntentApp.IntentAppA);
      control.validateInstances(instancesBefore, 1, appIdentifier.instanceId);

      // Raise the intent targeting the appId with newInstance=true - a NEW instance MUST be launched
      const intentResolution = await control.raiseIntent(
        Intent.aTestingIntent,
        ContextType.testContextX,
        { appId: IntentApp.IntentAppA },
        0,
        undefined,
        true
      );
      await result;
      control.validateIntentResolution(IntentApp.IntentAppA, intentResolution);

      // A second instance should now exist and the intent should NOT have been delivered to the original instance
      const instancesAfter = await control.findInstances(IntentApp.IntentAppA);
      expect(instancesAfter.length, 'A new instance should have been launched').to.be.equal(2);
      expect(intentResolution.source.instanceId).to.not.be.equal(appIdentifier.instanceId);
    });

    const RaiseIntentExistingInstanceRequired =
      "(RaiseIntentExistingInstanceRequired) Should deliver to the existing instance of intent-a when raising intent 'aTestingIntent1' with context 'testContextX' and newInstance=false";
    it(RaiseIntentExistingInstanceRequired, async () => {
      // add app control listeners
      errorListener = await control.listenForError();
      const appOpen = control.receiveContext(ControlContextType.INTENT_APP_A_OPENED, 2000, 1);
      const result = control.receiveContext(ControlContextType.A_TESTING_INTENT_LISTENER_TRIGGERED);

      // Start an instance of intent-a up front
      const appIdentifier = await control.openIntentApp(IntentApp.IntentAppA);
      await appOpen;
      const instancesBefore = await control.findInstances(IntentApp.IntentAppA);
      control.validateInstances(instancesBefore, 1, appIdentifier.instanceId);

      // Raise the intent targeting the appId with newInstance=false - the existing instance MUST be used
      const intentResolution = await control.raiseIntent(
        Intent.aTestingIntent,
        ContextType.testContextX,
        { appId: IntentApp.IntentAppA },
        0,
        undefined,
        false
      );
      await result;
      control.validateIntentResolution(IntentApp.IntentAppA, intentResolution);

      // No new instance should have been started and the intent must have gone to the existing instance
      const instancesAfter = await control.findInstances(IntentApp.IntentAppA);
      expect(instancesAfter.length, 'No new instance should have been launched').to.be.equal(1);
      expect(intentResolution.source.instanceId).to.be.equal(appIdentifier.instanceId);
    });

    const PrivateChannelsAreNotAppChannels =
      '(PrivateChannelsAreNotAppChannels) Cannot create an app channel using a private channel id';
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
        const message = ex instanceof Error ? ex.message : String(ex);

        expect(ex).to.have.property(
          'message',
          ChannelError.AccessDenied,
          `Incorrect error received when calling fdc3.getOrCreateChannel(privateChannel.id). Expected AccessDenied, got ${message}`
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
      const result = await control.getIntentResult(intentResolution);
      control.validateIntentResult(result, IntentResultType.Context, ContextType.privateChannelDetails);
    });

    const PrivateChannelsLifecycleEvents =
      '(PrivateChannelsLifecycleEvents) PrivateChannel lifecycle events are triggered when expected';
    it(PrivateChannelsLifecycleEvents, async () => {
      errorListener = await control.listenForError();
      const onUnsubscribeReceiver = control.receiveContext(ControlContextType.ON_UNSUBSCRIBE_TRIGGERED);
      const intentResolution = await control.raiseIntent(Intent.kTestingIntent, ContextType.testContextX, {
        appId: IntentApp.IntentAppK,
      });
      control.validateIntentResolution(IntentApp.IntentAppK, intentResolution);
      const result = await control.getIntentResult(intentResolution);
      control.validateIntentResult(result, IntentResultType.PrivateChannel);
      const listener = await control.receiveContextStreamFromMockApp(<PrivateChannel>result, 1, 5);
      control.unsubscribeListener(listener);

      await onUnsubscribeReceiver; //should receive context from privChannel addEventListener("unsubscribe") in mock app
      const textContextXReceiver = control.receiveContext(ContextType.testContextX);
      control.privateChannelBroadcast(<PrivateChannel>result, ContextType.testContextX);
      await textContextXReceiver;
      const onUnsubscribeReceiver2 = control.receiveContext(ControlContextType.ON_UNSUBSCRIBE_TRIGGERED);
      const onDisconnectReceiver = control.receiveContext(ControlContextType.ON_DISCONNECT_TRIGGERED);
      const listener2 = await control.receiveContextStreamFromMockApp(<PrivateChannel>result, 6, 10);
      control.disconnectPrivateChannel(<PrivateChannel>result);

      //confirm that unsubscribe and disconnect events were triggered in intent-k
      await onUnsubscribeReceiver2;
      await onDisconnectReceiver;
      control.unsubscribeListener(listener2);
    });
  });
