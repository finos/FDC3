import { BrowserTypes } from '@kite9/fdc3-schema';
import { v4 as uuidv4 } from 'uuid';

type AppRequestMessageMeta = BrowserTypes.AppRequestMessageMeta;
type AgentResponseMessageMeta = BrowserTypes.AgentResponseMessageMeta;

export function createResponseMeta(m: AppRequestMessageMeta): AgentResponseMessageMeta {
  return {
    requestUuid: m.requestUuid,
    responseUuid: uuidv4(),
    source: m.source,
    timestamp: new Date(),
  };
}
