"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const matching_1 = require("../support/matching");
const contextMap = {
    "fdc3.instrument": {
        "type": "fdc3.instrument",
        "name": "Apple",
        "id": {
            "ticker": "AAPL"
        }
    }
};
(0, cucumber_1.Given)('{string} is a {string} broadcastRequest message on channel {string}', function (field, type, channel) {
    const message = {
        meta: this.messaging.createMeta(),
        payload: {
            "channelId": channel,
            "context": contextMap[type]
        },
        type: "broadcastRequest"
    };
    this[field] = message;
});
(0, cucumber_1.Given)('{string} pipes context to {string}', function (contextHandlerName, field) {
    this[field] = [];
    this[contextHandlerName] = (context) => {
        this[field].push(context);
    };
});
(0, cucumber_1.When)('messaging receives a {string} with payload:', function (type, docString) {
    const message = {
        meta: this.messaging.createMeta(),
        payload: JSON.parse(docString),
        type
    };
    this.log(`Sending: ${JSON.stringify(message)}`);
    this.messaging.receive(message, this.log);
});
(0, cucumber_1.When)('messaging receives {string}', function (field) {
    const message = (0, matching_1.handleResolve)(field, this);
    this.log(`Sending: ${JSON.stringify(message)}`);
    this.messaging.receive(message, this.log);
});
//# sourceMappingURL=channels.steps.js.map