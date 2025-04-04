import { DesktopAgent } from 'fdc3_2_0/dist/api/DesktopAgent';
import constants from '../../constants';
import { AppControlContext } from '../../context-types';
import { fdc3Ready } from '@kite9/fdc3-get-agent';

declare let fdc3: DesktopAgent;

export const onFdc3Ready = () =>
  new Promise(resolve => {
    if (window.fdc3) {
      resolve(undefined);
    } else {
      fdc3Ready().then(() => resolve(undefined));
    }
  });

export const closeWindowOnCompletion = async () => {
  const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
  await appControlChannel.addContextListener('closeWindow', async (context: AppControlContext) => {
    //notify app A that window was closed
    await appControlChannel.broadcast({
      type: 'windowClosed',
      testId: context.testId,
    } as AppControlContext);
    setTimeout(() => {
      //yield to make sure the broadcast gets out before we close
      window.close();
      return;
    }, 5);
  });
};

export const sendContextToTests = async (context: AppControlContext) => {
  const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
  await appControlChannel.broadcast(context);
};

export const validateContext = (receivedContextType: string, expectedContextType: string): void => {
  if (expectedContextType !== receivedContextType) {
    sendContextToTests({
      type: 'error',
      errorMessage: `Incorrect context received for intent 'aTestingIntent. Expected ${expectedContextType}, got ${receivedContextType}`,
    });
  }
};
