import { closeWindowOnCompletion, sendContextToTests, validateContext } from './mock-functions';
import { ChannelError, getAgent } from '@finos/fdc3';
import { ContextType, ControlContextType, Intent } from '../../test/v2.0/support/intent-support-2.0';

getAgent().then(async fdc3 => {
  await closeWindowOnCompletion(fdc3);

  //used in '2.0-PrivateChannelsAreNotAppChannels'
  fdc3.addIntentListener(Intent.privateChannelIsPrivate, async context => {
    validateContext(fdc3, context.type, ContextType.privateChannelDetails);

    try {
      await fdc3.getOrCreateChannel(context?.id?.key ?? 'some-new-channel');
      await sendContextToTests(fdc3, {
        type: ControlContextType.ERROR,
        errorMessage: "No error thrown when calling fdc3.getOrCreateChannel('<idPassedInContext>') from the mock app",
      });
    } catch (ex) {
      const message = ex instanceof Error ? ex.message : String(ex);

      if (message !== ChannelError.AccessDenied) {
        await sendContextToTests(fdc3, {
          type: ControlContextType.ERROR,
          errorMessage: `Incorrect error received when calling fdc3.getOrCreateChannel('<idPassedInContext>'). Expected AccessDenied, got ${message}`,
        });
      }
    }

    return context;
  });
});
