import { assert, expect } from 'chai';
import { wait } from '../../utils';
import constants from '../../constants';
import { APP_CHANNEL_AND_BROADCAST, APP_CHANNEL_AND_BROADCAST_TWICE, ChannelControl } from '../support/channel-control';

export function createAppChannelTests(cc: ChannelControl, documentation: string, prefix: string): Mocha.Suite {
  return describe('App channels', () => {
    beforeEach(cc.leaveChannel);

    afterEach(async function afterEach() {
      await cc.closeMockApp(this.currentTest!.title);
    });

    const acTestId =
      '(' +
      prefix +
      'ACBasicUsage1) Should receive context when app a adds a listener and app B broadcasts to the same app channel';
    it(acTestId, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A retrieves an app channel\r\n- App A adds adds a context listener of type null\r\n- App B retrieves the same app channel as A\r\n- App B broadcasts context of type fdc3.instrument${documentation}`;

      const testChannel = await cc.createRandomTestChannel();
      const resolveExecutionCompleteListener = cc.initCompleteListener(acTestId);
      let receivedContext = false;
      const listener1 = await cc.setupAndValidateListener(testChannel, null, 'fdc3.instrument', errorMessage, () => {
        receivedContext = true;
      });
      await cc.openChannelApp(acTestId, testChannel.id, APP_CHANNEL_AND_BROADCAST);
      await resolveExecutionCompleteListener;
      try {
        if (!receivedContext) {
          //allow upto a second for the context to arrive
          await wait(constants.ShortWait);
          if (!receivedContext) {
            assert.fail(`No context received!\n${errorMessage}`);
          }
        }
      } finally {
        cc.unsubscribeListeners([listener1]);
      }
    });

    const acTestId2 =
      '(' +
      prefix +
      'ACBasicUsage2) Should receive context when app B broadcasts context to an app channel before A retrieves current context';
    it(acTestId2, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A & B retrieve the same app channel\r\n- App B broadcasts context of type fdc3.instrument\r\n- App A retrieves current context of type null${documentation}`;

      const testChannel = await cc.createRandomTestChannel();
      const resolveExecutionCompleteListener = cc.initCompleteListener(acTestId2);
      await cc.openChannelApp(acTestId2, testChannel.id, APP_CHANNEL_AND_BROADCAST);
      await resolveExecutionCompleteListener;
      let receivedContext = false;
      await cc.setupContextChecker(testChannel, null, 'fdc3.instrument', errorMessage, () => (receivedContext = true));

      if (!receivedContext) {
        //allow upto a second for the context to arrive
        await wait(constants.ShortWait);
        if (!receivedContext) {
          assert.fail(`No context received!\n${errorMessage}`);
        }
      }
    });

    const acTestId4 =
      '(' +
      prefix +
      'ACFilteredContext1) Should only receive the listened context when app B broadcasts multiple contexts to the same app channel';
    it(acTestId4, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A retrieves an app channel\r\n- App A adds a context listener of type fdc3.instrument\r\n- App B retrieves the same app channel as A\r\n- App B broadcasts a context of type fdc3.instrument and fdc3.contact${documentation}`;

      const testChannel = await cc.createRandomTestChannel();
      const resolveExecutionCompleteListener = cc.initCompleteListener(acTestId4);
      let receivedContext = false;
      const listener1 = await cc.setupAndValidateListener(
        testChannel,
        'fdc3.instrument',
        'fdc3.instrument',
        errorMessage,
        () => {
          receivedContext = true;
        }
      );
      await cc.openChannelApp(acTestId4, testChannel.id, APP_CHANNEL_AND_BROADCAST_TWICE);
      await resolveExecutionCompleteListener;
      try {
        if (!receivedContext) {
          //allow upto a second for the context to arrive
          await wait(constants.ShortWait);
          if (!receivedContext) {
            assert.fail(`No context received!\n${errorMessage}`);
          }
        }
      } finally {
        cc.unsubscribeListeners([listener1]);
      }
    });

    const acTestId6 =
      '(' +
      prefix +
      'ACUnsubscribe) Should not receive context when unsubscribing an app channel before app B broadcasts to that channel';
    it(acTestId6, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A retrieves an app channel\r\n- App A adds a context listener of type fdc3.instrument\r\n- App A unsubscribes the app channel\r\n- App B retrieves the same app channel\r\n- App B broadcasts a context of type fdc3.instrument and fdc3.contact${documentation}`;

      const testChannel = await cc.createRandomTestChannel();
      const resolveExecutionCompleteListener = cc.initCompleteListener(acTestId6);

      const listener = await cc.setupAndValidateListener(
        testChannel,
        'fdc3.instrument',
        'unexpected-context',
        errorMessage,
        () => {
          /*noop*/
        }
      );
      await cc.unsubscribeListeners([listener]);
      await cc.openChannelApp(acTestId6, testChannel.id, APP_CHANNEL_AND_BROADCAST);

      await resolveExecutionCompleteListener;
    });

    const acTestId7 =
      '(' +
      prefix +
      'ACFilteredContext2) Should not receive context when app B broadcasts context to a different app channel';
    it(acTestId7, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A retrieves an app channel\r\n- App A adds a context listener of type fdc3.instrument\r\n- App B retrieves a different app channel\r\n- App B broadcasts a context of type fdc3.instrument${documentation}`;

      const testChannel = await cc.createRandomTestChannel();
      const listener = await cc.setupAndValidateListener(
        testChannel,
        'fdc3.instrument',
        'unexpected-context',
        errorMessage,
        () => {
          /*noop*/
        }
      );
      const differentTestChannel = await cc.createRandomTestChannel();
      await cc.openChannelApp(acTestId7, differentTestChannel.id, APP_CHANNEL_AND_BROADCAST_TWICE);
      await wait(constants.ShortWait); // give listener time to receive context
      cc.unsubscribeListeners([listener]);
    });

    const acTestId8 =
      '(' +
      prefix +
      'ACFilteredContext3) Should not receive context when retrieving two different app channels before app B broadcasts the listened type to the first channel that was retrieved';
    it(acTestId8, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A retrieves an app channel\r\n- App A switches to a different app channel\r\n- App A adds a context listener of type fdc3.instrument\r\n- App B retrieves the first channel that A retrieved\r\n- App B broadcasts a context of type fdc3.instrument${documentation}`;

      const testChannel = await cc.createRandomTestChannel();
      let receivedContext = false;

      const resolveExecutionCompleteListener = cc.initCompleteListener(acTestId8);
      const differentAppChannel = await cc.createRandomTestChannel();
      const listener = await cc.setupAndValidateListener(
        testChannel,
        'fdc3.instrument',
        'fdc3.instrument',
        errorMessage,
        () => {
          receivedContext = true;
        }
      );
      const listener2 = await cc.setupAndValidateListener(
        differentAppChannel,
        'fdc3.instrument',
        'unexpected-context',
        errorMessage,
        () => {
          /*noop*/
        }
      );
      await cc.openChannelApp(acTestId8, testChannel.id, APP_CHANNEL_AND_BROADCAST_TWICE);
      await resolveExecutionCompleteListener;
      try {
        if (!receivedContext) {
          //allow upto a second for the context to arrive
          await wait(constants.ShortWait);
          if (!receivedContext) {
            assert.fail(`No context received!\n${errorMessage}`);
          }
        }
      } finally {
        cc.unsubscribeListeners([listener, listener2]);
      }
    });

    const acTestId9 =
      '(' +
      prefix +
      'ACFilteredContext4) Should not receive context when retrieving two different app channels before the second app broadcasts the listened type to the first channel that was retrieved';
    it(acTestId9, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A retrieves an app channel\r\n- App A switches to a different app channel\r\n- App A adds a context listener of type fdc3.instrument\r\n- App B retrieves the first channel that A retrieved\r\n- App B broadcasts a context of type fdc3.instrument${documentation}`;

      const testChannel = await cc.createRandomTestChannel();
      let receivedContext = false;
      const resolveExecutionCompleteListener = cc.initCompleteListener(acTestId9);
      const differentAppChannel = await cc.createRandomTestChannel();
      const listener = await cc.setupAndValidateListener(
        testChannel,
        'fdc3.instrument',
        'fdc3.instrument',
        errorMessage,
        () => {
          receivedContext = true;
        }
      );
      const listener2 = await cc.setupAndValidateListener(
        differentAppChannel,
        'fdc3.instrument',
        'unexpected-context',
        errorMessage,
        () => {
          /*noop*/
        }
      );
      await cc.openChannelApp(acTestId9, testChannel.id, APP_CHANNEL_AND_BROADCAST_TWICE);
      await resolveExecutionCompleteListener;
      try {
        if (!receivedContext) {
          //allow upto a second for the context to arrive
          await wait(constants.ShortWait);
          if (!receivedContext) {
            assert.fail(`No context received!\n${errorMessage}`);
          }
        }
      } finally {
        cc.unsubscribeListeners([listener, listener2]);
      }
    });

    const acTestId10 =
      '(' +
      prefix +
      'ACContextHistoryTyped) Should receive both contexts when app B broadcasts both contexts to the same app channel and A gets current context for each type';
    it(acTestId10, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A retrieves an app channel\r\n- App B retrieves the same app channel\r\n- App B broadcasts a context of type fdc3.instrument and fdc3.contact\r\n- App A gets current context for types fdc3.instrument and fdc3.contact${documentation}`;

      const testChannel = await cc.createRandomTestChannel();
      const resolveExecutionCompleteListener = cc.initCompleteListener(acTestId10);

      await cc.openChannelApp(acTestId10, testChannel.id, APP_CHANNEL_AND_BROADCAST_TWICE);
      await resolveExecutionCompleteListener;

      await cc.setupContextChecker(testChannel, 'fdc3.instrument', 'fdc3.instrument', errorMessage, context => {
        expect(context.name).to.be.equals('History-item-1', errorMessage);
      });
      await cc.setupContextChecker(testChannel, 'fdc3.contact', 'fdc3.contact', errorMessage, context => {
        expect(context.name).to.be.equals('History-item-1', errorMessage);
      });
    });

    const acTestId11 =
      '(' +
      prefix +
      'ACContextHistoryMultiple) Should retrieve the last broadcast context item when app B broadcasts a context with multiple history items to the same app channel and A gets current context';
    it(acTestId11, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A retrieves an app channel\r\n- App B retrieves the same app channel\r\n- App B broadcasts two different contexts of type fdc3.instrument\r\n- App A gets current context for types fdc3.instrument${documentation}`;

      const testChannel = await cc.createRandomTestChannel();
      const resolveExecutionCompleteListener = cc.initCompleteListener(acTestId11);

      await cc.openChannelApp(acTestId11, testChannel.id, APP_CHANNEL_AND_BROADCAST_TWICE, 2);
      await resolveExecutionCompleteListener;
      await cc.setupContextChecker(testChannel, 'fdc3.instrument', 'fdc3.instrument', errorMessage, context => {
        expect(context.name).to.be.equals('History-item-2', errorMessage);
      });
      await cc.setupContextChecker(testChannel, 'fdc3.contact', 'fdc3.contact', errorMessage, context => {
        expect(context.name).to.be.equals('History-item-2', errorMessage);
      });
    });

    const acTestId12 =
      '(' +
      prefix +
      'ACContextHistoryLast) Should retrieve the last broadcast context item when app B broadcasts two different contexts to the same app channel and A gets current context';
    it(acTestId12, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A retrieves an app channel\r\n- App B retrieves the same app channel\r\n- App B broadcasts a context of type fdc3.instrument and fdc3.contact\r\n- App B gets current context with no filter applied${documentation}`;

      const testChannel = await cc.createRandomTestChannel();
      const resolveExecutionCompleteListener = cc.initCompleteListener(acTestId12);
      await cc.openChannelApp(acTestId12, testChannel.id, APP_CHANNEL_AND_BROADCAST_TWICE);
      await resolveExecutionCompleteListener;

      const context = await testChannel.getCurrentContext();

      if (context === null) {
        assert.fail('No Context retrieved', errorMessage);
      } else if (context.type === 'fdc3.instrument') {
        assert.fail('Did not retrieve last broadcast context from app B', errorMessage);
      } else {
        expect(context.type).to.be.equals('fdc3.contact', errorMessage);
      }
    });
  });
}
