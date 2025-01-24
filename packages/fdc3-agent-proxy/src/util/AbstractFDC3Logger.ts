/* eslint-disable @typescript-eslint/no-explicit-any */

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
  private static enableDebug: boolean = false;
  private static enableLog: boolean = true;

  /** This should be overridden by sub-classes to change the prefix applied
   * to log messages. */
  /* istanbul ignore next */ static get prefix(): string {
    return '';
  }

  public static enableDebugLogs(enable: boolean) {
    this.enableDebug = enable;
  }

  public static enableLogs(enable: boolean) {
    this.enableLog = enable;
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
    if (this.enableDebug) {
      console.debug(...this.prefixAndColorize(this.prefix, params, this.debugColor));
    }
  }

  public static log(...params: any[]) {
    if (this.enableLog) {
      console.log(...this.prefixAndColorize(this.prefix, params, this.logColor));
    }
  }

  public static warn(...params: any[]) {
    console.warn(...this.prefixAndColorize(this.prefix, params, this.warnColor));
  }

  public static error(...params: any[]) {
    console.error(...this.prefixAndColorize(this.prefix, params, this.errorColor));
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
