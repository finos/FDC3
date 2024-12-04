import { Given } from '@cucumber/cucumber'
import { CustomWorld } from '../world/index';
import { handleResolve } from '@kite9/testing';
import { Context } from '@kite9/fdc3-context';
import { ContextMetadata, ResolveError } from '@kite9/fdc3-standard';
import { IntentEvent } from '@kite9/fdc3-schema/generated/api/BrowserTypes';

Given("app {string}", function (this: CustomWorld, appStr: string) {
    const [appId, instanceId] = appStr.split("/")
    const app = { appId, instanceId }
    this.messaging?.addAppIntentDetail({
        app
    })
    this.props[instanceId] = app
})

Given("app {string} resolves intent {string}", function (this: CustomWorld, appStr: string, intent: string) {
    const [appId, instanceId] = appStr.split("/")
    const app = { appId, instanceId }
    this.messaging?.addAppIntentDetail({
        app,
        intent,
    })
    this.props[instanceId] = app
    this.props[appId] = {
        appId
    }
})

Given("app {string} resolves intent {string} with result type {string}", function (this: CustomWorld, appStr: string, intent: string, resultType: string) {
    const [appId, instanceId] = appStr.split("/")
    const app = { appId, instanceId }
    this.messaging?.addAppIntentDetail({
        app,
        intent,
        resultType
    })
    this.props[instanceId] = app
    this.props[appId] = {
        appId
    }
})

Given("app {string} resolves intent {string} with context {string}", function (this: CustomWorld, appStr: string, intent: string, context: string) {
    const [appId, instanceId] = appStr.split("/")
    const app = { appId, instanceId }
    this.messaging?.addAppIntentDetail({
        app,
        intent,
        context
    })
    this.props[instanceId] = app
    this.props[appId] = {
        appId
    }
})

Given("app {string} resolves intent {string} with context {string} and result type {string}", function (this: CustomWorld, appStr: string, intent: string, context: string, resultType: string) {
    const [appId, instanceId] = appStr.split("/")
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


Given("Raise Intent will throw a {string} error", function (this: CustomWorld, error: ResolveError) {
    this.messaging?.setIntentResult({
        error
    })
})

Given("Raise Intent will return no result", function (this: CustomWorld) {
    this.messaging?.setIntentResult({})
})


Given("Raise Intent will timeout", function (this: CustomWorld) {
    this.messaging?.setIntentResult({
        timeout: true
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

Given('{string} is a intentEvent message with intent {string} and context {string}', function (this: CustomWorld, field: string, intent: string, context: string) {
    const msg: IntentEvent = {
        type: 'intentEvent',
        meta: {
            eventUuid: this.messaging!.createUUID(),
            timestamp: new Date(),
        },
        payload: {
            originatingApp: {
                appId: 'some-app-id',
                desktopAgent: "some-desktop-agent"
            },
            context: handleResolve(context, this),
            intent,
            raiseIntentRequestUuid: 'request-id'
        }
    }

    this.props[field] = msg
})

Given('{string} pipes intent to {string}', function (this: CustomWorld, intentHandlerName: string, field: string) {
    this.props[field] = []
    this.props[intentHandlerName] = (context: Context, metadata: ContextMetadata) => {
        this.props[field].push({
            context,
            metadata
        })
    }
})

Given('{string} returns a context item', function (this: CustomWorld, intentHandlerName: string) {
    this.props[intentHandlerName] = async () => {
        return {
            type: "fdc3.returned-intent",
            id: {
                in: "one",
                out: "two"
            }
        }
    }
})

Given('{string} returns a channel', function (this: CustomWorld, intentHandlerName: string) {
    this.props[intentHandlerName] = async () => {
        return {
            type: 'private',
            id: 'some-channel-id',
            displayMetadata: {
                color: "ochre",
                name: "Some Channel"
            }
        }
    }
})


Given('{string} returns a void promise', function (this: CustomWorld, intentHandlerName: string) {
    this.props[intentHandlerName] = async () => {
        return null
    }
})