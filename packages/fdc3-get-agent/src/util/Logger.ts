import { AbstractFDC3Logger } from '@finos/fdc3-agent-proxy';
import { LogLevel } from '@finos/fdc3-standard';

/**
 * Logging utility used by getAgent when connecting to Desktop Agents,
 * which defaults to printing INFO, WARN and ERROR level messages.
 */
export class Logger extends AbstractFDC3Logger {
  static override get prefix(): string {
    return 'FDC3 getAgent: ';
  }

  //set default log level - will not be picked up in test scope so ignored
  /* istanbul ignore next */
  logLevel: LogLevel = LogLevel.INFO;
}
