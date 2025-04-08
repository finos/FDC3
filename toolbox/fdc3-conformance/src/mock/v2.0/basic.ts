import { closeWindowOnCompletion, onFdc3Ready } from './mock-functions';
import { DesktopAgent } from '@finos/fdc3/dist/api/DesktopAgent';
import { sendContextToTests } from './mock-functions';
import { AppControlContext } from '../../context-types';
import { ControlContextType, Intent } from '../../test/v2.0/support/intent-support-2.0';
declare let fdc3: DesktopAgent;
onFdc3Ready().then(async () => {
  await closeWindowOnCompletion();

  try {
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

  fdc3.addIntentListener(Intent.lTestingIntent, async context => {
    return context;
  });
});
