/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import { makeObservable, observable, runInAction, action, toJS } from 'mobx';
import { ContextType, Fdc3Listener } from '../utility/Fdc3Api';
import { nanoid } from 'nanoid';
import { contexts } from '../fixtures/contexts';
import systemLogStore from './SystemLogStore';
import { v4 as uuidv4 } from 'uuid';
import { getAgent } from '@finos/fdc3';

export type ContextItem = {
  id: string;
  uuid?: string; //used to determine if a duplicate id is for the same object or not
  template: ContextType | null;
  schemaUrl?: URL;
};

class ContextStore {
  contextsList: ContextItem[] = contexts;

  currentContext: ContextType | null = null;

  contextListeners: Fdc3Listener[] = [];

  constructor() {
    makeObservable(this, {
      contextsList: observable,
      currentContext: observable,
      contextListeners: observable,
      setContext: action,
      deleteContextItem: action,
      broadcast: action,
      addContextItem: action,
      saveContextItem: action,
      addContextListener: action,
      removeContextListener: action,
    });
    const localStorageContextList = localStorage.getItem('contextList');
    let usingDefaultContexts = true;
    try {
      if (localStorageContextList) {
        const parsedListFromStorage = JSON.parse(localStorageContextList);
        if (Array.isArray(parsedListFromStorage)) {
          this.contextsList = parsedListFromStorage;
          usingDefaultContexts = false;
        }
      }
    } catch (err) {
      console.error('Failed to parse context list from localstorage', err);
    }
    if (usingDefaultContexts) {
      this.updateLocalStorage(JSON.stringify(contexts));
    }
  }

  addContextItem(contextItem: ContextItem) {
    contextItem.uuid = uuidv4();
    this.contextsList.push(contextItem);
    this.contextsList.sort((a, b) => a.id.localeCompare(b.id));
    this.updateLocalStorage(this.contextsList);
  }

  saveContextItem(contextItem: ContextItem, selectedId?: string) {
    const context = this.contextsList.find(({ id }) => id === selectedId || id === contextItem.id);
    if (context) {
      Object.keys(contextItem).forEach(
        (key: any) => ((context[key as keyof ContextItem] as any) = contextItem[key as keyof ContextItem])
      );
    }
    this.updateLocalStorage(this.contextsList);
  }

  setContext(context: ContextType) {
    this.currentContext = context;
  }

  deleteContextItem(contextItem: ContextItem) {
    this.contextsList = this.contextsList.filter(c => c != contextItem);
    this.updateLocalStorage(this.contextsList);
  }

  resetContextList() {
    this.contextsList = contexts;
    this.updateLocalStorage(this.contextsList);
  }

  updateLocalStorage(data: any) {
    localStorage.setItem('contextList', JSON.stringify(data));
  }

  async broadcast(context: ContextType) {
    const agent = await getAgent();

    if (!context) {
      systemLogStore.addLog({
        name: 'broadcast',
        type: 'warning',
        value: 'You must set a context before you can broadcast it',
        variant: 'text',
      });
      return;
    } else {
      //check that we're on a channel
      let currentChannel = await agent.getCurrentChannel();
      if (!currentChannel) {
        systemLogStore.addLog({
          name: 'broadcast',
          type: 'warning',
          value: 'You are not currently joined to a channel (no-op)',
          variant: 'text',
        });
      } else {
        try {
          await agent.broadcast(toJS(context));
          systemLogStore.addLog({
            name: 'broadcast',
            type: 'success',
            body: JSON.stringify(context, null, 4),
            variant: 'code',
          });
        } catch (e) {
          systemLogStore.addLog({
            name: 'broadcast',
            type: 'error',
            body: JSON.stringify(e, null, 4),
            variant: 'code',
          });
        }
      }
    }
  }

  async addContextListener(contextType: string | null | undefined) {
    try {
      if (typeof contextType === 'string') {
        const listenerId = nanoid();

        const agent = await getAgent();

        // TODO: remove window after fixing https://github.com/finos/FDC3/issues/435
        const contextListener = await agent.addContextListener(
          contextType.toLowerCase() === 'all' ? null : contextType,
          (context: ContextType, metaData?: any) => {
            const currentListener = this.contextListeners.find(({ id }) => id === listenerId);

            runInAction(() => {
              if (currentListener) {
                currentListener.lastReceivedContext = context;
                currentListener.metaData = metaData;
              }
            });

            systemLogStore.addLog({
              name: 'receivedContextListener',
              type: 'info',
              value: contextType,
              variant: 'code',
              body: JSON.stringify(context, null, 4),
            });
          }
        );

        runInAction(() => {
          systemLogStore.addLog({
            name: 'addContextListener',
            type: 'success',
            value: contextType,
            variant: 'text',
          });
          this.contextListeners.push({ id: listenerId, type: contextType, listener: contextListener });
        });
      } else {
        runInAction(() => {
          systemLogStore.addLog({
            name: 'addContextListener',
            type: 'error',
            value: contextType ?? 'null',
            variant: 'code',
          });
        });
      }
    } catch (e) {
      systemLogStore.addLog({
        name: 'addContextListener',
        type: 'error',
        value: contextType ?? 'null',
        variant: 'code',
        body: JSON.stringify(e, null, 4),
      });
    }
  }

  async removeContextListener(id: string) {
    const listenerIndex = this.contextListeners.findIndex(listener => listener.id === id);

    if (listenerIndex !== -1) {
      try {
        (await this.contextListeners[listenerIndex].listener).unsubscribe();

        runInAction(() => {
          systemLogStore.addLog({
            name: 'removeContextListener',
            type: 'success',
            value: this.contextListeners[listenerIndex].type,
            variant: 'text',
          });
          this.contextListeners.splice(listenerIndex, 1);
        });
      } catch (e) {
        systemLogStore.addLog({
          name: 'removeContextListener',
          type: 'error',
          value: this.contextListeners[listenerIndex].type,
          variant: 'code',
          body: JSON.stringify(e, null, 4),
        });
      }
    }
  }

  isContextListenerExists(type: string | undefined) {
    return !!this.contextListeners.find(listener => listener.type === type);
  }
}

const contextStore = new ContextStore();

export default contextStore;
