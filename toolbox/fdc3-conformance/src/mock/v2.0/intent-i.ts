import { closeWindowOnCompletion, onFdc3Ready } from './mock-functions';
import { DesktopAgent } from 'fdc3_2_0';
declare let fdc3: DesktopAgent;

onFdc3Ready().then(async () => {
  await closeWindowOnCompletion();
  fdc3.addIntentListener('MadeUpIntent', async context => {
    return context;
  });
});
