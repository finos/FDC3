import { closeWindowOnCompletion, sendContextToTests, validateContext } from './mock-functions';
import { wait } from '../utils';
import { IntentUtilityContext } from '../context-types';
import { ContextMetadata, IntentResult, getAgent } from '@finos/fdc3';
import { ContextType, ControlContextType, Intent } from '../test/support/intent-support';

getAgent().then(async fdc3 => {
  await closeWindowOnCompletion(fdc3);

  //used in 'Raise Intent Result (void result)' and 'Raise Intent (Ignoring any results)'
  fdc3.addIntentListener(
    Intent.aTestingIntent,
    async (context: IntentUtilityContext, metadata?: ContextMetadata): Promise<IntentResult> => {
      validateContext(fdc3, context.type, ContextType.testContextX);
      await delayExecution(context.delayBeforeReturn);

      const { appMetadata } = await fdc3.getInfo();

      const controlContext: Record<string, unknown> = {
        type: ControlContextType.A_TESTING_INTENT_LISTENER_TRIGGERED,
        instanceId: appMetadata.instanceId,
      };

      if (metadata) {
        controlContext.contextMetadata = {
          source: metadata.source,
          timestamp: metadata.timestamp instanceof Date ? metadata.timestamp.toISOString() : String(metadata.timestamp),
          traceId: metadata.traceId,
          signature: metadata.signature,
          antiReplay: metadata.antiReplay,
          custom: metadata.custom,
        };
      }

      await sendContextToTests(fdc3, controlContext as unknown as IntentUtilityContext);

      return;
    }
  );

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

async function delayExecution(delayMilliseconds: number | undefined): Promise<void> {
  if (delayMilliseconds && delayMilliseconds > 0) {
    await wait(delayMilliseconds);
  }
}
