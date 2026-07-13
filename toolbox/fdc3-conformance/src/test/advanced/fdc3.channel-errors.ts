import { expect } from 'chai';
import { ChannelError, Context, DesktopAgent, getAgent } from '@finos/fdc3';
import { APIDocumentation } from '../support/apiDocuments';

const documentation = '\r\nDocumentation: ' + APIDocumentation.desktopAgent + '\r\nCause:';

async function expectChannelError(
  action: () => Promise<unknown>,
  expectedError: ChannelError,
  errorMessage: string
): Promise<void> {
  try {
    await action();
  } catch (ex) {
    expect(ex, errorMessage).to.have.property('message', expectedError);
    return;
  }

  throw new Error(`Expected the operation to reject with ${expectedError}${errorMessage}`);
}

export default async () =>
  describe('fdc3.channelErrors', () => {
    let fdc3: DesktopAgent;

    beforeEach(async () => {
      fdc3 = await getAgent();
    });

    it('(ChannelErrorNoChannelFound) Should reject joinUserChannel with NoChannelFound for an unknown user channel', async function (this: Mocha.Context) {
      const info = await fdc3.getInfo();
      if (!info.optionalFeatures.UserChannelMembershipAPIs) {
        this.skip();
      }

      const userChannels = await fdc3.getUserChannels();
      let unknownUserChannelId = '__fdc3_conformance_unknown_user_channel__';
      while (userChannels.some(channel => channel.id === unknownUserChannelId)) {
        unknownUserChannelId += '_';
      }

      const errorMessage = `\r\nSteps to reproduce:\r\n- Call joinUserChannel with a channel id not returned by getUserChannels${documentation}`;

      await expectChannelError(
        () => fdc3.joinUserChannel(unknownUserChannelId),
        ChannelError.NoChannelFound,
        errorMessage
      );
    });

    it('(ChannelErrorMalformedContext) Should reject channel broadcast with MalformedContext for an invalid context', async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- Retrieve an app channel\r\n- Broadcast a context object without a string type${documentation}`;
      const channel = await fdc3.getOrCreateChannel('fdc3.conformance.channel-errors');

      await expectChannelError(() => channel.broadcast({} as Context), ChannelError.MalformedContext, errorMessage);
    });

    it('(ChannelErrorInvalidArguments) Should reject getOrCreateChannel with InvalidArguments for a non-string channel id', async () => {
      const errorMessage = `\r\nSteps to reproduce:\r\n- Call getOrCreateChannel with a non-string channel id${documentation}`;

      await expectChannelError(
        () => fdc3.getOrCreateChannel(null as unknown as string),
        ChannelError.InvalidArguments,
        errorMessage
      );
    });
  });
