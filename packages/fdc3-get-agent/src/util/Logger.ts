/* eslint-disable @typescript-eslint/no-explicit-any */
const GET_AGENT_LOG_PREFIX = 'FDC3 getAgent: ';

//check if color is supported in console;
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

const debugColor: ColorFn = value => (noColor ? value : '\x1b[30m\x1b[2m' + value + '\x1b[22m\x1b[39m');
const logColor: ColorFn = value => (noColor ? value : '\x1b[32m\x1b[2m' + value + '\x1b[22m\x1b[39m');
const warnColor: ColorFn = value => (noColor ? value : '\x1b[33m' + value + '\x1b[39m');
const errorColor: ColorFn = value => (noColor ? value : '\x1b[31m' + value + '\x1b[39m');

const prefixAndColorize = (params: any[], colorFn: ColorFn): string[] => {
  const prefixed = [GET_AGENT_LOG_PREFIX, ...params];
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

export class Logger {
  static debug(...params: any[]) {
    console.debug(...prefixAndColorize(params, debugColor));
  }

  static log(...params: any[]) {
    console.log(...prefixAndColorize(params, logColor));
  }

  static warn(...params: any[]) {
    console.warn(...prefixAndColorize(params, warnColor));
  }

  static error(...params: any[]) {
    console.error(...prefixAndColorize(params, errorColor));
  }
}
