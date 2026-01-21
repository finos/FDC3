import { AgentEventMessage, AgentResponseMessage } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { ChannelError, OpenError, ResolveError } from '@finos/fdc3-standard';
import { Logger } from './Logger.js';

export type ErrorMessages = ChannelError | OpenError | ResolveError;

/** Utility function that logs and throws a specified error if a specified property does not exist.
 *  Used to lightly validate messages being processed primarily to catch errors in Desktop Agent
 *  implementations.
 */
export const throwIfUndefined = (
  property: object | string | number | null | undefined,
  absentMessage: string,
  message: AgentResponseMessage | AgentEventMessage,
  absentError: ErrorMessages
): void => {
  if (property === undefined) {
    Logger.error(absentMessage, '\nDACP message that resulted in the undefined property: ', message);
    throw new Error(absentError);
  }
};
