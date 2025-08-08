import { AgentResponseMessage, AppRequestMessage } from '@finos/fdc3-schema/dist/generated/api/BrowserTypes';
import { IncomingMessage, MessageHandler } from './MessageHandler';
import { v4 as uuidv4 } from 'uuid';
import { ServerContext } from './ServerContext';

export abstract class AbstractHandler implements MessageHandler {
  protected da: ServerContext;

  constructor(da: ServerContext) {
    this.da = da;
  }

  abstract accept(msg: IncomingMessage): Promise<void>;

  shutdown(): void {
    // do nothing
  }

  createUUID(): string {
    return uuidv4();
  }

  successResponse(
    request: AppRequestMessage,
    payload: AgentResponseMessage['payload'],
    type: AgentResponseMessage['type']
  ) {
    return this.successResponseId(request.meta.requestUuid, payload, type);
  }

  errorResponse(request: AppRequestMessage, error: string, type: AgentResponseMessage['type']) {
    return this.errorResponseId(request.meta.requestUuid, error, type);
  }

  successResponseId(requestId: string, payload: AgentResponseMessage['payload'], type: AgentResponseMessage['type']) {
    const msg = {
      meta: {
        responseUuid: this.createUUID(),
        requestUuid: requestId,
        timestamp: new Date(),
      },
      type,
      payload,
    };
    this.da.post(msg);
  }

  errorResponseId(requestId: string, error: string, type: AgentResponseMessage['type']) {
    const msg = {
      meta: {
        responseUuid: this.createUUID(),
        requestUuid: requestId,
        timestamp: new Date(),
      },
      type,
      payload: {
        error,
      },
    } as AgentResponseMessage;
    this.da.post(msg);
  }

  /*
   * from: https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates#14438954
   */
  onlyUnique<X>(value: X, index: number, self: X[]) {
    return self.indexOf(value) === index;
  }
}
