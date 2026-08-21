/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import { action, makeObservable, observable, runInAction } from 'mobx';
import systemLogStore from './SystemLogStore.js';
import { Channel, DesktopAgent, FDC3ChannelChangedEvent, Listener, versionIsAtLeast } from '@finos/fdc3';
import { getWorkbenchAgent } from '../utility/Fdc3Api.js';

type WorkbenchAgentProvider = () => Promise<DesktopAgent>;

export class ChannelStore {
  userChannels: Channel[] = [];

  currentUserChannel: Channel | null = null;

  isUserChannelChangedListenerActive = false;

  private userChannelChangedListener: Listener | null = null;

  constructor(
    private readonly getAgent: WorkbenchAgentProvider = getWorkbenchAgent,
    autoInitialize = typeof window !== 'undefined'
  ) {
    makeObservable(this, {
      userChannels: observable,
      currentUserChannel: observable,
      isUserChannelChangedListenerActive: observable,
      getUserChannels: action,
      joinUserChannel: action,
      leaveUserChannel: action,
      getCurrentUserChannel: action,
      listenForUserChannelChanges: action,
    });

    if (autoInitialize) {
      void this.initialize();
    }
  }

  private async initialize() {
    await this.getUserChannels();
    await this.listenForUserChannelChanges();
  }

  async getCurrentUserChannel() {
    const agent = await this.getAgent();
    try {
      const userChannel = await agent.getCurrentChannel();
      runInAction(() => {
        systemLogStore.addLog({
          name: 'getCurrentChannel',
          type: 'success',
          value: userChannel ? userChannel.id : 'none',
          variant: 'text',
        });
        this.currentUserChannel = userChannel;
      });
    } catch (e) {
      runInAction(() => {
        systemLogStore.addLog({
          name: 'getCurrentChannel',
          type: 'error',
          body: (e as Error).message ?? (e as string),
          variant: 'text',
        });
      });
    }
  }

  async getUserChannels() {
    const agent = await this.getAgent();
    //defer retrieving channels until fdc3 API is ready
    try {
      const userChannels: Channel[] = await agent.getUserChannels();
      const currentUserChannel = await agent.getCurrentChannel();

      runInAction(() => {
        systemLogStore.addLog({
          name: 'getChannels',
          type: 'success',
        });
        this.userChannels = userChannels;
        this.currentUserChannel = currentUserChannel;
      });
    } catch (e) {
      console.error('Failed to retrieve user channels: ', e);
      systemLogStore.addLog({
        name: 'getChannels',
        type: 'error',
        variant: 'code',
        body: JSON.stringify(e, null, 4),
      });
    }
  }

  async joinUserChannel(channelId: string) {
    const agent = await this.getAgent();
    try {
      await agent.joinUserChannel(channelId);

      const currentUserChannel = await agent.getCurrentChannel();
      const isSuccess = currentUserChannel !== null;

      runInAction(() => {
        systemLogStore.addLog({
          name: 'joinUserChannel',
          type: isSuccess ? 'success' : 'error',
          value: isSuccess ? currentUserChannel?.id : channelId,
          variant: 'text',
        });
        this.currentUserChannel = currentUserChannel;
      });
    } catch (e) {
      systemLogStore.addLog({
        name: 'joinUserChannel',
        type: 'error',
        value: channelId,
        variant: 'code',
        body: JSON.stringify(e, null, 4),
      });
    }
  }

  async leaveUserChannel() {
    const agent = await this.getAgent();
    try {
      //check that we're on a channel
      let currentUserChannel = await agent.getCurrentChannel();
      if (!currentUserChannel) {
        systemLogStore.addLog({
          name: 'leaveChannel',
          type: 'warning',
          value: '',
          variant: 'text',
        });
      } else {
        await agent.leaveCurrentChannel();
        currentUserChannel = await agent.getCurrentChannel();
        const isSuccess = currentUserChannel === null;

        runInAction(() => {
          systemLogStore.addLog({
            name: 'leaveChannel',
            type: isSuccess ? 'success' : 'error',
            value: this.currentUserChannel?.id,
            variant: 'text',
          });

          if (isSuccess) {
            this.currentUserChannel = null;
          }
        });
      }
    } catch (e) {
      systemLogStore.addLog({
        name: 'leaveChannel',
        type: 'error',
        value: this.currentUserChannel?.id,
        variant: 'code',
        body: JSON.stringify(e, null, 4),
      });
    }
  }

  async listenForUserChannelChanges() {
    if (this.userChannelChangedListener) {
      return;
    }

    const agent = await this.getAgent();

    try {
      const implementationMetadata = await agent.getInfo();
      if (versionIsAtLeast(implementationMetadata, '2.2') !== true) {
        return;
      }

      const listener = await agent.addEventListener('userChannelChanged', event => {
        const channelId = (event as FDC3ChannelChangedEvent).details.currentChannelId;
        const currentUserChannel =
          channelId === null ? null : (this.userChannels.find(channel => channel.id === channelId) ?? null);

        runInAction(() => {
          this.currentUserChannel = currentUserChannel;
          systemLogStore.addLog({
            name: 'userChannelChanged',
            type: 'info',
            value: channelId ?? 'none',
            variant: 'code',
            body: JSON.stringify(event, null, 4),
          });
        });

        if (channelId !== null && currentUserChannel === null) {
          void this.getCurrentUserChannel();
        }
      });

      runInAction(() => {
        this.userChannelChangedListener = listener;
        this.isUserChannelChangedListenerActive = true;
      });
    } catch (e) {
      systemLogStore.addLog({
        name: 'userChannelChanged',
        type: 'error',
        variant: 'code',
        body: JSON.stringify(e, null, 4),
      });
    }
  }
}

const channelStore = new ChannelStore();

export default channelStore;
