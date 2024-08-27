import { DataTable, Given, Then, When } from '@cucumber/cucumber'
import { Context } from '@finos/fdc3';
import { handleResolve, matchData } from '@kite9/testing';
import { CustomWorld } from '../world/index';
import { BroadcastEvent, AgentResponseMessage, ResponseMessageType, PrivateChannelOnUnsubscribeEvent, PrivateChannelOnDisconnectEvent } from '@kite9/fdc3-common'
import { CHANNEL_STATE } from '@kite9/testing';

const contextMap: Record<string, any> = {
  "fdc3.instrument": {
    "type": "fdc3.instrument",
    "name": "Apple",
    "id": {
      "ticker": "AAPL"
    }
  },
  "fdc3.country": {
    "type": "fdc3.country",
    "name": "Sweden",
    "id": {
      "COUNTRY_ISOALPHA2": "SE",
      "COUNTRY_ISOALPHA3": "SWE",
    }
  },
  "fdc3.unsupported": {
    "type": "fdc3.unsupported",
    "bogus": true
  }
}

Given('{string} is a {string} context', function (this: CustomWorld, field: string, type: string) {
  this.props[field] = contextMap[type];
})

Given('{string} is a {string} message on channel {string} with context {string}', function (this: CustomWorld, field: string, type: string, channel: string, context: string) {
  const message = {
    meta: {
      ...this.messaging!!.createEventMeta(),
    },
    payload: {
      "channelId": handleResolve(channel, this),
      "context": contextMap[context]
    },
    type: type
  } as BroadcastEvent

  this.props[field] = message;
})

Given('{string} is a {string} message on channel {string}', function (this: CustomWorld, field: string, type: string, channel: string) {
  const message = {
    meta: this.messaging!!.createEventMeta(),
    payload: {
      privateChannelId: handleResolve(channel, this),
    },
    type
  } as PrivateChannelOnDisconnectEvent

  this.props[field] = message;
})

Given('{string} is a {string} message on channel {string} with listenerType as {string}', function (this: CustomWorld, field: string, type: string, channel: string, listenerType: string) {
  const message = {
    meta: this.messaging!!.createMeta(),
    payload: {
      "channelId": handleResolve(channel, this),
      listenerType
    },
    type
  }

  this.props[field] = message;
})

Given('{string} is a {string} message on channel {string} with contextType as {string}', function (this: CustomWorld, field: string, type: string, channel: string, contextType: string) {
  const message = {
    meta: this.messaging!!.createEventMeta(),
    payload: {
      privateChannelId: handleResolve(channel, this),
      contextType
    },
    type
  } as PrivateChannelOnUnsubscribeEvent

  this.props[field] = message;
})

Given('{string} pipes types to {string}', function (this: CustomWorld, typeHandlerName: string, field: string) {
  this.props[field] = []
  this.props[typeHandlerName] = (s?: string) => {
    this.props[field].push(s)
  }
})

Given('{string} pipes context to {string}', function (this: CustomWorld, contextHandlerName: string, field: string) {
  this.props[field] = []
  this.props[contextHandlerName] = (context: Context) => {
    this.props[field].push(context)
  }
})

When('messaging receives a {string} with payload:', function (this: CustomWorld, type: ResponseMessageType, docString: string) {
  const message: AgentResponseMessage = {
    meta: this.messaging!!.createResponseMeta(),
    payload: JSON.parse(docString),
    type
  }

  this.log(`Sending: ${JSON.stringify(message)}`)
  this.messaging!!.receive(message, this.log);
});

When('messaging receives {string}', function (this: CustomWorld, field: string) {
  const message = handleResolve(field, this)
  this.log(`Sending: ${JSON.stringify(message)}`)
  this.messaging!!.receive(message, this.log);
});


Then('messaging will have posts', function (this: CustomWorld, dt: DataTable) {
  // just take the last few posts and match those
  const matching = dt.rows().length
  var toUse = this.messaging?.allPosts!!
  if (toUse.length > matching) {
    toUse = toUse.slice(toUse.length - matching, toUse.length)
  }
  matchData(this, toUse, dt)
})


Given("channel {string} has context {string}", function (this: CustomWorld, channel: string, context: string) {
  const ctxObject = handleResolve(context, this)
  const state = this.props[CHANNEL_STATE] ?? {}
  this.props[CHANNEL_STATE] = state

  const cs = state[channel] ?? []
  cs.push(ctxObject)
  state[channel] = cs
})

Given('User Channels one, two and three', function (this: CustomWorld) {
  this.props[CHANNEL_STATE] = {
    "one": [],
    "two": [],
    "three": []
  }
});