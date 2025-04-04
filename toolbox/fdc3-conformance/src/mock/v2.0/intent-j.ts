import { closeWindowOnCompletion, onFdc3Ready, sendContextToTests, validateContext } from './mock-functions';
import { ChannelError, DesktopAgent } from 'fdc3_2_0';
import { ContextType, ControlContextType, Intent } from '../../test/v2.0/support/intent-support-2.0';

declare let fdc3: DesktopAgent;

onFdc3Ready().then(async () => {
  await closeWindowOnCompletion();

  //used in '2.0-PrivateChannelsAreNotAppChannels'
  fdc3.addIntentListener(Intent.privateChannelIsPrivate, async context => {
    validateContext(context.type, ContextType.privateChannelDetails);

    try {
      await fdc3.getOrCreateChannel(context.id.key);
      await sendContextToTests({
        type: ControlContextType.error,
        errorMessage: "No error thrown when calling fdc3.getOrCreateChannel('<idPassedInContext>') from the mock app",
      });
    } catch (ex) {
      if (ex.message !== ChannelError.AccessDenied) {
        await sendContextToTests({
          type: ControlContextType.error,
          errorMessage: `Incorrect error received when calling fdc3.getOrCreateChannel('<idPassedInContext>'). Expected AccessDenied, got ${ex.message}`,
        });
      }
    }

    return context;
  });
});
