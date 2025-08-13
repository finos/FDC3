import { closeWindowOnCompletion } from './mock-functions';
import { getAgent } from '@finos/fdc3';
import { Intent } from '../../test/support/intent-support-2.0';

getAgent().then(async fdc3 => {
  await closeWindowOnCompletion(fdc3);
  fdc3.addIntentListener(Intent.sharedTestingIntent2, async context => {
    return context;
  });
});
