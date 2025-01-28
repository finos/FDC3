import { LogLevel } from '@finos/fdc3-standard';
import { AbstractFDC3Logger } from './AbstractFDC3Logger';

/**
 * Logging utility used by the DesktopAgentProxy, which defaults to
 * only printing WARN and ERROR level messages. The INFO level is used
 * to message exchanges with Desktop Agents. The DEBUG level is used
 * to log heartbeat messages from the DesktopAgent.
 */
export class Logger extends AbstractFDC3Logger {
  static override get prefix(): string {
    return 'FDC3 DesktopAgentProxy: ';
  }

  //set default log level - will not be picked up in test scope so ignored
  /* istanbul ignore next */
  logLevel: LogLevel = LogLevel.WARN;
}
