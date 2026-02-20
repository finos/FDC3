import { closeWindowOnCompletion } from './mock-functions';
import { getAgent } from '@finos/fdc3';

getAgent().then(async fdc3 => {
  await closeWindowOnCompletion(fdc3);
  fdc3.addIntentListener('MadeUpIntent', async context => {
    return context;
  });
});
