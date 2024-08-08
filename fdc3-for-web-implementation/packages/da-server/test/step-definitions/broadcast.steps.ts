import { When } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { createMeta } from './generic.steps';
import { AddContextListenerRequest, ContextListenerUnsubscribeRequest, BroadcastRequest, GetCurrentContextRequest } from '@kite9/fdc3-common';
import { handleResolve } from "@kite9/testing";
import { contextMap } from './generic.steps';

When('{string} adds a context listener on {string} with type {string}', function (this: CustomWorld, app: string, channelId: string, contextType: string) {
  const meta = createMeta(this, app)
  const uuid = this.sc.getInstanceUUID(meta.source)!!
  const message = {
    meta,
    payload: {
      channelId: handleResolve(channelId, this),
      contextType: handleResolve(contextType, this)
    },
    type: 'addContextListenerRequest'
  } as AddContextListenerRequest

  this.server.receive(message, uuid)
})

When('{string} asks for the latest context on {string} with type {string}', function (this: CustomWorld, app: string, channelId: string, contextType: string) {
  const meta = createMeta(this, app)
  const uuid = this.sc.getInstanceUUID(meta.source)!!
  const message = {
    meta,
    payload: {
      channelId: handleResolve(channelId, this),
      contextType
    },
    type: 'getCurrentContextRequest'
  } as GetCurrentContextRequest

  this.server.receive(message, uuid)
})


When('{string} removes context listener with id {string}', function (this: CustomWorld, app: string, id: string) {
  const meta = createMeta(this, app)
  const uuid = this.sc.getInstanceUUID(meta.source)!!

  const message = {
    meta,
    payload: {
      listenerUUID: id
    },
    type: 'contextListenerUnsubscribeRequest'
  } as ContextListenerUnsubscribeRequest

  this.server.receive(message, uuid)
})

When('{string} broadcasts {string} on {string}', function (this: CustomWorld, app: string, contextType: string, channelId: string) {
  const meta = createMeta(this, app)
  const uuid = this.sc.getInstanceUUID(meta.source)!!

  const message = {
    meta,
    payload: {
      channelId: handleResolve(channelId, this),
      context: contextMap[contextType]
    },
    type: 'broadcastRequest'
  } as BroadcastRequest

  this.server.receive(message, uuid)

})
