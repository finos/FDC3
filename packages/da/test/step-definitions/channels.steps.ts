import { DataTable, Given, Then, When } from '@cucumber/cucumber'
import { Context } from '@finos/fdc3';
import { handleResolve, matchData } from '../support/matching';
import { CustomWorld } from '../world/index';
import { AgentRequestMessage, RequestMessageType } from '@finos/fdc3/dist/bridging/BridgingTypes';

const contextMap : Record<string, any> = {
  "fdc3.instrument": {
    "type": "fdc3.instrument",
    "name": "Apple",
    "id" : {
        "ticker": "AAPL"
    }
  }
}

Given('{string} is a {string} context', function(this: CustomWorld, field: string, type: string) {
  this.props[field] = contextMap[type];  
})

Given('{string} is a {string} broadcastRequest message on channel {string}', function(this: CustomWorld, field: string, type: string, channel: string) {
  const message = {
    meta: this.messaging!!.createMeta(),
    payload: {
      "channelId" : channel,
      "context" : contextMap[type]
    },
    type: "broadcastRequest"
  }
  
  this.props[field] = message;  
})


Given('{string} pipes context to {string}', function(this: CustomWorld, contextHandlerName: string, field: string) {
  this.props[field] = []
  this.props[contextHandlerName] = (context: Context) => {
    this.props[field].push(context)
  }
})

When('messaging receives a {string} with payload:', function (this: CustomWorld, type: RequestMessageType, docString: string) {
  const message : AgentRequestMessage = {
    meta: this.messaging!!.createMeta(),
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


Then('messaging will have posts', function(this: CustomWorld, dt: DataTable) {
  matchData(this.messaging?.allPosts!!, dt, this.log)
})