import { closeWindowOnCompletion, onFdc3Ready } from './mock-functions';
import { DesktopAgent } from 'fdc3_1_2/dist/api/DesktopAgent';
import { sendContextToTests } from '../v1.2/mock-functions';
import { AppControlContext } from '../../context-types';
import { Intent } from '../../test/v2.0/support/intent-support-2.0';
declare let fdc3: DesktopAgent;

onFdc3Ready().then(async () => {
  await closeWindowOnCompletion();

  try {
    //used in AOpensBMultipleListen & AOpensBMalformedContext
    fdc3.addContextListener(null, async context => {
      // broadcast that this app has received context
      if (context.type === 'fdc3.instrument') {
        await sendContextToTests({
          type: 'context-received',
          context: context,
        } as AppControlContext);
      } else if (context.name === 'this is a malformed context') {
        await sendContextToTests({
          type: 'context-received',
          errorMessage: 'App B listener received a malformed context',
        } as AppControlContext);
      }
    });
  } catch (ex) {
    await sendContextToTests({
      type: 'context-received',
      errorMessage: `${ex.message ?? ex}`,
    } as AppControlContext);
  }

  fdc3.addIntentListener(Intent.bTestingIntent, context => {
    return context;
  });
  fdc3.addIntentListener(Intent.sharedTestingIntent1, context => {
    return context;
  });

  //broadcast that intent-b has opened
  await sendContextToTests({
    type: 'fdc3-intent-b-opened',
  });
});
