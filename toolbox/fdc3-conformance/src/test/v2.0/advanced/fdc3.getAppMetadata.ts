import { expect } from 'chai';
import { APIDocumentation2_0 } from '../apiDocuments-2.0';
import { MetadataFdc3Api, MetadataValidator } from '../support/metadata-support-2.0';
import { closeMockAppWindow } from '../fdc3-2_0-utils';
import { handleFail } from '../../../utils';

const getMetadataDocs = '\r\nDocumentation: ' + APIDocumentation2_0.appMetadata + '\r\nCause: ';
const validator = new MetadataValidator();
const api = new MetadataFdc3Api();

export default () =>
  describe('fdc3.getAppMetadata', () => {
    after(async () => {
      await closeMockAppWindow(appInstanceMetadata);
    });

    it('Method is callable', async () => {
      try {
        await api.getAppMetadata();
      } catch (ex) {
        handleFail(getMetadataDocs, ex);
      }
    });

    it('(2.0-GetAppMetadata) Valid metadata object', async () => {
      try {
        //retrieve AppMetadata object
        const metadata = await api.getAppMetadata();
        validator.validateAppMetadata(metadata);
      } catch (ex) {
        handleFail(getMetadataDocs, ex);
      }
    });

    const appInstanceMetadata = '(2.0-AppInstanceMetadata) App instance metadata is valid';
    it(appInstanceMetadata, async () => {
      try {
        const appIdentifier1 = await api.openMetadataApp();
        validator.validateAppIdentifier(appIdentifier1);

        const appIdentifier2 = await api.openMetadataApp(); //open a second instance of the same app
        validator.validateAppIdentifier(appIdentifier2);

        // check instanceId is different for both instantiations of the app
        expect(
          appIdentifier1.instanceId,
          `The AppIdentifier instanceId properties for both instances of the opened app should not match.${getMetadataDocs}`
        ).to.not.equal(appIdentifier2.instanceId);

        const metadata1 = await api.getAppMetadata(appIdentifier1);
        validator.validateAppMetadata(metadata1);

        validateMatchingInstanceIds(
          metadata1.instanceId ?? 'unknown-md1-id',
          appIdentifier1.instanceId ?? 'unknown-app1-id'
        );

        const metadata2 = await api.getAppMetadata(appIdentifier2);

        expect(
          metadata2,
          `The AppIdentifier object should contain an instanceId property.${getMetadataDocs}`
        ).to.have.property('instanceId');

        validateMatchingInstanceIds(
          metadata2.instanceId ?? 'unknown-md2-id',
          appIdentifier2.instanceId ?? 'unknown-app2-id'
        );
      } catch (ex) {
        handleFail(getMetadataDocs, ex);
      }
    });
  });

function validateMatchingInstanceIds(instanceId1: string, instanceId2: string) {
  expect(instanceId1, 'The AppMetaData instanceId properties do not match').to.be.equal(instanceId2);
}
