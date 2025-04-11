import { closeWindowOnCompletion, sendContextToTests, validateContext } from './mock-functions';
import { getAgent } from '@finos/fdc3';
import { ContextType, ControlContextType, Intent } from '../../test/v2.0/support/intent-support-2.0';
import constants from '../../constants';

getAgent().then(async fdc3 => {
  await closeWindowOnCompletion(fdc3);
  const { appMetadata } = await fdc3.getInfo();

  fdc3.addIntentListener(Intent.sharedTestingIntent2, async context => {
    validateContext(fdc3, context.type, ContextType.testContextY);
    const channel = await fdc3.getOrCreateChannel('test-channel');

    //set-up alert to test framework that the task was completed after a short delay
    setTimeout(async () => {
      await sendContextToTests(fdc3, {
        type: ControlContextType.SHARED_TESTING_INTENT_2_RESULT_SENT,
        id: { key: 'uniqueId' },
        instanceId: appMetadata.instanceId,
      });
    }, constants.ShortWait);

    return channel;
  });
});
