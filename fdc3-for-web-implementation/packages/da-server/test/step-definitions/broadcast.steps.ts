import { When } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { BroadcastAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { contextMap, createMeta } from './generic.steps';
import { OnAddContextListenerAgentRequest, OnUnsubscribeAgentRequest } from '@kite9/fdc3-common';

When('{string} adds a context listener on {string} with type {string}', function (this: CustomWorld, app: string, channelId: string, contextType: string) {
  const meta = createMeta(this, app)
  const message = {
    meta,
    payload: {
      channelId,
      contextType
    },
    type: 'onAddContextListener'
  } as OnAddContextListenerAgentRequest

  this.server.receive(message, meta.source)
})

When('{string} removes context listener on {string} with type {string}', function (this: CustomWorld, app: string, channelId: string, contextType: string) {
  const meta = createMeta(this, app)
  const message = {
    meta,
    payload: {
      channelId,
      contextType
    },
    type: 'onUnsubscribe'
  } as OnUnsubscribeAgentRequest

  this.server.receive(message, meta.source)
})

When('{string} broadcasts {string} on {string}', function (this: CustomWorld, app: string, contextType: string, channelId: string) {
  const meta = createMeta(this, app)
  const message = {
    meta,
    payload: {
      channelId,
      context: contextMap[contextType]
    },
    type: 'broadcastRequest'
  } as BroadcastAgentRequest

  this.server.receive(message, meta.source)

})
