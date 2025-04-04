import { closeWindowOnCompletion, onFdc3Ready, sendContextToTests, validateContext } from './mock-functions';
import { DesktopAgent } from 'fdc3_2_0';
import { wait } from '../../utils';
import { IntentUtilityContext } from '../../context-types';
import constants from '../../constants';
import { ContextType, ControlContextType, Intent } from '../../test/v2.0/support/intent-support-2.0';
declare let fdc3: DesktopAgent;

//used in '2.0-PrivateChannelsLifecycleEvents'
onFdc3Ready().then(async () => {
  await closeWindowOnCompletion();

  fdc3.addIntentListener(Intent.kTestingIntent, async context => {
    validateContext(context.type, ContextType.testContextX);
    const privChan = await fdc3.createPrivateChannel();

    await privChan.addContextListener(ContextType.testContextX, async () => {
      await sendContextToTests({ type: ContextType.testContextX }); //let test know addContextListener was triggered
    });

    let contextStreamNumber = 1;
    privChan.onAddContextListener(async contextType => {
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

    await privChan.onUnsubscribe(async contextType => {
      //let test know onUnsubscribe was triggered
      await sendContextToTests({ type: ControlContextType.onUnsubscribeTriggered });
    });

    await privChan.onDisconnect(async () => {
      //let test know onUnsubscribe was triggered
      await sendContextToTests({ type: ControlContextType.onDisconnectTriggered });
    });

    return privChan;
  });
});
