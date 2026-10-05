import { assert, expect } from 'chai';
import { AppIdentifier, Context, DesktopAgent, Listener, OpenError } from '@finos/fdc3';
import constants from '../../constants';
import { ContextSender } from '../../mock/general';
import { failAfterTimeout } from '../../utils';
import { AppControlContext } from '../../context-types';
import { OpenControl } from './open-control';
import { APIDocumentation } from './apiDocuments';
import { MockAppTracker } from '../fdc3-conformance-utils';
import { ControlContextType } from './intent-support';

const openDocs = '\r\nDocumentation: ' + APIDocumentation.open + '\r\nCause:';

export class OpenControlImpl implements OpenControl {
  private readonly fdc3: DesktopAgent;
  private readonly mockAppTracker = new MockAppTracker();

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

  openMockApp = async (testId: string, targetApp: AppIdentifier, context?: Context) => {
    let instanceIdentifier: AppIdentifier;
    if (context) {
      instanceIdentifier = await this.fdc3.open(targetApp, context);
    } else {
      instanceIdentifier = await this.fdc3.open(targetApp);
    }
    this.mockAppTracker.markOpened(testId);
    return instanceIdentifier;
  };

  async closeMockAppIfOpened(testId: string) {
    await this.mockAppTracker.closeIfOpened(testId);
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

  expectAppTimeoutErrorOnOpen = async (testId: string, targetApp: AppIdentifier) => {
    this.mockAppTracker.markOpened(testId);
    try {
      //wait for the open promise to be rejected
      await Promise.race([
        this.fdc3.open(targetApp, { type: 'fdc3.contextDoesNotExist' }),
        failAfterTimeout(constants.NoListenerTimeout),
      ]);
    } catch (ex) {
      expect(ex).to.have.property('message', OpenError.AppTimeout, openDocs);
    }
  };
}
