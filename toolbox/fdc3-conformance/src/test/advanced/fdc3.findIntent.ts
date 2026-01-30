import { AppIntent, IntentMetadata, ResolveError, DesktopAgent } from '@finos/fdc3';
import { assert, expect } from 'chai';
import { APIDocumentation2_0 } from '../support/apiDocuments-2.0';
import { ContextType, IntentApp, Intent } from '../support/intent-support-2.0';

declare let fdc3: DesktopAgent;
const findIntentDocs = '\r\nDocumentation: ' + APIDocumentation2_0.findIntent + '\r\nCause';

/**
 * Details on the mock apps used in these tests can be found in /mock/README.md
 */
export default () =>
  describe('fdc3.findIntent', () => {
    it("(FindIntentAppD) Should find intent 'aTestingIntent' belonging only to app intent-a", async () => {
      const appIntent = await fdc3.findIntent(Intent.aTestingIntent);
      validateAppIntent(
        appIntent,
        1,
        { name: Intent.aTestingIntent, displayName: 'A Testing Intent' },
        IntentApp.IntentAppA
      );
    });

    it('(FindNonExistentIntentAppD) Should throw NoAppsFound error when intent does not exist', async () => {
      try {
        await fdc3.findIntent('nonExistentIntent');
        assert.fail('No error was thrown', findIntentDocs);
      } catch (ex) {
        expect(ex).to.have.property('message', ResolveError.NoAppsFound, findIntentDocs);
      }
    });

    it("(FindIntentAppDRightContext) Should find intent 'aTestingIntent' belonging only to app intent-a with context 'testContextX'", async () => {
      const appIntent = await fdc3.findIntent(Intent.aTestingIntent, { type: ContextType.testContextX });
      validateAppIntent(
        appIntent,
        1,
        { name: Intent.aTestingIntent, displayName: 'A Testing Intent' },
        IntentApp.IntentAppA
      );
    });

    it('(FindIntentAppDWrongContext) Should throw NoAppsFound error when intent exists but context does not', async () => {
      try {
        await fdc3.findIntent(Intent.aTestingIntent, { type: ContextType.testContextY });
        assert.fail('No error was thrown', findIntentDocs);
      } catch (ex) {
        expect(ex).to.have.property('message', ResolveError.NoAppsFound, findIntentDocs);
      }
    });

    it("(FindIntentAppDMultiple1) Should find intent 'sharedTestingIntent2' belonging to multiple apps (intent-a & intent-b)", async () => {
      const appIntent = await fdc3.findIntent(Intent.sharedTestingIntent2);
      validateAppIntent(
        appIntent,
        6,
        { name: Intent.sharedTestingIntent2, displayName: 'Shared Testing Intent 2' },
        IntentApp.IntentAppD
      );
    });

    it("(IntentAppDMultiple2) Should find intent 'sharedTestingIntent2' belonging to multiple apps (intent-a & intent-b) filtered by specific context 'testContextY'", async () => {
      const appIntent = await fdc3.findIntent(Intent.sharedTestingIntent2, { type: ContextType.testContextY });
      validateAppIntent(
        appIntent,
        5,
        { name: Intent.sharedTestingIntent2, displayName: 'Shared Testing Intent 2' },
        IntentApp.IntentAppE
      );
    });

    it("(FindIntentAppDByResultSingle) Should find intent 'cTestingIntent' belonging only to app intent-c with context 'testContextX' and result type 'testContextZ'", async () => {
      const appIntent = await fdc3.findIntent(
        Intent.cTestingIntent,
        { type: ContextType.testContextX },
        ContextType.testContextZ
      );
      validateAppIntent(
        appIntent,
        1,
        { name: Intent.cTestingIntent, displayName: 'C Testing Intent' },
        IntentApp.IntentAppC
      );
    });

    it("(FindIntentAppDByResultSingleNullContext) Should find intent 'cTestingIntent' belonging only to app intent-c with a null context and result type 'testContextZ'", async () => {
      const appIntent = await fdc3.findIntent(Intent.cTestingIntent, undefined, ContextType.testContextZ);
      validateAppIntent(
        appIntent,
        1,
        { name: Intent.cTestingIntent, displayName: 'C Testing Intent' },
        IntentApp.IntentAppC
      );
    });

    it("(FindIntentAppDByResultMultiple) Should find intent 'sharedTestingIntent1' belonging only to app intent-b with context 'testContextX' and result type 'testContextY'", async () => {
      const appIntent = await fdc3.findIntent(
        Intent.sharedTestingIntent1,
        { type: ContextType.testContextX },
        ContextType.testContextY
      );
      validateAppIntent(
        appIntent,
        1,
        { name: Intent.sharedTestingIntent1, displayName: 'Shared Testing Intent 1' },
        IntentApp.IntentAppB
      );
    });

    it("(FindIntentAppDByResultChannel1) Should find intent 'sharedTestingIntent2' belonging only to apps intent-e and itent-f with context 'testContextY' and result type 'channel", async () => {
      const appIntent = await fdc3.findIntent(
        Intent.sharedTestingIntent2,
        { type: ContextType.testContextY },
        'channel'
      );
      validateAppIntent(
        appIntent,
        2,
        { name: Intent.sharedTestingIntent2, displayName: 'Shared Testing Intent 2' },
        IntentApp.IntentAppE
      );
    });

    it("(FindIntentAppDByResultChannel2) Should find intent 'sharedTestingIntent2' belonging only to app intent-c with context 'testContextY' and result type 'channel<testContextZ>'", async () => {
      const appIntent = await fdc3.findIntent(
        Intent.sharedTestingIntent2,
        { type: ContextType.testContextY },
        'channel<testContextZ>'
      );
      validateAppIntent(
        appIntent,
        1,
        { name: Intent.sharedTestingIntent2, displayName: 'Shared Testing Intent 2' },
        IntentApp.IntentAppF
      );
    });
  });

function validateAppIntent(
  appIntent: AppIntent,
  expectedNumberOfApps: number,
  expectedIntentMetadata: IntentMetadata,
  firstIntentAppToValidate: IntentApp
) {
  expect(appIntent.intent).to.deep.eq(
    {
      name: expectedIntentMetadata.name,
      displayName: expectedIntentMetadata.displayName,
    },
    findIntentDocs
  );

  expect(
    appIntent.apps,
    `Unexpected AppIntent.apps.length. Expected ${expectedNumberOfApps}, got ${appIntent.apps.length}${findIntentDocs}`
  ).to.have.length(expectedNumberOfApps);

  const intentApps = Object.values(IntentApp);
  const position = intentApps.indexOf(firstIntentAppToValidate);
  const appsThatNeedValidating = intentApps.splice(position, expectedNumberOfApps);

  appsThatNeedValidating.forEach((appId, index) => {
    expect(
      appIntent.apps[index],
      `AppIntent.apps[${index}] did not have expected property 'appId' ${findIntentDocs}`
    ).to.have.property('appId', appId);
  });
}
