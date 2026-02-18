import { ChannelServiceImpl } from './support/channel-support';
import { Context, getAgent } from '@finos/fdc3';
import { Fdc3CommandExecutor } from './channel-command';

getAgent().then(fdc3 => {
  let firedOnce = false;

  fdc3.addContextListener('channelsAppContext', (context: Context) => {
    if (firedOnce === false && context.type == 'channelsAppContext') {
      firedOnce = true;
      const commandExecutor = new Fdc3CommandExecutor();
      commandExecutor.executeCommands(context.commands, context.config, new ChannelServiceImpl(fdc3));
    }
  });
});
