import { closeWindowOnCompletion, validateContext } from './mock-functions';
import { sendContextToTests } from '../v2.0/mock-functions';
import { wait } from '../../utils';
import { IntentUtilityContext } from '../../context-types';
import { IntentResult, getAgent } from '@finos/fdc3';
import { ContextType, ControlContextType, Intent } from '../../test/v2.0/support/intent-support-2.0';

getAgent().then(async fdc3 => {
  await closeWindowOnCompletion(fdc3);

  //used in 'Raise Intent Result (void result)' and 'Raise Intent (Ignoring any results)'
  fdc3.addIntentListener(Intent.aTestingIntent, async (context: IntentUtilityContext): Promise<IntentResult> => {
    validateContext(fdc3, context.type, ContextType.testContextX);
    await delayExecution(context.delayBeforeReturn);

    const { appMetadata } = await fdc3.getInfo();

    await sendContextToTests(fdc3, {
      type: ControlContextType.A_TESTING_INTENT_LISTENER_TRIGGERED,
      instanceId: appMetadata.instanceId,
    });

    return;
  });

  fdc3.addIntentListener(Intent.sharedTestingIntent1, async (context: IntentUtilityContext): Promise<IntentResult> => {
    validateContext(fdc3, context.type, ContextType.testContextY);
    await delayExecution(context.delayBeforeReturn);

    await sendContextToTests(fdc3, {
      type: ControlContextType.SHARED_TESTING_INTENT1_LISTENER_TRIGGERED,
    });

    return context;
  });

  await sendContextToTests(fdc3, {
    type: ControlContextType.INTENT_APP_A_OPENED,
  });
});

async function delayExecution(delayMiliseconds: number | undefined): Promise<void> {
  if (delayMiliseconds && delayMiliseconds > 0) {
    await wait(delayMiliseconds);
  }
}
