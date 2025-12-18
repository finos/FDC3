import constants from '../../constants';
import { openApp, OpenCommonConfig } from '../support/open-control';
import { APIDocumentation2_0 } from '../support/apiDocuments-2.0';
import { OpenControl2_0 } from '../support/open-support-2.0';
import { DesktopAgent, getAgent } from '@finos/fdc3';
import { assert, expect } from 'chai';
import { ControlContextType } from '../support/intent-support-2.0';

const documentation = '\r\nDocumentation: ' + APIDocumentation2_0 + '\r\nCause:';

const config: OpenCommonConfig = {
  fdc3Version: '2.0',
  prefix: '',
  target: 'AppIdentifier',
  targetMultiple: 'AppIdentifier',
};

export default () => {
  let control: OpenControl2_0;
  let fdc3: DesktopAgent;

  beforeEach(async () => {
    fdc3 = await getAgent();
    control = new OpenControl2_0(fdc3);
  });

  return describe('fdc3.open', () => {
    const AOpensB3 = `(${config.prefix}AOpensB3) Can open app B from app A with no context and ${config.targetMultiple} as config.target`;
    it(AOpensB3, async () => {
      const targetApp = control.createTargetAppIdentifier(openApp.b.id);
      const result = control.contextReceiver('fdc3-conformance-opened');
      await control.openMockApp(targetApp);
      await result;
      await control.closeMockApp(AOpensB3);
    });

    const AFailsToOpenB3 = `(${config.prefix}AFailsToOpenB3) Receive AppNotFound error when targeting non-existent app AppMetadata (${config.targetMultiple}) as config.target`;
    it(AFailsToOpenB3, async () => {
      try {
        const targetApp = control.createTargetAppIdentifier('ThisAppDoesNotExist');
        await control.openMockApp(targetApp);
        assert.fail('No error was not thrown', documentation);
      } catch (ex) {
        control.confirmAppNotFoundErrorReceived(ex);
      }
    });

    const AOpensBWithContext3 = `(${config.prefix}AOpensBWithContext3) Can open app B from app A with context and AppMetadata (${config.targetMultiple}) as target, app B adds generic listener`;
    it(AOpensBWithContext3, async () => {
      const context = { type: 'fdc3.instrument', name: 'context' };
      const targetApp = control.createTargetAppIdentifier(openApp.b.id);
      const receiver = control.contextReceiver(ControlContextType.CONTEXT_RECEIVED);
      await control.openMockApp(targetApp, context);
      await control.validateReceivedContext(await receiver, 'fdc3.instrument');
      await control.closeMockApp(AOpensBWithContext3);
    });

    const AOpensBWithSpecificContext = `(${config.prefix}AOpensBWithSpecificContext) Can open app B from app A with context and ${config.targetMultiple} as config.target and app B is expecting context`;
    it(AOpensBWithSpecificContext, async () => {
      const context = { type: 'fdc3.instrument', name: 'context' };
      const targetApp = control.createTargetAppIdentifier(openApp.b.id);
      const receiver = control.contextReceiver(ControlContextType.CONTEXT_RECEIVED);
      await control.openMockApp(targetApp, context);
      await control.validateReceivedContext(await receiver, 'fdc3.instrument');
      await control.closeMockApp(AOpensBWithSpecificContext);
    });

    const AOpensBMultipleListen = `(${config.prefix}AOpensBMultipleListen) Can open app B from app A with context and ${config.targetMultiple} as config.target but app B has multiple listeners added before the correct one`;
    it(AOpensBMultipleListen, async () => {
      const context = { type: 'fdc3.instrument', name: 'context' };
      const targetApp = control.createTargetAppIdentifier(openApp.b.id);
      const receiver = control.contextReceiver(ControlContextType.CONTEXT_RECEIVED);
      await control.openMockApp(targetApp, context);
      await receiver;
      await control.validateReceivedContext(await receiver, 'fdc3.instrument');
      await control.closeMockApp(AOpensBMultipleListen);
    });

    const AOpensBWithWrongContext = `(${config.prefix}AOpensBWithWrongContext) Received App timeout when opening app B with fake context, app b listening for different context`;
    it(AOpensBWithWrongContext, async () => {
      await control.addListenerAndFailIfReceived();
      const targetApp = control.createTargetAppIdentifier(openApp.b.id);
      let closed = false;
      setTimeout(() => {
        if (!closed) {
          control.closeMockApp(AOpensBWithWrongContext);
          closed = true;
        }
      }, constants.NoListenerTimeout + 100);

      await control.expectAppTimeoutErrorOnOpen(targetApp);
      if (!closed) {
        control.closeMockApp(AOpensBWithWrongContext);
        closed = true;
      }
    }).timeout(constants.NoListenerTimeout + 2000);

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
};
