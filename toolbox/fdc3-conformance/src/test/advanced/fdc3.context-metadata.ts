import { assert, expect } from 'chai';
import { Context, ContextMetadata, ContextWithMetadata } from '@finos/fdc3';
import { ChannelControlImpl } from '../support/channels-support';
import { ContextMetadataValidator } from '../support/context-metadata-support';
import {
  JOIN_AND_BROADCAST,
  JOIN_AND_BROADCAST_WITH_TRACE_ID,
  JOIN_AND_BROADCAST_WITH_SIGNATURE_CUSTOM,
  APP_CHANNEL_AND_BROADCAST,
} from '../support/channel-control';
import constants from '../../constants';
import { wait } from '../../utils';
import { getAgent } from '@finos/fdc3';
import { APIDocumentation } from '../support/apiDocuments';

const documentation = '\r\nDocumentation: ' + APIDocumentation.desktopAgent + '\r\nCause:';
const validator = new ContextMetadataValidator();

export default async () => {
  const fdc3 = await getAgent();
  const cc = new ChannelControlImpl(fdc3);
  let mockAppOpened = false;

  return describe('fdc3.contextMetadata', () => {
    beforeEach(async function beforeEach() {
      mockAppOpened = false;
      await cc.leaveChannel();
    });

    afterEach(async function afterEach() {
      if (mockAppOpened) {
        await cc.closeMockApp(this.currentTest?.title ?? 'Some-Test-Title');
      }
    });

    // --- User Channel Tests ---

    const ucMetadataBroadcast =
      '(UCContextMetadataOnBroadcast) Should receive ContextMetadata with source and timestamp when context is broadcast on a user channel';
    it(ucMetadataBroadcast, async () => {
      const errorMessage = `\r\nSteps:\r\n- App A adds fdc3.instrument context listener\r\n- App A joins channel\r\n- App B joins channel and broadcasts fdc3.instrument${documentation}`;

      const resolveExecutionCompleteListener = cc.initCompleteListener(ucMetadataBroadcast);
      let receivedMetadata: ContextMetadata | undefined;
      let receivedContext = false;

      const listener = await cc.setupAndValidateListener(
        null,
        'fdc3.instrument',
        'fdc3.instrument',
        errorMessage,
        (_ctx: Context, metadata?: ContextMetadata) => {
          receivedMetadata = metadata;
          receivedContext = true;
        }
      );

      const channel = await cc.getNonGlobalUserChannel();
      await cc.joinChannel(channel);
      mockAppOpened = true;
      await cc.openChannelApp(ucMetadataBroadcast, channel.id, JOIN_AND_BROADCAST);
      await resolveExecutionCompleteListener;

      try {
        if (!receivedContext) {
          await wait(constants.ShortWait);
        }
        assert.isTrue(receivedContext, `No context received!${errorMessage}`);
        assert.isDefined(receivedMetadata, `No metadata received with context${errorMessage}`);
        validator.validateRequiredFields(receivedMetadata!, 'ChannelsAppId');
      } finally {
        cc.unsubscribeListeners([listener]);
      }
    });

    const ucMetadataTraceId =
      '(UCContextMetadataTraceId) Should receive app-provided traceId in ContextMetadata on user channel broadcast';
    it(ucMetadataTraceId, async () => {
      const errorMessage = `\r\nSteps:\r\n- App A adds listener\r\n- App B broadcasts with traceId metadata${documentation}`;

      const resolveExecutionCompleteListener = cc.initCompleteListener(ucMetadataTraceId);
      let receivedMetadata: ContextMetadata | undefined;
      let receivedContext = false;

      const listener = await cc.setupAndValidateListener(
        null,
        'fdc3.instrument',
        'fdc3.instrument',
        errorMessage,
        (_ctx: Context, metadata?: ContextMetadata) => {
          receivedMetadata = metadata;
          receivedContext = true;
        }
      );

      const channel = await cc.getNonGlobalUserChannel();
      await cc.joinChannel(channel);
      mockAppOpened = true;
      await cc.openChannelApp(ucMetadataTraceId, channel.id, JOIN_AND_BROADCAST_WITH_TRACE_ID);
      await resolveExecutionCompleteListener;

      try {
        if (!receivedContext) {
          await wait(constants.ShortWait);
        }
        assert.isTrue(receivedContext, `No context received!${errorMessage}`);
        assert.isDefined(receivedMetadata, `No metadata received${errorMessage}`);
        validator.validateRequiredFields(receivedMetadata!);
        validator.validateTraceId(receivedMetadata!, 'test-trace-123');
      } finally {
        cc.unsubscribeListeners([listener]);
      }
    });

    const ucMetadataSignatureCustom =
      '(UCContextMetadataSignatureCustom) Should receive app-provided signature and custom fields in ContextMetadata on user channel broadcast';
    it(ucMetadataSignatureCustom, async () => {
      const errorMessage = `\r\nSteps:\r\n- App A adds listener\r\n- App B broadcasts with signature and custom metadata${documentation}`;

      const resolveExecutionCompleteListener = cc.initCompleteListener(ucMetadataSignatureCustom);
      let receivedMetadata: ContextMetadata | undefined;
      let receivedContext = false;

      const listener = await cc.setupAndValidateListener(
        null,
        'fdc3.instrument',
        'fdc3.instrument',
        errorMessage,
        (_ctx: Context, metadata?: ContextMetadata) => {
          receivedMetadata = metadata;
          receivedContext = true;
        }
      );

      const channel = await cc.getNonGlobalUserChannel();
      await cc.joinChannel(channel);
      mockAppOpened = true;
      await cc.openChannelApp(ucMetadataSignatureCustom, channel.id, JOIN_AND_BROADCAST_WITH_SIGNATURE_CUSTOM);
      await resolveExecutionCompleteListener;

      try {
        if (!receivedContext) {
          await wait(constants.ShortWait);
        }
        assert.isTrue(receivedContext, `No context received!${errorMessage}`);
        assert.isDefined(receivedMetadata, `No metadata received${errorMessage}`);
        validator.validateRequiredFields(receivedMetadata!);
        validator.validateSignature(receivedMetadata!, { protected: 'protected-abc', signature: 'signature-abc' });
        validator.validateAntiReplay(receivedMetadata!, { exp: 1234, iat: 2345, jti: 'anti-replay-123' });
        validator.validateCustom(receivedMetadata!, 'region', 'EMEA');
      } finally {
        cc.unsubscribeListeners([listener]);
      }
    });

    // --- App Channel Tests ---

    const acMetadataBroadcast =
      '(ACContextMetadataOnBroadcast) Should receive ContextMetadata with source and timestamp when context is broadcast on an app channel';
    it(acMetadataBroadcast, async () => {
      const errorMessage = `\r\nSteps:\r\n- App A gets app channel and adds listener\r\n- App B gets same channel and broadcasts${documentation}`;

      const resolveExecutionCompleteListener = cc.initCompleteListener(acMetadataBroadcast);
      const testChannel = await fdc3.getOrCreateChannel('test-channel');
      let receivedMetadata: ContextMetadata | undefined;
      let receivedContext = false;

      const listener = await testChannel.addContextListener(
        'fdc3.instrument',
        (context: Context, metadata?: ContextMetadata) => {
          expect(context.type).to.be.equals('fdc3.instrument', errorMessage);
          receivedMetadata = metadata;
          receivedContext = true;
        }
      );

      mockAppOpened = true;
      await cc.openChannelApp(acMetadataBroadcast, 'test-channel', APP_CHANNEL_AND_BROADCAST);
      await resolveExecutionCompleteListener;

      try {
        if (!receivedContext) {
          await wait(constants.ShortWait);
        }
        assert.isTrue(receivedContext, `No context received!${errorMessage}`);
        assert.isDefined(receivedMetadata, `No metadata received${errorMessage}`);
        validator.validateRequiredFields(receivedMetadata!, 'ChannelsAppId');
      } finally {
        listener.unsubscribe();
      }
    });

    // --- getCurrentContextWithMetadata Tests ---

    const acGetCurrentContextWithMetadata =
      '(ACGetCurrentContextWithMetadata) getCurrentContextWithMetadata should return context and metadata from an app channel';
    it(acGetCurrentContextWithMetadata, async () => {
      const errorMessage = `\r\nSteps:\r\n- App B broadcasts to app channel\r\n- App A calls getCurrentContextWithMetadata${documentation}`;

      const resolveExecutionCompleteListener = cc.initCompleteListener(acGetCurrentContextWithMetadata);
      const testChannel = await fdc3.getOrCreateChannel('test-channel');

      mockAppOpened = true;
      await cc.openChannelApp(acGetCurrentContextWithMetadata, 'test-channel', APP_CHANNEL_AND_BROADCAST);
      await resolveExecutionCompleteListener;

      // Allow time for the broadcast to be stored
      await wait(constants.ShortWait);

      const result: ContextWithMetadata | null = await testChannel.getCurrentContextWithMetadata('fdc3.instrument');

      assert.isNotNull(result, `getCurrentContextWithMetadata returned null${errorMessage}`);
      expect(result!.context.type).to.be.equal('fdc3.instrument');
      assert.isDefined(result!.metadata, `metadata was not returned${errorMessage}`);
      validator.validateRequiredFields(result!.metadata, 'ChannelsAppId');
    });

    const acGetCurrentContextWithMetadataNull =
      '(ACGetCurrentContextWithMetadataNull) getCurrentContextWithMetadata should return null on an empty channel';
    it(acGetCurrentContextWithMetadataNull, async () => {
      const testChannel = await fdc3.getOrCreateChannel('test-channel-empty-' + cc.getRandomId());
      const result: ContextWithMetadata | null = await testChannel.getCurrentContextWithMetadata('fdc3.instrument');
      assert.isNull(result, 'getCurrentContextWithMetadata should return null on an empty channel');
    });
  });
};
