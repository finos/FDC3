/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import {
  ContextMetadata,
  DesktopAgent,
  Listener,
  PrivateChannelAddContextListenerEvent,
  PrivateChannelUnsubscribeEvent,
  versionIsAtLeast,
} from '@finos/fdc3-standard';
import { action, makeObservable, observable, runInAction, toJS } from 'mobx';
import { nanoid } from 'nanoid';
import { ContextType, Fdc3Listener, getWorkbenchAgent, PrivateChannel } from '../utility/Fdc3Api.js';
import systemLogStore from './SystemLogStore.js';

interface LegacyPrivateChannel extends PrivateChannel {
  onAddContextListener(handler: (contextType?: string) => void): Listener;
  onUnsubscribe(handler: (contextType?: string) => void): Listener;
  onDisconnect(handler: () => void): Listener;
}

export interface PrivateChannelEventRecord {
  id: string;
  channelId: string;
  type: 'addContextListener' | 'unsubscribe' | 'disconnect';
  contextType: string | null;
}

type WorkbenchAgentProvider = () => Promise<DesktopAgent>;

export class PrivateChannelStore {
  privateChannelsList: PrivateChannel[] = [];

  currentPrivateChannel: PrivateChannel | null = null;

  channelListeners: Fdc3Listener[] = [];

  privateChannelEvents: PrivateChannelEventRecord[] = [];

  private channelEventListeners = new Map<string, Listener[]>();

  constructor(private readonly getAgent: WorkbenchAgentProvider = getWorkbenchAgent) {
    makeObservable(this, {
      privateChannelsList: observable,
      currentPrivateChannel: observable,
      channelListeners: observable,
      privateChannelEvents: observable,
      createPrivateChannel: action,
      broadcast: action,
      listenForEvents: action,
      disconnect: action,
    });
  }

