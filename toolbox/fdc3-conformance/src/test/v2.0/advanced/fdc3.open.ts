import constants from '../../../constants';
import { getCommonOpenTests } from '../../common/fdc3.open';
import { openApp, OpenCommonConfig } from '../../common/control/open-control';
import { APIDocumentation2_0 } from '../apiDocuments-2.0';
import { OpenControl2_0 } from '../support/open-support-2.0';
import { DesktopAgent } from 'fdc3_2_0';
import { assert, expect } from 'chai';

const openDocs = '\r\nDocumentation: ' + APIDocumentation2_0 + '\r\nCause:';
const control = new OpenControl2_0();
declare let fdc3: DesktopAgent;
const config: OpenCommonConfig = {
  fdc3Version: '2.0',
  prefix: '2.0-',
  target: 'AppIdentifier',
  targetMultiple: 'AppIdentifier',
};

export default () =>
  describe('fdc3.open', () => {
    //run common open tests
    getCommonOpenTests(control, openDocs, config);

    //run v2.0-only open tests

    const AOpensB4 =
      '(AOpensB4) Can open app B from app A with appId as config.target, and recieves the same appId and also contains InstanceId';
    it(AOpensB4, async () => {
      const result = control.contextReceiver('fdc3-conformance-opened');
      const targetApp = { appId: openApp.b.id };
      const instanceIdentifier = await control.openMockApp(targetApp);
      expect(instanceIdentifier.appId).to.eq(openApp.b.id);
      expect(instanceIdentifier).to.have.property('instanceId');
      await result;
      await control.closeMockApp(AOpensB4);
    });
  });
