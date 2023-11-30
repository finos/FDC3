import { TestMessaging } from '../support/TestMessaging';
import { createDefaultChannels } from '../support/DefaultUserChannels';
import { BasicDesktopAgent } from 'da';
import { DefaultChannelSupport } from 'da';
import { DefaultIntentSupport } from 'da';
import { DefaultAppSupport } from 'da'
import { Given, Then, When, World, setWorldConstructor } from '@cucumber/cucumber'
import expect from 'expect';
import { JSONPath } from 'jsonpath-plus'
import { doesRowMatch, handleResolve, indexOf } from '../support/matching';
import { Context } from '@finos/fdc3';


Given('A Basic API Setup', function() {

  this.messaging = new TestMessaging()
  this.defaultChannels = createDefaultChannels(this.messaging);

  this.desktopAgent = new BasicDesktopAgent(
      new DefaultChannelSupport(this.messaging, this.defaultChannels, null),
      new DefaultIntentSupport(),
      new DefaultAppSupport(),
      "2.0",
      "cucumber-provider"
  )

  this.result = null
})

Given('{string} pipes context to the result', function(contextHandlerName) {
  this[contextHandlerName] = (context: Context) => {
    if (!Array.isArray(this.result)) {
      this.result = [];
    }
    this.result.push(context)
  }
})

When('I call the API {string}', async function(fnName: string) {
    const fn = this.desktopAgent[fnName];
    const result = await fn.call(this.desktopAgent)
    if (result) {
      this.result = result;
    }
})

When('I call the API {string} with parameter {string}', async function(fnName: string, param: string) {
  const fn = this.desktopAgent[fnName];
  const result = await fn.call(this.desktopAgent, handleResolve(param, this))
  if (result) {
    this.result = result;
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

When('I call the API {string} with parameters {string} and {string}', async function (fnName: string, param1: string, param2: string) {
  const fn = this.desktopAgent[fnName];
  const result = await fn.call(this.desktopAgent, handleResolve(param1, this), handleResolve(param2, this))
  if (result) {
    this.result = result;
  }
});

Then('the result is an array of objects with the following contents', function(params) {
  const table = params.rawTable as string[][]
  const headers = table.splice(0,1)[0]
  const rowCount = table.length
  this.log(`headers ${JSON.stringify(headers)} body ${JSON.stringify(table)} rows ${rowCount}`)

  var resultCopy = JSON.parse(JSON.stringify(this.result)) as any[];
  this.log(`result ${JSON.stringify(resultCopy)} length ${resultCopy.length}`)
  expect(resultCopy).toHaveLength(rowCount);

  resultCopy = resultCopy.filter(rr => {
    const matchingRow = indexOf(table, headers, rr);
    if (matchingRow != -1) {
      return false
    } else {
      this.log(`Couldn't match row: ${JSON.stringify(rr)}`)
      return true
    }
  })

  expect(resultCopy).toHaveLength(0)
});

Then('the result is an object with the following contents', function (params) {
  const table = params.rawTable as string[][]
  const headers = table.splice(0,1)[0]
  const rowCount = table.length
  this.log(`headers ${JSON.stringify(headers)} body ${JSON.stringify(table)} rows ${rowCount}`)

  expect(doesRowMatch(table[0], headers, this.result)).toBeTruthy();
});

Then('the result is null', function() {
  expect(this.result).toBeNull()
})

