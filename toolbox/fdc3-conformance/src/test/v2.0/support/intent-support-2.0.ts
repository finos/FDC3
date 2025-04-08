import { assert, expect } from 'chai';
import {
  AppIdentifier,
  Channel,
  IntentResolution,
  IntentResult,
  Listener,
  PrivateChannel,
  Context,
  DesktopAgent,
  getOrCreateChannel,
} from '@finos/fdc3';
import { APIDocumentation2_0 } from '../apiDocuments-2.0';
import constants from '../../../constants';
import { sleep, wrapPromise } from '../../../utils';
import { AppControlContext, AppControlContextListener, IntentUtilityContext } from '../../../context-types';
import { waitForContext } from '../fdc3-2_0-utils';

declare let fdc3: DesktopAgent;
const raiseIntentDocs = '\r\nDocumentation: ' + APIDocumentation2_0.raiseIntent + '\r\nCause';

export class RaiseIntentControl2_0 {
  async receiveContext(contextType: string, waitTime?: number, count: number = 1): Promise<AppControlContext> {
    let timeout: number;
    const appControlChannel = await getOrCreateChannel(constants.ControlChannel);
    return new Promise<Context>(async (resolve, reject) => {
      const listener = await appControlChannel.addContextListener(contextType, (context: AppControlContext) => {
        count--;
        console.log(`Received ${contextType} waiting for ${count} more`);
        if (count == 0) {
          resolve(context);
          clearTimeout(timeout);
          listener.unsubscribe();
        }
      });

      //if no context received reject promise
      const { promise: sleepPromise, timeout: theTimeout } = sleep(waitTime ?? constants.WaitTime);
      timeout = theTimeout;
      await sleepPromise;
      if (count > 0) {
        reject(
          new Error(
            'No context received. Listener expected to receive context of type ' + contextType + ' from mock app'
          )
        );
      }
    });
  }

  async openIntentApp(appId): Promise<AppIdentifier> {
    try {
      return await fdc3.open({ appId: appId });
    } catch (ex) {
      assert.fail(`Error while attempting to open the mock app: ${ex.message ?? ex}`);
    }
  }

  async createAppChannel(channelId: string): Promise<Channel> {
    return await fdc3.getOrCreateChannel(channelId);
  }

  async createPrivateChannel(): Promise<PrivateChannel> {
    return await fdc3.createPrivateChannel();
  }

  validatePrivateChannel(privChan: PrivateChannel): void {
    expect(privChan).to.have.property('id');
  }

  async raiseIntent(
    intent: string,
    contextType: string,
    appIdentifier?: AppIdentifier,
    delayBeforeReturn: number = 0,
    contextId?: { [key: string]: string }
  ): Promise<IntentResolution> {
    let context: IntentUtilityContext = {
      type: contextType,
      delayBeforeReturn: delayBeforeReturn,
    };

    if (contextId) {
      context.id = contextId;
    }

    try {
      if (appIdentifier) {
        return await fdc3.raiseIntent(intent, context, appIdentifier);
      } else {
        return await fdc3.raiseIntent(intent, context);
      }
    } catch (ex) {
      assert.fail(`${ex.message ?? ex}`);
    }
  }

  async findInstances(appId: string): Promise<AppIdentifier[]> {
    try {
      return await fdc3.findInstances({ appId: appId });
    } catch (ex) {
      assert.fail(`Error while attempting to find instances: ${ex.message ?? ex}`);
    }
  }

  getIntentResult(intentResolution: IntentResolution): Promise<IntentResult> {
    //ensure getIntentResult immediately returns a promise that can be awaited
    const timeout = this.failIfResponseTimesOut();
    const intentResult = intentResolution.getResult();
    if (typeof intentResult.then !== 'function') {
      assert.fail(`intentResolution.getResult() did not return a Promise: ${JSON.stringify(intentResult, null, 2)}`);
    }
    clearTimeout(timeout);
    return intentResult;
  }

  failIfResponseTimesOut() {
    let timeout = window.setTimeout(() => {
      assert.fail(
        'When running getIntentResult() the promise should be returned immediately unless it is being awaited'
      );
    }, 500);

    return timeout;
  }

  async privateChannelBroadcast(privateChannel: PrivateChannel, contextType: string): Promise<void> {
    await privateChannel.broadcast({ type: contextType });
  }

  validateIntentResult(intentResult, expectedIntentResultType: IntentResultType, expectedContextType?: string) {
    switch (expectedIntentResultType) {
      case IntentResultType.Context: {
        if (expectedContextType) {
          expect(
            intentResult,
            `The promise received by Test from resolution.getResult() should resolve to a ${expectedContextType} instance`
          ).to.have.property('type');
          expect(
            intentResult.type,
            `The promise received by Test from resolution.getResult() should resolve to a ${expectedContextType} instance. Instead resolved to ${intentResult.type}`
          ).to.be.equal(expectedContextType);
          break;
        }
      }
      case IntentResultType.Void: {
        expect(intentResult, 'The promise received by Test from resolution.getResult() should resolve to void').to.be
          .undefined;
        break;
      }
      case IntentResultType.Channel: {
        expect(intentResult).to.have.property('id');
        expect(intentResult).to.have.property('type');
        expect(intentResult.type).to.be.equal('app');
        expect(intentResult.id).to.be.equal('test-channel');
        break;
      }
      case IntentResultType.PrivateChannel: {
        expect(intentResult).to.have.property('onAddContextListener');
        expect(intentResult).to.have.property('onUnsubscribe');
        expect(intentResult).to.have.property('onDisconnect');
        expect(intentResult).to.have.property('disconnect');
        expect(intentResult).to.have.property('id');
        expect(intentResult).to.have.property('type');
        expect(intentResult.type).to.be.equal('private');
      }
    }
  }

