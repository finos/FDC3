import { DataTable,Then, When } from '@cucumber/cucumber'
import { CustomWorld } from '../world';
import { PrivateChannelOnAddContextListenerAgentRequest, PrivateChannelOnUnsubscribeAgentRequest, PrivateChannelBroadcastAgentRequest } from "@finos/fdc3/dist/bridging/BridgingTypes";
import { matchData } from '../support/matching';


function createMeta(cw: CustomWorld, appStr: string) {
    const [ appId, instanceId ] = appStr.split("/")
    const app = { appId, instanceId }

    return {
        "requestUuid": cw.sc.createUUID(),
        "timestamp": new Date(),
        "source": app
    }
}

const contextMap : Record<string, any> = {
    "fdc3.instrument": {
      "type": "fdc3.instrument",
      "name": "Apple",
      "id" : {
          "ticker": "AAPL"
      }
    },
    "fdc3.country": {
      "type": "fdc3.country",
      "name": "Sweden",
      "id": {
        "COUNTRY_ISOALPHA2": "SE",
        "COUNTRY_ISOALPHA3": "SWE",
      }
    },
    "fdc3.unsupported" : {
      "type": "fdc3.unsupported",
      "bogus": true
    }
  }


When('{string} adds a context listener on {string} with type {string}',  function (this: CustomWorld, app: string, channelId: string, contextType: string) {
    const message = {
        meta: createMeta(this, app),
        payload: {
          channelId,
          contextType
        },
        type: 'PrivateChannel.onAddContextListener'
    } as PrivateChannelOnAddContextListenerAgentRequest

    this.server.receive(message)
})

When('{string} removes context listener on {string} with type {string}', function (this: CustomWorld, app: string, channelId: string, contextType: string) {
    const message = {
        meta: createMeta(this, app),
        payload: {
          channelId,
          contextType
        },
        type: 'PrivateChannel.onUnsubscribe'
    } as PrivateChannelOnUnsubscribeAgentRequest

    this.server.receive(message)
})

When('{string} broadcasts {string} on {string}', function (this: CustomWorld, app: string, contextType: string, channelId: string) {
    const message = {
        meta: createMeta(this, app),
        payload: {
          channelId,
          context: contextMap[contextType]
        },
        type: 'PrivateChannel.broadcast'
    } as PrivateChannelBroadcastAgentRequest

    this.server.receive(message)

})



Then('messaging will have outgoing posts', function(this: CustomWorld, dt: DataTable) {
    matchData(this, this.sc.postedMessages, dt)
})