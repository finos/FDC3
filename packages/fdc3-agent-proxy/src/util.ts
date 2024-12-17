import { AgentEventMessage, AgentResponseMessage } from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { ChannelError, OpenError, ResolveError } from '@kite9/fdc3-standard';

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
    console.error(absentMessage, message);
    throw new Error(absentError);
  }
};
