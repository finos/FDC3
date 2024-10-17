import { Given, Then } from "@cucumber/cucumber";
import { CustomWorld } from "../world";
import { HeartbeatAcknowledgementRequest } from "@kite9/fdc3-schema/generated/api/BrowserTypes";
import { createMeta } from "./generic.steps";

Given('{string} sends a heartbeat response to eventUuid {string}', function (this: CustomWorld, appStr: string, eventUuid: string) {
    const meta = createMeta(this, appStr)
    const uuid = this.sc.getInstanceUUID(meta.source)!!

    const message = {
        meta,
        payload: {
            heartbeatEventUuid: eventUuid
        },
        type: 'heartbeatAcknowledgementRequest'
    } as HeartbeatAcknowledgementRequest

    this.server.receive(message, uuid)
});

Then('I test the liveness of {string}', async function (this: CustomWorld, appStr: string) {
    const out = await this.sc.isAppConnected(createMeta(this, appStr).source)
    this.props["result"] = out
})