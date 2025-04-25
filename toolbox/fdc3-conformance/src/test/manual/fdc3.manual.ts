import { ApiEvent, DesktopAgent, getAgent } from '@finos/fdc3';
import { closeMockAppWindow } from '../fdc3-2_0-utils';
import { APIDocumentation2_0 } from '../support/apiDocuments-2.0';
import { ContextType, IntentApp, Intent, RaiseIntentControl2_0 } from '../support/intent-support-2.0';
import { handleFail, wait } from '../../utils';

const control = new RaiseIntentControl2_0();
const raiseIntentDocs = '\r\nDocumentation: ' + APIDocumentation2_0.raiseIntent + '\r\nCause';

declare let fdc3: DesktopAgent;

/**
 * Details on the mock apps used in these tests can be found in /mock/README.md
 */

export let fdc3ResolveAmbiguousIntentTarget_2_0 = () =>
  describe('2.0-ResolveAmbiguousIntentTarget', () => {
    after(async function after() {
      await closeMockAppWindow(this.currentTest?.title ?? 'Unknown Test');
    });
    const ResolveAmbiguousIntentTarget =
      "(2.0-ResolveAmbiguousIntentTarget) Should be able to raise intent using Intent and Context and manually select an app out of 'E','F','G','H' and 'I'";
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

export let fdc3ResolveAmbiguousContextTarget_2_0 = () =>
  describe('2.0-ResolveAmbiguousContextTarget', () => {
    after(async function after() {
      await closeMockAppWindow(this.currentTest?.title ?? 'Unknown Test');
    });
    const ResolveAmbiguousIntentTarget =
      "(2.0-ResolveAmbiguousContextTarget) Should be able to raise intent using ContextY and manually select an app out of 'E','F','G','H' and 'I'";
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

export let fdc3ResolveAmbiguousIntentTargetMultiInstance_2_0 = () =>
  describe('2.0-ResolveAmbiguousIntentTargetMultiInstance', () => {
    after(async function after() {
      await closeMockAppWindow(this.currentTest?.title ?? 'Unknown Test');
    });
    const ResolveAmbiguousIntentTargetMultiInstance =
      "(2.0-ResolveAmbiguousIntentTargetMultiInstance) Open 2 instances of App E and AppF respectively and then should be able to raise intent using Intent and Context and manually select an app out of 'E','F','G','H' and 'I'";
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

export let fdc3ResolveAmbiguousContextTargetMultiInstance_2_0 = () =>
  describe('2.0-ResolveAmbiguousContextTargetMultiInstance', () => {
    after(async function after() {
      await closeMockAppWindow(this.currentTest?.title ?? 'Unknown Test');
    });
    const ResolveAmbiguousContextTargetMultiInstance =
      "(2.0-ResolveAmbiguousContextTargetMultiInstance) Open 2 instances of App E and AppF respectively and then should be able to raise intent using Context and manually select an app out of 'E','F','G','H' and 'I'";
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

export let fdc3ChannelChangedEvent_2_2 = () =>
  describe('2.2-ChannelChangedEvent', () => {
    it('(2.2-ChannelChangedEvent) Should receive an event when the user changes channel.  This is a manual test, please change the channel a few times in your browser to get this to pass.', async () => {
      const changeEvents: ApiEvent[] = [];
      try {
        const agent = await getAgent();
        agent.addEventListener("userChannelChanged", (event) => {
          console.log("User channel changed", event);
          changeEvents.push(event);
        });

        await wait(8000);
        expect(changeEvents.length).toBeGreaterThan(0);
      } catch (ex) {
        handleFail(`Didn't get any channel change events: ${JSON.stringify(changeEvents)}`, ex);
      }
    });
  });
