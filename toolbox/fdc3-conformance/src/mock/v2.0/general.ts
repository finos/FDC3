import { closeWindowOnCompletion, onFdc3Ready } from './mock-functions';
import { DesktopAgent } from 'fdc3_2_0/dist/api/DesktopAgent';
import { Context } from 'fdc3_2_0';
import { sendContextToTests } from '../v2.0/mock-functions';
import { AppControlContext } from '../../context-types';
declare let fdc3: DesktopAgent;

onFdc3Ready().then(async () => {
  await closeWindowOnCompletion();

  //used in AOpensB1
  const implementationMetadata = await fdc3.getInfo();
  let { appId } = implementationMetadata.appMetadata;

  let appOpenedContext: AppControlContext = {
    type: 'fdc3-conformance-opened',
  };

  if (appId !== 'MockAppId') {
    appOpenedContext.errorMessage = `Incorrect appId retrieved from getInfo(). Expected MockAppId, got ${appId}`;
  }

  // broadcast that this app has opened
  await sendContextToTests(appOpenedContext as AppControlContext);

  // Context listeners used by tests.
  await fdc3.addContextListener('fdc3.instrument', async context => {
    // broadcast that this app has received context
    await sendContextToTests({
      type: 'context-received',
      context: context,
    } as ContextSender);
  });
});

export interface ContextSender extends Context {
  context?: Context;
}
