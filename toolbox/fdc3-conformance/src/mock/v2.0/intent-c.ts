import { closeWindowOnCompletion } from './mock-functions';
import { getAgent } from '@finos/fdc3';
import { sendContextToTests } from '../v2.0/mock-functions';
import { AppControlContext } from '../../context-types';
import { ControlContextType, Intent } from '../../test/v2.0/support/intent-support-2.0';

getAgent().then(async fdc3 => {
  await closeWindowOnCompletion(fdc3);

  try {
    await fdc3.addContextListener(null, async context => {
      // broadcast that this app has received context
      if (context.type === 'fdc3.instrument') {
        await sendContextToTests(fdc3, {
          type: ControlContextType.CONTEXT_RECEIVED,
          context: context,
        } as AppControlContext);
      }
    });
  } catch (ex) {
    const message = ex instanceof Error ? ex.message : String(ex);
    await sendContextToTests(fdc3, {
      type: ControlContextType.CONTEXT_RECEIVED,
      errorMessage: message,
    } as AppControlContext);
  }

  fdc3.addIntentListener(Intent.cTestingIntent, async context => {
    return context;
  });
});
