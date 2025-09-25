/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import { makeObservable, observable, action, runInAction, toJS } from 'mobx';
import { ContextType, Fdc3Listener, PrivateChannel } from '../utility/Fdc3Api.js';
import systemLogStore from './SystemLogStore.js';
import { nanoid } from 'nanoid';
import { getWorkbenchAgent } from '../utility/Fdc3Api.js';
// interface ListenerOptionType {
// 	title: string;
// 	value: string;
// 	type: string | undefined;
// }

class PrivateChannelStore {
  privateChannelsList: PrivateChannel[] = [];

  currentPrivateChannel: PrivateChannel | null = null;

  channelListeners: Fdc3Listener[] = [];

  constructor() {
    makeObservable(this, {
      privateChannelsList: observable,
      currentPrivateChannel: observable,
      channelListeners: observable,
      createPrivateChannel: action,
      broadcast: action,
      onAddContextListener: action,
      onDisconnect: action,
      onUnsubscribe: action,
      disconnect: action,
    });
  }

  async createPrivateChannel() {
    try {
      const currentPrivateChannel: any = await getWorkbenchAgent().then(agent => agent.createPrivateChannel());
      const isSuccess = currentPrivateChannel !== null;
      if (isSuccess) {
        this.privateChannelsList.push(currentPrivateChannel);
      }

      runInAction(() => {
        systemLogStore.addLog({
          name: 'createPrivateChannel',
          type: isSuccess ? 'success' : 'error',
          value: isSuccess ? currentPrivateChannel?.id : currentPrivateChannel.id,
          variant: 'text',
        });
      });

      return currentPrivateChannel;
    } catch (e) {
      systemLogStore.addLog({
        name: 'createPrivateChannel',
        type: 'error',
        value: '',
        variant: 'code',
        body: JSON.stringify(e, null, 4),
      });
    }
  }

  isContextListenerExists(channelId: string, type: string | undefined) {
    return !!this.channelListeners?.find(listener => listener.type === type && listener.channelId === channelId);
  }

  isPrivateChannelExists(channelId: string) {
    return !!this.privateChannelsList.find(channel => channel.id === channelId);
  }

  async broadcast(channel: PrivateChannel, context: ContextType) {
    const channelId = channel.id;
    if (!context) {
      systemLogStore.addLog({
        name: 'appBroadcast',
        type: 'warning',
        value: `You must set a context before you can broadcast it to channel: ${channelId}`,
        variant: 'text',
      });
    }

    if (!channel) {
      systemLogStore.addLog({
        name: 'appBroadcast',
        type: 'warning',
        value: 'You are not currently joined to a channel (no-op)',
        variant: 'text',
      });
      return;
    }

    try {
      await channel.broadcast(toJS(context));
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

  async addChannelListener(currentChannel: PrivateChannel, newListener: string | undefined) {
    const channelId = currentChannel.id;
    try {
      let foundListener = this.channelListeners.find(
        currentListener => currentListener.type === newListener && currentListener.channelId === channelId
      );
      if (!foundListener && currentChannel && newListener !== undefined) {
        const listenerId = nanoid();
        const contactListener = await currentChannel.addContextListener(
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
          this.channelListeners.push({
            id: listenerId,
            type: newListener,
            listener: contactListener,
            channelId,
          });
        });
      }
    } catch (e) {}
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

  onAddContextListener(channel: PrivateChannel, channelContexts?: any, channelContextDelay?: any) {
    channel.onAddContextListener(() => {
      try {
        systemLogStore.addLog({
          name: 'pcAddContextListener',
          type: 'success',
          value: `A context listener for '[all]' has been added on channel [${channel.id}]`,
        });

        if (Object.keys(channelContexts).length !== 0) {
          Object.keys(channelContexts).forEach(key => {
            let broadcast = setTimeout(async () => {
              this.broadcast(channel, channelContexts[key]);
              clearTimeout(broadcast);
            }, channelContextDelay[key]);
          });
        }
      } catch (e) {
        systemLogStore.addLog({
          name: 'pcAddContextListener',
          type: 'error',
          value: `Failed to add a context listener for '[all]' on channel [${channel.id}]`,
        });
      }
    });
  }

  onUnsubscribe(channel: PrivateChannel) {
    channel.onUnsubscribe(() => {
      try {
        systemLogStore.addLog({
          name: 'pcOnUnsubscribe',
          type: 'success',
          value: `Sucessfully unsubscribed from listener '[all]' for channel [${channel.id}]`,
        });
      } catch (e) {
        systemLogStore.addLog({
          name: 'pcOnUnsubscribe',
          type: 'error',
          value: `Could not unsubscribed listener '[all]' from channel [${channel.id}]`,
        });
      }
    });
  }

  onDisconnect(channel: PrivateChannel) {
    channel.onDisconnect(() => {
      try {
        this.channelListeners.forEach(listener => {
          this.removeContextListener(listener.id);
        });
        this.privateChannelsList = this.privateChannelsList.filter(chan => chan.id !== channel.id);
        systemLogStore.addLog({
          name: 'pcOnDisconnect',
          type: 'success',
          value: `Sucessfully disconntected from channel [${channel.id}]`,
        });
      } catch (e) {
        systemLogStore.addLog({
          name: 'pcOnDisconnect',
          type: 'error',
          value: `Unable to disconnect from channel [${channel.id}]`,
        });
      }
    });
  }

  disconnect(channel: PrivateChannel) {
    this.channelListeners.forEach(listener => {
      this.removeContextListener(listener.id);
    });
    this.privateChannelsList = this.privateChannelsList.filter(chan => chan.id !== channel.id);
    channel.disconnect();
  }
}

const privateChannelStore = new PrivateChannelStore();

export default privateChannelStore;
