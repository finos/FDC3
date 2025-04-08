import { closeWindowOnCompletion, onFdc3Ready, validateContext } from './mock-functions';
import { sendContextToTests } from '../v2.0/mock-functions';
import { wait } from '../../utils';
import { IntentUtilityContext } from '../../context-types';
import { IntentResult, DesktopAgent } from '@finos/fdc3';
import { ContextType, ControlContextType, Intent } from '../../test/v2.0/support/intent-support-2.0';
declare let fdc3: DesktopAgent;

onFdc3Ready().then(async () => {
  await closeWindowOnCompletion();

  //used in 'Raise Intent Result (void result)' and 'Raise Intent (Ignoring any results)'
  fdc3.addIntentListener(Intent.aTestingIntent, async (context: IntentUtilityContext): Promise<IntentResult> => {
    validateContext(context.type, ContextType.testContextX);
    await delayExecution(context.delayBeforeReturn);

    const { appMetadata } = await fdc3.getInfo();

    await sendContextToTests({
      type: ControlContextType.aTestingIntentListenerTriggered,
      instanceId: appMetadata.instanceId,
    });

    return;
  });

  fdc3.addIntentListener(Intent.sharedTestingIntent1, async (context: IntentUtilityContext): Promise<IntentResult> => {
    validateContext(context.type, ContextType.testContextY);
    await delayExecution(context.delayBeforeReturn);

    await sendContextToTests({
      type: ControlContextType.sharedTestingIntent1ListenerTriggered,
    });

    return context;
  });

  await sendContextToTests({
    type: ControlContextType.intentAppAOpened,
  });
});

async function delayExecution(delayMiliseconds: number | undefined): Promise<void> {
  if (delayMiliseconds && delayMiliseconds > 0) {
    await wait(delayMiliseconds);
  }
}
