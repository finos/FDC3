import { assert, expect } from 'chai';
import { Context, DesktopAgent, OpenError } from 'fdc3_2_0';
import constants from '../../../constants';
import { ContextSender } from '../../../mock/v2.0/general';
import { sleep } from '../../../utils';
import { AppControlContext } from '../../../context-types';
import { OpenControl } from '../../common/control/open-control';
import { APIDocumentation2_0 } from '../apiDocuments-2.0';
import { closeMockAppWindow } from '../fdc3-2_0-utils';
import { ControlContextType } from './intent-support-2.0';

declare let fdc3: DesktopAgent;
const openDocs = '\r\nDocumentation: ' + APIDocumentation2_0.open + '\r\nCause:';
const testTimeoutMessage = `Test timeout - An error was not thrown within the allocated timeout of ${constants.NoListenerTimeout}. This timeout is not defined by the standard, rather by each implementation. Hence, if you DA implementation uses a longer timeout the constants.NoListenerTimeout in the test framework will need to be increased.`;

export class OpenControl2_0 implements OpenControl<Context> {
  contextReceiver = async (contextType: string): Promise<Context> => {
    const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
    let timeout;
    const messageReceived = new Promise<Context>(async (resolve, reject) => {
      const listener = await appControlChannel.addContextListener(contextType, async (context: AppControlContext) => {
        if (context.errorMessage) {
          reject(new Error(context.errorMessage));
        } else {
          resolve(context);
        }
        clearTimeout(timeout);
        listener.unsubscribe();
      });
      //if no context received reject promise
      const { promise: thePromise, timeout: theTimeout } = sleep();
      timeout = theTimeout;
      await thePromise;
      reject(new Error('No context received from app B'));
    });

    return messageReceived;
  };

  openMockApp = async (targetApp: any, context?: any) => {
    let instanceIdentifier: any;
    if (context) {
      instanceIdentifier = await fdc3.open(targetApp, context);
    } else {
      instanceIdentifier = await fdc3.open(targetApp);
    }
    return instanceIdentifier;
  };

  //Close mock app using the interface implementation so that common tests can switch freely between different closeMockAppWindow implementations
  async closeMockApp(testId: string) {
    await closeMockAppWindow(testId);
  }

  createTargetApp(name?: string, appId?: string) {
    return { appId };
  }
  addListenerAndFailIfReceived = async () => {
    const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
    await appControlChannel.addContextListener(ControlContextType.contextReceived, (context: AppControlContext) => {
      assert.fail(context.errorMessage);
    });
  };

  confirmAppNotFoundErrorReceived = (exception: DOMException) => {
    expect(exception).to.have.property('message', OpenError.AppNotFound, openDocs);
  };

  validateReceivedContext = async (context: ContextSender, expectedContextType: string) => {
    expect(context.context.type).to.eq(expectedContextType, openDocs);
  };

  expectAppTimeoutErrorOnOpen = async (targetApp: any) => {
    const { timeout, promise } = sleep(constants.NoListenerTimeout);
    let promiseRejected;

    //wait for the open promise to be rejected
    try {
      await fdc3.open(targetApp, { type: 'fdc3.contextDoesNotExist' });
      await promise;
    } catch (ex) {
      console.log('************************ex is ***************************', ex);
      expect(ex).to.have.property('message', OpenError.AppTimeout, openDocs);
      promiseRejected = true;
      clearTimeout(timeout);
    }

    if (!promiseRejected) {
      assert.fail(testTimeoutMessage + openDocs);
    }
  };
}
