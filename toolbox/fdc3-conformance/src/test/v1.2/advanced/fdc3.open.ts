import { OpenControl1_2 } from '../support/open-support-1.2';
import { getCommonOpenTests } from '../../common/fdc3.open';
import { openApp, OpenCommonConfig } from '../../common/control/open-control';
import { assert } from 'chai';
import { APIDocumentation1_2 } from '../apiDocuments-1.2';
import { Context, TargetApp } from 'fdc3_1_2';

const openDocs = '\r\nDocumentation: ' + APIDocumentation1_2.open + '\r\nCause: ';
const control = new OpenControl1_2();

const config: OpenCommonConfig = {
  fdc3Version: '1.2',
  prefix: '',
  target: 'app name',
  targetMultiple: 'both app name and appId',
};

export default () =>
  describe('fdc3.open', () => {
    //run common open tests
    getCommonOpenTests(control, openDocs, config);

    //run 1.2-only tests

    const AOpensB1 = `(AOpensB1) Can open app B from app A with no context and ensure that the correct app was opened`;
    it(AOpensB1, async () => {
      let targetApp = openApp.b.name;
      const result = control.contextReceiver('fdc3-conformance-opened');
      await control.openMockApp(targetApp);
      await result;
      await control.closeMockApp(AOpensB1);
    });

    const AOpensB2 = '(AOpensB2) Can open app B from app A with no context and AppMetadata (name) as target';
    it(AOpensB2, async () => {
      let targetApp: TargetApp;
      targetApp = { name: openApp.b.name };
      const result = control.contextReceiver('fdc3-conformance-opened');
      await control.openMockApp(targetApp);
      await result;
      await control.closeMockApp(AOpensB2);
    });

    it(`(AFailsToOpenB1) Receive AppNotFound error when targeting non-existent app`, async () => {
      try {
        await control.openMockApp('ThisAppDoesNotExist');
        assert.fail('No error was thrown', openDocs);
      } catch (ex) {
        control.confirmAppNotFoundErrorReceived(ex);
      }
    });

    const AFailsToOpenB2Test =
      '(AFailsToOpenB2) Receive AppNotFound error when targeting non-existent app AppMetadata (name) as target';
    it(AFailsToOpenB2Test, async () => {
      try {
        let targetApp: TargetApp;
        targetApp = { name: 'ThisAppDoesNotExist' };
        await control.openMockApp(targetApp);
        assert.fail('No error was not thrown', openDocs);
      } catch (ex) {
        control.confirmAppNotFoundErrorReceived(ex);
      }
    });

    const AOpensBWithContext1 = `(AOpensBWithContext1) Can open app B from app A with context and appName as target, and app B listenss to that same context`;
    it(AOpensBWithContext1, async () => {
      let context: Context, targetApp: TargetApp;
      context = { type: 'fdc3.instrument', name: 'context' };
      targetApp = openApp.b.name;
      const receiver = control.contextReceiver('context-received');
      await control.openMockApp(targetApp, context);
      await control.validateReceivedContext(await receiver, 'fdc3.instrument');
      await control.closeMockApp(AOpensBWithContext1);
    });

    const AOpensBWithContext2 =
      '(AOpensBWithContext2) Can open app B from app A with context and AppMetadata (name) as target, app B adds generic listener';
    it(AOpensBWithContext2, async () => {
      let context: Context, targetApp: TargetApp;
      context = { type: 'fdc3.instrument', name: 'context' };
      targetApp = { name: openApp.b.name };
      const receiver = control.contextReceiver('context-received');
      await control.openMockApp(targetApp, context);
      await control.validateReceivedContext(await receiver, 'fdc3.instrument');
      await control.closeMockApp(AOpensBWithContext2);
    });
  });
