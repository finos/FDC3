import { Given } from '@cucumber/cucumber'
import { CustomWorld } from '../world/index';
import { handleResolve } from '../support/matching';
import { RaiseIntentAgentRequest } from '@finos/fdc3/dist/bridging/BridgingTypes';
import { Context, ContextMetadata } from '@finos/fdc3';

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

Given('{string} is a raiseIntentRequest message with intent {string} and context {string}', function (this: CustomWorld, field: string, intent: string, context: string) {
    const msg : RaiseIntentAgentRequest = {
        type: 'raiseIntentRequest',
        meta: {
            requestUuid: this.messaging?.createUUID()!!,
            timestamp: new Date(),
            destination: {
                desktopAgent: '',
                appId: ''
            },
            source: {
                appId: 'something'
            }
        },
        payload: {
            app: {
                appId: 'some-app-id',
                desktopAgent: "some-desktop-agent"
            },
            context: handleResolve(context, this),
            intent
        }
    }

    this.props[field] = msg
})

Given('{string} pipes intent to {string}', function(this: CustomWorld, intentHandlerName: string, field: string) {
    this.props[field] = []
    this.props[intentHandlerName] = (context: Context, metadata: ContextMetadata) => {
      this.props[field].push({
        context,
        metadata
      })
    }
  })