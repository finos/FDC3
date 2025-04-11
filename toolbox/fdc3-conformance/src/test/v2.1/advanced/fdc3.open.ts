import constants from '../../../constants';
import { getCommonOpenTests } from '../../common/fdc3.open';
import { openApp, OpenCommonConfig } from '../../common/control/open-control';
import { APIDocumentation2_1 } from '../apiDocuments-2.1';
import { OpenControl2_1 } from '../support/open-support-2.1';
import { DesktopAgent } from '@finos/fdc3';
import { assert, expect } from 'chai';
import { ControlContextType } from '../../v2.0/support/intent-support-2.0';

const openDocs = '\r\nDocumentation: ' + APIDocumentation2_1 + '\r\nCause:';
const control = new OpenControl2_1();
declare let fdc3: DesktopAgent;
const config: OpenCommonConfig = {
  fdc3Version: '2.1',
  prefix: '2.1-',
  target: 'AppIdentifier',
  targetMultiple: 'AppIdentifier',
};

export default () =>
  describe('fdc3.open', () => {
    //run common open tests
    getCommonOpenTests(control, openDocs, config);

    //run v2.0-only open tests
    const AOpensBMalformedContext = `(AOpensBMalformedContext) App B listeners receive nothing when passing a malformed context`;
    it(AOpensBMalformedContext, async () => {
      const receiver = control.contextReceiver(ControlContextType.CONTEXT_RECEIVED);
      await control.openMockApp(openApp.f.name);
      await receiver;
      await control.closeMockApp(AOpensBMalformedContext);
    });
  });
