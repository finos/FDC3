import { IntentHandler } from 'fdc3-2.0';
import { SailListener } from '../fdc3-1.2/listeners';
import { SendMessage } from '../message';
import { FDC3_2_0_TOPICS } from '/@main/handlers/fdc3/2.0/topics';

/**
 * Listeners for Private Channel methods. onDisconnect, onUnsubscribe, onAddContextListener
 */

export class AddContextListener implements SailListener {
  private id: string;

  constructor(sendMessage: SendMessage, listenerId: string) {
    this.id = listenerId;

    this.unsubscribe = () => {
      addContextListeners.delete(this.id);

      sendMessage(FDC3_2_0_TOPICS.DROP_ONADDCONTEXT_LISTENER, {
        listenerId: this.id,
      });
    };
  }

  unsubscribe: () => void;
}

export class UnsubscribeListener implements SailListener {
  private id: string;

  constructor(sendMessage: SendMessage, listenerId: string) {
    this.id = listenerId;

    this.unsubscribe = () => {
      unsubscribeListeners.delete(this.id);

      sendMessage(FDC3_2_0_TOPICS.DROP_ONUNSUBSCRIBE_LISTENER, {
        listenerId: this.id,
      });
    };
  }

  unsubscribe: () => void;
}

export class DisconnectListener implements SailListener {
  private id: string;

  constructor(sendMessage: SendMessage, listenerId: string) {
    this.id = listenerId;

    this.unsubscribe = () => {
      disconnectListeners.delete(this.id);

      sendMessage(FDC3_2_0_TOPICS.DROP_ONDISCONNECT_LISTENER, {
        listenerId: this.id,
      });
    };
  }

  unsubscribe: () => void;
}

// listener for async intent handlers (2.0)
export interface IntentListenerItem {
  id?: string;
  handler?: IntentHandler;
  contextType?: string;
}

//listener that takes handler with ContextType arg only
export interface ContextTypeListenerItem {
  id?: string;
  handler: (contextType?: string) => void;
  contextType?: string;
}

//listener with handler that has no args
export interface VoidListenerItem {
  id?: string;
  handler: () => void;
}

//map of listeners for when a contextListener is added to a private channel
export const addContextListeners: Map<string, ContextTypeListenerItem> =
  new Map();

//map of listeners for unsubscribing on a private channel
export const unsubscribeListeners: Map<string, ContextTypeListenerItem> =
  new Map();

//map of listeners for disconnecting on a private channel
export const disconnectListeners: Map<string, VoidListenerItem> = new Map();

export const createContextTypeListenerItem = (
  id: string,
  handler: (contextType?: string) => void,
  contextType?: string,
): ContextTypeListenerItem => {
  const listener = {
    id,
    handler,
    contextType,
  };
  return listener;
};

export const createVoidListenerItem = (
  id: string,
  handler: () => void,
): VoidListenerItem => {
  const listener: VoidListenerItem = {
    id,
    handler,
  };
  return listener;
};
