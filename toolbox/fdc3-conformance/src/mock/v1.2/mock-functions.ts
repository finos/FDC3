import { DesktopAgent } from 'fdc3_1_2/dist/api/DesktopAgent';
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
  console.log('Setting up closeWindow listener on app-control channel');
  const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
  appControlChannel.addContextListener('closeWindow', (context: AppControlContext) => {
    //notify app A that window was closed
    appControlChannel.broadcast({
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

export const sendContextToTests = async context => {
  const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
  appControlChannel.broadcast(context);
};
