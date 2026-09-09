import { DesktopAgent, getAgent, ResolveError } from '@finos/fdc3';
import { assert, expect } from 'chai';
import { APIDocumentation } from '../support/apiDocuments';
import { ContextType, IntentApp, Intent, RaiseIntentControl } from '../support/intent-support';
import constants from '../../constants';
import { wait } from '../../utils';
import { closeMockAppWindow } from '../fdc3-conformance-utils';

const raiseIntentDocs = '\r\nDocumentation: ' + APIDocumentation.raiseIntent + '\r\nCause';

/**
 * Details on the mock apps used in these tests can be found in /mock/README.md
 */
export default async () =>
  describe('fdc3.raiseIntent (throws error)', () => {
    let control: RaiseIntentControl;
    let fdc3: DesktopAgent;

    beforeEach(async () => {
      fdc3 = await getAgent();
      control = new RaiseIntentControl(fdc3);
    });

    const RaiseIntentFailedResolve =
      "(RaiseIntentFailedResolve) Should fail to raise intent when targeted app intent-a, context 'testContextY' and intent 'aTestingIntent' do not correlate";

    it(RaiseIntentFailedResolve, async () => {
      try {
        await control.raiseIntent(Intent.aTestingIntent, ContextType.testContextY);
        assert.fail('Expected the raised intent to be rejected with an error but no error was thrown');
      } catch (ex) {
        expect(ex, raiseIntentDocs).to.have.property('message', ResolveError.NoAppsFound);
      }
    });

    const RaiseIntentFailTargetedAppInstanceResolve1 =
      "(RaiseIntentFailTargetedAppInstanceResolve1) Should fail to raise intent when targeted app intent-a instance, context 'testContextY', intent 'aTestingIntent' and AppIdentifier IntentAppAId do not correlate";
    it(RaiseIntentFailTargetedAppInstanceResolve1, async () => {
      try {
        const appIdentifier = await control.openIntentApp(IntentApp.IntentAppA);
        await control.raiseIntent(Intent.aTestingIntent, ContextType.testContextY, appIdentifier);
        assert.fail('Expected the raised intent to be rejected with an error but no error was thrown');
      } catch (ex) {
        expect(ex, raiseIntentDocs).to.have.property('message', ResolveError.NoAppsFound);
      }
    });

    const RaiseIntentFailTargetedAppInstanceResolve2 =
      "(RaiseIntentFailTargetedAppInstanceResolve2) Should fail to raise intent when targeted app intent-a, context 'testContextY', intent 'aTestingIntent' and AppIdentifier IntentAppAId with instanceId property NonExistentInstanceId do not correlate";
    it(RaiseIntentFailTargetedAppInstanceResolve2, async () => {
      try {
        await control.raiseIntent(Intent.aTestingIntent, ContextType.testContextX, {
          appId: IntentApp.IntentAppA,
          instanceId: 'NonExistentInstanceId',
        });
        await wait(); // give test time to throw error
        assert.fail('Expected the raised intent to be rejected with an error but no error was thrown');
      } catch (ex) {
        expect(ex).to.have.property('message', ResolveError.TargetInstanceUnavailable);
      }
    });

    const RaiseIntentFailExistingInstanceRequired =
      '(RaiseIntentFailExistingInstanceRequired) Should fail to raise intent with newInstance=false when no running instance of the targeted app intent-a is available and throw TargetInstanceUnavailable error';
    it(RaiseIntentFailExistingInstanceRequired, async () => {
      try {
        const runningInstances = await control.findInstances(IntentApp.IntentAppA);
        if (runningInstances.length > 0) {
          await closeMockAppWindow(RaiseIntentFailExistingInstanceRequired, runningInstances.length);
        }

        // No instance of intent-a is running, so requiring an existing instance must fail
        await control.raiseIntent(
          Intent.aTestingIntent,
          ContextType.testContextX,
          { appId: IntentApp.IntentAppA },
          0,
          undefined,
          false
        );
        await wait(); // give test time to throw error
        assert.fail('Expected the raised intent to be rejected with an error but no error was thrown');
      } catch (ex) {
        expect(ex, raiseIntentDocs).to.have.property('message', ResolveError.TargetInstanceUnavailable);
      }
    });

    const RaiseIntentFailTargetedAppResolve1 =
      "(RaiseIntentFailTargetedAppResolve1) Should fail to raise intent when targeted app intent-a, context 'testContextY', intent 'aTestingIntent' and AppIdentifier IntentAppAId do not correlate";
    it(RaiseIntentFailTargetedAppResolve1, async () => {
      try {
        await control.raiseIntent(Intent.aTestingIntent, ContextType.testContextY, { appId: IntentApp.IntentAppA });
        await wait(); // give test time to throw error
        assert.fail('Expected the raised intent to be rejected with an error but no error was thrown');
      } catch (ex) {
        expect(ex, raiseIntentDocs).to.have.property('message', ResolveError.NoAppsFound);
      }
    });

    const RaiseIntentFailTargetedAppResolve2 =
      "(RaiseIntentFailTargetedAppResolve2) Should fail to raise intent when targeting non-existent app id, context 'testContextY', intent 'aTestingIntent' and throw TargetAppUnavailable error";
    it(RaiseIntentFailTargetedAppResolve2, async () => {
      try {
        await control.raiseIntent(Intent.aTestingIntent, ContextType.testContextX, { appId: 'NonExistentApp' });
        await wait(); // give test time to throw error
        assert.fail('Expected the raised intent to be rejected with an error but no error was thrown');
      } catch (ex) {
        expect(ex, raiseIntentDocs).to.have.property('message', ResolveError.TargetAppUnavailable);
      }
    });

    const RaiseIntentFailTargetedAppResolve3 =
      "(RaiseIntentFailTargetedAppResolve3) Should fail to raise intent when targeting an app that doesn't add an intent listener, context 'testContextY', intent 'sharedTestingIntent2' and throw IntentDeliveryFailed error";
    it(RaiseIntentFailTargetedAppResolve3, async () => {
      try {
        await control.raiseIntent(Intent.sharedTestingIntent2, ContextType.testContextY, {
          appId: IntentApp.IntentAppH,
        });
        assert.fail('Expected the raised intent to be rejected with an error but no error was thrown');
      } catch (ex) {
        expect(ex, raiseIntentDocs).to.have.property('message', ResolveError.IntentDeliveryFailed);
      }
      await closeMockAppWindow(RaiseIntentFailTargetedAppResolve3);
    }).timeout(constants.NoListenerTimeout + 1000);

    const RaiseIntentFailTargetedAppResolve4 =
      "(RaiseIntentFailTargetedAppResolve4) Should fail to raise intent when targeting an app that doesn't add an intent listener of the matching type, context 'testContextY', intent 'sharedTestingIntent2' and throw IntentDeliveryFailed error";
    it(RaiseIntentFailTargetedAppResolve4, async () => {
      try {
        await control.raiseIntent(Intent.sharedTestingIntent2, ContextType.testContextY, {
          appId: IntentApp.IntentAppI,
        });
        assert.fail('Expected the raised intent to be rejected with an error but no error was thrown');
      } catch (ex) {
        expect(ex, raiseIntentDocs).to.have.property('message', ResolveError.IntentDeliveryFailed);
      }
      await closeMockAppWindow(RaiseIntentFailTargetedAppResolve4);
    }).timeout(constants.NoListenerTimeout + 1000);
  });
