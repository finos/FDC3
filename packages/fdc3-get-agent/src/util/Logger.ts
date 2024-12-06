/* eslint-disable @typescript-eslint/no-explicit-any */
const GET_AGENT_LOG_PREFIX = "FDC3 getAgent: ";

export class Logger {
	constructor() {}

	static debug(message?: any, ...optionalParams: any[]) {
		console.debug(GET_AGENT_LOG_PREFIX + (message ?? ""), ...optionalParams);
	}
	
	static log(message?: any, ...optionalParams: any[]) {
		console.log(GET_AGENT_LOG_PREFIX + (message ?? ""), ...optionalParams);
	}
	
	static warn(message?: any, ...optionalParams: any[]) {
		console.warn(GET_AGENT_LOG_PREFIX + (message ?? ""), ...optionalParams);
	}
	
	static error(message?: any, ...optionalParams: any[]) {
		console.error(GET_AGENT_LOG_PREFIX + (message ?? ""), ...optionalParams);
	}
}
