import { AppRequestMessageMeta, AgentResponseMessageMeta } from '@kite9/fdc3-schema/generated/api/BrowserTypes';
import { v4 as uuidv4 } from 'uuid';

export function createResponseMeta(m: AppRequestMessageMeta): AgentResponseMessageMeta {
  return {
    requestUuid: m.requestUuid,
    responseUuid: uuidv4(),
    source: m.source,
    timestamp: new Date(),
  };
}
