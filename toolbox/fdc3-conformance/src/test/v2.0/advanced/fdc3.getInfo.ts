import { expect } from 'chai';
import { handleFail } from '../../../utils';
import { closeMockAppWindow } from '../fdc3-2_0-utils';
import { Listener } from '@finos/fdc3';
import { MetadataValidator, MetadataContext, MetadataFdc3Api } from '../support/metadata-support-2.0';
import { APIDocumentation2_0 } from '../apiDocuments-2.0';
import { ControlContextType } from '../support/intent-support-2.0';

const getInfoDocs = '\r\nDocumentation: ' + APIDocumentation2_0.getInfo + '\r\nCause';
const validator = new MetadataValidator();
const api = new MetadataFdc3Api();

export default () =>
  describe('fdc3.getInfo', () => {
    let listener: Listener | undefined;

    after(async function after() {
      await closeMockAppWindow(this.currentTest?.title ?? 'Unknown Test');

      if (listener) {
        listener.unsubscribe();
        listener = undefined;
      }
    });

    it('Method is callable', async () => {
      try {
        await api.getInfo();
      } catch (ex) {
        handleFail(getInfoDocs, ex);
      }
    });

    it('(2.0-GetInfo1) Returns a valid ImplementationMetadata object', async () => {
      try {
        const implMetadata = await api.getInfo();
        validator.validateImplementationMetadata(implMetadata);
      } catch (ex) {
        handleFail(getInfoDocs, ex);
      }
    });

    it('(2.0-GetInfo2) Returns a valid ImplementationMetadata object', async function () {
      this.timeout(10000);
      const appControlChannel = await api.retrieveAppControlChannel();

      listener = await appControlChannel.addContextListener(
        ControlContextType.CONTEXT_LISTENER_TRIGGERED,
        async (context: MetadataContext) => {
          const implMetadata = context.implMetadata!;

          const appIdentifier = await api.openMetadataApp('metadataAppContext');
          validator.validateAppIdentifier(appIdentifier);

          // validate ImplementationMetadata
          expect(
            implMetadata,
            `ImplementationMetadata did not have property appMetadata${getInfoDocs}`
          ).to.have.property('appMetadata');

          validator.validateAppIdentifier(implMetadata.appMetadata);

          // make sure appId and instanceId from the imlMetadata and appIdentifier objects match
          expect(
            implMetadata.appMetadata.appId,
            `ImplementationMetadata.appMetadata.appId did not match the ApplicationIdentifier.appId retrieved from the opened app`
          ).to.be.equal(appIdentifier.appId);
          expect(
            implMetadata.appMetadata.instanceId,
            `ImplementationMetadata.appMetadata.instanceId did not match the ApplicationIdentifier.instanceId retrieved from the opened app`
          ).to.be.equal(appIdentifier.instanceId);

          // validate AppMetadata
          const metadata = await api.getAppMetadata();
          validator.validateAppMetadata(metadata);
        }
      );
    });
  });
