// SPDX-License-Identifier: Apache-2.0
import { AppIdentifier, DesktopAgent, getAgent, IntentResolution, PrivateChannel } from '@finos/fdc3';
import { expect } from 'chai';
import { handleFail } from '../../utils';
import { closeMockAppWindow, listenForMockAppReady } from '../fdc3-conformance-utils';
import { APIDocumentation } from '../support/apiDocuments';
import { ContextType, ControlContextType, Intent, IntentApp } from '../support/intent-support';

const documentation = '\r\nDocumentation: ' + APIDocumentation.desktopAgent + '\r\nCause';

export default async () =>
  describe('fdc3.destructuredMethods', () => {
    let fdc3: DesktopAgent;
    let openedWindows = 0;
    let readiness: Awaited<ReturnType<typeof listenForMockAppReady>>;

    beforeEach(async () => {
      fdc3 = await getAgent();
      openedWindows = 0;
      readiness = await listenForMockAppReady(fdc3, ControlContextType.INTENT_APP_A_OPENED);
    });

    afterEach(async function afterEach() {
      readiness.unsubscribe();
      if (openedWindows > 0) {
        await closeMockAppWindow(this.currentTest?.title ?? 'Unknown test', openedWindows);
      }
    });

    it('(DestructuredFindIntent) findIntent should remain callable when destructured', async () => {
      try {
        const { findIntent } = fdc3;
        const appIntent = await findIntent(Intent.aTestingIntent, { type: ContextType.testContextX });

        expect(appIntent.intent.name, documentation).to.equal(Intent.aTestingIntent);
        expect(appIntent.apps, documentation).to.have.length(1);
      } catch (ex) {
        handleFail(documentation + '\r\n' + APIDocumentation.findIntent, ex);
      }
    });

    it('(DestructuredFindIntentsByContext) findIntentsByContext should remain callable when destructured', async () => {
      try {
        const { findIntentsByContext } = fdc3;
        const appIntents = await findIntentsByContext({ type: ContextType.testContextX });

        expect(appIntents, documentation).to.be.an('array');
        expect(appIntents.length, documentation).to.be.greaterThan(0);
      } catch (ex) {
        handleFail(documentation + '\r\n' + APIDocumentation.findIntentsByContext, ex);
      }
    });

    it('(DestructuredOpen) open should remain callable when destructured', async () => {
      try {
        const { open } = fdc3;
        const appIdentifier = await open({ appId: IntentApp.IntentAppA });
        openedWindows = 1;

        // Wait until the mock app has registered its intent and close listeners.
        await readiness.waitFor(appIdentifier);

        validateAppIdentifier(appIdentifier);
      } catch (ex) {
        handleFail(documentation + '\r\n' + APIDocumentation.open, ex);
      }
    });

    it('(DestructuredFindInstances) findInstances should remain callable when destructured', async () => {
      try {
        const { findInstances, open } = fdc3;
        const appIdentifier1 = await open({ appId: IntentApp.IntentAppA });
        openedWindows = 1;
        await readiness.waitFor(appIdentifier1);
        const appIdentifier2 = await open({ appId: IntentApp.IntentAppA });
        openedWindows = 2;

        // Ensure both mock apps are ready before querying and later closing them.
        await readiness.waitFor(appIdentifier2);

        const instances = await findInstances({ appId: IntentApp.IntentAppA });

        expect(
          instances.some(instance => sameAppIdentifier(instance, appIdentifier1)),
          documentation
        ).to.equal(true);
        expect(
          instances.some(instance => sameAppIdentifier(instance, appIdentifier2)),
          documentation
        ).to.equal(true);
      } catch (ex) {
        handleFail(documentation + '\r\n' + APIDocumentation.findInstances, ex);
      }
    });

    it('(DestructuredGetAppMetadata) getAppMetadata should remain callable when destructured', async () => {
      try {
        const { getAppMetadata } = fdc3;
        const metadata = await getAppMetadata({ appId: IntentApp.IntentAppA });

        expect(metadata, documentation).to.have.property('appId');
      } catch (ex) {
        handleFail(documentation + '\r\n' + APIDocumentation.appMetadata, ex);
      }
    });

    it('(DestructuredRaiseIntent) raiseIntent should remain callable when destructured', async () => {
      try {
        const { raiseIntent } = fdc3;
        const intentResolution = await raiseIntent(Intent.aTestingIntent, { type: ContextType.testContextX });
        openedWindows = 1;

        validateIntentResolution(intentResolution);
      } catch (ex) {
        handleFail(documentation + '\r\n' + APIDocumentation.raiseIntent, ex);
      }
    });

    it('(DestructuredRaiseIntentForContext) raiseIntentForContext should remain callable when destructured', async () => {
      try {
        const { raiseIntentForContext } = fdc3;
        const intentResolution = await raiseIntentForContext({ type: ContextType.testContextZ });
        openedWindows = 1;

        validateIntentResolution(intentResolution);
      } catch (ex) {
        handleFail(documentation + '\r\n' + APIDocumentation.raiseIntentForContext, ex);
      }
    });

    it('(DestructuredCreatePrivateChannel) createPrivateChannel should remain callable when destructured', async () => {
      try {
        const { createPrivateChannel } = fdc3;
        const privateChannel = await createPrivateChannel();

        validatePrivateChannel(privateChannel);
        privateChannel.disconnect();
      } catch (ex) {
        handleFail(documentation, ex);
      }
    });
  });

function sameAppIdentifier(a: AppIdentifier, b: AppIdentifier): boolean {
  return a.appId === b.appId && a.instanceId === b.instanceId;
}

function validateAppIdentifier(appIdentifier: AppIdentifier) {
  expect(appIdentifier, documentation).to.have.property('appId');
  expect(appIdentifier, documentation).to.have.property('instanceId');
}

function validateIntentResolution(intentResolution: IntentResolution) {
  expect(intentResolution, documentation).to.have.property('source');
  expect(intentResolution.source, documentation).to.have.property('appId');
}

function validatePrivateChannel(privateChannel: PrivateChannel) {
  expect(privateChannel, documentation).to.have.property('id');
  expect(privateChannel, documentation).to.have.property('disconnect').that.is.a('function');
}
