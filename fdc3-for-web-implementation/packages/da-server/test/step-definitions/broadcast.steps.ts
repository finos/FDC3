import { When } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
// import { BroadcastAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { createMeta } from './generic.steps';
import { AddContextListenerRequest } from '@kite9/fdc3-common';
import { handleResolve } from "@kite9/testing";

When('{string} adds a context listener on {string} with type {string}', function (this: CustomWorld, app: string, channelId: string, contextType: string) {
  const meta = createMeta(this, app)
  const uuid = this.sc.getInstanceUUID(meta.source)!!
  const message = {
    meta,
    payload: {
      channelId: handleResolve(channelId, this),
      contextType
    },
    type: 'addContextListenerRequest'
  } as AddContextListenerRequest

  this.server.receive(message, uuid)
})

// When('{string} removes context listener on {string} with type {string}', function (this: CustomWorld, app: string, channelId: string, contextType: string) {
//   const meta = createMeta(this, app)
//   const message = {
//     meta,
//     payload: {
//       channelId,
//       contextType
//     },
//     type: 'onUnsubscribe'
//   } as OnUnsubscribeAgentRequest

//   this.server.receive(message, meta.source)
// })

// When('{string} broadcasts {string} on {string}', function (this: CustomWorld, app: string, contextType: string, channelId: string) {
//   const meta = createMeta(this, app)
//   const message = {
//     meta,
//     payload: {
//       channelId,
//       context: contextMap[contextType]
//     },
//     type: 'broadcastRequest'
//   } as BroadcastAgentRequest

//   this.server.receive(message, meta.source)

// })
