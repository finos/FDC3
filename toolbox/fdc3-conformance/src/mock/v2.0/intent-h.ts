import { closeWindowOnCompletion, onFdc3Ready } from './mock-functions';

onFdc3Ready().then(async () => {
  await closeWindowOnCompletion();
});
