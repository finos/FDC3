import { expect } from 'chai';
import { handleFail, wrapPromise } from '../../utils';
import { closeMockAppWindow } from '../fdc3-conformance-utils';
import { Listener } from '@finos/fdc3';
import { MetadataValidator, MetadataFdc3Api } from '../support/metadata-support';
import { APIDocumentation } from '../support/apiDocuments';
import { ControlContextType } from '../support/intent-support';

const setInstanceMetadataDocs = '\r\nDocumentation: ' + APIDocumentation.appMetadata + '\r\nCause: ';
const validator = new MetadataValidator();
const api = new MetadataFdc3Api();

export default async () =>
  describe('fdc3.setInstanceMetadata', () => {
    let listener: Listener | undefined;

    it('Method is callable', async () => {
      try {
        await api.setInstanceMetadata({ title: 'callable test' });
      } catch (ex) {
        handleFail(setInstanceMetadataDocs, ex);
      }
    });

    it('(SetInstanceMetadata1) Instance metadata set by an instance is returned via getAppMetadata', async function () {
      this.timeout(10000);

      const title = 'AAPL Stock Chart';

      try {
        const appControlChannel = await api.retrieveAppControlChannel();

        const wrapper = wrapPromise();
        listener = await appControlChannel.addContextListener(ControlContextType.INSTANCE_METADATA_SET, async () => {
          wrapper.resolve();
        });

        // open an instance of the metadata app and instruct it (via the launch context)
        // to set its own instance metadata title
        const appIdentifier = await api.openMetadataAppWithContext({
          type: 'setInstanceMetadataAppContext',
          title,
        });
        validator.validateAppIdentifier(appIdentifier);

        // wait for the opened app to confirm it has set its instance metadata
        await wrapper.promise;

        // retrieve the metadata for the opened instance and confirm the title was stored
        const metadata = await api.getAppMetadata(appIdentifier);
        validator.validateAppMetadata(metadata);

        expect(
          metadata.instanceId,
          `The AppMetadata.instanceId should match the opened instance's instanceId.${setInstanceMetadataDocs}`
        ).to.be.equal(appIdentifier.instanceId);

        expect(
          metadata.instanceMetadata,
          `The AppMetadata object should contain an instanceMetadata property after setInstanceMetadata was called.${setInstanceMetadataDocs}`
        ).to.not.be.equal(undefined);

        expect(
          metadata.instanceMetadata?.title,
          `The AppMetadata.instanceMetadata.title should match the title set via setInstanceMetadata.${setInstanceMetadataDocs}`
        ).to.be.equal(title);
      } finally {
        await closeMockAppWindow(this.currentTest?.title ?? 'Unknown Test');

        if (listener) {
          listener.unsubscribe();
          listener = undefined;
        }
      }
    });
  });
