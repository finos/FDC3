import { Given } from '@cucumber/cucumber'
import { CustomWorld } from '../world/index';
import { handleResolve } from '../support/matching';

Given("app {string} resolves intent {string}", function (this: CustomWorld, appStr: string, intent: string) {
    const [ appId, instanceId ] = appStr.split("/")
    const app = { appId, instanceId }
    this.messaging?.addAppIntentDetail({
        app,
        intent,
    })
    this.props[instanceId] = app
})

Given("app {string} resolves intent {string} with result type {string}", function (this: CustomWorld, appStr: string, intent: string, resultType: string) {
    const [ appId, instanceId ] = appStr.split("/")
    const app = { appId, instanceId }
    this.messaging?.addAppIntentDetail({
        app,
        intent,
        resultType
    })
    this.props[instanceId] = app
})

Given("app {string} resolves intent {string} with context {string}", function (this: CustomWorld, appStr: string, intent: string, context: string) {
    const [ appId, instanceId ] = appStr.split("/")
    const app = { appId, instanceId }
    this.messaging?.addAppIntentDetail({
        app,
        intent,
        context
    })
    this.props[instanceId] = app
})

Given("app {string} resolves intent {string} with context {string} and result type {string}", function (this: CustomWorld, appStr: string, intent: string, context: string, resultType: string) {
    const [ appId, instanceId ] = appStr.split("/")
    const app = { appId, instanceId }
    this.messaging?.addAppIntentDetail({
        app,
        intent,
        context,
        resultType
    })
    this.props[instanceId] = app
})

Given("Raise Intent will return a context of {string}", function (this: CustomWorld, result: string) {
    this.messaging?.setIntentResult({
        context: handleResolve(result, this)
    })
})

Given("Raise Intent will return an app channel", function (this: CustomWorld) {
    this.messaging?.setIntentResult({
        channel: {
            type: 'app',
            id: 'result-channel',
            displayMetadata: {
                color: "purple",
                name: "Result Channel"
            }
        }
    })
})

Given('Raise Intent will return a user channel', function (this: CustomWorld) {
    this.messaging?.setIntentResult({
        channel: {
            type: 'user',
            id: 'result-channel',
            displayMetadata: {
                color: "purple",
                name: "Result Channel"
            }
        }
    })
})

Given("Raise Intent will return a private channel", function (this: CustomWorld) {
    this.messaging?.setIntentResult({
        channel: {
            type: 'private',
            id: 'result-channel',
            displayMetadata: {
                color: "purple",
                name: "Result Channel"
            }
        }
    })
})

Given('{string} is a {string} message with intent {string} and context {string}', function (string, string2, string3, string4) {