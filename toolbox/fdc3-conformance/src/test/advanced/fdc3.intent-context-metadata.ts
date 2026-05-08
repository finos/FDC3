import { assert, expect } from 'chai';
import { getAgent } from '@finos/fdc3';
import { RaiseIntentControl, ContextType, ControlContextType, Intent, IntentApp } from '../support/intent-support';
import { ContextMetadataControlContext } from '../support/context-metadata-support';
import { closeMockAppWindow } from '../fdc3-conformance-utils';
import { wrapPromise } from '../../utils';
import constants from '../../constants';

export default async () => {
  const fdc3 = await getAgent();
  const control = new RaiseIntentControl(fdc3);

  return describe('fdc3.intentContextMetadata', () => {
    afterEach(async function afterEach() {
      await closeMockAppWindow(this.currentTest?.title ?? 'Unknown Test');
    });

    const intentMetadata =
      '(IntentContextMetadata) Should receive ContextMetadata with source and timestamp when an intent is raised';
    it(intentMetadata, async function () {
      this.timeout(constants.TestTimeout);

      const wrapper = wrapPromise();
      let receivedMetadata: ContextMetadataControlContext['contextMetadata'];

      const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
      const listener = await appControlChannel.addContextListener(
        ControlContextType.A_TESTING_INTENT_LISTENER_TRIGGERED,
        (context: ContextMetadataControlContext) => {
          receivedMetadata = context.contextMetadata;
          wrapper.resolve();
        }
      );

      const resolution = await control.raiseIntent(Intent.lTestingIntent, ContextType.testContextX, {
        appId: IntentApp.IntentAppL,
      });
      control.validateIntentResolution(IntentApp.IntentAppL, resolution);

      await wrapper.promise;
      listener.unsubscribe();

      assert.isDefined(receivedMetadata, 'No contextMetadata received from mock app');
      expect(receivedMetadata!.source).to.have.property('appId');
      expect(receivedMetadata!.timestamp).to.not.be.undefined;
    });

    const intentMetadataWithAppMeta =
      '(IntentContextMetadataWithAppMetadata) Should forward app-provided traceId, signature and custom in ContextMetadata on raised intent';
    it(intentMetadataWithAppMeta, async function () {
      this.timeout(constants.TestTimeout);

      const wrapper = wrapPromise();
      let receivedMetadata: ContextMetadataControlContext['contextMetadata'];

      const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
      const listener = await appControlChannel.addContextListener(
        ControlContextType.A_TESTING_INTENT_LISTENER_TRIGGERED,
        (context: ContextMetadataControlContext) => {
          receivedMetadata = context.contextMetadata;
          wrapper.resolve();
        }
      );

      // Raise intent with app-provided metadata
      const context = { type: ContextType.testContextX };
      await fdc3.raiseIntent(
        Intent.lTestingIntent,
        context,
        { appId: IntentApp.IntentAppL },
        {
          traceId: 'intent-trace-456',
          signature: { protected: 'protected-abc', signature: 'signature-abc' },
          custom: { priority: 'high' },
        }
      );

      await wrapper.promise;
      listener.unsubscribe();

      assert.isDefined(receivedMetadata, 'No contextMetadata received from mock app');
      expect(receivedMetadata!.source).to.have.property('appId');
      expect(receivedMetadata!.timestamp).to.not.be.undefined;
      expect(receivedMetadata!.traceId).to.be.equal('intent-trace-456');
      expect(receivedMetadata!.signature).to.be.equal('intent-sig');
      expect(receivedMetadata!.custom).to.have.property('priority');
      expect(receivedMetadata!.custom!.priority).to.be.equal('high');
    });
  });
};