  validateInstances(
    instances: AppIdentifier[],
    expectedInstanceCount: number,
    expectedInstanceId?: string,
    returnedInstanceId?: string
  ): void {
    expect(instances.length).to.be.equal(expectedInstanceCount);
    expect(instances[0].instanceId).to.be.equal(expectedInstanceId);
    if (returnedInstanceId) {
      expect(expectedInstanceId).to.be.equal(returnedInstanceId);
    }
  }

  validateIntentResolution = (appId: string, intentResolution: IntentResolution) => {
    if (typeof intentResolution.source === 'object') {
      expect(intentResolution.source as AppIdentifier).to.have.property('appId');
      expect(intentResolution.source as AppIdentifier).to.have.property('instanceId');
      expect(typeof intentResolution.source.instanceId).to.be.equal('string');
      expect(intentResolution.source.instanceId).to.not.be.equal('');
      expect((intentResolution.source as AppIdentifier).appId).to.eq(appId, raiseIntentDocs);
    } else assert.fail('Invalid intent resolution object');
  };

  async listenForError() {
    const appControlChannel = await getOrCreateChannel('app-control');
    return appControlChannel.addContextListener('error', (context: AppControlContext) => {
      assert.fail(context.errorMessage);
    });
  }

  async receiveContextStreamFromMockApp(
    privChannel: PrivateChannel,
    streamedNumberStart: number,
    streamedNumberEnd: number
  ): Promise<Listener> {
    let timeout: number;
    const wrapper = wrapPromise();

    //receive multiple contexts in succession from intent-k
    const listener = privChannel.addContextListener(ContextType.testContextZ, (context: IntentUtilityContext) => {
      expect(context.number, 'Unexpected context stream number received.').to.be.equal(streamedNumberStart);
      expect(context.type).to.be.equal(ContextType.testContextZ);

      if (streamedNumberStart === streamedNumberEnd) {
        wrapper.resolve();
        clearTimeout(timeout);
      }

      streamedNumberStart += 1;
    });

    timeout = window.setTimeout(() => {
      wrapper.reject(
        'Timeout: did not receive all 5 streamed contexts back from the mock app. onAddContextListener may not have been triggered'
      );
    }, constants.WaitTime);

    await wrapper.promise;
    return listener;
  }

  unsubscribeListener(listener: Listener): void {
    listener.unsubscribe();
  }

  disconnectPrivateChannel(privateChannel: PrivateChannel): void {
    privateChannel.disconnect();
  }
}

export enum IntentResultType {
  Channel = 'Channel',
  PrivateChannel = 'PrivateChannel',
  Context = 'Context',
  Void = 'Void',
}

export enum IntentApp {
  IntentAppA = 'IntentAppAId',
  IntentAppB = 'IntentAppBId',
  IntentAppC = 'IntentAppCId',
  IntentAppD = 'IntentAppDId',
  IntentAppE = 'IntentAppEId',
  IntentAppF = 'IntentAppFId',
  IntentAppG = 'IntentAppGId',
  IntentAppH = 'IntentAppHId',
  IntentAppI = 'IntentAppIId',
  IntentAppJ = 'IntentAppJId',
  IntentAppK = 'IntentAppKId',
  IntentAppL = 'IntentAppLId',
}

export enum ContextType {
  testContextX = 'testContextX',
  testContextY = 'testContextY',
  testContextZ = 'testContextZ',
  testContextL = 'testContextL',
  nonExistentContext = 'nonExistentContext',
  privateChannelDetails = 'privateChannelDetails',
}

export enum ControlContextType {
  contextReceived = 'context-received',
  error = 'error',
  aTestingIntentListenerTriggered = 'aTestingIntent-listener-triggered',
  intentAppAOpened = 'intent-app-a-opened',
  sharedTestingIntent1ListenerTriggered = 'sharedTestingIntent1-listener-triggered',
  sharedTestingIntent2ResultSent = 'sharedTestingIntent2-result-sent',
  onUnsubscribeTriggered = 'onUnsubscribeTriggered',
  onDisconnectTriggered = 'onDisconnectTriggered',
  ContextListenerTriggered = 'context-listener-triggered',
  IntentListenerTriggered = 'intent-listener-triggered',
}

export enum Intent {
  aTestingIntent = 'aTestingIntent',
  bTestingIntent = 'bTestingIntent',
  cTestingIntent = 'cTestingIntent',
  kTestingIntent = 'kTestingIntent',
  lTestingIntent = 'LTestingIntent',
  sharedTestingIntent1 = 'sharedTestingIntent1',
  sharedTestingIntent2 = 'sharedTestingIntent2',
  privateChannelIsPrivate = 'privateChannelIsPrivate',
}
