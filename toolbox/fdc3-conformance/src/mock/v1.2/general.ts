import { closeWindowOnCompletion, onFdc3Ready } from './mock-functions';
import { DesktopAgent } from 'fdc3_1_2/dist/api/DesktopAgent';
import { Context } from 'fdc3_1_2';
import { sendContextToTests } from '../v1.2/mock-functions';

declare let fdc3: DesktopAgent;

onFdc3Ready().then(async () => {
  await closeWindowOnCompletion();

  // broadcast that this app has opened
  await sendContextToTests({
    type: 'fdc3-conformance-opened',
  });

  // Context listeners used by tests.
  fdc3.addContextListener('fdc3.instrument', async context => {
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
