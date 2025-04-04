import { ChannelService2_0 } from './support/channel-support-2.0';
import { onFdc3Ready } from './mock-functions';
import { DesktopAgent } from 'fdc3_2_0';
import { Fdc3CommandExecutor } from '../channel-command';
import { ChannelsAppContext } from '../../test/common/control/channel-control';

declare let fdc3: DesktopAgent;

onFdc3Ready().then(() => {
  let firedOnce = false;
  //await commands from App A, then execute commands
  fdc3.addContextListener('channelsAppContext', (context: ChannelsAppContext) => {
    if (firedOnce === false) {
      firedOnce = true;
      const commandExecutor = new Fdc3CommandExecutor();
      commandExecutor.executeCommands(context.commands, context.config, new ChannelService2_0());
    }
  });
});