  async createPrivateChannel() {
    try {
      const currentPrivateChannel = await this.getAgent().then(agent => agent.createPrivateChannel());
      const isSuccess = currentPrivateChannel !== null;
      if (isSuccess) {
        this.privateChannelsList.push(currentPrivateChannel);
      }

      runInAction(() => {
        systemLogStore.addLog({
          name: 'createPrivateChannel',
          type: isSuccess ? 'success' : 'error',
          value: currentPrivateChannel.id,
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
    return !!this.channelListeners.find(listener => listener.type === type && listener.channelId === channelId);
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
      const foundListener = this.channelListeners.find(
        currentListener => currentListener.type === newListener && currentListener.channelId === channelId
      );
      if (!foundListener && newListener !== undefined) {
        const listenerId = nanoid();
        const contactListener = await currentChannel.addContextListener(
          newListener.toLowerCase() === 'all' ? null : newListener,
          (context, metaData?: ContextMetadata) => {
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
    } catch {
      /* empty */
    }
  }

  removeContextListener(id: string) {
    const listenerIndex = this.channelListeners.findIndex(listener => listener.id === id);
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

  private recordEvent(channel: PrivateChannel, type: PrivateChannelEventRecord['type'], contextType: string | null) {
    this.privateChannelEvents.push({
      id: nanoid(),
      channelId: channel.id,
      type,
      contextType,
    });
  }

  private onAddContextListenerEvent(
    channel: PrivateChannel,
    contextType: string | null,
    channelContexts?: Record<string, ContextType>,
    channelContextDelay?: Record<string, number>
  ) {
    try {
      const displayedContextType = contextType ?? 'all';
      runInAction(() => {
        this.recordEvent(channel, 'addContextListener', contextType);
        systemLogStore.addLog({
          name: 'pcAddContextListener',
          type: 'success',
          value: `A context listener for '[${displayedContextType}]' has been added on channel [${channel.id}]`,
        });
      });

      Object.entries(channelContexts ?? {})
        .filter(([, context]) => contextType === null || context.type === contextType)
        .forEach(([key, context]) => {
          const broadcast = setTimeout(() => {
            void this.broadcast(channel, context);
            clearTimeout(broadcast);
          }, channelContextDelay?.[key] ?? 0);
        });
    } catch {
      systemLogStore.addLog({
        name: 'pcAddContextListener',
        type: 'error',
        value: `Failed to handle an added '[${contextType ?? 'all'}]' context listener on channel [${channel.id}]`,
      });
    }
  }

  private onUnsubscribeEvent(channel: PrivateChannel, contextType: string | null) {
    try {
      runInAction(() => {
        this.recordEvent(channel, 'unsubscribe', contextType);
        systemLogStore.addLog({
          name: 'pcOnUnsubscribe',
          type: 'success',
          value: `Unsubscribed listener '[${contextType ?? 'all'}]' for channel [${channel.id}]`,
        });
      });
    } catch {
      systemLogStore.addLog({
        name: 'pcOnUnsubscribe',
        type: 'error',
        value: `Could not process listener '[${contextType ?? 'all'}]' being unsubscribed from channel [${channel.id}]`,
      });
    }
  }

  private onDisconnectEvent(channel: PrivateChannel) {
    try {
      this.channelListeners
        .filter(listener => listener.channelId === channel.id)
        .forEach(listener => this.removeContextListener(listener.id));
      void this.unsubscribeEventListeners(channel.id);

      runInAction(() => {
        this.privateChannelsList = this.privateChannelsList.filter(chan => chan.id !== channel.id);
        this.recordEvent(channel, 'disconnect', null);
        systemLogStore.addLog({
          name: 'pcOnDisconnect',
          type: 'success',
          value: `Disconnected from channel [${channel.id}]`,
        });
      });
    } catch {
      systemLogStore.addLog({
        name: 'pcOnDisconnect',
        type: 'error',
        value: `Unable to disconnect from channel [${channel.id}]`,
      });
    }
  }

  async listenForEvents(
    channel: PrivateChannel,
    channelContexts?: Record<string, ContextType>,
    channelContextDelay?: Record<string, number>
  ) {
    if (this.channelEventListeners.has(channel.id)) {
      return;
    }

    try {
      const implementationMetadata = await this.getAgent().then(agent => agent.getInfo());
      let listeners: Listener[];

      if (versionIsAtLeast(implementationMetadata, '2.2') === true) {
        listeners = await Promise.all([
          channel.addEventListener('addContextListener', event => {
            const contextType = (event as PrivateChannelAddContextListenerEvent).details.contextType ?? null;
            this.onAddContextListenerEvent(channel, contextType, channelContexts, channelContextDelay);
          }),
          channel.addEventListener('unsubscribe', event => {
            const contextType = (event as PrivateChannelUnsubscribeEvent).details.contextType ?? null;
            this.onUnsubscribeEvent(channel, contextType);
          }),
          channel.addEventListener('disconnect', () => this.onDisconnectEvent(channel)),
        ]);
      } else {
        const legacyChannel = channel as LegacyPrivateChannel;
        listeners = [
          legacyChannel.onAddContextListener(contextType =>
            this.onAddContextListenerEvent(channel, contextType ?? null, channelContexts, channelContextDelay)
          ),
          legacyChannel.onUnsubscribe(contextType => this.onUnsubscribeEvent(channel, contextType ?? null)),
          legacyChannel.onDisconnect(() => this.onDisconnectEvent(channel)),
        ];
      }

      this.channelEventListeners.set(channel.id, listeners);
    } catch (e) {
      systemLogStore.addLog({
        name: 'privateChannelEventListener',
        type: 'error',
        value: channel.id,
        variant: 'code',
        body: JSON.stringify(e, null, 4),
      });
    }
  }

  private async unsubscribeEventListeners(channelId: string) {
    const listeners = this.channelEventListeners.get(channelId) ?? [];
    this.channelEventListeners.delete(channelId);
    await Promise.allSettled(listeners.map(listener => listener.unsubscribe()));
  }

  async disconnect(channel: PrivateChannel) {
    this.channelListeners
      .filter(listener => listener.channelId === channel.id)
      .forEach(listener => this.removeContextListener(listener.id));
    this.privateChannelsList = this.privateChannelsList.filter(chan => chan.id !== channel.id);
    await this.unsubscribeEventListeners(channel.id);
    await channel.disconnect();
  }
}

const privateChannelStore = new PrivateChannelStore();

export default privateChannelStore;
