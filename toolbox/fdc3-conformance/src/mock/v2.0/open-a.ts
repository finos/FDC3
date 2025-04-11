import { closeWindowOnCompletion } from './mock-functions';
import { getAgent } from '@finos/fdc3';
import { sendContextToTests } from '../v2.0/mock-functions';
import { AppControlContext } from '../../context-types';
import { ControlContextType } from '../../test/v2.0/support/intent-support-2.0';

getAgent().then(async fdc3 => {
  await closeWindowOnCompletion(fdc3);
  await fdc3.addContextListener('shouldNotReceiveThisContext', async context => {
    // broadcast that this app has received context
    if (context.type !== 'shouldNotReceiveThisContext') {
      await sendContextToTests(fdc3, {
        type: ControlContextType.CONTEXT_RECEIVED,
        errorMessage: `Listener received incorrect context type. Listener listening for 'shouldNotReceiveThisContext' type received '${context.type}' type`,
      } as AppControlContext);
    }
  });
});
