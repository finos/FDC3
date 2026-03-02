import { closeWindowOnCompletion, sendContextToTests } from './mock-functions';
import { getAgent, Context } from '@finos/fdc3';
import { AppControlContext } from '../context-types';
import { appIdMatches } from '../utils';

getAgent().then(async fdc3 => {
  await closeWindowOnCompletion(fdc3);

  //used in AOpensB1
  const implementationMetadata = await fdc3.getInfo();
  const { appId } = implementationMetadata.appMetadata;

  const appOpenedContext: AppControlContext = {
    type: 'fdc3-conformance-opened',
  };

  if (!appIdMatches(appId, 'MockAppId')) {
    appOpenedContext.errorMessage = `Incorrect appId retrieved from getInfo(). Expected MockAppId, got ${appId}`;
  }

  // broadcast that this app has opened
  await sendContextToTests(fdc3, appOpenedContext as AppControlContext);

  // Context listeners used by tests.
  await fdc3.addContextListener('fdc3.instrument', async context => {
    // broadcast that this app has received context
    await sendContextToTests(fdc3, {
      type: 'context-received',
      context: context,
    } as ContextSender);
  });
});

export interface ContextSender extends Context {
  context?: Context;
}
