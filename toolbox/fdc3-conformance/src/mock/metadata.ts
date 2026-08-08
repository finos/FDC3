import { closeWindowOnCompletion, sendContextToTests } from './mock-functions';
import { Context, getAgent } from '@finos/fdc3';
import { ControlContextType } from '../test/support/intent-support';

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

  //set this instance's metadata using the title provided by the test app, then signal completion
  await fdc3.addContextListener('updateInstanceMetadataAppContext', async (context: Context & { title?: string }) => {
    await fdc3.updateInstanceMetadata({ title: context.title });

    sendContextToTests(fdc3, {
      type: ControlContextType.INSTANCE_METADATA_SET,
    });
  });
});
