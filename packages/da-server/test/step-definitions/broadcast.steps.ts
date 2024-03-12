import { DataTable, Then, When } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { PrivateChannelOnAddContextListenerAgentRequest, PrivateChannelOnUnsubscribeAgentRequest, PrivateChannelBroadcastAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { matchData } from '../support/matching';
import { contextMap, createMeta } from './generic.steps';
import expect from "expect";


When('{string} adds a context listener on {string} with type {string}', function (this: CustomWorld, app: string, channelId: string, contextType: string) {
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

When('{string} removes context listener on {string} with type {string}', function (this: CustomWorld, app: string, channelId: string, contextType: string) {
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

When('{string} broadcasts {string} on {string}', function (this: CustomWorld, app: string, contextType: string, channelId: string) {
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

Then('messaging will have outgoing posts', function (this: CustomWorld, dt: DataTable) {
  // just take the last few posts and match those
  const matching = dt.rows().length
  var toUse = this.sc?.postedMessages
  if (toUse.length > matching) {
    toUse = toUse.slice(toUse.length - matching, toUse.length)
  }
  matchData(this, toUse, dt)
})

Then('messaging will have {int} posts', function (this: CustomWorld, count: number) {
  expect(this.sc.postedMessages.length).toEqual(count)
})