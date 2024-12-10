import { AutomaticResponse, TestMessaging } from '../TestMessaging';
import { Context } from '@kite9/fdc3-context';

import { BrowserTypes } from '@kite9/fdc3-schema';

type JoinUserChannelRequest = BrowserTypes.JoinUserChannelRequest;
type JoinUserChannelResponse = BrowserTypes.JoinUserChannelResponse;
type LeaveCurrentChannelResponse = BrowserTypes.LeaveCurrentChannelResponse;
type LeaveCurrentChannelRequest = BrowserTypes.LeaveCurrentChannelRequest;
type GetCurrentChannelRequest = BrowserTypes.GetCurrentChannelRequest;
type GetCurrentChannelResponse = BrowserTypes.GetCurrentChannelResponse;
type AddContextListenerRequest = BrowserTypes.AddContextListenerRequest;
type AddContextListenerResponse = BrowserTypes.AddContextListenerResponse;
type ContextListenerUnsubscribeRequest = BrowserTypes.ContextListenerUnsubscribeRequest;
type ContextListenerUnsubscribeResponse = BrowserTypes.ContextListenerUnsubscribeResponse;
type GetCurrentContextRequest = BrowserTypes.GetCurrentContextRequest;
type GetCurrentContextResponse = BrowserTypes.GetCurrentContextResponse;
type BroadcastRequest = BrowserTypes.BroadcastRequest;
type BroadcastResponse = BrowserTypes.BroadcastResponse;
type AgentResponseMessage = BrowserTypes.AgentResponseMessage;

import { createResponseMeta } from './support';
import { v4 as uuidv4 } from 'uuid';
import { AppRequestMessage } from '@kite9/fdc3-schema/generated/api/BrowserTypes';

export class ChannelState implements AutomaticResponse {
  private channelId: string | null = null;
  private listeners: { [channel: string]: string[] } = {};
  private contextHistory: { [channel: string]: Context[] } = {};

  constructor(contextHistory: { [channel: string]: Context[] }) {
    this.contextHistory = contextHistory;
  }

  filter(t: string) {
    return (
      t == 'broadcastRequest' ||
      t == 'joinUserChannelRequest' ||
      t == 'leaveCurrentChannelRequest' ||
      t == 'getCurrentChannelRequest' ||
      t == 'addContextListenerRequest' ||
      t == 'contextListenerUnsubscribeRequest' ||
      t == 'getCurrentContextRequest'
    );
  }

  action(input: AppRequestMessage, m: TestMessaging) {
    let out: AgentResponseMessage | null = null;
    switch (input.type) {
      case 'joinUserChannelRequest':
        out = this.createJoinResponse(input as JoinUserChannelRequest);
        break;
      case 'leaveCurrentChannelRequest':
        out = this.createLeaveResponse(input as LeaveCurrentChannelRequest);
        break;

      case 'getCurrentChannelRequest':
        out = this.createGetChannelResponse(input as GetCurrentChannelRequest);
        break;

      case 'addContextListenerRequest':
        out = this.createAddListenerResponse(input as AddContextListenerRequest);
        break;

      case 'contextListenerUnsubscribeRequest':
        out = this.createUnsubscribeResponse(input as ContextListenerUnsubscribeRequest);
        break;

      case 'getCurrentContextRequest':
        out = this.createGetContextResponse(input as GetCurrentContextRequest);
        break;

      case 'broadcastRequest':
        out = this.createBroadcastResponse(input as BroadcastRequest);
        break;
    }

    if (out) {
      setTimeout(() => {
        m.receive(out!);
      }, 100);
    }
    return Promise.resolve();
  }

  private createBroadcastResponse(i: BroadcastRequest): BroadcastResponse {
    const channel = i.payload.channelId;
    const context = i.payload.context;
    this.contextHistory[channel] = this.contextHistory[channel] ?? [];
    this.contextHistory[channel].unshift(context);

    return {
      meta: createResponseMeta(i.meta),
      type: 'broadcastResponse',
      payload: {},
    };
  }

  private createJoinResponse(i: JoinUserChannelRequest): JoinUserChannelResponse {
    if (i.payload.channelId == 'nonexistent') {
      return {
        meta: createResponseMeta(i.meta),
        type: 'joinUserChannelResponse',
        payload: {
          error: 'NoChannelFound',
        },
      };
    } else {
      this.channelId = i.payload.channelId;
      return {
        meta: createResponseMeta(i.meta),
        type: 'joinUserChannelResponse',
        payload: {},
      };
    }
  }

  private createGetContextResponse(input: GetCurrentContextRequest): GetCurrentContextResponse {
    const ch = input.payload.channelId;
    let last: Context | undefined;
    const contexts = this.contextHistory[ch] ?? [];
    if (input.payload.contextType) {
      last = contexts.find(c => c.type == input.payload.contextType);
    } else {
      last = contexts.length > 0 ? contexts[0] : undefined;
    }
    return {
      meta: createResponseMeta(input.meta),
      type: 'getCurrentContextResponse',
      payload: {
        context: last ?? null,
      },
    };
  }

  private createLeaveResponse(i: LeaveCurrentChannelRequest): LeaveCurrentChannelResponse {
    this.channelId = null;
    return {
      meta: createResponseMeta(i.meta),
      type: 'leaveCurrentChannelResponse',
      payload: {},
    };
  }

  private createAddListenerResponse(i: AddContextListenerRequest): AddContextListenerResponse {
    const id = uuidv4();

    if (this.channelId) {
      const list = this.listeners[this.channelId] ?? [];
      list.push(id);
      this.listeners[this.channelId] = list;
    }

    return {
      meta: createResponseMeta(i.meta),
      type: 'addContextListenerResponse',
      payload: {
        listenerUUID: id,
      },
    };
  }

  private createUnsubscribeResponse(i: ContextListenerUnsubscribeRequest): ContextListenerUnsubscribeResponse {
    const id = i.payload.listenerUUID;
    Object.keys(this.listeners).forEach(k => {
      this.listeners[k] = this.listeners[k].filter(v => v != id);
    });

    return {
      meta: createResponseMeta(i.meta),
      type: 'contextListenerUnsubscribeResponse',
      payload: {},
    };
  }

  private createGetChannelResponse(i: GetCurrentChannelRequest): GetCurrentChannelResponse {
    return {
      meta: createResponseMeta(i.meta),
      type: 'getCurrentChannelResponse',
      payload: {
        channel: this.channelId
          ? {
              id: this.channelId,
              type: 'user',
              displayMetadata: {
                name: 'The ' + this.channelId + ' channel',
                color: 'red',
                glyph: 'triangle',
              },
            }
          : null,
      },
    } as GetCurrentChannelResponse;
  }
}
