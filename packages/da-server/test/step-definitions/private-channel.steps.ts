import { When } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { PrivateChannelOnAddContextListenerAgentRequest, PrivateChannelOnUnsubscribeAgentRequest, PrivateChannelBroadcastAgentRequest, PrivateChannelEventListenerAddedAgentRequest, PrivateChannelEventListenerRemovedAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { contextMap, createMeta } from './generic.steps';


When('{string} adds a context listener on private channel {string} with type {string}', function (this: CustomWorld, app: string, channelId: string, contextType: string) {
  const meta = createMeta(this, app)
  const message = {
    meta,
    payload: {
      channelId,
      contextType
    },
    type: 'PrivateChannel.onAddContextListener'
  } as PrivateChannelOnAddContextListenerAgentRequest

  this.server.receive(message, meta.source)
})

When('{string} adds an AddContextListener on private channel {string}', function (this: CustomWorld, app: string, channelId: string) {
  const meta = createMeta(this, app)
  const message = {
    meta,
    payload: {
      channelId,
      listenerType: 'onAddContextListener'
    },
    type: 'PrivateChannel.eventListenerAdded'
  } as PrivateChannelEventListenerAddedAgentRequest

  this.server.receive(message, meta.source)
})

When('{string} removes an AddContextListener on private channel {string}', function (this: CustomWorld, app: string, channelId: string) {
  const meta = createMeta(this, app)
  const message = {
    meta,
    payload: {
      channelId,
      listenerType: 'onAddContextListener'
    },
    type: 'PrivateChannel.eventListenerRemoved'
  } as PrivateChannelEventListenerRemovedAgentRequest

  this.server.receive(message, meta.source)
})

When('{string} adds an onUnsubscribeListener on private channel {string}', function (this: CustomWorld, app: string, channelId: string) {
  const meta = createMeta(this, app)
  const message = {
    meta,
    payload: {
      channelId,
      listenerType: 'onUnsubscribe'
    },
    type: 'PrivateChannel.eventListenerAdded'
  } as PrivateChannelEventListenerAddedAgentRequest

  this.server.receive(message, meta.source)
})

When('{string} removes an onUnsubscribeListener on private channel {string}', function (this: CustomWorld, app: string, channelId: string) {
  const meta = createMeta(this, app)
  const message = {
    meta,
    payload: {
      channelId,
      listenerType: 'onUnsubscribe'
    },
    type: 'PrivateChannel.eventListenerRemoved'
  } as PrivateChannelEventListenerRemovedAgentRequest

  this.server.receive(message, meta.source)
})

When('{string} removes a context listener on private channel {string} with type {string}', function (this: CustomWorld, app: string, channelId: string, contextType: string) {
  const meta = createMeta(this, app)
  const message = {
    meta,
    payload: {
      channelId,
      contextType
    },
    type: 'PrivateChannel.onUnsubscribe'
  } as PrivateChannelOnUnsubscribeAgentRequest

  this.server.receive(message, meta.source)
})

When('{string} broadcasts {string} on private channel {string}', function (this: CustomWorld, app: string, contextType: string, channelId: string) {
  const meta = createMeta(this, app)
  const message = {
    meta,
    payload: {
      channelId,
      context: contextMap[contextType]
    },
    type: 'PrivateChannel.broadcast'
  } as PrivateChannelBroadcastAgentRequest

  this.server.receive(message, meta.source)
})
