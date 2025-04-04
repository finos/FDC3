import { assert, expect } from 'chai';
import { Context, DesktopAgent, OpenError, TargetApp } from 'fdc3_1_2';
import constants from '../../../constants';
import { ContextSender } from '../../../mock/v1.2/general';
import { sleep } from '../../../utils';
import { AppControlContext } from '../../../context-types';
import { OpenControl } from '../../common/control/open-control';
import { APIDocumentation1_2 } from '../apiDocuments-1.2';
import { closeMockAppWindow } from '../fdc3-1_2-utils';

declare let fdc3: DesktopAgent;
const openDocs = '\r\nDocumentation: ' + APIDocumentation1_2.open + '\r\nCause:';
const testTimeoutMessage = `Test timeout - An error was not thrown within the allocated timeout of ${constants.NoListenerTimeout}. This timeout is not defined by the standard, rather by each implementation. Hence, if you DA implementation uses a longer timeout the constants.NoListenerTimeout in the test framework will need to be increased.`;

export class OpenControl1_2 implements OpenControl<Context> {
  contextReceiver = async (contextType: string, expectNotToReceiveContext?: boolean): Promise<Context> => {
    const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
    const messageReceived = new Promise<Context>(async (resolve, reject) => {
      const listener = appControlChannel.addContextListener(contextType, async (context: AppControlContext) => {
        if (context.errorMessage) {
          reject(context.errorMessage);
        } else {
          resolve(context);
        }

        listener.unsubscribe();
      });

      const { promise: thePromise } = sleep(); //if no context received reject promise
      await thePromise;
      if (!expectNotToReceiveContext) {
        reject(new Error('No context received from app B'));
      } else {
        resolve({ type: 'noContextReceived' });
      }
    });
    return messageReceived;
  };

  openMockApp = async (targetApp: TargetApp, context?: Context) => {
    //set context parameter
    if (context) {
      await fdc3.open(targetApp, context);
    } else {
      await fdc3.open(targetApp);
    }
  };

  //Close mock app using the interface implementation so that common tests can switch freely between different closeMockAppWindow implementations
  async closeMockApp(testId: string) {
    await closeMockAppWindow(testId);
  }

  createTargetApp(name?: string, appId?: string) {
    return { name, appId };
  }
  addListenerAndFailIfReceived = async () => {
    const appControlChannel = await fdc3.getOrCreateChannel(constants.ControlChannel);
    await appControlChannel.addContextListener('wrong-context', (context: AppControlContext) => {
      assert.fail(context.errorMessage);
    });
  };

  confirmAppNotFoundErrorReceived = (exception: DOMException) => {
    expect(exception).to.have.property('message', OpenError.AppNotFound, openDocs);
  };

  validateReceivedContext = async (context: ContextSender, expectedContextType: string): Promise<void> => {
    expect(context.context.name).to.eq('context', openDocs);
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
      expect(ex).to.have.property('message', OpenError.AppTimeout, openDocs);
      promiseRejected = true;
      clearTimeout(timeout);
    }

    if (!promiseRejected) {
      assert.fail(testTimeoutMessage + openDocs);
    }
  };
}
