import { closeWindowOnCompletion, sendContextToTests, validateContext } from './mock-functions';
import { getAgent } from '@finos/fdc3';
import { wait } from '../../utils';
import { IntentUtilityContext } from '../../context-types';
import { ContextType, ControlContextType, Intent } from '../../test/v2.0/support/intent-support-2.0';

//used in '2.0-PrivateChannelsLifecycleEvents'
getAgent().then(async fdc3 => {
  await closeWindowOnCompletion(fdc3);

  fdc3.addIntentListener(Intent.kTestingIntent, async context => {
    validateContext(fdc3, context.type, ContextType.testContextX);
    const privChan = await fdc3.createPrivateChannel();

    await privChan.addContextListener(ContextType.testContextX, async () => {
      await sendContextToTests(fdc3, { type: ContextType.testContextX }); //let test know addContextListener was triggered
    });

    let contextStreamNumber = 1;
    privChan.onAddContextListener(async () => {
      await wait(100); //wait for listener in test to initialise

      //stream multiple contexts to test in short succession
      for (let i = 0; i < 5; i++) {
        let intentKContext: IntentUtilityContext = {
          type: ContextType.testContextZ,
          number: contextStreamNumber,
        };

        await privChan.broadcast(intentKContext);
        contextStreamNumber++;

        //give broadcast time to run
        await wait(50);
      }
    });

    await privChan.onUnsubscribe(async () => {
      //let test know onUnsubscribe was triggered
      await sendContextToTests(fdc3, { type: ControlContextType.ON_UNSUBSCRIBE_TRIGGERED });
    });

    await privChan.onDisconnect(async () => {
      //let test know onUnsubscribe was triggered
      await sendContextToTests(fdc3, { type: ControlContextType.ON_DISCONNECT_TRIGGERED });
    });

    return privChan;
  });
});
