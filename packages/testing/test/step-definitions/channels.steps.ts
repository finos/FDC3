import { Given, Then, When } from '@cucumber/cucumber'
import { Context } from '@finos/fdc3';
import { handleResolve } from '../support/matching';

const contextMap : Record<string, any> = {
  "fdc3.instrument": {
    "type": "fdc3.instrument",
    "name": "Apple",
    "id" : {
        "ticker": "AAPL"
    }
  }
}

Given('{string} is a {string} broadcastRequest message on channel {string}', function(field: string, type: string, channel: string) {
  const message = {
    meta: this.messaging.createMeta(),
    payload: {
      "channelId" : channel,
      "context" : contextMap[type]
    },
    type: "broadcastRequest"
  }
  
  this[field] = message;  
})


Given('{string} pipes context to {string}', function(contextHandlerName, field) {
  this[field] = []
  this[contextHandlerName] = (context: Context) => {
    this[field].push(context)
  }
})

When('messaging receives a {string} with payload:', function (type, docString) {
  const message = {
    meta: this.messaging.createMeta(),
    payload: JSON.parse(docString),
    type
  }

  this.log(`Sending: ${JSON.stringify(message)}`)
  this.messaging.receive(message, this.log);
});

When('messaging receives {string}', function (field) {
  const message = handleResolve(field, this)
  this.log(`Sending: ${JSON.stringify(message)}`)
  this.messaging.receive(message, this.log);
});
