import { assert, expect } from 'chai';
import { wait } from '../../utils';
import { JOIN_AND_BROADCAST, JOIN_AND_BROADCAST_TWICE } from '../support/channel-control';
import constants from '../../constants';
import { Context } from '@finos/fdc3';
import { ChannelControl2_0 } from '../support/channels-support-2.0';
import { getAgent } from '@finos/fdc3';
import { APIDocumentation2_0 } from '../support/apiDocuments-2.0';

const documentation = '\r\nDocumentation: ' + APIDocumentation2_0.desktopAgent + '\r\nCause:';

export default async () => {
  const fdc3 = await getAgent();
  const cc = new ChannelControl2_0(fdc3);
  const prefix = '2.0-';

  return describe('fdc3.userChannels', () => {
    beforeEach(cc.leaveChannel);

    afterEach(async function afterEach() {
      if (this.currentTest?.title !== UCFilteredUsageJoin)
        await cc.closeMockApp(this.currentTest?.title ?? 'Some-Test-Title');
    });

    const scTestId1 =
      '(' +
      prefix +
      'UCBasicUsage1) Should receive context when adding a listener then joining a user channel before app B broadcasts context to the same channel';
    it(scTestId1, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- Add fdc3.instrument context listener to app A\r\n- App A joins channel 1\r\n- App B joins channel 1\r\n- App B broadcasts fdc3.instrument context${documentation}`;

      const resolveExecutionCompleteListener = cc.initCompleteListener(scTestId1);
      let receivedContext = false;
      const listener = await cc.setupAndValidateListener(
        null,
        null,
        'fdc3.instrument',
        errorMessage,
        () => (receivedContext = true)
      );
      const channel = await cc.getNonGlobalUserChannel();
      await cc.joinChannel(channel);
      await cc.openChannelApp(scTestId1, channel.id, JOIN_AND_BROADCAST);
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
        cc.unsubscribeListeners([listener]);
      }
    });

    const scTestId2 =
      '(' +
      prefix +
      'UCBasicUsage2) Should receive context when joining a user channel then adding a context listener before app B broadcasts context to the same channel';
    it(scTestId2, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A joins channel 1\r\n- Add listener of type fdc3.instrument to App A\r\n- App B joins channel 1\r\n- App B broadcasts fdc3.instrument context${documentation}`;

      const resolveExecutionCompleteListener = cc.initCompleteListener(scTestId2);
      const channel = await cc.getNonGlobalUserChannel();
      await cc.joinChannel(channel);
      let receivedContext = false;
      const listener = await cc.setupAndValidateListener(
        null,
        null,
        'fdc3.instrument',
        errorMessage,
        () => (receivedContext = true)
      );
      await cc.openChannelApp(scTestId2, channel.id, JOIN_AND_BROADCAST);
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
        cc.unsubscribeListeners([listener]);
      }
    });

    const scTestId3 =
      '(' +
      prefix +
      'UCBasicUsage3) Should receive context when app B joins then broadcasts context to a user channel before A joins and listens on the same channel';
    it(scTestId3, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App B joins channel 1\r\n- App B broadcasts fdc3.instrument context\r\n- App A joins channel 1\r\n- App A adds fdc3.instrument context listener${documentation}`;

      const resolveExecutionCompleteListener = cc.initCompleteListener(scTestId3);
      const channel = await cc.getNonGlobalUserChannel();
      await cc.openChannelApp(scTestId3, channel.id, JOIN_AND_BROADCAST);
      let receivedContext = false;
      const listener = await cc.setupAndValidateListener(
        null,
        null,
        'fdc3.instrument',
        errorMessage,
        () => (receivedContext = true)
      );
      await cc.joinChannel(channel);
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
        cc.unsubscribeListeners([listener]);
      }
    });

    const UCBasicUsage4 =
      '(' +
      prefix +
      'UCBasicUsage4) Should receive context when app B joins then broadcasts context to a user channel before A joins and listens on the same channel';
    it(UCBasicUsage4, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App B joins channel 1\r\n- App B broadcasts fdc3.instrument context\r\n- App A joins channel 1\r\n- App A adds fdc3.instrument context listener${documentation}`;

      const resolveExecutionCompleteListener = cc.initCompleteListener(UCBasicUsage4);
      const channel = await cc.getNonGlobalUserChannel();
      await cc.openChannelApp(UCBasicUsage4, channel.id, JOIN_AND_BROADCAST);
      await cc.joinChannel(channel);
      let receivedContext = false;
      const listener = await cc.setupAndValidateListener(
        null,
        null,
        'fdc3.instrument',
        errorMessage,
        () => (receivedContext = true)
      );
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
        cc.unsubscribeListeners([listener]);
      }
    });

    const scTestId4 =
      '(' +
      prefix +
      'UCFilteredUsage1) Should receive context when app A adds a listener before joining a user channel and app B broadcasts the listened type to the same user channel';
    it(scTestId4, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A adds fdc3.instrument context listener\r\n- App A joins channel 1\r\n- App B joins channel 1\r\n- App B broadcasts context of type fdc3.instrument and fdc3.contact${documentation}`;

      const resolveExecutionCompleteListener = cc.initCompleteListener(scTestId4);
      let receivedContext = false;
      const listener = await cc.setupAndValidateListener(
        null,
        'fdc3.instrument',
        'fdc3.instrument',
        errorMessage,
        () => (receivedContext = true)
      );
      const channel = await cc.getNonGlobalUserChannel();
      await cc.joinChannel(channel);
      await cc.openChannelApp(scTestId4, channel.id, JOIN_AND_BROADCAST_TWICE);
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
        cc.unsubscribeListeners([listener]);
      }
    });

    const UCFilteredUsage2 =
      '(' +
      prefix +
      'UCFilteredUsage2 ) Should receive context when app A joins a user channel before adding a listener and app B broadcasts the listened type to the same user channel';
    it(UCFilteredUsage2, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A adds fdc3.instrument context listener\r\n- App A joins channel 1\r\n- App B joins channel 1\r\n- App B broadcasts context of type fdc3.instrument and fdc3.contact${documentation}`;

      const resolveExecutionCompleteListener = cc.initCompleteListener(UCFilteredUsage2);
      let receivedContext = false;
      const channel = await cc.getNonGlobalUserChannel();
      await cc.joinChannel(channel);
      const listener = await cc.setupAndValidateListener(
        null,
        'fdc3.instrument',
        'fdc3.instrument',
        errorMessage,
        () => (receivedContext = true)
      );
      await cc.openChannelApp(UCFilteredUsage2, channel.id, JOIN_AND_BROADCAST_TWICE);
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
        cc.unsubscribeListeners([listener]);
      }
    });

    const UCFilteredUsage3 =
      '(' +
      prefix +
      'UCFilteredUsage3) Should receive context when B broadcasts to a user channel before A listens for the broadcast type and joins the same channel as B';
    it(UCFilteredUsage3, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App B joins channel 1\r\n- App B broadcasts context of type fdc3.instrument and fdc3.contact\r\n- App A adds fdc3.instrument context listener\r\n- App A joins channel 1${documentation}`;

      const resolveExecutionCompleteListener = cc.initCompleteListener(UCFilteredUsage3);
      const userChannel = await cc.getNonGlobalUserChannel();
      let receivedContext = false;
      await cc.openChannelApp(UCFilteredUsage3, userChannel.id, JOIN_AND_BROADCAST_TWICE, undefined, true);
      const listener = await cc.setupAndValidateListener(
        null,
        'fdc3.instrument',
        'fdc3.instrument',
        errorMessage,
        () => (receivedContext = true)
      );
      await cc.joinChannel(userChannel);
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
        cc.unsubscribeListeners([listener]);
      }
    });

    const UCFilteredUsage4 =
      '(' +
      prefix +
      'UCFilteredUsage4) Should receive context when B broadcasts to a user channel before A joins the same channel and listens for the broadcast type';
    it(UCFilteredUsage4, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App B joins channel 1\r\n- App B broadcasts context of type fdc3.instrument and fdc3.contact\r\n- App A joins channel 1\r\n- App A adds fdc3.instrument context listener${documentation}`;

      const resolveExecutionCompleteListener = cc.initCompleteListener(UCFilteredUsage4);
      const userChannel = await cc.getNonGlobalUserChannel();
      await cc.openChannelApp(UCFilteredUsage4, userChannel.id, JOIN_AND_BROADCAST_TWICE, undefined, true);
      await cc.joinChannel(userChannel);
      let receivedContext = false;
      const listener = await cc.setupAndValidateListener(
        null,
        'fdc3.instrument',
        'fdc3.instrument',
        errorMessage,
        () => (receivedContext = true)
      );
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
        cc.unsubscribeListeners([listener]);
      }
    });

    const scTestId5 =
      '(' +
      prefix +
      'UCFilteredUsage5) Should receive multiple contexts when app B broadcasts the listened types to the same user channel';
    it(scTestId5, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A adds fdc3.instrument and fdc3.contact context listener\r\n- App A joins channel 1\r\n- App B joins channel 1\r\n- App B broadcasts both context types${documentation}`;

      const resolveExecutionCompleteListener = cc.initCompleteListener(scTestId5);
      const contextTypes: string[] = [];
      let receivedContext = false;
      const contextId = cc.getRandomId();

      function checkIfBothContextsReceived() {
        if (contextTypes.length === 2) {
          if (
            !contextTypes.includes(`fdc3.contact.${contextId}`) ||
            !contextTypes.includes(`fdc3.instrument.${contextId}`)
          ) {
            assert.fail('Incorrect context received', errorMessage);
          } else {
            receivedContext = true;
          }
        }
      }

      const listener = await cc.setupAndValidateListener(
        null,
        `fdc3.instrument.${contextId}`,
        `fdc3.instrument.${contextId}`,
        errorMessage,
        (context: Context) => {
          contextTypes.push(context.type);
          checkIfBothContextsReceived();
        }
      );

      const listener2 = await cc.setupAndValidateListener(
        null,
        `fdc3.contact.${contextId}`,
        `fdc3.contact.${contextId}`,
        errorMessage,
        (context: Context) => {
          contextTypes.push(context.type);
          checkIfBothContextsReceived();
        }
      );

      const channel = await cc.getNonGlobalUserChannel();
      await cc.joinChannel(channel);
      await cc.openChannelApp(scTestId5, channel.id, JOIN_AND_BROADCAST_TWICE, undefined, true, contextId);
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

    const scTestId6 =
      '(' +
      prefix +
      'UCFilteredUsage6) Should not receive context when A & B join different user channels and app B broadcasts a listened type';
    it(scTestId6, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A adds fdc3.instrument and fdc3.contact context listener\r\n- App A joins channel 2\r\n- App B joins channel 1\r\n- App B broadcasts both context types${documentation}`;

      const listener = await cc.setupAndValidateListener(
        null,
        'fdc3.instrument',
        'unexpected-context',
        errorMessage,
        () => {
          /* noop */
        }
      );
      const listener2 = await cc.setupAndValidateListener(
        null,
        'fdc3.contact',
        'unexpected-context',
        errorMessage,
        () => {
          /* noop */
        }
      );

      const channels = await cc.getNonGlobalUserChannels();
      if (channels.length < 1) assert.fail('No system channels available for app A');

      await cc.joinChannel(channels[0]);
      await cc.openChannelApp(scTestId6, channels[1].id, JOIN_AND_BROADCAST_TWICE);
      await wait(constants.ShortWait); // give listeners time to receive context
      cc.unsubscribeListeners([listener, listener2]);
    });

    const scTestId7 =
      '(' +
      prefix +
      'UCFilteredUsageUnsubscribe) Should not receive context when unsubscribing a user channel before app B broadcasts the listened type to that channel';
    it(scTestId7, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A adds context listener of type fdc3.instrument\r\n- App A joins channel 1\r\n- App A unsubscribes the listener\r\n- App B joins channel 1\r\n- App B broadcasts context of type fdc3.instrument${documentation}`;

      const resolveExecutionCompleteListener = cc.initCompleteListener(scTestId7);
      const listener = await cc.setupAndValidateListener(
        null,
        'fdc3.instrument',
        'unexpected-context',
        errorMessage,
        () => {
          /* noop */
        }
      );
      const listener2 = await cc.setupAndValidateListener(
        null,
        'fdc3.contact',
        'unexpected-context',
        errorMessage,
        () => {
          /* noop */
        }
      );
      const channel = await cc.getNonGlobalUserChannel();
      await cc.joinChannel(channel);
      cc.unsubscribeListeners([listener, listener2]);
      await cc.openChannelApp(scTestId7, channel.id, JOIN_AND_BROADCAST);
      await resolveExecutionCompleteListener;
    });

    const scTestId8 =
      '(' +
      prefix +
      'UCFilteredUsageChange) Should not receive context when joining two different user channels before app B broadcasts the listened type to the first channel that was joined';
    it(scTestId8, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A adds context listener of type fdc3.instrument\r\n- App A joins channel 1\r\n- App A joins channel 2\r\n- App B joins channel 1\r\n- App B broadcasts context of type fdc3.instrument${documentation}`;

      const contextId = cc.getRandomId();
      const listener = await cc.setupAndValidateListener(
        null,
        `fdc3.instrument.${contextId}`,
        'unexpected-context',
        errorMessage,
        async () => {
          /* noop */
        }
      );
      const listener2 = await cc.setupAndValidateListener(
        null,
        `fdc3.contact.${contextId}`,
        'unexpected-context',
        errorMessage,
        () => {
          /* noop */
        }
      );

      const channels = await cc.getNonGlobalUserChannels();
      if (channels.length < 1) {
        assert.fail('No system channels available for app A');
      }

      await cc.joinChannel(channels[0]);
      await cc.joinChannel(channels[1]);
      await cc.openChannelApp(scTestId8, channels[0].id, JOIN_AND_BROADCAST, undefined, true, contextId);
      await wait(constants.ShortWait); // give listeners time to receive context
      cc.unsubscribeListeners([listener, listener2]);
    });

    const UCFilteredUsageLeave =
      '(' + prefix + 'UCFilteredUsageLeave) Should not receive context after leaving a user channel';
    it(UCFilteredUsageLeave, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A adds fdc3.instrument and fdc3.contact context listener\r\n- App A joins channel 1\r\n- App A leaves current channel\r\n- App B joins channel 1\r\n- App B broadcasts both context types${documentation}`;

      const resolveExecutionCompleteListener = cc.initCompleteListener(UCFilteredUsageLeave);
      const contextId = cc.getRandomId();

      const listener = await cc.setupAndValidateListener(
        null,
        `fdc3.instrument.${contextId}`,
        `fdc3.instrument.${contextId}`,
        errorMessage,
        () => {
          assert.fail('fdc3.instrument context received');
        }
      );

      const listener2 = await cc.setupAndValidateListener(
        null,
        `fdc3.contact.${contextId}`,
        `fdc3.contact.${contextId}`,
        errorMessage,
        () => {
          assert.fail('fdc3.contact context received');
        }
      );

      const channel = await cc.getNonGlobalUserChannel();
      await cc.joinChannel(channel);
      await cc.leaveChannel();
      await cc.openChannelApp(UCFilteredUsageLeave, channel.id, JOIN_AND_BROADCAST_TWICE, undefined, true, contextId);
      await resolveExecutionCompleteListener;
      await wait(constants.ShortWait); // give listeners time to receive context
      cc.unsubscribeListeners([listener, listener2]);
    });

    const scTestId9 =
      '(' +
      prefix +
      "UCFilteredUsageNoJoin) Should not receive context when A doesn't join a user channel before app B broadcasts the listened type to that channel";
    it(scTestId9, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A adds context listener of type fdc3.instrument\r\n- App A unsubscribes the listener\r\n- App B joins channel 1\r\n- App B broadcasts context of type fdc3.instrument${documentation}`;

      const resolveExecutionCompleteListener = cc.initCompleteListener(scTestId9);
      await cc.setupAndValidateListener(null, 'fdc3.instrument', 'unexpected-context', errorMessage, () => {
        /* noop */
      });
      await cc.setupAndValidateListener(null, 'fdc3.contact', 'unexpected-context', errorMessage, () => {
        /* noop */
      });
      const channel = await cc.getNonGlobalUserChannel();
      await cc.openChannelApp(scTestId9, channel.id, JOIN_AND_BROADCAST);
      await resolveExecutionCompleteListener;
      await wait(constants.ShortWait);
    });

    const UCFilteredUsageJoin =
      '(' + prefix + 'UCFilteredUsageJoin) getCurrentChannel retrieves the channel that was joined';
    it(UCFilteredUsageJoin, async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- App A retrieves user channels\r\n- App A joins the third channel\r\n- App A gets current channel${documentation}`;
      const channels = await cc.getNonGlobalUserChannels();
      if (channels.length < 1) {
        assert.fail('No system channels available for app A');
      }
      await cc.joinChannel(channels[2]);
      const currentChannel = await cc.getCurrentChannel();
      expect(channels[2].id, errorMessage).to.be.equal(currentChannel?.id);
    });
  });
};
