import { AbstractFDC3Logger } from './AbstractFDC3Logger';

export class Logger extends AbstractFDC3Logger {
  static override get prefix(): string {
    return 'FDC3 DesktopAgentProxy: ';
  }

  private static enableHeartbeatLog: boolean = true;

  public static enableHeartbeatLogs(enable: boolean) {
    this.enableHeartbeatLog = enable;
  }

  public static heartbeatLog(...params: any[]) {
    if (this.enableHeartbeatLog) {
      console.debug(...this.prefixAndColorize(this.prefix, params, this.debugColor));
    }
  }
}
