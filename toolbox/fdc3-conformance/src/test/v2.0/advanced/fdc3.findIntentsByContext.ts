import { AppIntent, ResolveError } from '@finos/fdc3';
import { assert, expect } from 'chai';
import { APIDocumentation2_0 } from '../apiDocuments-2.0';
import { DesktopAgent } from '@finos/fdc3';
import { ContextType, IntentApp, Intent } from '../support/intent-support-2.0';
import { handleFail } from '../../../utils';

declare let fdc3: DesktopAgent;
const findIntentsByContextDocs = '\r\nDocumentation: ' + APIDocumentation2_0.findIntentsByContext;

/**
 * Details on the mock apps used in these tests can be found in /mock/README.md
 */
export default () =>
  describe('fdc3.findIntentsByContext', () => {
    it("(2.0-FindIntentByContextSingleContext) Should find intents by context 'testContextX'", async () => {
      try {
        const intents = await fdc3.findIntentsByContext({ type: ContextType.testContextX });
        expect(intents).to.have.length(5);
        const intentNames = intents.map(appIntent => appIntent.intent.name);
        expect(intentNames).to.have.all.members([
          Intent.aTestingIntent,
          Intent.sharedTestingIntent1,
          Intent.cTestingIntent,
          Intent.sharedTestingIntent2,
          Intent.kTestingIntent,
        ]);

        validateIntents(intents, Intent.aTestingIntent, 1, [IntentApp.IntentAppA]);
        validateIntents(intents, Intent.sharedTestingIntent1, 2, [IntentApp.IntentAppA, IntentApp.IntentAppB]);
        validateIntents(intents, Intent.cTestingIntent, 1, [IntentApp.IntentAppC]);
        validateIntents(intents, Intent.sharedTestingIntent2, 1, [IntentApp.IntentAppD]);
        validateIntents(intents, Intent.kTestingIntent, 1, [IntentApp.IntentAppK]);
      } catch (ex) {
        handleFail(findIntentsByContextDocs, ex);
      }
    });

    it('(2.0FindIntentByContextWrongIntentAppD) Passing an invalid context causes a NoAppsFound error to be thrown', async () => {
      const context = {
        type: 'ThisContextDoesNotExist',
      };
      try {
        await fdc3.findIntentsByContext(context);
        assert.fail('Expected error NoAppsFound not thrown', findIntentsByContextDocs);
      } catch (ex) {
        expect(ex).to.have.property('message', ResolveError.NoAppsFound, findIntentsByContextDocs);
      }
    });
  });

function validateIntents(
  intents: AppIntent[],
  intentFilter: string,
  expectedAppCount: number,
  expectedAppIds: string[]
) {
  const firstIntent = intents.find(appIntent => appIntent.intent.name === intentFilter);
  expect(firstIntent).to.not.be.undefined;
  if (firstIntent !== undefined) {
    expect(firstIntent.apps).to.have.length(expectedAppCount);
    const sharedAppNames = firstIntent.apps.map(app => app.appId);
    expect(sharedAppNames).to.have.all.members(expectedAppIds);
  }
}
