import { assert, expect } from 'chai';
import { Channel, Context, DesktopAgent, Listener, OpenError } from 'fdc3_2_0';
import { InfoControl } from '../../common/control/info-control';

declare let fdc3: DesktopAgent;

export class BasicControl2_0 implements InfoControl<Context> {
  getInfo = async () => {
    const info = await fdc3.getInfo();
    return info;
  };

  getUserChannels = async () => {
    const channels = await fdc3.getUserChannels();
    return channels;
  };
}
