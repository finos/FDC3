import { closeWindowOnCompletion } from './mock-functions';
import { getAgent, Context } from '@finos/fdc3';
import { sendContextToTests } from '../v2.0/mock-functions';
import { AppControlContext } from '../../context-types';

getAgent().then(async fdc3 => {
  await closeWindowOnCompletion(fdc3);

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
