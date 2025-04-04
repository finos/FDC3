import { closeWindowOnCompletion, onFdc3Ready } from './mock-functions';
import { DesktopAgent } from 'fdc3_2_0';
import { Intent } from '../../test/v2.0/support/intent-support-2.0';
declare let fdc3: DesktopAgent;

onFdc3Ready().then(async () => {
  await closeWindowOnCompletion();
  fdc3.addIntentListener(Intent.sharedTestingIntent2, async context => {
    return context;
  });
});
