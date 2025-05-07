import { assert, expect } from 'chai';
import { AppIdentifier, Context, DesktopAgent, Listener, OpenError } from '@finos/fdc3';
import constants from '../../constants';
import { ContextSender } from '../../mock/v2.0/general';
import { failAfterTimeout } from '../../utils';
import { AppControlContext } from '../../context-types';
import { OpenControl } from '../support/open-control';
import { APIDocumentation2_0 } from '../support/apiDocuments-2.0';
import { closeMockAppWindow } from '../fdc3-2_0-utils';
import { ControlContextType } from './intent-support-2.0';

const openDocs = '\r\nDocumentation: ' + APIDocumentation2_0.open + '\r\nCause:';

export class OpenControl2_0 implements OpenControl {
  private readonly fdc3: DesktopAgent;

  constructor(fdc3: DesktopAgent) {
    this.fdc3 = fdc3;
  }

  contextReceiver = async (contextType: string): Promise<Context> => {
    const appControlChannel = await this.fdc3.getOrCreateChannel(constants.ControlChannel);

    let listener: Listener | undefined;

    const messageReceived = new Promise<Context>((resolve, reject) => {
      appControlChannel
        .addContextListener(contextType, (context: AppControlContext) => {
          if (context.errorMessage) {
            reject(new Error(context.errorMessage));
          } else {
            resolve(context);
          }
        })
        .then(l => {
          listener = l;
        })
        .catch(reject);
    });

    try {
      const result = await Promise.race([messageReceived, failAfterTimeout(constants.NoListenerTimeout)]);
      if (result) {
        return result;
      } else {
        throw new Error('No context received from app B');
      }
    } finally {
      if (listener) listener.unsubscribe();
    }
  };

  openMockApp = async (targetApp: AppIdentifier, context?: Context) => {
    let instanceIdentifier: AppIdentifier;
    if (context) {
      instanceIdentifier = await this.fdc3.open(targetApp, context);
    } else {
      instanceIdentifier = await this.fdc3.open(targetApp);
    }
    return instanceIdentifier;
  };

  //Close mock app using the interface implementation so that common tests can switch freely between different closeMockAppWindow implementations
  async closeMockApp(testId: string) {
    await closeMockAppWindow(testId);
  }

  createTargetAppIdentifier(appId: string) {
    return { appId };
  }

  addListenerAndFailIfReceived = async () => {
    const appControlChannel = await this.fdc3.getOrCreateChannel(constants.ControlChannel);
    await appControlChannel.addContextListener(ControlContextType.CONTEXT_RECEIVED, (context: AppControlContext) => {
      assert.fail(context.errorMessage);
    });
  };

  confirmAppNotFoundErrorReceived = (exception: unknown) => {
    expect(exception).to.have.property('message', OpenError.AppNotFound, openDocs);
  };

  validateReceivedContext = async (context: ContextSender, expectedContextType: string) => {
    expect(context.context?.type).to.eq(expectedContextType, openDocs);
  };

  expectAppTimeoutErrorOnOpen = async (targetApp: AppIdentifier) => {
    try {
      //wait for the open promise to be rejected
      Promise.race([
        this.fdc3.open(targetApp, { type: 'fdc3.contextDoesNotExist' }),
        failAfterTimeout(constants.NoListenerTimeout),
      ]);
    } catch (ex) {
      expect(ex).to.have.property('message', OpenError.AppTimeout, openDocs);
    }
  };
}
