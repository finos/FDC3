/* eslint-disable @typescript-eslint/no-explicit-any */
import pc from 'picocolors';

const GET_AGENT_LOG_PREFIX = 'FDC3 getAgent: ';

export class Logger {
  static debug(...params: any[]) {
    if (typeof params[0] === 'string') {
      console.debug(pc.black(pc.dim(`${GET_AGENT_LOG_PREFIX}${params[0]}`)), ...params.slice(1));
    } else {
      console.debug(pc.black(pc.dim(`${GET_AGENT_LOG_PREFIX}`)), ...params);
    }
  }

  static log(...params: any[]) {
    if (typeof params[0] === 'string') {
      console.log(pc.green(pc.dim(`${GET_AGENT_LOG_PREFIX}${params[0]}`)), ...params.slice(1));
    } else {
      console.log(pc.green(pc.dim(`${GET_AGENT_LOG_PREFIX}`)), ...params);
    }
  }

  static warn(...params: any[]) {
    if (typeof params[0] === 'string') {
      console.warn(pc.yellow(pc.dim(`${GET_AGENT_LOG_PREFIX}${params[0]}`)), ...params.slice(1));
    } else {
      console.warn(pc.yellow(pc.dim(`${GET_AGENT_LOG_PREFIX}`)), ...params);
    }
  }

  static error(...params: any[]) {
    if (typeof params[0] === 'string') {
      console.error(pc.red(pc.dim(`${GET_AGENT_LOG_PREFIX}${params[0]}`)), ...params.slice(1));
    } else {
      console.error(pc.red(pc.dim(`${GET_AGENT_LOG_PREFIX}`)), ...params);
    }
  }
}
