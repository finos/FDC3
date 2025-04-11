import { assert } from 'chai';
import constants from '../../constants';
import { openApp, OpenCommonConfig, OpenControl } from './control/open-control';
import { ControlContextType } from '../v2.0/support/intent-support-2.0';

export function getCommonOpenTests(control: OpenControl<any>, documentation: string, config: OpenCommonConfig) {
  const AOpensB3 = `(${config.prefix}AOpensB3) Can open app B from app A with no context and ${config.targetMultiple} as config.target`;
  it(AOpensB3, async () => {
    let targetApp: any;
    targetApp = control.createTargetApp(openApp.b.name, openApp.b.id);
    const result = control.contextReceiver('fdc3-conformance-opened');
    await control.openMockApp(targetApp);
    await result;
    await control.closeMockApp(AOpensB3);
  });

  const AFailsToOpenB3 = `(${config.prefix}AFailsToOpenB3) Receive AppNotFound error when targeting non-existent app AppMetadata (${config.targetMultiple}) as config.target`;
  it(AFailsToOpenB3, async () => {
    try {
      let targetApp: any;
      targetApp = control.createTargetApp('ThisAppDoesNotExist', 'ThisAppDoesNotExist');
      await control.openMockApp(targetApp);
      assert.fail('No error was not thrown', documentation);
    } catch (ex) {
      control.confirmAppNotFoundErrorReceived(ex);
    }
  });

  const AOpensBWithContext3 = `(${config.prefix}AOpensBWithContext3) Can open app B from app A with context and AppMetadata (${config.targetMultiple}) as target, app B adds generic listener`;
  it(AOpensBWithContext3, async () => {
    let context: any, targetApp: any;
    context = { type: 'fdc3.instrument', name: 'context' };
    targetApp = control.createTargetApp(openApp.b.name, openApp.b.id);
    const receiver = control.contextReceiver(ControlContextType.CONTEXT_RECEIVED);
    await control.openMockApp(targetApp, context);
    await control.validateReceivedContext(await receiver, 'fdc3.instrument');
    await control.closeMockApp(AOpensBWithContext3);
  });

  const AOpensBWithSpecificContext = `(${config.prefix}AOpensBWithSpecificContext) Can open app B from app A with context and ${config.targetMultiple} as config.target and app B is expecting context`;
  it(AOpensBWithSpecificContext, async () => {
    let context: any, targetApp: any;
    context = { type: 'fdc3.instrument', name: 'context' };
    targetApp = control.createTargetApp(openApp.b.name, openApp.b.id);
    const receiver = control.contextReceiver(ControlContextType.CONTEXT_RECEIVED);
    await control.openMockApp(targetApp, context);
    await control.validateReceivedContext(await receiver, 'fdc3.instrument');
    await control.closeMockApp(AOpensBWithSpecificContext);
  });

  const AOpensBMultipleListen = `(${config.prefix}AOpensBMultipleListen) Can open app B from app A with context and ${config.targetMultiple} as config.target but app B has multiple listeners added before the correct one`;
  it(AOpensBMultipleListen, async () => {
    let context: any, targetApp: any;
    context = { type: 'fdc3.instrument', name: 'context' };
    targetApp = control.createTargetApp(openApp.b.name, openApp.b.id);
    const receiver = control.contextReceiver(ControlContextType.CONTEXT_RECEIVED);
    await control.openMockApp(targetApp, context);
    await receiver;
    await control.validateReceivedContext(await receiver, 'fdc3.instrument');
    await control.closeMockApp(AOpensBMultipleListen);
  });

  const AOpensBWithWrongContext = `(${config.prefix}AOpensBWithWrongContext) Received App timeout when opening app B with fake context, app b listening for different context`;
  it(AOpensBWithWrongContext, async () => {
    await control.addListenerAndFailIfReceived();
    let targetApp = control.createTargetApp(openApp.b.name, openApp.b.id);
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
}
