import { assert, expect } from 'chai';
import { DesktopAgent } from 'fdc3_1_2';
import { versionIsAtLeast } from 'fdc3_1_2';
import { APIDocumentation1_2 } from '../apiDocuments-1.2';

declare let fdc3: DesktopAgent;
const getInfoDocs = '\r\nDocumentation: ' + APIDocumentation1_2.getInfo + '\r\nCause';

export default () =>
  describe('fdc3.getInfo1', () => {
    it('Method is callable', async () => {
      try {
        fdc3.getInfo();
      } catch (ex) {
        assert.fail('\r\nDocumentation: ' + APIDocumentation1_2.getInfo + '\r\nCause' + (ex.message ?? ex));
      }
    });

    it('(GetInfo1) Returns a valid ImplementationMetadata object', async () => {
      try {
        const implMetadata = fdc3.getInfo();
        expect(implMetadata, `ImplementationMetadata did not have property fdc3Version${getInfoDocs}`).to.have.property(
          'fdc3Version'
        );
        const isFDC3v1_2 = versionIsAtLeast(implMetadata, '1.2');
        expect(isFDC3v1_2).to.be.true;
        expect(implMetadata, `ImplementationMetadata did not have property provider${getInfoDocs}`).to.have.property(
          'provider'
        );
        expect(implMetadata.provider).to.not.be.equal('');
      } catch (ex) {
        assert.fail(getInfoDocs + (ex.message ?? ex));
      }
    });
  });
