import { Given } from '@cucumber/cucumber'
import { CustomWorld } from '../world/index';

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