import { Context, DesktopAgent, TargetApp } from 'fdc3_1_2';
import { InfoControl } from '../../common/control/info-control';

declare let fdc3: DesktopAgent;

export class BasicControl1_2 implements InfoControl<Context> {
  getInfo = () => {
    const info = fdc3.getInfo();
    return info;
  };

  getUserChannels = async () => {
    const channels = await fdc3.getSystemChannels();
    return channels;
  };
}
