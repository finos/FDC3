import { ResolveError, DesktopAgent } from 'fdc3_1_2';
import { assert, expect } from 'chai';
import { APIDocumentation1_2 } from '../apiDocuments-1.2';
import { ContextType, Intent, IntentApp } from '../support/intent-support-1.2';

declare let fdc3: DesktopAgent;
const findIntentDocs = '\r\nDocumentation: ' + APIDocumentation1_2.findIntent + '\r\nCause';

/**
 * Details on the mock apps used in these tests can be found in /mock/README.md
 */
export default () =>
  describe('fdc3.findIntent', () => {
    it("(IntentAppD) Should find intent 'aTestingIntent' belonging only to app intent-a", async () => {
      const appIntent = await fdc3.findIntent(Intent.aTestingIntent);
      expect(appIntent.intent).to.deep.eq(
        {
          name: Intent.aTestingIntent,
          displayName: 'A Testing Intent',
        },
        findIntentDocs
      );
      expect(appIntent.apps).to.have.length(1, findIntentDocs);
      expect(appIntent.apps[0]).to.have.property('name', IntentApp.IntentAppA, findIntentDocs);
    });

    it('(WrongIntentAppD) Should throw NoAppsFound error when intent does not exist', async () => {
      try {
        await fdc3.findIntent('nonExistentIntent');
        assert.fail('No error was thrown', findIntentDocs);
      } catch (ex) {
        expect(ex).to.have.property('message', ResolveError.NoAppsFound, findIntentDocs);
      }
    });

    it("(IntentAppDRightContext) Should find intent 'aTestingIntent' belonging only to app intent-a with context 'testContextX'", async () => {
      const appIntent = await fdc3.findIntent(Intent.aTestingIntent, {
        type: ContextType.testContextX,
      });
      expect(appIntent.intent).to.deep.eq(
        {
          name: Intent.aTestingIntent,
          displayName: 'A Testing Intent',
        },
        findIntentDocs
      );
      expect(appIntent.apps).to.have.length(1, findIntentDocs);
      expect(appIntent.apps[0]).to.have.property('name', IntentApp.IntentAppA, findIntentDocs);
    });

    it('(IntentAppDWrongContext) Should throw NoAppsFound error when intent exists but context does not', async () => {
      try {
        await fdc3.findIntent(Intent.aTestingIntent, {
          type: ContextType.testContextY,
        });
        assert.fail('No error was thrown', findIntentDocs);
      } catch (ex) {
        expect(ex).to.have.property('message', ResolveError.NoAppsFound, findIntentDocs);
      }
    });

    it("(IntentAppDMultiple1) Should find intent 'sharedTestingIntent1' belonging to multiple apps (intent-a & intent-b)", async () => {
      const appIntent = await fdc3.findIntent(Intent.sharedTestingIntent1);
      expect(appIntent.intent).to.deep.eq(
        {
          name: Intent.sharedTestingIntent1,
          displayName: 'Shared Testing Intent',
        },
        findIntentDocs
      );
      expect(appIntent.apps).to.have.length(2, findIntentDocs);
      expect(appIntent.apps[0]).to.have.property('name', IntentApp.IntentAppA, findIntentDocs);
      expect(appIntent.apps[1]).to.have.property('name', IntentApp.IntentAppB, findIntentDocs);
    });

    it("(IntentAppDMultiple2) Should find intent 'sharedTestingIntent1' belonging to multiple apps (intent-a & intent-b) filtered by specific context 'testContextX'", async () => {
      const appIntent = await fdc3.findIntent(Intent.sharedTestingIntent1, {
        type: ContextType.testContextX,
      });
      expect(appIntent.intent).to.deep.eq(
        {
          name: Intent.sharedTestingIntent1,
          displayName: 'Shared Testing Intent',
        },
        findIntentDocs
      );
      expect(appIntent.apps).to.have.length(2, findIntentDocs);
      expect(appIntent.apps[0]).to.have.property('name', IntentApp.IntentAppA, findIntentDocs);
      expect(appIntent.apps[1]).to.have.property('name', IntentApp.IntentAppB, findIntentDocs);
    });

    it("(IntentAppDMultiple3) Should find intent 'sharedTestingIntent1' belonging to app 'intent-b' when filtered by specific context 'testContextY'", async () => {
      const appIntent = await fdc3.findIntent(Intent.sharedTestingIntent1, {
        type: ContextType.testContextY,
      });
      expect(appIntent.intent).to.deep.eq(
        {
          name: Intent.sharedTestingIntent1,
          displayName: 'Shared Testing Intent',
        },
        findIntentDocs
      );
      expect(appIntent.apps).to.have.length(1, findIntentDocs);
      expect(appIntent.apps[0]).to.have.property('name', IntentApp.IntentAppB, findIntentDocs);
    });
  });
