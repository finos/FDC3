import { ResolveError, DesktopAgent } from 'fdc3_1_2';
import { assert, expect } from 'chai';
import { APIDocumentation1_2 } from '../apiDocuments-1.2';
import { ContextType, Intent, IntentApp } from '../support/intent-support-1.2';

declare let fdc3: DesktopAgent;
const findIntentsByContextDocs = '\r\nDocumentation: ' + APIDocumentation1_2.findIntentsByContext + '\r\nCause';

/**
 * Details on the mock apps used in these tests can be found in /mock/README.md
 */
export default () =>
  describe('fdc3.findIntentsByContext', () => {
    it("(SingleContext) Should find intents by context 'testContextX'", async () => {
      try {
        const intents = await fdc3.findIntentsByContext({
          type: ContextType.testContextX,
        });
        expect(intents).to.have.length(3, findIntentsByContextDocs);

        const intentNames = intents.map(appIntent => appIntent.intent.name);
        expect(intentNames).to.have.all.members(
          [Intent.aTestingIntent, Intent.sharedTestingIntent1, Intent.cTestingIntent],
          findIntentsByContextDocs
        );

        const aTestingIntent = intents.find(appIntent => appIntent.intent.name === Intent.aTestingIntent);
        expect(aTestingIntent.apps).to.have.length(1, findIntentsByContextDocs);
        expect(aTestingIntent.apps[0].name).to.eq(IntentApp.IntentAppA, findIntentsByContextDocs);

        const sharedTestingIntent1 = intents.find(appIntent => appIntent.intent.name === Intent.sharedTestingIntent1);
        expect(sharedTestingIntent1.apps).to.have.length(2, findIntentsByContextDocs);
        const sharedAppNames = sharedTestingIntent1.apps.map(app => app.name);
        expect(sharedAppNames).to.have.all.members(
          [IntentApp.IntentAppA, IntentApp.IntentAppB],
          findIntentsByContextDocs
        );

        const cTestingIntent = intents.find(appIntent => appIntent.intent.name === Intent.cTestingIntent);
        expect(cTestingIntent.apps).to.have.length(1, findIntentsByContextDocs);
        expect(cTestingIntent.apps[0].name).to.eq(IntentApp.IntentAppC, findIntentsByContextDocs);
      } catch (ex) {
        assert.fail(findIntentsByContextDocs + (ex.message ?? ex));
      }
    });

    it('(NoContext) Passing an invalid context causes a NoAppsFound error to be thrown', async () => {
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
