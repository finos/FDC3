/* eslint-disable @typescript-eslint/no-explicit-any */

import { LogLevel } from '@finos/fdc3-standard';

//check if color is supported in (node) console;
let noColor = true;
//else only occurs in a browser and can't be tested in node
/* istanbul ignore if */
if (typeof process !== 'undefined') {
  const argv = process.argv || /* istanbul ignore next */ [];
  const env = process.env || /* istanbul ignore next */ {};
  noColor =
    (!!env.NO_COLOR || argv.includes('--no-color')) &&
    !(
      !!env.FORCE_COLOR ||
      argv.includes('--color') ||
      process.platform === 'win32' /* istanbul ignore next */ ||
      ((process.stdout || {}).isTTY && env.TERM !== 'dumb') ||
      /* istanbul ignore next */ !!env.CI
    );
}

type ColorFn = (aString: string) => string;

export abstract class AbstractFDC3Logger {
  /** This should be overridden by sub-classes to set the prefix applied
   * to log messages. */
  /* istanbul ignore next */ static get prefix(): string {
    return '';
  }

  /** This should be overridden by sub-classes to set the default log level.*/
  /* istanbul ignore next */ static get defaultLogLevel(): LogLevel {
    return LogLevel.INFO;
  }

  private static logLevel: LogLevel = this.defaultLogLevel;

  public static setLogLevel(level: LogLevel) {
    if (level in LogLevel) {
      this.logLevel = level;
    } else {
      this.error(
        `Ignoring unrecognized LogLevel '${level}'! Current log level: '${this.logLevel} (${LogLevel[this.logLevel]})'`
      );
    }
  }

  protected static debugColor(value: string): string {
    return noColor ? /* istanbul ignore next */ value : '\x1b[30m\x1b[2m' + value + '\x1b[22m\x1b[39m';
  }
  protected static logColor(value: string): string {
    return noColor ? /* istanbul ignore next */ value : '\x1b[32m\x1b[2m' + value + '\x1b[22m\x1b[39m';
  }
  protected static warnColor(value: string): string {
    return noColor ? /* istanbul ignore next */ value : '\x1b[33m' + value + '\x1b[39m';
  }
  protected static errorColor(value: string): string {
    return noColor ? /* istanbul ignore next */ value : '\x1b[31m' + value + '\x1b[39m';
  }

  public static debug(...params: any[]) {
    if (this.logLevel >= LogLevel.DEBUG) {
      console.debug(...this.prefixAndColorize(this.prefix, params, this.debugColor));
    }
  }

  public static log(...params: any[]) {
    if (this.logLevel >= LogLevel.INFO) {
      console.log(...this.prefixAndColorize(this.prefix, params, this.logColor));
    }
  }

  public static warn(...params: any[]) {
    if (this.logLevel >= LogLevel.WARN) {
      console.warn(...this.prefixAndColorize(this.prefix, params, this.warnColor));
    }
  }

  public static error(...params: any[]) {
    if (this.logLevel >= LogLevel.ERROR) {
      console.error(...this.prefixAndColorize(this.prefix, params, this.errorColor));
    }
  }

  protected static prefixAndColorize = (prefix: string, params: any[], colorFn: ColorFn): string[] => {
    const prefixed = [prefix, ...params];
    return prefixed.map(value => {
      if (typeof value === 'string') {
        //just color strings
        return colorFn(value);
      } else if (value && value.stack && value.message) {
        //probably an error
        return colorFn(value.stack);
      } else {
        //something else... lets hope it stringifies
        return colorFn(JSON.stringify(value, null, 2));
      }
    });
  };
}
