import { Context, IntentResult } from 'fdc3-2.0';
import { MessagingSupport, SendMessage } from '../message';
import { createChannelObject } from './channel';
import { IntentResultData } from '/@main/types/FDC3Message';
import { SailChannelData } from '/@main/types/FDC3Data';
import { FDC3_2_0_TOPICS } from '/@main/handlers/fdc3/2.0/topics';
import {
  addContextListeners,
  disconnectListeners,
  unsubscribeListeners,
} from './listeners';
import { FDC3_TOPICS_RESULT_DELIVERY } from '/@main/handlers/fdc3/topics';

const resultPromises: Map<string, (a: IntentResult) => void> = new Map();
const pendingResults: Map<string, IntentResult> = new Map();

function convertToIntentResult(
  ird: IntentResultData,
  sendMessage: SendMessage,
): IntentResult {
  let data: IntentResult;

  if (ird.type == 'channel') {
    // convert to channel
    const scd = ird.result as SailChannelData;
    data = createChannelObject(sendMessage, scd.id, scd.type, undefined);
  } else if (ird.type == 'context') {
    data = ird.result as Context;
  } else {
    data = undefined;
  }

  return data;
}

export const connect = (ipc: MessagingSupport, sendMessage: SendMessage) => {
  /**
   * listen for incomming results
   */
  ipc.on(FDC3_TOPICS_RESULT_DELIVERY, async (event, a) => {
    //console.log('ipc event', event.type, a);
    const ird = a as IntentResultData;
    const id = ird.resultId;
    console.log('RESULT DELIVERY');
    const promise = resultPromises.get(id);
    const intentResult = convertToIntentResult(ird, sendMessage);

    if (promise) {
      promise(intentResult);
      resultPromises.delete(id);
    } else {
      pendingResults.set(id, intentResult);
    }
  });

  ipc.on(FDC3_2_0_TOPICS.ADD_CONTEXT_LISTENER, async (event, a) => {
    //console.log('on add context listener', event, a);
    const ctli = addContextListeners.get(a.listenerId);
    if (ctli) {
      ctli.handler(a.contextType);
    }
  });

  ipc.on(FDC3_2_0_TOPICS.PRIVATE_CHANNEL_DISCONNECT, async (event, a) => {
    //console.log('private channnel disconnect', event, a);
    const dl = disconnectListeners.get(a.listenerId);
    if (dl) {
      dl.handler();
    }
  });

  ipc.on(FDC3_2_0_TOPICS.PRIVATE_CHANNEL_UNSUBSCRIBE, async (event, a) => {
    //console.log('private channnel disconnect', event, a);
    const ul = unsubscribeListeners.get(a.listenerId);
    if (ul) {
      ul.handler();
    }
  });
};

export function createResultPromise(id: string): Promise<IntentResult> {
  console.log('Created result promise ', id);
  if (pendingResults.has(id)) {
    // result already here
    const pr = pendingResults.get(id);
    pendingResults.delete(id);
    return Promise.resolve(pr);
  } else {
    // waiting for result
    return new Promise<IntentResult>((resolve) => {
      resultPromises.set(id, resolve);
    });
  }
}
