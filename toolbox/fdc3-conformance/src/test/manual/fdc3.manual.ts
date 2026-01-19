import { FDC3ChannelChangedEvent, getAgent } from '@finos/fdc3';
import { closeMockAppWindow } from '../fdc3-2_0-utils';
import { APIDocumentation2_0 } from '../support/apiDocuments-2.0';
import { ContextType, IntentApp, Intent, RaiseIntentControl2_0 } from '../support/intent-support-2.0';
import { handleFail, wait } from '../../utils';
import { expect } from 'chai';

const raiseIntentDocs = '\r\nDocumentation: ' + APIDocumentation2_0.raiseIntent + '\r\nCause';

/**
 * Details on the mock apps used in these tests can be found in /mock/README.md
 */

export const fdc3ResolveAmbiguousIntentTarget_2_0 = () =>
  describe('ResolveAmbiguousIntentTarget', async () => {
    const fdc3 = await getAgent();

    after(async function after() {
      await closeMockAppWindow(this.currentTest?.title ?? 'Unknown Test');
    });
    const ResolveAmbiguousIntentTarget =
      "(ResolveAmbiguousIntentTarget) Should be able to raise intent using Intent and Context and manually select an app out of 'E','F','G','H' and 'I'";
    it(ResolveAmbiguousIntentTarget, async () => {
      try {
        const context = {
          type: ContextType.testContextY,
        };
        await fdc3.raiseIntent(Intent.sharedTestingIntent2, context);
      } catch (ex) {
        handleFail(raiseIntentDocs, ex);
      }
    });
  });

export const fdc3ResolveAmbiguousContextTarget_2_0 = () =>
  describe('ResolveAmbiguousContextTarget', async () => {
    const fdc3 = await getAgent();

    after(async function after() {
      await closeMockAppWindow(this.currentTest?.title ?? 'Unknown Test');
    });
    const ResolveAmbiguousIntentTarget =
      "(ResolveAmbiguousContextTarget) Should be able to raise intent using ContextY and manually select an app out of 'E','F','G','H' and 'I'";
    it(ResolveAmbiguousIntentTarget, async () => {
      try {
        const context = {
          type: ContextType.testContextY,
        };
        await fdc3.raiseIntentForContext(context);
      } catch (ex) {
        handleFail(raiseIntentDocs, ex);
      }
    });
  });

export const fdc3ResolveAmbiguousIntentTargetMultiInstance_2_0 = () =>
  describe('ResolveAmbiguousIntentTargetMultiInstance', async () => {
    const fdc3 = await getAgent();
    const control = new RaiseIntentControl2_0(fdc3);

    after(async function after() {
      await closeMockAppWindow(this.currentTest?.title ?? 'Unknown Test');
    });
    const ResolveAmbiguousIntentTargetMultiInstance =
      "(ResolveAmbiguousIntentTargetMultiInstance) Open 2 instances of App E and AppF respectively and then should be able to raise intent using Intent and Context and manually select an app out of 'E','F','G','H' and 'I'";
    it(ResolveAmbiguousIntentTargetMultiInstance, async () => {
      try {
        const context = {
          type: ContextType.testContextY,
        };
        await control.openIntentApp(IntentApp.IntentAppE);
        await control.openIntentApp(IntentApp.IntentAppE);
        await control.openIntentApp(IntentApp.IntentAppF);
        await control.openIntentApp(IntentApp.IntentAppF);
        await wait(100);

        await fdc3.raiseIntent(Intent.sharedTestingIntent2, context);
      } catch (ex) {
        handleFail(raiseIntentDocs, ex);
      }
    });
  });

export const fdc3ResolveAmbiguousContextTargetMultiInstance_2_0 = () =>
  describe('ResolveAmbiguousContextTargetMultiInstance', async () => {
    const fdc3 = await getAgent();
    const control = new RaiseIntentControl2_0(fdc3);

    after(async function after() {
      await closeMockAppWindow(this.currentTest?.title ?? 'Unknown Test');
    });
    const ResolveAmbiguousContextTargetMultiInstance =
      "(ResolveAmbiguousContextTargetMultiInstance) Open 2 instances of App E and AppF respectively and then should be able to raise intent using Context and manually select an app out of 'E','F','G','H' and 'I'";
    it(ResolveAmbiguousContextTargetMultiInstance, async () => {
      try {
        const context = {
          type: ContextType.testContextY,
        };
        await control.openIntentApp(IntentApp.IntentAppE);
        await control.openIntentApp(IntentApp.IntentAppE);
        await control.openIntentApp(IntentApp.IntentAppF);
        await control.openIntentApp(IntentApp.IntentAppF);
        await wait(100);

        await fdc3.raiseIntentForContext(context);
      } catch (ex) {
        handleFail(raiseIntentDocs, ex);
      }
    });
  });

export const fdc3ChannelChangedEvent_2_2 = () =>
  describe('2.2-ChannelChangedEvent', () => {
    it('(2.2-ChannelChangedEvent) Should receive an event when the user changes channel.  This is a manual test, please change the channel a few times in your browser to get this to pass.', async () => {
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
