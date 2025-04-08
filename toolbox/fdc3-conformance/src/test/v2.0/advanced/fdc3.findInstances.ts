import { assert, expect } from 'chai';
import { APIDocumentation2_0 } from '../../v2.0/apiDocuments-2.0';
import { failOnTimeout, wait, wrapPromise } from '../../../utils';
import { closeMockAppWindow } from '../fdc3-2_0-utils';
import { IntentUtilityContext } from '../../../context-types';
import { MetadataFdc3Api } from '../support/metadata-support-2.0';
import {
  ContextType,
  ControlContextType,
  Intent,
  IntentApp,
  RaiseIntentControl2_0,
} from '../support/intent-support-2.0';
import { AppIdentifier, IntentResolution } from '@finos/fdc3';

const findInstancesDocs = '\r\nDocumentation: ' + APIDocumentation2_0.findInstances + '\r\nCause: ';

const control = new RaiseIntentControl2_0();

export default () =>
  describe('fdc3.findInstances', () => {
    after(async function after() {
      await closeMockAppWindow(this.currentTest.title, 2);
    });

    const findInstances = '(2.0-FindInstances) valid appID when opening multiple instances of the same app';
    it(findInstances, async () => {
      const api = new MetadataFdc3Api();
      let listener;
      try {
        const appIdentifier = await control.openIntentApp(IntentApp.IntentAppA); // open IntentAppA
        const appIdentifier2 = await control.openIntentApp(IntentApp.IntentAppA); // open second instance of IntentAppA

        //confirm that the instanceId for both app instantiations is different
        expect(
          appIdentifier.instanceId,
          `The AppIdentifier's instanceId property for both instances of the opened app should not be the same.${findInstancesDocs}`
        ).to.not.equal(appIdentifier2.instanceId);

        let instances = await control.findInstances(IntentApp.IntentAppA);
        validateInstances(instances, appIdentifier, appIdentifier2);

        const timeout = failOnTimeout(
          `'${ControlContextType.aTestingIntentListenerTriggered}' context not received from mock app`
        ); // fail if expected context not received
        const wrapper = wrapPromise();
        const appControlChannel = await api.retrieveAppControlChannel();

        //ensure appIdentifier received the raised intent
        listener = await appControlChannel.addContextListener(
          ControlContextType.aTestingIntentListenerTriggered,
          (context: IntentUtilityContext) => {
            expect(
              context['instanceId'],
              'the raised intent was received by a different instance of the mock app than expected'
            ).to.be.equals(appIdentifier.instanceId);
            clearTimeout(timeout);
            wrapper.resolve();
          }
        );

        const resolution = await api.raiseIntent(Intent.aTestingIntent, ContextType.testContextX, appIdentifier); // raise an intent that targets appIdentifier
        validateResolutionSource(resolution, appIdentifier);
        await wrapper.promise; // wait for context from IntentAppA
      } catch (ex) {
        assert.fail(findInstancesDocs + (ex.message ?? ex));
      } finally {
        control.unsubscribeListener(listener);
      }
    });
  });

function validateResolutionSource(resolution: IntentResolution, appIdentifier: AppIdentifier) {
  // check that resolution.source matches the appIdentifier
  expect(
    resolution.source.appId,
    "IntentResolution.source.appId did not match the mock app's AppIdentifier's appId"
  ).to.be.equal(appIdentifier.appId);
  expect(
    resolution.source.instanceId,
    "IntentResolution.source.instanceId did not match the mock app's AppIdentifier's instanceId"
  ).to.be.equal(appIdentifier.instanceId);
}

function validateInstances(instances: AppIdentifier[], appIdentifier: AppIdentifier, appIdentifier2: AppIdentifier) {
  // check that the retrieved instances match both the retrieved appIdentifiers
  const compareAppIdentifiers = (a: AppIdentifier, b: AppIdentifier) =>
    a.appId === b.appId && a.instanceId === b.instanceId;

  if (
    !(
      instances.some(instance => compareAppIdentifiers(instance, appIdentifier)) &&
      instances.some(instance => compareAppIdentifiers(instance, appIdentifier2))
    )
  ) {
    assert.fail(
      `At least one AppIdentifier object is missing from the AppIdentifier array returned after calling fdc3.findInstances(app: AppIdentifier)${findInstancesDocs}`
    );
  }
}
