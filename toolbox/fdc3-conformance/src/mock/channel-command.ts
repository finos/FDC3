import { ChannelsAppConfig } from '../test/common/control/channel-control';
import { commands } from './constants';
import { IChannelService } from './interfaces';

export class Fdc3CommandExecutor {
  async executeCommands(orderedCommands: string[], config: ChannelsAppConfig, channelService: IChannelService<any>) {
    let channel;

    //close ChannelsApp when test is complete
    await channelService.closeWindowOnCompletion(config.testId);

    for (const command of orderedCommands) {
      switch (command) {
        case commands.joinRetrievedUserChannel: {
          channel = await channelService.joinRetrievedUserChannel(config.channelId);
          break;
        }
        case commands.retrieveTestAppChannel: {
          if (!config.channelId) {
            throw new Error('Provide `channelId` of an app channel in the config');
          }
          channel = await channelService.retrieveTestAppChannel(config.channelId);
          break;
        }
        case commands.broadcastInstrumentContext: {
          const contextType = config.contextId ? `fdc3.instrument.${config.contextId}` : 'fdc3.instrument';
          await channelService.broadcastContextItem(contextType, channel, config.historyItems ?? 1, config.testId);
          break;
        }
        case commands.broadcastContactContext: {
          const contextType = config.contextId ? `fdc3.contact.${config.contextId}` : 'fdc3.contact';
          await channelService.broadcastContextItem(contextType, channel, config.historyItems ?? 1, config.testId);
          break;
        }
      }
    }

    //notify app A that ChannelsApp has finished executing
    if (config.notifyAppAOnCompletion) {
      await channelService.notifyTestOnCompletion(config.testId);
    }
  }
}
