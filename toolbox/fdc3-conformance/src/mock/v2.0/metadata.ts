import { closeWindowOnCompletion, sendContextToTests } from './mock-functions';
import { getAgent } from '@finos/fdc3';
import { ControlContextType } from '../../test/support/intent-support-2.0';

getAgent().then(async fdc3 => {
  await closeWindowOnCompletion(fdc3);

  //get context from tests
  await fdc3.addContextListener('metadataAppContext', async () => {
    //execute command from test app and send back metadata
    const implMetadata = await fdc3.getInfo();
    const metadataContext = {
      type: ControlContextType.CONTEXT_LISTENER_TRIGGERED,
      implMetadata: implMetadata,
    };

    sendContextToTests(fdc3, metadataContext);
  });
});
