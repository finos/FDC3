import { DesktopAgent } from '@finos/fdc3';
import constants from '../../constants';
import { AppControlContext } from '../../context-types';

export const closeWindowOnCompletion = async (fdc3: DesktopAgent) => {
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

export const sendContextToTests = async (fdc3: DesktopAgent, context: AppControlContext) => {
  const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
  await appControlChannel.broadcast(context);
};

export const validateContext = (fdc3: DesktopAgent, receivedContextType: string, expectedContextType: string): void => {
  if (expectedContextType !== receivedContextType) {
    sendContextToTests(fdc3, {
      type: 'error',
      errorMessage: `Incorrect context received for intent 'aTestingIntent. Expected ${expectedContextType}, got ${receivedContextType}`,
    });
  }
};
