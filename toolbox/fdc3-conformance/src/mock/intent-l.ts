import { closeWindowOnCompletion, sendContextToTests, validateContext } from './mock-functions';
import { getAgent } from '@finos/fdc3';
import { IntentUtilityContext } from '../context-types';
import { ContextMetadata, IntentResult } from '@finos/fdc3';
import { ContextType, ControlContextType, Intent } from '../test/support/intent-support';

// Used in 'IntentContextMetadata' and 'IntentContextMetadataWithAppMetadata' conformance tests
getAgent().then(async fdc3 => {
  await closeWindowOnCompletion(fdc3);

  fdc3.addIntentListener(
    Intent.lTestingIntent,
    async (context: IntentUtilityContext, metadata?: ContextMetadata): Promise<IntentResult> => {
      validateContext(fdc3, context.type, ContextType.testContextX);

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
          custom: metadata.custom,
        };
      }

      await sendContextToTests(fdc3, controlContext as unknown as IntentUtilityContext);

      return;
    }
  );
});
