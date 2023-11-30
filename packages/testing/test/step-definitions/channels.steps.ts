import { TestMessaging } from '../support/TestMessaging';
import { createDefaultChannels } from '../support/DefaultUserChannels';
import { BasicDesktopAgent } from 'da';
import { DefaultChannelSupport } from 'da';
import { DefaultIntentSupport } from 'da';
import { DefaultAppSupport } from 'da'
import { Given, Then, When, World, setWorldConstructor } from '@cucumber/cucumber'
import expect from 'expect';
import { JSONPath } from 'jsonpath-plus'

// class CustomWorld extends World {  
//   constructor(options: any) {
//     super(options)
//   }
// }

// setWorldConstructor(CustomWorld)

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
})

When('I call the API {string}', async function(fnName: string) {

    const fn = this.desktopAgent[fnName];
    const result = await fn.call(this.desktopAgent)
    this.result = result;

})



Then('The result is an array of objects with the following contents', function(params) {
  const table = params.rawTable as string[][]
  const headers = table.splice(0,1)[0]
  const rowCount = table.length
  this.log(`headers ${JSON.stringify(headers)} body ${JSON.stringify(table)} rows ${rowCount}`)

  var resultCopy = JSON.parse(JSON.stringify(this.result)) as any[];

  this.log(`result ${JSON.stringify(resultCopy)} length ${resultCopy.length}`)

  
  function doesRowMatch(values: string[], headers: string[], data: any) : boolean {
    for(var i=0; i< headers.length; i++) {
      const found = JSONPath({path: headers[i], json: data})[0];
      const actual = values[i]
      if (found != actual) {
        return false;
      }
    }

    return true;
  }

  function indexOf(rows: string[][], headers: string[], data: any) : number {
    for (var i = 0; i< rows.length; i++) {
      if (doesRowMatch(rows[i], headers, data)) {
        return i;
      }
    }

    return -1;
  }

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