/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import { makeObservable, observable, action, runInAction } from 'mobx';
import systemLogStore from './SystemLogStore';
import { Channel } from '@finos/fdc3';
import { getWorkbenchAgent } from '../utility/Fdc3Api';

class ChannelStore {
  userChannels: Channel[] = [];

  currentUserChannel: Channel | null = null;

  constructor() {
    makeObservable(this, {
      userChannels: observable,
      currentUserChannel: observable,
      getUserChannels: action,
      joinUserChannel: action,
      leaveUserChannel: action,
      getCurrentUserChannel: action,
    });

    this.getUserChannels();
  }

  async getCurrentUserChannel() {
    const agent = await getWorkbenchAgent();
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
    const agent = await getWorkbenchAgent();
    //defer retrieving channels until fdc3 API is ready
    try {
      //backwards compatibility for FDC3 < 2.0
      //  don't destructure DA implementations in case their context is not bound
      let userChannels: Channel[];
      if (agent.getUserChannels) {
        userChannels = await agent.getUserChannels();
      } else {
        userChannels = await agent.getSystemChannels();
      }
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
    const agent = await getWorkbenchAgent();
    try {
      //backwards compatability for 1.2
      const joinUserChannel = agent.joinUserChannel ?? agent.joinChannel;
      await joinUserChannel(channelId);
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
    const agent = await getWorkbenchAgent();
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
}

const channelStore = new ChannelStore();

export default channelStore;
