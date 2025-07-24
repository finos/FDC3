import { closeWindowOnCompletion } from './mock-functions';
import { getAgent } from '@finos/fdc3';
import { sendContextToTests } from '../v2.0/mock-functions';
import { wait } from '../../utils';
import { AppControlContext, IntentUtilityContext } from '../../context-types';
import { ControlContextType, Intent } from '../../test/support/intent-support-2.0';

getAgent().then(async fdc3 => {
  await closeWindowOnCompletion(fdc3);

  try {
    //used in AOpensBMultipleListen
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

  //used in 'RaiseIntentContextResult5secs'
  await fdc3.addIntentListener(Intent.sharedTestingIntent1, async (context: IntentUtilityContext) => {
    if (context.delayBeforeReturn ?? 0 > 0) {
      await wait(context.delayBeforeReturn);
    }

    await sendContextToTests(fdc3, {
      type: ControlContextType.SHARED_TESTING_INTENT1_LISTENER_TRIGGERED,
    });

    return context;
  });
});
