/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */
import { makeObservable, observable, action, runInAction, toJS } from 'mobx';
import { ContextType, IntentResolution, Fdc3Listener, AppMetadata, PrivateChannel } from '../utility/Fdc3Api';
import { nanoid } from 'nanoid';
import { intentTypes } from '../fixtures/intentTypes';
import systemLogStore from './SystemLogStore';
import appChannelStore from './AppChannelStore';
import privateChannelStore from './PrivateChannelStore';
import { Channel, getAgent, IntentResult } from '@finos/fdc3';

type IntentItem = { title: string; value: string };

class IntentStore {
  intentsList: IntentItem[] = intentTypes;

  intentListeners: Fdc3Listener[] = [];

  constructor() {
    makeObservable(this, {
      intentsList: observable,
      intentListeners: observable,
      raiseIntent: action,
      addIntentListener: action,
      removeIntentListener: action,
      raiseIntentForContext: action,
    });
  }

  async addIntentListener(
    intent: string,
    resultContext?: ContextType | null,
    channelName?: string | null,
    isPrivate?: boolean,
    channelContexts?: any,
    channelContextDelay?: any
  ) {
    try {
      const listenerId = nanoid();

      const agent = await getAgent();

      const intentListener = await agent.addIntentListener(
        intent,
        async (context: ContextType, metaData?: any): Promise<IntentResult> => {
          const currentListener = this.intentListeners.find(({ id }) => id === listenerId);
          let channel: Channel | undefined;

          //app channel
          if (channelName && !isPrivate) {
            channel = await appChannelStore.getOrCreateChannel(channelName);
          }

          //private channel
          if (isPrivate && !channelName) {
            channel = await privateChannelStore.createPrivateChannel();
            privateChannelStore.addChannelListener(<PrivateChannel>channel, 'all');

            privateChannelStore.onDisconnect(<PrivateChannel>channel);
            privateChannelStore.onUnsubscribe(<PrivateChannel>channel);
            privateChannelStore.onAddContextListener(<PrivateChannel>channel, channelContexts, channelContextDelay);
          }

          if (!isPrivate && channel) {
            if (Object.keys(channelContexts).length !== 0) {
              Object.keys(channelContexts).forEach(key => {
                let broadcast = setTimeout(async () => {
                  appChannelStore.broadcast(<Channel>channel, channelContexts[key]);
                  clearTimeout(broadcast);
                }, channelContextDelay[key]);
              });
            } else {
              await channel.broadcast(context);
            }
          }

          runInAction(() => {
            if (currentListener) {
              currentListener.lastReceivedContext = context;
              currentListener.metaData = metaData;
            }
          });

          systemLogStore.addLog({
            name: 'receivedIntentListener',
            type: 'info',
            value: intent,
            variant: 'code',
            body: JSON.stringify(context, null, 4),
          });

          const result: IntentResult = channel || (resultContext ?? undefined);

          return result;
        }
      );

      runInAction(() => {
        systemLogStore.addLog({
          name: 'addIntentListener',
          type: 'success',
          value: intent,
          variant: 'text',
        });
        this.intentListeners.push({ id: listenerId, type: intent, listener: intentListener });
      });
    } catch (e) {
      systemLogStore.addLog({
        name: 'addIntentListener',
        type: 'error',
        value: intent,
        variant: 'code',
        body: JSON.stringify(e, null, 4),
      });
    }
  }

  async removeIntentListener(id: string) {
    const listenerIndex = this.intentListeners.findIndex(listener => listener.id === id);

    if (listenerIndex !== -1) {
      try {
        (await this.intentListeners[listenerIndex].listener).unsubscribe();

        runInAction(() => {
          systemLogStore.addLog({
            name: 'removeIntentListener',
            type: 'success',
            value: this.intentListeners[listenerIndex].type,
            variant: 'text',
          });
          this.intentListeners.splice(listenerIndex, 1);
        });
      } catch (e) {
        systemLogStore.addLog({
          name: 'removeIntentListener',
          type: 'error',
          value: this.intentListeners[listenerIndex].type,
          variant: 'code',
          body: JSON.stringify(e, null, 4),
        });
      }
    }
  }

  async raiseIntent(intent: string, context: ContextType, app?: AppMetadata) {
    const agent = await getAgent();

    if (!context) {
      systemLogStore.addLog({
        name: 'raiseIntent',
        type: 'error',
        value: intent,
      });
      return;
    }

    try {
      let resolution: IntentResolution;

      if (app) {
        resolution = await agent.raiseIntent(intent, toJS(context), app);
      } else {
        resolution = await agent.raiseIntent(intent, toJS(context));
      }

      systemLogStore.addLog({
        name: 'raiseIntent',
        type: 'success',
        value: intent,
        variant: 'code',
        body: JSON.stringify(resolution, null, 4),
      });

      return resolution;
    } catch (e) {
      systemLogStore.addLog({
        name: 'raiseIntent',
        type: 'error',
        value: intent,
        variant: 'code',
        body: JSON.stringify(e, null, 4),
      });
    }
  }

  async raiseIntentForContext(context: ContextType, app?: AppMetadata) {
    const agent = await getAgent();

    if (!context) {
      systemLogStore.addLog({
        name: 'raiseIntentForContext',
        type: 'error',
      });
      return;
    }

    try {
      let resolution: IntentResolution;

      if (app) {
        resolution = await agent.raiseIntentForContext(toJS(context), app);
      } else {
        resolution = await agent.raiseIntentForContext(toJS(context));
      }
      systemLogStore.addLog({
        name: 'raiseIntentForContext',
        type: 'success',
      });

      return resolution;
    } catch (e) {
      console.log(e);
      systemLogStore.addLog({
        name: 'raiseIntentForContext',
        type: 'error',
      });
    }
  }
}

const intentStore = new IntentStore();

export default intentStore;
