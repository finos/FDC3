import { FDC3ChannelChangedEvent, getAgent } from '@finos/fdc3';
import { MockAppTracker } from '../fdc3-conformance-utils';
import { APIDocumentation } from '../support/apiDocuments';
import { ContextType, IntentApp, Intent, RaiseIntentControl } from '../support/intent-support';
import { handleFail, wait } from '../../utils';
import { expect } from 'chai';

const raiseIntentDocs = '\r\nDocumentation: ' + APIDocumentation.raiseIntent + '\r\nCause';

/**
 * Details on the mock apps used in these tests can be found in /mock/README.md
 */

export const fdc3ResolveAmbiguousIntentTarget = async () =>
  describe('ResolveAmbiguousIntentTarget', async () => {
    const fdc3 = await getAgent();
    const mockAppTracker = new MockAppTracker();

    afterEach(async function afterEach() {
      await mockAppTracker.closeIfOpened(this.currentTest?.title ?? 'Unknown Test');
    });
    const ResolveAmbiguousIntentTarget =
      "(ResolveAmbiguousIntentTarget) Should be able to raise intent using Intent and Context and manually select an app out of 'E','F','G','H' and 'I'";
    it(ResolveAmbiguousIntentTarget, async () => {
      try {
        const context = {
          type: ContextType.testContextY,
        };
        await fdc3.raiseIntent(Intent.sharedTestingIntent2, context);
        mockAppTracker.markOpened(ResolveAmbiguousIntentTarget);
      } catch (ex) {
        handleFail(raiseIntentDocs, ex);
      }
    });
  });

export const fdc3ResolveAmbiguousContextTarget = async () =>
  describe('ResolveAmbiguousContextTarget', async () => {
    const fdc3 = await getAgent();
    const mockAppTracker = new MockAppTracker();

    afterEach(async function afterEach() {
      await mockAppTracker.closeIfOpened(this.currentTest?.title ?? 'Unknown Test');
    });
    const ResolveAmbiguousIntentTarget =
      "(ResolveAmbiguousContextTarget) Should be able to raise intent using ContextY and manually select an app out of 'E','F','G','H' and 'I'";
    it(ResolveAmbiguousIntentTarget, async () => {
      try {
        const context = {
          type: ContextType.testContextY,
        };
        await fdc3.raiseIntentForContext(context);
        mockAppTracker.markOpened(ResolveAmbiguousIntentTarget);
      } catch (ex) {
        handleFail(raiseIntentDocs, ex);
      }
    });
  });

export const fdc3ResolveAmbiguousIntentTargetMultiInstance = async () =>
  describe('ResolveAmbiguousIntentTargetMultiInstance', async () => {
    const fdc3 = await getAgent();
    const control = new RaiseIntentControl(fdc3);

    afterEach(async function afterEach() {
      await control.closeMockAppIfOpened(this.currentTest?.title ?? 'Unknown Test');
    });
    const ResolveAmbiguousIntentTargetMultiInstance =
      "(ResolveAmbiguousIntentTargetMultiInstance) Open 2 instances of App E and AppF respectively and then should be able to raise intent using Intent and Context and manually select an app out of 'E','F','G','H' and 'I'";
    it(ResolveAmbiguousIntentTargetMultiInstance, async () => {
      try {
        const context = {
          type: ContextType.testContextY,
        };
        await control.openIntentApp(IntentApp.IntentAppE, ResolveAmbiguousIntentTargetMultiInstance);
        await control.openIntentApp(IntentApp.IntentAppE, ResolveAmbiguousIntentTargetMultiInstance);
        await control.openIntentApp(IntentApp.IntentAppF, ResolveAmbiguousIntentTargetMultiInstance);
        await control.openIntentApp(IntentApp.IntentAppF, ResolveAmbiguousIntentTargetMultiInstance);
        await wait(100);

        await control.raiseIntent(
          Intent.sharedTestingIntent2,
          context.type,
          undefined,
          0,
          undefined,
          undefined,
          ResolveAmbiguousIntentTargetMultiInstance // the resolved app itself also opens a window
        );
      } catch (ex) {
        handleFail(raiseIntentDocs, ex);
      }
    });
  });

export const fdc3ResolveAmbiguousContextTargetMultiInstance = async () =>
  describe('ResolveAmbiguousContextTargetMultiInstance', async () => {
    const fdc3 = await getAgent();
    const control = new RaiseIntentControl(fdc3);

    afterEach(async function afterEach() {
      await control.closeMockAppIfOpened(this.currentTest?.title ?? 'Unknown Test');
    });
    const ResolveAmbiguousContextTargetMultiInstance =
      "(ResolveAmbiguousContextTargetMultiInstance) Open 2 instances of App E and AppF respectively and then should be able to raise intent using Context and manually select an app out of 'E','F','G','H' and 'I'";
    it(ResolveAmbiguousContextTargetMultiInstance, async () => {
      try {
        const context = {
          type: ContextType.testContextY,
        };
        await control.openIntentApp(IntentApp.IntentAppE, ResolveAmbiguousContextTargetMultiInstance);
        await control.openIntentApp(IntentApp.IntentAppE, ResolveAmbiguousContextTargetMultiInstance);
        await control.openIntentApp(IntentApp.IntentAppF, ResolveAmbiguousContextTargetMultiInstance);
        await control.openIntentApp(IntentApp.IntentAppF, ResolveAmbiguousContextTargetMultiInstance);
        await wait(100);

        await fdc3.raiseIntentForContext(context);
        control.markAppOpened(ResolveAmbiguousContextTargetMultiInstance); // the resolved app itself also opens a window
      } catch (ex) {
        handleFail(raiseIntentDocs, ex);
      }
    });
  });

export const fdc3ChannelChangedEvent = async () =>
  describe('ChannelChangedEvent', () => {
    it('(ChannelChangedEvent) Should receive an event when the user changes channel.  This is a manual test, please change the channel a few times in your browser to get this to pass.', async () => {
      const channels: (string | null)[] = [];
      try {
        const agent = await getAgent();
        agent.addEventListener('userChannelChanged', event => {
          const changedEvent: FDC3ChannelChangedEvent = event as FDC3ChannelChangedEvent;
          const currentChannel = changedEvent.details.currentChannelId;
          console.log('User channel changed', event, currentChannel);
          channels.push(currentChannel);
        });

        await wait(8000);
        const uniqueChannels = new Set(channels);
        expect(uniqueChannels.size).to.be.greaterThan(0);
      } catch (ex) {
        handleFail(`Didn't get any channel change events: ${JSON.stringify(channels)}`, ex);
      }
    });
  });
