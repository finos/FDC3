import { getAgent } from '@robmoffat/fdc3';
import { closeWindowOnCompletion } from './mock-functions';

getAgent().then(async fdc3 => {
  await closeWindowOnCompletion(fdc3);
});
