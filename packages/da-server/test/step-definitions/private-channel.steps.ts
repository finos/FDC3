import { When } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { PrivateChannelOnAddContextListenerAgentRequest, PrivateChannelOnUnsubscribeAgentRequest, PrivateChannelBroadcastAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
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

When('{string} removes context listener on private channel {string} with type {string}', function (this: CustomWorld, app: string, channelId: string, contextType: string) {
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
