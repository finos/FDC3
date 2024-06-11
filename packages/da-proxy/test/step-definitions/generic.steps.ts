import { TestMessaging } from '../support/TestMessaging';
import { createDefaultChannels } from '../support/DefaultUserChannels';
import { DataTable, Given, Then, When } from '@cucumber/cucumber'
import { expect } from 'expect';
import { doesRowMatch, handleResolve, matchData } from '../support/matching';
import { CustomWorld } from '../world/index';
import { BasicDesktopAgent, DefaultAppSupport, DefaultChannelSupport, DefaultIntentSupport, DefaultHandshakeSupport } from '../../src';
import { IntentResolver, SingleAppIntent } from '@kite9/fdc3-common';
import { AppIntent, IntentResult } from '@finos/fdc3';

/**
     * This super-simple intent resolver just resolves to the first
     * intent / app in the list.
     */
class SimpleIntentResolver implements IntentResolver {

    cw: CustomWorld

    constructor(cw: CustomWorld) {
        this.cw = cw;
    }

    async intentChosen(ir: IntentResult): Promise<IntentResult> {
        this.cw.props['intent-result'] = ir
        return ir
    }

    async chooseIntent(appIntents: AppIntent[]): Promise<SingleAppIntent> {
        const out = {
            intent: appIntents[0].intent,
            chosenApp: appIntents[0].apps[0]
        }

        this.cw.props['intent-resolution'] = out
        return out
    }
}

export const CHANNEL_STATE = 'CHANNEL_STATE'



Given('A Desktop Agent in {string}', async function (this: CustomWorld, field: string) {

    if (!this.messaging) {
        this.messaging = new TestMessaging(this.props[CHANNEL_STATE]);
    }

    const version = "2.0"
    const cs = new DefaultChannelSupport(this.messaging, createDefaultChannels(this.messaging), null)
    const hs = new DefaultHandshakeSupport(this.messaging, [version], cs)
    const is = new DefaultIntentSupport(this.messaging, new SimpleIntentResolver(this))
    const as = new DefaultAppSupport(this.messaging, {
        appId: "Test App Id",
        desktopAgent: "Test DA",
        instanceId: "123-ABC"
    }, 'cucumber-desktop-agent')

    const da = new BasicDesktopAgent(hs, cs, is, as, version)
    await da.connect()

    this.props[field] = da
    this.props['result'] = null
})

When('I call {string} with {string}', async function (this: CustomWorld, field: string, fnName: string) {
    try {
        const fn = this.props[field][fnName];
        const result = await fn.call(this.props[field])
        this.props['result'] = result;
    } catch (error) {
        this.props['result'] = error
    }
})

When('I call {string} with {string} with parameter {string}', async function (this: CustomWorld, field: string, fnName: string, param: string) {
    try {
        const fn = this.props[field][fnName];
        const result = await fn.call(this.props[field], handleResolve(param, this))
        this.props['result'] = result;
    } catch (error) {
        this.props['result'] = error
    }
})

When('I call {string} with {string} with parameters {string} and {string}', async function (this: CustomWorld, field: string, fnName: string, param1: string, param2: string) {
    try {
        const fn = this.props[field][fnName];
        const result = await fn.call(this.props[field], handleResolve(param1, this), handleResolve(param2, this))
        this.props['result'] = result;
    } catch (error) {
        this.props['result'] = error
    }
});

When('I call {string} with {string} with parameters {string} and {string} and {string}', async function (this: CustomWorld, field: string, fnName: string, param1: string, param2: string, param3: string) {
    try {
        const fn = this.props[field][fnName];
        const result = await fn.call(this.props[field], handleResolve(param1, this), handleResolve(param2, this), handleResolve(param3, this))
        this.props['result'] = result;
    } catch (error) {
        this.props['result'] = error
    }
});

When('I refer to {string} as {string}', async function (this: CustomWorld, from: string, to: string) {
    this.props[to] = this.props[from];
})

Then('{string} is an array of objects with the following contents', function (this: CustomWorld, field: string, dt: DataTable) {
    matchData(this, handleResolve(field, this), dt)
});

Then('{string} is an array of strings with the following values', function (this: CustomWorld, field: string, dt: DataTable) {
    const values = this.props[field].map((s: string) => { return { "value": s } })
    matchData(this, values, dt)
});

Then('{string} is an object with the following contents', function (this: CustomWorld, field: string, params: DataTable) {
    const table = params.hashes()
    expect(doesRowMatch(this, table[0], handleResolve(field, this))).toBeTruthy();
});

Then('{string} is null', function (this: CustomWorld, field: string) {
    expect(handleResolve(field, this)).toBeNull()
})

Then('{string} is undefined', function (this: CustomWorld, field: string) {
    expect(handleResolve(field, this)).toBeUndefined()
})

Then('{string} is empty', function (this: CustomWorld, field: string) {
    expect(handleResolve(field, this)).toHaveLength(0)
})

Then('{string} is {string}', function (this: CustomWorld, field: string, expected: string) {
    const fVal = handleResolve(field, this)
    const eVal = handleResolve(expected, this)
    expect("" + fVal).toEqual("" + eVal)
})

Then('{string} is an error with message {string}', function (this: CustomWorld, field: string, errorType: string) {
    expect(handleResolve(field, this)['message']).toBe(errorType)
})

Given('{string} is a invocation counter into {string}', function (this: CustomWorld, handlerName: string, field: string) {
    this.props[handlerName] = () => {
        var amount: number = this.props[field]
        amount++;
        this.props[field] = amount
    }
    this.props[field] = 0;
})