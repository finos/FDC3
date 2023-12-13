import { TestMessaging } from '../support/TestMessaging.js';
import { createDefaultChannels } from '../support/DefaultUserChannels.js';
import { BasicDesktopAgent } from 'da';
import { DefaultChannelSupport } from 'da';
import { DefaultIntentSupport } from 'da';
import { DefaultAppSupport } from 'da'
import { DataTable, Given, Then, When } from '@cucumber/cucumber'
import expect from 'expect';
import { doesRowMatch, handleResolve, indexOf } from '../support/matching.js';

Given('A Desktop Agent in {string}', function (field: string) {

    if (!this.messaging) {
        this.messaging = new TestMessaging();
    }

    this[field] = new BasicDesktopAgent(
        new DefaultChannelSupport(this.messaging, createDefaultChannels(this.messaging), null),
        new DefaultIntentSupport(),
        new DefaultAppSupport(this.messaging, {
            appId: "Test App Id",
            desktopAgent: "Test DA",
            instanceId: "123-ABC"
        }),
        "2.0",
        "cucumber-provider"
    )

    this.result = null
})

When('I call {string} with {string}', async function (field: string, fnName: string) {
    const fn = this[field][fnName];
    const result = await fn.call(this[field])
    if (result) {
        this.result = result;
    }
})

When('I call {string} with {string} with parameter {string}', async function (field: string, fnName: string, param: string) {
    const fn = this[field][fnName];
    const result = await fn.call(this[field], handleResolve(param, this))
    if (result) {
        this.result = result;
    }
})

When('I call {string} with {string} with parameters {string} and {string}', async function (field: string, fnName: string, param1: string, param2: string) {
    const fn = this[field][fnName];
    const result = await fn.call(this[field], handleResolve(param1, this), handleResolve(param2, this))
    if (result) {
        this.result = result;
    }
});

Then('{string} is an array of objects with the following contents', function (field: string, dt: DataTable) {
    const tableData = dt.hashes();
    const rowCount = tableData.length

    var resultCopy = JSON.parse(JSON.stringify(this[field])) as any[];
    this.log(`result ${JSON.stringify(resultCopy)} length ${resultCopy.length}`)
    expect(resultCopy).toHaveLength(rowCount);

    resultCopy = resultCopy.filter(rr => {
        const matchingRow = indexOf(tableData, rr);
        if (matchingRow != -1) {
            return false
        } else {
            this.log(`Couldn't match row: ${JSON.stringify(rr)}`)
            return true
        }
    })

    expect(resultCopy).toHaveLength(0)
});

Then('{string} is an object with the following contents', function (field: string, params: DataTable) {
    const table = params.hashes()
    expect(doesRowMatch(table[0], this[field])).toBeTruthy();
});

Then('{string} is null', function (field) {
    expect(this[field]).toBeNull()
})

Then('{string} is empty', function (field) {
    expect(this[field]).toHaveLength(0)
})