import { closeWindowOnCompletion, onFdc3Ready } from './mock-functions';
import { DesktopAgent } from '@finos/fdc3/dist/api/DesktopAgent';
import { sendContextToTests } from '../v2.0/mock-functions';
import { wait } from '../../utils';
import { AppControlContext, IntentUtilityContext } from '../../context-types';
import { ControlContextType, Intent } from '../../test/v2.0/support/intent-support-2.0';
declare let fdc3: DesktopAgent;
onFdc3Ready().then(async () => {
  await closeWindowOnCompletion();

  try {
    //used in AOpensBMultipleListen
    await fdc3.addContextListener(null, async context => {
      // broadcast that this app has received context
      if (context.type === 'fdc3.instrument') {
        await sendContextToTests({
          type: ControlContextType.contextReceived,
          context: context,
        } as AppControlContext);
      }
    });
  } catch (ex) {
    await sendContextToTests({
      type: ControlContextType.contextReceived,
      errorMessage: `${ex.message ?? ex}`,
    } as AppControlContext);
  }

  //used in 'RaiseIntentContextResult5secs'
  await fdc3.addIntentListener(Intent.sharedTestingIntent1, async (context: IntentUtilityContext) => {
    if (context.delayBeforeReturn > 0) {
      await wait(context.delayBeforeReturn);
    }

    await sendContextToTests({
      type: ControlContextType.sharedTestingIntent1ListenerTriggered,
    });

    return context;
  });
});
