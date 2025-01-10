/* eslint-disable @typescript-eslint/no-explicit-any */
import { createColors } from './Picocolors';
const GET_AGENT_LOG_PREFIX = 'FDC3 getAgent: ';

const pc = createColors();

type ColorFn = (aString: string) => string;
const debugColor: ColorFn = value => pc.black(pc.dim(value));
const logColor: ColorFn = value => pc.green(pc.dim(value));
const warnColor: ColorFn = value => pc.yellow(value);
const errorColor: ColorFn = value => pc.red(value);

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
