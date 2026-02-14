/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import { makeObservable, observable, action, runInAction, toJS } from 'mobx';
import { ContextType, Fdc3Listener, getWorkbenchAgent } from '../utility/Fdc3Api.js';
import systemLogStore from './SystemLogStore.js';
import { nanoid } from 'nanoid';
import { Channel } from '@finos/fdc3';

interface ListenerOptionType {
  title: string;
  value: string;
  type: string | undefined;
}

export interface Fdc3ChannelRecord {
  id: string;
  channel: Channel;
  currentListener?: ListenerOptionType | null;
  broadcastError?: string;
  context?: ContextType | null;
  listenerError?: string;
}
class AppChannelStore {
  appChannelsList: Fdc3ChannelRecord[] = [];

  currentAppChannel: Fdc3ChannelRecord | null = null;

  channelListeners: Fdc3Listener[] = [];

  constructor() {
    makeObservable(this, {
      appChannelsList: observable,
      currentAppChannel: observable,
      channelListeners: observable,
      getOrCreateChannel: action,
      leaveChannel: action,
      broadcast: action,
    });
  }

  async getOrCreateChannel(channelId: string) {
    try {
      const currentAppChannelObj = await getWorkbenchAgent().then(agent => agent.getOrCreateChannel(channelId));
      if (currentAppChannelObj) {
        const record = {
          id: channelId,
          channel: currentAppChannelObj,
        };
        this.currentAppChannel = record;
        let foundChannel = this.appChannelsList.find(channel => channel.id === channelId);
        if (!foundChannel) {
          runInAction(() => {
            this.appChannelsList.push(record);
          });
        }
      }
      runInAction(() => {
        systemLogStore.addLog({
          name: 'getOrCreateChannel',
          type: currentAppChannelObj ? 'success' : 'error',
          value: currentAppChannelObj ? currentAppChannelObj?.id : channelId,
          variant: 'text',
        });
      });
      return currentAppChannelObj;
    } catch (e) {
      systemLogStore.addLog({
        name: 'getOrCreateChannel',
        type: 'error',
        value: channelId,
        variant: 'code',
        body: JSON.stringify(e, null, 4),
      });
      return;
    }
  }

  isContextListenerExists(channelId: string, type: string | undefined) {
    return !!this.channelListeners?.find(listener => listener.type === type && listener.channelId === channelId);
  }

  isAppChannelExists(channelId: string) {
    return !!this.appChannelsList.find(channel => channel.id === channelId);
  }

  async broadcast(channel: Channel, context: ContextType) {
    const channelId = channel.id;
    if (!context) {
      systemLogStore.addLog({
        name: 'appBroadcast',
        type: 'warning',
        value: `You must set a context before you can broadcast it to channel: ${channelId}`,
        variant: 'text',
      });
    }

    //check that we're on a channel
    let currentChannel = this.appChannelsList.find(chan => chan.id === channelId);

    if (!currentChannel) {
      systemLogStore.addLog({
        name: 'appBroadcast',
        type: 'warning',
        value: 'You are not currently joined to a channel (no-op)',
        variant: 'text',
      });
      return;
    }

    try {
      await currentChannel.channel.broadcast(toJS(context));
      systemLogStore.addLog({
        name: 'appBroadcast',
        type: 'success',
        body: JSON.stringify(context, null, 4),
        variant: 'code',
        value: channelId,
      });
    } catch (e) {
      systemLogStore.addLog({
        name: 'appBroadcast',
        type: 'error',
        body: JSON.stringify(e, null, 4),
        variant: 'code',
        value: channelId,
      });
    }
  }

  async leaveChannel() {
    try {
      const agent = await getWorkbenchAgent();
      //check that we're on a channel
      let currentChannel = await agent.getCurrentChannel();
      if (!currentChannel) {
        systemLogStore.addLog({
          name: 'leaveChannel',
          type: 'warning',
          value: '',
          variant: 'text',
        });
      } else {
        await agent.leaveCurrentChannel();
        currentChannel = await agent.getCurrentChannel();
        const isSuccess = currentChannel === null;

        runInAction(() => {
          systemLogStore.addLog({
            name: 'leaveChannel',
            type: isSuccess ? 'success' : 'error',
            value: this.currentAppChannel?.id,
            variant: 'text',
          });

          if (isSuccess) {
            this.currentAppChannel = null;
          }
        });
      }
    } catch (e) {
      systemLogStore.addLog({
        name: 'leaveChannel',
        type: 'error',
        value: this.currentAppChannel?.id,
        variant: 'code',
        body: JSON.stringify(e, null, 4),
      });
    }
  }

  async addChannelListener(currChannel: Channel, newListener: string | undefined) {
    const channelId = currChannel.id;
    try {
      let currentChannel = this.appChannelsList.find(channel => channel.id === channelId);
      let foundListener = this.channelListeners.find(
        currentListener => currentListener.type === newListener && currentListener.channelId === channelId
      );

      if (!foundListener && currentChannel && newListener !== undefined) {
        const listenerId = nanoid();
        const contactListener = await currentChannel.channel.addContextListener(
          newListener?.toLowerCase() === 'all' ? null : newListener,
          (context, metaData?: any) => {
            const currentListener = this.channelListeners.find(
              listener => listener.type === newListener && listener.channelId === channelId
            );

            runInAction(() => {
              if (currentListener) {
                currentListener.lastReceivedContext = context;
                currentListener.metaData = metaData;
              }
            });

            systemLogStore.addLog({
              name: 'receivedAppContextListener',
              type: 'info',
              value: `Channel [${channelId}] Received context via '[${newListener}]' listener`,
              variant: 'code',
              body: JSON.stringify(context, null, 4),
            });
          }
        );

        runInAction(() => {
          systemLogStore.addLog({
            name: 'addAppContextListener',
            type: 'success',
            value: `A context listener for '[${newListener}]' has been added on channel [${channelId}]`,
            variant: 'text',
          });
          this.channelListeners.push({ id: listenerId, type: newListener, listener: contactListener, channelId });
        });
      }
    } catch (e) {
      systemLogStore.addLog({
        name: 'addAppContextListener',
        type: 'error',
        value: `Failed to add a context listener for '[${newListener}]' on channel [${channelId}]`,
        variant: 'code',
        body: JSON.stringify(e, null, 4),
      });
    }
  }

  removeContextListener(id: string) {
    const listenerIndex = this.channelListeners?.findIndex(listener => listener.id === id);
    const listener = this.channelListeners[listenerIndex];
    if (listenerIndex !== -1) {
      try {
        this.channelListeners[listenerIndex].listener.unsubscribe();

        runInAction(() => {
          systemLogStore.addLog({
            name: 'removeAppChannelContextListener',
            type: 'success',
            value: `A context listener for '[${listener.type}]' for channel [${listener.channelId}] has been removed`,
            variant: 'text',
          });
          this.channelListeners.splice(listenerIndex, 1);
        });
      } catch (e) {
        systemLogStore.addLog({
          name: 'removeAppChannelContextListener',
          type: 'error',
          value: `Failed to remove a context listener for '[${listener.type}]' on channel [${listener.channelId}]`,
          variant: 'code',
          body: JSON.stringify(e, null, 4),
        });
      }
    }
  }

  remove(channel: Channel) {
    this.channelListeners.forEach(listener => this.removeContextListener(listener.id));
    runInAction(() => {
      this.appChannelsList = this.appChannelsList.filter(chan => chan.id !== channel.id);
    });
  }
}

const appChannelStore = new AppChannelStore();

export default appChannelStore;
