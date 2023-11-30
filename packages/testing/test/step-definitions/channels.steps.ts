import { Given, Then, When } from '@cucumber/cucumber'
import { Context } from '@finos/fdc3';

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


