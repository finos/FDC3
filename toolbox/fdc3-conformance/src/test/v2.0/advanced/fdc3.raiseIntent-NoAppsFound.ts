import { ResolveError } from '@finos/fdc3';
import { assert, expect } from 'chai';
import { APIDocumentation2_0 } from '../apiDocuments-2.0';
import { ContextType, IntentApp, Intent, RaiseIntentControl2_0 } from '../support/intent-support-2.0';
import constants from '../../../constants';
import { sleep, wait } from '../../../utils';
import { closeMockAppWindow } from '../fdc3-2_0-utils';

const control = new RaiseIntentControl2_0();
const raiseIntentDocs = '\r\nDocumentation: ' + APIDocumentation2_0.raiseIntent + '\r\nCause';

/**
 * Details on the mock apps used in these tests can be found in /mock/README.md
 */
export default () =>
  describe('fdc3.raiseIntent (throws error)', () => {
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
      "(RaiseIntentFailTargetedAppResolve2) Should fail to raise intent when targeting non-existant app id, context 'testContextY', intent 'aTestingIntent' and throw TargetAppUnavailable error";
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
      "(RaiseIntentFailTargetedAppResolve3) Should fail to raise intent when targeting a non-existant app id, context 'testContextY', intent 'sharedTestingIntent2' and throw IntentDeliveryFailed error";
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
      "(RaiseIntentFailTargetedAppResolve4) Should throw an IntentDeliveryFailed error when raising intent with targeted app intent-i, context 'testContextY', intent 'sharedTestingIntent2'";
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
