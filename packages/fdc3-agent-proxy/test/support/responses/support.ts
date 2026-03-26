import { AppRequestMessageMeta, AgentResponseMessage } from '@robmoffat/fdc3-schema/dist/generated/api/BrowserTypes.js';
import { v4 as uuidv4 } from 'uuid';

export function createResponseMeta(m: AppRequestMessageMeta): AgentResponseMessage['meta'] {
  const meta: AgentResponseMessage['meta'] = {
    requestUuid: m.requestUuid,
    responseUuid: uuidv4(),
    source: m.source,
    timestamp: new Date(),
  };
  return meta;
}
